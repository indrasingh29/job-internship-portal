const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const allowFallback = process.env.ALLOW_IN_MEMORY_DB === 'true' || process.env.NODE_ENV !== 'production';

  // Attempt standard MongoDB / Atlas connection first
  if (uri && !uri.includes('<username>')) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] Primary connection failed (${err.message}).`);
      if (!allowFallback) {
        console.error('[MongoDB] In-memory fallback is disabled. Exiting...');
        process.exit(1);
      }
    }
  }

  // Graceful fallback for local development or testing without live Atlas cluster
  if (allowFallback) {
    try {
      console.log('[MongoDB] Initializing local in-memory MongoDB instance for development & testing...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Connected to in-memory MongoDB at: ${inMemoryUri}`);
      return conn;
    } catch (fallbackErr) {
      console.error(`[MongoDB] In-memory initialization error: ${fallbackErr.message}`);
      process.exit(1);
    }
  }

  console.error('[MongoDB] No valid connection string provided and fallback disabled.');
  process.exit(1);
};

const disconnectDB = async () => {
  try {
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
