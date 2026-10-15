import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CelestialBackground from '../components/CelestialBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MiniHero from '../components/MiniHero';
import SEOHead from '../components/SEOHead';
import ServiceModal from '../components/ServiceModal';
import { siteData } from '../data';
import { fetchPublicCatalog, resolveCatalogImageUrl } from '../services/api';
import { 
  Sparkles, Compass, CheckCircle2, ArrowRight, Eye, 
  HelpCircle, Clock, ShieldCheck, Heart, Star 
} from 'lucide-react';

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState(siteData.services);
  const [categories, setCategories] = useState(["All", "Readings", "Numerology", "Spiritual Healing"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchPublicCatalog()
      .then(res => {
        if (res.success && res.services?.length > 0) {
          setServices(res.services);
          if (res.categories?.length > 0) {
            const names = res.categories.map(c => typeof c === 'string' ? c : c?.name || c?.id || '');
            const clean = ['All', ...new Set(names.filter(Boolean).filter(n => n !== 'All'))];
            setCategories(clean);
          }
        }
      })
      .catch(err => console.error("Error loading services in ServicesPage:", err));
  }, []);

  const filteredServices = activeCategory === "All" 
    ? services 
    : services.filter(s => {
        const cat = typeof s.category === 'string' ? s.category : s.category?.name || '';
        return cat.toLowerCase() === activeCategory.toLowerCase();
      });

  const handleBookService = (svc) => {
    navigate(`/book?service=${svc.id}`);
  };

  const steps = [
    {
      step: "01",
      title: "Select Your Focus",
      desc: "Choose the service aligned with your current life question—whether love, career crossroads, or spiritual evolution."
    },
    {
      step: "02",
      title: "Reserve Your Slot",
      desc: "Choose a convenient session time converted automatically to your exact local time zone."
    },
    {
      step: "03",
      title: "Sacred Intake & Casting",
      desc: "Share your birth details and core questions. Master Kashif casts your Vedic chart and consecrated Tarot spread."
    },
    {
      step: "04",
      title: "Guidance & Follow-Up",
      desc: "Receive your comprehensive reading report, clear audio guidance notes, and direct WhatsApp follow-up support."
    }
  ];

  return (
    <div className="relative min-h-screen bg-transparent text-inherit overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      <SEOHead
        title="Sacred Spiritual Services | Tarot Reading, Vedic Astrology & Numerology London UK"
        description="Explore Master Kashif's complete spiritual consultations: Tarot card readings, Vedic astrology (Jyotish) birth charts, and sacred numerology. Serving London, UK and worldwide in GBP."
        keywords="tarot card reading london, vedic astrology consultation uk, numerology reading london, psychic reading uk, love and relationship tarot uk, birth chart reading london, jyotish consultation"
        canonicalUrl="https://tarotbykashifuk.com/services"
      />

      <CelestialBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Mini Hero */}
        <MiniHero
          badge="✦ Sacred Catalog"
          title="Tarot, Astrology & Energetic Sanctuary Services"
          subtitle="Discover insightful consultations crafted with ancient symbolism, mathematical precision, and compassionate guidance."
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Services", to: null }
          ]}
          highlights={[
            { icon: Compass, text: "9 Bespoke Offerings" },
            { icon: ShieldCheck, text: "100% Discretion Guaranteed" },
            { icon: Clock, text: "Live Global Timezone Conversion" }
          ]}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat, idx) => {
              const catName = typeof cat === 'string' ? cat : cat?.name || cat?.id || `Category-${idx}`;
              const catKey = `cat-btn-${catName}-${idx}`;
              return (
                <button
                  key={catKey}
                  onClick={() => setActiveCategory(catName)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    activeCategory === catName
                      ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md'
                      : 'bg-[var(--theme-bg-card)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-heading)] border border-[var(--theme-border-subtle)]'
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((svc) => (
              <div
                key={svc.id}
                className="group relative rounded-2xl overflow-hidden bg-[var(--theme-bg-card)] border border-[var(--theme-border-subtle)] hover:border-orange-500/40 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Header with Badge & Price */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={resolveCatalogImageUrl(svc.image)}
                    alt={svc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/tarot-card.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg-card)] via-transparent to-black/30" />
                  
                  {svc.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-orange-500/90 text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
                      {svc.badge}
                    </span>
                  )}

                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white font-bold text-sm">
                    {svc.price}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">
                      {typeof svc.category === 'string' ? svc.category : svc.category?.name || 'Sanctuary'}
                    </span>
                    <h3 className="font-cinzel text-lg font-bold text-[var(--theme-text-heading)] group-hover:text-orange-500 transition-colors mt-0.5">
                      {svc.name}
                    </h3>
                    <p className="text-xs text-[var(--theme-text-secondary)] mt-2 leading-relaxed">
                      {svc.shortDescription || svc.details?.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {svc.tags && svc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {svc.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] text-[10px] text-[var(--theme-text-muted)] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions: View Details & Book Directly */}
                  <div className="pt-3 border-t border-[var(--theme-border-subtle)] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedService(svc)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-[var(--theme-text-secondary)] bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] transition-colors cursor-pointer text-center"
                    >
                      View Details
                    </button>
                    <Link
                      to={`/book?service=${svc.id}`}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section: How Our Consultations Work */}
          <section className="p-8 sm:p-12 rounded-3xl bg-[var(--theme-bg-card)] border border-orange-500/20 shadow-xl space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">Seamless Sanctuary Experience</span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[var(--theme-text-heading)]">
                How Your Reading Unfolds
              </h2>
              <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)]">
                From initial question formulation to post-session audio follow-ups, here is our dedicated four-step pathway.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {steps.map((st, i) => (
                <div key={i} className="p-5 rounded-2xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] relative flex flex-col justify-between">
                  <div>
                    <span className="font-cinzel text-3xl font-bold text-orange-500/40">{st.step}</span>
                    <h3 className="font-cinzel text-sm sm:text-base font-bold text-[var(--theme-text-heading)] mt-2">
                      {st.title}
                    </h3>
                    <p className="text-xs text-[var(--theme-text-secondary)] mt-2 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Preparation Advice */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-left">
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">Preparation Guide</span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[var(--theme-text-heading)]">
                How to Prepare For Your Reading
              </h2>
              <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] leading-relaxed">
                To receive the clearest answers from the cards and astrological chart, take a quiet moment before submitting your booking to reflect on your core intent.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--theme-text-secondary)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Formulate open-ended questions:</strong> Instead of "Will I ever be happy?", ask "What lessons and choices will unlock harmony in my current partnership?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Verify birth details:</strong> For Vedic Jyotish calculations, having your exact birth time (from a birth certificate or hospital record) ensures maximum accuracy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Approach with an open heart:</strong> The cards mirror energy dynamics and subconscious currents; be ready to receive honest, constructive perspectives.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/30 text-center space-y-4">
              <Sparkles className="w-10 h-10 text-orange-400 mx-auto" />
              <h3 className="font-cinzel text-xl font-bold text-[var(--theme-text-heading)]">
                Looking For an All-In-One Consultation?
              </h3>
              <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] max-w-md mx-auto">
                Explore our Complete Spiritual Guidance Package (£169), which combines full Tarot, Vedic Astrological Birth Chart, and Numerology analysis into one master session.
              </p>
              <div className="pt-2">
                <Link
                  to="/packages"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-transform"
                >
                  <span>Explore Guidance Packages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>

      {/* Service Detail Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        onAddToCart={(svc) => handleBookService(svc)}
        isItemInCart={() => false}
      />
    </div>
  );
}
