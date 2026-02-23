'use client';

import { useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGsapReveal } from '@/hooks/useGsap';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  featured: boolean;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const titleRef = useGsapReveal({ y: 40 });

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((d) => { if (d.testimonials) setTestimonials(d.testimonials); })
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  const next = () => setCurrent((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);
  const t = testimonials[current];

  return (
    <section id="testimonials" className="section-container py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div ref={titleRef} className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            What Clients Say
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Real feedback from real people who trusted me with their projects
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Card */}
          <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 md:p-12 text-center transition-all duration-500">
            <Quote className="w-10 h-10 text-yellow-400/40 mx-auto mb-6" />

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                />
              ))}
            </div>

            <p className="text-lg md:text-xl text-gray-300 leading-relaxed italic mb-8">
              &ldquo;{t.content}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center justify-center gap-4">
              {t.avatar ? (
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-yellow-400/30" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                  {t.name[0]}
                </div>
              )}
              <div className="text-left">
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-sm text-gray-400">
                  {t.role}{t.company ? ` at ${t.company}` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 p-3 rounded-full bg-gray-800/80 border border-gray-700 text-white hover:bg-gray-700 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 p-3 rounded-full bg-gray-800/80 border border-gray-700 text-white hover:bg-gray-700 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === current ? 'bg-yellow-400 w-6' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
