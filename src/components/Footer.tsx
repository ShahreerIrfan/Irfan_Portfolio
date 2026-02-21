'use client';

import { Heart, Github, Linkedin, Mail, ArrowUp, Code2 } from 'lucide-react';
import profile from '@/data/profile';

const socialIcons: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Tech Stack', href: '#techstack' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[#0078D4]/5 dark:border-dark-border bg-white/90 dark:bg-[#0c1524]/90 overflow-hidden">
      {/* Gradient top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-[var(--active-accent)] to-purple-500 opacity-50" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--active-accent)] to-purple-500 flex items-center justify-center shadow-lg">
                <Code2 className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-black bg-gradient-to-r from-[var(--active-accent)] to-purple-500 bg-clip-text text-transparent">
                {profile.name.split(' ').pop()}
              </span>
            </div>
            <p className="text-sm text-[#49454F] dark:text-dark-text-secondary leading-relaxed max-w-xs">
              Full-stack developer crafting scalable web applications with modern technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#49454F]/50 dark:text-dark-text-secondary/50 mb-4">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[#49454F] dark:text-dark-text-secondary hover:text-[var(--active-accent)] transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#49454F]/50 dark:text-dark-text-secondary/50 mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {profile.socials
                .filter((s) => s.url.startsWith('http'))
                .map((social) => {
                  const Icon = socialIcons[social.icon] || Mail;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl glass-card-hover text-[#49454F] dark:text-dark-text-secondary hover:text-[var(--active-accent)] hover:shadow-md transition-all duration-300"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--active-accent)]/20 to-transparent mb-6" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#49454F]/60 dark:text-dark-text-secondary/60 flex items-center gap-1">
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
    </footer>
  );
}
