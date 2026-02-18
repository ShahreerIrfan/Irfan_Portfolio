'use client';

import { useState, useEffect, useCallback } from 'react';
import { Accessibility, ZoomIn, ZoomOut, RotateCcw, Eye, Volume2 } from 'lucide-react';

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    return () => { document.documentElement.style.fontSize = ''; };
  }, [fontSize]);

  // High contrast
  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  // Reduced motion
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  // Dyslexia-friendly font
  useEffect(() => {
    document.documentElement.classList.toggle('dyslexia-font', dyslexiaFont);
  }, [dyslexiaFont]);

  const resetAll = useCallback(() => {
    setFontSize(100);
    setHighContrast(false);
    setReducedMotion(false);
    setDyslexiaFont(false);
  }, []);

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 10, 150));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 10, 70));

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {/* Panel */}
      <div
        className={`absolute bottom-16 right-0 w-72 glass-card p-5 shadow-2xl transition-all duration-300 origin-bottom-right ${
          open ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#1B1B1F] dark:text-dark-text">Accessibility</h3>
          <button
            onClick={resetAll}
            className="text-xs flex items-center gap-1 text-[var(--active-accent)] hover:underline"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Font Size */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-[#49454F] dark:text-dark-text-secondary mb-2 block">
            Font Size ({fontSize}%)
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={decreaseFontSize}
              className="p-2 rounded-lg glass-card hover:bg-[var(--active-accent)]/10 transition-colors"
              aria-label="Decrease font size"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="flex-1 h-2 rounded-full bg-[#0078D4]/[0.08] dark:bg-blue-500/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--active-accent)] transition-all"
                style={{ width: `${((fontSize - 70) / 80) * 100}%` }}
              />
            </div>
            <button
              onClick={increaseFontSize}
              className="p-2 rounded-lg glass-card hover:bg-[var(--active-accent)]/10 transition-colors"
              aria-label="Increase font size"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toggle options */}
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-xs font-medium text-[#49454F] dark:text-dark-text-secondary flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" /> High Contrast
            </span>
            <div className={`relative w-10 h-5 rounded-full transition-colors ${highContrast ? 'bg-[var(--active-accent)]' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${highContrast ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>
          <input type="checkbox" className="sr-only" checked={highContrast} onChange={() => setHighContrast(!highContrast)} />

          <label className="flex items-center justify-between cursor-pointer group" onClick={() => setReducedMotion(!reducedMotion)}>
            <span className="text-xs font-medium text-[#49454F] dark:text-dark-text-secondary flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5" /> Reduce Motion
            </span>
            <div className={`relative w-10 h-5 rounded-full transition-colors ${reducedMotion ? 'bg-[var(--active-accent)]' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${reducedMotion ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer group" onClick={() => setDyslexiaFont(!dyslexiaFont)}>
            <span className="text-xs font-medium text-[#49454F] dark:text-dark-text-secondary flex items-center gap-2">
              <span className="text-sm font-bold w-3.5 text-center">Aa</span> Dyslexia Font
            </span>
            <div className={`relative w-10 h-5 rounded-full transition-colors ${dyslexiaFont ? 'bg-[var(--active-accent)]' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${dyslexiaFont ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`p-3.5 rounded-full shadow-lg transition-all duration-300 ${
          open
            ? 'bg-[var(--active-accent)] text-white rotate-0 scale-110'
            : 'glass-card text-[var(--active-accent)] hover:scale-110'
        }`}
        aria-label="Accessibility options"
        aria-expanded={open}
      >
        <Accessibility className="w-5 h-5" />
      </button>
    </div>
  );
}
