import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function FloatingThemeButton() {
  const { themeMode, setThemeMode, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const modes = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'system', label: 'Auto', icon: Laptop },
  ];

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const CurrentIcon = resolvedTheme === 'light' ? Sun : Moon;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center select-none"
    >
      {/* Compact Mini Flyout (Slim, no bulky text or descriptions) */}
      <div
        className={`absolute right-full mr-2 top-1/2 -translate-y-1/2 w-32 p-1.5 rounded-xl shadow-xl backdrop-blur-xl border transition-all duration-200 origin-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-x-2 pointer-events-none'
        } ${
          resolvedTheme === 'light'
            ? 'bg-white/95 text-slate-800 border-orange-500/30 shadow-[0_10px_25px_rgba(249,115,22,0.15)]'
            : 'bg-[#0c101d]/95 text-white border-orange-500/30 shadow-[0_15px_35px_rgba(0,0,0,0.85)]'
        }`}
      >
        <div className="space-y-1">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = themeMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setThemeMode(m.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-sm font-semibold'
                    : resolvedTheme === 'light'
                    ? 'hover:bg-slate-100 text-slate-700'
                    : 'hover:bg-white/10 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{m.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Docked Compact Tab Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Theme Menu"
        title="Theme Mode"
        className={`flex flex-col items-center justify-center gap-1 w-8 sm:w-9 h-14 sm:h-16 rounded-l-xl border-l-2 border-y cursor-pointer transition-all duration-200 group ${
          isOpen ? 'translate-x-0' : 'translate-x-0.5 hover:translate-x-0'
        } ${
          resolvedTheme === 'light'
            ? 'bg-white text-slate-800 border-orange-500/40 shadow-[-4px_0_15px_rgba(249,115,22,0.18)] hover:border-orange-500'
            : 'bg-[#0c101d] text-white border-orange-500/40 shadow-[-4px_0_15px_rgba(249,115,22,0.25)] hover:border-orange-400'
        }`}
      >
        <div className="p-0.5 rounded-full bg-orange-500/15 text-orange-500 group-hover:scale-110 transition-transform">
          <CurrentIcon className="w-3.5 h-3.5" />
        </div>
        <span className="text-[8px] font-bold tracking-widest uppercase text-orange-500 [writing-mode:vertical-rl] rotate-180">
          THEME
        </span>
      </button>
    </div>
  );
}
