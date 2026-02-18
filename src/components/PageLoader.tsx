'use client';

import { useState, useEffect } from 'react';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Wait for page to load
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 600);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#F0F6FF] dark:bg-dark-bg transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="relative">
          <div className="text-4xl font-black">
            <span className="text-[var(--active-accent)]">&lt;</span>
            <span className="text-[#1B1B1F] dark:text-dark-text animate-pulse">Irfan</span>
            <span className="text-[var(--active-accent)]"> /&gt;</span>
          </div>
          {/* Orbit circle */}
          <div className="absolute -inset-8 border-2 border-dashed border-[var(--active-accent)]/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-[var(--active-accent)] shadow-[0_0_10px_var(--active-accent)]" />
          </div>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[var(--active-accent)] to-blue-400 animate-[loading-bar_1.2s_ease-in-out]" />
        </div>

        <p className="text-xs font-medium text-[#49454F]/50 dark:text-dark-text-secondary/50 tracking-widest uppercase">
          Loading Portfolio...
        </p>
      </div>
    </div>
  );
}
