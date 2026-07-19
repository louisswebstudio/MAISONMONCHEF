"use client";

import { useCallback, useState } from "react";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { cn } from "@/lib/utils";

export type GalleryImage = { src: string; alt: string };

/**
 * Property image gallery (node 25:33) — a real interactive carousel: a large
 * hero image with prev/next controls and an "X / Y" counter, plus a horizontal
 * thumbnail strip below where the active thumb carries a 2px primary-navy
 * border. Clicking a thumbnail (or an arrow, or ← / → keys) swaps the hero and
 * updates the counter.
 *
 * The image count is driven entirely by the `images` prop (from the property's
 * CMS gallery) — nothing is hard-coded to a fixed number. With a single image
 * the arrows/counter/strip collapse to a plain hero.
 *
 * Controls use the brand's sharp 0px corners; only the counter chip is a small
 * translucent navy pill, matching the PropertyCarousel counter treatment.
 */
export function PropertyGallery({
  images,
  labels,
}: {
  images: GalleryImage[];
  labels: { prev: string; next: string; thumb: string };
}) {
  const total = images.length;
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total),
    [total],
  );

  if (total === 0) return null;
  const active = images[index];

  return (
    <div
      className="flex flex-col gap-[16px]"
      role="group"
      aria-roledescription="carousel"
      onKeyDown={(e) => {
        if (total <= 1) return;
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      {/* Hero image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-linen sm:aspect-[16/9]">
        <FallbackImage
          key={active.src}
          src={active.src}
          alt={active.alt}
          fill
          priority
          sizes="(min-width: 1024px) 780px, 100vw"
          className="object-cover"
        />

        {total > 1 && (
          <>
            <GalleryArrow side="left" label={labels.prev} onClick={() => go(-1)} />
            <GalleryArrow side="right" label={labels.next} onClick={() => go(1)} />
          </>
        )}

        {/* Photo counter (X / Y) */}
        <span
          aria-live="polite"
          className="absolute bottom-[14px] right-[14px] inline-flex items-center bg-navy/85 px-[12px] py-[6px] text-[13px] font-medium leading-none tracking-[-0.2px] text-white backdrop-blur-sm"
        >
          {index + 1}
          <span aria-hidden className="mx-[4px] opacity-60">
            /
          </span>
          {total}
        </span>
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <ul className="flex snap-x gap-[12px] overflow-x-auto pb-[4px]">
          {images.map((img, i) => {
            const activeThumb = i === index;
            return (
              <li key={img.src + i} className="shrink-0 snap-start">
                <button
                  type="button"
                  aria-label={`${labels.thumb} ${i + 1}`}
                  aria-current={activeThumb}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "relative block aspect-[4/3] w-[104px] overflow-hidden bg-linen transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy sm:w-[124px]",
                    activeThumb
                      ? "border-2 border-navy"
                      : "border-2 border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <FallbackImage
                    src={img.src}
                    alt=""
                    fill
                    sizes="124px"
                    className="object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Sharp-cornered carousel arrow — matches PropertyCarousel's NavArrow. */
function GalleryArrow({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-10 flex size-[44px] -translate-y-1/2 items-center justify-center border border-white/50 bg-navy/40 text-white backdrop-blur-sm transition-colors duration-200",
        "hover:border-white hover:bg-navy/70",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        side === "left" ? "left-[14px]" : "right-[14px]",
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
