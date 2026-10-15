import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { siteData } from '../data';
import { submitContactInquiry } from '../services/api';

export default function ContactSection({ services = [] }) {
  const { contact } = siteData;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'Tarot Card Reading (£65)',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContactInquiry(formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Contact submission error:', err);
      // Still show success to client
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const generateWhatsAppLink = () => {
    const text = `Hello Kashif, I would like to enquire about:
*Name:* ${formData.name || 'Visitor'}
*Interested Service:* ${formData.serviceInterest}
*Message:* ${formData.message || 'I have a question regarding spiritual guidance.'}`;
    return `https://wa.me/447400000000?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-semibold uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5 text-amber-500" />
            <span>Connect Directly</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--theme-text-heading)]">
            Begin Your Sacred Enquiry
          </h2>
          <p className="text-[var(--theme-text-secondary)] text-base sm:text-lg font-jakarta">
            "Each enquiry begins with what matters to you." Reach Kashif directly via WhatsApp or submit your detailed request below.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Left Column: Direct Contact Info & Spiritual Guidance */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="p-6 sm:p-7 rounded-2xl bg-[var(--theme-bg-card)] border border-orange-500/30 shadow-xl space-y-6 transition-colors">
              
              <h3 className="font-cinzel text-xl font-bold text-[var(--theme-text-heading)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Kashif's Sanctuary Desk</span>
              </h3>

              <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] leading-relaxed">
                Kashif personally reviews and responds to every client enquiry. For immediate guidance or to agree on a case-based ritual quote, WhatsApp is recommended.
              </p>

              {/* Direct Info List */}
              <div className="space-y-4 pt-2">
                <a
                  href="https://wa.me/447400000000"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-[var(--theme-bg-card-subtle)] border border-orange-500/20 hover:border-orange-500/50 transition-colors group cursor-pointer"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[var(--theme-text-muted)]">Direct WhatsApp (UK & Global)</div>
                    <div className="text-sm font-semibold text-[var(--theme-text-heading)] group-hover:text-emerald-500 transition-colors">
                      {contact.whatsapp}
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)]">
                  <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[var(--theme-text-muted)]">Official Email</div>
                    <div className="text-sm font-semibold text-[var(--theme-text-heading)]">
                      {contact.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)]">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[var(--theme-text-muted)]">Appointment Hours</div>
                    <div className="text-sm font-semibold text-[var(--theme-text-heading)]">
                      {contact.availability}
                    </div>
                  </div>
                </div>
              </div>

              {/* PayPal Notice Box */}
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-xs text-[var(--theme-text-secondary)] space-y-1">
                <div className="font-bold text-orange-500">PayPal Payment Policy:</div>
                <p>
                  PayPal is the official payment system for all GBP bookings. Kashif provides the verified PayPal payment link upon confirming your appointment time.
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--theme-bg-card)] border border-orange-500/30 shadow-2xl text-left transition-colors">
              
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-500 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-cinzel text-2xl font-bold text-[var(--theme-text-heading)]">Enquiry Received</h3>
                  <p className="text-sm text-[var(--theme-text-secondary)] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[var(--theme-text-heading)]">{formData.name}</strong>. Kashif will review your message and reply via WhatsApp or email shortly.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Forward Directly to WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[var(--theme-text-muted)] hover:text-[var(--theme-text-heading)] bg-[var(--theme-bg-card-subtle)] cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-[var(--theme-text-heading)] mb-1">
                      Send a Confidential Message
                    </h3>
                    <p className="text-xs text-[var(--theme-text-muted)] mb-4">
                      Share what is currently unfolding in your life or ask questions before booking.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Marcus Sterling"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] placeholder-[var(--theme-text-dim)] focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] placeholder-[var(--theme-text-dim)] focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+44 7000 000000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] placeholder-[var(--theme-text-dim)] focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                        Interested Service
                      </label>
                      <select
                        value={formData.serviceInterest}
                        onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] focus:border-orange-500 outline-none transition-colors"
                      >
                        <option value="Complete Spiritual Guidance Package (£169)">Complete Spiritual Guidance (£169)</option>
                        <option value="Love & Relationship Sanctuary (£85)">Love & Relationship Sanctuary (£85)</option>
                        {services.map((svc) => (
                          <option key={svc.id} value={`${svc.name} (${svc.price})`}>
                            {svc.name} ({svc.price})
                          </option>
                        ))}
                        <option value="Case-Based Spiritual Ritual Assessment">Case-Based Ritual / Cleansing</option>
                        <option value="General Consultation Enquiry">General Spiritual Enquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                      Your Message & Context *
                    </label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Briefly describe your situation, questions, or specific clarity sought..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] placeholder-[var(--theme-text-dim)] focus:border-orange-500 outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Sending confidential enquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Sacred Enquiry</span>
                      </>
                    )}
                  </button>

                  <div className="text-[11px] text-center text-[var(--theme-text-muted)] pt-1">
                    Direct reply provided within 2-4 hours. All inquiries remain strictly confidential.
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
