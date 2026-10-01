import React, { useMemo } from 'react';

export default function CelestialBackground() {
  // Generate stable random stars
  const stars = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.2 + 0.8,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Deep Obsidian Cosmic Gradient */}
      <div 
        className="absolute inset-0 bg-[#07090e]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 10% 40%, rgba(234, 179, 8, 0.06) 0%, transparent 40%),
            radial-gradient(circle at 90% 70%, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(249, 115, 22, 0.08) 0%, transparent 70%)
          `
        }}
      />

      {/* Floating Glowing Ambient Orbs */}
      <div className="absolute top-[10%] left-[20%] w-[380px] h-[380px] rounded-full bg-orange-600/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-[50%] right-[10%] w-[420px] h-[420px] rounded-full bg-amber-500/8 blur-[140px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-[15%] left-[10%] w-[320px] h-[320px] rounded-full bg-purple-700/8 blur-[110px] animate-pulse-glow" style={{ animationDelay: '5s' }} />

      {/* Sacred Geometry Subtle Orbit Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-orange-500/5 animate-spin-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1250px] h-[1250px] rounded-full border border-amber-500/5 animate-spin-slow pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '90s' }} />

      {/* Star Field */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white transition-opacity"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: star.size > 2 ? `0 0 6px 1px rgba(254, 215, 170, 0.8)` : 'none',
            animation: `pulse-glow ${star.duration}s infinite ease-in-out ${star.delay}s`,
          }}
        />
      ))}

      {/* Noise Texture Overlay for Rich Depth */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
