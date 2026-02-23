'use client';

import Link from 'next/link';
import { Heart, Github, Linkedin, Mail, ArrowUp, Code2, Facebook, MessageCircle, ExternalLink } from 'lucide-react';
import profile from '@/data/profile';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
];

const moreLinks = [
  { label: 'About Me', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Admin', href: '/admin' },
];

const socialIconMap: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  mail: Mail,
  whatsapp: MessageCircle,
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-200/50 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 overflow-hidden">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--active-accent)] to-transparent opacity-40" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--active-accent)] to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-black bg-gradient-to-r from-[var(--active-accent)] to-purple-500 bg-clip-text text-transparent block leading-tight">
                  Shahreer Irfan
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Full Stack Developer</span>
              </div>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mb-5">
              Building modern, performant web applications and WordPress sites for clients worldwide.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {profile.socials.map(s => {
                const Icon = socialIconMap[s.icon] || Mail;
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-[var(--active-accent)] hover:border-[var(--active-accent)]/30 hover:shadow-md transition-all duration-300"
                    aria-label={s.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-[var(--active-accent)] transition-colors inline-flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-[var(--active-accent)] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              More
            </h4>
            <ul className="space-y-2.5">
              {moreLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-[var(--active-accent)] transition-colors inline-flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-[var(--active-accent)] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact CTA */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              Let&apos;s Work Together
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Have a project in mind? Let&apos;s build something amazing together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--active-accent)] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[var(--active-accent)]/20 transition-all duration-300"
            >
              Get In Touch <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Available for freelance
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400 flex items-center gap-1 flex-wrap justify-center">
              &copy; {currentYear} {profile.name}. Built with
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 mx-0.5" />
              using Next.js & Tailwind CSS
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--active-accent)] hover:underline"
            >
              Back to top
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
