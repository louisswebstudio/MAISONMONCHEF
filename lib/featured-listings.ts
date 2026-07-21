import { LISTING_LOCATIONS } from "./listings";

/**
 * "Homes Selected for you" cards — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn,
 * node 138:1831 "Listing Section"). See components/sections/FeaturedListings.tsx.
 *
 * PLACEHOLDER CONTENT (see CLAUDE.md): in Figma every card shows the SAME
 * title / price / description / specs and one stock (non-Dubai) house photo —
 * only the location label changes across the six cards. That is mock data, not
 * real inventory. Real featured listings will come from the `listing` Sanity
 * documents; this file just reproduces the six-card layout faithfully until
 * that query is wired in.
 *
 * The six locations are sourced from LISTING_LOCATIONS (lib/listings.ts) — the
 * confirmed real Dubai areas — so this section can never drift from the
 * Collection filter taxonomy or reintroduce US placeholder locations.
 */
export type FeaturedListing = {
  id: string;
  /** Real Dubai area label (proper noun — not translated per-locale). */
  location: string;
  /** Pre-formatted price string incl. currency, as authored in Figma. */
  price: string;
  title: string;
  description: string;
  beds: number;
  baths: number;
  /** Floor area in square feet. */
  area: number;
  image: string;
};

/** The repeated placeholder card content (identical for all six in Figma). */
const PLACEHOLDER = {
  price: "AED 3,650,000",
  title: "The Sundial Residence",
  description:
    "A residence chosen for what it represents: precision, discretion, and lasting value.",
  beds: 3,
  baths: 3,
  area: 2150,
  image: "/brand/listings/property-placeholder.jpg",
} as const;

export const FEATURED_LISTINGS: FeaturedListing[] = LISTING_LOCATIONS.map(
  (loc) => ({
    id: loc.value,
    location: loc.label,
    ...PLACEHOLDER,
  }),
);
