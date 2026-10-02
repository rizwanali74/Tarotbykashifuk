import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Check, ShoppingBag, Eye, Heart, Compass, Shield, Flame } from 'lucide-react';
import { resolveCatalogImageUrl } from '../services/api';

export default function ServicesSection({ services = [], categories = [], onOpenServiceModal, onAddToCart, isItemInCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryNames = ['All', ...categories.map((category) => category.name)];

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory = 
        activeCategory === 'All' || 
        service.category.toLowerCase() === activeCategory.toLowerCase();

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Spiritual Offerings</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Tarot, Astrology & Energetic Sanctuary
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-jakarta">
            Explore {services.length} tailored spiritual sessions designed to bring peace, perspective, and empowerment to your journey.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          
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
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                      : 'bg-[#0f1424] text-slate-300 hover:text-white hover:bg-[#161d33] border border-white/5'
                  }`}
                >
                  <span>{category}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services, love, tarot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0c101c] border border-orange-500/20 focus:border-orange-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-orange-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0d1222] border border-white/10 max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">No services found</p>
            <p className="text-xs text-slate-400 mb-4">Try adjusting your search criteria or category filter.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-orange-500 text-white"
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
                  className="group relative rounded-2xl overflow-hidden bg-[#0c101d] border border-white/10 hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_35px_rgba(249,115,22,0.15)]"
                >
                  {/* Image Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#11172a]">
                    <img 
                      src={resolveCatalogImageUrl(service.image) || '/images/hero.jpg'}
                      alt={service.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-[#0c101d]/40 to-transparent" />

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
                        <span className="px-2 py-0.5 rounded bg-orange-500/80 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          {service.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                    <div>
                      <div className="flex items-baseline justify-between gap-2 mb-1.5">
                        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                          {service.name}
                        </h3>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {service.shortDescription}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {(service.tags || []).map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 rounded bg-[#13192d] text-orange-200/80 text-[11px] font-medium border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400">Starting from</div>
                        <div className="font-cinzel text-xl font-bold text-gradient-orange">
                          {service.price}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Details Modal Trigger */}
                        <button
                          onClick={() => onOpenServiceModal(service)}
                          className="p-2 rounded-xl bg-[#141b2f] hover:bg-[#1b2440] text-slate-300 hover:text-white border border-white/10 transition-colors"
                          title="View detailed overview and session requirements"
                          aria-label={`View details for ${service.name}`}
                        >
                          <Eye className="w-4 h-4 text-orange-400" />
                        </button>

                        {/* Add to Cart / Select Button */}
                        <button
                          onClick={() => onAddToCart(service)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                            inCart 
                              ? 'bg-emerald-600/90 hover:bg-emerald-600 text-white' 
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

      </div>
    </section>
  );
}
