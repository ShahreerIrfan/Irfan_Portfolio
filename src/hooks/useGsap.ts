'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ===========================
   SECTION REVEAL — big fade+slide
   =========================== */
export function useGsapReveal(options?: { delay?: number; y?: number; duration?: number; scale?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const el = ref.current;

    // Set initial state immediately
    gsap.set(el, { opacity: 0, y: options?.y ?? 60, scale: options?.scale ?? 0.97 });

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: options?.duration ?? 1,
        delay: options?.delay ?? 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, [options?.delay, options?.y, options?.duration, options?.scale]);

  return ref;
}

/* ===========================
   STAGGER CHILDREN — cards/chips appearing one by one
   =========================== */
export function useGsapStagger(options?: {
  delay?: number;
  stagger?: number;
  y?: number;
  scale?: boolean;
  rotate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const children = ref.current.children;
    if (!children.length) return;

    // Set initial state
    gsap.set(children, {
      opacity: 0,
      y: options?.y ?? 40,
      scale: options?.scale ? 0.9 : 1,
      rotation: options?.rotate ? -3 : 0,
    });

    const ctx = gsap.context(() => {
      gsap.to(children, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.7,
        stagger: options?.stagger ?? 0.08,
        delay: options?.delay ?? 0,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: ref.current!,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, [options?.delay, options?.stagger, options?.y, options?.scale, options?.rotate]);

  return ref;
}

/* ===========================
   WAVE STAGGER — chips/tags wave effect
   =========================== */
export function useGsapWave() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const children = ref.current.children;
    if (!children.length) return;

    gsap.set(children, { opacity: 0, y: 30, scale: 0.8, rotation: -5 });

    const ctx = gsap.context(() => {
      gsap.to(children, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        stagger: { each: 0.04, from: 'start' },
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: ref.current!,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return ref;
}

/* ===========================
   TIMELINE DRAW — vertical line + items
   =========================== */
export function useGsapTimeline() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const line = ref.current.querySelector('.timeline-line') as HTMLElement;
    const items = ref.current.querySelectorAll('.timeline-item');
    const dots = ref.current.querySelectorAll('.timeline-dot');

    // Set initial states
    if (line) gsap.set(line, { scaleY: 0 });
    gsap.set(items, { opacity: 0, x: (i: number) => (i % 2 === 0 ? -60 : 60) });
    gsap.set(dots, { scale: 0 });

    const ctx = gsap.context(() => {
      // Line draw with scrub
      if (line) {
        gsap.to(line, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current!,
            start: 'top 75%',
            end: 'bottom 25%',
            scrub: 1.5,
          },
        });
      }

      // Items slide in
      items.forEach((item, i) => {
        gsap.to(item, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Dots pop
      dots.forEach((dot) => {
        gsap.to(dot, {
          scale: 1,
          duration: 0.5,
          ease: 'back.out(3)',
          scrollTrigger: {
            trigger: dot,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return ref;
}

/* ===========================
   PARALLAX — element moves slower/faster
   =========================== */
export function useGsapParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current!, {
        y: () => speed * 150,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current!,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

/* ===========================
   HERO — sequenced intro animation
   =========================== */
export function useGsapHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.3,
      });

      // Set everything invisible first
      gsap.set(['.hero-photo', '.hero-greeting', '.hero-name', '.hero-tagline', '.hero-bio', '.hero-stats'], {
        opacity: 0,
        y: 30,
      });
      gsap.set('.hero-socials > *', { opacity: 0, y: 20, scale: 0.8 });
      gsap.set('.hero-buttons > *', { opacity: 0, y: 20, scale: 0.95 });
      gsap.set('.hero-photo', { scale: 0.7, rotation: -5 });

      // Animate in sequence
      tl.to('.hero-photo', {
        opacity: 1,
        scale: 1,
        rotation: 0,
        y: 0,
        duration: 1,
        ease: 'back.out(1.5)',
      })
        .to('.hero-greeting', { opacity: 1, y: 0, duration: 0.5 }, '-=0.5')
        .to('.hero-name', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
        .to('.hero-bio', { opacity: 1, y: 0, duration: 0.5 }, '-=0.15')
        .to('.hero-stats > *', {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: 'back.out(2)',
        }, '-=0.2')
        .to('.hero-socials > *', {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.06,
          duration: 0.4,
          ease: 'back.out(2)',
        }, '-=0.3')
        .to('.hero-buttons > *', {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.12,
          duration: 0.5,
          ease: 'back.out(1.5)',
        }, '-=0.2');
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

/* ===========================
   COUNTER — number count-up effect
   =========================== */
export function useCountUp(end: number, duration: number = 2) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) {
      if (ref.current) ref.current.textContent = end.toString();
      return;
    }

    const el = ref.current;
    el.textContent = '0';

    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: end,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toString();
        },
      });
    });

    return () => ctx.revert();
  }, [end, duration]);

  return ref;
}

/* ===========================
   ROCKET SCROLL — rocket moves up as user scrolls
   =========================== */
export function useRocketScroll() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current!, {
        bottom: '110vh',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return ref;
}

/* ===========================
   TEXT REVEAL — characters / words animate in
   =========================== */
export function useTextReveal() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const el = ref.current;
    const text = el.textContent || '';
    el.innerHTML = '';

    // Split into words
    text.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.overflow = 'hidden';
      span.style.marginRight = '0.3em';

      const inner = document.createElement('span');
      inner.textContent = word;
      inner.style.display = 'inline-block';
      inner.className = 'word-inner';

      span.appendChild(inner);
      el.appendChild(span);
    });

    gsap.set('.word-inner', { y: '100%', opacity: 0 });

    const ctx = gsap.context(() => {
      gsap.to('.word-inner', {
        y: '0%',
        opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return ref;
}

/* ===========================
   MAGNETIC HOVER
   =========================== */
export function useMagneticHover() {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || prefersReducedMotion()) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
}

/* ===========================
   SCRUB SCALE — element scales on scroll
   =========================== */
export function useScrubScale(fromScale: number = 0.85) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    gsap.set(ref.current, { scale: fromScale, opacity: 0.5 });

    const ctx = gsap.context(() => {
      gsap.to(ref.current!, {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current!,
          start: 'top 95%',
          end: 'top 50%',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, [fromScale]);

  return ref;
}
