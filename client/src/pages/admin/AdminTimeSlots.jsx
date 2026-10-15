import React, { useState, useEffect, useMemo, useRef } from 'react';
import Select from 'react-select';
import { 
  Clock, Calendar, Globe, Plus, Trash2, Edit3, CheckCircle, 
  XCircle, AlertCircle, RefreshCw, Filter, Sparkles, User, 
  MapPin, Check, Save, ArrowRight, ShieldCheck, Sun, Moon,
  Copy, Layers, ChevronDown, CheckCircle2, Zap, Search
} from 'lucide-react';
import { 
  fetchTimeSlots, createTimeSlot, updateTimeSlot, 
  deleteTimeSlot, batchGenerateTimeSlots, autoGenerateWeeklySlots,
  fetchAvailabilitySettings, updateAvailabilitySettings 
} from '../../services/api';

// Major countries and timezones for live multi-country conversion
export const SUPPORTED_REGIONS = [
  { id: 'PK', name: 'Pakistan', flag: '🇵🇰', timezone: 'Asia/Karachi', label: 'PKT (UTC+5)', isBase: true },
  { id: 'UK', name: 'United Kingdom', flag: '🇬🇧', timezone: 'Europe/London', label: 'GMT / BST' },
  { id: 'US_NY', name: 'USA (New York)', flag: '🇺🇸', timezone: 'America/New_York', label: 'EST / EDT' },
  { id: 'US_LA', name: 'USA (Los Angeles)', flag: '🇺🇸', timezone: 'America/Los_Angeles', label: 'PST / PDT' },
  { id: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', timezone: 'Asia/Dubai', label: 'GST (UTC+4)' },
  { id: 'EU', name: 'Europe (Paris/Berlin)', flag: '🇪🇺', timezone: 'Europe/Paris', label: 'CET / CEST' },
  { id: 'CA', name: 'Canada (Toronto)', flag: '🇨🇦', timezone: 'America/Toronto', label: 'EST / EDT' },
  { id: 'AU', name: 'Australia (Sydney)', flag: '🇦🇺', timezone: 'Australia/Sydney', label: 'AEST / AEDT' },
  { id: 'IN', name: 'India', flag: '🇮🇳', timezone: 'Asia/Kolkata', label: 'IST (UTC+5:30)' },
  { id: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', timezone: 'Asia/Riyadh', label: 'AST (UTC+3)' },
];

// Helper: Convert PKT (Asia/Karachi) date & time to target timezone
export function convertPktToTargetTime(dateStr, timeStr, targetTimezone) {
  if (!dateStr || !timeStr) return { time: '--:--', date: '--', tzAbbr: '' };
  try {
    const paddedTime = timeStr.length === 5 ? timeStr : timeStr.padStart(5, '0');
    // Construct ISO with PKT offset (+05:00)
    const iso = `${dateStr}T${paddedTime}:00+05:00`;
    const d = new Date(iso);

    if (isNaN(d.getTime())) return { time: timeStr, date: dateStr, tzAbbr: '' };

    const timeFormatted = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTimezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);

    const dateFormatted = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTimezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(d);

    const tzAbbr = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTimezone,
      timeZoneName: 'short',
    }).formatToParts(d).find(p => p.type === 'timeZoneName')?.value || '';

    return {
      time: timeFormatted,
      date: dateFormatted,
      tzAbbr,
      rawDate: d,
    };
  } catch (err) {
    return { time: timeStr, date: dateStr, tzAbbr: 'PKT' };
  }
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'available', label: '🟢 Available' },
  { value: 'booked', label: '🟡 Booked' },
  { value: 'blocked', label: '🔴 Blocked' },
];

const reactSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: 'var(--theme-bg-input, #ffffff)',
    borderColor: state.isFocused ? '#f97316' : 'var(--theme-border-default, #cbd5e1)',
    boxShadow: state.isFocused ? '0 0 0 1px #f97316' : 'none',
    borderRadius: '0.625rem',
    minHeight: '34px',
    height: '34px',
    fontSize: '11px',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#f97316',
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--theme-bg-card, #ffffff)',
    border: '1px solid var(--theme-border-default, #cbd5e1)',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
    zIndex: 50,
    overflow: 'hidden',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected 
      ? '#ea580c' 
      : state.isFocused 
      ? 'var(--theme-bg-card-subtle, rgba(249, 115, 22, 0.12))' 
      : 'transparent',
    color: state.isSelected ? '#ffffff' : 'var(--theme-text-heading, #0f172a)',
    fontSize: '11px',
    fontWeight: state.isSelected ? '600' : '400',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#f97316',
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--theme-text-heading, #0f172a)',
    fontSize: '11px',
    fontWeight: '600',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '4px',
    color: 'var(--theme-text-muted, #64748b)',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
};

export default function AdminTimeSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isGeneratingWeekly, setIsGeneratingWeekly] = useState(false);
  
  // Calculate current date in Pakistan format (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  // View conversion state
  const [activeViewingRegion, setActiveViewingRegion] = useState('PK');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef(null);

  // Filters: Defaults to current day slots!
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState(todayStr);

  // Active View: 'list' | 'slot-form' | 'settings'
  const [activeView, setActiveView] = useState('list');
  const [editingSlotId, setEditingSlotId] = useState(null);

  const [form, setForm] = useState({
    date: todayStr,
    startTime: '14:00', // 2:00 PM PKT
    endTime: '15:00',   // 3:00 PM PKT
    serviceType: 'All Services',
    capacity: 1,
    status: 'available',
    notes: '',
  });

  // Batch Form State
  const [batchForm, setBatchForm] = useState({
    date: todayStr,
    startHour: 14, // 2:00 PM PKT
    endHour: 22,   // 10:00 PM PKT
    durationMinutes: 60,
    breakMinutes: 15,
  });

  // Availability Settings State
  const [settings, setSettings] = useState({
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    defaultDailyStart: '14:00',
    defaultDailyEnd: '22:00',
    slotDurationMinutes: 60,
  });

  const selectedViewingRegion = SUPPORTED_REGIONS.find(r => r.id === activeViewingRegion) || SUPPORTED_REGIONS[0];

  // Close country dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSlots = async () => {
    setLoading(true);
    try {
      const [slotsRes, settingsRes] = await Promise.all([
        fetchTimeSlots({ timezone: selectedViewingRegion.timezone }),
        fetchAvailabilitySettings(),
      ]);

      if (slotsRes.success) {
        setSlots(slotsRes.slots || []);
      }
      if (settingsRes.success && settingsRes.settings) {
        setSettings(settingsRes.settings);
      }
    } catch (err) {
      console.error('Error fetching time slots:', err);
      showNotice('error', 'Failed to load time slots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, [selectedViewingRegion.timezone]);

  const showNotice = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleOpenAddModal = (slotToEdit = null) => {
    if (slotToEdit) {
      setEditingSlotId(slotToEdit._id || slotToEdit.slotId);
      setForm({
        date: slotToEdit.date,
        startTime: slotToEdit.startTime,
        endTime: slotToEdit.endTime,
        serviceType: slotToEdit.serviceType || 'All Services',
        capacity: slotToEdit.capacity || 1,
        status: slotToEdit.status || 'available',
        notes: slotToEdit.notes || '',
      });
    } else {
      setEditingSlotId(null);
      setForm({
        date: todayStr,
        startTime: '14:00',
        endTime: '15:00',
        serviceType: 'All Services',
        capacity: 1,
        status: 'available',
        notes: '',
      });
    }
    setActiveView('slot-form');
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    try {
      if (editingSlotId) {
        const res = await updateTimeSlot(editingSlotId, form);
        if (res.success) {
          showNotice('success', 'Time slot updated successfully in Pakistan Time.');
          setActiveView('list');
          loadSlots();
        } else {
          showNotice('error', res.error || 'Failed to update time slot.');
        }
      } else {
        const res = await createTimeSlot(form);
        if (res.success) {
          showNotice('success', 'New time slot created in Pakistan Standard Time.');
          setActiveView('list');
          loadSlots();
        } else {
          showNotice('error', res.error || 'Failed to create time slot.');
        }
      }
    } catch (err) {
      showNotice('error', err.message || 'Error saving time slot.');
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Are you sure you want to delete this time slot?')) return;
    try {
      const res = await deleteTimeSlot(id);
      if (res.success) {
        showNotice('success', 'Time slot removed.');
        setSlots(prev => prev.filter(s => s._id !== id && s.slotId !== id));
      } else {
        showNotice('error', res.error || 'Failed to delete slot.');
      }
    } catch (err) {
      showNotice('error', 'Error deleting time slot.');
    }
  };

  const handleToggleStatus = async (slot) => {
    const newStatus = slot.status === 'available' ? 'blocked' : 'available';
    try {
      const res = await updateTimeSlot(slot._id || slot.slotId, { status: newStatus });
      if (res.success) {
        setSlots(prev => prev.map(s => (s._id === slot._id || s.slotId === slot.slotId) ? { ...s, status: newStatus } : s));
        showNotice('success', `Slot status set to ${newStatus}.`);
      }
    } catch (err) {
      showNotice('error', 'Status toggle failed.');
    }
  };

  const handleAutoGenerateWeekly = async () => {
    setIsGeneratingWeekly(true);
    try {
      const res = await autoGenerateWeeklySlots({ daysAhead: 7 });
      if (res.success) {
        showNotice('success', res.message || 'Weekly slots created successfully!');
        loadSlots();
      } else {
        showNotice('error', res.error || 'Failed to auto-generate weekly slots.');
      }
    } catch (err) {
      showNotice('error', 'Error generating weekly slots.');
    } finally {
      setIsGeneratingWeekly(false);
    }
  };

  const handleRunBatchGenerate = async (e) => {
    e.preventDefault();
    try {
      const res = await batchGenerateTimeSlots(batchForm);
      if (res.success) {
        showNotice('success', res.message || 'Slots generated successfully.');
        setShowBatchModal(false);
        loadSlots();
      } else {
        showNotice('error', res.error || 'Failed to batch generate slots.');
      }
    } catch (err) {
      showNotice('error', 'Failed to generate batch slots.');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await updateAvailabilitySettings(settings);
      if (res.success) {
        showNotice('success', 'General availability settings updated.');
        setActiveView('list');
      } else {
        showNotice('error', res.error || 'Failed to update settings.');
      }
    } catch (err) {
      showNotice('error', 'Error updating availability settings.');
    }
  };

  // Filter slots
  const filteredSlots = useMemo(() => {
    return slots.filter(slot => {
      const matchStatus = filterStatus === 'all' || slot.status === filterStatus;
      const matchDate = !filterDate || slot.date === filterDate;
      return matchStatus && matchDate;
    });
  }, [slots, filterStatus, filterDate]);

  // Filter supported regions for dropdown
  const filteredRegions = useMemo(() => {
    if (!countrySearch.trim()) return SUPPORTED_REGIONS;
    return SUPPORTED_REGIONS.filter(r => 
      r.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
      r.label.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  // Real-time conversion preview calculation for the slot creation form
  const formConversionPreview = useMemo(() => {
    return SUPPORTED_REGIONS.map(region => {
      const startConv = convertPktToTargetTime(form.date, form.startTime, region.timezone);
      const endConv = convertPktToTargetTime(form.date, form.endTime, region.timezone);
      return {
        ...region,
        startFormatted: startConv.time,
        endFormatted: endConv.time,
        dateFormatted: startConv.date,
        tzAbbr: startConv.tzAbbr,
      };
    });
  }, [form.date, form.startTime, form.endTime]);

  // VIEW 1: DEDICATED SLOT CONFIGURATION PAGE
  if (activeView === 'slot-form') {
    return (
      <div className="space-y-5 text-left">
        {/* Top Banner Notice */}
        {statusMessage && (
          <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" /> : <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Breadcrumb Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--theme-border-subtle)] pb-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] text-xs font-semibold text-[var(--theme-text-heading)] border border-[var(--theme-border-subtle)] transition-colors cursor-pointer"
            >
              ← Back to Time Slots
            </button>
            <span className="text-xs text-[var(--theme-text-muted)]">/</span>
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--theme-text-heading)]">
              {editingSlotId ? 'Edit Daily Slot (Pakistan Time)' : 'Create Daily Slot (Pakistan Time)'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-orange-500 font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
            🇵🇰 Master Base Time: PKT (UTC+5)
          </span>
        </div>

        {/* The Card Form */}
        <div className="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card)] p-6 sm:p-7 space-y-5 text-left shadow-xs transition-colors">
          <form onSubmit={handleSaveSlot} className="space-y-4">
            {/* Row 1: Date, Start, End */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-1.5">
                  Slot Date (PKT) *
                </label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-input)] text-[var(--theme-text-heading)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm font-semibold focus:border-orange-500 outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-1.5">
                  Start Time (PKT) *
                </label>
                <input
                  type="time"
                  required
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-input)] text-[var(--theme-text-heading)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm font-semibold focus:border-orange-500 outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-1.5">
                  End Time (PKT) *
                </label>
                <input
                  type="time"
                  required
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-input)] text-[var(--theme-text-heading)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm font-semibold focus:border-orange-500 outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Row 2: Service & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-1.5">
                  Applicable Service
                </label>
                <select
                  value={form.serviceType}
                  onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-input)] text-[var(--theme-text-heading)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm font-semibold focus:border-orange-500 outline-none shadow-xs cursor-pointer"
                >
                  <option value="All Services">✨ All Services & Readings</option>
                  <option value="Tarot Reading">🔮 Tarot Reading</option>
                  <option value="Numerology Consultation">🔢 Numerology Consultation</option>
                  <option value="Spiritual Healing">🌿 Spiritual Healing & Istikhara</option>
                  <option value="Complete Guidance Package">🌟 Complete Guidance Package</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-1.5">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-input)] text-[var(--theme-text-heading)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm font-semibold focus:border-orange-500 outline-none shadow-xs cursor-pointer"
                >
                  <option value="available">🟢 Available for Booking</option>
                  <option value="blocked">🔴 Blocked / Off Slot</option>
                  <option value="booked">🟡 Booked</option>
                </select>
              </div>
            </div>

            {/* LIVE WORLD TIME CONVERSION PREVIEW IN DEDICATED CARD */}
            <div className="p-4 rounded-2xl bg-[var(--theme-bg-card-subtle)] border border-[var(--theme-border-subtle)] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--theme-text-secondary)] border-b border-[var(--theme-border-subtle)] pb-2">
                <span className="flex items-center gap-1.5 text-orange-500">
                  <Sparkles className="w-4 h-4" />
                  <span>Real-Time World Conversion Preview for this Slot:</span>
                </span>
                <span className="text-[11px] text-[var(--theme-text-muted)] font-normal">
                  International clients see:
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {formConversionPreview.map(reg => (
                  <div 
                    key={reg.id} 
                    className={`p-2.5 rounded-xl border ${
                      reg.isBase 
                        ? 'bg-orange-500/10 border-orange-500/40 shadow-xs' 
                        : 'bg-[var(--theme-bg-card)] border-[var(--theme-border-subtle)]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-0.5">
                      <span className="font-bold text-[var(--theme-text-heading)]">{reg.flag} {reg.name}</span>
                      <span className="font-mono text-[10px] font-semibold text-orange-500">{reg.tzAbbr}</span>
                    </div>
                    <div className="font-black text-[var(--theme-text-heading)] text-xs sm:text-sm">
                      {reg.startFormatted} - {reg.endFormatted}
                    </div>
                    <div className="text-[10px] text-[var(--theme-text-muted)]">
                      {reg.dateFormatted}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-1.5">
                Internal Notes (Optional)
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. Best aligned with UK/US clients"
                className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-input)] text-[var(--theme-text-heading)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm font-medium focus:border-orange-500 outline-none placeholder:text-[var(--theme-text-dim)] shadow-xs"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-[var(--theme-border-subtle)]">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[var(--theme-text-secondary)] bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingSlotId ? 'Save Changes' : 'Create Slot'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // VIEW 2: DEDICATED WORKING HOURS SETTINGS PAGE
  if (activeView === 'settings') {
    return (
      <div className="space-y-5 text-left">
        {/* Top Banner Notice */}
        {statusMessage && (
          <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" /> : <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Breadcrumb Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--theme-border-subtle)] pb-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] text-xs font-semibold text-[var(--theme-text-heading)] border border-[var(--theme-border-subtle)] transition-colors cursor-pointer"
            >
              ← Back to Time Slots
            </button>
            <span className="text-xs text-[var(--theme-text-muted)]">/</span>
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--theme-text-heading)]">
              Weekly Operating Hours & Master Availability
            </h3>
          </div>
          <span className="text-[11px] font-mono text-sky-500 font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
            Recurring Weekly Rules
          </span>
        </div>

        {/* The Settings Card */}
        <div className="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg-card)] p-6 sm:p-7 space-y-5 text-left shadow-xs transition-colors">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-1.5">
                  Start Operating Hour (PKT)
                </label>
                <input
                  type="time"
                  value={settings.defaultDailyStart || '14:00'}
                  onChange={(e) => setSettings({ ...settings, defaultDailyStart: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-input)] text-[var(--theme-text-heading)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm font-semibold focus:border-sky-500 outline-none shadow-xs"
                />
                <div className="text-[11px] text-[var(--theme-text-muted)] mt-1">2:00 PM PKT (10:00 AM London)</div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-1.5">
                  End Operating Hour (PKT)
                </label>
                <input
                  type="time"
                  value={settings.defaultDailyEnd || '22:00'}
                  onChange={(e) => setSettings({ ...settings, defaultDailyEnd: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[var(--theme-bg-input)] text-[var(--theme-text-heading)] border border-[var(--theme-border-default)] rounded-xl text-xs sm:text-sm font-semibold focus:border-sky-500 outline-none shadow-xs"
                />
                <div className="text-[11px] text-[var(--theme-text-muted)] mt-1">10:00 PM PKT (6:00 PM London)</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-2">
                Active Weekly Working Days
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const isChecked = (settings.workingDays || []).includes(day);
                  return (
                    <label 
                      key={day} 
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-sky-500/15 border-sky-500/40 text-sky-600 dark:text-sky-300' 
                          : 'bg-[var(--theme-bg-card-subtle)] border-[var(--theme-border-subtle)] text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-card-hover)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSettings({ ...settings, workingDays: [...(settings.workingDays || []), day] });
                          } else {
                            setSettings({ ...settings, workingDays: (settings.workingDays || []).filter(d => d !== day) });
                          }
                        }}
                        className="rounded text-sky-600 focus:ring-0"
                      />
                      <span>{day}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[var(--theme-border-subtle)]">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[var(--theme-text-secondary)] bg-[var(--theme-bg-card-subtle)] hover:bg-[var(--theme-bg-card-hover)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Operating Hours</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: MAIN SLOTS DASHBOARD LIST
  return (
    <div className="space-y-6 text-left">
      {/* Top Banner Notice */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" /> : <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Header & Main Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c101d]/95 border border-orange-500/20 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Time Slots & International Availability
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Admin master schedule operates in <strong className="text-orange-300">Pakistan Time (PKT, UTC+5)</strong>. Slots auto-convert globally for all international clients.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Auto Generate Weekly Slots Button */}
          <button
            type="button"
            onClick={handleAutoGenerateWeekly}
            disabled={isGeneratingWeekly}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Auto-generate 7 days of recurring slots based on working hours"
          >
            <Zap className={`w-4 h-4 ${isGeneratingWeekly ? 'animate-bounce' : ''}`} />
            <span>{isGeneratingWeekly ? 'Generating Week...' : '⚡ Auto-Generate Weekly Slots'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal()}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Daily Slot
          </button>

          <button
            type="button"
            onClick={() => setActiveView('settings')}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-sky-400" /> Working Hours
          </button>

          <button
            type="button"
            onClick={loadSlots}
            title="Refresh slots"
            className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* COUNTRY SELECTOR DROPDOWN & REAL-TIME TIMEZONE BAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0f1a] border border-white/10 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
              <Globe className="w-4 h-4 text-orange-400" />
              <span>Target Country / Client Timezone Conversion:</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Select any country to convert and preview how international clients see the schedule.
            </p>
          </div>

          {/* Interactive Country Dropdown Menu */}
          <div className="relative w-full sm:w-80" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 border border-slate-300 hover:border-orange-500 shadow-sm transition-all text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-base">{selectedViewingRegion.flag}</span>
                <span className="font-bold text-slate-900 truncate">{selectedViewingRegion.name}</span>
                <span className="text-[11px] text-orange-600 font-mono bg-orange-50 px-1.5 py-0.5 rounded">
                  {selectedViewingRegion.label}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Options */}
            {isCountryDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl z-40 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                {/* Search input in dropdown */}
                <div className="p-2.5 bg-slate-50 border-b border-slate-200">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search country or timezone..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto p-1 space-y-0.5">
                  {filteredRegions.map(reg => {
                    const isSelected = activeViewingRegion === reg.id;
                    return (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => {
                          setActiveViewingRegion(reg.id);
                          setIsCountryDropdownOpen(false);
                          setCountrySearch('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          isSelected ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base">{reg.flag}</span>
                          <span className="truncate">{reg.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {reg.label}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Country Active Ribbon */}
        <div className="p-3 rounded-xl bg-[#07090e] border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-base">{selectedViewingRegion.flag}</span>
            <span>Currently Viewing Schedule in:</span>
            <strong className="text-white font-bold">{selectedViewingRegion.name} ({selectedViewingRegion.label})</strong>
          </div>
          <div className="text-[11px] font-mono text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
            Base Admin Input: 🇵🇰 Pakistan Standard Time (PKT / UTC+5)
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH BAR WITH REACT-SELECT & CURRENT DAY TOGGLE */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0b0f1a] border border-white/5 shadow-md">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter with React-Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 flex items-center gap-1 font-semibold">
              <Filter className="w-3.5 h-3.5 text-orange-400" /> Status:
            </span>
            <div className="w-44">
              <Select
                options={STATUS_OPTIONS}
                value={STATUS_OPTIONS.find(opt => opt.value === filterStatus) || STATUS_OPTIONS[0]}
                onChange={(opt) => setFilterStatus(opt ? opt.value : 'all')}
                styles={reactSelectStyles}
                isSearchable={false}
              />
            </div>
          </div>

          {/* Quick Date Switch: Current Day (Default) vs All Days */}
          <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
            <button
              type="button"
              onClick={() => setFilterDate(todayStr)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                filterDate === todayStr 
                  ? 'bg-orange-500 text-white shadow-sm ring-1 ring-orange-400' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span>Today's Slots</span>
              {filterDate === todayStr && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            </button>

            <button
              type="button"
              onClick={() => setFilterDate('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                !filterDate 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              All Days
            </button>
          </div>
        </div>

        {/* Custom Date Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Specific Date:</span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-white border border-slate-300 text-slate-900 font-medium rounded-xl px-2.5 py-1 text-xs outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cursor-pointer shadow-xs"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 underline cursor-pointer"
            >
              Show All
            </button>
          )}
        </div>
      </div>

      {/* SLOTS TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0c101d]/90 backdrop-blur-md shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0f1527] text-slate-400 border-b border-white/10 uppercase tracking-wider font-semibold text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Ref ID</th>
              <th className="py-2.5 px-3">Service / Booking Details</th>
              <th className="py-2.5 px-3">
                <div className="flex items-center gap-1 text-orange-300 font-bold">
                  <span>🇵🇰 Pakistan (PKT)</span>
                  <span className="text-[9px] text-slate-400 font-normal">[Master]</span>
                </div>
              </th>
              <th className="py-2.5 px-3">
                <div className="flex items-center gap-1 text-sky-300 font-bold">
                  <span>{selectedViewingRegion.flag} {selectedViewingRegion.name}</span>
                  <span className="text-[9px] text-slate-400 font-normal">[{selectedViewingRegion.label}]</span>
                </div>
              </th>
              <th className="py-2.5 px-3">Capacity</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                    <span className="text-xs">Loading slots and calculating world time conversions...</span>
                  </div>
                </td>
              </tr>
            ) : filteredSlots.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  <p className="text-xs">No time slots found matching your current filter.</p>
                  <div className="flex items-center justify-center gap-2.5 mt-3">
                    <button
                      onClick={handleAutoGenerateWeekly}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1 shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5" /> Auto-Generate Week
                    </button>
                    <button
                      onClick={() => handleOpenAddModal()}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Single Slot
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSlots.map((slot) => {
                const targetConv = convertPktToTargetTime(slot.date, slot.startTime, selectedViewingRegion.timezone);
                const targetEndConv = convertPktToTargetTime(slot.date, slot.endTime, selectedViewingRegion.timezone);

                const isBooked = slot.status === 'booked';
                const isBlocked = slot.status === 'blocked';
                const isAvailable = slot.status === 'available';

                return (
                  <tr key={slot._id || slot.slotId} className="hover:bg-[#12192e] transition-colors">
                    {/* ID */}
                    <td className="py-2.5 px-3 font-mono font-bold text-orange-400 text-[11px] whitespace-nowrap">
                      {slot.slotId || slot._id?.slice(-6)}
                    </td>

                    {/* Service & Booking Info (NO GENERIC TITLE) */}
                    <td className="py-2.5 px-3">
                      {isBooked && slot.bookingInfo?.serviceName ? (
                        <div>
                          <div className="font-semibold text-white text-xs">{slot.bookingInfo.serviceName}</div>
                          <div className="text-[11px] text-amber-300 font-medium flex items-center gap-1 mt-0.5">
                            <span>👤 {slot.bookingInfo.clientName}</span>
                            {slot.bookingInfo.orderId && <span className="font-mono text-[10px] text-slate-400">({slot.bookingInfo.orderId})</span>}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-white text-xs">{slot.serviceType || 'All Services'}</div>
                          <div className="text-[10px] text-emerald-400 font-normal">Available for booking</div>
                        </div>
                      )}
                      {slot.notes && (
                        <div className="text-[10px] text-slate-400 italic mt-0.5 max-w-[200px] truncate" title={slot.notes}>
                          "{slot.notes}"
                        </div>
                      )}
                    </td>

                    {/* Pakistan Time (Master) */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="font-semibold text-white flex items-center gap-1 text-xs">
                        <span>🇵🇰</span>
                        <span>{slot.startTime} - {slot.endTime}</span>
                        <span className="text-[9px] font-mono text-orange-400 bg-orange-500/10 px-1 rounded">PKT</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {slot.date}
                      </div>
                    </td>

                    {/* Converted Target Time */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="font-semibold text-sky-200 flex items-center gap-1 text-xs">
                        <span>{selectedViewingRegion.flag}</span>
                        <span>{targetConv.time} - {targetEndConv.time}</span>
                        <span className="text-[9px] font-mono text-sky-400 bg-sky-500/10 px-1 rounded">{targetConv.tzAbbr}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {targetConv.date}
                      </div>
                    </td>

                    {/* Capacity */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-semibold">
                        {slot.bookedCount || 0} / {slot.capacity || 1}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(slot)}
                        title="Click to toggle Available / Blocked"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                          isAvailable 
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                            : isBooked 
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                      >
                        {isAvailable && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                        {isBooked && <User className="w-3 h-3 text-amber-400" />}
                        {isBlocked && <XCircle className="w-3 h-3 text-rose-400" />}
                        <span className="capitalize">{slot.status}</span>
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenAddModal(slot)}
                          title="Edit Daily Slot"
                          className="px-2 py-1 rounded-md bg-white text-slate-900 hover:bg-slate-100 font-semibold text-[11px] border border-slate-200 flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 text-orange-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(slot._id || slot.slotId)}
                          title="Delete Slot"
                          className="p-1 rounded-md bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
