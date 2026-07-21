"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { getDir, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { LocationPinIcon } from "@/components/ui/amenity-icons";
import {
  AreaIcon,
  BedIcon,
  BathIcon,
  FloorsIcon,
  ParkingIcon,
  BalconiesIcon,
} from "@/components/ui/property-icons";
import {
  type FeaturedProperty,
  type PropertyFeature,
} from "@/lib/featured-property";

const FEATURE_ICONS: Record<PropertyFeature, typeof AreaIcon> = {
  area: AreaIcon,
  bedrooms: BedIcon,
  bathrooms: BathIcon,
  floors: FloorsIcon,
  parking: ParkingIcon,
  balconies: BalconiesIcon,
};

/**
 * "Our properties" carousel. The CARD design is unchanged (Figma node 138:2376
 * — image + details panel in one `card-surface`, status tag, n/total counter);
 * only the transition between listings changed: the old opacity crossfade is
 * replaced with coverflow motion adapted from an Originkit Framer component.
 *
 * The active listing sits centred at full size; its neighbours are the *real*
 * adjacent cards, scaled down and faded at the edges (they replace the former
 * static 240px "peek" strips). Stepping is always a single move and the loop is
 * seamless in both directions.
 *
 * ADAPTATION NOTES (vs. the Framer source):
 *  - `relOf` / `xForRel` / `blendForRel` are ported verbatim.
 *  - Framer-canvas scaffolding is gone: the `RenderTarget` mock, the `isStatic`
 *    export/thumbnail freeze, `@framerSupported*` annotations and the
 *    `COMPONENT_DEFAULTS` property-controls object mean nothing outside the
 *    Framer editor. Sizing comes from the measured stage instead.
 *  - The reference animates each item's `width`/`height` because its items are
 *    bare images. Ours are composed cards, so the size blend is applied as a
 *    `scale` transform instead — animating width would reflow each card's
 *    internal layout (squashing the details panel) every frame. Same visual
 *    result, and it stays on the compositor rather than thrashing layout.
 *  - Corner radius stays 0 (`--radius-card`), so the reference's radius-blend
 *    transform is dropped rather than driven with a constant 0.
 *  - Autoplay is OFF — this section is user-driven — so the rAF driver's
 *    autoplay branch is not ported.
 *
 * One `pos` MotionValue drives every card's position, scale and opacity, so a
 * card grows as it slides toward centre (full size exactly at centre) and
 * shrinks as it slides away. No React state is involved in the animation; the
 * only state is the integer active index, used solely for the screen-reader
 * announcement, which changes at most once per step.
 */

/** Max slats each side (reference constant). */
const RENDER_RANGE = 6;

/**
 * Hard cap on cards per side. The reference derives `R` from the item count
 * alone (`floor(count/2) - 1`), which at 8 listings gives 3. Two is plenty at
 * this card size — the third pair sits entirely outside the container — and it
 * stays duplicate-free down to 5 listings; below that the reference formula
 * takes over and degrades to 1.
 */
const MAX_CARDS_PER_SIDE = 2;

/**
 * Seconds one step takes (the reference's `transition.duration`). The Framer
 * default of 0.3 — and the 0.42 this first shipped with — read as a snap at
 * this card size: a 925px card crossing 850px in under half a second gives the
 * eye nothing to follow. 0.65 lets the card travel and scale visibly without
 * feeling sluggish on repeated clicks (rapid clicks still accumulate, since nav
 * bumps the target rather than the live position).
 */
const MOVE_DUR = 0.65;

/** Scale of a fully off-centre card (the reference's rest/active size ratio). */
const REST_SCALE = 0.8;

/** Opacity of a fully off-centre card — matches the old peek strips' 0.6. */
const REST_OPACITY = 0.55;

/** Design width of the active card (Figma). */
const CARD_MAX_WIDTH = 925;

type Sizing = {
  restWidth: number;
  restHeight: number;
  activeWidth: number;
  activeHeight: number;
};

// --- Ported verbatim from the reference -------------------------------------

