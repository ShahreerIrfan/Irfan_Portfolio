'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Menu, X, Sun, Moon, Command,
  Home, Briefcase, FolderOpen, BookOpen, User, HelpCircle, Mail, Sparkles
} from 'lucide-react';
import { useTheme, accentThemes } from './ThemeProvider';

const navLinks = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Services', href: '/services', icon: Briefcase },
  { label: 'Portfolio', href: '/portfolio', icon: FolderOpen },
  { label: 'Blog', href: '/blog', icon: BookOpen },
  { label: 'About', href: '/about', icon: User },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
  { label: 'Contact', href: '/contact', icon: Mail },
];

export default function Navbar({ onCommandPalette }: { onCommandPalette: () => void }) {
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowThemePanel(false);
      }
    };
    if (showThemePanel) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showThemePanel]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-black text-ms-text dark:text-dark-text hover:text-ms-blue dark:hover:text-blue-400 transition-colors"
          >
            <span className="bg-gradient-to-r from-[var(--active-accent)] to-purple-500 bg-clip-text text-transparent">&lt;</span>
            Irfan
            <span className="bg-gradient-to-r from-[var(--active-accent)] to-purple-500 bg-clip-text text-transparent"> /&gt;</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-[var(--active-accent)]'
                      : 'text-ms-text-secondary dark:text-dark-text-secondary hover:text-ms-text dark:hover:text-dark-text'
                  }`}
                >
                  {isActive(link.href) && (
                    <span className="absolute inset-0 rounded-lg bg-[var(--active-accent)]/10 -z-10" />
                  )}
                  <Icon className={`w-3.5 h-3.5 ${isActive(link.href) ? 'text-[var(--active-accent)]' : 'text-slate-400 dark:text-slate-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCommandPalette}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-ms-text-secondary dark:text-dark-text-secondary border border-ms-border dark:border-dark-border hover:bg-ms-blue-light dark:hover:bg-dark-bg-secondary transition-colors"
              aria-label="Open command palette (Ctrl+K)"
            >
              <Command className="w-3 h-3" />
              <span>Ctrl+K</span>
            </button>

            {/* Theme panel */}
            <div className="relative" ref={panelRef}>
              <button
                onClick={() => setShowThemePanel(!showThemePanel)}
                className="p-2 rounded-lg text-ms-text-secondary dark:text-dark-text-secondary hover:bg-ms-blue-light dark:hover:bg-dark-bg-secondary transition-colors"
                aria-label="Theme settings"
              >
                <Sparkles className="w-5 h-5" />
              </button>

              {showThemePanel && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 w-[320px] z-[200]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[var(--active-accent)]" />
                      <span className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">Theme</span>
                    </div>
                    <button onClick={() => setShowThemePanel(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-5">
                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                        theme === 'light'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                        theme === 'dark'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Color Scheme</p>
                  <div className="grid grid-cols-3 gap-2">
                    {accentThemes.map((a) => (
                      <button
                        key={a.key}
                        onClick={() => setAccent(a.key)}
                        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 ${
                          accent === a.key ? 'bg-slate-50 dark:bg-slate-800 ring-2 ring-[var(--active-accent)] ring-offset-1 ring-offset-white dark:ring-offset-slate-900' : ''
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full transition-transform duration-200 hover:scale-110"
                          style={{ backgroundColor: theme === 'dark' ? a.dark : a.light, boxShadow: `0 2px 8px ${theme === 'dark' ? a.dark : a.light}40` }}
                        />
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight text-center">{a.label}</span>
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-4">Preferences saved automatically.</p>
                </div>
              )}
            </div>

            {/* Dark mode quick toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-ms-text-secondary dark:text-dark-text-secondary hover:bg-ms-blue-light dark:hover:bg-dark-bg-secondary transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Hire Me */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[var(--active-accent)] to-purple-500 hover:shadow-lg hover:shadow-[var(--active-accent)]/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              Hire Me
            </Link>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg text-ms-text-secondary dark:text-dark-text-secondary hover:bg-ms-blue-light dark:hover:bg-dark-bg-secondary transition-colors"
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
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white/98 dark:bg-dark-bg/98 border-t border-ms-border dark:border-dark-border px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-[var(--active-accent)]/10 text-[var(--active-accent)]'
                    : 'text-ms-text-secondary dark:text-dark-text-secondary hover:bg-ms-blue-light dark:hover:bg-dark-bg-secondary'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive(link.href) ? 'text-[var(--active-accent)]' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
          <Link href="/contact" onClick={() => setMobileOpen(false)}
            className="block w-full text-center mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--active-accent)] to-purple-500 text-white font-bold text-sm">
            Hire Me
          </Link>
          <button
            onClick={() => { setMobileOpen(false); onCommandPalette(); }}
            className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-ms-text-secondary dark:text-dark-text-secondary hover:bg-ms-blue-light dark:hover:bg-dark-bg-secondary"
          >
            <Command className="w-4 h-4" /> Command Palette
          </button>
        </div>
      </div>
    </nav>
  );
}
