"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * "Testimonials" — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node
 * 138:3222 "Testimonial Section"). Authored as a fixed 1440px desktop frame:
 * eyebrow + two-line heading with prev/next controls at the right, over a row
 * of 525px quote cards that bleeds off both page edges — Figma mocks the loop
 * as a strip of repeated card nodes with negative side insets.
 *
 * Implemented as a real infinite-loop carousel (per the user's request): the
 * three testimonials are tripled into one track, the transform steps one card
 * at a time (auto-advancing, paused on hover, skipped under reduced motion),
 * and the index silently re-centres after each transition so prev/next wrap
 * forever in both directions. RTL flips the step direction.
 *
 * Figma's background is an image under a 56% white overlay, but the image node
 * exports empty and the visible result is a plain white band — reproduced as
 * `bg-white` (distinct from the ivory page). `#e6e6e6` (card border) and
 * `#5f5f5f` (role grey) are exact Figma values with no design token.
 */

type Testimonial = {
  initials: string;
  name: string;
  role: string;
  quote: string;
};

const GAP_PX = 20;
const AUTO_ADVANCE_MS = 5000;
const SLIDE_MS = 700;

export function Testimonials({
  t,
  rtl = false,
}: {
  t: Dictionary["testimonials"];
  rtl?: boolean;
}) {
  const items: Testimonial[] = t.items;
  const n = items.length;
  // Three copies so there is always a full viewport of cards on either side
  // of the visible window, whichever way the user steps.
  const track = [...items, ...items, ...items];

  const [index, setIndex] = useState(n);
  const [animate, setAnimate] = useState(true);
  const [step, setStep] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);

  // One step = card width + gap, re-measured on resize (cards are fluid
  // below the fixed 525px of the desktop frame).
  useEffect(() => {
    const measure = () => {
      const first = trackRef.current?.children[0] as HTMLElement | undefined;
      if (first) setStep(first.offsetWidth + GAP_PX);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // After sliding into an outer copy, jump back to the middle copy without a
  // transition — the identical neighbours make the jump invisible. Timer-based
  // rather than `transitionend`: throttled/background tabs can skip the
  // transition entirely, and the wrap must still happen or the index runs off
  // the end of the track.
  useEffect(() => {
    if (index >= n && index < 2 * n) return;
    const id = setTimeout(() => {
      setAnimate(false);
      setIndex((i) => (i >= 2 * n ? i - n : i < n ? i + n : i));
    }, SLIDE_MS + 50);
    return () => clearTimeout(id);
  }, [index, n]);

  useEffect(() => {
    if (animate) return;
    // Two frames so the un-animated reposition paints before re-enabling.
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [animate]);

  // Auto-advance the loop; hover pauses it, reduced-motion disables it.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!hovering.current) setIndex((i) => i + 1);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  const offset = step * index * (rtl ? 1 : -1);

  return (
    <section className="w-full overflow-hidden border-y border-linen bg-white py-section">
      {/* Header — mirrors Container's margins (px-6 md:px-page) without using
          it so the card track below can bleed full-width. */}
      <div className="mx-auto w-full max-w-content px-6 md:px-page">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[6px]">
              <span
                aria-hidden
                className="flex items-center justify-center rounded-hairline border border-navy p-[3px]"
              >
                <span className="size-[6px] bg-warm-taupe" />
              </span>
              <span className="text-[12px] font-semibold uppercase leading-[21px] tracking-[0.18em] text-navy">
                {t.eyebrow}
              </span>
            </div>
            <h2 className="max-w-[800px] font-display text-[38px] font-semibold leading-[1.08] text-navy sm:text-[54px]">
              {t.heading}
            </h2>
          </div>

          <div className="flex items-center gap-[10px] pb-[10px]">
            <ArrowButton
              label={t.prev}
              direction="prev"
              rtl={rtl}
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            />
            <ArrowButton
              label={t.next}
              direction="next"
              rtl={rtl}
              onClick={() => setIndex((i) => Math.min(i + 1, 3 * n - 1))}
            />
          </div>
        </Reveal>
      </div>

      {/* Looping card track — full-bleed, edge to edge. */}
      <div
        className="mt-[48px] w-full"
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => (hovering.current = false)}
      >
        {/* Screen-reader list: each quote once, in order — the animated track
            below is aria-hidden so cloned cards aren't announced. */}
        <ul className="sr-only">
          {items.map((item) => (
            <li key={item.name}>
              {item.quote} — {item.name}, {item.role}
            </li>
          ))}
        </ul>

        <div
          ref={trackRef}
          aria-hidden
          className={cn(
            "flex w-max gap-[20px]",
            animate && "transition-transform duration-700 ease-in-out",
          )}
          style={{ transform: `translateX(${offset}px)` }}
        >
          {track.map((item, i) => (
            <TestimonialCard key={`${item.name}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="card-surface flex h-[300px] w-[85vw] max-w-[525px] shrink-0 flex-col justify-between p-[28px] transition-colors duration-300 hover:border-silver-greige">
      <div className="flex flex-col items-start gap-[20px]">
        <QuoteIcon />
        <p className="max-w-[420px] font-display text-[20px] font-medium italic leading-[1.5] text-navy">
          {item.quote}
        </p>
      </div>

      <div className="flex items-center gap-[16px]">
        <span className="flex size-[50px] shrink-0 items-center justify-center bg-charcoal text-[16px] font-semibold text-white">
          {item.initials}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-[18px] font-medium leading-[25.2px] text-navy">
            {item.name}
          </span>
          <span className="truncate text-[16px] font-normal leading-[24px] tracking-[0.3px] text-[#5f5f5f]">
            {item.role}
          </span>
        </span>
      </div>
    </div>
  );
}

/** Opening double-quote mark (node 138:3275) — Figma draws the glyph rotated
 *  180°; the rotation is applied here so the path stays 1:1 with the file. */
function QuoteIcon() {
  return (
    <svg
      width="28"
      height="22"
      viewBox="0 0 28 22"
      fill="none"
      aria-hidden="true"
      className="my-[3px] rotate-180"
    >
      <path
        d="M16.782 16.9476L19.1935 22C25.8028 18.9497 27.9102 15.2913 27.9102 11.1282V1.13785e-07H16.782V11.1282H22.3461C22.3461 12.8282 20.9968 15.0032 16.782 16.9476ZM0.0897843 16.9476L2.50122 22C9.11155 18.9497 11.218 15.2913 11.218 11.1282V1.13785e-07H0.0897843V11.1282H5.65387C5.65387 12.8282 4.30458 15.0032 0.0897843 16.9476Z"
        fill="currentColor"
        className="text-warm-taupe"
      />
    </svg>
  );
}

/** 32px navy square control (nodes 138:3227 / 138:3232). Arrows point along
 *  the reading direction, so RTL swaps the glyphs, not the semantics. */
function ArrowButton({
  label,
  direction,
  rtl,
  onClick,
}: {
  label: string;
  direction: "prev" | "next";
  rtl: boolean;
  onClick: () => void;
}) {
  const pointsLeft = (direction === "prev") !== rtl;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-[44px] items-center justify-center rounded-hairline bg-navy text-white shadow-[0px_8px_18px_-8px_rgba(18,28,45,0.55)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy active:translate-y-0"
    >
      <svg width="18" height="18" viewBox="0 0 11 11" fill="none" aria-hidden="true">
        <path
          d={
            pointsLeft
              ? "M8.70833 5.5H2.29167M5.5 8.70833L2.29167 5.5L5.5 2.29167"
              : "M2.29167 5.5H8.70833M5.5 8.70833L8.70833 5.5L5.5 2.29167"
          }
          stroke="white"
          strokeWidth="0.916667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
