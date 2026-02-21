'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';
type Accent = 'blue' | 'purple' | 'teal' | 'coral' | 'amber' | 'emerald';

interface ThemeCtx {
  theme: Theme;
  accent: Accent;
  toggleTheme: () => void;
  setAccent: (a: Accent) => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: 'light',
  accent: 'blue',
  toggleTheme: () => {},
  setAccent: () => {},
});

const accentMap: Record<Accent, string> = {
  blue: '#0078D4',
  purple: '#7C3AED',
  teal: '#0D9488',
  coral: '#F43F5E',
  amber: '#F59E0B',
  emerald: '#10B981',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [accent, setAccentState] = useState<Accent>('blue');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') as Theme | null;
    const savedAccent = localStorage.getItem('portfolio-accent') as Accent | null;

    if (saved) {
      setTheme(saved);
    }
    // Always default to light — no system dark auto-detect

    if (savedAccent && accentMap[savedAccent]) {
      setAccentState(savedAccent);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty('--active-accent', accentMap[accent]);
    localStorage.setItem('portfolio-accent', accent);
  }, [accent, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setAccent = useCallback((a: Accent) => {
    setAccentState(a);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-ms-bg" />;
  }

  return (
    <ThemeContext.Provider value={{ theme, accent, toggleTheme, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
