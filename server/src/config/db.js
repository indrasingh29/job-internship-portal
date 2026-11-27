const mongoose = require('mongoose');

let mongodInstance = null;
let retryTimer = null;

/**
 * In production, never silently fall back to an ephemeral in-memory database.
 */
const isInMemoryFallbackAllowed = (env = process.env) => {
  if (env.NODE_ENV === 'production') {
    return false;
  }
  return env.ALLOW_IN_MEMORY_DB === 'true' || env.NODE_ENV !== 'production';
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  const allowFallback = isInMemoryFallbackAllowed();
  const hasValidUri = Boolean(uri && !uri.includes('<username>') && !uri.includes('<password>'));

  // 1. Attempt MongoDB Atlas connection first
  if (hasValidUri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000
      });
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
      if (retryTimer) {
        clearInterval(retryTimer);
        retryTimer = null;
      }
      await autoSeedIfEmpty();
      return conn;
    } catch (err) {
      console.error(`[MongoDB] Atlas connection attempt failed (${err.message}).`);
    }
  } else if (process.env.NODE_ENV === 'production') {
    console.error('[MongoDB] CRITICAL: MONGODB_URI is missing or contains placeholder credentials in production.');
  }

  // 2. Non-production in-memory fallback (strictly disabled in production)
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

  // 3. Keep process alive and schedule background Atlas reconnection attempts
  console.warn('[MongoDB] Waiting for persistent MongoDB connection. Scheduled background reconnection...');
  if (!retryTimer && hasValidUri) {
    retryTimer = setInterval(async () => {
      console.log('[MongoDB] Retrying connection to MongoDB Atlas...');
      try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 10000
        });
        console.log(`[MongoDB] Successfully reconnected to host: ${conn.connection.host}`);
        clearInterval(retryTimer);
        retryTimer = null;
        await autoSeedIfEmpty();
      } catch (e) {
        console.error(`[MongoDB] Atlas reconnection attempt failed: ${e.message}`);
      }
    }, 12000);
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const User = require('../models/User');
    const { seedDataCore } = require('../seed/seeder');
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('[MongoDB] Empty database detected. Auto-seeding initial companies, jobs, and demo accounts...');
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
      mongodInstance = null;
    }
    console.log('[MongoDB] Disconnected successfully.');
  } catch (err) {
    console.error(`[MongoDB] Disconnect error: ${err.message}`);
  }
};

module.exports = { connectDB, disconnectDB, isInMemoryFallbackAllowed };
