import express from 'express';
import { createPayPalOrder, capturePayPalOrder } from '../services/paypalService.js';
import { Order } from '../models/Order.js';

const router = express.Router();

// 1. Get Public PayPal Configuration
router.get('/config', (req, res) => {
  return res.json({
    success: true,
    clientId: process.env.PAYPAL_CLIENT_ID || 'sandbox_test_client_id',
    mode: process.env.PAYPAL_MODE || 'sandbox',
    currency: 'GBP',
    isConfigured: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_ID.trim() !== '')
  });
});

// 2. Create PayPal Order
router.post('/create-order', async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Order ID and amount in GBP are required.',
      });
    }

    const numericAmount = parseFloat(amount.toString().replace(/[^0-9.]/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment amount specified.',
      });
    }

    const paypalRes = await createPayPalOrder(orderId, numericAmount);

    // Save paypalOrderId to order if order exists
    if (paypalRes.paypalOrderId) {
      await Order.findOneAndUpdate(
        { orderId },
        { 
          $set: { 
            paypalOrderId: paypalRes.paypalOrderId,
            totalNumeric: numericAmount 
          } 
        }
      );
    }

    return res.json({
      success: true,
      paypalOrderId: paypalRes.paypalOrderId,
      approvalUrl: paypalRes.approvalUrl,
      mode: paypalRes.mode,
      details: paypalRes,
    });
  } catch (error) {
    console.error('PayPal Order creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to initiate PayPal transaction.',
    });
  }
});

// 3. Capture PayPal Order
router.post('/capture-order', async (req, res) => {
  try {
    const { orderId, paypalOrderId } = req.body;

    if (!paypalOrderId) {
      return res.status(400).json({
        success: false,
        error: 'PayPal Order ID is required for capture.',
      });
    }

    const captureRes = await capturePayPalOrder(paypalOrderId);

    if (captureRes.success || captureRes.status === 'COMPLETED') {
      if (orderId) {
        await Order.findOneAndUpdate(
          { orderId },
          {
            $set: {
              paymentStatus: 'Paid via PayPal',
              status: 'Session Scheduled',
              paypalCaptureId: captureRes.captureId,
            }
          }
        );
      }

      return res.json({
        success: true,
        message: 'PayPal payment captured successfully.',
        captureId: captureRes.captureId,
        orderId,
      });
    }

    return res.status(400).json({
      success: false,
      error: 'PayPal capture was not completed.',
      details: captureRes,
    });
  } catch (error) {
    console.error('PayPal Capture error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to capture PayPal transaction.',
    });
  }
});

export default router;
