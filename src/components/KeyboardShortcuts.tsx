'use client';

import { useState, useEffect, useCallback } from 'react';
import { Keyboard, X } from 'lucide-react';

const shortcuts = [
  { keys: ['Ctrl', 'K'], action: 'Open Command Palette' },
  { keys: ['H'], action: 'Go to Home' },
  { keys: ['E'], action: 'Go to Education' },
  { keys: ['W'], action: 'Go to Work Experience' },
  { keys: ['P'], action: 'Go to Projects' },
  { keys: ['C'], action: 'Go to Contact' },
  { keys: ['T'], action: 'Go to Tech Stack' },
  { keys: ['S'], action: 'Go to Services' },
  { keys: ['G'], action: 'Go to GitHub' },
  { keys: ['?'], action: 'Toggle Shortcuts Help' },
];

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  const handleKey = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === 'Escape' && open) {
      setOpen(false);
    }
  }, [open]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" />
      <div
        className="relative glass-card w-full max-w-md mx-4 p-6 shadow-2xl animate-[toastIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[var(--active-accent)]" />
            <h2 className="text-lg font-bold text-[#1B1B1F] dark:text-dark-text">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((shortcut, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[var(--active-accent)]/5 transition-colors"
            >
              <span className="text-sm text-[#49454F] dark:text-dark-text-secondary">
                {shortcut.action}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-1 rounded-md text-xs font-mono font-semibold bg-gray-100 dark:bg-gray-800 text-[#1B1B1F] dark:text-dark-text border border-gray-200 dark:border-gray-700 shadow-sm min-w-[28px] text-center"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-[#49454F]/50 dark:text-dark-text-secondary/50">
            Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-mono">?</kbd> to toggle this dialog
          </p>
        </div>
      </div>
    </div>
  );
}
