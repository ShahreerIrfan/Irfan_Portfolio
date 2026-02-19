'use client';

import { Clock, Code2, MapPin, Trophy, Zap, Globe, Coffee, Target } from 'lucide-react';
import { useGsapStagger, useCountUp, useGsapReveal } from '@/hooks/useGsap';
import profile from '@/data/profile';

const snapshots = [
  {
    icon: Clock,
    label: 'Years of Experience',
    value: `${profile.snippets.yearsExperience}+`,
    subtitle: 'Professional development',
    color: 'from-blue-500 to-cyan-400',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    icon: Code2,
    label: 'Primary Stack',
    value: profile.snippets.primaryStack,
    subtitle: 'Full-stack expertise',
    color: 'from-purple-500 to-pink-400',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Dhaka, BD',
    subtitle: 'Available remotely',
    color: 'from-teal-500 to-emerald-400',
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-500',
  },
  {
    icon: Trophy,
    label: 'Problems Solved',
    value: '250+',
    subtitle: 'Codeforces & ICPC',
    color: 'from-amber-500 to-orange-400',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
  {
    icon: Target,
    label: 'Projects Delivered',
    value: '180+',
    subtitle: 'Clients & personal',
    color: 'from-rose-500 to-pink-400',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-500',
  },
  {
    icon: Coffee,
    label: 'Cups of Coffee',
    value: '∞',
    subtitle: 'Fuel for coding',
    color: 'from-yellow-600 to-amber-400',
    iconBg: 'bg-yellow-600/10',
    iconColor: 'text-yellow-600',
  },
  {
    icon: Globe,
    label: 'Availability',
    value: 'Open',
    subtitle: 'For new opportunities',
    color: 'from-emerald-500 to-green-400',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
  {
    icon: Zap,
    label: 'Response Time',
    value: '< 24h',
    subtitle: 'Quick communication',
    color: 'from-indigo-500 to-blue-400',
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-500',
  },
];

export default function About() {
  const staggerRef = useGsapStagger({ stagger: 0.06, scale: true });
  const titleRef = useGsapReveal({ y: 40 });

  return (
    <section id="about" className="relative overflow-hidden section-animated-bg">
      <div className="section-container">
        <div ref={titleRef}>
          <h2 className="section-title">At a Glance</h2>
          <p className="section-subtitle">A quick snapshot of my journey, skills, and availability</p>
        </div>

        <div ref={staggerRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {snapshots.map((item) => (
            <div
              key={item.label}
              className="group relative glass-card-hover p-5 md:p-6 text-center overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

              <div className={`relative z-10`}>
                <div className={`inline-flex p-3 rounded-xl ${item.iconBg} mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <p className="text-2xl md:text-3xl font-extrabold text-[#1B1B1F] dark:text-dark-text mb-1">{item.value}</p>
                <p className="text-sm font-semibold text-[#49454F] dark:text-dark-text-secondary">{item.label}</p>
                <p className="text-xs text-[#49454F]/60 dark:text-dark-text-secondary/60 mt-1">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
