import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter helper
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass && user.trim() !== '' && pass.trim() !== '') {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Fallback simulator for development/testing when SMTP credentials are not yet entered
  return {
    sendMail: async (mailOptions) => {
      console.log('🔮 [Nodemailer Simulator] Outbound Email Dispatched:');
      console.log(`   To: ${mailOptions.to}`);
      console.log(`   Subject: ${mailOptions.subject}`);
      console.log(`   Preview: ${mailOptions.text ? mailOptions.text.substring(0, 100) : 'HTML Template sent'}...`);
      return { messageId: `simulated_${Date.now()}` };
    },
    verify: async () => true
  };
};

export const transporter = createTransporter();

// Spiritual Dark & Amber HTML Email Template Wrapper
const wrapEmailTemplate = (title, contentHtml) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #07090e; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f8fafc; }
    .container { max-width: 600px; margin: 20px auto; background-color: #0d1220; border: 1px solid rgba(249, 115, 22, 0.3); border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #111728 0%, #1a223a 100%); padding: 30px 24px; text-align: center; border-bottom: 2px solid #f97316; }
    .title { color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: 1px; margin: 0; }
    .subtitle { color: #f97316; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
    .body { padding: 32px 24px; font-size: 14px; line-height: 1.6; color: #cbd5e1; }
    .badge { display: inline-block; background-color: rgba(249, 115, 22, 0.15); color: #f97316; padding: 4px 14px; border-radius: 20px; font-weight: bold; border: 1px solid rgba(249, 115, 22, 0.3); font-size: 12px; letter-spacing: 0.5px; }
    .card { background-color: #080b13; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin: 18px 0; }
    .footer { background-color: #05070b; padding: 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255, 255, 255, 0.05); }
    .btn { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff !0important; text-decoration: none; padding: 12px 28px; font-weight: bold; border-radius: 8px; font-size: 13px; margin: 12px 0; text-align: center; }
    .btn-emerald { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; text-decoration: none; padding: 12px 28px; font-weight: bold; border-radius: 8px; font-size: 13px; margin: 12px 0; text-align: center; }
    .meta-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .meta-label { color: #94a3b8; font-weight: 500; }
    .meta-value { color: #f8fafc; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">TAROT BY KASHIF</h1>
      <div class="subtitle">Astro & Numerology Sanctuary • UK & International</div>
    </div>
    <div class="body">
      ${contentHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;">Tarot By Kashif • United Kingdom • Serving Worldwide Online & WhatsApp</p>
      <p style="margin: 0;">Spiritual readings are interpretive guidance intended for personal reflection and insight.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// 1. Send Booking Request Confirmation & Order Details to Client
export const sendBookingConfirmationToClient = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'kashif@tarotbykashif.com';
  const from = process.env.EMAIL_FROM || `"Tarot By Kashif" <${adminEmail}>`;

  const servicesListHtml = Array.isArray(order.services)
    ? order.services.map(s => `<li style="padding: 4px 0; color: #f8fafc;">✦ ${s}</li>`).join('')
    : `<li style="padding: 4px 0; color: #f8fafc;">✦ ${order.services}</li>`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge">✦ Booking Request Confirmed</span>
      <h2 style="color: #ffffff; font-size: 20px; margin: 14px 0 6px 0;">Peace and blessings, ${order.clientName}</h2>
      <p style="color: #94a3b8; font-size: 13px; margin: 0;">
        Your spiritual session request has been registered. Here is your complete order summary and intake details.
      </p>
    </div>

    <!-- Order Summary Card -->
    <div class="card">
      <div style="border-bottom: 1px solid #1e293b; padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
        <span style="color: #94a3b8; font-size: 13px;">Order Reference ID:</span>
        <strong style="color: #f97316; font-family: monospace; font-size: 16px;">${order.orderId}</strong>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 6px 0; color: #94a3b8;">Client Name:</td>
          <td style="padding: 6px 0; color: #ffffff; font-weight: bold; text-align: right;">${order.clientName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #94a3b8;">Contact Email:</td>
          <td style="padding: 6px 0; color: #ffffff; text-align: right;">${order.email}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #94a3b8;">Phone / WhatsApp:</td>
          <td style="padding: 6px 0; color: #ffffff; text-align: right;">${order.phone}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #94a3b8;">Status:</td>
          <td style="padding: 6px 0; color: #fde047; font-weight: bold; text-align: right;">${order.status || 'Pending Review'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #94a3b8;">Total Amount:</td>
          <td style="padding: 6px 0; color: #f97316; font-size: 16px; font-weight: bold; text-align: right;">${order.total}</td>
        </tr>
      </table>
    </div>

    <!-- Selected Services Card -->
    <div class="card">
      <h3 style="color: #f97316; font-size: 14px; margin-top: 0; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">
        Selected Spiritual Services
      </h3>
      <ul style="margin: 0; padding-left: 18px; list-style-type: none;">
        ${servicesListHtml}
      </ul>
    </div>

    <!-- Personal Astral Intake Summary -->
    <div class="card">
      <h3 style="color: #f97316; font-size: 14px; margin-top: 0; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">
        Your Intake Information
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">Date of Birth:</td>
          <td style="padding: 5px 0; color: #ffffff; text-align: right;">${order.details?.dob || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">Exact Birth Time:</td>
          <td style="padding: 5px 0; color: #ffffff; text-align: right;">${order.details?.birthTime || 'Unknown / Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">Birth City / Country:</td>
          <td style="padding: 5px 0; color: #ffffff; text-align: right;">${order.details?.birthPlace || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">Mother's Name:</td>
          <td style="padding: 5px 0; color: #ffffff; text-align: right;">${order.details?.motherName || 'Not specified'}</td>
        </tr>
      </table>

      <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);">
        <span style="color: #94a3b8; font-size: 12px; font-weight: bold; display: block; margin-bottom: 6px;">Questions & Focus Areas:</span>
        <div style="background-color: #0b0f1a; padding: 12px; border-radius: 8px; font-style: italic; color: #e2e8f0; font-size: 13px; line-height: 1.5;">
          "${order.details?.questions || 'General life direction, love guidance, and spiritual reading consultation.'}"
        </div>
      </div>
    </div>

    <!-- Payment & Scheduling Guidance -->
    <div style="background-color: rgba(234, 179, 8, 0.08); border: 1px solid rgba(234, 179, 8, 0.25); border-radius: 12px; padding: 18px; margin: 20px 0;">
      <h3 style="color: #fde047; font-size: 14px; margin-top: 0; margin-bottom: 8px;">Official PayPal Invoicing & Next Steps</h3>
      <p style="margin: 0; font-size: 13px; color: #fef08a; line-height: 1.6;">
        All sessions are billed in GBP (£) via official PayPal invoicing. Kashif will verify his calendar for your reading and send your private PayPal payment invoice along with scheduling options via WhatsApp or Email within 2–4 hours.
      </p>
    </div>

    <div style="text-align: center; margin-top: 25px;">
      <a href="https://wa.me/447400000000" class="btn-emerald">
        Chat With Kashif on WhatsApp
      </a>
      <p style="color: #64748b; font-size: 12px; margin-top: 8px;">
        To check live reading progress anytime, visit the website and enter Reference <strong>${order.orderId}</strong>.
      </p>
    </div>
  `;

  return transporter.sendMail({
    from,
    to: order.email,
    subject: `✦ Order Summary & Confirmation [${order.orderId}] - Tarot By Kashif`,
    html: wrapEmailTemplate('Booking Request Confirmation & Order Summary', content),
    text: `Hello ${order.clientName},\n\nYour reading request [${order.orderId}] for ${Array.isArray(order.services) ? order.services.join(', ') : order.services} (${order.total}) has been received.\n\nKashif will contact you shortly via WhatsApp or Email with PayPal invoice details.`
  });
};

// 2. Send Alert with Full Order Details to Kashif (Superadmin)
export const sendBookingAlertToAdmin = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'kashif@tarotbykashif.com';
  const from = process.env.EMAIL_FROM || `"Tarot Sanctuary System" <${adminEmail}>`;

  const servicesListHtml = Array.isArray(order.services)
    ? order.services.map(s => `<li style="padding: 3px 0; color: #f8fafc;">• ${s}</li>`).join('')
    : `<li style="padding: 3px 0; color: #f8fafc;">• ${order.services}</li>`;

  const cleanPhone = (order.phone || '').replace(/[^0-9]/g, '');

  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span class="badge" style="background-color: rgba(16, 185, 129, 0.15); color: #10b981; border-color: rgba(16, 185, 129, 0.3);">
        🔔 New Booking Intake Received
      </span>
      <h2 style="color: #ffffff; font-size: 20px; margin: 12px 0 4px 0;">New Spiritual Session Request</h2>
      <p style="color: #94a3b8; font-size: 13px; margin: 0;">Ref: <strong style="color: #f97316; font-family: monospace;">${order.orderId}</strong></p>
    </div>

    <!-- Client Overview Card -->
    <div class="card">
      <h3 style="color: #f97316; font-size: 14px; margin-top: 0; margin-bottom: 12px; text-transform: uppercase;">
        Client Overview
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">Client Name:</td>
          <td style="padding: 5px 0; color: #ffffff; font-weight: bold; text-align: right;">${order.clientName}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">Email:</td>
          <td style="padding: 5px 0; color: #ffffff; text-align: right;">${order.email}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">WhatsApp / Phone:</td>
          <td style="padding: 5px 0; color: #ffffff; font-weight: bold; text-align: right;">${order.phone}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">Total Amount:</td>
          <td style="padding: 5px 0; color: #f97316; font-size: 16px; font-weight: bold; text-align: right;">${order.total}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">Payment Method:</td>
          <td style="padding: 5px 0; color: #fde047; text-align: right;">PayPal Invoicing (GBP)</td>
        </tr>
      </table>
    </div>

    <!-- Services Ordered -->
    <div class="card">
      <h3 style="color: #f97316; font-size: 14px; margin-top: 0; margin-bottom: 10px; text-transform: uppercase;">
        Booked Services
      </h3>
      <ul style="margin: 0; padding-left: 18px; list-style-type: none;">
        ${servicesListHtml}
      </ul>
    </div>

    <!-- Full Astral Intake Info -->
    <div class="card">
      <h3 style="color: #f97316; font-size: 14px; margin-top: 0; margin-bottom: 10px; text-transform: uppercase;">
        Intake & Astrological Birth Data
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">Date of Birth:</td>
          <td style="padding: 5px 0; color: #ffffff; text-align: right;">${order.details?.dob || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">Birth Time:</td>
          <td style="padding: 5px 0; color: #ffffff; text-align: right;">${order.details?.birthTime || 'Unknown / Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">Birth Place:</td>
          <td style="padding: 5px 0; color: #ffffff; text-align: right;">${order.details?.birthPlace || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #94a3b8;">Mother's Name:</td>
          <td style="padding: 5px 0; color: #ffffff; text-align: right;">${order.details?.motherName || 'N/A'}</td>
        </tr>
      </table>

      <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);">
        <span style="color: #94a3b8; font-size: 12px; font-weight: bold; display: block; margin-bottom: 6px;">Questions & Situation:</span>
        <div style="background-color: #0b0f1a; padding: 12px; border-radius: 8px; color: #f8fafc; font-size: 13px; line-height: 1.5;">
          ${order.details?.questions || 'No specific questions entered.'}
        </div>
      </div>
    </div>

    <!-- Quick Action -->
    <div style="text-align: center; margin-top: 25px;">
      ${cleanPhone ? `
        <a href="https://wa.me/${cleanPhone}" class="btn-emerald" style="margin-right: 8px;">
          Message ${order.clientName} on WhatsApp
        </a>
      ` : ''}
      <a href="mailto:${order.email}" class="btn">
        Reply via Email
      </a>
    </div>
  `;

  return transporter.sendMail({
    from,
    to: adminEmail,
    subject: `🔔 New Order [${order.orderId}]: ${order.clientName} - ${order.total}`,
    html: wrapEmailTemplate('New Booking Alert', content),
  });
};

// 3. Send Contact Form Auto-Reply
export const sendContactAutoReply = async (contact) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'kashif@tarotbykashif.com';
  const from = process.env.EMAIL_FROM || `"Tarot By Kashif" <${adminEmail}>`;

  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">Thank you for reaching out, ${contact.name}</h2>
    <p>Kashif has received your enquiry regarding <strong>${contact.serviceInterest}</strong>.</p>
    <div class="card">
      <p><strong>Your Message:</strong></p>
      <p style="font-style: italic; color: #e2e8f0;">"${contact.message}"</p>
    </div>
    <p>Kashif personally reviews all inquiries and will reply to your email or WhatsApp shortly.</p>
  `;

  return transporter.sendMail({
    from,
    to: contact.email,
    subject: `✦ We have received your enquiry - Tarot By Kashif`,
    html: wrapEmailTemplate('Enquiry Received', content),
  });
};

// 4. Send Contact Alert to Admin
export const sendContactAlertToAdmin = async (contact) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'kashif@tarotbykashif.com';
  const from = process.env.EMAIL_FROM || `"Tarot Sanctuary System" <${adminEmail}>`;

  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">New Contact Form Message</h2>
    <div class="card">
      <p><strong>From:</strong> ${contact.name} (${contact.email})</p>
      <p><strong>Phone:</strong> ${contact.phone}</p>
      <p><strong>Service Interest:</strong> ${contact.serviceInterest}</p>
      <p><strong>Message:</strong></p>
      <p style="background: #0f1527; padding: 12px; border-radius: 8px; color: #f8fafc;">${contact.message}</p>
    </div>
  `;

  return transporter.sendMail({
    from,
    to: adminEmail,
    subject: `📬 New Client Message from ${contact.name} (${contact.serviceInterest})`,
    html: wrapEmailTemplate('New Client Message', content),
  });
};

// 5. Test Email Dispatch
export const sendTestEmail = async (targetEmail) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'kashif@tarotbykashif.com';
  const from = process.env.EMAIL_FROM || `"Tarot By Kashif" <${adminEmail}>`;

  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">Nodemailer Service Test</h2>
    <p>This is a test email confirming that your email transport is configured and operational.</p>
    <div class="card">
      <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Operational ✅</span></p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <p><strong>Recipient:</strong> ${targetEmail}</p>
    </div>
  `;

  return transporter.sendMail({
    from,
    to: targetEmail,
    subject: `✦ Nodemailer Health Test - Tarot By Kashif`,
    html: wrapEmailTemplate('SMTP Diagnostics', content),
  });
};
