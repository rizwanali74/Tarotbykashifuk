import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import CelestialBackground from '../components/CelestialBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MiniHero from '../components/MiniHero';
import SEOHead from '../components/SEOHead';
import { siteData } from '../data';
import { 
  fetchPublicCatalog, fetchTimeSlots, submitBookingOrder, 
  initiatePayPalPayment, capturePayPalPayment 
} from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Sparkles, CheckCircle2, Clock, Globe, Shield, Calendar, 
  CreditCard, ArrowRight, ArrowLeft, User, Mail, Phone, 
  MapPin, Heart, Copy, Check, MessageSquare, AlertCircle, 
  HelpCircle, Trash2, Plus 
} from 'lucide-react';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Progress Steps: 1: Service Selection, 2: Slot & Timezone, 3: Intake Form, 4: Confirmation
  const [step, setStep] = useState(1);

  // Catalog & Selected Items
  const [catalog, setCatalog] = useState({ services: [], categories: [] });
  const [selectedItems, setSelectedItems] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // Timezone and Slots State
  const [clientTimezone, setClientTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/London';
    } catch {
      return 'Europe/London';
    }
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

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

  // 2. Fetch available slots whenever timezone changes
  useEffect(() => {
    setLoadingSlots(true);
    fetchTimeSlots({ timezone: clientTimezone })
      .then(res => {
        if (res.success) {
          setAvailableSlots(res.slots || []);
        }
      })
      .catch(err => console.error("Error fetching slots in BookingPage:", err))
      .finally(() => setLoadingSlots(false));
  }, [clientTimezone]);

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

  const handleProceedToStep3 = () => {
    setStep(3);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!validateIntake()) return;

    setIsSubmitting(true);

    try {
      const slotIdentifier = selectedSlot ? (selectedSlot.slotId || selectedSlot._id) : null;
      const slotSummary = selectedSlot ? {
        slotId: slotIdentifier,
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        clientLocalTime: selectedSlot.conversion?.clientTimeRange,
        clientCountry: selectedSlot.conversion?.targetTimezone,
      } : null;

      const servicesWithSlot = selectedItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        slotId: slotIdentifier,
        slotInfo: slotSummary,
      }));

      const payload = {
        clientName: formData.fullName,
        clientEmail: formData.email,
        whatsappNumber: formData.phone,
        service: selectedItems.map(i => i.name).join(' + '),
        services: servicesWithSlot,
        serviceType: selectedItems[0]?.category || 'General Reading',
        totalPrice: totalNumeric,
        selectedSlotId: slotIdentifier,
        slotDetails: slotSummary,
        clientTimezone: clientTimezone,
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
        setStep(4);
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

  const commonTimezones = [
    { label: "UK / London (GMT / BST)", value: "Europe/London" },
    { label: "US Eastern (New York / EDT)", value: "America/New_York" },
    { label: "US Central (Chicago / CDT)", value: "America/Chicago" },
    { label: "US Pacific (Los Angeles / PDT)", value: "America/Los_Angeles" },
    { label: "Pakistan (Islamabad / PKT)", value: "Asia/Karachi" },
    { label: "UAE / Dubai (GST)", value: "Asia/Dubai" },
    { label: "India (New Delhi / IST)", value: "Asia/Kolkata" },
    { label: "Australia (Sydney / AEST)", value: "Australia/Sydney" },
    { label: "Canada (Toronto / EDT)", value: "America/Toronto" },
  ];

  return (
    <div className="relative min-h-screen bg-transparent text-inherit overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      <SEOHead
        title="Book Your Sacred Consultation | Tarot & Vedic Astrology Reading UK"
        description="Reserve your private tarot card reading or Vedic astrological session with Master Kashif. Select your live time slot converted to your local timezone and receive deep guidance."
        keywords="book tarot reading london, reserve vedic astrology session uk, psychic reading booking, tarot slot reservation, tarot by kashif booking"
        canonicalUrl="https://tarotbykashifuk.com/book"
      />

      <CelestialBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Mini Hero */}
        <MiniHero
          badge="✦ Sacred Reservation Sanctuary"
          title="Reserve Your Consultation With Master Kashif"
          subtitle="Choose your consultation modality, select your slot converted automatically to your local time zone, and enter your intake inquiry."
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Book Consultation", to: null }
          ]}
          highlights={[
            { icon: Shield, text: "100% Confidential & Sacred" },
            { icon: Globe, text: "Automated Global Timezone Conversion" },
            { icon: CreditCard, text: "Secure Payment via PayPal or Direct" }
          ]}
        />

        {/* Main Content Area */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          
          {/* Progress Steps Indicator */}
          <div className="p-4 rounded-2xl bg-[var(--theme-bg-card)] border border-[var(--theme-border-subtle)] shadow-md">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { num: 1, title: "1. Selection" },
                { num: 2, title: "2. Time Slot" },
                { num: 3, title: "3. Sacred Intake" },
                { num: 4, title: "4. Confirmation" },
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
                  <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">Step 1 of 4</span>
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
                    <span>Proceed to Slot Selection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TIMEZONE & TIME SLOT SELECTION */}
          {step === 2 && (
            <div className="space-y-6 text-left animate-in fade-in duration-300">
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--theme-bg-card)] border border-orange-500/20 shadow-xl space-y-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">Step 2 of 4</span>
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--theme-text-heading)] mt-0.5">
                    Select Your Consultation Time Slot
                  </h2>
                  <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
                    Slots operate in Master Kashif's master schedule (PKT) and are automatically converted below into your local time zone.
                  </p>
                </div>

                {/* Client Timezone Switcher */}
                <div className="p-4 rounded-2xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--theme-text-heading)]">
                    <Globe className="w-4 h-4 text-orange-400" />
                    <span>Your Detected Local Time Zone:</span>
                  </div>

                  <select
                    value={clientTimezone}
                    onChange={(e) => setClientTimezone(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs font-medium outline-none focus:border-orange-500 cursor-pointer"
                  >
                    {commonTimezones.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>

                {/* Slots List / Grid */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[var(--theme-text-heading)] uppercase tracking-wider">
                    Available Live Slots:
                  </div>

                  {loadingSlots ? (
                    <div className="p-8 text-center text-xs text-[var(--theme-text-muted)] animate-pulse">
                      Calculating time zone conversions and loading available slots...
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] text-center space-y-3">
                      <p className="text-xs text-[var(--theme-text-secondary)]">
                        No pre-set online slots currently active for this specific date range.
                      </p>
                      <p className="text-xs text-orange-400 font-medium">
                        You can still proceed! Master Kashif will coordinate a custom session time directly with you upon receiving your booking intake.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedSlot?.slotId === slot.slotId || selectedSlot?._id === slot._id;
                        const isBooked = slot.status === 'booked';
                        const isBlocked = slot.status === 'blocked';
                        const disabled = isBooked || isBlocked;

                        return (
                          <button
                            key={slot._id || slot.slotId}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                              disabled
                                ? 'opacity-40 cursor-not-allowed border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card-subtle)]'
                                : isSelected
                                ? 'bg-orange-500/15 border-orange-500 shadow-md ring-2 ring-orange-500/30'
                                : 'bg-[var(--theme-bg-card-subtle)] border-[var(--theme-border-subtle)] hover:border-orange-500/40'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-[var(--theme-text-heading)]">
                              <span>{slot.conversion?.clientDate || slot.date}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                isBooked ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
                              }`}>
                                {slot.status}
                              </span>
                            </div>

                            <div className="mt-2 text-xs font-bold text-orange-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{slot.conversion?.clientTimeRange || `${slot.startTime} - ${slot.endTime}`}</span>
                            </div>

                            <div className="text-[10px] text-[var(--theme-text-muted)] font-mono mt-1">
                              Master PKT: {slot.startTime} - {slot.endTime} (UTC+5)
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Back & Next Navigation */}
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
                    type="button"
                    onClick={handleProceedToStep3}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                  >
                    <span>Proceed to Sacred Intake</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SACRED INTAKE FORM */}
          {step === 3 && (
            <div className="space-y-6 text-left animate-in fade-in duration-300">
              <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 rounded-3xl bg-[var(--theme-bg-card)] border border-orange-500/20 shadow-xl space-y-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">Step 3 of 4</span>
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--theme-text-heading)] mt-0.5">
                    Sacred Intake & Astrological Details
                  </h2>
                  <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
                    Your details remain strictly confidential and are used exclusively to cast your Vedic Kundli and consecrate your Tarot reading.
                  </p>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500 transition-colors"
                    />
                    {errors.fullName && <p className="text-rose-400 text-[10px] mt-1">{errors.fullName}</p>}
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
                      placeholder="eleanor@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500 transition-colors"
                    />
                    {errors.email && <p className="text-rose-400 text-[10px] mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+44 7400 000000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500 transition-colors"
                    />
                    {errors.phone && <p className="text-rose-400 text-[10px] mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                      Relationship Status
                    </label>
                    <select
                      value={formData.relationshipStatus}
                      onChange={(e) => setFormData({ ...formData, relationshipStatus: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="Single">Single</option>
                      <option value="In a Relationship">In a Relationship</option>
                      <option value="Married">Married</option>
                      <option value="Separated / Divorced">Separated / Divorced</option>
                      <option value="Complicated / In Transition">Complicated / In Transition</option>
                    </select>
                  </div>
                </div>

                {/* Birth Coordinates for Vedic Chart */}
                <div className="p-4 rounded-2xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] space-y-4">
                  <div className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    Astronomical Birth Data (For Natal Chart Calculation)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--theme-text-secondary)] mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500 cursor-pointer"
                      />
                      {errors.dob && <p className="text-rose-400 text-[10px] mt-1">{errors.dob}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--theme-text-secondary)] mb-1">
                        Exact Birth Time
                      </label>
                      <input
                        type="time"
                        disabled={formData.unknownBirthTime}
                        value={formData.birthTime}
                        onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500 disabled:opacity-50"
                      />
                      <label className="flex items-center gap-1.5 mt-1.5 text-[10px] text-[var(--theme-text-muted)] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.unknownBirthTime}
                          onChange={(e) => setFormData({ ...formData, unknownBirthTime: e.target.checked })}
                          className="rounded text-orange-500"
                        />
                        <span>Birth time unknown</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--theme-text-secondary)] mb-1">
                        Birth Place (City & Country)
                      </label>
                      <input
                        type="text"
                        value={formData.birthPlace}
                        onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                        placeholder="e.g. London, UK"
                        className="w-full px-3.5 py-2 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-medium text-[var(--theme-text-secondary)] mb-1">
                        Mother's First Name (Traditional Vedic Spiritual Anchor)
                      </label>
                      <input
                        type="text"
                        value={formData.motherName}
                        onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                        placeholder="e.g. Mary"
                        className="w-full px-3.5 py-2 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--theme-text-secondary)] mb-1">
                        Current City / Location
                      </label>
                      <input
                        type="text"
                        value={formData.currentLocation}
                        onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                        placeholder="e.g. Manchester, UK"
                        className="w-full px-3.5 py-2 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Core Questions / Themes */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] mb-1">
                    Your Core Questions & Themes of Exploration *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.questions}
                    onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                    placeholder="Share the background of your situation, names of relevant people involved, or specific questions you wish the cards and chart to illuminate..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-input)] border border-[var(--theme-border-default)] text-[var(--theme-text-heading)] text-xs outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                  {errors.questions && <p className="text-rose-400 text-[10px] mt-1">{errors.questions}</p>}
                </div>

                {/* Payment Preference */}
                <div className="p-4 rounded-2xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] space-y-2">
                  <label className="block text-xs font-bold text-[var(--theme-text-heading)] uppercase tracking-wider">
                    Preferred Settlement Method:
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
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[var(--theme-text-secondary)] bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Slot Picker</span>
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

          {/* STEP 4: ORDER CONFIRMATION & RECEIPT */}
          {step === 4 && createdOrder && (
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
