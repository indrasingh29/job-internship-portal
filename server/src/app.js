const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const savedJobRoutes = require('./routes/savedJobRoutes');
const statsRoutes = require('./routes/statsRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');
const { requireDatabase } = require('./middleware/dbReadyMiddleware');

const isCorsOriginAllowed = (
  origin,
  nodeEnv = process.env.NODE_ENV,
  clientUrlEnv = process.env.CLIENT_URL
) => {
  // Non-browser requests (curl, server-to-server, health probes) send no Origin header
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/$/, '');
  const envOrigins = String(clientUrlEnv || '')
    .split(',')
    .map((u) => u.trim().replace(/\/$/, ''))
    .filter(Boolean);

  if (nodeEnv !== 'production') {
    const devOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      ...envOrigins
    ];
    return devOrigins.includes(normalizedOrigin);
  }

  // Production: strict whitelist only (no wildcard *.onrender.com or localhost)
  const prodOrigins = envOrigins.length > 0
    ? envOrigins
    : ['https://job-portal-web-8a3p.onrender.com'];

  return prodOrigins.includes(normalizedOrigin);
};

const app = express();

// Trust Render / reverse proxy headers (X-Forwarded-For) for accurate rate limiting
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet());

// Logging in non-production
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(cors({
  origin: (origin, callback) => {
    if (isCorsOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy'));
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

// API Routes (require connected database)
app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api/companies', requireDatabase, companyRoutes);
app.use('/api/jobs', requireDatabase, jobRoutes);
app.use('/api/applications', requireDatabase, applicationRoutes);
app.use('/api/saved-jobs', requireDatabase, savedJobRoutes);
app.use('/api/stats', requireDatabase, statsRoutes);
app.use('/api/admin', requireDatabase, adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

app.isCorsOriginAllowed = isCorsOriginAllowed;

module.exports = app;
