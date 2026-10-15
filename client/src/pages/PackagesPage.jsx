import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CelestialBackground from '../components/CelestialBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MiniHero from '../components/MiniHero';
import SEOHead from '../components/SEOHead';
import { 
  Sparkles, Check, CheckCircle2, ArrowRight, ShieldCheck, 
  Clock, Star, Gift, FileText, Headphones, MessageSquare, Zap 
} from 'lucide-react';

export default function PackagesPage() {
  const navigate = useNavigate();

  const handleBookPackage = (packageId = 'complete') => {
    navigate(`/book?package=${packageId}`);
  };

  const inclusions = [
    {
      icon: Sparkles,
      title: "Comprehensive 78-Card Tarot Spread",
      desc: "Deep exploration of your current relationship, career dilemma, and subconscious crosscurrents."
    },
    {
      icon: FileText,
      title: "Complete Vedic Jyotish Birth Chart (Kundli)",
      desc: "Planetary positions, dasha timeline periods, and karmic life blueprint calculated to exact degree."
    },
    {
      icon: Gift,
      title: "Pythagorean & Chaldean Numerology Profile",
      desc: "Analysis of your life-path number, destiny vibration, and current personal annual cycle."
    },
    {
      icon: Headphones,
      title: "Personalized Audio Guidance Notes",
      desc: "Direct, high-fidelity voice reflections from Master Kashif that you can keep and listen to anytime."
    },
    {
      icon: MessageSquare,
      title: "14-Day Priority WhatsApp Follow-Up",
      desc: "Ask follow-up questions directly within two weeks of your reading for maximum clarity."
    },
    {
      icon: ShieldCheck,
      title: "Custom Gemstone & Yantra Recommendations",
      desc: "Practical spiritual remedies, elemental alignments, and meditation mantras tailored to your chart."
    }
  ];

  const packagesComparison = [
    {
      id: "single",
      name: "Single Focus Reading",
      price: "£65",
      badge: "Targeted Focus",
      popular: false,
      desc: "Ideal if you have one urgent question regarding a partner or career pivot.",
      features: [
        "1 Focused Tarot Spread or Numerology Reading",
        "Up to 3 specific questions explored",
        "Detailed interpretive notes via email",
        "Delivery within 48-72 hours",
        "No Vedic chart calculation included"
      ]
    },
    {
      id: "complete",
      name: "Complete Spiritual Guidance",
      price: "£169",
      badge: "Best Value • Most Popular",
      popular: true,
      desc: "Our holistic master package uniting Tarot, Vedic Astrology, and Numerology for 360° clarity.",
      features: [
        "Full In-Depth Tarot Reading (Love + Career)",
        "Complete Vedic Astrological Chart (Kundli) PDF",
        "Life Path Numerology & Annual Cycle Report",
        "Direct Audio Voice Guidance Notes",
        "14-Day Priority WhatsApp Follow-Up Support",
        "Gemstone & Energetic Alignment Guidance",
        "Priority 24-48 Hour Scheduling"
      ]
    },
    {
      id: "relationship",
      name: "Sacred Relationship Synastry",
      price: "£110",
      badge: "Love & Partnership",
      popular: false,
      desc: "Comprehensive dual-chart astrological synastry and tarot spread for couples or love interests.",
      features: [
        "Two Vedic Natal Charts Cross-Referenced",
        "Karmic Connection & Compatibility Score",
        "Relationship Tarot Spread (Intentions & Blockages)",
        "Detailed Audio Consultation",
        "7-Day WhatsApp Clarification Support"
      ]
    }
  ];

  return (
    <div className="relative min-h-screen bg-transparent text-inherit overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      <SEOHead
        title="Comprehensive Guidance Packages & Bundles | Tarot By Kashif London UK"
        description="Save over 40% with our all-in-one Spiritual Guidance Packages. Includes full Tarot reading, Vedic birth chart (Kundli), numerology report, and WhatsApp follow-up with Master Kashif."
        keywords="tarot package london, vedic astrology bundle uk, spiritual guidance package uk, complete psychic reading london, relationship synastry reading london, kashif guidance package"
        canonicalUrl="https://tarotbykashifuk.com/packages"
      />

      <CelestialBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Mini Hero */}
        <MiniHero
          badge="✦ Comprehensive Guidance Bundles"
          title="All-In-One Sacred Packages For Complete Clarity"
          subtitle="Experience the deepest synthesis of esoteric knowledge. Uniting Tarot, Vedic Jyotish, and Numerology to illuminate every dimension of your destiny."
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Packages", to: null }
          ]}
          highlights={[
            { icon: Zap, text: "Save over 40% compared to separate sessions" },
            { icon: ShieldCheck, text: "Priority 24-48h sanctuary scheduling" },
            { icon: MessageSquare, text: "Direct WhatsApp audio notes included" }
          ]}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          
          {/* Flagship Feature Card */}
          <section className="relative rounded-3xl overflow-hidden border-2 border-orange-500/40 bg-gradient-to-br from-[#0c1122] via-[#090d1a] to-[#070a14] p-6 sm:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold tracking-wider uppercase">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  Flagship Sanctuary Offering
                </div>

                <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  The Complete Spiritual Guidance Package
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Why settle for a single modality when your life is multidimensional? Our flagship package cross-validates your current dilemma using <strong>Tarot archetypes, Vedic planetary dasha timelines, and numerological cycles</strong>, delivering absolute certainty with zero guesswork.
                </p>

                <div className="flex items-baseline gap-3 pt-2">
                  <span className="font-cinzel text-4xl sm:text-5xl font-black text-white">£169</span>
                  <span className="text-xs sm:text-sm text-slate-400 line-through">£245 Value</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    Save £76
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleBookPackage('complete')}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                  >
                    <span>Reserve Complete Package (£169)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="https://wa.me/447400000000"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Inclusions Highlights List */}
              <div className="lg:col-span-5 space-y-3 text-left">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-3.5">
                  <div className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    Everything Included in this Package:
                  </div>
                  {inclusions.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">{item.title}:</strong>
                        <span className="text-slate-400 ml-1">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section: 3-Tier Package Comparison */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">Transparent Tiers</span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[var(--theme-text-heading)]">
                Choose the Guidance Tier That Fits Your Needs
              </h2>
              <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)]">
                All consultations are conducted in GBP with secure payment options via PayPal or direct arrangement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {packagesComparison.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-6 sm:p-8 rounded-3xl flex flex-col justify-between transition-all relative ${
                    pkg.popular
                      ? 'bg-[var(--theme-bg-card)] border-2 border-orange-500 shadow-2xl ring-4 ring-orange-500/10'
                      : 'bg-[var(--theme-bg-card)] border border-[var(--theme-border-subtle)] shadow-md hover:border-orange-500/30'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
                      {pkg.badge}
                    </span>
                  )}

                  <div className="space-y-4">
                    {!pkg.popular && (
                      <span className="text-[10px] font-bold tracking-wider text-orange-500 uppercase">
                        {pkg.badge}
                      </span>
                    )}

                    <div>
                      <h3 className="font-cinzel text-xl font-bold text-[var(--theme-text-heading)]">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-[var(--theme-text-secondary)] mt-1.5 leading-relaxed">
                        {pkg.desc}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="font-cinzel text-3xl sm:text-4xl font-black text-[var(--theme-text-heading)]">
                        {pkg.price}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-[var(--theme-border-subtle)] space-y-2.5">
                      {pkg.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[var(--theme-text-secondary)]">
                          <Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => handleBookPackage(pkg.id)}
                      className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-md hover:scale-[1.02]'
                          : 'bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] text-[var(--theme-text-heading)] border border-[var(--theme-border-subtle)]'
                      }`}
                    >
                      <span>Book {pkg.price}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Detailed Inclusions Grid */}
          <section className="p-8 sm:p-12 rounded-3xl bg-[var(--theme-bg-card)] border border-orange-500/20 shadow-xl space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">In-Depth Breakdown</span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[var(--theme-text-heading)]">
                The 6 Pillars Included in Our Guidance
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {inclusions.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-5 rounded-2xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-cinzel text-base font-bold text-[var(--theme-text-heading)]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--theme-text-secondary)] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </div>
  );
}
