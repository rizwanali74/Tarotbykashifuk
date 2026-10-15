import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight, Shield, Award, Clock } from 'lucide-react';

export default function MiniHero({
  badge = "✦ Sacred Sanctuary",
  title = "Spiritual Guidance & Clarity",
  subtitle = "Illuminate your path with ancient Vedic wisdom, Tarot symbolism, and intuitive discernment.",
  breadcrumbs = [{ label: "Home", to: "/" }],
  highlights = [
    { icon: Award, text: "12+ Years Spiritual Mastery" },
    { icon: Shield, text: "100% Confidential & Sacred" },
    { icon: Clock, text: "UK & International Sessions" },
  ]
}) {
  return (
    <div className="relative pt-32 sm:pt-36 pb-14 sm:pb-20 overflow-hidden border-b border-orange-500/15">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1d] via-[#090d18] to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Breadcrumb Path */}
        <nav aria-label="Breadcrumb" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-[var(--theme-text-muted)] mb-5">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.to || idx}>
              {idx > 0 && <ChevronRight className="w-3 h-3 opacity-40" />}
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-orange-400 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-orange-400 font-semibold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Sacred Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {badge}
          </span>
        </div>

        {/* Cinzel Title */}
        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--theme-text-heading)] max-w-4xl mx-auto leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base md:text-lg text-[var(--theme-text-secondary)] max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* Trust Highlights Strip */}
        {highlights && highlights.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-6 border-t border-[var(--theme-border-subtle)]/50">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-[var(--theme-text-secondary)]">
                  <div className="p-1 rounded-md bg-orange-500/10 text-orange-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
