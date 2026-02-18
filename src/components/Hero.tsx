'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Github, Linkedin, Mail, Facebook, Download, ArrowRight, Sparkles, Code2, Trophy, Briefcase, ChevronDown } from 'lucide-react';
import { useGsapHero, useCountUp } from '@/hooks/useGsap';
import profile from '@/data/profile';

const socialIcons: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  facebook: Facebook,
};

const typingTexts = ['Full-Stack Developer', 'Django Expert', 'Next.js Enthusiast', 'Problem Solver', 'UI/UX Designer'];

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
      {/* Subtle Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[var(--active-accent)]/[0.05] to-transparent rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-400/[0.04] to-transparent rounded-full" />
      </div>

      <div className="section-container w-full !py-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Profile Photo with orbit rings */}
          <div className="hero-photo flex-shrink-0 relative">
            <div className="relative z-10">
              <div className="w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-white dark:border-dark-bg shadow-lg">
                <Image
                  src="/Irfan.png"
                  alt={profile.name}
                  width={240}
                  height={240}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              {/* Available badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-400 rounded-full border-4 border-white dark:border-dark-bg shadow-sm" title="Available for work">
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Greeting badge */}
            <div className="hero-greeting inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] font-semibold text-sm mb-5 border border-[var(--active-accent)]/15">
              <Sparkles className="w-4 h-4" />
              <span>Hello, I&apos;m</span>
            </div>

            {/* Name */}
            <h1 className="hero-name text-4xl md:text-5xl lg:text-6xl font-black mb-3 leading-[1.1] tracking-tight text-[#1B1B1F] dark:text-dark-text">
              {profile.name}
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

            {/* Quick Stats */}
            <div className="hero-stats flex items-center justify-center lg:justify-start gap-5 md:gap-7 mb-7">
              <div className="glass-card px-5 py-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span ref={countExp} className="text-2xl md:text-3xl font-black text-[var(--active-accent)]">3</span>
                  <span className="text-lg font-bold text-[var(--active-accent)]">+</span>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#49454F] dark:text-dark-text-secondary mt-0.5 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Years Exp
                </p>
              </div>
              <div className="glass-card px-5 py-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span ref={countProblems} className="text-2xl md:text-3xl font-black text-[var(--active-accent)]">250</span>
                  <span className="text-lg font-bold text-[var(--active-accent)]">+</span>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#49454F] dark:text-dark-text-secondary mt-0.5 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Problems
                </p>
              </div>
              <div className="glass-card px-5 py-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span ref={countProjects} className="text-2xl md:text-3xl font-black text-[var(--active-accent)]">{profile.projects.length + 5}</span>
                  <span className="text-lg font-bold text-[var(--active-accent)]">+</span>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#49454F] dark:text-dark-text-secondary mt-0.5 flex items-center gap-1">
                  <Code2 className="w-3 h-3" /> Projects
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="hero-socials flex items-center justify-center lg:justify-start gap-3 mb-7">
              {profile.socials.map((social) => {
                const Icon = socialIcons[social.icon] || Mail;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target={social.url.startsWith('http') ? '_blank' : undefined}
                    rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group p-3 rounded-xl glass-card-hover text-[#49454F] dark:text-dark-text-secondary hover:text-[var(--active-accent)] dark:hover:text-[var(--active-accent)]"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </a>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href={profile.resumeUrl} download className="btn-primary magnetic-btn group">
                <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                Download Resume
              </a>
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary magnetic-btn group"
                type="button"
              >
                View Projects
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-bio absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#49454F]/40 dark:text-dark-text-secondary/40">
          <span className="text-xs font-medium uppercase tracking-widest">Scroll Down</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 wave-divider">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,60 1440,50 L1440,100 L0,100 Z"
            className="fill-[#E8F1FE] dark:fill-[#0F1729]"
            fillOpacity="0.5"
          />
        </svg>
      </div>
    </section>
  );
}
