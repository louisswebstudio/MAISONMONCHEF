/**
 * Shared formatting for the project-level listing model (unit types → a starting
 * price + bedroom/size ranges). One source of truth so the Collection grid, the
 * home carousel/grid and the detail page all render "From AED X" and ranges
 * identically. All inputs are the computed values from the GROQ card fields
 * (see CARD_COMPUTED_FIELDS in sanity/lib/queries.ts).
 */

/** En-dash range separator (U+2013), correct for numeric ranges in LTR and RTL. */
const RANGE_DASH = "–";

/**
 * The price amount alone, e.g. "AED 1,570,000". The de-emphasized "From" prefix
 * is carried SEPARATELY (PropertyCardData.pricePrefix / FeaturedProperty.
 * pricePrefix) so each component can style the prefix smaller/regular against
 * the bold amount — never bake the two into one string.
 */
export function formatPriceAmount(price: number): string {
  return `AED ${price.toLocaleString("en-US")}`;
}

/**
 * A numeric range as a display string: a single value when min === max (or max
 * is absent), otherwise "min–max". Returns undefined when there is nothing to
 * show, so callers can omit the field entirely.
 */
export function formatRange(min?: number, max?: number): string | undefined {
  if (min == null && max == null) return undefined;
  const lo = min ?? max!;
  const hi = max ?? min!;
  if (lo === hi) return lo.toLocaleString("en-US");
  return `${lo.toLocaleString("en-US")}${RANGE_DASH}${hi.toLocaleString("en-US")}`;
}
