import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShoppingBag, Menu, X, Compass, PhoneCall, 
  BarChart3, ChevronRight, MessageSquare, Mail, Shield, Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteData } from '../data';

export default function Navbar({ 
  cartItems = [], 
  onOpenCart, 
  onOpenDashboard
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cartItems.length;

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Packages', href: '#packages' },
    { name: 'About Kashif', href: '#about' },
    { name: 'Philosophy', href: '#philosophy' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      
      {/* 1. TOPBAR (WhatsApp & Email Contact) */}
      <div className="bg-[#05070c] border-b border-orange-500/15 py-1.5 px-3 sm:px-6 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Topbar Left: Sanctuary Tagline */}
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
            <span className="truncate hidden sm:inline text-orange-200/90 font-medium">
              ✦ UK & International Spiritual Sanctuary • Professional Readings in GBP (£)
            </span>
            <span className="sm:hidden text-orange-200/90 font-medium truncate">
              ✦ UK & Worldwide Spiritual Readings
            </span>
          </div>

          {/* Topbar Right: WhatsApp Contact & Email */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Direct WhatsApp Contact Button */}
            <a
              href="https://wa.me/447400000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors group"
              title="Chat directly with Kashif on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">WhatsApp:</span>
              <span className="tracking-wide">{siteData.contact.whatsapp}</span>
            </a>

            <span className="text-white/20 hidden md:inline">|</span>

            {/* Email Contact */}
            <a
              href={`mailto:${siteData.contact.email}`}
              className="flex items-center gap-1 text-slate-300 hover:text-orange-400 transition-colors"
            >
              <Mail className="w-3 h-3 text-orange-400" />
              <span>{siteData.contact.email}</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. MAIN NAVBAR (Responsive across all desktop widths 1024px - 4K) */}
      <div 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#07090e]/95 backdrop-blur-md border-b border-orange-500/25 shadow-[0_12px_35px_rgba(0,0,0,0.85)] py-2 sm:py-2.5' 
            : 'bg-[#07090e]/80 backdrop-blur-sm py-3 sm:py-3.5 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            
            {/* Brand Logo & Title */}
            <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 opacity-60 blur-sm group-hover:opacity-100 transition-all duration-300" />
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-orange-400/90 bg-white p-0.5 shadow-md">
                  <img 
                    src="/images/logo.jpg" 
                    alt="Tarot By Kashif Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="flex flex-col text-left">
                <span className="font-cinzel text-base sm:text-lg font-bold tracking-wider text-white group-hover:text-orange-400 transition-colors leading-tight">
                  TAROT BY KASHIF
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium tracking-widest text-orange-400/90 uppercase flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  Astro & Numerology
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3 py-1.5 text-xs lg:text-sm font-medium text-slate-300 hover:text-orange-400 hover:bg-orange-500/10 rounded-full transition-all duration-150"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              
              {/* Order Status Tracker */}
              <button
                id="nav-orders-btn"
                onClick={onOpenDashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#0e1320] hover:bg-[#161c2d] border border-orange-500/20 hover:border-orange-500/50 rounded-lg transition-all"
                title="View your orders, booking status & Kashif's Monthly Dashboard"
              >
                <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden xl:inline">Orders & Status</span>
                <span className="xl:hidden">Status</span>
              </button>

              {/* Cart / Selection Pill */}
              <button
                id="nav-cart-btn"
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 px-3 py-1.5 bg-[#121624] hover:bg-[#1a2136] border border-orange-500/30 hover:border-orange-400 rounded-full text-white text-xs font-semibold transition-all group shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
                <span>Selection</span>
                {totalCartCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Book CTA */}
              <a
                href="#packages"
                className="relative group overflow-hidden px-4 py-2 rounded-full font-bold text-xs text-white uppercase tracking-wider shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500" />
                <span className="relative flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Book £169</span>
                </span>
              </a>
            </div>

            {/* Mobile / Tablet Controls (< 1024px) */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-lg bg-[#121624] border border-orange-500/30 text-orange-400"
                aria-label="View Selection"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </button>

              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-[#121624] border border-orange-500/30 text-white hover:text-orange-400 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-b border-orange-500/20 bg-[#080b13]/98 backdrop-blur-xl px-4 pt-3 pb-6 shadow-2xl text-left"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-orange-400/60" />
                </a>
              ))}

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                <a
                  href="https://wa.me/447400000000"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-xs font-semibold text-emerald-300"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp (+44 7400 000000)</span>
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#111625] border border-orange-500/30 text-xs font-semibold text-orange-300"
                >
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                  <span>Client Order Status Lookup</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCart();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 text-xs font-bold text-white shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Review Selection & Book ({totalCartCount})</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
