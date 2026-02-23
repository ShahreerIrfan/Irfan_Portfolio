'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, Sparkles } from 'lucide-react';
import { useGsapReveal } from '@/hooks/useGsap';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const ref = useGsapReveal({ y: 30 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, source: 'homepage' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
      setSuccess(true);
      setEmail('');
      setName('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-gray-800 p-8 md:p-14"
        >
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Stay Updated
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Get Notified About New Projects
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Subscribe to get updates on my latest work, blog posts, and exclusive insights on web development
            </p>

            {success ? (
              <div className="flex items-center justify-center gap-3 text-green-400 bg-green-400/10 rounded-xl px-6 py-4 max-w-md mx-auto">
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                <p className="font-medium">You&apos;re subscribed! Check your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Subscribe
                      </>
                    )}
                  </button>
                </div>
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                <p className="text-xs text-gray-500 mt-3">No spam, unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
