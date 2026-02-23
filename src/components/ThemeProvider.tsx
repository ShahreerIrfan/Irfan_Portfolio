'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';
type Accent =
  | 'ocean-calm'
  | 'sage-green'
  | 'lavender-soft'
  | 'warm-sunset'
  | 'soft-rose'
  | 'midnight-slate'
  | 'coral-reef'
  | 'dusty-teal'
  | 'warm-amber'
  | 'plum-berry'
  | 'sky-breeze'
  | 'blush-pink';

interface ThemeCtx {
  theme: Theme;
  accent: Accent;
  accents: typeof accentThemes;
  toggleTheme: () => void;
  setAccent: (a: Accent) => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: 'light',
  accent: 'ocean-calm',
  accents: [] as unknown as typeof accentThemes,
  toggleTheme: () => {},
  setAccent: () => {},
});

export const accentThemes: Array<{
  key: Accent;
  label: string;
  light: string;
  dark: string;
}> = [
  { key: 'ocean-calm',     label: 'Ocean Calm',     light: '#2563EB', dark: '#60A5FA' },
  { key: 'sage-green',     label: 'Sage Green',     light: '#059669', dark: '#34D399' },
  { key: 'lavender-soft',  label: 'Lavender Soft',  light: '#7C3AED', dark: '#A78BFA' },
  { key: 'warm-sunset',    label: 'Warm Sunset',    light: '#EA580C', dark: '#FB923C' },
  { key: 'soft-rose',      label: 'Soft Rose',      light: '#E11D48', dark: '#FB7185' },
  { key: 'midnight-slate', label: 'Midnight Slate', light: '#475569', dark: '#94A3B8' },
  { key: 'coral-reef',     label: 'Coral Reef',     light: '#F43F5E', dark: '#FDA4AF' },
  { key: 'dusty-teal',     label: 'Dusty Teal',     light: '#0D9488', dark: '#5EEAD4' },
  { key: 'warm-amber',     label: 'Warm Amber',     light: '#D97706', dark: '#FCD34D' },
  { key: 'plum-berry',     label: 'Plum Berry',     light: '#9333EA', dark: '#C084FC' },
  { key: 'sky-breeze',     label: 'Sky Breeze',     light: '#0284C7', dark: '#7DD3FC' },
  { key: 'blush-pink',     label: 'Blush Pink',     light: '#DB2777', dark: '#F9A8D4' },
];

const accentMap = Object.fromEntries(accentThemes.map(a => [a.key, a])) as Record<Accent, (typeof accentThemes)[0]>;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [accent, setAccentState] = useState<Accent>('ocean-calm');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') as Theme | null;
    const savedAccent = localStorage.getItem('portfolio-accent') as Accent | null;

    if (saved) setTheme(saved);
    if (savedAccent && accentMap[savedAccent]) setAccentState(savedAccent);
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
    // Update accent color for current theme
    const a = accentMap[accent];
    root.style.setProperty('--active-accent', theme === 'dark' ? a.dark : a.light);
  }, [theme, mounted, accent]);

  useEffect(() => {
    if (!mounted) return;
    const a = accentMap[accent];
    document.documentElement.style.setProperty('--active-accent', theme === 'dark' ? a.dark : a.light);
    localStorage.setItem('portfolio-accent', accent);
  }, [accent, mounted, theme]);

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
    <ThemeContext.Provider value={{ theme, accent, accents: accentThemes, toggleTheme, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
