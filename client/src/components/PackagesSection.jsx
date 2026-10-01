import React from 'react';
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Spiritual Suites</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Comprehensive Guidance Packages
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-jakarta">
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
            className="lg:col-span-7 relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#111728] to-[#0a0d17] border-2 border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.25)] flex flex-col justify-between text-left group"
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
                
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  {primaryPackage.savings || "Save £71"}
                </span>
              </div>

              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                {primaryPackage.name}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
                {primaryPackage.description}
              </p>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-[#090d16] border border-orange-500/30 flex items-baseline justify-between mb-6">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-medium">All-Inclusive Bundle</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-cinzel text-4xl sm:text-5xl font-black text-gradient-orange">
                      {primaryPackage.price}
                    </span>
                    <span className="text-slate-500 text-lg line-through font-serif">
                      {primaryPackage.originalValue}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                    In High Demand
                  </span>
                </div>
              </div>

              {/* Includes Checklist */}
              <div className="space-y-3 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  What This Master Session Includes:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {primaryPackage.includes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0e1424] border border-white/5">
                      <div className="p-0.5 rounded-full bg-orange-500/20 text-orange-400 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Note */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-400 mb-6 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{primaryPackage.note}</span>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => onAddPackage(primaryPackage)}
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${
                isPrimaryInCart
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] transform hover:-translate-y-0.5'
              }`}
            >
              {isPrimaryInCart ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Package Selected In Your Cart</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Select Complete Package • £169</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

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
                className="rounded-3xl p-6 bg-[#0c101d] border border-orange-500/20 hover:border-orange-500/40 transition-all shadow-lg flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-pink-400" />
                      <span>{secondaryPackage.badge}</span>
                    </span>
                    <span className="font-cinzel text-2xl font-bold text-gradient-orange">
                      {secondaryPackage.price}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-xl font-bold text-white mb-2">
                    {secondaryPackage.name}
                  </h3>

                  <p className="text-xs text-slate-300 mb-4">
                    {secondaryPackage.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {secondaryPackage.includes.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                        <Check className="w-3.5 h-3.5 text-orange-400" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onAddPackage(secondaryPackage)}
                  className={`w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    isSecondaryInCart
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#151c31] hover:bg-[#1f2947] text-white border border-orange-500/30 hover:border-orange-500'
                  }`}
                >
                  {isSecondaryInCart ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added To Selection</span>
                    </>
                  ) : (
                    <>
                      <span>Select Love Suite • {secondaryPackage.price}</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Bespoke Quote & Rituals Card */}
            <div className="p-6 rounded-3xl bg-[#090d16] border border-amber-500/20 text-left space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                <span>Case-Based Spiritual Rituals</span>
              </div>
              <h4 className="font-cinzel text-lg font-bold text-white">
                Love Spells & Black Magic Cleansing
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Belief-based rituals require individual consultation to establish your intentions, spiritual scope, and agreed fees prior to any payment.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors pt-1"
              >
                <span>Request Case Assessment via Contact / WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
