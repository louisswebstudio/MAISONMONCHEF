"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * "Testimonials" — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node
 * 138:3222 "Testimonial Section"). Authored as a fixed 1440px desktop frame:
 * eyebrow + two-line heading over a row of 525px quote cards that bleeds off
 * both page edges — Figma mocks the loop as a strip of repeated card nodes with
 * negative side insets.
 *
 * Implemented as a continuous CSS marquee, sharing the exact mechanic already
 * proven by the developer ticker (components/sections/Partners.tsx): the card
 * list is rendered as two identical halves and the track is slid left by
 * exactly one half's width (`animate-marquee` = translateX(-50%), globals.css),
 * so half #2 lands precisely where half #1 started and the loop never jumps.
 *
 * Seamlessness detail (same lesson as Partners): the inter-card gap is a
 * *trailing margin per card* (`me-[20px]`), NOT flex `gap`. Flex `gap` omits
 * the space after the last card, which makes the two halves non-periodic and
 * produces a visible hitch at the wrap.
 *
 * Sizing the halves: translateX(-50%) requires each half to be at least as wide
 * as the viewport, or bare background appears at the wrap. Three testimonials
 * at 525+20px is only ~1635px — fine at 1440px, but short on a 1920px+ monitor.
 * Each half therefore repeats the set REPEATS_PER_HALF times (~3270px), which
 * covers displays up to 3270px wide. See DURATION_S for the speed rationale.
 *
 * Figma's background is an image under a 56% white overlay, but the image node
 * exports empty and the visible result is a plain white band — reproduced as
 * `bg-white` (distinct from the ivory page). `#5f5f5f` (role grey) is an exact
 * Figma value with no design token.
 */

type Testimonial = {
  initials: string;
  name: string;
  role: string;
  quote: string;
};

/** Repetitions of the 3-item set per half — see the half-width note above. */
const REPEATS_PER_HALF = 2;

/**
 * Seconds for the track to travel one half's width. Because a half's width
 * scales with the card width (525px desktop / 85vw mobile), a *fixed* duration
 * holds a constant cards-per-second rather than a constant pixels-per-second —
 * which is the right perceptual constant for text you have to read. At 80s a
 * card takes ~13s to cross, on both desktop and mobile, and the resulting
 * ~41px/s desktop scroll matches the logo ticker's cadence so the two marquees
 * on the page read as one system.
 */
const DURATION_S = 80;

export function Testimonials({
  t,
  rtl = false,
}: {
  t: Dictionary["testimonials"];
  rtl?: boolean;
}) {
  const items: Testimonial[] = t.items;
  const [paused, setPaused] = useState(false);
  // Focus is tracked in React, not with CSS variants, because the button lives
  // in the header — *outside* the track's `.group` — so `group-focus-within`
  // can never reach it, and a `focus:not-sr-only` reveal would still leave the
  // pause itself unwired. One state value drives both, in one place.
  const [focused, setFocused] = useState(false);
  const isPaused = paused || focused;

  const half = Array.from({ length: REPEATS_PER_HALF }, () => items).flat();
  const track = [...half, ...half];

  return (
    <section className="w-full border-y border-linen bg-white py-section">
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

          {/* WCAG 2.2.2 (Pause, Stop, Hide): the marquee auto-starts and runs
              indefinitely, so it needs a real mechanism to stop it. Hover-pause
              is pointer-only and prefers-reduced-motion is an OS setting, not a
              page mechanism — neither satisfies 2.2.2 on its own. This control
              is hidden until focused, so it costs the visual design nothing
              while keeping the section operable from the keyboard. */}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-pressed={paused}
            className={cn(
              focused
                ? "mb-[10px] flex h-[44px] items-center justify-center rounded-hairline bg-navy px-[18px] text-[14px] font-medium text-white"
                : "sr-only",
            )}
          >
            {paused ? t.resumeScroll : t.pauseScroll}
          </button>
        </Reveal>
      </div>

      {/* Looping card track — full-bleed, edge to edge, with the edges faded so
          cards enter and leave instead of being sliced off by the viewport.
          Under reduced motion the animation is off, so the track becomes a
          plain horizontal scroller rather than a strip the user can't move.
          `dir="ltr"` is forced here regardless of page language: the track is
          `w-max` (shrink-to-fit) and wider than its `w-full` parent, and a
          shrink-to-fit box like that anchors to its containing block's
          *inline-start* edge — under `dir="rtl"` that's the right edge, so the
          whole 2x-wide track (and the `translateX(0 → -50%)` keyframe built
          for a left-anchored track) sat entirely off-screen to the left and
          no card ever became visible. Forcing ltr here restores the
          left-anchor the keyframe assumes; `rtl` is re-asserted on each
          {@link TestimonialCard} below so the Arabic content inside still
          aligns correctly — only the *positioning* math needs to stay ltr. */}
      <div
        dir="ltr"
        className="group relative mt-[48px] w-full overflow-hidden motion-reduce:overflow-x-auto"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        }}
      >
        {/* Screen readers get the three real testimonials once, in order; the
            visual track is duplicated 4x and aria-hidden, so nothing is
            announced twice. */}
        <ul className="sr-only">
          {items.map((item) => (
            <li key={item.name}>
              {item.quote}. {item.name}, {item.role}.
            </li>
          ))}
        </ul>

        <div
          aria-hidden
          className={cn(
            "flex w-max animate-marquee items-stretch",
            "group-hover:[animation-play-state:paused]",
            "motion-reduce:animate-none",
            // The shared keyframe always travels leftward. In RTL the unseen
            // cards sit off-screen to the *left*, so the track has to travel
            // rightward instead — `reverse` runs the identical keyframe from
            // -50% to 0, which is visually identical on a periodic track.
            rtl && "[animation-direction:reverse]",
          )}
          style={{
            animationDuration: `${DURATION_S}s`,
            ...(isPaused ? { animationPlayState: "paused" as const } : {}),
          }}
        >
          {track.map((item, i) => (
            <TestimonialCard key={`${item.name}-${i}`} item={item} rtl={rtl} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item, rtl }: { item: Testimonial; rtl: boolean }) {
  // `min-h` + `gap`, not a fixed `h-[300px]`: at 300px the quote (5 lines =
  // 150px) plus icon, avatar and padding summed to 304px, so `justify-between`
  // had zero slack to distribute and the profile row sat flush against the
  // quote. The gap is a floor that survives any quote length; justify-between
  // still pins the profile row to the bottom whenever a card is stretched
  // taller by its neighbours (the track is items-stretch).
  //
  // `dir` is re-asserted here (the track above forces `dir="ltr"` on itself
  // for positioning — see that comment) so the quote/avatar/name alignment
  // still reads correctly right-to-left for Arabic.
  return (
    <div
      dir={rtl ? "rtl" : undefined}
      className="me-[20px] flex min-h-[300px] w-[85vw] max-w-[525px] shrink-0 flex-col justify-between gap-[24px] border border-linen bg-white p-[28px] transition-colors duration-300 hover:border-silver-greige"
    >
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
