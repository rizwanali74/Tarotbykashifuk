import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Check, Crown, Flame, ShieldAlert, ArrowRight, Star, Heart } from 'lucide-react';
import { siteData } from '../data';

export default function PackagesSection({ onAddPackage, isItemInCart }) {
  const { packages } = siteData;
  const primaryPackage = packages[0];
  const secondaryPackage = packages[1];

  const isPrimaryInCart = isItemInCart(primaryPackage.id);
  const isSecondaryInCart = secondaryPackage ? isItemInCart(secondaryPackage.id) : false;

  return (
    <section id="packages" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Curated Spiritual Suites</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--theme-text-heading)]">
            Comprehensive Guidance Packages
          </h2>
          <p className="text-[var(--theme-text-secondary)] text-base sm:text-lg font-jakarta">
            Synthesize multiple divination disciplines for the deepest clarity, personal transformation, and substantial bundled savings.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Main Featured Package: Complete Spiritual Guidance (£169) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 relative rounded-3xl p-6 sm:p-8 bg-[var(--theme-bg-card)] border-2 border-orange-500/50 shadow-2xl flex flex-col justify-between text-left group transition-colors"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Ribbon & Badges */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-extrabold tracking-wider uppercase shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                  <span>Kashif's Signature Package</span>
                </div>
                
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-500 border border-orange-500/30">
                  {primaryPackage.savings || "Save £71"}
                </span>
              </div>

              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[var(--theme-text-heading)] mb-2 group-hover:text-orange-500 transition-colors">
                {primaryPackage.name}
              </h3>

              <p className="text-sm sm:text-base text-[var(--theme-text-secondary)] mb-6 leading-relaxed">
                {primaryPackage.description}
              </p>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-[var(--theme-bg-card-subtle)] border border-orange-500/30 flex items-baseline justify-between mb-6 transition-colors">
                <div>
                  <div className="text-xs text-[var(--theme-text-muted)] uppercase font-medium">All-Inclusive Bundle</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-cinzel text-4xl sm:text-5xl font-black text-gradient-orange">
                      {primaryPackage.price}
                    </span>
                    <span className="text-[var(--theme-text-dim)] text-lg line-through font-serif">
                      {primaryPackage.originalValue}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                    In High Demand
                  </span>
                </div>
              </div>

              {/* Includes Checklist */}
              <div className="space-y-3 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-orange-500">
                  What This Master Session Includes:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {primaryPackage.includes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] transition-colors">
                      <div className="p-0.5 rounded-full bg-orange-500/15 text-orange-500 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-[var(--theme-text-secondary)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Note */}
              <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 text-xs text-[var(--theme-text-muted)] mb-6 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{primaryPackage.note}</span>
              </div>
            </div>

            {/* Action CTA */}
            <Link
              to="/book?package=complete"
              className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] transform hover:-translate-y-0.5 text-center"
            >
              <Sparkles className="w-5 h-5" />
              <span>Book Complete Package • £169</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

          </motion.div>

          {/* Secondary Specialized Package: Love Suite & Bespoke Quote */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
            
            {/* Love Suite Card */}
            {secondaryPackage && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="rounded-3xl p-6 bg-[var(--theme-bg-card)] border border-orange-500/20 hover:border-orange-500/40 transition-all shadow-lg flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-500 text-xs font-semibold flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-pink-500" />
                      <span>{secondaryPackage.badge}</span>
                    </span>
                    <span className="font-cinzel text-2xl font-bold text-gradient-orange">
                      {secondaryPackage.price}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-xl font-bold text-[var(--theme-text-heading)] mb-2">
                    {secondaryPackage.name}
                  </h3>

                  <p className="text-xs text-[var(--theme-text-secondary)] mb-4">
                    {secondaryPackage.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {secondaryPackage.includes.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[var(--theme-text-secondary)]">
                        <Check className="w-3.5 h-3.5 text-orange-500" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/book?package=relationship"
                  className="w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] text-[var(--theme-text-heading)] border border-orange-500/30 hover:border-orange-500 shadow-sm text-center"
                >
                  <span>Book Love Suite • {secondaryPackage.price}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )}

            {/* Bespoke Quote & Rituals Card */}
            <div className="p-6 rounded-3xl bg-[var(--theme-bg-card-subtle)] border border-amber-500/30 text-left space-y-3 transition-colors shadow-sm">
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                <span>Case-Based Spiritual Rituals</span>
              </div>
              <h4 className="font-cinzel text-lg font-bold text-[var(--theme-text-heading)]">
                Love Spells & Black Magic Cleansing
              </h4>
              <p className="text-xs text-[var(--theme-text-secondary)] leading-relaxed">
                Belief-based rituals require individual consultation to establish your intentions, spiritual scope, and agreed fees prior to any payment.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors pt-1"
              >
                <span>Request Case Assessment via Contact / WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

        {/* Dedicated Packages Page Link */}
        <div className="mt-12 text-center">
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--theme-bg-card)] hover:bg-[var(--theme-bg-card-hover)] text-xs sm:text-sm font-bold text-orange-500 border border-orange-500/30 hover:border-orange-500 shadow-md transition-all hover:scale-105"
          >
            <span>Explore All Guidance Packages & Inclusions Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
