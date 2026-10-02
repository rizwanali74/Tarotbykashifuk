import app from '../server.js';
import { connectDB } from '../config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();

    return app(req, res);
  } catch (error) {
    console.error('Vercel Function Error:', error);

    return res.status(500).json({
      success: false,
      error: 'Server initialization failed',
      message: process.env.NODE_ENV === 'development'
        ? error.message
        : undefined,
    });
  }
}