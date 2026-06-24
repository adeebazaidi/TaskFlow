const mongoose = require('mongoose');

/**
 * Connects to MongoDB.
 * - If MONGO_URI is set to a real connection string, uses that (Atlas / local mongod).
 * - If MONGO_URI is missing or is the placeholder, spins up an in-process
 *   MongoDB Memory Server so the app runs with zero external DB setup.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || '';
  const isPlaceholder = !uri || uri.includes('<username>') || uri.includes('<password>');

  if (isPlaceholder) {
    try {
      // Lazy-require so it only loads when needed
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();

      await mongoose.connect(memUri);
      console.log('MongoDB Memory Server started (dev mode, data is not persisted)');
      console.log(`   URI: ${memUri}`);
    } catch (err) {
      console.error('Failed to start MongoDB Memory Server:', err.message);
      console.error('   Please set a valid MONGO_URI in backend/.env');
      process.exit(1);
    }
  } else {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
