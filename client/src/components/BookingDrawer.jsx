import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Trash2, Sparkles, ShoppingBag, ArrowRight, ArrowLeft, 
  Calendar, Clock, MapPin, User, Mail, Phone, Heart, 
  CheckCircle2, Copy, Send, ExternalLink, ShieldCheck, AlertCircle, CreditCard 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { siteData } from '../data';
import { submitBookingOrder, initiatePayPalPayment, capturePayPalPayment } from '../services/api';

export default function BookingDrawer({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onRemoveItem, 
  onClearCart,
  onOrderCreated 
}) {
  const [step, setStep] = useState(1); // 1: Cart Items, 2: Personal Intake, 3: Confirmation
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalSuccess, setPaypalSuccess] = useState(false);

  // Form State
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

  if (!isOpen) return null;

  // Calculate pricing
  const subtotal = cartItems.reduce((acc, item) => acc + (item.priceNumeric || 0), 0);
  const hasCaseBased = cartItems.some(i => i.isCaseBased || i.priceNumeric === 0);

  const validateStep2 = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid Email is required';
    if (!formData.phone.trim()) errs.phone = 'WhatsApp / Phone number is required';
    if (!formData.dob) errs.dob = 'Date of birth is required for readings';
    if (!formData.questions.trim()) errs.questions = 'Please briefly share what questions or themes you wish to explore';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToIntake = () => {
    if (cartItems.length === 0) return;
    setStep(2);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        clientName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        services: cartItems.map(i => i.name),
        total: hasCaseBased && subtotal === 0 ? 'Case Quote' : `£${subtotal}`,
        totalNumeric: subtotal,
        details: { ...formData }
      };

      const res = await submitBookingOrder(payload);
      const newOrder = res.success ? res.order : {
        orderId: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
        ...payload,
        status: 'Pending Review',
        paymentStatus: 'Awaiting PayPal Confirmation'
      };

      setCreatedOrder(newOrder);
      if (onOrderCreated) {
        onOrderCreated(newOrder);
      }

      setStep(3);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f97316', '#eab308', '#ffffff', '#fb923c']
        });
      } catch {
        // gracefully ignore
      }
    } catch (err) {
      console.error('Booking submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayPalCheckout = async () => {
    if (!createdOrder) return;
    setPaypalLoading(true);
    try {
      const init = await initiatePayPalPayment(createdOrder.orderId || createdOrder.id, subtotal);
      if (init.success && init.paypalOrderId) {
        const capture = await capturePayPalPayment(createdOrder.orderId || createdOrder.id, init.paypalOrderId);
        if (capture.success) {
          setPaypalSuccess(true);
          setCreatedOrder(prev => ({ ...prev, paymentStatus: 'Paid via PayPal', status: 'Session Scheduled' }));
        }
      }
    } catch (err) {
      console.error('PayPal checkout error:', err);
    } finally {
      setPaypalLoading(false);
    }
  };

  const generateWhatsAppMessage = () => {
    if (!createdOrder) return '';
    const text = `Hello Kashif, I have submitted a booking request on your website.
*Order Reference:* ${createdOrder.id}
*Name:* ${formData.fullName}
*Selected Services:* ${createdOrder.services.join(', ')}
*Total:* ${createdOrder.total}
*Date of Birth:* ${formData.dob} ${formData.unknownBirthTime ? '(Birth time unknown)' : `at ${formData.birthTime}`}
*Birthplace:* ${formData.birthPlace || 'Not specified'}
*Mother's Name:* ${formData.motherName || 'Not specified'}
*Current Location:* ${formData.currentLocation || 'Not specified'}
*My Questions / Focus:* ${formData.questions}

Please let me know how to proceed with PayPal payment and scheduling. Thank you!`;
    return encodeURIComponent(text);
  };

  const handleCopySummary = () => {
    if (!createdOrder) return;
    const summary = `TAROT BY KASHIF - BOOKING REQUEST
Order Reference: ${createdOrder.id}
Client: ${formData.fullName} (${formData.email}, ${formData.phone})
Services: ${createdOrder.services.join(', ')}
Amount: ${createdOrder.total}
DOB: ${formData.dob}
Questions: ${formData.questions}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Drawer Window */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-xl bg-[#090d17] border-l border-orange-500/30 h-full flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.95)] z-10 overflow-hidden text-left"
        >
          {/* Drawer Top Header */}
          <div className="p-4 sm:p-5 border-b border-orange-500/20 bg-[#0d1222]/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                  <span>Your Spiritual Selection</span>
                </h3>
                <div className="text-xs text-orange-300">
                  {step === 1 && `Step 1 of 3: Selected Services (${cartItems.length})`}
                  {step === 2 && 'Step 2 of 3: Personal & Astrological Intake'}
                  {step === 3 && 'Step 3 of 3: Booking Confirmation'}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#141b2e] hover:bg-[#1d2742] text-slate-300 hover:text-white border border-white/10"
              aria-label="Close Selection Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* STEP 1: CART ITEMS */}
            {step === 1 && (
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 mx-auto flex items-center justify-center">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h4 className="font-cinzel text-lg font-bold text-white">Your Selection is Empty</h4>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto">
                      Choose a tarot reading, numerology consultation, or complete guidance package to begin.
                    </p>
                    <a
                      href="#services"
                      onClick={onClose}
                      className="inline-block mt-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 shadow-md"
                    >
                      Browse Offerings
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
                      <span>Selected Items</span>
                      <button 
                        onClick={onClearCart}
                        className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div 
                          key={item.id}
                          className="p-3.5 rounded-xl bg-[#0f1424] border border-orange-500/20 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#182035] shrink-0 border border-white/10">
                              <img 
                                src={item.image || '/images/hero.jpg'} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-white line-clamp-1">{item.name}</h4>
                              <div className="text-xs text-orange-400 font-cinzel font-bold">{item.price}</div>
                              <span className="text-[10px] text-slate-400">{item.category || 'Package'}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Summary Calculation */}
                    <div className="pt-4 p-4 rounded-xl bg-[#0c101c] border border-orange-500/20 space-y-2">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Items Subtotal:</span>
                        <span className="font-semibold text-white">£{subtotal} GBP</span>
                      </div>
                      {hasCaseBased && (
                        <div className="flex justify-between text-xs text-amber-300">
                          <span>Case-based Ritual:</span>
                          <span className="italic">Individual quote</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                        <span className="text-sm font-bold text-white">Total Estimate:</span>
                        <span className="font-cinzel text-2xl font-black text-gradient-orange">
                          {hasCaseBased && subtotal === 0 ? 'Case Quote' : `£${subtotal} GBP`}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-orange-950/20 border border-orange-500/30 text-xs text-orange-200/90 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      <span>
                        All fees in GBP (£). Completing this intake submits a booking request to Kashif. Payments handled safely via PayPal.
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 2: PERSONAL INTAKE FORM */}
            {step === 2 && (
              <form id="booking-intake-form" onSubmit={handleSubmitBooking} className="space-y-4">
                <div className="text-xs text-slate-300 bg-[#0e1424] p-3 rounded-lg border border-orange-500/20">
                  <span className="text-orange-400 font-semibold">Confidential Information:</span> Kashif uses your birth data and questions exclusively to cast your chart and prepare your session.
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Full Name <span className="text-orange-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#0c101c] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Email Address <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-[#0c101c] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      WhatsApp / Phone <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="+44 7..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-[#0c101c] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                      />
                    </div>
                    {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Date of Birth & Time of Birth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Date of Birth <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0c101c] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                      />
                    </div>
                    {errors.dob && <p className="text-[11px] text-rose-400 mt-1">{errors.dob}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Time of Birth (Optional)
                    </label>
                    <input
                      type="text"
                      disabled={formData.unknownBirthTime}
                      placeholder="e.g. 06:45 AM"
                      value={formData.birthTime}
                      onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0c101c] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none disabled:opacity-40"
                    />
                    <label className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.unknownBirthTime}
                        onChange={(e) => setFormData({ ...formData, unknownBirthTime: e.target.checked, birthTime: e.target.checked ? 'Unknown / Approximate' : '' })}
                        className="accent-orange-500 rounded"
                      />
                      <span>Birth time approximate or unknown</span>
                    </label>
                  </div>
                </div>

                {/* Birthplace & Mother's Name (Traditional reference) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Birthplace (City, Country)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. London, UK"
                      value={formData.birthPlace}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0c101c] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Mother's First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Traditional astrological reference"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0c101c] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                {/* Current Location & Relationship Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Current City & Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Manchester, UK"
                      value={formData.currentLocation}
                      onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0c101c] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Relationship Status
                    </label>
                    <select
                      value={formData.relationshipStatus}
                      onChange={(e) => setFormData({ ...formData, relationshipStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0c101c] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                    >
                      <option>Single / Seeking Direction</option>
                      <option>In a Relationship</option>
                      <option>Complicated / Distance</option>
                      <option>Married / Cohabitating</option>
                      <option>Separated / Breakup</option>
                    </select>
                  </div>
                </div>

                {/* Questions / Matters to explore */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Your Questions / Situation to Explore <span className="text-orange-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Briefly describe what matters most right now (e.g. relationship crossroads, career choices, inner blockages)..."
                    value={formData.questions}
                    onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                    className="w-full p-3 bg-[#0c101c] border border-orange-500/20 rounded-xl text-xs sm:text-sm text-white focus:border-orange-500 outline-none resize-none"
                  />
                  {errors.questions && <p className="text-[11px] text-rose-400 mt-1">{errors.questions}</p>}
                </div>

                {/* Payment Option Notice */}
                <div className="p-3 rounded-xl bg-[#0e1322] border border-orange-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">Payment Option</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">PayPal Protected</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    PayPal is the only payment option. Kashif will confirm payment link & available reading appointment time directly.
                  </p>
                </div>
              </form>
            )}

            {/* STEP 3: BOOKING CONFIRMATION & WHATSAPP ACTION */}
            {step === 3 && createdOrder && (
              <div className="space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center animate-pulse">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h4 className="font-cinzel text-xl font-bold text-white">Booking Request Generated!</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Your details have been prepared for Kashif's personal review.
                  </p>
                </div>

                {/* Order Summary Box */}
                <div className="p-4 rounded-2xl bg-[#0c101c] border border-orange-500/30 text-left space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs text-slate-400">Order Reference:</span>
                    <span className="font-mono text-sm font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
                      {createdOrder.id}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-200">
                    <div><span className="text-slate-400">Client:</span> {formData.fullName}</div>
                    <div><span className="text-slate-400">Services:</span> {createdOrder.services.join(', ')}</div>
                    <div><span className="text-slate-400">Amount:</span> <strong className="text-gradient-orange">{createdOrder.total}</strong></div>
                    <div><span className="text-slate-400">Status:</span> <span className="text-amber-400 font-semibold">{createdOrder.status}</span></div>
                  </div>
                </div>

                {/* Action Buttons: WhatsApp & PayPal */}
                <div className="space-y-2.5">
                  <a
                    href={`https://wa.me/447400000000?text=${generateWhatsAppMessage()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Order to Kashif on WhatsApp</span>
                  </a>

                  {/* PayPal Instant Checkout Simulation */}
                  <button
                    onClick={handlePayPalCheckout}
                    disabled={paypalLoading || paypalSuccess}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.35)] transition-all disabled:opacity-70 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>
                      {paypalLoading ? 'Processing PayPal...' : paypalSuccess ? '✓ PayPal Payment Captured' : `Instant PayPal Checkout (${createdOrder.total})`}
                    </span>
                  </button>

                  <button
                    onClick={handleCopySummary}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#13192c] hover:bg-[#1a233c] border border-white/10 flex items-center justify-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-orange-400" />
                    <span>{copied ? 'Summary Copied to Clipboard!' : 'Copy Order Summary'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-[11px] text-slate-400 text-left">
                  <span className="font-semibold text-slate-300">Next Steps:</span> Kashif will review your birth placements and reply via WhatsApp or Email within 2-4 hours to provide the PayPal link and schedule your reading appointment.
                </div>
              </div>
            )}

          </div>

          {/* Drawer Bottom Controls */}
          <div className="p-4 sm:p-5 bg-[#090d17] border-t border-orange-500/20 flex items-center justify-between gap-3">
            {step === 1 && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#121626] border border-white/10"
                >
                  Continue Browsing
                </button>

                <button
                  disabled={cartItems.length === 0}
                  onClick={handleProceedToIntake}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                  <span>Proceed to Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#121626] border border-white/10 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  form="booking-intake-form"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Preparing Request...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm & Book Request</span>
                    </>
                  )}
                </button>
              </>
            )}

            {step === 3 && (
              <button
                onClick={() => {
                  setStep(1);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500"
              >
                Close & Return to Sanctuary
              </button>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