// Card `index`'s signed distance from centre at carousel position `pos`,
// wrapped into (-count/2, count/2]. The wrap discontinuity at ±count/2 sits at
// the seam, where opacity is already 0, so the teleport is invisible and the
// loop is seamless and infinite.
function relOf(index: number, pos: number, count: number): number {
  let rel = (((index - pos) % count) + count) % count;
  if (rel > count / 2) rel -= count;
  return rel;
}

// Horizontal offset (px) from centre for a given signed distance `rel`.
// Slot 1 sits a half-active + gap + half-slat out; every further slot adds a
// uniform slat pitch.
function xForRel(rel: number, s: Sizing, gap: number): number {
  const ar = Math.abs(rel);
  const c1 = s.activeWidth / 2 + gap + s.restWidth / 2;
  const pitch = s.restWidth + gap;
  const mag = ar <= 1 ? ar * c1 : c1 + (ar - 1) * pitch;
  return (rel < 0 ? -1 : 1) * mag;
}

// 0 at centre (fully active size) → 1 once a full slot away (rest/slat size).
function blendForRel(rel: number): number {
  return Math.min(Math.abs(rel), 1);
}

// ----------------------------------------------------------------------------

/**
 * One card in the deck — the unchanged {@link PropertyCard} wrapped in the
 * coverflow transforms. Every visual property derives from the shared `pos`
 * MotionValue via useTransform, so the rAF driver moves cards without
 * triggering React re-renders or remounting them.
 */
function DeckCard({
  lang,
  dict,
  property,
  index,
  total,
  pos,
  count,
  R,
  sizing,
  gap,
  cardWidth,
  onSelect,
}: {
  lang: Locale;
  dict: Dictionary;
  property: FeaturedProperty;
  index: number;
  total: number;
  pos: MotionValue<number>;
  count: number;
  R: number;
  sizing: Sizing;
  gap: number;
  cardWidth: number;
  onSelect: (index: number) => void;
}) {
  const x = useTransform(pos, (p: number) =>
    xForRel(relOf(index, p, count), sizing, gap),
  );
  // Size blend applied as scale (see the adaptation note above).
  const scale = useTransform(pos, (p: number) => {
    const a = blendForRel(relOf(index, p, count));
    return 1 + (REST_SCALE - 1) * a;
  });
  const opacity = useTransform(pos, (p: number) => {
    const rel = relOf(index, p, count);
    const ar = Math.abs(rel);
    // Fade out at the render edge so the wrap seam is never visible…
    const edge = ar <= R ? 1 : ar >= R + 1 ? 0 : 1 - (ar - R);
    // …and hold neighbours back from the centred card.
    const near = 1 + (REST_OPACITY - 1) * blendForRel(rel);
    return edge * near;
  });
  const zIndex = useTransform(pos, (p: number) =>
    Math.round(1000 - Math.abs(relOf(index, p, count)) * 100),
  );
  // Only cards inside the visible window take clicks, so a faded-out card can
  // never swallow a pointer over empty stage.
  const pointerEvents = useTransform(pos, (p: number) =>
    Math.abs(relOf(index, p, count)) <= R ? "auto" : "none",
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        x,
        zIndex,
        opacity,
        pointerEvents,
        width: cardWidth,
      }}
    >
      <motion.div style={{ x: "-50%", scale }}>
        <PropertyCard
          lang={lang}
          dict={dict}
          property={property}
          index={index}
          total={total}
          onSelect={() => onSelect(index)}
        />
      </motion.div>
    </motion.div>
  );
}

