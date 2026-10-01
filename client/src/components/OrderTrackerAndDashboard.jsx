import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, CheckCircle2, Clock, Calendar, BarChart3, 
  Sparkles, RefreshCw, MessageSquare
} from 'lucide-react';
import { siteData } from '../data';

export default function OrderTrackerAndDashboard({ 
  isOpen, 
  onClose, 
  customOrders = [] 
}) {
  const [searchOrderId, setSearchOrderId] = useState('');

  // Combine initial mock orders with newly created orders from the session
  const allOrders = [
    ...customOrders,
    ...siteData.mockStats.recentOrders
  ];

  if (!isOpen) return null;

  // Search logic for client tracker
  const trackedOrder = searchOrderId.trim() 
    ? allOrders.find(o => 
        (o.orderId && o.orderId.toLowerCase() === searchOrderId.trim().toLowerCase()) ||
        (o.id && o.id.toLowerCase() === searchOrderId.trim().toLowerCase()) ||
        (o.email && o.email.toLowerCase() === searchOrderId.trim().toLowerCase())
      )
    : (allOrders[0] || null);

  const displayId = trackedOrder?.orderId || trackedOrder?.id;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-[#090d18] border border-orange-500/30 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden z-10 my-6 flex flex-col max-h-[90vh] text-left"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-orange-500/20 bg-[#0d1222] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                  Client Reading Order Tracker
                </h3>
                <p className="text-xs text-slate-400">
                  Enter your Order Reference ID (e.g. TK-9402) to inspect live session progress
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#141b2e] hover:bg-[#1d2742] text-slate-300 hover:text-white border border-white/10 cursor-pointer"
              aria-label="Close Order Tracker"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Search Bar */}
            <div className="p-4 rounded-xl bg-[#0e1424] border border-orange-500/20 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. TK-9402, TK-9388) or Email..."
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-[#080b13] border border-white/10 rounded-lg text-xs sm:text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Quick Try:</span>
                <button 
                  onClick={() => setSearchOrderId('TK-9402')} 
                  className="text-orange-400 hover:underline cursor-pointer"
                >
                  TK-9402
                </button>
                <span>•</span>
                <button 
                  onClick={() => setSearchOrderId('TK-9388')} 
                  className="text-orange-400 hover:underline cursor-pointer"
                >
                  TK-9388
                </button>
              </div>
            </div>

            {/* Status View Card */}
            {trackedOrder ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0d1220] border border-orange-500/30 space-y-6">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="text-xs font-mono text-orange-400 font-bold">
                      ORDER #{displayId}
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      {trackedOrder.clientName}
                    </h4>
                    <div className="text-xs text-slate-400">
                      Booked on: {trackedOrder.date || 'Today'}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      trackedOrder.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : trackedOrder.status === 'Session Scheduled'
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {trackedOrder.status}
                    </span>
                    <div className="text-xs text-slate-400 mt-1">
                      Payment: {trackedOrder.paymentStatus || 'Awaiting PayPal Invoicing'}
                    </div>
                  </div>
                </div>

                {/* Visual Spiritual Milestone Progress Timeline */}
                <div className="py-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-4 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reading Lifecycle Progression</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                    {[
                      { 
                        label: '1. Request Received', 
                        desc: 'Intake logged in Kashif Sanctuary', 
                        done: true 
                      },
                      { 
                        label: '2. Astral Review', 
                        desc: 'Birth data & question analysis', 
                        done: trackedOrder.status !== 'Pending Review' 
                      },
                      { 
                        label: '3. PayPal & Time', 
                        desc: 'Time slot confirmed with client', 
                        done: trackedOrder.status === 'Session Scheduled' || trackedOrder.status === 'Completed' 
                      },
                      { 
                        label: '4. Session Delivery', 
                        desc: 'Live audio or written reading complete', 
                        done: trackedOrder.status === 'Completed' 
                      }
                    ].map((milestone, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-xl border transition-all ${
                          milestone.done 
                            ? 'bg-[#10172a] border-emerald-500/40 text-slate-200' 
                            : 'bg-[#090c14] border-white/5 text-slate-500 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className={`w-4 h-4 ${milestone.done ? 'text-emerald-400' : 'text-slate-600'}`} />
                          <span className="text-xs font-bold text-white">{milestone.label}</span>
                        </div>
                        <p className="text-[11px] leading-tight text-slate-400">{milestone.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booked Services & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#090c16] border border-white/5 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-400">Booked Services:</div>
                    <ul className="text-xs text-white space-y-1">
                      {trackedOrder.services?.map((svc, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                          <span>{svc}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 text-xs text-slate-300 font-bold border-t border-white/10 flex justify-between">
                      <span>Total Amount:</span>
                      <span className="text-orange-400 font-cinzel">{trackedOrder.total}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#090c16] border border-white/5 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-400">Client Focus & Questions:</div>
                    <p className="text-xs text-slate-200 italic font-serif leading-relaxed">
                      "{trackedOrder.details?.questions || trackedOrder.notes || 'General life direction and love consultation.'}"
                    </p>
                  </div>
                </div>

                {/* WhatsApp Assist */}
                <div className="pt-2 flex justify-end">
                  <a
                    href="https://wa.me/447400000000"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Have a question about this reading? Message Kashif on WhatsApp</span>
                  </a>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 rounded-xl bg-[#0d1220] border border-white/5">
                <p className="text-sm font-medium">No order found with reference "{searchOrderId}".</p>
                <p className="text-xs mt-1">Please double-check your order ID or contact Kashif directly.</p>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-[#0d1222] border-t border-orange-500/20 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Tarot By Kashif • Official Client Order Status Verification
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#141b2e] hover:bg-[#1d2742] border border-white/10 cursor-pointer"
            >
              Close Tracker
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
