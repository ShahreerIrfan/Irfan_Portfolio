'use client';

import { useState } from 'react';
import {
  Code2, Server, Database, Wrench, Globe, Layers,
  ChevronRight, Sparkles, Search
} from 'lucide-react';
import { useGsapReveal, useGsapWave, useGsapStagger } from '@/hooks/useGsap';
import profile from '@/data/profile';

const categoryMeta: Record<string, { icon: React.ElementType; gradient: string; iconColor: string }> = {
  Frontend: { icon: Code2, gradient: 'from-blue-500 to-cyan-400', iconColor: 'text-blue-500' },
  Backend: { icon: Server, gradient: 'from-purple-500 to-pink-400', iconColor: 'text-purple-500' },
  Database: { icon: Database, gradient: 'from-teal-500 to-emerald-400', iconColor: 'text-teal-500' },
  'Tools & DevOps': { icon: Wrench, gradient: 'from-amber-500 to-orange-400', iconColor: 'text-amber-500' },
  'CMS & Cloud': { icon: Globe, gradient: 'from-rose-500 to-pink-400', iconColor: 'text-rose-500' },
};

const levelColors: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  Strong: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
  },
  Comfortable: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    bar: 'bg-gradient-to-r from-blue-500 to-blue-400',
  },
  Beginner: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    bar: 'bg-gradient-to-r from-amber-500 to-amber-400',
  },
};

const levelWidth: Record<string, string> = {
  Strong: 'w-[90%]',
  Comfortable: 'w-[65%]',
  Beginner: 'w-[35%]',
};

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const titleRef = useGsapReveal({ y: 40 });
  const tabsRef = useGsapWave();
  const gridRef = useGsapStagger({ stagger: 0.05, scale: true });

  const filteredSkills = profile.skills
    .filter((cat) => !activeCategory || cat.category === activeCategory)
    .map((cat) => ({
      ...cat,
      skills: cat.skills.filter((s) =>
        !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.skills.length > 0);

  const totalSkills = profile.skills.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <section id="techstack" className="relative overflow-hidden section-animated-bg">
      {/* Decorative bg */}
      <div className="absolute inset-0 -z-10">

      </div>

      <div className="section-container">
        <div ref={titleRef}>
          <h2 className="section-title">Tech Stack</h2>
          <p className="section-subtitle">
            Technologies I use to bring ideas to life —{' '}
            <span className="font-semibold text-[var(--active-accent)]">{totalSkills} skills</span> across {profile.skills.length} domains
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#49454F]/40" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl glass-card text-sm text-[#1B1B1F] dark:text-dark-text placeholder-[#49454F]/40 focus:ring-2 focus:ring-[var(--active-accent)]/30 focus:border-[var(--active-accent)]/20 border border-transparent transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div ref={tabsRef} className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              !activeCategory
                ? 'bg-[var(--active-accent)] text-white shadow-[0_4px_16px_rgba(0,120,212,0.3)]'
                : 'glass-card text-[#49454F] dark:text-dark-text-secondary hover:text-[var(--active-accent)]'
            }`}
          >
            <Layers className="w-4 h-4" />
            All
          </button>
          {profile.skills.map((cat) => {
            const meta = categoryMeta[cat.category] || { icon: Code2, gradient: 'from-gray-400 to-gray-500', iconColor: 'text-gray-500' };
            const Icon = meta.icon;
            return (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat.category
                    ? 'bg-[var(--active-accent)] text-white shadow-[0_4px_16px_rgba(0,120,212,0.3)]'
                    : 'glass-card text-[#49454F] dark:text-dark-text-secondary hover:text-[var(--active-accent)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.category}
                <span className="opacity-50 text-xs">({cat.skills.length})</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div ref={gridRef} className="space-y-10">
          {filteredSkills.map((cat) => {
            const meta = categoryMeta[cat.category] || { icon: Code2, gradient: 'from-gray-400 to-gray-500', iconColor: 'text-gray-500' };
            const Icon = meta.icon;

            return (
              <div key={cat.category}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${meta.gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1B1B1F] dark:text-dark-text">{cat.category}</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-[var(--active-accent)]/10 to-transparent" />
                </div>

                {/* Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.skills.map((skill) => {
                    const lc = levelColors[skill.level] || levelColors.Beginner;
                    const lw = levelWidth[skill.level] || 'w-[35%]';

                    return (
                      <div
                        key={skill.name}
                        className="tech-icon-card group"
                      >
                        <div className="tech-icon-bg" />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-[#1B1B1F] dark:text-dark-text text-sm group-hover:text-[var(--active-accent)] transition-colors">
                              {skill.name}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${lc.bg} ${lc.text} ${lc.border} border`}>
                              {skill.level}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="h-1.5 w-full rounded-full bg-[#0078D4]/5 dark:bg-blue-500/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${lc.bar} transition-all duration-700 ${lw}`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm text-[#49454F] dark:text-dark-text-secondary">
            <Sparkles className="w-4 h-4 text-[var(--active-accent)]" />
            Always learning & exploring new technologies
          </div>
        </div>
      </div>
    </section>
  );
}
