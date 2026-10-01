import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowRight, Sparkles, Key } from 'lucide-react';
import { loginAdmin, checkSetupStatus } from '../../services/api';
import CelestialBackground from '../../components/CelestialBackground';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(true);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    const token = localStorage.getItem('kashif_admin_token');
    if (token) {
      navigate('/admin/dashboard', { replace: true });
    }

    // Check if initial setup is pending
    const verifyStatus = async () => {
      const res = await checkSetupStatus();
      if (res && res.isSetupComplete === false) {
        setIsSetupComplete(false);
      }
    };
    verifyStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginAdmin(form);
      if (res.success && res.token) {
        localStorage.setItem('kashif_admin_token', res.token);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } catch {
      setError('Connection failure. Please verify the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-white flex flex-col justify-center items-center p-4">
      <CelestialBackground />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo / Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-white p-1 border-2 border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.4)] overflow-hidden">
            <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold tracking-wider text-white">
            TAROT BY KASHIF
          </h1>
          <p className="text-xs text-orange-400 tracking-widest uppercase font-semibold">
            Superadmin Sanctuary Gate
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1222]/90 border border-orange-500/30 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-5 text-left">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-orange-400" />
              <span>Cryptographic Sign-In</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-mono">
              RESTRICTED
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300">
              {error}
            </div>
          )}

          {!isSetupComplete && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Initial Superadmin Required</span>
              </div>
              <p>No superadmin has been provisioned yet.</p>
              <Link to="/admin/setup" className="text-orange-400 underline font-semibold block pt-1">
                Go to One-Time Superadmin Setup ➔
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Username or Email
              </label>
              <input
                type="text"
                required
                placeholder="kashif@tarotbykashif.com"
                value={form.usernameOrEmail}
                onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#07090e] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#07090e] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 shadow-[0_0_25px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Sanctuary</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-orange-400 transition-colors">
              ← Return to Public Website
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
