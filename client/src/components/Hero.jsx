import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Moon, Star, Compass, Award } from 'lucide-react';
import { siteData } from '../data';

export default function Hero({ onExploreServices, onSelectPackage, onOpenCart }) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const featuredTarotCards = [
    {
      name: "The Sun",
      sub: "XIX • Vitality & Truth",
      symbol: "☀️",
      quote: "Clarity dispels darkness and reveals the road ahead.",
      tag: "Enlightenment"
    },
    {
      name: "The Lovers",
      sub: "VI • Connection & Choice",
      quote: "Spiritual affinity, emotional balance, and true harmony.",
      symbol: "❤️",
      tag: "Relationships"
    },
    {
      name: "The Star",
      sub: "XVII • Hope & Renewal",
      quote: "Faith in the divine cosmos guiding you through transition.",
      symbol: "✨",
      tag: "Life Direction"
    }
  ];

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Grid: Left copy, Right visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Headlines & Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-300 text-xs sm:text-sm font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{siteData.tagline}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--theme-text-heading)] leading-[1.15]">
              Find Your Path With <br />
              <span className="text-gradient-orange">Sacred Wisdom</span> & Clarity
            </h1>

            {/* Sub-headline description */}
            <p className="text-base sm:text-lg text-[var(--theme-text-secondary)] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-jakarta">
              With <span className="text-orange-500 font-semibold">{siteData.about.experience} of dedicated professional experience</span>, Kashif provides profound tarot, Vedic astrology, and numerology readings. Specialising in <span className="font-semibold text-[var(--theme-text-heading)]">love, relationship clarity, and personal life direction</span> for UK & international clients.
            </p>

            {/* Key Service Highlights Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {['Love & Twin Flame Focus', 'Authentic Vedic Charts', 'Phone Number Numerology', 'Spiritual Cleansing'].map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 text-xs rounded-full bg-[var(--theme-bg-card-subtle)] border border-orange-500/20 text-orange-600 dark:text-orange-200/90 flex items-center gap-1.5 font-medium transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {item}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/book?package=complete"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Book Complete Package £169</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/services"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-[var(--theme-text-primary)] bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] border border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Compass className="w-4 h-4 text-orange-500" />
                <span>Explore All 9 Services</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[var(--theme-border-subtle)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/25 text-orange-500">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--theme-text-heading)]">12+ Years</div>
                  <div className="text-xs text-[var(--theme-text-muted)]">Master Experience</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-500">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--theme-text-heading)]">Love Focus</div>
                  <div className="text-xs text-[var(--theme-text-muted)]">Relationship Clarity</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/25 text-orange-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--theme-text-heading)]">Confidential</div>
                  <div className="text-xs text-[var(--theme-text-muted)]">Safe Sanctuary</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-500">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--theme-text-heading)]">UK & Global</div>
                  <div className="text-xs text-[var(--theme-text-muted)]">Online & WhatsApp</div>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Hero Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Ambient Backlight */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-orange-600/20 via-amber-500/15 to-purple-600/15 rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative rounded-2xl overflow-hidden border border-orange-500/30 bg-[var(--theme-bg-card)] shadow-2xl backdrop-blur-md p-3 sm:p-4 transition-colors">

              {/* Image banner with velvet tarot setup */}
              <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden group">
                <img
                  src="/images/hero.jpg"
                  alt="Kashif Mystical Tarot Reading"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                {/* Live Session Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-orange-500/40 text-[11px] font-semibold text-orange-300 flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Accepting Bookings • UK & International</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <div className="text-xs font-cinzel text-amber-300 tracking-wider">SACRED TAROT ALTAR</div>
                  <div className="text-sm font-semibold text-white drop-shadow-md">
                    "Every enquiry begins with what matters to you."
                  </div>
                </div>
              </div>

              {/* Interactive Tarot Card Deck Selector */}
              <div className="mt-4 pt-3 border-t border-[var(--theme-border-subtle)]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Interactive Tarot Wisdom
                  </span>
                  <span className="text-[11px] text-[var(--theme-text-dim)]">Click to reveal</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {featuredTarotCards.map((card, idx) => (
                    <button
                      key={card.name}
                      onClick={() => setActiveCardIndex(idx)}
                      className={`p-2.5 rounded-lg text-left transition-all duration-200 border cursor-pointer ${
                        activeCardIndex === idx
                          ? 'bg-orange-500/15 border-orange-500 text-[var(--theme-text-heading)] shadow-[0_0_12px_rgba(249,115,22,0.3)]'
                          : 'bg-[var(--theme-bg-card-subtle)] border-[var(--theme-border-subtle)] text-[var(--theme-text-muted)] hover:border-orange-500/40 hover:text-[var(--theme-text-primary)]'
                      }`}
                    >
                      <div className="text-xl mb-1">{card.symbol}</div>
                      <div className="text-xs font-bold text-[var(--theme-text-heading)] truncate">{card.name}</div>
                      <div className="text-[10px] text-orange-500 truncate font-medium">{card.tag}</div>
                    </button>
                  ))}
                </div>

                {/* Card Interpretation Highlight */}
                <motion.div
                  key={activeCardIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 rounded-lg bg-[var(--theme-bg-card-subtle)] border border-orange-500/20 text-left transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-orange-500 font-semibold mb-1">
                    <span>{featuredTarotCards[activeCardIndex].sub}</span>
                    <span className="px-2 py-0.5 rounded bg-orange-500/15 text-[10px] text-orange-600 dark:text-amber-300 font-semibold">
                      Spiritual Prompt
                    </span>
                  </div>
                  <p className="text-xs text-[var(--theme-text-primary)] italic font-serif">
                    "{featuredTarotCards[activeCardIndex].quote}"
                  </p>
                </motion.div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
