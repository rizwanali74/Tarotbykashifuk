import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useActiveSection - Detects the currently active section for scroll-reactive background scenes.
 * Features:
 * - IntersectionObserver with rootMargin tuned for natural reading position
 * - Fallback position-based scroll calculation for fast scrolling
 * - Direct route mapping for dedicated sub-pages (/about, /services, /packages, /contact, /book)
 * - Hash/Anchor support (e.g. #services)
 * - Boundary handling (top of page -> hero, bottom -> footer)
 */
export function useActiveSection() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const pathname = location.pathname;

    // 1. Direct route mapping for dedicated sub-pages
    if (pathname === '/about') {
      setActiveSection('about');
      return;
    }
    if (pathname === '/services') {
      setActiveSection('services');
      return;
    }
    if (pathname === '/packages') {
      setActiveSection('packages');
      return;
    }
    if (pathname === '/contact') {
      setActiveSection('contact');
      return;
    }
    if (pathname === '/book' || pathname === '/order') {
      setActiveSection('contact'); // uses the golden energy scene
      return;
    }

    // 2. Hash check on mount
    if (location.hash) {
      const targetHash = location.hash.replace('#', '');
      const validSections = ['hero', 'about', 'services', 'packages', 'contact', 'faq', 'footer'];
      if (validSections.includes(targetHash)) {
        setActiveSection(targetHash === 'faq' ? 'footer' : targetHash);
      }
    }

    // 3. On Home page ('/'), track sections with IntersectionObserver & scroll fallback
    const sectionIds = ['hero', 'about', 'services', 'packages', 'contact', 'faq', 'footer'];
    let observer = null;
    let timerId = null;

    const setupObserver = () => {
      const elements = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

      if (elements.length === 0) return;

      const visibilityMap = new Map();

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibilityMap.set(entry.target.id, entry.intersectionRatio);
          });

          // Pick section with highest visible ratio
          let bestId = null;
          let highestRatio = 0.05;

          visibilityMap.forEach((ratio, id) => {
            if (ratio > highestRatio) {
              highestRatio = ratio;
              bestId = id;
            }
          });

          if (window.scrollY < 120) {
            setActiveSection('hero');
            return;
          }

          if (bestId) {
            const mappedScene = bestId === 'faq' ? 'footer' : bestId;
            setActiveSection(mappedScene);
          }
        },
        {
          threshold: [0.05, 0.2, 0.4, 0.6, 0.8],
          rootMargin: '-15% 0px -20% 0px',
        }
      );

      elements.forEach(el => observer.observe(el));
    };

    // Delay slightly to ensure React elements are rendered in DOM
    timerId = setTimeout(setupObserver, 80);

    // Fast-scroll & boundary check
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollY < 80) {
        setActiveSection('hero');
        return;
      }
      if (scrollY + windowHeight >= documentHeight - 80) {
        setActiveSection('footer');
        return;
      }

      // Check center of viewport against section bounding rects as a fallback
      const viewportCenter = windowHeight * 0.45;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          const mapped = id === 'faq' ? 'footer' : id;
          setActiveSection(mapped);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (timerId) clearTimeout(timerId);
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname, location.hash]);

  return activeSection;
}
