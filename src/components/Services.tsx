'use client';

import { Layout, Server, ShoppingCart, Paintbrush, Gauge, Smartphone } from 'lucide-react';
import { useGsapReveal, useGsapStagger } from '@/hooks/useGsap';

const services = [
  {
    icon: Layout,
    title: 'Frontend Development',
    description: 'Pixel-perfect, responsive interfaces using React, Next.js, and Tailwind CSS with smooth animations and modern UX patterns.',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Server,
    title: 'Backend Development',
    description: 'Scalable server-side applications with Django and Django REST Framework — clean architecture, robust APIs, and secure auth.',
    gradient: 'from-purple-500 to-pink-400',
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Solutions',
    description: 'Complete online stores with WooCommerce, custom checkout flows, payment integration, and inventory management.',
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    icon: Paintbrush,
    title: 'WordPress & CMS',
    description: 'Custom WordPress themes and Elementor-based sites — beautiful landing pages, portfolios, and business websites.',
    gradient: 'from-amber-500 to-orange-400',
  },
  {
    icon: Gauge,
    title: 'Performance Optimization',
    description: 'Speed audits, lazy loading, code splitting, image optimization, and caching strategies to hit 90+ Lighthouse scores.',
    gradient: 'from-rose-500 to-pink-400',
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    description: 'Mobile-first layouts that look stunning on every screen size — from phones to ultra-wide monitors.',
    gradient: 'from-indigo-500 to-blue-400',
  },
];

export default function Services() {
  const titleRef = useGsapReveal({ y: 40 });
  const gridRef = useGsapStagger({ stagger: 0.08, scale: true });

  return (
    <section id="services" className="relative overflow-hidden section-animated-bg">
      <div className="section-container">
        <div ref={titleRef}>
          <h2 className="section-title">What I Do</h2>
          <p className="section-subtitle">Services I offer to bring your digital vision to life</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <div key={service.title} className="glass-card-hover p-6 md:p-7 group relative overflow-hidden">
              {/* Hover background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.gradient} shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1B1B1F] dark:text-dark-text mb-2 group-hover:text-[var(--active-accent)] transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-[#49454F] dark:text-dark-text-secondary leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
