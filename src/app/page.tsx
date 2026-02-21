'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import TechMarquee from '@/components/TechMarquee';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';
import Footer from '@/components/Footer';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

// Lazy-load heavy sections
const Education = dynamic(() => import('@/components/Education'), {
  loading: () => <SectionSkeleton />,
});
const Experience = dynamic(() => import('@/components/Experience'), {
  loading: () => <SectionSkeleton />,
});
const Services = dynamic(() => import('@/components/Services'), {
  loading: () => <SectionSkeleton />,
});
const TechStack = dynamic(() => import('@/components/TechStack'), {
  loading: () => <SectionSkeleton />,
});
const GitHubShowcase = dynamic(() => import('@/components/GitHubShowcase'), {
  loading: () => <SectionSkeleton />,
});
const Projects = dynamic(() => import('@/components/Projects'), {
  loading: () => <SectionSkeleton />,
});
const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => <SectionSkeleton />,
});
const CommandPalette = dynamic(() => import('@/components/CommandPalette'), {
  ssr: false,
});
const RocketScroll = dynamic(() => import('@/components/RocketScroll'), {
  ssr: false,
});
const AccessibilityWidget = dynamic(() => import('@/components/AccessibilityWidget'), {
  ssr: false,
});
const KeyboardShortcuts = dynamic(() => import('@/components/KeyboardShortcuts'), {
  ssr: false,
});

const PageLoader = dynamic(() => import('@/components/PageLoader'), {
  ssr: false,
});
const SectionIndicator = dynamic(() => import('@/components/SectionIndicator'), {
  ssr: false,
});
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), {
  ssr: false,
});
const AiChat = dynamic(() => import('@/components/AiChat'), {
  ssr: false,
});

function SectionSkeleton() {
  return (
    <div className="section-container">
      <div className="skeleton h-8 w-48 mb-4 rounded" />
      <div className="skeleton h-4 w-72 mb-8 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="skeleton h-40 rounded-xl" />
        <div className="skeleton h-40 rounded-xl" />
      </div>
    </div>
  );
}

export default function Home() {
  const [cmdOpen, setCmdOpen] = useState(false);

  // Global keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K — Command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
        return;
      }

      // Don't trigger shortcuts when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const shortcuts: Record<string, string> = {
        g: 'github',
        p: 'projects',
        c: 'contact',
        h: 'hero',
        e: 'education',
        w: 'experience',
        t: 'techstack',
        s: 'services',
      };

      if (shortcuts[e.key.toLowerCase()] && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = document.getElementById(shortcuts[e.key.toLowerCase()]);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <SmoothScrollProvider>
      <PageLoader />
      <ScrollProgress />
      <Navbar onCommandPalette={() => setCmdOpen(true)} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <RocketScroll />
      <SectionIndicator />
      <KeyboardShortcuts />

      <main>
        <Hero />
        <About />
        <TechMarquee />
        <Services />
        <Education />
        <Experience />
        <TechStack />
        <GitHubShowcase />
        <Projects />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
      <WhatsAppButton />
      <AiChat />
      <AccessibilityWidget />
    </SmoothScrollProvider>
  );
}
