import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Key, ShieldCheck, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import { setupSuperadmin, checkSetupStatus } from '../../services/api';
import CelestialBackground from '../../components/CelestialBackground';

export default function AdminSetup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: 'kashif_sanctuary',
    email: 'kashif@tarotbykashif.com',
    password: '',
    setupKey: 'KASHIF_SACRED_SETUP_KEY_2026',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyStatus = async () => {
      setChecking(true);
      try {
        const res = await checkSetupStatus();
        if (res && res.isSetupComplete) {
          setIsLocked(true);
        }
      } catch {
        setIsLocked(false);
      } finally {
        setChecking(false);
      }
    };

    verifyStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await setupSuperadmin(form);
      if (res.success && res.token) {
        localStorage.setItem('kashif_admin_token', res.token);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(res.error || 'Provisioning failed.');
      }
    } catch {
      setError('Connection failure during provisioning.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-white flex flex-col justify-center items-center p-4">
      <CelestialBackground />

      <div className="relative z-10 w-full max-w-md text-left">
        
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-white p-1 border-2 border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.4)] overflow-hidden">
            <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold tracking-wider text-white">
            TAROT BY KASHIF
          </h1>
          <p className="text-xs text-orange-400 tracking-widest uppercase font-semibold">
            One-Time Superadmin Provisioning
          </p>
        </div>

        {checking ? (
          <div className="p-8 text-center text-slate-400">
            Checking provisioning lock status...
          </div>
        ) : isLocked ? (
          /* LOCKED OUT PERMANENTLY */
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1222]/90 border border-orange-500/30 backdrop-blur-xl shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-white">
              Provisioning Gate Locked
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A Superadmin account is already provisioned in the database. In compliance with strict one-time signup architecture, this setup endpoint is permanently disabled.
            </p>
            <div className="pt-3">
              <Link
                to="/admin/login"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md inline-block"
              >
                Go to Superadmin Login ➔
              </Link>
            </div>
          </div>
        ) : (
          /* SETUP FORM */
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1222]/90 border border-orange-500/30 backdrop-blur-xl shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Master Provisioning</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                ONE-TIME ONLY
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Superadmin Username
                </label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#07090e] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#07090e] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Master Password (min 8 characters)
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Setup Key (Defined in <code className="text-amber-300">server/.env</code>)
                </label>
                <input
                  type="text"
                  required
                  value={form.setupKey}
                  onChange={(e) => setForm({ ...form, setupKey: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#07090e] border border-orange-500/20 rounded-xl text-xs font-mono text-amber-300 focus:border-orange-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 shadow-[0_0_25px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Provisioning Superadmin...' : 'Initialize & Lock Superadmin Setup'}
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link to="/admin/login" className="text-xs text-slate-400 hover:text-orange-400 transition-colors">
                Already provisioned? Go to Login ➔
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
