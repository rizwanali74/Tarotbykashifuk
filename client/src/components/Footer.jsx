import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, MessageSquare, Mail, Compass, ArrowUp } from 'lucide-react';
import { siteData } from '../data';

export default function Footer({ services = [], onOpenOrders }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative bg-[var(--theme-bg-surface)] border-t border-[var(--theme-border-subtle)] pt-16 pb-12 overflow-hidden text-left transition-colors">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-orange-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[var(--theme-border-subtle)]">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 border-2 border-orange-400 overflow-hidden shadow-md">
                <img 
                  src="/images/logo.jpg" 
                  alt="Tarot By Kashif" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-cinzel text-lg font-bold text-[var(--theme-text-heading)] tracking-wider block">
                  TAROT BY KASHIF
                </span>
                <span className="text-xs text-orange-500 font-medium tracking-widest uppercase">
                  Astro & Numerology
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] leading-relaxed max-w-sm">
              With 12 years of professional experience, Kashif offers bespoke tarot, Vedic astrology, numerology, and energetic sessions for UK and international clients.
            </p>

            <div className="pt-2 text-xs text-orange-500 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{siteData.tagline}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-orange-500">
              Sanctuary Pages
            </h4>
            <ul className="space-y-2 text-xs text-[var(--theme-text-secondary)]">
              <li>
                <Link to="/" className="hover:text-orange-500 transition-colors">Home Experience</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-500 transition-colors">About Master Kashif</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-orange-500 transition-colors">All Sacred Services</Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-orange-500 transition-colors font-medium">Guidance Packages</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-500 transition-colors">Contact Sanctuary</Link>
              </li>
              <li>
                <Link to="/book" className="text-orange-400 font-bold hover:underline">Book Consultation Online</Link>
              </li>
            </ul>
          </div>

          {/* Client Portal & Support */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-orange-500">
              Client Portal & Contact
            </h4>
            <ul className="space-y-2 text-xs text-[var(--theme-text-secondary)]">
              <li>
                <button 
                  onClick={onOpenOrders}
                  className="text-orange-500 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span>Check Your Reading Order Status</span>
                </button>
              </li>
              <li>
                <span className="text-[var(--theme-text-muted)]">WhatsApp: </span>
                <a 
                  href="https://wa.me/447400000000" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[var(--theme-text-heading)] hover:text-emerald-500 font-medium"
                >
                  {siteData.contact.whatsapp}
                </a>
              </li>
              <li>
                <span className="text-[var(--theme-text-muted)]">Email: </span>
                <span className="text-[var(--theme-text-heading)]">{siteData.contact.email}</span>
              </li>
              <li>
                <span className="text-[var(--theme-text-muted)]">Payment: </span>
                <span className="text-amber-500 font-medium">Official PayPal Invoicing in GBP (£)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Ethical & Legal Disclaimer Box */}
        <div className="my-8 p-4 rounded-xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] text-[11px] text-[var(--theme-text-muted)] leading-relaxed transition-colors">
          <div className="flex items-center gap-1.5 text-orange-500 font-bold uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-orange-500" />
            <span>Spiritual Practice Notice & Ethical Disclaimer</span>
          </div>
          <p>
            All readings, tarot interpretations, astrological charts, and spiritual sessions provided by Kashif are intended solely for personal reflection, guidance, and spiritual insight. Kashif does not offer medical, psychological, legal, or financial counsel. No ritual or reading guarantees future outcomes or controls third-party decisions. Prices are stated in GBP (£). Completing a booking form requests an appointment; times and PayPal arrangements are confirmed individually.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--theme-text-dim)]">
          <div>
            © {new Date().getFullYear()} Tarot By Kashif. All rights reserved. Astro & Numerology Sanctuary.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-heading)] border border-[var(--theme-border-subtle)] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-orange-500" />
          </button>
        </div>

      </div>
    </footer>
  );
}
