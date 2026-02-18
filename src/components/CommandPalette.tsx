'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ArrowRight, Hash, ExternalLink, X } from 'lucide-react';
import profile from '@/data/profile';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  action: () => void;
  category: string;
}

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = useMemo(() => [
    // Navigation
    { id: 'nav-hero', label: 'Go to Home', category: 'Navigation', action: () => { document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }); onClose(); } },
    { id: 'nav-about', label: 'Go to About', category: 'Navigation', action: () => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); onClose(); } },
    { id: 'nav-edu', label: 'Go to Education', category: 'Navigation', action: () => { document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' }); onClose(); } },
    { id: 'nav-exp', label: 'Go to Experience', category: 'Navigation', action: () => { document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }); onClose(); } },
    { id: 'nav-tech', label: 'Go to Tech Stack', category: 'Navigation', action: () => { document.getElementById('techstack')?.scrollIntoView({ behavior: 'smooth' }); onClose(); } },
    { id: 'nav-github', label: 'Go to GitHub', category: 'Navigation', action: () => { document.getElementById('github')?.scrollIntoView({ behavior: 'smooth' }); onClose(); } },
    { id: 'nav-projects', label: 'Go to Projects', category: 'Navigation', action: () => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); onClose(); } },
    { id: 'nav-contact', label: 'Go to Contact', category: 'Navigation', action: () => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); onClose(); } },
    // Links
    { id: 'link-github', label: 'Open GitHub Profile', description: 'github.com/ShahreerIrfan', category: 'Links', action: () => { window.open('https://github.com/ShahreerIrfan', '_blank'); onClose(); } },
    { id: 'link-linkedin', label: 'Open LinkedIn Profile', description: 'linkedin.com/in/md-shahreer-irfan', category: 'Links', action: () => { window.open('https://bd.linkedin.com/in/md-shahreer-irfan-a574011b6', '_blank'); onClose(); } },
    { id: 'link-resume', label: 'Download Resume', category: 'Links', action: () => { window.open(profile.resumeUrl, '_blank'); onClose(); } },
    { id: 'link-email', label: 'Send Email', description: 'mdshahreerirfan@gmail.com', category: 'Links', action: () => { window.open('mailto:mdshahreerirfan@gmail.com', '_blank'); onClose(); } },
    // Actions
    { id: 'action-theme', label: 'Toggle Dark Mode', category: 'Actions', action: () => { document.documentElement.classList.toggle('dark'); onClose(); } },
    { id: 'action-top', label: 'Scroll to Top', category: 'Actions', action: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); onClose(); } },
  ], [onClose]);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, items]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, selectedIndex, onClose]);

  if (!open) return null;

  // Group by category
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="cmd-overlay" onClick={onClose} role="dialog" aria-label="Command palette" aria-modal="true">
      <div
        className="glass-card w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ms-border dark:border-dark-border">
          <Search className="w-5 h-5 text-ms-text-secondary dark:text-dark-text-secondary flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-ms-text dark:text-dark-text placeholder:text-ms-text-secondary/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-ms-text-secondary dark:text-dark-text-secondary hover:text-ms-text dark:hover:text-dark-text"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div key={category}>
              <p className="px-4 py-1.5 text-xs font-semibold text-ms-text-secondary dark:text-dark-text-secondary uppercase">
                {category}
              </p>
              {categoryItems.map((item) => {
                const globalIdx = filtered.indexOf(item);
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      globalIdx === selectedIndex
                        ? 'bg-[var(--active-accent)]/10 text-[var(--active-accent)]'
                        : 'text-ms-text dark:text-dark-text hover:bg-ms-blue-light/50 dark:hover:bg-dark-bg-secondary'
                    }`}
                  >
                    {item.category === 'Navigation' ? (
                      <Hash className="w-4 h-4 flex-shrink-0 opacity-50" />
                    ) : item.category === 'Links' ? (
                      <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-50" />
                    ) : (
                      <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-50" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.label}</p>
                      {item.description && (
                        <p className="text-xs opacity-60 truncate">{item.description}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-ms-text-secondary dark:text-dark-text-secondary py-8">
              No results found.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-ms-border dark:border-dark-border text-xs text-ms-text-secondary dark:text-dark-text-secondary">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>esc Close</span>
        </div>
      </div>
    </div>
  );
}
