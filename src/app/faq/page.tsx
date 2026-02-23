'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, Search, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

const defaultFAQs: FAQ[] = [
  { _id: '1', question: 'What services do you offer?', answer: 'I offer a comprehensive range of web development services including full-stack web development, WordPress development, e-commerce solutions, API development, UI/UX design implementation, and website maintenance & support.', category: 'General' },
  { _id: '2', question: 'What is your typical project timeline?', answer: 'Project timelines vary depending on complexity. A simple website usually takes 1-2 weeks, a medium complexity project takes 2-4 weeks, and complex web applications may take 4-8 weeks or more. I always provide a detailed timeline estimate before starting.', category: 'Process' },
  { _id: '3', question: 'How much do you charge for a website?', answer: 'Pricing depends on the scope, complexity, and features required. Simple websites start from $300, while complex web applications may cost $2000+. I provide detailed quotes after understanding your requirements. Contact me for a free consultation.', category: 'Pricing' },
  { _id: '4', question: 'Do you offer post-launch support?', answer: 'Yes! I offer ongoing maintenance and support packages. This includes bug fixes, security updates, content updates, performance optimization, and feature additions. Free support is included for the first month after launch.', category: 'Support' },
  { _id: '5', question: 'What technologies do you use?', answer: 'I primarily work with React, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL, and WordPress. For styling, I use Tailwind CSS and modern CSS techniques. I choose the best tech stack based on your project requirements.', category: 'General' },
  { _id: '6', question: 'How do we communicate during a project?', answer: 'I use a combination of WhatsApp, email, and video calls for project communication. You will receive regular progress updates and have access to a staging environment to review work in progress.', category: 'Process' },
  { _id: '7', question: 'Do you offer refunds?', answer: 'I offer refunds for work not yet started. Once development begins, refunds are prorated based on completed milestones. My detailed milestone-based approach ensures transparency at every step.', category: 'Pricing' },
  { _id: '8', question: 'Can you redesign my existing website?', answer: 'Absolutely! I can redesign and modernize your existing website while preserving your content and SEO rankings. I will analyze your current site and provide recommendations for improving design, performance, and user experience.', category: 'General' },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/faqs').then(r => r.json()).then(data => {
      setFaqs(data.faqs?.length ? data.faqs : defaultFAQs);
    }).catch(() => setFaqs(defaultFAQs));
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: '/faq', sessionId: localStorage.getItem('session_id') || '' }) });
  }, []);

  const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))];

  const filtered = faqs.filter(f => {
    const matchCat = activeCategory === 'All' || f.category === activeCategory;
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar onCommandPalette={() => {}} />
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-purple-50/30 to-blue-50/30 dark:from-[#0A0F1E] dark:via-[#0F1A35] dark:to-[#0A1628]" />
            <div className="absolute top-[-15%] left-[50%] w-[500px] h-[500px] rounded-full opacity-[0.06] dark:opacity-[0.10]"
              style={{ background: 'radial-gradient(circle, var(--active-accent), transparent 70%)' }} />
          </div>
          <div className="section-container text-center pb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" /> FAQ
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              <span className="text-slate-900 dark:text-white">Frequently Asked </span>
              <span className="bg-gradient-to-r from-[var(--active-accent)] to-purple-500 bg-clip-text text-transparent">Questions</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400 mb-8">
              Find answers to common questions about my services, process, and pricing.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-6">
              <div className="glass-card p-2 flex items-center gap-2 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
                <Search className="w-5 h-5 text-slate-400 ml-3" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent py-2.5 px-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-[var(--active-accent)] text-white shadow-lg shadow-[var(--active-accent)]/25'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-[var(--active-accent)] border border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="space-y-3">
            {filtered.map((faq, index) => (
              <div
                key={faq._id}
                className={`glass-card overflow-hidden transition-all duration-300 ${openId === faq._id ? 'ring-1 ring-[var(--active-accent)]/30 shadow-lg shadow-[var(--active-accent)]/5' : ''}`}
              >
                <button
                  onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      openId === faq._id
                        ? 'bg-[var(--active-accent)] text-white'
                        : 'bg-[var(--active-accent)]/10 text-[var(--active-accent)]'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{faq.question}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openId === faq._id ? 'bg-[var(--active-accent)]/10 rotate-180' : ''
                  }`}>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openId === faq._id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-5 pb-5 pt-0">
                    <div className="ml-11 text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-4">
                      {faq.answer}
                    </div>
                    <div className="ml-11 mt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)]">{faq.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--active-accent)]/10 flex items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-[var(--active-accent)]/50" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No questions found matching your search.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <div className="relative glass-card overflow-hidden rounded-3xl">
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--active-accent)] via-purple-500 to-pink-500" />
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ background: 'radial-gradient(circle at 70% 50%, var(--active-accent), transparent 60%)' }} />
            <div className="relative p-8 md:p-12 text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[var(--active-accent)] to-purple-500 flex items-center justify-center shadow-lg shadow-[var(--active-accent)]/25">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Still have questions?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
                Can&apos;t find what you&apos;re looking for? Feel free to reach out directly. I&apos;m always happy to help!
              </p>
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2 text-base">
                <Sparkles className="w-4 h-4" />
                Contact Me
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
