'use client';

import { useState } from 'react';
import { ExternalLink, Github, Star, ArrowUpRight, Layers, Filter, Pin } from 'lucide-react';
import { useGsapReveal, useGsapStagger } from '@/hooks/useGsap';
import profile from '@/data/profile';

const allCategories = ['All', ...Array.from(new Set(profile.projects.map((p) => p.category)))];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const titleRef = useGsapReveal({ y: 40 });
  const filterRef = useGsapStagger({ stagger: 0.05 });
  const gridRef = useGsapStagger({ stagger: 0.1, scale: true });

  const filtered = activeFilter === 'All'
    ? profile.projects
    : profile.projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="relative overflow-hidden section-animated-bg">
      {/* Decorative bg */}
      <div className="absolute inset-0 -z-10">

      </div>

      <div className="section-container">
        <div ref={titleRef}>
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">Featured work and side projects I&apos;ve built</p>
        </div>

        {/* Filter Tabs */}
        <div ref={filterRef} className="flex flex-wrap gap-3 mb-10">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-[var(--active-accent)] text-white shadow-[0_4px_16px_rgba(0,120,212,0.3)]'
                  : 'glass-card text-[#49454F] dark:text-dark-text-secondary hover:text-[var(--active-accent)]'
              }`}
            >
              {cat === 'All' && <Filter className="w-3.5 h-3.5" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="gradient-border-card glow-hover group"
            >
              <div className="p-6 md:p-7 flex flex-col h-full">
                {/* Featured Badge */}
                {project.featured && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Pin className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Featured</span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-[#1B1B1F] dark:text-dark-text mb-3 group-hover:text-[var(--active-accent)] transition-colors">
                  {project.title}
                </h3>

                {/* Category */}
                <div className="inline-flex items-center gap-1.5 mb-3">
                  <Layers className="w-3.5 h-3.5 text-[var(--active-accent)]" />
                  <span className="text-xs font-semibold text-[var(--active-accent)]">{project.category}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#49454F] dark:text-dark-text-secondary leading-relaxed mb-5 flex-1">
                  {project.description}
                </p>

                {/* Long description if available */}
                {project.longDescription && (
                  <p className="text-xs text-[#49454F]/70 dark:text-dark-text-secondary/70 leading-relaxed mb-5 border-l-2 border-[var(--active-accent)]/20 pl-3">
                    {project.longDescription.slice(0, 200)}...
                  </p>
                )}

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--active-accent)]/5 text-[var(--active-accent)] border border-[var(--active-accent)]/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--active-accent)]/5 dark:border-blue-500/10">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#49454F] dark:text-dark-text-secondary hover:text-[var(--active-accent)] transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Source
                    </a>
                  )}
                  {project.links.live && project.links.live !== '#' && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--active-accent)] hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  <div className="flex-1" />
                  <ArrowUpRight className="w-5 h-5 text-[#49454F]/20 dark:text-dark-text-secondary/20 group-hover:text-[var(--active-accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
