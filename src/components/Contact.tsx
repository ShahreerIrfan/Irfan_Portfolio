'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Copy, Check, MessageSquare, Clock } from 'lucide-react';
import { useGsapReveal, useGsapStagger } from '@/hooks/useGsap';
import profile from '@/data/profile';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'mdshahreerirfan@gmail.com',
    href: 'mailto:mdshahreerirfan@gmail.com',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+880 1344-260216',
    href: 'tel:+8801344260216',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Dhaka, Bangladesh',
    href: '#',
    color: 'from-purple-500 to-pink-400',
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Within 24 hours',
    href: '#',
    color: 'from-amber-500 to-orange-400',
  },
];

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const titleRef = useGsapReveal({ y: 40 });
  const cardsRef = useGsapStagger({ stagger: 0.08, scale: true });
  const formRef = useGsapReveal({ y: 30, delay: 0.2 });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:mdshahreerirfan@gmail.com?subject=Portfolio Contact from ${formState.name}&body=${encodeURIComponent(formState.message)}%0A%0AFrom: ${formState.email}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <section id="contact" className="relative overflow-hidden section-animated-bg">
      <div className="absolute inset-0 -z-10">

      </div>

      <div className="section-container">
        <div ref={titleRef} className="text-center">
          <h2 className="section-title text-center">Get In Touch</h2>
          <p className="section-subtitle text-center mx-auto">Have a project in mind or want to collaborate? Let&apos;s connect!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column — Contact Cards */}
          <div>
            <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="glass-card-hover p-5 group cursor-pointer relative overflow-hidden"
                  onClick={() => item.value !== 'Dhaka, Bangladesh' && item.value !== 'Within 24 hours' && copyToClipboard(item.value, item.label)}
                >
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.color} opacity-60`} />
                  {/* Hover glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500`} />
                  <div className="relative z-10 flex items-start gap-3">
                    <div className={`flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br ${item.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#49454F]/50 dark:text-dark-text-secondary/50 mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-[#1B1B1F] dark:text-dark-text truncate">
                        {item.value}
                      </p>
                    </div>
                    {item.value !== 'Dhaka, Bangladesh' && item.value !== 'Within 24 hours' && (
                      <button
                        className="flex-shrink-0 p-1.5 rounded-lg text-[#49454F]/30 hover:text-[var(--active-accent)] hover:bg-[var(--active-accent)]/5 transition-colors"
                        aria-label={`Copy ${item.label}`}
                      >
                        {copied === item.label ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--active-accent)] via-purple-500 to-pink-500 opacity-60" />
              <p className="text-sm font-semibold text-[#1B1B1F] dark:text-dark-text mb-4 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-[var(--active-accent)] to-purple-500 shadow-md">
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                </div>
                Connect on Social
              </p>
              <div className="flex gap-3">
                {profile.socials
                  .filter((s) => s.url.startsWith('http'))
                  .map((social) => {
                    const Icon = social.icon === 'github' ? Github : social.icon === 'linkedin' ? Linkedin : Mail;
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card-hover text-sm font-medium text-[#49454F] dark:text-dark-text-secondary hover:text-[var(--active-accent)]"
                      >
                        <Icon className="w-4 h-4" />
                        {social.platform}
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Right Column — Contact Form */}
          <div ref={formRef} className="glass-card p-6 md:p-8 relative overflow-hidden">
            {/* Gradient accent top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--active-accent)] via-purple-500 to-pink-500 opacity-60" />

            <h3 className="text-lg font-bold text-[#1B1B1F] dark:text-dark-text mb-6 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--active-accent)] to-purple-500 shadow-lg">
                <Send className="w-4 h-4 text-white" />
              </div>
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#49454F] dark:text-dark-text-secondary mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-white/5 border border-[rgba(0,120,212,0.08)] dark:border-blue-500/10 text-[#1B1B1F] dark:text-dark-text placeholder-[#49454F]/40 focus:ring-2 focus:ring-[var(--active-accent)]/30 focus:border-[var(--active-accent)]/20 transition-all text-sm"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#49454F] dark:text-dark-text-secondary mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-white/5 border border-[rgba(0,120,212,0.08)] dark:border-blue-500/10 text-[#1B1B1F] dark:text-dark-text placeholder-[#49454F]/40 focus:ring-2 focus:ring-[var(--active-accent)]/30 focus:border-[var(--active-accent)]/20 transition-all text-sm"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#49454F] dark:text-dark-text-secondary mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-white/5 border border-[rgba(0,120,212,0.08)] dark:border-blue-500/10 text-[#1B1B1F] dark:text-dark-text placeholder-[#49454F]/40 focus:ring-2 focus:ring-[var(--active-accent)]/30 focus:border-[var(--active-accent)]/20 transition-all text-sm resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full justify-center"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
