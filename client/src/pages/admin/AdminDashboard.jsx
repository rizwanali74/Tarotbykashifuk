import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, LogOut, ExternalLink, RefreshCw, BarChart3, 
  DollarSign, Clock, CheckCircle2, Mail, Search, Eye, 
  X, MessageSquare, Phone, Send, Filter, Check, AlertCircle 
} from 'lucide-react';
import { 
  getAdminProfile, fetchAdminOrders, updateOrderStatus, 
  fetchMonthlyStats, fetchContactMessages, sendDiagnosticEmail 
} from '../../services/api';
import CelestialBackground from '../../components/CelestialBackground';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'messages', 'system'
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [emailStatus, setEmailStatus] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, statsRes, ordersRes, messagesRes] = await Promise.all([
        getAdminProfile(),
        fetchMonthlyStats(),
        fetchAdminOrders(),
        fetchContactMessages(),
      ]);

      if (profileRes.success) setAdminUser(profileRes.admin);
      if (statsRes.success) setStats(statsRes.stats);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (messagesRes.success) setMessages(messagesRes.messages);
    } catch (err) {
      console.error('Error loading admin sanctuary data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kashif_admin_token');
    navigate('/admin/login', { replace: true });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?.orderId === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
        // Update stats
        const statsRes = await fetchMonthlyStats();
        if (statsRes.success) setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleSendTestEmail = async () => {
    setEmailStatus('Dispatching diagnostic email via Nodemailer...');
    try {
      const res = await sendDiagnosticEmail(adminUser?.email || 'kashif@tarotbykashif.com');
      if (res.success) {
        setEmailStatus('✅ Diagnostic email dispatched successfully!');
      } else {
        setEmailStatus(`❌ Failed: ${res.error}`);
      }
    } catch (err) {
      setEmailStatus(`❌ Error: ${err.message}`);
    }
    setTimeout(() => setEmailStatus(''), 4500);
  };

  const filteredOrders = orders.filter(ord => {
    const matchesFilter = statusFilter === 'All' || ord.status === statusFilter;
    const matchesSearch = 
      ord.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-[#07090e] text-white flex flex-col">
      <CelestialBackground />

      <div className="relative z-10 flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-left">
        
        {/* Top Header */}
        <header className="p-4 sm:p-5 rounded-2xl bg-[#0d1222]/90 border border-orange-500/30 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 border-2 border-orange-400 overflow-hidden shadow-md">
              <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wider">
                  KASHIF SANCTUARY PORTAL
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-mono font-bold">
                  SUPERADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as: <strong className="text-orange-400">{adminUser?.username || 'Superadmin'}</strong> ({adminUser?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#141b2e] hover:bg-[#1a233b] border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </Link>

            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-[#141b2e] hover:bg-[#1a233b] text-slate-300 hover:text-white border border-white/10"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4 text-orange-400" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-rose-950/30 hover:bg-rose-900 border border-rose-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Live Monthly Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#0c101d]/90 border border-orange-500/20 backdrop-blur-md">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-cinzel text-2xl font-bold text-gradient-orange">
              £{stats?.totalRevenueMonth || 0}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">Calculated in GBP (£)</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c101d]/90 border border-orange-500/20 backdrop-blur-md">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Active Readings</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-cinzel text-2xl font-bold text-white">
              {stats?.activeReadings || 0}
            </div>
            <div className="text-[10px] text-amber-300 mt-1">Pending review & scheduled</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c101d]/90 border border-orange-500/20 backdrop-blur-md">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Completed Readings</span>
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="font-cinzel text-2xl font-bold text-white">
              {stats?.completedMonth || 0}
            </div>
            <div className="text-[10px] text-sky-300 mt-1">Sessions delivered</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c101d]/90 border border-orange-500/20 backdrop-blur-md">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Client Inquiries</span>
              <Mail className="w-4 h-4 text-orange-400" />
            </div>
            <div className="font-cinzel text-2xl font-bold text-white">
              {messages.length}
            </div>
            <div className="text-[10px] text-orange-300 mt-1">Contact form messages</div>
          </div>
        </section>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex rounded-xl bg-[#0d1222] p-1 border border-white/10">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'orders' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Readings & Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'messages' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Client Inquiries ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'system' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              System & Email Test
            </button>
          </div>
        </div>

        {/* TAB 1: ORDERS & READINGS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Status:
                </span>
                {['All', 'Pending Review', 'Session Scheduled', 'Completed', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === st ? 'bg-orange-500 text-white shadow-sm' : 'bg-[#101524] text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search client, email, ref ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#0c101c] border border-white/10 rounded-xl text-xs text-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0c101d]/90 backdrop-blur-md shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f1527] text-slate-400 border-b border-white/10 uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="p-3.5">Ref ID</th>
                    <th className="p-3.5">Client</th>
                    <th className="p-3.5">Services</th>
                    <th className="p-3.5">Total</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No orders matching the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.orderId} className="hover:bg-[#12192e] transition-colors">
                        <td className="p-3.5 font-mono font-bold text-orange-400">
                          {ord.orderId}
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-white">{ord.clientName}</div>
                          <div className="text-[11px] text-slate-400">{ord.email}</div>
                        </td>
                        <td className="p-3.5 max-w-[220px] truncate">
                          {ord.services?.join(', ') || 'Spiritual Session'}
                        </td>
                        <td className="p-3.5 font-cinzel font-bold text-white">
                          {ord.total}
                        </td>
                        <td className="p-3.5">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.orderId, e.target.value)}
                            className="bg-[#080b13] border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option>Pending Review</option>
                            <option>Session Scheduled</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1.5 rounded-lg bg-[#161e36] hover:bg-orange-500 text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Intake</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT INQUIRIES */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="p-12 text-center text-slate-400 rounded-2xl bg-[#0c101d] border border-white/10">
                No contact inquiries received yet.
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="p-4 sm:p-5 rounded-2xl bg-[#0c101d] border border-white/10 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-white text-sm sm:text-base">{msg.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                      {msg.serviceInterest}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-4">
                    <span>Email: <strong className="text-slate-200">{msg.email}</strong></span>
                    <span>Phone: <strong className="text-slate-200">{msg.phone}</strong></span>
                  </div>
                  <p className="text-xs text-slate-200 bg-[#07090e] p-3 rounded-xl italic">
                    "{msg.message}"
                  </p>
                  <div className="pt-1">
                    <a
                      href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reply to {msg.name} on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: SYSTEM, PAYPAL & EMAIL DIAGNOSTICS */}
        {activeTab === 'system' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#0c101d] border border-orange-500/20 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Sanctuary Backend Architecture Status</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#07090e] border border-white/5">
                  <span className="text-slate-400 block mb-1">Database Engine</span>
                  <span className="text-emerald-400 font-semibold text-sm">MongoDB Connected</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#07090e] border border-white/5">
                  <span className="text-slate-400 block mb-1">PayPal Gateway</span>
                  <span className="text-amber-400 font-semibold text-sm">Sandbox / Live Ready (GBP)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#07090e] border border-white/5">
                  <span className="text-slate-400 block mb-1">Email Transport</span>
                  <span className="text-sky-400 font-semibold text-sm">Nodemailer SMTP Engine</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c101d] border border-orange-500/20 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-orange-400" />
                <span>Nodemailer Diagnostics Dispatch</span>
              </h4>
              <p className="text-xs text-slate-300">
                Trigger a live diagnostic test email to verify your SMTP configuration in <code className="text-orange-300">server/.env</code>.
              </p>
              <button
                onClick={handleSendTestEmail}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md cursor-pointer"
              >
                Send Test Email to {adminUser?.email}
              </button>
              {emailStatus && (
                <p className="text-xs text-amber-300 font-medium pt-1">{emailStatus}</p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Order Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0c101d] border border-orange-500/40 rounded-2xl p-6 space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono font-bold text-orange-400 text-sm">
                  Order #{selectedOrder.orderId}
                </span>
                <h3 className="font-cinzel text-lg font-bold text-white mt-0.5">
                  {selectedOrder.clientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#141b2e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-200">
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p><strong>Services:</strong> {selectedOrder.services?.join(', ')}</p>
              <p><strong>Amount:</strong> <strong className="text-gradient-orange text-sm">{selectedOrder.total}</strong></p>
              <p><strong>Status:</strong> <span className="text-amber-400 font-semibold">{selectedOrder.status}</span></p>
              <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
              <p><strong>DOB:</strong> {selectedOrder.details?.dob} ({selectedOrder.details?.birthTime || 'Unknown time'})</p>
              <p><strong>Birthplace:</strong> {selectedOrder.details?.birthPlace || 'N/A'}</p>
              <p><strong>Mother's Name:</strong> {selectedOrder.details?.motherName || 'N/A'}</p>
              <div className="pt-2">
                <span className="font-bold text-slate-400">Client's Questions & Focus:</span>
                <p className="mt-1 p-3 rounded-xl bg-[#07090e] border border-white/5 italic leading-relaxed">
                  "{selectedOrder.details?.questions || 'No specific questions entered.'}"
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-3">
              <a
                href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-1.5 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Client on WhatsApp</span>
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#161e36] text-white hover:bg-[#202b4d]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
