require('dotenv').config();
const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database (Atlas or local development in-memory)
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  Job & Internship Portal API Server Running`);
    console.log(`  Project: B.Tech CSE Minor Project (2026–27)`);
    console.log(`  Author:  Indra Singh Jeena`);
    console.log(`  Port:    ${PORT}`);
    console.log(`  Env:     ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });

  // Graceful shutdown handling
  const shutdown = async () => {
    console.log('\n[Server] Shutting down gracefully...');
    server.close(async () => {
      await disconnectDB();
      console.log('[Server] Process terminated cleanly.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
