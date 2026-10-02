import express from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { isValidEmail } from '../middleware/validator.js';

const router = express.Router();

const generateToken = (admin) => {
  const secret = process.env.JWT_SECRET || 'kashif_celestial_tarot_super_secret_jwt_key_2026_xyz981';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { id: admin._id, username: admin.username, role: admin.role },
    secret,
    { expiresIn }
  );
};

// Non-production test helper to reset in-memory state for automated security suites
if (process.env.NODE_ENV !== 'production') {
  router.post('/test-reset', (req, res) => {
    Admin.resetMemory();
    return res.json({ success: true, message: 'Test memory store reset.' });
  });
}

// 1. One-time Superadmin Provisioning
// Strict Rule: Can ONLY be run ONCE. If any admin exists, permanently rejects with 403 Forbidden.
router.post('/setup-superadmin', async (req, res) => {
  try {
    const existingCount = await Admin.countDocuments();
    if (existingCount > 0) {
      return res.status(403).json({
        success: false,
        error: 'Security Lockout: A Superadmin account is already provisioned. Initial setup is permanently locked.',
      });
    }

    const { username, email, password, setupKey } = req.body;

    // Validate Initialization Secret Key
    const expectedKey = process.env.SUPERADMIN_INITIALIZATION_KEY || 'KASHIF_SACRED_SETUP_KEY_2026';
    if (!setupKey || setupKey !== expectedKey) {
      return res.status(401).json({
        success: false,
        error: 'Security Authorization Failed: Invalid Superadmin Initialization Key.',
      });
    }

    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Username must be at least 3 characters.',
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Valid email address is required.',
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long with robust entropy.',
      });
    }

    const newAdmin = await Admin.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'superadmin',
      isActive: true,
    });

    const token = generateToken(newAdmin);

    return res.status(201).json({
      success: true,
      message: 'Superadmin provisioned successfully. Initial setup is now permanently closed.',
      token,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error('Superadmin setup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during superadmin provisioning.',
    });
  }
});

// 2. Check Setup Status (Public)
router.get('/setup-status', async (req, res) => {
  try {
    const existingCount = await Admin.countDocuments();
    return res.json({
      success: true,
      isSetupComplete: existingCount > 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// 3. Superadmin Login (Rate-limited)
router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both username/email and password.',
      });
    }

    const isEmail = usernameOrEmail.includes('@');
    const admin = await Admin.findOne(
      isEmail 
        ? { email: usernameOrEmail.trim().toLowerCase() } 
        : { username: usernameOrEmail.trim() }
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Access denied.',
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account deactivated. Please contact system administrator.',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Access denied.',
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin);

    return res.json({
      success: true,
      message: 'Authentication successful. Welcome to Kashif Sanctuary Admin.',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed due to an internal server error.',
    });
  }
});

// 4. Verify & Fetch Authenticated Superadmin Profile
router.get('/me', protectAdmin, async (req, res) => {
  return res.json({
    success: true,
    admin: {
      id: req.admin._id,
      username: req.admin.username,
      email: req.admin.email,
      role: req.admin.role,
      lastLogin: req.admin.lastLogin,
    },
  });
});

export default router;
