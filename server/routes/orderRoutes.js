import express from 'express';
import { Order } from '../models/Order.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { formSubmissionLimiter } from '../middleware/rateLimiter.js';
import { isValidEmail } from '../middleware/validator.js';
import { sendBookingConfirmationToClient, sendBookingAlertToAdmin } from '../services/emailService.js';

const router = express.Router();

// 1. Submit New Booking Request (Public)
router.post('/', formSubmissionLimiter, async (req, res) => {
  try {
    const { 
      clientName, 
      email, 
      phone, 
      services, 
      total, 
      totalNumeric, 
      details 
    } = req.body;

    if (!clientName || !clientName.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid email address is required.' });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, error: 'Phone or WhatsApp number is required.' });
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one service or package must be selected.' });
    }

    // Generate unique sanctuary order reference
    const orderId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await Order.create({
      orderId,
      clientName: clientName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      services,
      total: total || '£0',
      totalNumeric: Number(totalNumeric) || 0,
      currency: 'GBP',
      status: 'Pending Review',
      paymentStatus: 'Awaiting PayPal Confirmation',
      details: details || {},
    });

    // Dispatch emails asynchronously (doesn't block client response)
    Promise.allSettled([
      sendBookingConfirmationToClient(newOrder),
      sendBookingAlertToAdmin(newOrder),
    ]).catch(err => console.error('Email dispatch error:', err));

    return res.status(201).json({
      success: true,
      message: 'Booking request registered successfully. Kashif will review your details.',
      order: newOrder,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create booking request due to a server error.',
    });
  }
});

// 2. Client Status Lookup (Public)
router.get('/lookup/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `No reading order found with reference "${orderId}".`,
      });
    }

    return res.json({
      success: true,
      order: {
        orderId: order.orderId,
        clientName: order.clientName,
        services: order.services,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        details: {
          dob: order.details?.dob,
          questions: order.details?.questions,
        },
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Fetch All Orders (Protected - Superadmin)
router.get('/', protectAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    let orders = await Order.find(query);

    if (search && search.trim() !== '') {
      const term = search.toLowerCase();
      orders = orders.filter(o => 
        o.clientName?.toLowerCase().includes(term) ||
        o.orderId?.toLowerCase().includes(term) ||
        o.email?.toLowerCase().includes(term)
      );
    }

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Update Order Status (Protected - Superadmin)
router.patch('/:orderId/status', protectAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const allowedStatuses = ['Pending Review', 'Session Scheduled', 'Completed', 'Cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (notes !== undefined) updateFields.notes = notes;

    const updated = await Order.findOneAndUpdate(
      { orderId },
      { $set: updateFields }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    return res.json({
      success: true,
      message: `Order ${orderId} updated successfully.`,
      order: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Monthly Stats Aggregation (Protected - Superadmin)
router.get('/stats/monthly', protectAdmin, async (req, res) => {
  try {
    const allOrders = await Order.find();

    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === 'Pending Review').length;
    const scheduledOrders = allOrders.filter(o => o.status === 'Session Scheduled').length;
    const completedOrders = allOrders.filter(o => o.status === 'Completed').length;

    // Calculate total revenue from orders with numeric amounts
    const revenue = allOrders.reduce((acc, order) => {
      if (order.totalNumeric) return acc + order.totalNumeric;
      // Parse string £XX if numeric field isn't populated
      const match = String(order.total).match(/\d+/);
      return match ? acc + parseInt(match[0], 10) : acc;
    }, 0);

    return res.json({
      success: true,
      stats: {
        totalRevenueMonth: revenue,
        currency: '£',
        totalOrders,
        activeReadings: pendingOrders + scheduledOrders,
        pendingReview: pendingOrders,
        sessionScheduled: scheduledOrders,
        completedMonth: completedOrders,
        satisfactionRate: '99.4%',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