export function PropertyCarousel({
  lang,
  dict,
  properties,
}: {
  lang: Locale;
  dict: Dictionary;
  properties: FeaturedProperty[];
}) {
  const t = dict.properties;
  const total = properties.length;
  const count = Math.max(1, total);
  const prefersReducedMotion = useReducedMotion();
  // The arrow buttons sit at the deck's physical left/right edges, but which
  // action (prev/next) belongs on which physical side flips under RTL: "prev"
  // stays pinned to the reading-order start (right, in Arabic), "next" to the
  // end (left) — otherwise the controls point backwards for RTL readers.
  const isRtl = getDir(lang) === "rtl";

  // --- Stage measurement --------------------------------------------------
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageWidth, setStageWidth] = useState(CARD_MAX_WIDTH);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setStageWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cardWidth = Math.min(CARD_MAX_WIDTH, stageWidth);
  const gap = stageWidth < 640 ? 8 : 18;
  // Below `lg` the card stacks image-over-panel (see PropertyCard), so the
  // nav arrows can't just centre on the whole wrapper height like they do at
  // `lg` (image+panel side by side, same height). Centre them on the image
  // band only, using its aspect ratio (410/300) against the live card width.
  const mobileArrowCenter = (cardWidth * (300 / 410)) / 2;
  const sizing: Sizing = useMemo(
    () => ({
      activeWidth: cardWidth,
      activeHeight: cardWidth,
      restWidth: cardWidth * REST_SCALE,
      restHeight: cardWidth * REST_SCALE,
    }),
    [cardWidth],
  );

  /**
   * Keep the loop seam OUT of the visible window: cards fade to 0 before the
   * ±count/2 wrap point, so the teleport is never seen. The reference's formula
   * (`floor(count/2) - 1`) is what guarantees no property is ever on screen
   * twice — visible cards are `2R + 1`, and `2(floor(count/2) - 1) + 1 < count`
   * for every count ≥ 3. MAX_CARDS_PER_SIDE only tightens it further, so the
   * duplicate-free guarantee holds at any listing count.
   */
  const R = Math.max(
    1,
    Math.min(RENDER_RANGE, MAX_CARDS_PER_SIDE, Math.floor(count / 2) - 1),
  );

  // --- Single rAF driver (ported; autoplay branch omitted) -----------------
  const pos = useMotionValue(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number | null>(null);
  const reducedRef = useRef(prefersReducedMotion);
  useEffect(() => {
    reducedRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);

  /**
   * Start the rAF loop if it isn't already running. The frame callback is
   * declared inside so it can recurse without the component-scope
   * self-reference the Framer original used, and everything it reads lives in
   * refs or the MotionValue — so `ensureRunning` never needs re-creating and
   * the loop is never torn down mid-flight.
   */
  const ensureRunning = useCallback(() => {
    if (rafRef.current != null) return;
    lastTRef.current = null;

    const frame = (t: number) => {
      const last = lastTRef.current ?? t;
      // Clamp dt so a long pause (backgrounded tab) can't produce a jump.
      const dt = Math.min((t - last) / 1000, 1 / 30);
      lastTRef.current = t;

      const cur = pos.get();
      const diff = targetRef.current - cur;
      // Linear, constant-speed: one slot takes MOVE_DUR seconds. Scale is a
      // function of the same pos, so it grows in lockstep with travel.
      const step = (1 / Math.max(0.08, MOVE_DUR)) * dt;
      const arriving = reducedRef.current || Math.abs(diff) <= step;

      if (arriving) {
        pos.set(targetRef.current);
        // Idle and settled → stop (no per-frame work while at rest).
        rafRef.current = null;
        lastTRef.current = null;
        return;
      }

      pos.set(cur + Math.sign(diff) * step);
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
  }, [pos]);

  // Nav bumps the TARGET (not the live pos), so rapid clicks accumulate and the
  // carousel chases the farthest target smoothly.
  const goNext = useCallback(() => {
    targetRef.current += 1;
    ensureRunning();
  }, [ensureRunning]);
  const goPrev = useCallback(() => {
    targetRef.current -= 1;
    ensureRunning();
  }, [ensureRunning]);
  // Step to a clicked card along the shortest wrapped path from the target.
  const goTo = useCallback(
    (index: number) => {
      const cur = targetRef.current;
      let d = index - cur;
      d = ((d % count) + count) % count;
      if (d > count / 2) d -= count;
      targetRef.current = cur + d;
      ensureRunning();
    },
    [ensureRunning, count],
  );

  // Stop the loop on unmount.
  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  // The ONLY React state driven by the animation, and it exists purely for the
  // screen-reader announcement below — `pos` is continuous, so we subscribe and
  // set state only when the rounded index actually changes (at most once per
  // step, never per frame).
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const wrap = (p: number) => ((Math.round(p) % count) + count) % count;
    return pos.on("change", (p: number) => {
      setActiveIndex((prev) => {
        const next = wrap(p);
        return next === prev ? prev : next;
      });
    });
  }, [pos, count]);

  // --- Keyboard ------------------------------------------------------------
  const isHoveredRef = useRef(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isHoveredRef.current) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const active = properties[activeIndex] ?? properties[0];

  return (
    <div
      className="relative mt-[58px]"
      role="region"
      aria-roledescription="carousel"
      aria-label={t.eyebrow}
      style={{ "--arrow-top": `${mobileArrowCenter}px` } as React.CSSProperties}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onFocusCapture={() => {
        isHoveredRef.current = true;
      }}
      onBlurCapture={() => {
        isHoveredRef.current = false;
      }}
    >
      {/* Stage. `isolate` contains the cards' z-indexes so the arrows (which are
          siblings outside this box) stay on top; `overflow-hidden` clips the
          flanking cards at the container edge. */}
      <div ref={stageRef} className="relative isolate overflow-hidden">
        {/* Height sizer — one card in normal flow, invisible, so the stage keeps
            the card's natural responsive height (which varies with content and
            breakpoint) instead of needing a hard-coded pixel height. */}
        <div aria-hidden className="invisible mx-auto" style={{ width: cardWidth }}>
          <PropertyCard
            lang={lang}
            dict={dict}
            property={properties[0]}
            index={0}
            total={total}
          />
        </div>

        {properties.map((p, i) => (
          <DeckCard
            key={p.id}
            lang={lang}
            dict={dict}
            property={p}
            index={i}
            total={total}
            pos={pos}
            count={count}
            R={R}
            sizing={sizing}
            gap={gap}
            cardWidth={cardWidth}
            onSelect={goTo}
          />
        ))}
      </div>

      {/* Nav arrows — prev/next swap physical sides under RTL (see isRtl above). */}
      <NavArrow side={isRtl ? "right" : "left"} label={t.prev} onClick={goPrev} disabled={total <= 1} />
      <NavArrow side={isRtl ? "left" : "right"} label={t.next} onClick={goNext} disabled={total <= 1} />

      {/* Announce the centred listing; the cards themselves are ordinary
          content, so this only carries the position change. */}
      <span aria-live="polite" className="sr-only">
        {active.title}, {activeIndex + 1} / {total}
      </span>
    </div>
  );
}

