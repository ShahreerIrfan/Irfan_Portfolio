'use client';

import { Briefcase, Calendar, MapPin, ChevronRight, Building2, ExternalLink } from 'lucide-react';
import { useGsapTimeline, useGsapReveal } from '@/hooks/useGsap';
import profile from '@/data/profile';

export default function Experience() {
  const timelineRef = useGsapTimeline();
  const titleRef = useGsapReveal({ y: 40 });

  const gradients = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-400',
    'from-teal-500 to-emerald-400',
  ];

  return (
    <section id="experience" className="relative overflow-hidden section-animated-bg">
      <div className="section-container">
        <div ref={titleRef}>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">Professional journey and key contributions</p>
        </div>

        <div ref={timelineRef} className="relative">
          <div className="timeline-line h-full" />

          {profile.experience.map((exp, idx) => (
            <div
              key={idx}
              className={`timeline-item relative pl-12 md:pl-0 md:w-1/2 mb-16 last:mb-0 ${idx % 2 === 0 ? 'md:pr-12 md:ml-0' : 'md:pl-12 md:ml-auto'}`}
            >
              <div className="timeline-dot" style={{ top: '28px' }} />

              <div className="gradient-border-card glow-hover group">
                <div className="p-6 md:p-8">
                  {/* Color accent top */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${gradients[idx % gradients.length]} opacity-60`} />

                  {/* Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${gradients[idx % gradients.length]} bg-opacity-10`}>
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#1B1B1F] dark:text-dark-text">
                        {exp.title}
                      </h3>
                      <p className="text-[var(--active-accent)] font-semibold mt-0.5">{exp.company}</p>
                    </div>
                  </div>

                  {/* Meta Row */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#49454F] dark:text-dark-text-secondary mb-5">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[var(--active-accent)]/60" />
                      {exp.period}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[var(--active-accent)]/60" />
                      {exp.location}
                    </span>
                  </div>

                  {/* Responsibilities */}
                  <div className="space-y-2.5 mb-6">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-start gap-3 group/item"
                      >
                        <ChevronRight className="w-4 h-4 text-[var(--active-accent)] mt-0.5 flex-shrink-0 transition-transform group-hover/item:translate-x-0.5" />
                        <span className="text-sm text-[#49454F] dark:text-dark-text-secondary leading-relaxed">
                          {resp}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="pt-4 border-t border-[var(--active-accent)]/5 dark:border-blue-500/10">
                    <p className="text-xs font-semibold text-[#49454F]/60 dark:text-dark-text-secondary/60 uppercase tracking-wider mb-3">
                      Technologies Used
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.techStack.map((tech) => (
                        <span key={tech} className="chip text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
