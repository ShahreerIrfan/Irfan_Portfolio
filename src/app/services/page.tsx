'use client';

import { useState, useEffect } from 'react';
import {
  Layout, Server, ShoppingCart, Paintbrush, Gauge, Smartphone,
  ArrowRight, CheckCircle, Code2, Wrench, Globe, Zap, Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const iconMap: Record<string, React.ElementType> = {
  Layout, Server, ShoppingCart, Paintbrush, Gauge, Smartphone,
  Code2, Wrench, Globe, Zap, Star,
};

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  gradient: string;
  features: string[];
  featured: boolean;
  price: string;
}

// Default static services if none from DB
const defaultServices: Service[] = [
  {
    _id: '1', title: 'Full Stack Web Development', slug: 'full-stack', icon: 'Layout',
    description: 'Modern web apps with React, Next.js & Node.js',
    longDescription: 'End-to-end web application development using cutting-edge technologies. From designing responsive user interfaces to building robust backend systems with databases and APIs.',
    gradient: 'from-blue-500 to-cyan-400',
    features: ['Custom React/Next.js apps', 'RESTful API development', 'Database design & optimization', 'Authentication & authorization', 'Performance optimization'],
    featured: true, price: '',
  },
  {
    _id: '2', title: 'WordPress Development', slug: 'wordpress', icon: 'Paintbrush',
    description: 'Custom WordPress websites with Elementor',
    longDescription: 'Professional WordPress websites built with modern page builders. Custom themes, plugins, and WooCommerce integration for e-commerce solutions.',
    gradient: 'from-purple-500 to-pink-400',
    features: ['Custom theme development', 'Elementor page builder', 'WooCommerce integration', 'Plugin customization', 'SEO optimization'],
    featured: true, price: '',
  },
  {
    _id: '3', title: 'Responsive Web Design', slug: 'responsive', icon: 'Smartphone',
    description: 'Mobile-first designs with Tailwind & Bootstrap',
    longDescription: 'Beautiful, responsive web designs that look perfect on any device. Using modern CSS frameworks and design principles to create engaging user experiences.',
    gradient: 'from-emerald-500 to-teal-400',
    features: ['Mobile-first approach', 'Cross-browser compatibility', 'Tailwind CSS & Bootstrap', 'CSS animations', 'Accessibility compliance'],
    featured: true, price: '',
  },
  {
    _id: '4', title: 'Backend Development', slug: 'backend', icon: 'Server',
    description: 'Scalable backends with Django & Node.js',
    longDescription: 'Robust server-side development with Python Django, Django REST Framework, and Node.js. Building scalable, secure, and well-documented APIs.',
    gradient: 'from-amber-500 to-orange-400',
    features: ['Django & DRF APIs', 'Node.js/Express', 'Database management', 'API documentation', 'Server deployment'],
    featured: false, price: '',
  },
  {
    _id: '5', title: 'API Development', slug: 'api', icon: 'Zap',
    description: 'Fast, documented REST APIs',
    longDescription: 'Development of well-structured, documented, and tested RESTful APIs using modern frameworks. Integration with third-party services and payment gateways.',
    gradient: 'from-rose-500 to-pink-400',
    features: ['REST API design', 'Authentication (JWT, OAuth)', 'Rate limiting & caching', 'API documentation', 'Third-party integrations'],
    featured: false, price: '',
  },
  {
    _id: '6', title: 'Website Maintenance & Support', slug: 'maintenance', icon: 'Wrench',
    description: 'Keep your site fast, secure & up-to-date',
    longDescription: 'Ongoing maintenance, performance monitoring, security updates, and technical support to keep your website running smoothly.',
    gradient: 'from-indigo-500 to-blue-400',
    features: ['Security updates', 'Performance monitoring', 'Bug fixes', 'Content updates', 'Technical support'],
    featured: false, price: '',
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      } catch (err) {
        console.error('Services fetch failed:', err);
      }
      setLoading(false);
    };
    fetchServices();
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: '/services', sessionId: localStorage.getItem('session_id') || '' }) });
  }, []);

  return (
    <>
      <Navbar onCommandPalette={() => {}} />
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="section-container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] text-sm font-medium mb-4">
            <Wrench className="w-4 h-4" />
            What I Offer
          </div>
          <h1 className="section-title text-center">Services</h1>
          <p className="section-subtitle text-center mx-auto">
            I provide end-to-end web development services to help bring your ideas to life with modern, scalable, and user-friendly solutions.
          </p>
        </section>

        {/* Featured Services */}
        <section className="section-container !pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.filter(s => s.featured).map(service => {
              const Icon = iconMap[service.icon] || Code2;
              return (
                <div key={service._id} className="glass-card-hover p-7 group relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient}`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

                  <div className="relative z-10">
                    {/* Icon + Badge */}
                    <div className="flex items-start justify-between mb-5">
                      <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                        ⭐ Featured
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[var(--active-accent)] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{service.description}</p>

                    {/* Features */}
                    <div className="space-y-2.5">
                      {service.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                      {service.features.length > 4 && (
                        <p className="text-xs text-slate-400 ml-6">+{service.features.length - 4} more</p>
                      )}
                    </div>

                    <a href="#contact" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[var(--active-accent)] hover:gap-3 transition-all">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* All Services Grid */}
        <section className="section-container">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">All Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(service => {
              const Icon = iconMap[service.icon] || Code2;
              return (
                <div key={service._id} className="glass-card-hover p-6 group relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[var(--active-accent)] transition-colors">{service.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{service.description}</p>

                    {service.features.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 space-y-2">
                        {service.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="section-container text-center">
          <div className="glass-card p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--active-accent)]/5 to-purple-500/5" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Have a project in mind?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xl mx-auto">
                Let&apos;s discuss your requirements and build something amazing together.
              </p>
              <a href="/contact" className="btn-primary inline-flex">
                Get In Touch <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
