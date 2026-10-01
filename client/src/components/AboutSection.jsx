import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HeartHandshake, Compass, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { siteData } from '../data';

export default function AboutSection() {
  const { about } = siteData;

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Meet Kashif</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            12 Years of Spiritual Mastery & Compassionate Insight
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-jakarta">
            Bridging ancient esoteric knowledge with grounded, heart-centered guidance for modern life.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Altar Artwork & Credentials */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-orange-500/30 bg-[#0d1220] shadow-[0_20px_50px_rgba(0,0,0,0.7)] group">
              <img 
                src="/images/altar.jpg" 
                alt="Kashif Spiritual Sanctuary Altar" 
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d16] via-[#0a0d16]/30 to-transparent" />

              {/* Floating Quote Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0e1322]/90 backdrop-blur-md border border-orange-500/30 text-left">
                <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kashif's Guiding Philosophy</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 italic font-serif leading-relaxed">
                  "Each enquiry begins with what matters to you. We create space for honesty, clarity, and renewed purpose."
                </p>
              </div>
            </div>

            {/* Glowing Experience Badge Overlay */}
            <div className="absolute -top-4 -right-4 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] border border-amber-300/40 text-center">
              <div className="font-cinzel text-2xl sm:text-3xl font-black">{about.experience}</div>
              <div className="text-[11px] font-medium tracking-wide uppercase">Dedicated Practice</div>
            </div>
          </div>

          {/* Right: Detailed Narrative & 3 Pillars */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="space-y-4 text-slate-200 leading-relaxed font-jakarta">
              <p className="text-base sm:text-lg font-medium text-white">
                {about.description}
              </p>
              <p className="text-sm sm:text-base text-slate-300">
                Whether you find yourself navigating a delicate relationship threshold, seeking your soul's true vocational calling, or desiring inner energetic equilibrium through chakra alignment—Kashif approaches every consultation with profound empathy, absolute confidentiality, and grounded realism.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {about.stats.map((s) => (
                <div key={s.label} className="p-3.5 rounded-xl bg-[#0f1424] border border-orange-500/20 text-center">
                  <div className="font-cinzel text-xl sm:text-2xl font-bold text-gradient-orange">{s.value}</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {/* 3 Pillars of Practice */}
            <div id="philosophy" className="pt-4 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                The Three Pillars of Every Session
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {about.pillars.map((pillar) => (
                  <div 
                    key={pillar.title} 
                    className="p-4 rounded-xl bg-[#0d1222] border border-white/10 hover:border-orange-500/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-2.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1.5">{pillar.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
