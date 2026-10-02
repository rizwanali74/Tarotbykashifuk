import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log('⚠️ [Database] MONGODB_URI not set in .env. Running with resilient local memory-store adapter.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ [MongoDB] Connection to remote cluster failed (${error.message}). Activating local memory-store fallback.`);
    return false;
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  type: isConnected ? 'MongoDB Cluster' : 'In-Memory Sanctuary Store'
});
