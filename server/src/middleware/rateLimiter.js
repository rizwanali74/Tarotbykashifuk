import rateLimit from 'express-rate-limit';

// Strict rate limit on Auth endpoints to prevent credential stuffing & brute-force attacks
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 12, // Max 12 requests per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP. For security reasons, please try again in 15 minutes.',
  },
});

// Rate limiter on public form submissions (Contact & Booking intake)
export const formSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Max 30 requests per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Request volume limit reached. Please wait a few minutes before submitting another request.',
  },
});
