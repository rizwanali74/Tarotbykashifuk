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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Connect Directly</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Begin Your Sacred Enquiry
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-jakarta">
            "Each enquiry begins with what matters to you." Reach Kashif directly via WhatsApp or submit your detailed request below.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Left Column: Direct Contact Info & Spiritual Guidance */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0c101d] border border-orange-500/30 shadow-xl space-y-6">
              
              <h3 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Kashif's Sanctuary Desk</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Kashif personally reviews and responds to every client enquiry. For immediate guidance or to agree on a case-based ritual quote, WhatsApp is recommended.
              </p>

              {/* Direct Info List */}
              <div className="space-y-4 pt-2">
                <a
                  href="https://wa.me/447400000000"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-[#111728] border border-orange-500/20 hover:border-orange-500/50 transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Direct WhatsApp (UK & Global)</div>
                    <div className="text-sm font-semibold text-white group-hover:text-emerald-300">
                      {contact.whatsapp}
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#111728] border border-white/5">
                  <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Official Email</div>
                    <div className="text-sm font-semibold text-white">
                      {contact.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#111728] border border-white/5">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Appointment Hours</div>
                    <div className="text-sm font-semibold text-white">
                      {contact.availability}
                    </div>
                  </div>
                </div>
              </div>

              {/* PayPal Notice Box */}
              <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/30 text-xs text-orange-200/90 space-y-1">
                <div className="font-bold text-orange-300">PayPal Payment Policy:</div>
                <p>
                  PayPal is the official payment system for all GBP bookings. Kashif provides the verified PayPal payment link upon confirming your appointment time.
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0c101d] border border-orange-500/30 shadow-2xl text-left">
              
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-cinzel text-2xl font-bold text-white">Enquiry Received</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Kashif will review your message and reply via WhatsApp or email shortly.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Forward Directly to WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#141b2d]"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-white mb-1">
                      Send a Confidential Message
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Share what is currently unfolding in your life or ask questions before booking.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Marcus Sterling"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#070a12] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#070a12] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+44 7..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#070a12] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Service of Interest
                      </label>
                      <select
                        value={formData.serviceInterest}
                        onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#070a12] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                      >
                        {services.map((service) => (
                          <option key={service.id}>{service.name} ({service.price})</option>
                        ))}
                        {siteData.packages.map((pkg) => (
                          <option key={pkg.id}>{pkg.name} ({pkg.price})</option>
                        ))}
                        <option>General Spiritual Enquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Your Message or Context *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share what questions or situation you would like Kashif to assist with..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3.5 bg-[#070a12] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-slate-400">
                      Your inquiry is strictly confidential.
                    </span>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Message</span>
                    </button>
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
