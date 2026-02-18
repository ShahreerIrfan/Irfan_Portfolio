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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] font-semibold text-sm mb-4 border border-[var(--active-accent)]/15">
            <Code2 className="w-4 h-4" />
            Tech Stack
          </div>
          <h2 className="section-title text-center">Technologies I Work With</h2>
          <p className="section-subtitle text-center mx-auto">
            A comprehensive overview of my technical skills and proficiency levels
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.category}
                className="glass-card-hover p-6 group"
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1B1B1F] dark:text-dark-text">
                    {cat.category}
                  </h3>
                  <span className="ml-auto text-xs font-medium text-[#49454F]/50 dark:text-dark-text-secondary/50">
                    {cat.techs.length} skills
                  </span>
                </div>

                {/* Tech table */}
                <div className="space-y-3">
                  {cat.techs.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center gap-3 group/item"
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
                            width: hoveredTech === tech.name ? `${tech.level}%` : `${tech.level}%`,
                            opacity: hoveredTech === tech.name ? 1 : 0.7,
                            boxShadow: hoveredTech === tech.name ? '0 0 12px rgba(0,120,212,0.3)' : 'none',
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[var(--active-accent)] w-10 text-right tabular-nums">
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
