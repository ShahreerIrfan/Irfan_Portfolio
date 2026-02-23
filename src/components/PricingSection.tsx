'use client';

import { useEffect, useState } from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { useGsapReveal, useGsapStagger } from '@/hooks/useGsap';

interface PricingTier {
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
  cta: string;
  color: string;
}

const defaultTiers: PricingTier[] = [
  {
    name: 'Starter',
    description: 'Perfect for small businesses & personal projects',
    price: '$299',
    period: 'starting from',
    features: [
      'Single Page Website',
      'Responsive Design',
      'Basic SEO Setup',
      'Contact Form',
      '2 Revision Rounds',
      '1 Month Free Support',
    ],
    popular: false,
    cta: 'Get Started',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Professional',
    description: 'Ideal for growing businesses & startups',
    price: '$799',
    period: 'starting from',
    features: [
      'Multi-Page Website (up to 8)',
      'Custom UI/UX Design',
      'Advanced SEO & Analytics',
      'Admin Dashboard',
      'Payment Integration',
      'Database & API Setup',
      '5 Revision Rounds',
      '3 Months Free Support',
    ],
    popular: true,
    cta: 'Most Popular',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Enterprise',
    description: 'Full-stack solutions for large-scale projects',
    price: '$2,499',
    period: 'starting from',
    features: [
      'Full Custom Web Application',
      'Scalable Architecture',
      'User Authentication & Roles',
      'Real-time Features',
      'Cloud Deployment (AWS/Vercel)',
      'Performance Optimization',
      'CI/CD Pipeline Setup',
      'Unlimited Revisions',
      '6 Months Free Support',
    ],
    popular: false,
    cta: 'Contact Me',
    color: 'from-amber-500 to-orange-500',
  },
];

export default function PricingSection() {
  const titleRef = useGsapReveal({ y: 40 });
  const cardsRef = useGsapStagger({ stagger: 0.12, scale: true });

  const scrollToQuote = () => {
    const el = document.getElementById('quote');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div ref={titleRef} className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Transparent Pricing
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Fair pricing for quality work. Every project includes free consultation.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {defaultTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative group bg-gray-900/60 backdrop-blur-xl border rounded-2xl p-8 transition-all hover:shadow-xl ${
                tier.popular
                  ? 'border-purple-500/50 shadow-lg shadow-purple-500/10 scale-[1.02]'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    POPULAR
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
              <p className="text-sm text-gray-400 mb-6">{tier.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                <span className="text-sm text-gray-500 ml-2">{tier.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToQuote}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {tier.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Need something custom? <button onClick={scrollToQuote} className="text-purple-400 hover:underline">Get a free quote</button> tailored to your needs.
        </p>
      </div>
    </section>
  );
}
