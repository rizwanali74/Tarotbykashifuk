import React from 'react';
import { Link } from 'react-router-dom';
import CelestialBackground from '../components/CelestialBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MiniHero from '../components/MiniHero';
import SEOHead from '../components/SEOHead';
import { siteData } from '../data';
import { 
  Sparkles, Award, Shield, Heart, Compass, CheckCircle2, 
  ArrowRight, Star, BookOpen, Sun, Moon, Eye 
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: "Years of Dedicated Practice", value: "12+" },
    { label: "Global Clients Illuminated", value: "3,500+" },
    { label: "Consultations Delivered", value: "10,000+" },
    { label: "Positive Client Satisfaction", value: "99.4%" },
  ];

  const ethics = [
    {
      title: "No Fear-Based Predictions",
      desc: "We do not believe in fatalistic curses or manipulative warnings. Every reading is grounded in spiritual empowerment, self-agency, and constructive clarity."
    },
    {
      title: "100% Confidential Sanctuary",
      desc: "Your identity, birth records, questions, and audio recordings remain strictly sacred and confidential between you and Master Kashif."
    },
    {
      title: "Ancient Roots & Rigorous Study",
      desc: "Our methodology harmonizes classical Vedic Jyotish chart calculations, sacred Tarot symbology, and traditional Pythagorean numerological cycles."
    },
    {
      title: "Global Accessibility & Care",
      desc: "Whether you connect from London, Manchester, New York, Dubai, or Islamabad, sessions are delivered with equal compassion and exact timezone coordination."
    }
  ];

  const galleryItems = [
    {
      title: "Sacred Tarot Altar",
      subtitle: "Traditional 78-card archetypal symbology",
      image: "/images/tarot-card.jpg"
    },
    {
      title: "Vedic Jyotish Charts",
      subtitle: "Planetary positions & karmic blueprints",
      image: "/images/birth-chart.jpg"
    },
    {
      title: "Energy & Chakra Resonance",
      subtitle: "Balancing subtle auric fields",
      image: "/images/chakra.jpg"
    },
    {
      title: "Sacred Sanctuary Atmosphere",
      subtitle: "Meditative, incense-cleansed environment",
      image: "/images/altar.jpg"
    }
  ];

  return (
    <div className="relative min-h-screen bg-transparent text-inherit overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      <SEOHead
        title="About Master Kashif ✦ Best Tarot Reader & Vedic Astrologer London UK"
        description="Learn about Master Kashif's 12-year spiritual journey, classical Vedic astrology (Jyotish) mastery, tarot insight, and ethical sanctuary practice serving London, UK and international clients."
        keywords="about kashif tarot, best tarot reader london, vedic astrologer london uk, psychic reader london, jyotish astrologer uk, spiritual mentor london, kashif sanctuary"
        canonicalUrl="https://tarotbykashifuk.com/about"
      />

      <CelestialBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Mini Hero */}
        <MiniHero
          badge="✦ Master Kashif's Sanctuary"
          title="12 Years of Spiritual Mastery & Compassionate Insight"
          subtitle="Discover the lineage, philosophy, and ethical foundation behind one of the UK's most trusted Tarot and Vedic Astrology sanctuaries."
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "About Kashif", to: null }
          ]}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          
          {/* Section 1: Kashif's Story & Lineage */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Visual Portrait Card */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500" />
              <div className="relative rounded-2xl overflow-hidden border border-orange-500/20 bg-[var(--theme-bg-card)] shadow-2xl">
                <img 
                  src="/images/kashif-photo.jpg" 
                  alt="Master Kashif - Spiritual Reader and Astrologer"
                  className="w-full h-80 sm:h-96 object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="p-5 border-t border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card-subtle)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-[var(--theme-text-heading)]">Master Kashif</h3>
                      <p className="text-xs text-orange-500 font-medium">Intuitive Reader & Jyotish Scholar</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold">
                      12+ Years Practice
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold tracking-wide uppercase">
                <Eye className="w-3.5 h-3.5" />
                <span>Our Heritage & Origin</span>
              </div>

              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--theme-text-heading)] leading-snug">
                Bridging Ancient Vedic Traditions With Modern Life Realities
              </h2>

              <p className="text-sm sm:text-base text-[var(--theme-text-secondary)] leading-relaxed">
                For over a decade, Master Kashif has guided thousands of seekers through life's most pivotal crossroads. Growing up immersed in traditional spiritual inquiry and astrological literature, Kashif apprenticed under revered mentors in South Asia before bringing his practice to a global audience with a dedicated UK sanctuary.
              </p>

              <p className="text-sm sm:text-base text-[var(--theme-text-secondary)] leading-relaxed">
                Unlike sensationalist fortune telling, Kashif’s readings are built on <strong>symbolic introspection, planetary cycles, and deep psychological empathy</strong>. Specializing in intricate love and relationship dynamics, karmic timing, and career trajectories, each consultation provides a safe, peaceful mirror to help you make decisions with conviction.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                {stats.map((s, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[var(--theme-bg-card)] border border-[var(--theme-border-subtle)] text-center shadow-xs">
                    <div className="font-cinzel text-xl sm:text-2xl font-bold text-orange-500">{s.value}</div>
                    <div className="text-[11px] text-[var(--theme-text-muted)] mt-1 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </section>

          {/* Section 2: Sanctuary Visual Gallery */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">Sanctuary Sacred Tools</span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[var(--theme-text-heading)]">
                The Sacred Instruments of Discernment
              </h2>
              <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)]">
                Every session is conducted with purified elements, consecrated tarot decks, and precise astronomical software.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {galleryItems.map((item, idx) => (
                <div key={idx} className="group relative rounded-2xl overflow-hidden border border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card)] shadow-md hover:border-orange-500/40 transition-all">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="font-cinzel text-sm font-bold text-[var(--theme-text-heading)]">{item.title}</h3>
                    <p className="text-xs text-[var(--theme-text-muted)] mt-1">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Ethical Code & Sanctuary Promises */}
          <section className="p-6 sm:p-10 rounded-3xl bg-[var(--theme-bg-card)] border border-orange-500/20 shadow-xl space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase">
                <Shield className="w-3.5 h-3.5" />
                <span>Our Sacred Code</span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[var(--theme-text-heading)]">
                Ethical Principles of Our Practice
              </h2>
              <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)]">
                Trust is the cornerstone of spiritual guidance. Here is what you can always expect from Master Kashif.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {ethics.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-base font-bold text-[var(--theme-text-heading)] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Client Testimonials */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">Voices of the Seekers</span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[var(--theme-text-heading)]">
                Reflections From Our Global Community
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                {
                  quote: "Kashif's reading helped me navigate a painful relationship crossroad with such calm precision. He didn't make empty promises; he showed me what the energy was truly pointing towards.",
                  author: "Sarah L.",
                  location: "London, UK",
                  rating: 5,
                  service: "Love & Relationship Reading"
                },
                {
                  quote: "The Vedic birth chart breakdown was so accurate it gave me chills. Understanding my Sade Sati period completely shifted how I approached my career pivot.",
                  author: "Dr. A. Malik",
                  location: "Manchester, UK",
                  rating: 5,
                  service: "Complete Spiritual Guidance"
                },
                {
                  quote: "So respectful, warm, and deeply intuitive. I received my WhatsApp voice notes promptly and have revisited them multiple times. Highly recommended!",
                  author: "Elena R.",
                  location: "Dubai, UAE",
                  rating: 5,
                  service: "Tarot Card Reading"
                }
              ].map((t, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[var(--theme-bg-card)] border border-[var(--theme-border-subtle)] shadow-md flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] italic leading-relaxed">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--theme-border-subtle)] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[var(--theme-text-heading)]">{t.author}</div>
                      <div className="text-[11px] text-[var(--theme-text-muted)]">{t.location}</div>
                    </div>
                    <span className="text-[10px] text-orange-400 font-semibold bg-orange-500/10 px-2 py-0.5 rounded-full">
                      {t.service}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action Banner */}
          <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-center bg-gradient-to-r from-orange-600/90 via-amber-600/90 to-orange-700/90 text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Begin Your Journey
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold">
                Ready to Experience Clarity & Peace?
              </h2>
              <p className="text-sm text-white/90 leading-relaxed">
                Explore our full catalog of tarot, astrology, and numerology readings or reserve your session in our dedicated booking sanctuary.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/book"
                  className="px-6 py-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <span>Book Consultation Online</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services"
                  className="px-6 py-3 rounded-full bg-black/30 hover:bg-black/50 text-white border border-white/30 font-semibold text-xs tracking-wider transition-colors"
                >
                  Explore All Services
                </Link>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </div>
  );
}
