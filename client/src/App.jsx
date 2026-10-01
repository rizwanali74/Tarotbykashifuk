import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClientHome from './pages/ClientHome';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSetup from './pages/admin/AdminSetup';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Client Application (Zero Admin Portal references) */}
        <Route path="/" element={<ClientHome />} />

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
