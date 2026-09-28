"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  /** Extra class names forwarded to the wrapper div */
  className?: string;
}

/**
 * Lightweight scroll-reveal wrapper using IntersectionObserver.
 * Adds `.reveal-visible` when the element enters the viewport (once).
 * Respects `prefers-reduced-motion: reduce` — skips animation entirely.
 */
export function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip animation for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("reveal-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`.trim()}>
      {children}
    </div>
  );
}
