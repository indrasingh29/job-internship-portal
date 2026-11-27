const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const savedJobRoutes = require('./routes/savedJobRoutes');
const statsRoutes = require('./routes/statsRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Trust Render / reverse proxy headers (X-Forwarded-For) for accurate rate limiting
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet());

// Logging in non-production
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const mongoose = require('mongoose');

// CORS setup: Supports local Vite dev server and deployed frontend origin
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    try {
      const parsed = new URL(origin);
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes(origin.replace(/\/$/, '')) ||
        parsed.hostname.endsWith('.onrender.com') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
    } catch {
      // If URL parsing fails, continue to check raw origin
    }
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));

// Body parsers with safe limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply rate limiter to general API routes
app.use('/api', apiLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  const dbStateCode = mongoose.connection.readyState;
  const isConnected = dbStateCode === 1;
  const host = isConnected ? mongoose.connection.host : null;
  const isInMemory = isConnected && (host === '127.0.0.1' || host === 'localhost');

  let provider = 'Not Connected (Awaiting MongoDB)';
  let storage = 'none';
  if (isConnected) {
    provider = isInMemory ? 'In-Memory Instance (Testing/Fallback)' : 'MongoDB Atlas (Persistent Cloud)';
    storage = isInMemory ? 'ephemeral' : 'persistent';
  }

  res.json({
    status: 'online',
    database: {
      status: dbStates[dbStateCode] || 'unknown',
      connected: isConnected,
      host,
      provider,
      storage
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    service: 'JobPortal REST API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
