"use client";

import { useEffect, useRef } from "react";

/**
 * Animates a stat like "99%" / "12+" counting up from 0 the first time it
 * scrolls into view. Mirrors Reveal's progressive-enhancement pattern: the
 * final value is what's in the markup (correct with no JS / on bots), and JS
 * only rewrites it to "0" + the trailing suffix right before animating so
 * there's no flash of the full number pre-animation. Skips entirely for
 * prefers-reduced-motion or for values already on screen at mount.
 */
export function CountUp({
  value,
  className,
  duration = 1400,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const match = value.match(/^(\d+)(.*)$/);
    if (!match) return;
    const target = Number(match[1]);
    const suffix = match[2];

    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.textContent = `0${suffix}`;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
