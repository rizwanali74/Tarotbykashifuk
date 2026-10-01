import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Clock, AlertCircle, Calendar, ArrowRight, ShieldAlert, ShoppingBag } from 'lucide-react';

export default function ServiceModal({ service, isOpen, onClose, onAddToCart, isItemInCart }) {
  if (!isOpen || !service) return null;

  const inCart = isItemInCart(service.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-[#0b0f1b] border border-orange-500/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-8 text-left"
        >
          {/* Top Banner Image with Gradient */}
          <div className="relative h-48 sm:h-56 w-full overflow-hidden">
            <img 
              src={service.image || '/images/hero.jpg'} 
              alt={service.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1b] via-[#0b0f1b]/50 to-black/40" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 transition-all z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges Overlay */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold uppercase tracking-wider border border-orange-500/30">
                    {service.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID #{service.id}
                  </span>
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                  {service.name}
                </h3>
              </div>

              <div className="text-right shrink-0">
                <span className="font-cinzel text-2xl sm:text-3xl font-bold text-gradient-orange">
                  {service.price}
                </span>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider">GBP per session</div>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#13192c] text-orange-200 border border-orange-500/20"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Main Detailed Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">Overview</h4>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-jakarta">
                {service.details?.description || service.shortDescription}
              </p>
            </div>

            {/* What you can explore checklist */}
            {service.details?.whatYouCanExplore && (
              <div className="space-y-2.5 p-4 rounded-xl bg-[#0f1527] border border-orange-500/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  What You Can Explore in This Session
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  {service.details.whatYouCanExplore.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Before your session notice */}
            {service.details?.beforeYourSession && (
              <div className="space-y-1.5 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Before Your Session
                </h4>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {service.details.beforeYourSession}
                </p>
              </div>
            )}

            {/* Spiritual Notice */}
            {service.details?.note && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-black/40 border border-white/10 text-slate-400 text-xs italic">
                <AlertCircle className="w-4 h-4 text-orange-400/80 shrink-0 mt-0.5" />
                <span>Note: {service.details.note}</span>
              </div>
            )}

          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 sm:p-5 bg-[#090d17] border-t border-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#121829] hover:bg-[#1a233b] border border-white/10 transition-colors"
            >
              Back to Catalog
            </button>

            <button
              onClick={() => onAddToCart(service)}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                inCart 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                  : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]'
              }`}
            >
              {inCart ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Selection</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Selection • {service.price}</span>
                </>
              )}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
