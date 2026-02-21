'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Github, Linkedin, Mail, Facebook, Download, ArrowRight, Sparkles, Code2, Trophy, Briefcase, ChevronDown, Zap, Star } from 'lucide-react';
import { useGsapHero, useCountUp } from '@/hooks/useGsap';
import profile from '@/data/profile';

const socialIcons: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  facebook: Facebook,
};

const typingTexts = ['Full-Stack Developer', 'Django Expert', 'Next.js Enthusiast', 'Problem Solver', 'UI/UX Designer'];

/* Floating particle config */
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 4 + 4,
  delay: Math.random() * 3,
  opacity: Math.random() * 0.5 + 0.1,
}));

export default function Hero() {
  const heroRef = useGsapHero();
  const countExp = useCountUp(profile.snippets.yearsExperience, 1.5);
  const countProblems = useCountUp(250, 2);
  const countProjects = useCountUp(profile.projects.length + 5, 1.5);
  const [typingIdx, setTypingIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect
  useEffect(() => {
    const current = typingTexts[typingIdx];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayed(current.slice(0, displayed.length + 1));
          if (displayed.length + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), 1800);
          }
        } else {
          setDisplayed(current.slice(0, displayed.length - 1));
          if (displayed.length === 0) {
            setIsDeleting(false);
            setTypingIdx((prev) => (prev + 1) % typingTexts.length);
          }
        }
      },
      isDeleting ? 40 : 80,
    );
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, typingIdx]);

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative overflow-hidden pt-16"
      ref={heroRef}
    >
      {/* ===== Rich Animated Background ===== */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/40 to-teal-50/30 dark:from-[#0A0F1E] dark:via-[#0F1A35] dark:to-[#0A1628]" />

        {/* Large animated gradient orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full animate-morph opacity-[0.07] dark:opacity-[0.12]"
          style={{ background: 'linear-gradient(135deg, var(--active-accent), #7C3AED, #0D9488)' }} />
        <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full animate-morph opacity-[0.06] dark:opacity-[0.10]"
          style={{ background: 'linear-gradient(225deg, #F43F5E, var(--active-accent), #F59E0B)', animationDelay: '4s' }} />
        <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] rounded-full animate-morph opacity-[0.04] dark:opacity-[0.08]"
          style={{ background: 'linear-gradient(315deg, #10B981, #7C3AED)', animationDelay: '2s' }} />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, var(--active-accent) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />

        {/* Floating particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-float"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: `var(--active-accent)`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* Radial glow behind content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.10] animate-glow-pulse blur-3xl"
          style={{ background: `radial-gradient(circle, var(--active-accent), transparent 70%)` }} />
      </div>

      <div className="section-container w-full !py-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* ===== Profile Photo with orbit rings ===== */}
          <div className="hero-photo flex-shrink-0 relative">
            {/* Outer glow ring */}
            <div className="absolute inset-[-20px] rounded-full animate-glow-pulse opacity-60"
              style={{
                background: `conic-gradient(from 0deg, var(--active-accent), #7C3AED, #0D9488, #F43F5E, var(--active-accent))`,
                filter: 'blur(30px)',
              }} />

            {/* Orbit ring 1 */}
            <div className="absolute inset-[-30px] animate-orbit">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-lg"
                style={{ background: 'var(--active-accent)', boxShadow: '0 0 12px var(--active-accent)' }} />
            </div>

            {/* Orbit ring 2 */}
            <div className="absolute inset-[-22px] animate-orbit-reverse">
              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full"
                style={{ background: '#7C3AED', boxShadow: '0 0 10px #7C3AED' }} />
            </div>

            {/* Gradient border (static) */}
            <div className="relative z-10 rounded-full p-[3px]"
              style={{
                background: 'conic-gradient(from 0deg, var(--active-accent), #7C3AED, #0D9488, #F43F5E, #F59E0B, var(--active-accent))',
              }}>
              <div className="rounded-full p-[3px] bg-white dark:bg-dark-bg">
                <div className="w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden">
                  <Image
                    src="/Irfan.png"
                    alt={profile.name}
                    width={240}
                    height={240}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Available badge - enhanced */}
            <div className="absolute -bottom-1 -right-1 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg border-2 border-white dark:border-dark-bg">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Available
            </div>

            {/* Floating tech badges near photo */}
            <div className="absolute -top-4 -right-6 z-20 animate-float glass-card px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-purple-300/30 dark:border-purple-500/30">
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <Zap className="w-3 h-3" /> Next.js
              </span>
            </div>
            <div className="absolute -bottom-6 -left-8 z-20 animate-float-delayed glass-card px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-emerald-300/30 dark:border-emerald-500/30">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Code2 className="w-3 h-3" /> Django
              </span>
            </div>
          </div>

          {/* ===== Content ===== */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Greeting badge - enhanced with gradient */}
            <div className="hero-greeting inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm mb-5 border backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(0,120,212,0.08), rgba(124,58,237,0.08))',
                borderColor: 'rgba(0,120,212,0.15)',
                color: 'var(--active-accent)',
              }}>
              <Sparkles className="w-4 h-4" />
              <span>Hello, I&apos;m</span>
              <Star className="w-3 h-3 opacity-60" />
            </div>

            {/* Name - with richer gradient */}
            <h1 className="hero-name text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-black mb-3 leading-[1.1] tracking-tight">
              <span className="text-[#1B1B1F] dark:text-dark-text">{profile.name.split(' ').slice(0, -1).join(' ')}</span>{' '}
              <span className="hero-name-gradient">{profile.name.split(' ').slice(-1)}</span>
            </h1>

            {/* Animated typing tagline */}
            <div className="hero-tagline text-xl md:text-2xl lg:text-3xl font-bold mb-5 h-10">
              <span className="gradient-text-animated">{displayed}</span>
              <span className="inline-block w-[3px] h-7 md:h-8 bg-[var(--active-accent)] ml-1 align-middle animate-[blink_1s_step-end_infinite]" />
            </div>

            {/* Bio */}
            <p className="hero-bio text-[#49454F] dark:text-dark-text-secondary max-w-xl mb-7 leading-relaxed text-base lg:text-lg">
              {profile.bio}
            </p>

            {/* Quick Stats - richer design */}
            <div className="hero-stats flex items-center justify-center lg:justify-start gap-4 md:gap-5 mb-7">
              <div className="hero-stat-card group">
                <div className="hero-stat-glow" style={{ background: 'var(--active-accent)' }} />
                <div className="flex items-center justify-center gap-1">
                  <span ref={countExp} className="text-2xl md:text-3xl font-black text-[var(--active-accent)]">3</span>
                  <span className="text-lg font-bold text-[var(--active-accent)]">+</span>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#49454F] dark:text-dark-text-secondary mt-0.5 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Years Exp
                </p>
              </div>
              <div className="hero-stat-card group">
                <div className="hero-stat-glow" style={{ background: '#7C3AED' }} />
                <div className="flex items-center justify-center gap-1">
                  <span ref={countProblems} className="text-2xl md:text-3xl font-black text-purple-600 dark:text-purple-400">250</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">+</span>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#49454F] dark:text-dark-text-secondary mt-0.5 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Problems
                </p>
              </div>
              <div className="hero-stat-card group">
                <div className="hero-stat-glow" style={{ background: '#0D9488' }} />
                <div className="flex items-center justify-center gap-1">
                  <span ref={countProjects} className="text-2xl md:text-3xl font-black text-teal-600 dark:text-teal-400">{profile.projects.length + 5}</span>
                  <span className="text-lg font-bold text-teal-600 dark:text-teal-400">+</span>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#49454F] dark:text-dark-text-secondary mt-0.5 flex items-center gap-1">
                  <Code2 className="w-3 h-3" /> Projects
                </p>
              </div>
            </div>

            {/* Social Icons - enhanced */}
            <div className="hero-socials flex items-center justify-center lg:justify-start gap-3 mb-7">
              {profile.socials.map((social, i) => {
                const Icon = socialIcons[social.icon] || Mail;
                const colors = ['#0078D4', '#7C3AED', '#0D9488', '#F43F5E'];
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target={social.url.startsWith('http') ? '_blank' : undefined}
                    rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group hero-social-icon"
                    style={{ '--social-color': colors[i % colors.length] } as React.CSSProperties}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:text-white" />
                  </a>
                );
              })}
            </div>

            {/* CTA Buttons - richer with gradients */}
            <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href={profile.resumeUrl} download className="btn-primary magnetic-btn group hero-cta-primary">
                <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                Download Resume
              </a>
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary magnetic-btn group hero-cta-secondary"
                type="button"
              >
                View Projects
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[#49454F]/40 dark:text-dark-text-secondary/40">
        <span className="text-xs font-medium uppercase tracking-widest">Scroll Down</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>

      {/* Bottom gradient wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(240,246,255,0.8), transparent)',
        }} />
      <div className="dark:block hidden absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(10,15,30,0.9), transparent)',
        }} />
    </section>
  );
}
