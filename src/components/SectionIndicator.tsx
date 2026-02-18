'use client';

import { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'techmarquee', label: 'Skills' },
  { id: 'services', label: 'Services' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function SectionIndicator() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      let current = 0;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            current = i;
            break;
          }
        }
      }
      setActiveIdx(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3">
      {sections.map((section, idx) => (
        <button
          key={section.id}
          onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}
          className="group flex items-center gap-2"
          aria-label={`Go to ${section.label}`}
        >
          {/* Label (visible on hover or active) */}
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeIdx === idx
                ? 'opacity-100 translate-x-0 text-[var(--active-accent)]'
                : 'opacity-0 translate-x-2 text-[#49454F] dark:text-dark-text-secondary group-hover:opacity-100 group-hover:translate-x-0'
            }`}
          >
            {section.label}
          </span>

          {/* Dot */}
          <div
            className={`rounded-full transition-all duration-300 ${
              activeIdx === idx
                ? 'w-3 h-3 bg-[var(--active-accent)] shadow-[0_0_8px_var(--active-accent)]'
                : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 group-hover:bg-[var(--active-accent)]/50 group-hover:scale-125'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
