# ✦ Tarot by Kashif — Astro & Numerology ✦

> Premium spiritual consultancy, Tarot reading, Vedic astrology (Jyotish), and sacred numerology booking platform based in London, UK.

![License](https://img.shields.io/badge/license-MIT-amber)
![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8.3-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![NodeJS](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.21-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)

---

## 🌌 Overview

**Tarot by Kashif** is an end-to-end full-stack web application designed for spiritual consultation bookings, offering intuitive catalog browsing, interactive time-slot scheduling, instant consultation checkout, order status tracking, and a comprehensive superadmin sanctuary dashboard.

The application incorporates a **responsive scroll-reactive mystical background animation system** that dynamically transitions visual atmospheres across 6 distinct scenes (Cosmic Beginning, Tarot Energy, Celestial Alignment, Moonlight & Reflection, Golden Energy, and Cosmic Return) for both **Dark Sanctuary** and **Radiant Light** modes.

---

## ✨ Key Features

### 🔮 Visual Experience & Theming
- **Scroll-Reactive Mystical Background**: An evolving, full-page celestial background that smoothly transforms its atmospheric gradient, starlight vectors, floating wireframe Tarot cards, planetary orbits, lunar phase motifs, and sacred geometry across page sections.
- **Adaptive Canvas Particle Engine**: Single lightweight HTML5 canvas dynamically modulating particle speed, drift angle, and density based on screen dimensions (~55 particles on desktop, ~22 on mobile).
- **Dual Mode System (Dark Sanctuary & Radiant Light)**: Fully supported with CSS variables and floating right-edge quick-switch controller with hover expansion.
- **Accessibility (`prefers-reduced-motion`)**: Automatically disables continuous motion for users who prefer reduced motion, providing a serene static starry backdrop.

### 📜 Client Experience & Booking
- **Dedicated & Anchor Routing**: Seamless multi-page experience (`/`, `/services`, `/packages`, `/about`, `/contact`, `/book`, `/order`) with mini hero headers and direct anchor links.
- **Consultation Selection & Cart Drawer**: Multi-service selection, package selection, and slide-out intake booking drawer with real-time price calculations in GBP (£).
- **Order Tracker & Client Dashboard**: Self-service tracking modal allowing clients to view booking status, scheduled slots, and practitioner notes via their Booking ID.
- **Direct WhatsApp Consultation Action**: Quick-action floating button for direct practitioner contact.
- **Dynamic SEO Engine**: Integrated `SEOHead` component injecting dynamic OpenGraph metadata, Twitter Cards, canonical links, and JSON-LD structured schema for search engines.

### 🛡️ Admin Sanctuary Dashboard
- **Protected Superadmin Portal**: Secure JWT authentication and session management.
- **Catalog Management**: Add, update, archive, and categorize spiritual services and pricing packages.
- **Interactive Time Slot Scheduler**: Filter, assign, and populate time slots associated with specific consultation categories and services with daily slot filtering.
- **Analytics & Revenue Reporting**: Visual revenue trends and booking breakdown charts built with Recharts.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Variable Design System
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visuals & Charts**: HTML5 Canvas, SVG, [Recharts](https://recharts.org/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Forms & Selects**: [React Select](https://react-select.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 4](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Security**: [Helmet](https://helmetjs.github.io/), CORS origin policies, [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit), NoSQL input sanitization
- **Auth**: [JSON Web Tokens (JWT)](https://jwt.io/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **File Uploads**: [Multer](https://github.com/expressjs/multer)
- **Notifications**: [Nodemailer](https://nodemailer.com/)

---

## 📁 Repository Structure

```text
Tarotbykashifuk/
├── client/                      # React + Vite Frontend Application
│   ├── public/                  # Static assets & favicon
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── CelestialBackground.jsx  # 6-scene scroll-reactive background
│   │   │   ├── Navbar.jsx               # Navigation bar & cart trigger
│   │   │   ├── Hero.jsx                 # Main Hero banner
│   │   │   ├── ServicesSection.jsx      # Service cards grid
│   │   │   ├── PackagesSection.jsx      # Comprehensive package tiers
│   │   │   ├── AboutSection.jsx         # Spiritual bio & credentials
│   │   │   ├── ContactSection.jsx       # Contact form
│   │   │   ├── BookingDrawer.jsx        # Intake booking drawer
│   │   │   ├── FloatingThemeButton.jsx  # Floating Dark/Light switch
│   │   │   └── SEOHead.jsx              # Meta tags & JSON-LD
│   │   ├── context/
│   │   │   └── ThemeContext.jsx # Theme state provider
│   │   ├── hooks/
│   │   │   └── useActiveSection.js # IntersectionObserver scroll hook
│   │   ├── pages/               # Page views (Home, About, Services, Admin)
│   │   ├── services/
│   │   │   └── api.js           # Axios API service layer
│   │   ├── index.css            # CSS variables & keyframe animations
│   │   ├── App.jsx              # Main router configuration
│   │   └── main.jsx             # React DOM entrypoint
│   └── vite.config.js
│
├── server/                      # Node.js + Express Backend API
│   ├── config/                  # Database, storage, and upload configurations
│   ├── controllers/             # Request handlers
│   ├── middleware/              # Auth, validation, rate limiting
│   ├── models/                  # Mongoose data schemas (Order, Service, TimeSlot, Admin)
│   ├── routes/                  # Express API route definitions
│   ├── scripts/                 # Database seed scripts
│   └── server.js                # API entrypoint & middleware setup
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **MongoDB** instance (Local or MongoDB Atlas)

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

Configure your `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tarot_kashif
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Start the backend API server:
```bash
# Development mode (auto-reload on save)
npm run dev

# Optional: Seed initial service catalog
npm run seed:catalog
```

---

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:5173/
```

To build for production:
```bash
npm run build
```

---

## 🔐 Admin Access

To access the administrator sanctuary:
1. Navigate to `http://localhost:5173/admin/login`
2. If initial setup is required, visit `http://localhost:5173/admin/setup` to configure the primary superadmin account.
3. Manage catalog offerings, intake orders, and time slots from `/admin/dashboard`.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  Crafted with spiritual devotion & precision for <b>Tarot by Kashif</b> ✦ London, UK
</p>
