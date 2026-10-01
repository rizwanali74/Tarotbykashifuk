import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAdminProfile } from '../services/api';
import { RefreshCw } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('kashif_admin_token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await getAdminProfile();
        if (res.success && res.admin?.role === 'superadmin') {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('kashif_admin_token');
          setIsAuthenticated(false);
        }
      } catch {
        localStorage.removeItem('kashif_admin_token');
        setIsAuthenticated(false);
      }
    };

    verifySession();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-slate-300">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500 mb-3" />
        <p className="text-xs font-semibold tracking-wider font-cinzel text-orange-300 uppercase">
          Verifying Superadmin Cryptographic Clearance...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
