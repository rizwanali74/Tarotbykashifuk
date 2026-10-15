import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShoppingBag, Menu, X, Compass, PhoneCall, 
  Search, ChevronRight, MessageSquare, Mail, Shield, 
  Clock, ArrowRight, UserCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { siteData } from '../data';

export default function Navbar({ 
  cartItems = [], 
  onOpenCart, 
  onOpenDashboard
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cartItems.length;

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Services', to: '/services' },
    { name: 'Packages', to: '/packages' },
    { name: 'About Kashif', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      
      {/* 1. TOPBAR: LUXURY SANCTUARY ANNOUNCEMENT & CONTACT */}
      <div className="navbar-topbar py-1.5 px-3 sm:px-6 text-[11px] transition-colors border-b backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Topbar Left: Sanctuary Status */}
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate hidden sm:inline font-medium text-[var(--theme-text-secondary)]">
              ✦ UK & International Spiritual Sanctuary • Readings in GBP (£) • Direct WhatsApp Guidance
            </span>
            <span className="sm:hidden font-medium truncate text-[var(--theme-text-secondary)]">
              ✦ UK & Worldwide Consultations in GBP
            </span>
          </div>

          {/* Topbar Right: WhatsApp Direct Concierge */}
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="https://wa.me/447400000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 font-semibold transition-colors group"
              title="Message Kashif directly on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline text-[11px]">WhatsApp Concierge:</span>
              <span className="tracking-wide font-mono">{siteData.contact.whatsapp}</span>
            </a>

            <span className="opacity-20 hidden md:inline">|</span>

            {/* Email Contact */}
            <a
              href={`mailto:${siteData.contact.email}`}
              className="hidden md:flex items-center gap-1 text-[var(--theme-text-muted)] hover:text-orange-400 transition-colors"
            >
              <Mail className="w-3 h-3 text-orange-400" />
              <span>{siteData.contact.email}</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. MAIN NAVBAR: GLASSMORPHISM & CLEAN PROFESSIONAL ACTIONS */}
      <div 
        className={`w-full transition-all duration-300 navbar-main backdrop-blur-xl ${
          isScrolled 
            ? 'navbar-scrolled py-2 sm:py-2.5 shadow-lg border-b border-[var(--theme-border-subtle)]' 
            : 'py-3 sm:py-3.5 bg-[var(--theme-bg-surface)]/75 border-b border-[var(--theme-border-subtle)]/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand Logo & Title */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 opacity-50 blur-sm group-hover:opacity-90 transition-all duration-300" />
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-orange-400 bg-white p-0.5 shadow-md">
                  <img 
                    src="/images/logo.jpg" 
                    alt="Tarot By Kashif Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="flex flex-col text-left">
                <span className="font-cinzel text-base sm:text-lg font-bold tracking-wider text-[var(--theme-text-heading)] group-hover:text-orange-500 transition-colors leading-tight">
                  TAROT BY KASHIF
                </span>
                <span className="text-[10px] tracking-widest text-orange-500 uppercase font-medium flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  Astro & Numerology
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.name}
                    to={link.to}
                    className={`relative px-3.5 py-1.5 text-xs xl:text-sm font-semibold rounded-full transition-all duration-200 ${
                      isActive 
                        ? 'text-orange-500 bg-orange-500/10 font-bold' 
                        : 'text-[var(--theme-text-secondary)] hover:text-orange-500 hover:bg-orange-500/5'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-orange-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Cluster: Elegant, Professional, Hierarchy-Driven */}
            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              
              {/* 1. Track Order Utility Button (Refined & Uncluttered) */}
              <button
                id="nav-orders-btn"
                onClick={onOpenDashboard}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[var(--theme-text-secondary)] hover:text-orange-400 bg-transparent hover:bg-white/5 rounded-xl border border-transparent hover:border-[var(--theme-border-subtle)] transition-all cursor-pointer"
                title="Lookup consultation status & birth chart records"
              >
                <Search className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden xl:inline">Track Order</span>
              </button>

              {/* 2. Selection / Cart Pill with Badge */}
              <Link
                id="nav-cart-btn"
                to="/book"
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] border border-[var(--theme-border-subtle)] hover:border-orange-500/40 text-xs font-semibold text-[var(--theme-text-heading)] transition-all shadow-xs group"
                title="View your reading cart and selection"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline">
                  {totalCartCount > 0 ? `Selection (${totalCartCount})` : 'Cart'}
                </span>
              </Link>

              {/* 3. Primary Focal CTA: Single, Luxurious "Book Consultation" Button */}
              <Link
                to="/book"
                className="relative group overflow-hidden px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500" />
                <span className="relative flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Book Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>

            </div>

            {/* Mobile / Tablet Controls (< 1024px) */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                to="/book"
                className="relative p-2.5 rounded-xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] text-orange-400 cursor-pointer shadow-xs"
                aria-label="View Selection"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </Link>

              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] text-[var(--theme-text-heading)] hover:text-orange-500 focus:outline-none cursor-pointer shadow-xs"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 3. MOBILE SLIDE-OUT DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-b navbar-mobile-drawer px-4 pt-4 pb-6 shadow-2xl text-left bg-[var(--theme-bg-surface)]/95 backdrop-blur-2xl"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.name}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive 
                        ? 'text-orange-500 bg-orange-500/10 font-bold' 
                        : 'text-[var(--theme-text-heading)] hover:text-orange-500 hover:bg-orange-500/5'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-orange-500/60" />
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-[var(--theme-border-subtle)] flex flex-col gap-2.5">
                <Link
                  to="/book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-xs font-bold text-white uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Book Consultation Online</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] text-xs font-semibold text-[var(--theme-text-heading)] hover:text-orange-500 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-orange-400" />
                  <span>Track Your Consultation / Order Status</span>
                </button>

                <a
                  href="https://wa.me/447400000000"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-300"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span>WhatsApp Concierge (+44 7400 000000)</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
