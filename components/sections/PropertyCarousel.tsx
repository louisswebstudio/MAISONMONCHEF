"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FallbackImage } from "@/components/ui/FallbackImage";
import type { Locale } from "@/lib/i18n/config";
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

/** Auto-advance interval (ms). */
const AUTOPLAY_MS = 5500;

/** Crossfade duration (ms) — must match `--animate-card-dissolve` in globals.css. */
const DISSOLVE_MS = 240;

/**
 * Client carousel for the "Our properties" section. Holds the active slide,
 * the prev/next controls, the "n / total" position counter, and auto-play
 * (paused while the pointer or keyboard focus rests on the carousel, and under
 * prefers-reduced-motion). Presentation matches Figma node 138:2376 — an active
 * card flanked by faded prev/next peek cards.
 */
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
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // The slide currently dissolving away, layered over the incoming one. Set on
  // every change (click or auto-play) and cleared once the crossfade ends, so
  // both paths share one transition. `null` = nothing fading (steady state).
  const [leaving, setLeaving] = useState<number | null>(null);
  const prevIndexRef = useRef(index);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total),
    [total],
  );

  // Auto-play — advance on an interval unless paused (hover/focus) or the user
  // prefers reduced motion. Re-armed whenever the active slide changes so the
  // full interval always follows a manual click.
  useEffect(() => {
    if (paused || total <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, total, index]);

  // Drive the crossfade: when the active slide changes, keep the previous one
  // mounted as a fading overlay for one dissolve, then drop it. Skipped under
  // reduced motion (instant swap). Retriggers cleanly on rapid changes.
  useEffect(() => {
    const from = prevIndexRef.current;
    prevIndexRef.current = index;
    if (from === index) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    setLeaving(from);
    const id = window.setTimeout(() => setLeaving(null), DISSOLVE_MS);
    return () => window.clearTimeout(id);
  }, [index]);

  const active = properties[index];
  const prev = properties[(index - 1 + total) % total];
  const next = properties[(index + 1) % total];

  return (
    <div
      className="relative mt-[58px]"
      role="region"
      aria-roledescription="carousel"
      aria-label={t.eyebrow}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Faded prev/next peek cards behind the active slide (xl+). */}
      <div
        aria-hidden
        className="absolute inset-y-[24px] inset-x-0 z-0 hidden items-stretch justify-between xl:flex"
      >
        <PeekCard side="left" image={prev.image} />
        <PeekCard side="right" image={next.image} />
      </div>

      {/* Active slide. The incoming card is painted at full opacity (so it
          holds the container's size — no layout jump), and the outgoing card is
          overlaid absolutely and dissolved out on top of it, revealing the new
          one. Identical card structure means the overlay lines up exactly. */}
      <div className="relative z-10 mx-auto max-w-[925px]">
        <PropertyCard
          lang={lang}
          dict={dict}
          property={active}
          index={index}
          total={total}
        />
        {leaving !== null && leaving !== index && (
          <div
            key={leaving}
            aria-hidden
            inert
            className="pointer-events-none absolute inset-0 animate-card-dissolve"
          >
            <PropertyCard
              lang={lang}
              dict={dict}
              property={properties[leaving]}
              index={leaving}
              total={total}
            />
          </div>
        )}
      </div>

      {/* Nav arrows */}
      <NavArrow side="left" label={t.prev} onClick={() => go(-1)} disabled={total <= 1} />
      <NavArrow side="right" label={t.next} onClick={() => go(1)} disabled={total <= 1} />
    </div>
  );
}

function PropertyCard({
  lang,
  dict,
  property,
  index,
  total,
}: {
  lang: Locale;
  dict: Dictionary;
  property: FeaturedProperty;
  index: number;
  total: number;
}) {
  const t = dict.properties;

  return (
    <div className="card-surface flex flex-col gap-[10px] p-[10px] lg:flex-row lg:items-stretch">
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
        <span className="absolute left-[18px] top-[18px] inline-flex items-center gap-[6px] bg-warm-taupe px-[14px] py-[6px] text-[14px] font-medium leading-[21.7px] tracking-[-0.42px] text-white shadow-[0px_6px_16px_rgba(0,0,0,0.1)]">
          <span aria-hidden className="size-[5px] rounded-full bg-white/90" />
          {t.forSale}
        </span>
        {/* Position counter (n / total) — bottom-right of the image, matching
            the single-listing gallery counter treatment. */}
        <span
          aria-live="polite"
          className="absolute bottom-[14px] right-[14px] inline-flex items-center bg-navy/85 px-[10px] py-[5px] text-[13px] font-medium leading-none tracking-[-0.2px] text-white backdrop-blur-sm"
        >
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
            {property.price}
          </span>
          <Link
            href={`/${lang}/collection`}
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
        </span>
        <span className="text-[15px] font-normal leading-[23.25px] tracking-[-0.3px] text-charcoal/75">
          {label}
        </span>
      </span>
    </div>
  );
}

/** A faded partial card peeking from behind the active slide (decorative). */
function PeekCard({ side, image }: { side: "left" | "right"; image: string }) {
  return (
    <div className="relative w-[240px] overflow-hidden bg-linen p-[10px] opacity-60">
      <div className="relative h-full w-full overflow-hidden">
        <FallbackImage src={image} alt="" fill sizes="240px" className="object-cover" />
      </div>
      {/* Veil fading toward the active slide. */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-ivory/10 to-ivory",
          side === "right" && "bg-gradient-to-l",
        )}
      />
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
        "absolute top-1/2 z-20 hidden size-[44px] -translate-y-1/2 items-center justify-center border border-navy/25 bg-white/70 text-charcoal backdrop-blur-sm transition-colors duration-200",
        "enabled:hover:border-navy enabled:hover:bg-navy enabled:hover:text-white",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
        "disabled:opacity-40 lg:flex",
        side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2",
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
