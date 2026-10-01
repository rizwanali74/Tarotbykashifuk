import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access Denied: No authorization token provided. Please log in to the Kashif Sanctuary Portal.',
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'kashif_celestial_tarot_super_secret_jwt_key_2026_xyz981';
    const decoded = jwt.verify(token, jwtSecret);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Security Alert: Admin session invalid or account has been revoked.',
      });
    }

    if (admin.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient privileges. Superadmin credentials required.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session Expired: Your authorization token has expired. Please sign in again.',
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Security Alert: Invalid or tampered token. Authentication failed.',
    });
  }
};
