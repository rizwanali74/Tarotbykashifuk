import express from 'express';
import { ContactMessage } from '../models/ContactMessage.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { formSubmissionLimiter } from '../middleware/rateLimiter.js';
import { isValidEmail } from '../middleware/validator.js';
import { sendContactAutoReply, sendContactAlertToAdmin, sendTestEmail } from '../services/emailService.js';

const router = express.Router();

// 1. Submit Contact Message (Public)
router.post('/', formSubmissionLimiter, async (req, res) => {
  try {
    const { name, email, phone, serviceInterest, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required.' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid email address is required.' });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, error: 'Phone or WhatsApp number is required.' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message content cannot be blank.' });
    }

    const newContact = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      serviceInterest: serviceInterest || 'General Spiritual Enquiry',
      message: message.trim(),
    });

    // Send emails asynchronously
    Promise.allSettled([
      sendContactAutoReply(newContact),
      sendContactAlertToAdmin(newContact),
    ]).catch(err => console.error('Email error on contact submit:', err));

    return res.status(201).json({
      success: true,
      message: 'Enquiry received. Kashif will contact you shortly.',
      contact: newContact,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to process inquiry.' });
  }
});

// 2. Fetch Contact Inquiries (Protected - Superadmin)
router.get('/', protectAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find();
    return res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Test Email Diagnostics (Protected - Superadmin)
router.post('/test-email', protectAdmin, async (req, res) => {
  try {
    const targetEmail = req.body.email || req.admin.email;
    await sendTestEmail(targetEmail);
    return res.json({
      success: true,
      message: `Diagnostic test email dispatched to ${targetEmail}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Email transport diagnostic error: ${error.message}`,
    });
  }
});

export default router;
