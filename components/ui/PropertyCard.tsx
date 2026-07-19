import Link from "next/link";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { LocationPinIcon } from "@/components/ui/amenity-icons";
import { BedIcon, BathIcon, AreaIcon } from "@/components/ui/property-icons";

/**
 * PropertyCard — the ONE shared listing card for the whole site (home
 * "Homes Selected for you" grid, the Collection grid, and the property page's
 * "You May Also Consider" row). Before this component the card markup was
 * copy-pasted into FeaturedListings.tsx and CollectionExplorer.tsx and had
 * already started to drift (different price weight, different image ratio); this
 * is the single source of truth so that can't happen again (brief requirement).
 *
 * Deliberately PRESENTATIONAL and data-source-agnostic: callers pass a plain
 * {@link PropertyCardData} (already localized / pre-formatted) plus the three
 * unit labels from the dictionary. No Sanity / i18n coupling lives here, so it
 * renders identically whether the data came from the CMS or a placeholder file.
 *
 * Card corners stay sharp (0px) per the brand radius scale; only buttons/inputs
 * get the 2px `rounded-hairline`. `#5f5f5f` (location + body grey) is the exact
 * Figma value used across every card — confirmed as our secondary text grey.
 */
export type PropertyCardData = {
  /** Where the card links (already locale-prefixed by the caller). */
  href: string;
  /** Image URL (Sanity CDN url or a local placeholder). */
  image: string;
  imageAlt?: string;
  /** Location label, e.g. "Business Bay, Dubai". */
  location: string;
  /** Pre-formatted price incl. currency, e.g. "AED 3,650,000". */
  price: string;
  title: string;
  description?: string;
  beds?: number | string;
  baths?: number | string;
  /** Living space in sq ft (number is locale-formatted by the caller). */
  area?: number | string;
};

/**
 * Copy the card carries no hard-coded version of: the three unit labels, the
 * "For sale" status badge, and the CTA button text — all from `dict.listings`.
 */
export type PropertyCardLabels = {
  beds: string;
  baths: string;
  area: string;
  forSale: string;
  cta: string;
};

export function PropertyCard({
  data,
  labels,
}: {
  data: PropertyCardData;
  labels: PropertyCardLabels;
}) {
  const alt = data.imageAlt ?? `${data.title}, ${data.location}`;

  return (
    <Link
      href={data.href}
      aria-label={`${data.title}, ${data.location}`}
      className="card-surface card-interactive group flex h-full flex-col p-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
    >
      {/* 1 — Image, carrying the "For sale" taupe status badge top-left. */}
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <FallbackImage
          src={data.image}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute left-[14px] top-[14px] inline-flex items-center gap-[6px] bg-warm-taupe px-[12px] py-[5px] text-[13px] font-medium leading-[20px] tracking-[-0.3px] text-white shadow-[0px_6px_16px_rgba(0,0,0,0.1)]">
          <span aria-hidden className="size-[5px] rounded-full bg-white/90" />
          {labels.forSale}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-[12px] p-[14px]">
        {/* 2 — Title */}
        <h3 className="text-[19px] font-semibold leading-[26px] text-navy">
          {data.title}
        </h3>

        {/* 3 — Location, directly under the title */}
        <span className="flex min-w-0 items-center gap-[6px] text-[#5f5f5f]">
          <LocationPinIcon className="shrink-0" />
          <span className="truncate text-[14px] font-normal">{data.location}</span>
        </span>

        {/* 4 — Specs row */}
        <div className="flex flex-wrap items-center gap-x-[18px] gap-y-[4px]">
          {data.beds != null && (
            <Spec icon={<BedIcon width={16} height={16} />} value={data.beds} label={labels.beds} />
          )}
          {data.baths != null && (
            <Spec icon={<BathIcon width={16} height={16} />} value={data.baths} label={labels.baths} />
          )}
          {data.area != null && (
            <Spec icon={<AreaIcon width={16} height={16} />} value={data.area} label={labels.area} />
          )}
        </div>

        {/* 5 + 6 — Price and CTA, tightly paired as the card's closing move.
            The card is itself the link, so the CTA is a visual button (span),
            not a nested anchor. */}
        <div className="mt-auto flex flex-col gap-[10px] pt-[14px]">
          <div className="h-px w-full bg-navy/10" />
          <span className="text-[24px] font-semibold leading-[30px] tracking-[-0.4px] text-navy">
            {data.price}
          </span>
          <span className="inline-flex min-h-[44px] w-full items-center justify-center bg-navy px-4 py-2 text-[15px] font-medium leading-[24.8px] tracking-[-0.32px] text-white transition-colors duration-150 group-hover:bg-charcoal">
            {labels.cta}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Spec({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-[6px] text-navy">
      <span className="shrink-0">{icon}</span>
      <span className="flex items-center gap-[4px] whitespace-nowrap">
        <span className="text-[14px] font-semibold leading-[19.2px]">{value}</span>
        <span className="text-[12.5px] font-normal leading-[19.2px] text-charcoal/70">{label}</span>
      </span>
    </div>
  );
}
