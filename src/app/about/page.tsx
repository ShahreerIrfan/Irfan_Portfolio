'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Download, ArrowRight, CheckCircle, MapPin, GraduationCap, X, ChevronLeft, ChevronRight, ZoomIn, Briefcase, Award, Code2, Heart, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import profile from '@/data/profile';

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
}

export default function AboutPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: '/about', sessionId: localStorage.getItem('session_id') || '' }) });
    fetch('/api/gallery').then(r => r.json()).then(d => setGallery(d.galleries || [])).catch(() => {});
  }, []);

  const categories = ['All', ...Array.from(new Set(gallery.map(g => g.category)))];
  const filtered = filter === 'All' ? gallery : gallery.filter(g => g.category === filter);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prevImage = useCallback(() => setLightbox(prev => prev !== null ? (prev - 1 + filtered.length) % filtered.length : null), [filtered.length]);
  const nextImage = useCallback(() => setLightbox(prev => prev !== null ? (prev + 1) % filtered.length : null), [filtered.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, prevImage, nextImage]);

  const stats = [
    { icon: Briefcase, label: 'Years Experience', value: `${profile.snippets.yearsExperience}+`, color: 'from-blue-500 to-cyan-400' },
    { icon: Code2, label: 'Projects Completed', value: '120+', color: 'from-purple-500 to-pink-400' },
    { icon: Award, label: 'Happy Clients', value: '50+', color: 'from-emerald-500 to-teal-400' },
    { icon: Heart, label: 'Technologies', value: `${profile.skills.reduce((a, c) => a + c.skills.length, 0)}+`, color: 'from-rose-500 to-orange-400' },
  ];

  return (
    <>
      <Navbar onCommandPalette={() => {}} />
      <main className="min-h-screen pt-20">
        {/* Hero About */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/40 to-teal-50/30 dark:from-[#0A0F1E] dark:via-[#0F1A35] dark:to-[#0A1628]" />
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.06]"
              style={{ background: 'linear-gradient(135deg, var(--active-accent), #7C3AED)' }} />
            <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
              style={{ background: 'linear-gradient(225deg, #F43F5E, var(--active-accent))' }} />
          </div>
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text */}
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" /> About Me
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-tight mb-5">
                  <span className="text-slate-900 dark:text-white">Hi, I&apos;m </span>
                  <span className="bg-gradient-to-r from-[var(--active-accent)] to-purple-500 bg-clip-text text-transparent">{profile.name}</span>
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  A full stack web developer & WordPress expert based in
                  <span className="inline-flex items-center gap-1 ml-1 text-[var(--active-accent)] font-medium">
                    <MapPin className="w-4 h-4" /> {profile.location}
                  </span>
                  , passionate about building modern websites and web applications.
                </p>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                  With years of professional experience, I&apos;ve had the privilege of working with clients worldwide — helping them build websites and web applications that their users love.
                </p>

                {/* Highlights */}
                <div className="space-y-3 mb-8">
                  {[
                    `${profile.snippets.yearsExperience}+ years of full-stack web development experience`,
                    'Expert in React, Next.js, Node.js & WordPress',
                    'Built 120+ websites for clients worldwide',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                  <a href="/contact" className="btn-primary">
                    Get In Touch <ArrowRight className="w-4 h-4" />
                  </a>
                  <a href={profile.resumeUrl} download className="btn-secondary">
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                <div className="relative w-full max-w-md mx-auto">
                  <div className="absolute -inset-4 bg-gradient-to-br from-[var(--active-accent)]/20 to-purple-500/20 rounded-3xl blur-2xl" />
                  <div className="relative rounded-3xl overflow-hidden border-2 border-white/50 dark:border-slate-700/50 shadow-2xl">
                    <Image
                      src="/shahreer_irfan.jpg"
                      alt={profile.name}
                      width={500}
                      height={600}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -left-4 glass-card px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Status</p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Available for Hire</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="glass-card-hover p-6 text-center relative overflow-hidden group">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 bg-gradient-to-br ${s.color}`} />
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${s.color} shadow-lg flex items-center justify-center`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">{s.value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="section-container">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4" /> Career
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Work Experience</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">My professional journey so far</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {profile.experience.map((exp, i) => (
              <div key={i} className="glass-card-hover p-6 md:p-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--active-accent)] to-purple-500 rounded-full" />
                <div className="pl-5">
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[var(--active-accent)] transition-colors">{exp.title}</h3>
                      <p className="text-[var(--active-accent)] font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">{exp.period}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {exp.location}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {exp.responsibilities.map((r, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                    {exp.techStack.map(tech => (
                      <span key={tech} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--active-accent)]/5 text-[var(--active-accent)] border border-[var(--active-accent)]/10">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="section-container">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4" /> Education
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Education</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {profile.education.map((edu, i) => (
              <div key={i} className="glass-card-hover p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[var(--active-accent)] to-purple-500 shadow-lg flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{edu.degree}</h3>
                    <p className="text-[var(--active-accent)] font-semibold">{edu.institution}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{edu.period} | {edu.location}</p>
                    {edu.description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">{edu.description}</p>}
                    {edu.highlights && (
                      <ul className="mt-3 space-y-1.5">
                        {edu.highlights.map((h, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="section-container">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] text-sm font-medium mb-4">
              <ZoomIn className="w-4 h-4" /> Gallery
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Gallery</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Some moments captured</p>
          </div>

          {/* Category Filter */}
          {categories.length > 2 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat
                    ? 'bg-[var(--active-accent)] text-white shadow-lg shadow-[var(--active-accent)]/25'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-[var(--active-accent)] border border-slate-200/50 dark:border-slate-700/50'}`}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item, i) => (
                <div key={item._id} onClick={() => openLightbox(i)}
                  className="group relative rounded-2xl overflow-hidden aspect-square glass-card-hover cursor-pointer">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ZoomIn className="w-4 h-4 text-white/80" />
                      <span className="text-xs text-white/70 uppercase tracking-wider">{item.category}</span>
                    </div>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    {item.description && <p className="text-white/70 text-xs line-clamp-2 mt-0.5">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['shahreer_irfan.jpg', 'shahreer_irfan2.jpg', 'shahreer_irfan3.jpg', 'shahreer_irfan4.jpg', 'shahreer_irfan5.jpg'].map((img, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden aspect-square glass-card-hover">
                  <Image src={`/${img}`} alt={`Shahreer Irfan Photo ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Lightbox Modal */}
        {lightbox !== null && filtered[lightbox] && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center" onClick={closeLightbox}>
            <button onClick={closeLightbox} className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10">
              <X className="w-6 h-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="max-w-4xl max-h-[85vh] relative" onClick={e => e.stopPropagation()}>
              <Image
                src={filtered[lightbox].imageUrl}
                alt={filtered[lightbox].title}
                width={1200}
                height={800}
                className="max-h-[80vh] w-auto object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <p className="text-white font-semibold">{filtered[lightbox].title}</p>
                {filtered[lightbox].description && <p className="text-white/60 text-sm mt-1">{filtered[lightbox].description}</p>}
                <p className="text-white/40 text-xs mt-2">{lightbox + 1} / {filtered.length}</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
