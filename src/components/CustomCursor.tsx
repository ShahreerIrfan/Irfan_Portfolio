'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Check for touch device
    if ('ontouchstart' in window) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    };

    const onMouseEnterInteractive = () => {
      isHovering = true;
      ring.classList.add('cursor-ring-hover');
      dot.classList.add('cursor-dot-hover');
    };

    const onMouseLeaveInteractive = () => {
      isHovering = false;
      ring.classList.remove('cursor-ring-hover');
      dot.classList.remove('cursor-dot-hover');
    };

    // Smooth follow for ring
    let raf: number;
    const animate = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px) scale(${isHovering ? 1.5 : 1})`;
      raf = requestAnimationFrame(animate);
    };

    // Add listeners
    document.addEventListener('mousemove', onMouseMove);
    animate();

    // Interactive element detection
    const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, .glass-card-hover, .magnetic-btn';
    const addHoverListeners = () => {
      document.querySelectorAll(interactiveSelectors).forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterInteractive);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };

    addHoverListeners();
    // Re-attach on DOM changes
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
      (el as HTMLElement).style.cursor = 'none';
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[var(--active-accent)] z-[9999] pointer-events-none mix-blend-normal transition-[width,height] duration-200"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-[var(--active-accent)]/40 z-[9998] pointer-events-none transition-[transform,border-color,opacity] duration-300"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
