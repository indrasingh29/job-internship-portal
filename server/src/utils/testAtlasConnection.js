require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.error('Error: MONGODB_URI is not configured with real credentials in server/.env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas cluster...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });

    const host = conn.connection.host;
    const dbName = conn.connection.name;
    console.log(`[SUCCESS] Connected to MongoDB Atlas host: ${host}`);
    console.log(`[SUCCESS] Target Database: ${dbName}`);

    // Verify Read and Write operations on real database
    const TestCollection = mongoose.connection.collection('__atlas_ping_test');
    const testDoc = { ping: true, timestamp: new Date(), project: 'Job & Internship Portal' };
    await TestCollection.insertOne(testDoc);
    const readBack = await TestCollection.findOne({ _id: testDoc._id });
    if (!readBack) {
      throw new Error('Read verification failed on Atlas cluster.');
    }
    await TestCollection.deleteOne({ _id: testDoc._id });

    console.log('[SUCCESS] Read & write persistence verified on MongoDB Atlas!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(`[ERROR] Connection failed: ${err.message}`);
    process.exit(1);
  }
};

testConnection();
