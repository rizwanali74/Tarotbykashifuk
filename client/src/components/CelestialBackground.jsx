import React, { useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useActiveSection } from '../hooks/useActiveSection';

/**
 * CelestialBackground - Immersive, Responsive, Scroll-Reactive Mystical Animated Background System.
 * Transitions smoothly across 6 distinct scenes (Hero, Services, Packages, About, Contact/Booking, Footer)
 * for both Dark Sanctuary and Radiant Light modes.
 */
export default function CelestialBackground() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';
  const activeSection = useActiveSection(); // 'hero' | 'services' | 'packages' | 'about' | 'contact' | 'booking' | 'footer'
  const canvasRef = useRef(null);

  // Normalize section for scene mapping
  const currentScene = useMemo(() => {
    if (activeSection === 'booking' || activeSection === 'contact') return 'contact';
    if (activeSection === 'services') return 'services';
    if (activeSection === 'packages') return 'packages';
    if (activeSection === 'about') return 'about';
    if (activeSection === 'footer' || activeSection === 'faq') return 'footer';
    return 'hero';
  }, [activeSection]);

  // Responsive HTML5 Canvas Particle Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    // Responsive particle count: ~55 on desktop, ~22 on mobile
    const isMobile = width < 768;
    const particleCount = isMobile ? 22 : 55;

    // Particle pool with distinct physics vectors
    const particles = Array.from({ length: particleCount }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      baseOpacity: Math.random() * 0.5 + 0.25,
      opacity: Math.random() * 0.5 + 0.25,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulseAngle: Math.random() * Math.PI * 2,
      depth: Math.random() * 0.8 + 0.2, // 3D depth layer
      colorVariant: i % 4, // 0: gold, 1: starlight, 2: amber, 3: violet/silver
    }));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Section-specific velocity adjustments & drift profiles
      let targetVx = 0;
      let targetVy = -0.25; // Default hero: floating upward dust

      if (currentScene === 'services') {
        // Services: diagonal tarot energy drift
        targetVx = 0.35;
        targetVy = 0.25;
      } else if (currentScene === 'packages') {
        // Packages: slow celestial orbital glide
        targetVx = -0.2;
        targetVy = 0.15;
      } else if (currentScene === 'about') {
        // About: serene horizontal lunar mist drift
        targetVx = 0.15;
        targetVy = -0.05;
      } else if (currentScene === 'contact') {
        // Contact: energetic ascending golden embers
        targetVx = (Math.random() - 0.5) * 0.1;
        targetVy = -0.6;
      } else if (currentScene === 'footer') {
        // Footer: tranquil deep cosmic suspension
        targetVx = 0.05;
        targetVy = -0.08;
      }

      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          // Update position with depth parallax
          p.x += (p.speedX + targetVx) * p.depth;
          p.y += (p.speedY + targetVy) * p.depth;

          // Wrap boundaries smoothly
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          // Pulse opacity
          p.pulseAngle += p.pulseSpeed;
          p.opacity = p.baseOpacity + Math.sin(p.pulseAngle) * 0.2;
        }

        // Color selection based on theme and scene
        let fill = 'rgba(255, 255, 255, ';
        if (isLight) {
          if (p.colorVariant === 0) fill = 'rgba(217, 119, 6, '; // Amber gold
          else if (p.colorVariant === 1) fill = 'rgba(249, 115, 22, '; // Orange
          else if (p.colorVariant === 2) fill = 'rgba(147, 51, 234, '; // Violet
          else fill = 'rgba(71, 85, 105, '; // Slate starlight
        } else {
          if (p.colorVariant === 0) fill = 'rgba(251, 191, 36, '; // Radiant gold
          else if (p.colorVariant === 1) fill = 'rgba(249, 115, 22, '; // Amber glow
          else if (p.colorVariant === 2) fill = 'rgba(192, 132, 252, '; // Celestial purple
          else fill = 'rgba(255, 255, 255, '; // Pure star white
        }

        const alpha = Math.max(0.1, Math.min(0.85, isLight ? p.opacity * 0.6 : p.opacity));
        ctx.fillStyle = `${fill}${alpha})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (isMobile ? 0.8 : 1), 0, Math.PI * 2);
        ctx.fill();

        // Shimmer halo on prominent particles
        if (p.size > 1.8 && !isLight) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${alpha * 0.15})`;
          ctx.fill();
        }
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [currentScene, isLight]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ========================================================
          SCENE 1: HERO — THE COSMIC BEGINNING
          Midnight-purple/charcoal (Dark) or Radiant Champagne-Ivory (Light)
          ======================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
          currentScene === 'hero' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: isLight
              ? `radial-gradient(circle at 50% 15%, rgba(245, 158, 11, 0.12) 0%, rgba(254, 243, 199, 0.4) 40%, #fafaf9 85%)`
              : `radial-gradient(circle at 50% 20%, rgba(109, 40, 217, 0.16) 0%, rgba(249, 115, 22, 0.12) 35%, rgba(12, 16, 28, 0.95) 70%, #07090e 100%)`
          }}
        />

        {/* Soft Slowly Rotating Celestial Halo / Eclipse behind Hero */}
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[650px] md:w-[850px] h-[340px] sm:h-[650px] md:h-[850px] pointer-events-none">
          <div 
            className="w-full h-full rounded-full animate-halo-breath"
            style={{
              background: isLight
                ? `radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, rgba(249, 115, 22, 0.05) 50%, transparent 75%)`
                : `radial-gradient(circle, rgba(249, 115, 22, 0.14) 0%, rgba(147, 51, 234, 0.08) 45%, transparent 75%)`
            }}
          />
          {/* Outer Fine Eclipse Rings */}
          <div className="absolute inset-4 rounded-full border border-amber-500/10 animate-spin-slow" />
          <div className="absolute inset-16 rounded-full border border-orange-500/15" style={{ animation: 'spin-slow 90s linear infinite reverse' }} />
        </div>

        {/* Hero Constellation Vector Graphic */}
        <svg 
          className="absolute top-16 right-8 md:right-24 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 opacity-35 animate-constellation"
          viewBox="0 0 200 200" 
          fill="none"
        >
          <path 
            d="M 30,50 L 70,30 L 120,60 L 150,110 L 110,160 L 60,140 Z" 
            stroke={isLight ? 'rgba(217, 119, 6, 0.35)' : 'rgba(251, 191, 36, 0.45)'} 
            strokeWidth="0.8" 
            strokeDasharray="3 4" 
          />
          <path 
            d="M 70,30 L 150,110 M 120,60 L 60,140" 
            stroke={isLight ? 'rgba(217, 119, 6, 0.2)' : 'rgba(251, 191, 36, 0.25)'} 
            strokeWidth="0.6" 
          />
          {[[30,50], [70,30], [120,60], [150,110], [110,160], [60,140]].map(([cx, cy], i) => (
            <circle 
              key={i} 
              cx={cx} 
              cy={cy} 
              r="2.2" 
              fill={isLight ? '#d97706' : '#fef08a'} 
            />
          ))}
        </svg>
      </div>

      {/* ========================================================
          SCENE 2: SERVICES — TAROT ENERGY
          Burgundy, plum and muted-gold with floating Tarot card silhouettes
          ======================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
          currentScene === 'services' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: isLight
              ? `radial-gradient(circle at 30% 30%, rgba(225, 29, 72, 0.08) 0%, rgba(147, 51, 234, 0.06) 40%, #fafaf9 85%)`
              : `radial-gradient(circle at 20% 30%, rgba(159, 18, 57, 0.18) 0%, rgba(88, 28, 135, 0.15) 45%, #07090e 90%)`
          }}
        />

        {/* Ambient Tarot Light Ribbons */}
        <div className="absolute top-[20%] left-[10%] w-[380px] h-[380px] rounded-full bg-rose-700/10 blur-[130px] animate-pulse-glow" />
        <div className="absolute bottom-[20%] right-[10%] w-[420px] h-[420px] rounded-full bg-purple-900/12 blur-[140px] animate-pulse-glow" style={{ animationDelay: '2.5s' }} />

        {/* Floating Tarot Card 1: The Fool / Spirit (Left Foreground) */}
        <div 
          className="hidden sm:block absolute top-[25%] left-[4%] w-28 md:w-36 h-44 md:h-56 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-purple-900/15 backdrop-blur-xs p-2.5 animate-tarot-1 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
        >
          <div className="w-full h-full border border-amber-500/20 rounded-lg flex flex-col items-center justify-between p-2">
            <span className="text-[9px] font-cinzel text-amber-500/70 tracking-widest">0 • SPIRIT</span>
            <div className="w-10 h-10 rounded-full border border-amber-400/30 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-amber-400/20 animate-pulse" />
            </div>
            <span className="text-[8px] font-cinzel text-amber-400/60 tracking-wider">THE FOOL</span>
          </div>
        </div>

        {/* Floating Tarot Card 2: The Magician (Right Depth) */}
        <div 
          className="hidden sm:block absolute top-[45%] right-[5%] w-32 md:w-40 h-52 md:h-64 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-700/10 to-amber-500/5 backdrop-blur-xs p-2.5 animate-tarot-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
        >
          <div className="w-full h-full border border-purple-400/20 rounded-lg flex flex-col items-center justify-between p-2">
            <span className="text-[9px] font-cinzel text-purple-400/70 tracking-widest">I • MAGICIAN</span>
            {/* Infinity loop symbol */}
            <svg className="w-8 h-5 text-purple-400/40" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="6">
              <path d="M 25,25 C 25,10 5,10 5,25 C 5,40 25,40 50,25 C 75,10 95,10 95,25 C 95,40 75,40 50,25 Z" />
            </svg>
            <span className="text-[8px] font-cinzel text-purple-300/60 tracking-wider">CREATION</span>
          </div>
        </div>

        {/* Floating Tarot Card 3: The Star (Far Background Center-Bottom) */}
        <div 
          className="hidden md:block absolute bottom-[8%] left-[28%] w-24 h-36 rounded-lg border border-orange-500/15 bg-orange-950/10 p-2 animate-tarot-3 opacity-60"
        >
          <div className="w-full h-full border border-orange-500/15 rounded flex flex-col items-center justify-between p-1">
            <span className="text-[8px] font-cinzel text-orange-400/50">XVII</span>
            <div className="w-5 h-5 rotate-45 border border-amber-400/30" />
            <span className="text-[7px] font-cinzel text-orange-400/50">THE STAR</span>
          </div>
        </div>

        {/* Occult Sacred Geometry Hexagram Pattern (Behind Cards) */}
        <svg 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] opacity-15 pointer-events-none animate-spin-slow"
          viewBox="0 0 400 400"
          fill="none"
          stroke={isLight ? 'rgba(217, 119, 6, 0.4)' : 'rgba(249, 115, 22, 0.4)'}
          strokeWidth="0.8"
        >
          <circle cx="200" cy="200" r="180" strokeDasharray="4 6" />
          <circle cx="200" cy="200" r="130" />
          <polygon points="200,70 312,265 88,265" />
          <polygon points="200,330 312,135 88,135" />
          <circle cx="200" cy="200" r="45" strokeDasharray="2 3" />
        </svg>
      </div>

      {/* ========================================================
          SCENE 3: PACKAGES — CELESTIAL ALIGNMENT
          Dark-violet and antique-gold with slow-moving planetary orbits
          ======================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
          currentScene === 'packages' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: isLight
              ? `radial-gradient(circle at 60% 40%, rgba(147, 51, 234, 0.08) 0%, rgba(217, 119, 6, 0.06) 50%, #fafaf9 85%)`
              : `radial-gradient(circle at 60% 35%, rgba(126, 34, 206, 0.2) 0%, rgba(217, 119, 6, 0.1) 45%, #07090e 90%)`
          }}
        />

        {/* Planetary Orbits SVG & Moving Planets */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] md:w-[950px] h-[350px] sm:h-[700px] md:h-[950px] pointer-events-none">
          {/* Outer Orbit with Gliding Planet */}
          <div className="w-full h-full rounded-full border border-purple-500/15 animate-orbit-glam relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
          </div>

          {/* Middle Orbit (Reverse) with Gliding Planet */}
          <div className="absolute inset-16 sm:inset-28 rounded-full border border-amber-500/20 animate-orbit-reverse">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.9)]" />
          </div>

          {/* Inner Alignment Ring with Degree Marks */}
          <div className="absolute inset-32 sm:inset-56 rounded-full border border-dashed border-orange-500/25 animate-spin-slow">
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-300" />
          </div>
        </div>

        {/* Restrained Golden Shimmer behind Featured Packages Area */}
        <div className="absolute top-[40%] right-[20%] w-[320px] h-[320px] rounded-full bg-amber-500/10 blur-[130px] animate-pulse-glow" />
      </div>

      {/* ========================================================
          SCENE 4: ABOUT KASHIF — MOONLIGHT & REFLECTION
          Midnight-blue, muted-indigo & silver-gold with crescent moon motif
          ======================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
          currentScene === 'about' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: isLight
              ? `radial-gradient(circle at 40% 30%, rgba(59, 130, 246, 0.08) 0%, rgba(203, 213, 225, 0.25) 45%, #fafaf9 85%)`
              : `radial-gradient(circle at 35% 30%, rgba(30, 58, 138, 0.22) 0%, rgba(88, 28, 135, 0.12) 45%, #07090e 90%)`
          }}
        />

        {/* Luminous Shifting Crescent Moon Silhouette */}
        <div className="absolute top-[18%] right-[8%] sm:right-[15%] w-36 sm:w-56 h-36 sm:h-56 pointer-events-none animate-lunar-phase">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="lunarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={isLight ? '#f59e0b' : '#fef08a'} stopOpacity="0.45" />
                <stop offset="70%" stopColor={isLight ? '#3b82f6' : '#cbd5e1'} stopOpacity="0.15" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#lunarGlow)" />
            {/* Elegant Crescent Moon */}
            <path 
              d="M 50 10 A 40 40 0 1 0 88 65 A 34 34 0 1 1 50 10 Z" 
              fill={isLight ? 'rgba(217, 119, 6, 0.22)' : 'rgba(254, 243, 199, 0.35)'}
              stroke={isLight ? 'rgba(217, 119, 6, 0.45)' : 'rgba(254, 243, 199, 0.6)'}
              strokeWidth="0.8"
            />
          </svg>
        </div>

        {/* Soft Lunar Mist Ribbons */}
        <div 
          className="absolute top-[35%] left-0 w-[120%] h-48 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent blur-[50px] animate-mist-drift pointer-events-none" 
        />
        <div 
          className="absolute top-[55%] -left-[10%] w-[120%] h-44 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent blur-[60px] animate-mist-drift pointer-events-none" 
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* ========================================================
          SCENE 5: CONTACT & BOOKING — GOLDEN ENERGY
          Warmer black, bronze, and rich radiant amber atmosphere
          ======================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
          currentScene === 'contact' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: isLight
              ? `radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.14) 0%, rgba(249, 115, 22, 0.08) 45%, #fafaf9 85%)`
              : `radial-gradient(circle at 50% 35%, rgba(217, 119, 6, 0.22) 0%, rgba(180, 83, 9, 0.15) 45%, #07090e 90%)`
          }}
        />

        {/* Golden Aura behind Booking & Contact Area */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] md:w-[720px] h-[340px] sm:h-[580px] md:h-[720px] rounded-full bg-amber-500/15 blur-[120px] animate-amber-wave pointer-events-none" />

        {/* Sacred 12-Ray Sunburst Mandala / Celestial Ring */}
        <svg 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[650px] md:w-[820px] h-[400px] sm:h-[650px] md:h-[820px] opacity-25 pointer-events-none animate-mandala-spin"
          viewBox="0 0 200 200"
          fill="none"
          stroke={isLight ? 'rgba(217, 119, 6, 0.5)' : 'rgba(251, 191, 36, 0.55)'}
          strokeWidth="0.7"
        >
          <circle cx="100" cy="100" r="90" strokeDasharray="3 4" />
          <circle cx="100" cy="100" r="70" />
          <circle cx="100" cy="100" r="45" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 100 + 45 * Math.cos(angle);
            const y1 = 100 + 45 * Math.sin(angle);
            const x2 = 100 + 90 * Math.cos(angle);
            const y2 = 100 + 90 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>
      </div>

      {/* ========================================================
          SCENE 6: FOOTER — RETURN TO THE COSMOS
          Tranquil midnight obsidian & sparse starlight
          ======================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
          currentScene === 'footer' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: isLight
              ? `radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.05) 0%, rgba(241, 245, 249, 0.5) 50%, #fafaf9 90%)`
              : `radial-gradient(circle at 50% 80%, rgba(79, 70, 229, 0.08) 0%, rgba(12, 16, 26, 0.95) 50%, #05070c 100%)`
          }}
        />

        {/* Distant Tranquil Horizon Ring */}
        <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[800px] md:w-[1200px] h-[300px] rounded-[100%] border-t border-amber-500/10 pointer-events-none opacity-40" />
      </div>

      {/* ========================================================
          HTML5 CANVAS: DYNAMIC STAR & PARTICLE ENGINE
          ======================================================== */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10" 
      />

      {/* Subtle Noise Texture for Cinematic Depth */}
      <div 
        className="absolute inset-0 opacity-[0.022] mix-blend-overlay pointer-events-none z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
