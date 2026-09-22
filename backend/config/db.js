const mongoose = require('mongoose');
const env = require('./env');

/**
 * Connect to MongoDB Atlas. Call once at app startup.
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