function PropertyCard({
  lang,
  dict,
  property,
  index,
  total,
  onSelect,
}: {
  lang: Locale;
  dict: Dictionary;
  property: FeaturedProperty;
  index: number;
  total: number;
  /** Clicking a flanking card promotes it to centre; the centred card no-ops. */
  onSelect?: () => void;
}) {
  const t = dict.properties;

  return (
    <div
      onClick={onSelect}
      className="card-surface flex flex-col gap-[10px] p-[10px] lg:flex-row lg:items-stretch"
    >
      {/* Image — stretches to the info panel's height on lg (matched panels).
          `self-stretch` (not h-full) so the flex row's cross-size gives the
          absolutely-filled image real height instead of collapsing to 0. */}
      <div className="relative aspect-[410/300] w-full overflow-hidden lg:aspect-auto lg:w-[410px] lg:shrink-0 lg:self-stretch">
        <FallbackImage
          key={property.id}
          src={property.image}
          alt={property.title}
          fill
          sizes="(min-width: 1024px) 410px, 100vw"
          className="object-cover"
        />
        {/* Bottom vignette (Figma mask + blur, reproduced as a gradient). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-b from-transparent to-black/50"
        />
        {/* Status tag */}
        <span className="absolute start-[18px] top-[18px] inline-flex items-center gap-[6px] bg-warm-taupe px-[14px] py-[6px] text-[14px] font-medium leading-[21.7px] tracking-[-0.42px] text-white shadow-[0px_6px_16px_rgba(0,0,0,0.1)]">
          <span aria-hidden className="size-[5px] rounded-full bg-white/90" />
          {t.forSale}
        </span>
        {/* Position counter (n / total) — bottom-right of the image, matching
            the single-listing gallery counter treatment. */}
        <span className="absolute bottom-[14px] end-[14px] inline-flex items-center bg-navy/85 px-[10px] py-[5px] text-[13px] font-medium leading-none tracking-[-0.2px] text-white backdrop-blur-sm">
          {index + 1} <span aria-hidden className="mx-[3px] opacity-60">/</span> {total}
        </span>
      </div>

      {/* Details panel — the same top-to-bottom hierarchy as the grid card:
          title → location → specs, then the price + CTA paired at the bottom. */}
      <div className="flex flex-1 flex-col gap-[28px] bg-white px-[24px] pb-[24px] pt-[28px] shadow-[0px_10px_24px_-12px_rgba(18,28,45,0.25)]">
        <div className="flex flex-col gap-[14px]">
          {/* Title */}
          <h3 className="text-[26px] font-semibold leading-[30px] tracking-[-0.4px] text-navy">
            {property.title}
          </h3>

          {/* Location, directly under the title */}
          <span className="flex items-center gap-[6px]">
            <LocationPinIcon width={18} height={18} className="shrink-0 text-navy" />
            <span className="text-[15px] font-medium leading-[23.25px] tracking-[-0.3px] text-[#5f5f5f]">
              {property.location}
            </span>
          </span>

          {/* Specs */}
          <div className="mt-[6px] grid grid-cols-2 gap-x-[24px] gap-y-[6px]">
            {property.features.map((f) => (
              <FeatureChip
                key={f.key}
                icon={FEATURE_ICONS[f.key]}
                value={f.value}
                label={t.features[f.key]}
              />
            ))}
          </div>
        </div>

        {/* Price + CTA — tightly paired as the card's closing move. */}
        <div className="mt-auto flex flex-col gap-[14px]">
          <div className="h-px w-full bg-navy/10" />
          <span className="text-[36px] font-semibold leading-[38px] tracking-[-0.6px] text-navy">
            {property.pricePrefix && (
              <span className="me-[8px] text-[16px] font-normal tracking-normal text-charcoal/70">
                {property.pricePrefix}
              </span>
            )}
            {property.price}
          </span>
          <Link
            href={property.href || `/${lang}/collection`}
            className="inline-flex min-h-[48px] w-full items-center justify-center bg-navy px-4 py-2 text-[15px] font-medium leading-[24.8px] tracking-[-0.32px] text-white transition-colors duration-150 hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            {t.details}
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureChip({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof AreaIcon;
  value: string;
  label: string;
}) {
  // Inline spec (icon + value + label), unboxed — the one shared spec-icon
  // treatment used on listing cards too (no per-icon background tile).
  return (
    <div className="flex items-center gap-[8px] py-[6px] text-navy">
      <Icon width={16} height={16} className="shrink-0" />
      <span className="flex items-center gap-[6px] whitespace-nowrap">
        <span className="text-[15px] font-semibold leading-[23.25px] tracking-[-0.3px] text-navy">
          {value}
        </span>{" "}
        <span className="text-[15px] font-normal leading-[23.25px] tracking-[-0.3px] text-charcoal/75">
          {label}
        </span>
      </span>
    </div>
  );
}

/**
 * Carousel control — minimal, on-brand: sharp corners (0px, per the brand's
 * radius scale), a hairline 1px border, a Charcoal chevron on a transparent
 * fill; on hover it fills navy with a white chevron. Not a browser-default
 * grey square.
 */
function NavArrow({
  side,
  label,
  onClick,
  disabled,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "absolute top-[var(--arrow-top)] z-20 flex size-[40px] -translate-y-1/2 items-center justify-center border border-navy/25 bg-white/80 text-charcoal shadow-[0px_4px_12px_rgba(18,28,45,0.15)] backdrop-blur-sm transition-colors duration-200 lg:top-1/2 lg:size-[44px] lg:bg-white/70 lg:shadow-none",
        "enabled:hover:border-navy enabled:hover:bg-navy enabled:hover:text-white",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
        "disabled:opacity-40",
        side === "left"
          ? "left-[10px] lg:left-0 lg:-translate-x-1/2"
          : "right-[10px] lg:right-0 lg:translate-x-1/2",
      )}
    >
      <svg width="18" height="18" viewBox="0 0 11 11" fill="none" aria-hidden="true">
        <path
          d={
            side === "left"
              ? "M8.70833 5.5H2.29167M5.5 8.70833L2.29167 5.5L5.5 2.29167"
              : "M2.29167 5.5H8.70833M5.5 8.70833L8.70833 5.5L5.5 2.29167"
          }
          stroke="currentColor"
          strokeWidth="0.916667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
