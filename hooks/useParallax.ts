import { useEffect, useRef } from 'react';

interface UseParallaxOptions {
  speed?: number;
  maxOffset?: number;
}

export function useParallax<T extends HTMLElement = HTMLDivElement>({
  speed = 0.12,
  maxOffset = 40,
}: UseParallaxOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<T>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId = 0;

    const update = () => {
      rafId = 0;
      const container = containerRef.current;
      const layer = layerRef.current;
      if (!container || !layer) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 800;

      if (rect.bottom < -120 || rect.top > viewportHeight + 120) return;

      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const rawOffset = (viewportCenter - elementCenter) * speed;
      const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));

      layer.style.transform = `translate3d(0, ${clampedOffset.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed, maxOffset]);

  return { containerRef, layerRef };
}
