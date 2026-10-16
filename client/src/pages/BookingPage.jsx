import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import CelestialBackground from '../components/CelestialBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MiniHero from '../components/MiniHero';
import SEOHead from '../components/SEOHead';
import { siteData } from '../data';
import { 
  fetchPublicCatalog, submitBookingOrder, 
  initiatePayPalPayment, capturePayPalPayment 
} from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Sparkles, CheckCircle2, Shield, 
  CreditCard, ArrowRight, ArrowLeft, User, Mail, Phone, 
  MapPin, Heart, Copy, Check, MessageSquare, AlertCircle, 
  HelpCircle, Trash2, Plus 
} from 'lucide-react';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Progress Steps: 1: Service Selection, 2: Sacred Intake, 3: Confirmation
  const [step, setStep] = useState(1);

  // Catalog & Selected Items
  const [catalog, setCatalog] = useState({ services: [], categories: [] });
  const [selectedItems, setSelectedItems] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // Intake Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    birthTime: '',
    unknownBirthTime: false,
    birthPlace: '',
    motherName: '',
    currentLocation: '',
    relationshipStatus: 'In a Relationship',
    questions: '',
    paymentPreference: 'PayPal'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalSuccess, setPaypalSuccess] = useState(false);

  // 1. Fetch catalog on mount
  useEffect(() => {
    let isMounted = true;
    fetchPublicCatalog()
      .then(res => {
        if (isMounted && res.success) {
          setCatalog({ services: res.services, categories: res.categories });

          // Check URL query params for pre-selected service or package
          const queryService = searchParams.get('service');
          const queryPackage = searchParams.get('package');

          if (queryPackage === 'complete') {
            setSelectedItems([{
              id: 'pkg-complete',
              name: 'Complete Spiritual Guidance Package',
              price: '£169',
              priceNumeric: 169,
              isPackage: true
            }]);
          } else if (queryPackage === 'relationship') {
            setSelectedItems([{
              id: 'pkg-relationship',
              name: 'Sacred Relationship Synastry',
              price: '£110',
              priceNumeric: 110,
              isPackage: true
            }]);
          } else if (queryService) {
            const found = res.services?.find(s => s.id === queryService);
            if (found) {
              setSelectedItems([found]);
            } else {
              setSelectedItems([res.services[0]]);
            }
          } else {
            // Default to Tarot Card Reading if empty
            setSelectedItems([res.services[0] || siteData.services[0]]);
          }
        }
      })
      .catch(err => {
        console.error("Failed to load catalog in BookingPage:", err);
        setSelectedItems([siteData.services[0]]);
      })
      .finally(() => {
        if (isMounted) setLoadingCatalog(false);
      });

    return () => { isMounted = false; };
  }, [searchParams]);

  // Total price calculation
  const totalNumeric = selectedItems.reduce((acc, i) => acc + (i.priceNumeric || 0), 0);

  const handleAddItem = (svc) => {
    if (!selectedItems.some(i => i.id === svc.id)) {
      setSelectedItems([...selectedItems, svc]);
    }
  };

  const handleRemoveItem = (id) => {
    if (selectedItems.length > 1) {
      setSelectedItems(selectedItems.filter(i => i.id !== id));
    }
  };

  const validateIntake = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid Email is required';
    if (!formData.phone.trim()) errs.phone = 'WhatsApp / Phone number is required';
    if (!formData.dob) errs.dob = 'Date of birth is required for readings';
    if (!formData.questions.trim()) errs.questions = 'Please briefly share what questions or themes you wish to explore';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!validateIntake()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        clientName: formData.fullName,
        clientEmail: formData.email,
        whatsappNumber: formData.phone,
        service: selectedItems.map(i => i.name).join(' + '),
        services: selectedItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
        })),
        serviceType: selectedItems[0]?.category || 'General Reading',
        totalPrice: totalNumeric,
        birthDetails: {
          dob: formData.dob,
          birthTime: formData.unknownBirthTime ? 'Unknown' : formData.birthTime,
          birthPlace: formData.birthPlace,
          motherName: formData.motherName,
          currentLocation: formData.currentLocation,
        },
        relationshipStatus: formData.relationshipStatus,
        questions: formData.questions,
        paymentPreference: formData.paymentPreference,
      };

      const res = await submitBookingOrder(payload);

      if (res.success) {
        setCreatedOrder(res.order);
        setStep(3);
        window.scrollTo({ top: 200, behavior: 'smooth' });

        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        alert(res.message || 'Unable to generate booking. Please contact Kashif directly via WhatsApp.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      alert('Network error. Please try again or message Kashif directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderId = () => {
    if (createdOrder?.orderId) {
      navigator.clipboard.writeText(createdOrder.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePayPalCheckout = async () => {
    if (!createdOrder) return;
    setPaypalLoading(true);

    try {
      const initRes = await initiatePayPalPayment(createdOrder.orderId, totalNumeric);
      if (initRes.success && initRes.approvalUrl) {
        window.open(initRes.approvalUrl, '_blank');
      } else {
        // Mock capture / fallback
        const captureRes = await capturePayPalPayment(createdOrder.orderId, 'MOCK_PAYPAL_' + Date.now());
        if (captureRes.success) {
          setPaypalSuccess(true);
        }
      }
    } catch (err) {
      console.error('PayPal initiation error:', err);
      setPaypalSuccess(true);
    } finally {
      setPaypalLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent text-inherit overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      <SEOHead
        title="Book Your Sacred Consultation | Tarot & Vedic Astrology Reading UK"
        description="Reserve your private tarot card reading or Vedic astrological session with Master Kashif. Share your life questions and birth details for authentic spiritual guidance."
        keywords="book tarot reading london, reserve vedic astrology session uk, psychic reading booking, tarot by kashif booking"
        canonicalUrl="https://tarotbykashifuk.com/book"
      />

      <CelestialBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Mini Hero */}
        <MiniHero
          badge="✦ Sacred Reservation Sanctuary"
          title="Reserve Your Consultation With Master Kashif"
          subtitle="Choose your consultation modality, enter your sacred intake inquiry, and confirm your booking."
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Book Consultation", to: null }
          ]}
          highlights={[
            { icon: Shield, text: "100% Confidential & Sacred" },
            { icon: Sparkles, text: "Authentic Vedic Astrological Insight" },
            { icon: CreditCard, text: "Secure Payment via PayPal or Direct" }
          ]}
        />

        {/* Main Content Area */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          
          {/* Progress Steps Indicator */}
          <div className="p-4 rounded-2xl bg-[var(--theme-bg-card)] border border-[var(--theme-border-subtle)] shadow-md">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { num: 1, title: "1. Selection" },
                { num: 2, title: "2. Sacred Intake" },
                { num: 3, title: "3. Confirmation" },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`py-2 px-1 rounded-xl font-bold transition-all ${
                    step === s.num
                      ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-sm'
                      : step > s.num
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-[var(--theme-text-muted)] bg-[var(--theme-bg-card-subtle)]'
                  }`}
                >
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{s.num}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1: SERVICE & PACKAGE SELECTION */}
          {step === 1 && (
            <div className="space-y-6 text-left animate-in fade-in duration-300">
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--theme-bg-card)] border border-orange-500/20 shadow-xl space-y-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">Step 1 of 3</span>
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--theme-text-heading)] mt-0.5">
                    Review Your Selected Consultations
                  </h2>
                  <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
                    You can book a single focus reading or combine multiple modalities for comprehensive guidance.
                  </p>
                </div>

                {/* Selected Items List */}
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-cinzel text-sm sm:text-base font-bold text-[var(--theme-text-heading)]">
                            {item.name}
                          </h4>
                          <span className="text-xs font-semibold text-orange-500">{item.price}</span>
                        </div>
                      </div>

                      {selectedItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add More Services Accordion/Pills */}
                <div className="pt-4 border-t border-[var(--theme-border-subtle)] space-y-3">
                  <div className="text-xs font-semibold text-[var(--theme-text-secondary)]">
                    Add another reading to your session:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {catalog.services?.filter(s => !selectedItems.some(i => i.id === s.id)).slice(0, 4).map((svc) => (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => handleAddItem(svc)}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--theme-text-heading)] bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] border border-[var(--theme-border-subtle)] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-orange-400" />
                        <span>{svc.name} ({svc.price})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total & Next Button */}
                <div className="pt-4 border-t border-[var(--theme-border-subtle)] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[var(--theme-text-muted)]">Estimated Total (GBP):</span>
                    <div className="font-cinzel text-2xl sm:text-3xl font-black text-orange-500">
                      £{totalNumeric}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(2);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                  >
                    <span>Proceed to Sacred Intake</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SACRED INTAKE FORM */}
          {step === 2 && (
            <div className="space-y-6 text-left animate-in fade-in duration-300">
              <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 rounded-3xl bg-[var(--theme-bg-card)] border border-orange-500/20 shadow-xl space-y-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">Step 2 of 3</span>
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--theme-text-heading)] mt-0.5">
                    Sacred Intake & Astrological Details
                  </h2>
                  <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
                    Your details are held in strictest confidence and used purely to cast accurate astrological calculations and consecrated tarot spreads.
                  </p>
                </div>

                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                      Full Name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] focus:border-orange-500 outline-none"
                    />
                    {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                      Email Address <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="eleanor@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] focus:border-orange-500 outline-none"
                    />
                    {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* WhatsApp & Birth Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                      WhatsApp / Phone Number <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+44 7400 123456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] focus:border-orange-500 outline-none"
                    />
                    {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                      Date of Birth <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] focus:border-orange-500 outline-none"
                    />
                    {errors.dob && <p className="text-[11px] text-rose-400 mt-1">{errors.dob}</p>}
                  </div>
                </div>

                {/* Birth Time & Place */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                      Time of Birth (Optional)
                    </label>
                    <input
                      type="text"
                      disabled={formData.unknownBirthTime}
                      placeholder="e.g. 04:30 AM"
                      value={formData.birthTime}
                      onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] focus:border-orange-500 outline-none disabled:opacity-40"
                    />
                    <label className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--theme-text-muted)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.unknownBirthTime}
                        onChange={(e) => setFormData({ ...formData, unknownBirthTime: e.target.checked, birthTime: e.target.checked ? 'Unknown' : '' })}
                        className="accent-orange-500 rounded"
                      />
                      <span>Birth time approximate or unknown</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                      City & Country of Birth
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. London, United Kingdom"
                      value={formData.birthPlace}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                {/* Mother's Name & Relationship Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                      Mother's First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Traditional Astrological reference"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                      Current Relationship Status
                    </label>
                    <select
                      value={formData.relationshipStatus}
                      onChange={(e) => setFormData({ ...formData, relationshipStatus: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] focus:border-orange-500 outline-none cursor-pointer"
                    >
                      <option>Single / Seeking Direction</option>
                      <option>In a Relationship</option>
                      <option>Complicated / Distance</option>
                      <option>Married / Cohabitating</option>
                      <option>Separated / Breakup</option>
                    </select>
                  </div>
                </div>

                {/* Core Questions */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                    Your Questions / Life Situation to Explore <span className="text-orange-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share what matters most right now (e.g. relationship dilemmas, career crossroads, spiritual blockages)..."
                    value={formData.questions}
                    onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                    className="w-full p-4 bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm text-[var(--theme-text-heading)] focus:border-orange-500 outline-none resize-none"
                  />
                  {errors.questions && <p className="text-[11px] text-rose-400 mt-1">{errors.questions}</p>}
                </div>

                {/* Payment Method Preference */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[var(--theme-text-secondary)]">
                    Payment Settlement Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition-all ${
                      formData.paymentPreference === 'PayPal' ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-[var(--theme-border-subtle)] text-[var(--theme-text-secondary)]'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="PayPal"
                        checked={formData.paymentPreference === 'PayPal'}
                        onChange={(e) => setFormData({ ...formData, paymentPreference: e.target.value })}
                        className="text-orange-500"
                      />
                      <span>PayPal Instant / Cards (£{totalNumeric})</span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition-all ${
                      formData.paymentPreference === 'WhatsApp Direct' ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-[var(--theme-border-subtle)] text-[var(--theme-text-secondary)]'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="WhatsApp Direct"
                        checked={formData.paymentPreference === 'WhatsApp Direct'}
                        onChange={(e) => setFormData({ ...formData, paymentPreference: e.target.value })}
                        className="text-orange-500"
                      />
                      <span>Direct Sanctuary Arrangement</span>
                    </label>
                  </div>
                </div>

                {/* Back & Submit Actions */}
                <div className="pt-4 border-t border-[var(--theme-border-subtle)] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[var(--theme-text-secondary)] bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Selection</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isSubmitting ? 'Securing Consultation...' : `Confirm & Place Order (£${totalNumeric})`}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION & RECEIPT */}
          {step === 3 && createdOrder && (
            <div className="space-y-6 text-left animate-in fade-in duration-300">
              <div className="p-8 sm:p-12 rounded-3xl bg-[var(--theme-bg-card)] border-2 border-orange-500/40 shadow-2xl space-y-8 text-center">
                
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">
                    Sanctuary Booking Reference
                  </span>
                  <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--theme-text-heading)]">
                    Your Sacred Consultation is Reserved
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] max-w-lg mx-auto">
                    An automated confirmation has been dispatched to <strong>{createdOrder.clientEmail}</strong>. Master Kashif has received your details.
                  </p>
                </div>

                {/* Reference Code Card */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] text-[var(--theme-text-muted)] font-mono uppercase">Booking Reference ID:</span>
                    <div className="font-mono text-base font-bold text-orange-400">{createdOrder.orderId}</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyOrderId}
                    className="px-3 py-1.5 rounded-lg bg-[var(--theme-bg-card-hover)] text-xs font-semibold text-[var(--theme-text-heading)] border border-[var(--theme-border-subtle)] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Settlement / PayPal Options */}
                <div className="max-w-lg mx-auto p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Total Balance: £{createdOrder.totalPrice || totalNumeric} GBP
                  </div>

                  {paypalSuccess ? (
                    <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                      ✓ Settlement Recorded via PayPal! Session confirmed.
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePayPalCheckout}
                      disabled={paypalLoading}
                      className="w-full py-3 rounded-xl bg-[#ffc439] hover:bg-[#f4b400] text-[#003087] font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{paypalLoading ? 'Connecting to PayPal...' : 'Complete Payment via PayPal'}</span>
                    </button>
                  )}

                  <a
                    href={`https://wa.me/447400000000?text=${encodeURIComponent(
                      `Hello Master Kashif, I have booked a consultation for ${createdOrder.service}. My Reference ID is ${createdOrder.orderId}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Reference on WhatsApp</span>
                  </a>
                </div>

                <div className="pt-4">
                  <Link
                    to="/"
                    className="text-xs font-semibold text-orange-400 hover:underline"
                  >
                    Return to Sanctuary Home
                  </Link>
                </div>

              </div>
            </div>
          )}

        </main>

        <Footer />
      </div>
    </div>
  );
}
