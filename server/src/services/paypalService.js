import dotenv from 'dotenv';
dotenv.config();

const getPayPalBaseUrl = () => {
  return process.env.PAYPAL_MODE === 'live' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';
};

// Generate an OAuth2 Access Token from PayPal REST API
const generateAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId.trim() === '' || clientSecret.trim() === '') {
    return null;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await response.json();
  return data.access_token;
};

// 1. Create a PayPal Order
export const createPayPalOrder = async (orderId, amountGbp) => {
  const accessToken = await generateAccessToken();

  // If live credentials are not configured, operate in safe sandbox simulation mode
  if (!accessToken) {
    console.log(`💳 [PayPal Simulator] Generated Sandbox Order for ${orderId} (${amountGbp} GBP)`);
    return {
      success: true,
      mode: 'sandbox_simulation',
      paypalOrderId: `PAYPAL-MOCK-${Math.floor(100000 + Math.random() * 900000)}`,
      approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=simulated_${Date.now()}`,
      amount: amountGbp,
      currency: 'GBP',
      note: 'Operating in Sandbox simulation mode until PAYPAL_CLIENT_ID is supplied in .env'
    };
  }

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          description: `Tarot By Kashif Spiritual Reading Session (${orderId})`,
          amount: {
            currency_code: 'GBP',
            value: amountGbp.toString(),
          },
        },
      ],
      application_context: {
        brand_name: 'Tarot By Kashif',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order-success`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order-cancel`,
      },
    }),
  });

  const data = await response.json();
  const approveLink = data.links?.find(l => l.rel === 'approve')?.href;

  return {
    success: true,
    mode: process.env.PAYPAL_MODE || 'sandbox',
    paypalOrderId: data.id,
    approvalUrl: approveLink,
    data,
  };
};

// 2. Capture Payment on an Approved PayPal Order
export const capturePayPalOrder = async (paypalOrderId) => {
  const accessToken = await generateAccessToken();

  if (!accessToken) {
    console.log(`💳 [PayPal Simulator] Captured mock payment for PayPal Order ${paypalOrderId}`);
    return {
      success: true,
      status: 'COMPLETED',
      captureId: `CAPTURE-MOCK-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: { currency_code: 'GBP' },
      payer: { email_address: 'client-sandbox@paypal.com' },
      mode: 'sandbox_simulation'
    };
  }

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return {
    success: data.status === 'COMPLETED',
    status: data.status,
    captureId: data.purchase_units?.[0]?.payments?.captures?.[0]?.id || data.id,
    data,
  };
};
