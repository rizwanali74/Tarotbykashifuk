import React from 'react';
import { Sparkles, Heart, Shield, MessageSquare, Mail, Compass, ArrowUp } from 'lucide-react';
import { siteData } from '../data';

export default function Footer({ services = [], onOpenOrders }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#05070b] border-t border-orange-500/20 pt-16 pb-12 overflow-hidden text-left">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-orange-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
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
                <span className="font-cinzel text-lg font-bold text-white tracking-wider block">
                  TAROT BY KASHIF
                </span>
                <span className="text-xs text-orange-400 font-medium tracking-widest uppercase">
                  Astro & Numerology
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              With 12 years of professional experience, Kashif offers bespoke tarot, Vedic astrology, numerology, and energetic sessions for UK and international clients.
            </p>

            <div className="pt-2 text-xs text-orange-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{siteData.tagline}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider text-orange-400">
              Spiritual Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {services.map((service) => (
                <li key={service.id}>
                  <a href="#services" className="hover:text-orange-400 transition-colors">
                    {service.name} ({service.price})
                  </a>
                </li>
              ))}
              <li><a href="#packages" className="hover:text-orange-400 transition-colors">Complete Package (£169)</a></li>
            </ul>
          </div>

          {/* Client Portal & Support */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider text-orange-400">
              Client Portal & Contact
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={onOpenOrders}
                  className="text-orange-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Check Your Reading Order Status</span>
                </button>
              </li>
              <li>
                <span className="text-slate-300">WhatsApp: </span>
                <a href="https://wa.me/447400000000" target="_blank" rel="noreferrer" className="text-white hover:text-emerald-400">
                  {siteData.contact.whatsapp}
                </a>
              </li>
              <li>
                <span className="text-slate-300">Email: </span>
                <span className="text-white">{siteData.contact.email}</span>
              </li>
              <li>
                <span className="text-slate-300">Payment: </span>
                <span className="text-amber-300">Official PayPal Invoicing in GBP (£)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Ethical & Legal Disclaimer Box */}
        <div className="my-8 p-4 rounded-xl bg-[#090c14] border border-white/5 text-[11px] text-slate-500 leading-relaxed">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-orange-400" />
            <span>Spiritual Practice Notice & Ethical Disclaimer</span>
          </div>
          <p>
            All readings, tarot interpretations, astrological charts, and spiritual sessions provided by Kashif are intended solely for personal reflection, guidance, and spiritual insight. Kashif does not offer medical, psychological, legal, or financial counsel. No ritual or reading guarantees future outcomes or controls third-party decisions. Prices are stated in GBP (£). Completing a booking form requests an appointment; times and PayPal arrangements are confirmed individually.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Tarot By Kashif. All rights reserved. Astro & Numerology Sanctuary.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1322] hover:bg-[#161d33] text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
