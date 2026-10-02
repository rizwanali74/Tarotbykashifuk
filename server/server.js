import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDB, getDBStatus } from './config/db.js';
import { sanitizeInput } from './middleware/validator.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import { uploadDirectory } from './config/uploads.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Security HTTP Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Allows flexible integration with Vite frontend
}));

// 2. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5175',

  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('CORS Policy: Request origin not allowed.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// 3. Body Parsing with Strict Payload Size Limits (Mitigates Memory Denial-of-Service)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use('/uploads', express.static(uploadDirectory, { dotfiles: 'deny', index: false }));

// 4. Input Sanitization against Script Injection & NoSQL Operators
app.use(sanitizeInput);

// 5. API Health & Status Diagnostic
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'online',
    service: 'Tarot By Kashif API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: getDBStatus(),
    environment: process.env.NODE_ENV || 'development',
    paypal: {
      mode: process.env.PAYPAL_MODE || 'sandbox',
      isConfigured: Boolean(process.env.PAYPAL_CLIENT_ID)
    },
    email: {
      isConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
    }
  });
});

// 6. Mount Core Application Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/catalog', catalogRoutes);

// 7. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}. Route not found on Tarot Sanctuary API.`,
  });
});

// 8. Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    success: false,
    error: isProd ? 'A secure internal server error occurred.' : err.message || 'Server Error',
  });
});

// 9. Server Initialization
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✨ [Tarot Server] Sanctuary API running securely on port ${PORT}`);
    console.log(`✨ [Tarot Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✨ [Tarot Server] Health Check: http://localhost:${PORT}/api/health`);
  });
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startServer().catch(err => {
    console.error('Fatal Server Boot Error:', err);
    process.exit(1);
  });
}

export default app;
