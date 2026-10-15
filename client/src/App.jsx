import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClientHome from './pages/ClientHome';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PackagesPage from './pages/PackagesPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSetup from './pages/admin/AdminSetup';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingThemeButton from './components/FloatingThemeButton';

export default function App() {
  return (
    <BrowserRouter>
      <FloatingThemeButton />
      <Routes>
        {/* Public Client Application Routes */}
        <Route path="/" element={<ClientHome />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/order" element={<BookingPage />} />

        {/* Dedicated Admin Portal Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/setup" element={<AdminSetup />} />
        <Route path="/admin/signup" element={<AdminSetup />} />

        {/* Protected Superadmin Sanctuary Dashboard */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Alias /admin to /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Fallback Catch-all: Redirect to public client home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
