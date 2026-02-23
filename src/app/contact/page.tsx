'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, Github, Linkedin, Facebook, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import profile from '@/data/profile';

const socialIconMap: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  mail: Mail,
  whatsapp: MessageCircle,
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: '/contact', sessionId: localStorage.getItem('session_id') || '' }) });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const emailSocial = profile.socials.find(s => s.icon === 'mail');
  const emailAddr = emailSocial ? emailSocial.url.replace('mailto:', '') : 'mdshahreerirfan@gmail.com';
  
  const contactInfo = [
    { icon: Mail, label: 'Email', value: emailAddr, href: `mailto:${emailAddr}` },
    { icon: MapPin, label: 'Location', value: profile.location, href: '#' },
  ];

  const socials = profile.socials.filter(s => s.url.startsWith('http')).map(s => ({
    icon: socialIconMap[s.icon] || Mail,
    label: s.platform,
    url: s.url,
  }));

  return (
    <>
      <Navbar onCommandPalette={() => {}} />
      <main className="min-h-screen pt-20">
        {/* Header */}
        <section className="section-container text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] text-sm font-medium mb-6">
            <Mail className="w-4 h-4" /> Contact
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Get In <span className="text-[var(--active-accent)]">Touch</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you.
          </p>
        </section>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left - Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Cards */}
              {contactInfo.map((item, i) => (
                <a key={i} href={item.href} className="glass-card-hover p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[var(--active-accent)]/10">
                    <item.icon className="w-5 h-5 text-[var(--active-accent)]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">{item.label}</p>
                    <p className="text-slate-900 dark:text-white font-medium">{item.value}</p>
                  </div>
                </a>
              ))}

              {/* Socials */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">Follow Me</h3>
                <div className="flex gap-3">
                  {socials.map(s => (
                    <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[var(--active-accent)]/10 hover:text-[var(--active-accent)] text-slate-500 dark:text-slate-400 transition-all">
                      <s.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Available for freelance</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  I&apos;m currently accepting new projects. Average response time: &lt;24 hours.
                </p>
              </div>
            </div>

            {/* Right - Form */}
            <div className="lg:col-span-3">
              <div className="glass-card p-6 md:p-8">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
                    <button onClick={() => setSent(false)} className="btn-secondary text-sm">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Send a Message</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--active-accent)] focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--active-accent)] focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject</label>
                      <input
                        type="text"
                        required
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        placeholder="Project inquiry"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--active-accent)] focus:border-transparent outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell me about your project..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--active-accent)] focus:border-transparent outline-none transition resize-none"
                      />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
