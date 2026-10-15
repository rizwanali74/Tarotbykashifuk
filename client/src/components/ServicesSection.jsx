import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Search, Check, ShoppingBag, Eye, Heart, Compass, Shield, Flame, ArrowRight } from 'lucide-react';
import { resolveCatalogImageUrl } from '../services/api';

export default function ServicesSection({ services = [], categories = [], onOpenServiceModal, onAddToCart, isItemInCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryNames = useMemo(() => {
    const raw = categories.map((c) => typeof c === 'string' ? c : c?.name || c?.id || '');
    return ['All', ...new Set(raw.filter(Boolean).filter(n => n !== 'All'))];
  }, [categories]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const cat = typeof service.category === 'string' ? service.category : service.category?.name || '';
      const matchesCategory = 
        activeCategory === 'All' || 
        cat.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch = 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  return (
    <section id="services" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-semibold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Spiritual Offerings</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--theme-text-heading)]">
            Tarot, Astrology & Energetic Sanctuary
          </h2>
          <p className="text-[var(--theme-text-secondary)] text-base sm:text-lg font-jakarta">
            Explore {services.length} tailored spiritual sessions designed to bring peace, perspective, and empowerment to your journey.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[var(--theme-border-subtle)]">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            {categoryNames.map((category) => {
              const count = category === 'All' 
                ? services.length
                : services.filter(s => s.category.toLowerCase() === category.toLowerCase()).length;
              
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                      : 'bg-[var(--theme-bg-card-subtle)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-heading)] hover:bg-[var(--theme-bg-card-hover)] border border-[var(--theme-border-subtle)]'
                  }`}
                >
                  <span>{category}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/30 text-white' : 'bg-black/10 dark:bg-white/10 text-[var(--theme-text-muted)]'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[var(--theme-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services, love, tarot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-default)] focus:border-orange-500 rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] placeholder-[var(--theme-text-dim)] outline-none transition-all focus:ring-1 focus:ring-orange-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--theme-text-muted)] hover:text-orange-500 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <p className="text-[var(--theme-text-heading)] font-semibold mb-1">No services found</p>
            <p className="text-xs text-[var(--theme-text-muted)] mb-4">Try adjusting your search criteria or category filter.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-orange-500 text-white cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredServices.map((service, idx) => {
              const inCart = isItemInCart(service.id);

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden bg-[var(--theme-bg-card)] border border-[var(--theme-border-subtle)] hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl"
                >
                  {/* Image Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-[var(--theme-bg-card-subtle)]">
                    <img 
                      src={resolveCatalogImageUrl(service.image) || '/images/hero.jpg'}
                      alt={service.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg-card)] via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-orange-500/30 text-orange-300 text-[11px] font-semibold tracking-wide">
                        {service.category}
                      </span>
                      
                      <span className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold flex items-center justify-center">
                        {service.id}
                      </span>
                    </div>

                    {/* Badge if available */}
                    {service.badge && (
                      <div className="absolute bottom-2 left-3">
                        <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          {service.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                    <div>
                      <div className="flex items-baseline justify-between gap-2 mb-1.5">
                        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--theme-text-heading)] group-hover:text-orange-500 transition-colors">
                          {service.name}
                        </h3>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] line-clamp-2 leading-relaxed">
                        {service.shortDescription}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(service.tags || []).map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 rounded bg-[var(--theme-bg-card-subtle)] text-orange-500 text-[11px] font-medium border border-[var(--theme-border-subtle)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-4 border-t border-[var(--theme-border-subtle)] flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[var(--theme-text-muted)]">Starting from</div>
                        <div className="font-cinzel text-xl font-bold text-gradient-orange">
                          {service.price}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Details Modal Trigger */}
                        <button
                          onClick={() => onOpenServiceModal(service)}
                          className="p-2 rounded-xl bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] text-[var(--theme-text-muted)] hover:text-orange-500 border border-[var(--theme-border-subtle)] transition-colors cursor-pointer"
                          title="View detailed overview and session requirements"
                          aria-label={`View details for ${service.name}`}
                        >
                          <Eye className="w-4 h-4 text-orange-500" />
                        </button>

                        {/* Add to Cart / Select Button */}
                        <button
                          onClick={() => onAddToCart(service)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                            inCart 
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                              : 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.3)]'
                          }`}
                        >
                          {inCart ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Selected</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Select</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Dedicated Services Page Link */}
        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--theme-bg-card)] hover:bg-[var(--theme-bg-card-hover)] text-xs sm:text-sm font-bold text-orange-500 border border-orange-500/30 hover:border-orange-500 shadow-md transition-all hover:scale-105"
          >
            <span>Explore Dedicated Services Catalog & Preparation Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
