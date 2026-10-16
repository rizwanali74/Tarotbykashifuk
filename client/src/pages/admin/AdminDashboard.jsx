import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, LogOut, ExternalLink, RefreshCw, ClipboardList, Layers3, Settings2, LayoutDashboard,
  DollarSign, Clock, CheckCircle2, Mail, Search, Eye, 
  X, MessageSquare, Phone, Send, Filter, Check, AlertCircle, User, Sparkles, Calendar, ChevronRight
} from 'lucide-react';
import { 
  getAdminProfile, fetchAdminOrders, updateOrderStatus, 
  fetchMonthlyStats, fetchContactMessages, fetchAdminCatalog, sendDiagnosticEmail
} from '../../services/api';
import CelestialBackground from '../../components/CelestialBackground';
import AdminCatalog from './AdminCatalog';

class ChartsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("Chart load recovered:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-orange-500/30 bg-[var(--theme-bg-card)] p-4 text-xs text-slate-300 flex items-center justify-between">
          <span>Analytics charts updating...</span>
          <button 
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }} 
            className="px-2.5 py-1 rounded bg-orange-500 text-white font-medium hover:bg-orange-600 transition cursor-pointer"
          >
            Refresh Charts
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminHomeCharts = lazy(() => import('./AdminDashboardCharts'));

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [catalog, setCatalog] = useState({ services: [], categories: [] });
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [activeTab, setActiveTab] = useState('home');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [emailStatus, setEmailStatus] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, statsRes, ordersRes, messagesRes, catalogRes] = await Promise.all([
        getAdminProfile(),
        fetchMonthlyStats(),
        fetchAdminOrders(),
        fetchContactMessages(),
        fetchAdminCatalog(),
      ]);

      if (profileRes.success) setAdminUser(profileRes.user);
      if (statsRes.success) setStats(statsRes.stats);
      if (ordersRes.success) setOrders(ordersRes.orders || []);
      if (messagesRes.success) setMessages(messagesRes.messages || []);
      if (catalogRes.success) setCatalog({ services: catalogRes.services, categories: catalogRes.categories });
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

  const navigationItems = [
    { id: 'home', label: 'Home Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Bookings & Orders', count: orders.length, icon: ClipboardList },
    { id: 'messages', label: 'Client Inquiries', count: messages.length, icon: Mail },
    { id: 'catalog', label: 'Services & Categories', icon: Layers3 },
    { id: 'system', label: 'System & Email', icon: Settings2 },
  ];
  const activePage = navigationItems.find((item) => item.id === activeTab);

  return (
    <div className="relative min-h-screen bg-[var(--theme-bg-app)] text-[var(--theme-text-primary)] flex flex-col transition-colors">
      <CelestialBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-1 flex-col text-left lg:pl-64 lg:flex-row">
        {/* SIDEBAR NAVIGATION */}
        <aside style={{ left: 'max(0px, calc((100vw - 1600px) / 2))' }} className="border-b border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card)]/95 p-4 backdrop-blur-xl lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:border-[var(--theme-border-subtle)] lg:p-5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-orange-400 bg-white p-0.5 shadow-sm">
              <img src="/images/logo.jpg" alt="Tarot By Kashif" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="truncate font-cinzel text-sm font-bold text-[var(--theme-text-heading)]">TAROT BY KASHIF</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange-500">Superadmin Portal</div>
            </div>
          </div>

          <div className="mt-5 hidden rounded-xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card-subtle)] p-3 lg:block">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-muted)]">Signed in as</div>
            <div className="mt-1 truncate text-sm font-semibold text-[var(--theme-text-heading)]">{adminUser?.username || 'Superadmin'}</div>
            <div className="truncate text-xs text-[var(--theme-text-dim)]">{adminUser?.email}</div>
          </div>

          <nav aria-label="Admin sections" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:flex-col">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedOrder(null);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-10 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-orange-500/15 text-orange-500 border border-orange-500/40 shadow-xs' 
                      : 'text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-card-subtle)] hover:text-[var(--theme-text-heading)]'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-orange-500' : ''}`} />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--theme-bg-card-subtle)] text-[var(--theme-text-muted)] font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Actions (Clean, without redundant theme toggle) */}
          <div className="mt-4 flex flex-col gap-2.5 lg:mt-auto lg:pt-6">
            <div className="flex gap-2 lg:flex-col">
              <Link 
                to="/" 
                target="_blank" 
                className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-card-hover)] hover:text-orange-500 transition-colors lg:justify-start"
              >
                <ExternalLink className="h-3.5 w-3.5 text-orange-500" /> Public Website
              </Link>
              <button 
                type="button" 
                onClick={handleLogout} 
                className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/15 transition-colors lg:justify-start cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="min-w-0 flex-1 space-y-5 p-4 sm:p-5 lg:p-6">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--theme-border-subtle)] pb-4">
            <div>
              <h1 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--theme-text-heading)]">
                {activePage?.label || 'Admin Dashboard'}
              </h1>
              <p className="mt-0.5 text-[11px] text-[var(--theme-text-muted)]">
                Manage bookings, client inquiries, and your public service catalog.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={loadData} 
                title="Refresh dashboard data" 
                aria-label="Refresh dashboard data" 
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card)] px-3 text-xs font-semibold text-[var(--theme-text-secondary)] hover:text-orange-500 hover:border-orange-500/40 shadow-xs cursor-pointer transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-orange-500 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>
          </header>

        {activeTab === 'home' && <>
        {/* Live Monthly Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-[var(--theme-bg-card)] border border-orange-500/20 backdrop-blur-md shadow-xs transition-colors">
            <div className="flex justify-between items-center text-[11px] text-[var(--theme-text-muted)] mb-0.5">
              <span>Total Revenue</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="font-cinzel text-xl sm:text-2xl font-bold text-gradient-orange">
              £{stats?.totalRevenueMonth || 0}
            </div>
            <div className="text-[10px] text-emerald-500 mt-0.5 font-medium">This month (GBP)</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--theme-bg-card)] border border-orange-500/20 backdrop-blur-md shadow-xs transition-colors">
            <div className="flex justify-between items-center text-[11px] text-[var(--theme-text-muted)] mb-0.5">
              <span>Active Readings</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--theme-text-heading)]">
              {stats?.activeReadings || 0}
            </div>
            <div className="text-[10px] text-amber-500 mt-0.5 font-medium">Pending & scheduled</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--theme-bg-card)] border border-orange-500/20 backdrop-blur-md shadow-xs transition-colors">
            <div className="flex justify-between items-center text-[11px] text-[var(--theme-text-muted)] mb-0.5">
              <span>Completed Readings</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <div className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--theme-text-heading)]">
              {stats?.completedMonth || 0}
            </div>
            <div className="text-[10px] text-sky-500 mt-0.5 font-medium">Sessions delivered</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--theme-bg-card)] border border-orange-500/20 backdrop-blur-md shadow-xs transition-colors">
            <div className="flex justify-between items-center text-[11px] text-[var(--theme-text-muted)] mb-0.5">
              <span>Client Inquiries</span>
              <Mail className="w-3.5 h-3.5 text-orange-500" />
            </div>
            <div className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--theme-text-heading)]">
              {messages.length}
            </div>
            <div className="text-[10px] text-orange-500 mt-0.5 font-medium">Contact form messages</div>
          </div>
        </section>

        <ChartsErrorBoundary>
          <Suspense fallback={<div className="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card)] p-4 text-xs text-[var(--theme-text-muted)]">Loading dashboard charts...</div>}>
            <AdminHomeCharts orders={orders} catalog={catalog} />
          </Suspense>
        </ChartsErrorBoundary>
        </>}

        {/* TAB 1: ORDERS & READINGS */}
        {activeTab === 'orders' && (
          selectedOrder ? (
            /* DEDICATED FULL ORDER DETAILS PAGE (NO MODAL) */
            <div className="space-y-4 text-left">
              {/* Breadcrumb Navigation Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--theme-border-subtle)] pb-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] text-xs font-semibold text-[var(--theme-text-heading)] border border-[var(--theme-border-subtle)] transition-colors cursor-pointer"
                  >
                    ← Back to All Bookings
                  </button>
                  <span className="font-mono font-bold text-orange-500 text-sm">
                    Order #{selectedOrder.orderId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--theme-text-muted)] font-medium">Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.orderId, e.target.value)}
                    className="bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] rounded-xl px-3 py-1.5 text-xs text-[var(--theme-text-heading)] font-semibold outline-none focus:border-orange-500 cursor-pointer shadow-xs"
                  >
                    <option>Pending Review</option>
                    <option>Session Scheduled</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Full View Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Card 1: Client Overview & Direct WhatsApp */}
                <div className="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card)] p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-[var(--theme-border-subtle)] pb-2.5">
                    <User className="w-4 h-4 text-orange-500" />
                    <h3 className="font-semibold text-[var(--theme-text-heading)] text-sm">Client Contact</h3>
                  </div>

                  <div className="space-y-3 text-xs text-[var(--theme-text-secondary)]">
                    <div>
                      <span className="text-[var(--theme-text-dim)] block text-[10px] uppercase font-bold tracking-wider">Client Name</span>
                      <span className="text-base font-bold text-[var(--theme-text-heading)]">{selectedOrder.clientName}</span>
                    </div>
                    <div>
                      <span className="text-[var(--theme-text-dim)] block text-[10px] uppercase font-bold tracking-wider">Email Address</span>
                      <a href={`mailto:${selectedOrder.email}`} className="text-orange-500 hover:underline font-mono">{selectedOrder.email}</a>
                    </div>
                    <div>
                      <span className="text-[var(--theme-text-dim)] block text-[10px] uppercase font-bold tracking-wider">Phone / WhatsApp</span>
                      <span className="text-[var(--theme-text-heading)] font-mono font-medium">{selectedOrder.phone}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat with Client on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Card 2: Services & Pricing Details */}
                <div className="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card)] p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-[var(--theme-border-subtle)] pb-2.5">
                    <ClipboardList className="w-4 h-4 text-orange-500" />
                    <h3 className="font-semibold text-[var(--theme-text-heading)] text-sm">Services & Pricing</h3>
                  </div>

                  <div className="space-y-3 text-xs text-[var(--theme-text-secondary)]">
                    <div>
                      <span className="text-[var(--theme-text-dim)] block text-[10px] uppercase font-bold tracking-wider">Booked Session</span>
                      <span className="text-[var(--theme-text-heading)] font-semibold text-sm">{selectedOrder.services?.join(', ') || 'Spiritual Session'}</span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-[var(--theme-text-dim)] block text-[10px] uppercase font-bold tracking-wider">Total Value</span>
                        <span className="text-lg font-cinzel font-bold text-gradient-orange">{selectedOrder.total}</span>
                      </div>
                      <div>
                        <span className="text-[var(--theme-text-dim)] block text-[10px] uppercase font-bold tracking-wider">Payment Status</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Spiritual Birth Details & Client Questions */}
                <div className="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card)] p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-[var(--theme-border-subtle)] pb-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="font-semibold text-[var(--theme-text-heading)] text-sm">Consultation Context</h3>
                  </div>

                  <div className="space-y-2.5 text-xs text-[var(--theme-text-secondary)]">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[var(--theme-text-dim)] block text-[10px] uppercase font-bold tracking-wider">Date of Birth</span>
                        <span className="text-[var(--theme-text-heading)] font-semibold">{selectedOrder.details?.dob || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[var(--theme-text-dim)] block text-[10px] uppercase font-bold tracking-wider">Birth Time</span>
                        <span className="text-[var(--theme-text-heading)] font-semibold">{selectedOrder.details?.birthTime || 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[var(--theme-text-dim)] block text-[10px] uppercase font-bold tracking-wider">Birth Place</span>
                        <span className="text-[var(--theme-text-heading)] font-semibold">{selectedOrder.details?.birthPlace || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[var(--theme-text-dim)] block text-[10px] uppercase font-bold tracking-wider">Mother's Name</span>
                        <span className="text-[var(--theme-text-heading)] font-semibold">{selectedOrder.details?.motherName || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[var(--theme-text-dim)] block text-[10px] uppercase font-bold tracking-wider mb-1">Client Questions & Focus</span>
                      <p className="p-3 rounded-xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] italic text-xs leading-relaxed text-[var(--theme-text-primary)]">
                        "{selectedOrder.details?.questions || 'No specific questions entered.'}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ORDERS TABLE LIST VIEW */
            <div className="space-y-3.5 text-left">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-[var(--theme-text-muted)] mr-1 flex items-center gap-1 font-semibold">
                    <Filter className="w-3 h-3 text-orange-500" /> Status:
                  </span>
                  {['All', 'Pending Review', 'Session Scheduled', 'Completed', 'Cancelled'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        statusFilter === st 
                          ? 'bg-orange-500 text-white shadow-xs font-semibold' 
                          : 'bg-[var(--theme-bg-card)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-heading)] border border-[var(--theme-border-subtle)]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[var(--theme-text-dim)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search client, email, ref ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[var(--theme-bg-card)] border border-[var(--theme-border-default)] rounded-xl text-xs text-[var(--theme-text-heading)] placeholder-[var(--theme-text-dim)] focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card)] backdrop-blur-md shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--theme-bg-card-subtle)] text-[var(--theme-text-muted)] border-b border-[var(--theme-border-subtle)] uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Ref ID</th>
                      <th className="py-2.5 px-3">Client</th>
                      <th className="py-2.5 px-3">Selected Services</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--theme-border-subtle)] text-[var(--theme-text-secondary)]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[var(--theme-text-muted)] text-xs">
                          No orders matching the current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.orderId} className="hover:bg-[var(--theme-bg-card-hover)] transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-orange-500 text-[11px] whitespace-nowrap">
                            {ord.orderId}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-[var(--theme-text-heading)] text-xs">{ord.clientName}</div>
                            <div className="text-[10px] text-[var(--theme-text-dim)] font-mono">{ord.email}</div>
                          </td>
                          <td className="py-2.5 px-3 max-w-[240px]">
                            <div className="truncate text-[var(--theme-text-heading)] font-medium text-xs">{ord.services?.join(', ') || 'Spiritual Session'}</div>
                          </td>
                          <td className="py-2.5 px-3 font-cinzel font-bold text-[var(--theme-text-heading)] text-xs whitespace-nowrap">
                            {ord.total}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <select
                              value={ord.status}
                              onChange={(e) => handleStatusChange(ord.orderId, e.target.value)}
                              className="bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] rounded-lg px-2 py-1 text-[11px] text-[var(--theme-text-heading)] outline-none focus:border-orange-500 cursor-pointer font-medium"
                            >
                              <option>Pending Review</option>
                              <option>Session Scheduled</option>
                              <option>Completed</option>
                              <option>Cancelled</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(ord)}
                              className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500 hover:text-white text-orange-500 text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer border border-orange-500/25"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Details</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* TAB 2: CONTACT INQUIRIES */}
        {activeTab === 'messages' && (
          <div className="space-y-3 text-left">
            {messages.length === 0 ? (
              <div className="p-12 text-center text-[var(--theme-text-muted)] rounded-2xl bg-[var(--theme-bg-card)] border border-[var(--theme-border-subtle)]">
                No contact inquiries received yet.
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="p-4 sm:p-5 rounded-2xl bg-[var(--theme-bg-card)] border border-[var(--theme-border-subtle)] space-y-2.5 shadow-xs transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-[var(--theme-text-heading)] text-sm sm:text-base">{msg.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-500 font-semibold border border-orange-500/30">
                      {msg.serviceInterest}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--theme-text-muted)] flex flex-wrap items-center gap-4">
                    <span>Email: <strong className="text-[var(--theme-text-heading)]">{msg.email}</strong></span>
                    <span>Phone: <strong className="text-[var(--theme-text-heading)]">{msg.phone}</strong></span>
                  </div>
                  <p className="text-xs text-[var(--theme-text-secondary)] bg-[var(--theme-bg-card-subtle)] p-3 rounded-xl italic border border-[var(--theme-border-subtle)]">
                    "{msg.message}"
                  </p>
                  <div className="pt-1">
                    <a
                      href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
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
          <div className="space-y-4 text-left">
            <div className="p-5 rounded-2xl bg-[var(--theme-bg-card)] border border-orange-500/20 space-y-3 shadow-xs">
              <h4 className="text-sm font-bold text-[var(--theme-text-heading)] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Sanctuary Backend Architecture Status</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)]">
                  <span className="text-[var(--theme-text-muted)] block mb-1">Database Engine</span>
                  <span className="text-emerald-500 font-semibold text-sm">MongoDB Connected</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)]">
                  <span className="text-[var(--theme-text-muted)] block mb-1">PayPal Gateway</span>
                  <span className="text-amber-500 font-semibold text-sm">Sandbox / Live Ready (GBP)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)]">
                  <span className="text-[var(--theme-text-muted)] block mb-1">Email Transport</span>
                  <span className="text-sky-500 font-semibold text-sm">Nodemailer SMTP Engine</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--theme-bg-card)] border border-orange-500/20 space-y-3 shadow-xs">
              <h4 className="text-sm font-bold text-[var(--theme-text-heading)] flex items-center gap-2">
                <Send className="w-4 h-4 text-orange-500" />
                <span>Nodemailer Diagnostics Dispatch</span>
              </h4>
              <p className="text-xs text-[var(--theme-text-secondary)]">
                Trigger a live diagnostic test email to verify your SMTP configuration in <code className="text-orange-500 font-mono">server/.env</code>.
              </p>
              <button
                type="button"
                onClick={handleSendTestEmail}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md cursor-pointer"
              >
                Send Test Email to {adminUser?.email}
              </button>
              {emailStatus && (
                <p className="text-xs text-amber-500 font-medium pt-1">{emailStatus}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'catalog' && <AdminCatalog />}

        </main>
      </div>

    </div>
  );
}
