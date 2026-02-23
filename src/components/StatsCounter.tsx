'use client';

import { useEffect, useRef, useState } from 'react';
import { Briefcase, Users, Coffee, Award } from 'lucide-react';
import { useGsapReveal } from '@/hooks/useGsap';

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  icon: React.ElementType;
  color: string;
}

const defaultStats: StatItem[] = [
  { label: 'Projects Completed', value: 50, suffix: '+', icon: Briefcase, color: 'from-blue-500 to-cyan-400' },
  { label: 'Happy Clients', value: 30, suffix: '+', icon: Users, color: 'from-emerald-500 to-teal-400' },
  { label: 'Years Experience', value: 7, suffix: '+', icon: Coffee, color: 'from-purple-500 to-pink-400' },
  { label: 'Awards & Certs', value: 10, suffix: '+', icon: Award, color: 'from-amber-500 to-orange-400' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function StatsCounter() {
  const [stats, setStats] = useState(defaultStats);
  const titleRef = useGsapReveal({ y: 40 });

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          const s = d.settings;
          const updated = [...defaultStats];
          if (s.statProjects) updated[0].value = parseInt(s.statProjects);
          if (s.statClients) updated[1].value = parseInt(s.statClients);
          if (s.statExperience) updated[2].value = parseInt(s.statExperience);
          if (s.statAwards) updated[3].value = parseInt(s.statAwards);
          setStats(updated);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="stats" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div ref={titleRef} className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            By the Numbers
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Proven Track Record
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-all"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
