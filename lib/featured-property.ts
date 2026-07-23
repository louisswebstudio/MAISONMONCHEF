/**
 * The featured properties shown in the "Our properties" carousel — cloned from
 * Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node 138:2376 "Section - Properties").
 * See components/sections/Properties.tsx.
 *
 * PLACEHOLDER CONTENT (see CLAUDE.md): the Figma frame shows a single mock
 * listing ("The Grove Residence", a non-Dubai stock photo) with the prev/next
 * cards as faded duplicates. Real featured properties will come from the
 * `listing` Sanity documents; this file reproduces the carousel with a small
 * set of placeholder cards until that query is wired in. A few slides (rather
 * than one) so the carousel controls, position counter and auto-play have
 * something real to cycle through. Feature VALUES are as authored in Figma;
 * only the labels are translated (via the dictionary). Locations are real
 * Dubai areas (LISTING_LOCATIONS); images are the two local placeholder photos.
 */
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { FeaturedCarouselListing } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { formatPriceAmount, formatRange } from "@/lib/listing-format";

export type PropertyFeature = "area" | "bedrooms" | "bathrooms" | "floors" | "parking" | "balconies";

export type FeaturedProperty = {
  id: string;
  title: string;
  /** Real Dubai area label (proper noun — not translated per-locale). */
  location: string;
  /** Pre-formatted price amount incl. currency, e.g. "AED 3,650,000". */
  price: string;
  /** Optional de-emphasized prefix (e.g. "From") shown small/regular before the price. */
  pricePrefix?: string;
  image: string;
  /** Feature key → value string, in display order. */
  features: { key: PropertyFeature; value: string }[];
  /** Locale-prefixed deep link to this property's Collection detail page. */
  href: string;
};

/** Local placeholder used until real gallery media is uploaded to the CMS. */
const PLACEHOLDER_IMAGE = "/brand/listings/property-placeholder.jpg";

/**
 * Map a Sanity {@link FeaturedCarouselListing} to the {@link FeaturedProperty}
 * the coverflow spotlight renders. Mirrors `collectionListingToCardData` so the
 * home spotlight and the Collection grid format price, location and image
 * identically.
 *
 * Specs are emitted ONLY where the CMS actually holds a value, in the Figma
 * display order. Two chips from the design — "Parking lots" and "Balconies" —
 * have no field on the `listing` schema at all (they exist only as amenity
 * references, i.e. presence not counts), so they are omitted rather than
 * fabricated: the panel renders 4 real specs instead of 6, two of them invented.
 * Add `parking` / `balconies` number fields to the schema and they will appear
 * here automatically with no change to this mapper's callers.
 */
export function listingToFeaturedProperty(
  listing: FeaturedCarouselListing,
  lang: Locale,
  dict: Dictionary,
): FeaturedProperty {
  // Area + region names come from the `area` taxonomy in Sanity (proper nouns,
  // not translated), and the region replaces the formerly hardcoded ", Dubai".
  const locationLabel = listing.region
    ? `${listing.location}, ${listing.region}`
    : listing.location;

  // Project spotlight specs: size and bedroom RANGES across the project's unit
  // types, plus project-level floors. Bathrooms are per-unit (shown in the
  // detail page's Unit Types table), so they're not a project-level chip here.
  const features: { key: PropertyFeature; value: string }[] = [];
  const areaRange = formatRange(listing.minSize, listing.maxSize);
  if (areaRange != null) features.push({ key: "area", value: areaRange });
  const bedsRange = formatRange(listing.minBeds, listing.maxBeds);
  if (bedsRange != null) features.push({ key: "bedrooms", value: bedsRange });
  if (listing.floors != null)
    features.push({ key: "floors", value: String(listing.floors).padStart(2, "0") });

  return {
    id: listing._id,
    title: listing.name,
    location: locationLabel,
    price: formatPriceAmount(listing.startingPrice),
    pricePrefix: dict.listings.priceFrom,
    image: listing.image
      ? urlForImage(listing.image).width(1200).url()
      : PLACEHOLDER_IMAGE,
    features,
    href: `/${lang}/collection/${listing.slug}`,
  };
}

// Three visually-distinct placeholder property photos, one per slide, so the
// carousel's crossfade is actually visible while advancing (the earlier single
// stock house repeated across slides made the transition impossible to see).
// Stand-ins until real gallery images are uploaded to the `listing` documents.
const IMG_GROVE = "/brand/properties/listing-modern-villa.jpg";
const IMG_SUNDIAL = "/brand/properties/listing-glass-house.jpg";
const IMG_MARINA = "/brand/properties/listing-waterfront.jpg";

// `href` is intentionally empty on every placeholder: these ids are invented,
// not real `listing` slugs, so a detail-route link would 404. The carousel
// falls back to `/${lang}/collection` when href is blank.
export const FEATURED_PROPERTIES: FeaturedProperty[] = [
  {
    id: "the-grove-residence",
    href: "",
    title: "The Grove Residence",
    location: "Dubai Hills",
    price: "AED 950,000",
    pricePrefix: "From",
    image: IMG_GROVE,
    features: [
      { key: "area", value: "1,700–2,400" },
      { key: "bedrooms", value: "2–4" },
      { key: "floors", value: "03" },
    ],
  },
  {
    id: "the-sundial-residence",
    href: "",
    title: "The Sundial Residence",
    location: "Palm Jumeirah",
    price: "AED 3,650,000",
    pricePrefix: "From",
    image: IMG_SUNDIAL,
    features: [
      { key: "area", value: "2,150–3,100" },
      { key: "bedrooms", value: "3–5" },
      { key: "floors", value: "02" },
    ],
  },
  {
    id: "the-marina-residence",
    href: "",
    title: "The Marina Residence",
    location: "Downtown Dubai",
    price: "AED 1,480,000",
    pricePrefix: "From",
    image: IMG_MARINA,
    features: [
      { key: "area", value: "1,400–1,900" },
      { key: "bedrooms", value: "1–3" },
      { key: "floors", value: "01" },
    ],
  },
];
