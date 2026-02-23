'use client';

import { useState } from 'react';
import { Send, CheckCircle, DollarSign, Clock, Layers, User, Mail, Phone, Building2, FileText } from 'lucide-react';
import { useGsapReveal } from '@/hooks/useGsap';

const projectTypes = ['Landing Page', 'Business Website', 'E-commerce Store', 'Web Application', 'Mobile App', 'API Development', 'UI/UX Design', 'Full Stack Project'];
const budgetRanges = ['< $500', '$500 - $1,000', '$1,000 - $3,000', '$3,000 - $5,000', '$5,000 - $10,000', '$10,000+'];
const timelines = ['ASAP', '1-2 Weeks', '2-4 Weeks', '1-2 Months', '3+ Months', 'Flexible'];
const featureOptions = ['Responsive Design', 'Admin Dashboard', 'User Authentication', 'Payment Integration', 'SEO Optimization', 'API Integration', 'Database Design', 'Cloud Hosting', 'Performance Optimization', 'Maintenance & Support'];

export default function QuickQuote() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    projectType: '', budget: '', timeline: '', description: '',
    features: [] as string[],
  });
  const ref = useGsapReveal({ y: 30 });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));
  const toggleFeature = (f: string) => {
    setForm((p) => ({
      ...p,
      features: p.features.includes(f) ? p.features.filter((x) => x !== f) : [...p.features, f],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch {
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="quote" className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4">
        <div ref={ref} className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            Get a Quote
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Quick Project Quote
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Tell me about your project and get a detailed quote within 24 hours
          </p>
        </div>

        {success ? (
          <div className="max-w-md mx-auto text-center py-12">
            <CheckCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Quote Request Received!</h3>
            <p className="text-gray-400">I&apos;ll review your project and send you a detailed quote within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-10">
            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full Name *" required className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="Email *" required className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Phone" className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="Company" className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
            </div>

            {/* Project Type */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2"><Layers className="w-4 h-4" /> Project Type *</p>
              <div className="flex flex-wrap gap-2">
                {projectTypes.map((pt) => (
                  <button type="button" key={pt} onClick={() => update('projectType', pt)} className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${form.projectType === pt ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                    {pt}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Budget Range</p>
                <div className="flex flex-wrap gap-2">
                  {budgetRanges.map((b) => (
                    <button type="button" key={b} onClick={() => update('budget', b)} className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${form.budget === b ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Timeline</p>
                <div className="flex flex-wrap gap-2">
                  {timelines.map((t) => (
                    <button type="button" key={t} onClick={() => update('timeline', t)} className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${form.timeline === t ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-300 mb-3">Required Features</p>
              <div className="flex flex-wrap gap-2">
                {featureOptions.map((f) => (
                  <button type="button" key={f} onClick={() => toggleFeature(f)} className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${form.features.includes(f) ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                    {form.features.includes(f) ? '✓ ' : ''}{f}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> Project Description *</p>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                required
                rows={4}
                placeholder="Describe your project idea, goals, and any specific requirements..."
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Get My Free Quote
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
