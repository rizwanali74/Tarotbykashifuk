import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ compact = false, className = '' }) {
  const { themeMode, setThemeMode, resolvedTheme } = useTheme();

  const modes = [
    { id: 'system', label: 'System', icon: Laptop, title: 'Follow System Default' },
    { id: 'light', label: 'Light', icon: Sun, title: 'Light Mode' },
    { id: 'dark', label: 'Dark', icon: Moon, title: 'Dark Mode' },
  ];

  if (compact) {
    return (
      <div className={`inline-flex items-center p-0.5 rounded-lg bg-black/20 dark:bg-black/40 border border-white/10 ${className}`}>
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = themeMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setThemeMode(m.id)}
              title={m.title}
              aria-label={m.title}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                isActive 
                  ? 'bg-orange-500 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center p-1 rounded-xl bg-black/20 dark:bg-black/40 border border-white/10 ${className}`}>
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = themeMode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => setThemeMode(m.id)}
            title={m.title}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              isActive 
                ? 'bg-orange-500 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-3 h-3" />
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
