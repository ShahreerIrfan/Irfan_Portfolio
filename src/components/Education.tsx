'use client';

import { GraduationCap, Calendar, MapPin, Star, Award, BookOpen } from 'lucide-react';
import { useGsapTimeline, useGsapReveal } from '@/hooks/useGsap';
import profile from '@/data/profile';

export default function Education() {
  const timelineRef = useGsapTimeline();
  const titleRef = useGsapReveal({ y: 40 });

  return (
    <section id="education" className="relative overflow-hidden section-animated-bg">
      <div className="section-container">
        <div ref={titleRef} className="text-center">
          <h2 className="section-title text-center">Education</h2>
          <p className="section-subtitle text-center mx-auto">Academic background and competitive programming journey</p>
        </div>

        <div ref={timelineRef} className="relative">
          {/* Timeline line */}
          <div className="timeline-line h-full" />

          {/* Education Items */}
          {profile.education.map((edu, idx) => (
            <div key={idx} className={`timeline-item relative pl-12 md:pl-0 md:w-1/2 mb-12 last:mb-0 ${idx % 2 === 0 ? 'md:pr-12 md:ml-0' : 'md:pl-12 md:ml-auto'}`}>
              <div className="timeline-dot" style={{ top: '28px' }} />

              <div className="gradient-border-card glow-hover">
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 p-3 rounded-xl bg-[var(--active-accent)]/10">
                      <GraduationCap className="w-7 h-7 text-[var(--active-accent)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-[#1B1B1F] dark:text-dark-text leading-tight">
                        {edu.degree}
                      </h3>
                      <p className="text-[var(--active-accent)] font-semibold mt-1">{edu.institution}</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#49454F] dark:text-dark-text-secondary mb-4">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[var(--active-accent)]/60" />
                      {edu.period}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[var(--active-accent)]/60" />
                      {edu.location}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[#49454F] dark:text-dark-text-secondary mb-5 leading-relaxed">
                    {edu.description}
                  </p>

                  {/* Highlights */}
                  {edu.highlights && edu.highlights.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-[#1B1B1F] dark:text-dark-text flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        Key Highlights
                      </p>
                      <div className="grid gap-2.5">
                        {edu.highlights.map((highlight, hIdx) => (
                          <div
                            key={hIdx}
                            className="flex items-start gap-3 p-3 rounded-xl bg-[var(--active-accent)]/[0.03] dark:bg-blue-500/5 border border-[var(--active-accent)]/5"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--active-accent)] mt-2 flex-shrink-0" />
                            <span className="text-sm text-[#49454F] dark:text-dark-text-secondary">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  {!edu.endYear && (
                    <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold border border-emerald-500/20 shadow-sm">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      Currently Pursuing
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Extra: Competitive Programming card */}
          <div className="timeline-item relative pl-12 md:pl-0 md:w-1/2 md:pl-12 md:ml-auto">
            <div className="timeline-dot" style={{ top: '28px', background: '#7C3AED', boxShadow: '0 0 0 4px rgba(124,58,237,0.15)' }} />

            <div className="glass-card-hover p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-purple-500/10">
                  <Award className="w-7 h-7 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#1B1B1F] dark:text-dark-text">
                    Competitive Programming
                  </h3>
                  <p className="text-purple-500 font-semibold mt-1">Codeforces & ICPC</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 text-center border border-purple-500/15 hover:border-purple-500/25 transition-colors">
                  <p className="text-2xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">250+</p>
                  <p className="text-xs font-medium text-[#49454F] dark:text-dark-text-secondary">Problems Solved</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 text-center border border-purple-500/15 hover:border-purple-500/25 transition-colors">
                  <p className="text-2xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">ICPC</p>
                  <p className="text-xs font-medium text-[#49454F] dark:text-dark-text-secondary">Participant</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['C++', 'Algorithms', 'Data Structures', 'Problem Solving', 'Graph Theory', 'Dynamic Programming'].map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/10">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
