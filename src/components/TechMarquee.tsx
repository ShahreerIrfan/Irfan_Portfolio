'use client';

import { useState } from 'react';
import { useGsapReveal, useGsapStagger } from '@/hooks/useGsap';
import { Code2, Database, Palette, Globe, Server, Wrench } from 'lucide-react';

const techCategories = [
  {
    category: 'Frontend',
    icon: Palette,
    color: 'from-blue-500 to-cyan-400',
    techs: [
      { name: 'React', level: 90 },
      { name: 'Next.js', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'JavaScript', level: 92 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'HTML/CSS', level: 95 },
      { name: 'GSAP', level: 75 },
    ],
  },
  {
    category: 'Backend',
    icon: Server,
    color: 'from-emerald-500 to-teal-400',
    techs: [
      { name: 'Django', level: 90 },
      { name: 'Python', level: 92 },
      { name: 'Node.js', level: 70 },
      { name: 'REST API', level: 88 },
      { name: 'WordPress', level: 80 },
    ],
  },
  {
    category: 'Database',
    icon: Database,
    color: 'from-orange-500 to-amber-400',
    techs: [
      { name: 'PostgreSQL', level: 82 },
      { name: 'MySQL', level: 78 },
      { name: 'SQLite', level: 85 },
    ],
  },
  {
    category: 'DevOps & Tools',
    icon: Wrench,
    color: 'from-purple-500 to-pink-400',
    techs: [
      { name: 'Git', level: 88 },
      { name: 'Docker', level: 70 },
      { name: 'Linux', level: 75 },
      { name: 'Vercel', level: 85 },
      { name: 'Figma', level: 72 },
    ],
  },
];

export default function TechMarquee() {
  const ref = useGsapReveal({ y: 20 });
  const gridRef = useGsapStagger({ stagger: 0.1, scale: true });
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <section id="techmarquee" className="relative overflow-hidden section-animated-bg">
      <div ref={ref} className="section-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] font-semibold text-sm mb-4 border border-[var(--active-accent)]/15 backdrop-blur-sm">
            <Code2 className="w-4 h-4" />
            Tech Stack
          </div>
          <h2 className="section-title text-center">Technologies I Work With</h2>
          <p className="section-subtitle text-center mx-auto">
            A comprehensive overview of my technical skills and proficiency levels
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techCategories.map((cat, catIdx) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.category}
                className="glass-card-hover p-6 group relative overflow-hidden"
              >
                {/* Gradient accent top */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cat.color} opacity-60`} />

                {/* Background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

                {/* Category header */}
                <div className="relative z-10 flex items-center gap-3 mb-5">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B1B1F] dark:text-dark-text">
                      {cat.category}
                    </h3>
                    <span className="text-xs font-medium text-[#49454F]/50 dark:text-dark-text-secondary/50">
                      {cat.techs.length} skills
                    </span>
                  </div>
                </div>

                {/* Tech table */}
                <div className="relative z-10 space-y-3">
                  {cat.techs.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center gap-3 group/item p-1.5 -mx-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-white/[0.03] transition-colors"
                      onMouseEnter={() => setHoveredTech(tech.name)}
                      onMouseLeave={() => setHoveredTech(null)}
                    >
                      <span className="text-sm font-semibold text-[#1B1B1F] dark:text-dark-text w-28 flex-shrink-0 truncate">
                        {tech.name}
                      </span>
                      <div className="flex-1 h-2.5 rounded-full bg-[#0078D4]/[0.06] dark:bg-blue-500/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-700 ease-out`}
                          style={{
                            width: `${tech.level}%`,
                            opacity: hoveredTech === tech.name ? 1 : 0.7,
                            boxShadow: hoveredTech === tech.name ? '0 0 12px rgba(0,120,212,0.3)' : 'none',
                          }}
                        />
                      </div>
                      <span className={`text-xs font-bold w-10 text-right tabular-nums transition-colors ${hoveredTech === tech.name ? 'text-[var(--active-accent)]' : 'text-[#49454F]/60 dark:text-dark-text-secondary/60'}`}>
                        {tech.level}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
