'use client';

import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Sun, Moon, Palette, Command } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const navLinks = [
  { label: 'Main', href: '#hero' },
  { label: 'Skills', href: '#techmarquee' },
  { label: 'Education', href: '#education' },
  { label: 'Work', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const accents: Array<{ key: 'blue' | 'purple' | 'teal' | 'coral' | 'amber' | 'emerald'; color: string; label: string }> = [
  { key: 'blue', color: '#0078D4', label: 'Blue' },
  { key: 'purple', color: '#7C3AED', label: 'Purple' },
  { key: 'teal', color: '#0D9488', label: 'Teal' },
  { key: 'coral', color: '#F43F5E', label: 'Coral' },
  { key: 'amber', color: '#F59E0B', label: 'Amber' },
  { key: 'emerald', color: '#10B981', label: 'Emerald' },
];

export default function Navbar({ onCommandPalette }: { onCommandPalette: () => void }) {
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showAccentPicker, setShowAccentPicker] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map((l) => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-sm border-b border-ms-border dark:border-dark-border'
          : 'bg-white/70 dark:bg-dark-bg/70 md:bg-transparent md:dark:bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollTo('#hero')}
            className="text-lg font-black text-ms-text dark:text-dark-text hover:text-ms-blue dark:hover:text-blue-400 transition-colors"
          >
            <span className="bg-gradient-to-r from-[var(--active-accent)] to-purple-500 bg-clip-text text-transparent">&lt;</span>
            Irfan
            <span className="bg-gradient-to-r from-[var(--active-accent)] to-purple-500 bg-clip-text text-transparent"> /&gt;</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === link.href.replace('#', '')
                    ? 'text-[var(--active-accent)]'
                    : 'text-ms-text-secondary dark:text-dark-text-secondary hover:text-ms-text dark:hover:text-dark-text'
                }`}
              >
                {activeSection === link.href.replace('#', '') && (
                  <span className="absolute inset-0 rounded-lg bg-[var(--active-accent)]/10 -z-10" />
                )}
                {link.label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Command palette hint */}
            <button
              onClick={onCommandPalette}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-ms-text-secondary dark:text-dark-text-secondary border border-ms-border dark:border-dark-border hover:bg-ms-blue-light dark:hover:bg-dark-bg-secondary transition-colors"
              aria-label="Open command palette (Ctrl+K)"
            >
              <Command className="w-3 h-3" />
              <span>Ctrl+K</span>
            </button>

            {/* Accent picker */}
            <div className="relative">
              <button
                onClick={() => setShowAccentPicker(!showAccentPicker)}
                className="p-2 rounded-lg text-ms-text-secondary dark:text-dark-text-secondary hover:bg-ms-blue-light dark:hover:bg-dark-bg-secondary transition-colors"
                aria-label="Change accent color"
              >
                <Palette className="w-5 h-5" />
              </button>
              {showAccentPicker && (
                <div className="absolute right-0 top-full mt-2 glass-card p-3 flex gap-2.5 min-w-max shadow-xl">
                  {accents.map((a) => (
                    <button
                      key={a.key}
                      onClick={() => { setAccent(a.key); setShowAccentPicker(false); }}
                      className={`w-7 h-7 rounded-full border-2 transition-all duration-200 hover:scale-125 hover:shadow-lg ${
                        accent === a.key ? 'border-ms-text dark:border-dark-text scale-110 shadow-md' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: a.color }}
                      aria-label={`Set ${a.label} accent`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-ms-text-secondary dark:text-dark-text-secondary hover:bg-ms-blue-light dark:hover:bg-dark-bg-secondary transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-ms-text-secondary dark:text-dark-text-secondary hover:bg-ms-blue-light dark:hover:bg-dark-bg-secondary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/98 dark:bg-dark-bg/98 border-t border-ms-border dark:border-dark-border px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === link.href.replace('#', '')
                  ? 'bg-[var(--active-accent)]/10 text-[var(--active-accent)]'
                  : 'text-ms-text-secondary dark:text-dark-text-secondary hover:bg-ms-blue-light dark:hover:bg-dark-bg-secondary'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setMobileOpen(false); onCommandPalette(); }}
            className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-ms-text-secondary dark:text-dark-text-secondary hover:bg-ms-blue-light dark:hover:bg-dark-bg-secondary"
          >
            <Command className="w-4 h-4" />
            Command Palette
          </button>
        </div>
      </div>
    </nav>
  );
}
