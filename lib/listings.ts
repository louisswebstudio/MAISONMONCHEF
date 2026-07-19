/**
 * Single source of truth for Collection filter taxonomies. Both the Sanity
 * `listing` schema and the (future) Collection filter UI import from here so
 * the filters can never drift out of sync.
 *
 * SALES ONLY — there is deliberately no "rental"/"lease" status anywhere
 * (CLAUDE.md §1). Do not add one.
 */

export const LISTING_STATUSES = [
  { value: "sales", label: "Residential Sales" },
  { value: "off-plan", label: "Off-Plan" },
  { value: "secondary", label: "Secondary Market" },
] as const;

/**
 * Property-type categories. NOTE: the exact category set was not locked in the
 * brief — this is a sensible starting taxonomy; confirm with the client before
 * launch. (Status + Location + Price are confirmed filters; CLAUDE.md §3.)
 */
export const LISTING_CATEGORIES = [
  { value: "apartment", label: "Apartment" },
  { value: "penthouse", label: "Penthouse" },
  { value: "villa", label: "Villa" },
  { value: "townhouse", label: "Townhouse" },
] as const;

/**
 * Real Dubai areas in active use (CLAUDE.md §6). NEVER add US placeholder
 * locations (Illinois, Texas, Miami, etc.) — those are template leftovers that
 * have been removed repeatedly.
 */
export const LISTING_LOCATIONS = [
  { value: "business-bay", label: "Business Bay" },
  { value: "palm-jumeirah", label: "Palm Jumeirah" },
  { value: "downtown-dubai", label: "Downtown Dubai" },
  { value: "dubai-marina", label: "Dubai Marina" },
  { value: "arjan", label: "Arjan" },
  { value: "dubai-hills", label: "Dubai Hills" },
] as const;

/**
 * Price bands for the Collection filter (AED) — from the Figma filter panel
 * (node 66:627). `min` inclusive, `max` exclusive; `max: null` = open-ended.
 */
export const LISTING_PRICE_RANGES = [
  { value: "under-1m", label: "Under AED 1M", min: 0, max: 1_000_000 },
  { value: "1m-5m", label: "AED 1M - 5M", min: 1_000_000, max: 5_000_000 },
  { value: "5m-15m", label: "AED 5M - 15M", min: 5_000_000, max: 15_000_000 },
  { value: "15m-plus", label: "AED 15M+", min: 15_000_000, max: null },
] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number]["value"];
export type ListingCategory = (typeof LISTING_CATEGORIES)[number]["value"];
export type ListingLocation = (typeof LISTING_LOCATIONS)[number]["value"];
export type ListingPriceRange = (typeof LISTING_PRICE_RANGES)[number]["value"];
