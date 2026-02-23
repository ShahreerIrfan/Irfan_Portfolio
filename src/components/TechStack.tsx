'use client';

import { useState } from 'react';
import {
  Code2, Server, Database, Wrench, Globe, Layers, Sparkles
} from 'lucide-react';
import { useGsapReveal, useGsapStagger } from '@/hooks/useGsap';
import profile from '@/data/profile';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const techIcons: Record<string, string> = {
  'React':                  `${DEVICON}/react/react-original.svg`,
  'Next.js':                `${DEVICON}/nextjs/nextjs-original.svg`,
  'TypeScript':             `${DEVICON}/typescript/typescript-original.svg`,
  'JavaScript':             `${DEVICON}/javascript/javascript-original.svg`,
  'Tailwind CSS':           `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
  'HTML/CSS':               `${DEVICON}/html5/html5-original.svg`,
  'Python':                 `${DEVICON}/python/python-original.svg`,
  'Django':                 `${DEVICON}/django/django-plain.svg`,
  'Django REST Framework':  `${DEVICON}/djangorest/djangorest-original.svg`,
  'PHP':                    `${DEVICON}/php/php-original.svg`,
  'Node.js':                `${DEVICON}/nodejs/nodejs-original.svg`,
  'PostgreSQL':             `${DEVICON}/postgresql/postgresql-original.svg`,
  'MySQL':                  `${DEVICON}/mysql/mysql-original.svg`,
  'SQLite':                 `${DEVICON}/sqlite/sqlite-original.svg`,
  'MongoDB':                `${DEVICON}/mongodb/mongodb-original.svg`,
  'Git':                    `${DEVICON}/git/git-original.svg`,
  'GitHub':                 `${DEVICON}/github/github-original.svg`,
  'Docker':                 `${DEVICON}/docker/docker-original.svg`,
  'Linux':                  `${DEVICON}/linux/linux-original.svg`,
  'VS Code':                `${DEVICON}/vscode/vscode-original.svg`,
  'Figma':                  `${DEVICON}/figma/figma-original.svg`,
  'WordPress':              `${DEVICON}/wordpress/wordpress-plain.svg`,
  'Elementor':              'https://cdn.simpleicons.org/elementor/92003B',
  'WooCommerce':            `${DEVICON}/woocommerce/woocommerce-original.svg`,
  'Vercel':                 `${DEVICON}/vercel/vercel-original.svg`,
  'Netlify':                `${DEVICON}/netlify/netlify-original.svg`,
  'AWS (Basic)':            `${DEVICON}/amazonwebservices/amazonwebservices-original-wordmark.svg`,
};

/** Icons that are dark/black and need inversion in dark mode */
const darkIcons = new Set(['Next.js', 'GitHub', 'WordPress', 'Vercel']);

const categoryMeta: Record<string, { icon: React.ElementType; gradient: string; bg: string }> = {
  Frontend:         { icon: Code2,    gradient: 'from-blue-500 to-cyan-400',    bg: 'bg-blue-500/10' },
  Backend:          { icon: Server,   gradient: 'from-purple-500 to-pink-400',  bg: 'bg-purple-500/10' },
  Database:         { icon: Database, gradient: 'from-teal-500 to-emerald-400', bg: 'bg-teal-500/10' },
  'Tools & DevOps': { icon: Wrench,   gradient: 'from-amber-500 to-orange-400', bg: 'bg-amber-500/10' },
  'CMS & Cloud':    { icon: Globe,    gradient: 'from-rose-500 to-pink-400',    bg: 'bg-rose-500/10' },
};

const levelBadge: Record<string, { color: string; width: string }> = {
  Strong:      { color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20', width: '90%' },
  Comfortable: { color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',           width: '65%' },
  Beginner:    { color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',       width: '35%' },
};

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [failedIcons, setFailedIcons] = useState<Set<string>>(new Set());
  const titleRef = useGsapReveal({ y: 40 });
  const gridRef = useGsapStagger({ stagger: 0.04, scale: true });

  const filteredSkills = profile.skills
    .filter((cat) => !activeCategory || cat.category === activeCategory)
    .filter((cat) => cat.skills.length > 0);

  const totalSkills = profile.skills.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <section id="techstack" className="relative overflow-hidden section-animated-bg">
      <div className="section-container">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] text-sm font-medium mb-4">
            <Code2 className="w-4 h-4" /> Tech Arsenal
          </span>
          <h2 className="section-title text-center">Technologies I Work With</h2>
          <p className="section-subtitle text-center mx-auto">
            <span className="font-semibold text-[var(--active-accent)]">{totalSkills} skills</span> across {profile.skills.length} domains
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              !activeCategory
                ? 'bg-[var(--active-accent)] text-white shadow-lg shadow-[var(--active-accent)]/25'
                : 'glass-card text-slate-600 dark:text-slate-400 hover:text-[var(--active-accent)] hover:border-[var(--active-accent)]/30'
            }`}
          >
            <Layers className="w-4 h-4" /> All
          </button>
          {profile.skills.map((cat) => {
            const meta = categoryMeta[cat.category] || { icon: Code2, gradient: 'from-gray-400 to-gray-500', bg: 'bg-gray-500/10' };
            const Icon = meta.icon;
            return (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat.category
                    ? 'bg-[var(--active-accent)] text-white shadow-lg shadow-[var(--active-accent)]/25'
                    : 'glass-card text-slate-600 dark:text-slate-400 hover:text-[var(--active-accent)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.category}
                <span className="ml-0.5 text-xs opacity-60">({cat.skills.length})</span>
              </button>
            );
          })}
        </div>

        {/* Skills by Category */}
        <div ref={gridRef} className="space-y-10">
          {filteredSkills.map((cat) => {
            const meta = categoryMeta[cat.category] || { icon: Code2, gradient: 'from-gray-400 to-gray-500', bg: 'bg-gray-500/10' };
            const Icon = meta.icon;

            return (
              <div key={cat.category}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${meta.gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cat.category}</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-[var(--active-accent)]/20 to-transparent" />
                  <span className="text-xs font-medium text-slate-400">{cat.skills.length} skills</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {cat.skills.map((skill) => {
                    const badge = levelBadge[skill.level] || levelBadge.Beginner;
                    return (
                      <div
                        key={skill.name}
                        className="group relative glass-card-hover p-4 flex flex-col items-center text-center"
                      >
                        {/* Glow on hover */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: `radial-gradient(circle at 50% 0%, var(--active-accent), transparent 70%)`, opacity: 0 }} />
                        <div className="relative z-10 w-full">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${meta.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                            {techIcons[skill.name] && !failedIcons.has(skill.name) ? (
                              <img
                                src={techIcons[skill.name]}
                                alt={skill.name}
                                className={`w-7 h-7 object-contain ${
                                  darkIcons.has(skill.name) ? 'dark:invert' : ''
                                }`}
                                onError={() =>
                                  setFailedIcons((prev) => new Set(prev).add(skill.name))
                                }
                              />
                            ) : (
                              <span
                                className="text-lg font-black"
                                style={{ color: 'var(--active-accent)' }}
                              >
                                {skill.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white mb-1 truncate group-hover:text-[var(--active-accent)] transition-colors">
                            {skill.name}
                          </p>
                          <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}>
                            {skill.level}
                          </span>
                          {/* Mini progress bar */}
                          <div className="mt-2 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[var(--active-accent)] to-purple-400 transition-all duration-700"
                              style={{ width: badge.width }}
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

        {/* Bottom Tag */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-sm text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-[var(--active-accent)]" />
            Always learning & exploring new technologies
          </div>
        </div>
      </div>
    </section>
  );
}
