import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Sparkles, MessageCircle } from 'lucide-react';
import { siteData } from '../data';

export default function FAQSection() {
  const { faqs } = siteData;
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Common Enquiries</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-jakarta">
            Clear, transparent answers about sessions, payment arrangements, birth details, and ethics.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen 
                    ? 'bg-[#0f1426] border-orange-500/40 shadow-[0_4px_25px_rgba(249,115,22,0.1)]' 
                    : 'bg-[#0b0e1a] border-white/10 hover:border-orange-500/20'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-cinzel text-base sm:text-lg font-semibold text-white">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-full transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-orange-500/20 text-orange-400' : 'bg-white/5 text-slate-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-jakarta border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom prompt */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-[#0d1222] via-[#141b30] to-[#0d1222] border border-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Have a specific question not covered here?</div>
              <div className="text-xs text-slate-400">Kashif is happy to clarify any session details before you book.</div>
            </div>
          </div>

          <a
            href="https://wa.me/447400000000"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors whitespace-nowrap text-center"
          >
            Chat with Kashif
          </a>
        </div>

      </div>
    </section>
  );
}
