import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 3 Modes: 'dark' (Default), 'light', 'system'
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem('tarot_theme_mode') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [systemPreference, setSystemPreference] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Listen for OS system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Compute active theme ('dark' or 'light')
  const resolvedTheme = themeMode === 'system' ? systemPreference : themeMode;

  // Apply class and data attribute to documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.setAttribute('data-theme', resolvedTheme);

    try {
      localStorage.setItem('tarot_theme_mode', themeMode);
    } catch (e) {
      // ignore in incognito or restricted mode
    }
  }, [themeMode, resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      themeMode: 'system',
      setThemeMode: () => {},
      resolvedTheme: 'dark',
    };
  }
  return context;
}
