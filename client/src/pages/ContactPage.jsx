import React, { useState } from 'react';
import CelestialBackground from '../components/CelestialBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MiniHero from '../components/MiniHero';
import SEOHead from '../components/SEOHead';
import { siteData } from '../data';
import { submitContactInquiry } from '../services/api';
import { 
  Mail, MessageSquare, Phone, MapPin, Clock, Send, 
  CheckCircle2, AlertCircle, Shield, Globe, Sparkles 
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'Tarot Card Reading',
    preferredTimezone: 'UK / Europe (GMT/BST)',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await submitContactInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceInterest: formData.serviceInterest,
        subject: `Inquiry regarding ${formData.serviceInterest} (${formData.preferredTimezone})`,
        message: formData.message,
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMsg(res.message || 'Unable to submit inquiry at this moment.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please chat directly with Kashif via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const timezones = [
    { region: "United Kingdom & Europe", tz: "London GMT / BST", time: "Mon - Sun: 09:00 - 21:00" },
    { region: "Pakistan & South Asia", tz: "Islamabad / Karachi (PKT / UTC+5)", time: "Mon - Sun: 14:00 - 02:00" },
    { region: "United States & Americas", tz: "New York (EST) & LA (PST)", time: "Morning & Evening Sessions Available" },
    { region: "Gulf & Middle East", tz: "Dubai (GST / UTC+4)", time: "Mon - Sun: 13:00 - 01:00" }
  ];

  return (
    <div className="relative min-h-screen bg-transparent text-inherit overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      <SEOHead
        title="Contact & Sacred Inquiries | Tarot By Kashif UK & Worldwide"
        description="Get in touch with Master Kashif. Inquire about custom tarot sessions, Vedic astrology charts, package bookings, or connect directly on WhatsApp (+44 7400 000000)."
        keywords="contact tarot reader london, psychic reading inquiry uk, tarot by kashif contact, whatsapp spiritual reading uk, vedic astrology consultation contact"
        canonicalUrl="https://tarotbykashifuk.com/contact"
      />

      <CelestialBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Mini Hero */}
        <MiniHero
          badge="✦ Sacred Concierge"
          title="Begin Your Enquiry With Reverence & Clarity"
          subtitle="Whether you have questions regarding our modalities, need assistance selecting a package, or wish to schedule a consultation, our sanctuary team is here for you."
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Contact Sanctuary", to: null }
          ]}
          highlights={[
            { icon: Clock, text: "Guaranteed Response Within 12-24 Hours" },
            { icon: MessageSquare, text: "Direct WhatsApp Line (+44 7400 000000)" },
            { icon: Shield, text: "Strictly Confidential & Safe" }
          ]}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
            
            {/* Left 5 Cols: Direct Contact Channels & Timezone Info */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* WhatsApp VIP Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[#0c141d] to-[#0a0e18] border border-emerald-500/30 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Fastest Channel</span>
                    <h3 className="font-cinzel text-lg font-bold text-white">Direct WhatsApp Assistance</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  For urgent inquiries, session availability checks, or immediate payment confirmation, message Master Kashif directly.
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 flex items-center justify-between">
                  <span className="font-mono text-xs text-emerald-300 font-semibold">{siteData.contact.whatsapp}</span>
                  <a
                    href="https://wa.me/447400000000"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Chat Now
                  </a>
                </div>
              </div>

              {/* Email & Location Card */}
              <div className="p-6 rounded-3xl bg-[var(--theme-bg-card)] border border-[var(--theme-border-subtle)] shadow-lg space-y-4">
                <h3 className="font-cinzel text-base font-bold text-[var(--theme-text-heading)]">
                  Sanctuary Coordinates
                </h3>

                <div className="space-y-3 text-xs text-[var(--theme-text-secondary)]">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[var(--theme-text-heading)]">Email Inquiries</div>
                      <a href={`mailto:${siteData.contact.email}`} className="text-orange-400 hover:underline">
                        {siteData.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[var(--theme-text-heading)]">Headquarters</div>
                      <div>London, United Kingdom • Operating Internationally</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[var(--theme-text-heading)]">Discretion Promise</div>
                      <div>100% encrypted, private correspondence guaranteed.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* International Timezones Card */}
              <div className="p-6 rounded-3xl bg-[var(--theme-bg-card)] border border-[var(--theme-border-subtle)] shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-500" />
                  <h3 className="font-cinzel text-sm font-bold text-[var(--theme-text-heading)]">
                    Serving Global Timezones
                  </h3>
                </div>

                <div className="divide-y divide-[var(--theme-border-subtle)] text-xs">
                  {timezones.map((tz, i) => (
                    <div key={i} className="py-2.5 first:pt-0 last:pb-0">
                      <div className="font-semibold text-[var(--theme-text-heading)]">{tz.region}</div>
                      <div className="text-[11px] text-orange-500 font-mono mt-0.5">{tz.tz}</div>
                      <div className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">{tz.time}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 7 Cols: Interactive Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-10 rounded-3xl bg-[var(--theme-bg-card)] border border-orange-500/20 shadow-2xl">
                
                {success ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-cinzel text-2xl font-bold text-[var(--theme-text-heading)]">
                      Your Sacred Inquiry Has Been Received
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out. Master Kashif personally reviews every enquiry. You will receive a response at <strong>{formData.email}</strong> within 12 to 24 hours.
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSuccess(false);
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            serviceInterest: 'Tarot Card Reading',
                            preferredTimezone: 'UK / Europe (GMT/BST)',
                            message: ''
                          });
                        }}
                        className="px-6 py-2.5 rounded-full bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] text-xs font-semibold text-[var(--theme-text-heading)] border border-[var(--theme-border-subtle)] transition-colors cursor-pointer"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">
                        Sanctuary Contact Form
                      </span>
                      <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--theme-text-heading)] mt-0.5">
                        Share What Brings You to Our Sanctuary
                      </h3>
                      <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
                        Fill in your details below and we will advise on the most suitable session or confirm booking availability.
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="sarah@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                          WhatsApp / Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+44 7..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                          Service of Interest
                        </label>
                        <select
                          value={formData.serviceInterest}
                          onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500 transition-colors cursor-pointer"
                        >
                          <option value="Tarot Card Reading">Tarot Card Reading (£65)</option>
                          <option value="Complete Guidance Package">Complete Spiritual Guidance Package (£169)</option>
                          <option value="Numerology Reading">Numerology Reading (£50)</option>
                          <option value="Phone Number Numerology">Phone Number Numerology (£50)</option>
                          <option value="Business & Signature Numerology">Business & Signature Numerology (£60)</option>
                          <option value="Vedic Astrological Chart">Vedic Astrological Chart (£75)</option>
                          <option value="Spiritual Consultation">Spiritual Consultation (Case Based)</option>
                          <option value="General Inquiry">General / Scheduling Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                        Your Message / Questions *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Briefly describe what life questions, relationship themes, or dilemmas you would like guidance on..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Submitting Sacred Inquiry...' : 'Submit Inquiry to Sanctuary'}</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

        </main>

        <Footer />
      </div>
    </div>
  );
}
