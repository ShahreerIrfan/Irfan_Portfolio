'use client';

import { useEffect, useState } from 'react';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Enable smooth scroll globally
    document.documentElement.style.scrollBehavior = 'smooth';

    // Intersection Observer for reveal-on-scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all sections
    document.querySelectorAll('section').forEach((section) => {
      section.classList.add('scroll-reveal');
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return <>{children}</>;
}
