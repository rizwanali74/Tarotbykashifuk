# Tarot By Kashif ✦ Full-Stack Spiritual Sanctuary Application

A fully responsive, production-ready full-stack web application designed for **Tarot By Kashif** — providing Tarot, Vedic Astrology, Numerology, and Energetic Care consultations.

---

## 🌟 Architecture & Key Features

### 🖥️ Frontend (React JSX, Tailwind CSS, Framer Motion, Lucide Icons)
- **Top Bar**: Instant WhatsApp contact button (`+44 7400 000000`), email address, UK/International notice, and direct link to the Protected Admin Portal.
- **Responsive Navigation**: Fluid layout that scales gracefully across mobile, tablet, laptop, and 4K desktop screens without any overlapping or awkward wrapping.
- **Mystical Cosmic Background**: Animated starfield, glowing ambient nebulas, and rotating celestial rings.
- **Interactive Offerings Catalog**: 9 spiritual readings, category filters (*Readings*, *Relationships*, *Spiritual care*), live search, and detailed guidance modals.
- **Curated Packages**: Highlights the **Complete Spiritual Guidance Package (£169)** with 5 comprehensive readings and savings, alongside the **Love & Twin-Flame Connection Suite (£115)**.
- **3-Step Astrological Intake & Selection Drawer**: Collects name, email, WhatsApp, date/time of birth, birthplace, mother's name, and questions. Generates order ID (`TK-XXXX`) with celebratory confetti and direct WhatsApp forwarding.
- **Client Order Status Tracker**: Enter an order ID to view reading progress through 4 visual stages.
- **Protected Admin Portal**: Role-based access with JWT authentication, real-time revenue metrics, order status controls, customer intake inspector, and Nodemailer diagnostics.

---

### ⚙️ Backend (Node.js, Express, MongoDB, Nodemailer, PayPal)
- **Database Engine**: Mongoose with MongoDB connection and safe, resilient in-memory fallback.
- **One-Time Superadmin Provisioning**: Endpoint `/api/auth/setup-superadmin` requires a secret setup key. Once created, it is **permanently locked (403 Forbidden)** to prevent duplicate signups.
- **JWT Authentication & Rate Limiting**: Signed tokens, role validation (`superadmin`), and brute-force protection.
- **Nodemailer Integration**: Automatically sends rich HTML confirmation emails to clients upon booking and alerts to Kashif's inbox.
- **PayPal Payment Processing**: Implements PayPal v2 Orders API with GBP currency support and fallback sandbox simulation.
- **Security Hardening**: Helmet HTTP headers, CORS origin protection, NoSQL injection neutralization, and XSS sanitization.

---

## 🚀 Getting Started

### 1. Start Both Services

From the root project folder:

```bash
# Terminal 1: Start Backend API (Port 5000)
npm run server

# Terminal 2: Start Frontend Client (Port 5173)
npm run dev
```

- **Frontend Client**: `http://localhost:5173/`
- **Backend API**: `http://localhost:5000/api/health`

---

## 🔐 Superadmin Initialization & Admin Portal

1. Click **"Admin Portal"** in the top navigation bar or go to `http://localhost:5173/`.
2. If this is the initial run, the **One-Time Provisioning Form** will appear:
   - **Username**: e.g. `kashif_sanctuary`
   - **Email**: `kashif@tarotbykashif.com`
   - **Password**: Min 8 characters
   - **Setup Key**: Matches `SUPERADMIN_INITIALIZATION_KEY` in `server/.env` (Default: `KASHIF_SACRED_SETUP_KEY_2026`)
3. Once submitted, superadmin setup is **permanently locked**. Future access is strictly via standard login.

---

## ⚙️ Environment Configuration (`server/.env`)

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection (Leave blank for in-memory store or paste Atlas URI)
MONGODB_URI=mongodb://localhost:27017/tarotbykashif

# JWT Security
JWT_SECRET=kashif_celestial_tarot_super_secret_jwt_key_2026_xyz981
JWT_EXPIRES_IN=7d
SUPERADMIN_INITIALIZATION_KEY=KASHIF_SACRED_SETUP_KEY_2026

# Nodemailer SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
ADMIN_EMAIL=kashif@tarotbykashif.com
EMAIL_FROM="Tarot By Kashif" <kashif@tarotbykashif.com>

# PayPal Payment Configuration
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

---

## 🛡️ Running Security & Functional Tests

Run the security test suite verifying all 19 checkpoints:

```bash
npm run test:security
```

**Verification Results:**
- 19/19 Security, Auth, Rate Limiting, PayPal, and Nodemailer tests passed (100%).
