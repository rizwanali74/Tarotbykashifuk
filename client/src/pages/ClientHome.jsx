import React, { useState, useEffect } from 'react';
import CelestialBackground from '../components/CelestialBackground';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import ServiceModal from '../components/ServiceModal';
import PackagesSection from '../components/PackagesSection';
import BookingDrawer from '../components/BookingDrawer';
import OrderTrackerAndDashboard from '../components/OrderTrackerAndDashboard';
import ContactSection from '../components/ContactSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import { ShoppingBag, MessageSquare, Sparkles } from 'lucide-react';

export default function ClientHome() {
  // Cart / Selection State
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('tarot_kashif_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Client Orders State (persisted to localStorage)
  const [customOrders, setCustomOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('tarot_kashif_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [selectedService, setSelectedService] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('tarot_kashif_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem('tarot_kashif_orders', JSON.stringify(customOrders));
  }, [customOrders]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (item) => {
    const exists = cartItems.some(i => i.id === item.id);
    if (exists) {
      setCartItems(cartItems.filter(i => i.id !== item.id));
      showToast(`Removed "${item.name}" from selection.`);
    } else {
      setCartItems([...cartItems, item]);
      showToast(`Added "${item.name}" to selection!`);
    }
  };

  const handleAddPackage = (pkg) => {
    const exists = cartItems.some(i => i.id === pkg.id);
    if (!exists) {
      setCartItems([...cartItems, pkg]);
      showToast(`Added "${pkg.name}" to selection!`);
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(cartItems.filter(i => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast("Selection cleared.");
  };

  const isItemInCart = (id) => {
    return cartItems.some(i => i.id === id);
  };

  const handleOrderCreated = (order) => {
    setCustomOrders(prev => [order, ...prev]);
    setCartItems([]);
    showToast(`Booking request ${order.orderId || order.id} generated! Email sent.`);
  };

  const cartTotalNumeric = cartItems.reduce((acc, i) => acc + (i.priceNumeric || 0), 0);

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#fcfcfc] overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      {/* Animated Celestial Background Layer */}
      <CelestialBackground />

      {/* Main Client Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Bar (Pure Customer View - No Admin Links) */}
        <Navbar 
          cartItems={cartItems}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenDashboard={() => setIsTrackerOpen(true)}
        />

        {/* Hero Section */}
        <Hero 
          onExploreServices={() => {}}
          onSelectPackage={handleAddPackage}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* About Kashif & Credentials */}
        <AboutSection />

        {/* Services Catalog */}
        <ServicesSection 
          onOpenServiceModal={(svc) => setSelectedService(svc)}
          onAddToCart={handleAddToCart}
          isItemInCart={isItemInCart}
        />

        {/* Comprehensive Packages */}
        <PackagesSection 
          onAddPackage={handleAddPackage}
          isItemInCart={isItemInCart}
        />

        {/* Contact Us Form */}
        <ContactSection />

        {/* FAQ Accordion */}
        <FAQSection />

        {/* Footer */}
        <Footer 
          onOpenOrders={() => setIsTrackerOpen(true)}
        />

      </div>

      {/* Service Detail Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        onAddToCart={handleAddToCart}
        isItemInCart={isItemInCart}
      />

      {/* Cart & Intake Booking Drawer */}
      <BookingDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderCreated={handleOrderCreated}
      />

      {/* Client Order Status Tracker Modal */}
      <OrderTrackerAndDashboard
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        customOrders={customOrders}
      />

      {/* Floating Action Pill (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
        {/* Floating WhatsApp Quick Action */}
        <a
          href="https://wa.me/447400000000"
          target="_blank"
          rel="noreferrer"
          className="group relative flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full bg-[#101728] border border-emerald-500/40 text-emerald-400 hover:text-white hover:bg-emerald-600 shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all duration-300"
          aria-label="Chat on WhatsApp"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2 sm:hidden" />
          <MessageSquare className="w-5 h-5 shrink-0" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            Chat on WhatsApp
          </span>
        </a>

        {/* Floating Cart / Selection Trigger */}
        {cartItems.length > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white font-bold text-xs shadow-[0_0_30px_rgba(249,115,22,0.5)] border border-orange-300/40 hover:scale-105 transition-all animate-bounce cursor-pointer"
            aria-label="View Selection"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-black text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            </div>
            <span>Review Selection (£{cartTotalNumeric})</span>
          </button>
        )}
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#0e1424] border border-orange-500/50 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
