const mongoose = require('mongoose');

let mongodInstance = null;
let retryTimer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  const allowFallback = process.env.ALLOW_IN_MEMORY_DB === 'true' || process.env.NODE_ENV !== 'production';

  // 1. Attempt standard MongoDB Atlas connection first
  if (uri && !uri.includes('<username>') && !uri.includes('<password>')) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[MongoDB] Connected successfully to Atlas host: ${conn.connection.host}`);
      if (retryTimer) {
        clearInterval(retryTimer);
        retryTimer = null;
      }
      // Check and auto-seed if newly provisioned empty database
      await autoSeedIfEmpty();
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] Primary connection attempt failed (${err.message}).`);
    }
  }

  // 2. Graceful fallback for local development or testing
  if (allowFallback) {
    try {
      console.log('[MongoDB] Initializing in-memory MongoDB instance for development & testing...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Connected to in-memory MongoDB at: ${inMemoryUri}`);
      await autoSeedIfEmpty();
      return conn;
    } catch (fallbackErr) {
      console.warn(`[MongoDB] In-memory initialization notice: ${fallbackErr.message}`);
    }
  }

  // 3. Keep server alive and schedule background reconnection attempts
  console.warn('[MongoDB] Database is not connected yet. Waiting for valid MONGODB_URI configuration.');
  if (!retryTimer && uri && !uri.includes('<username>')) {
    retryTimer = setInterval(async () => {
      console.log('[MongoDB] Retrying database connection...');
      try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
        clearInterval(retryTimer);
        retryTimer = null;
        await autoSeedIfEmpty();
      } catch (e) {
        console.warn(`[MongoDB] Reconnection attempt failed: ${e.message}`);
      }
    }, 15000);
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const User = require('../models/User');
    const { seedDataCore } = require('../seed/seeder');
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('[MongoDB] Empty database detected. Auto-seeding 50 companies, 52 jobs, and 3 demo accounts...');
      await seedDataCore();
      console.log('[MongoDB] Auto-seeding completed successfully!');
    }
  } catch (err) {
    console.warn(`[MongoDB] Auto-seeding notice: ${err.message}`);
  }
};

const disconnectDB = async () => {
  try {
    if (retryTimer) {
      clearInterval(retryTimer);
      retryTimer = null;
    }
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
    console.log('[MongoDB] Disconnected successfully.');
  } catch (err) {
    console.error(`[MongoDB] Disconnect error: ${err.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
