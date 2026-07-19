/**
 * Amenity icons for the property page's "Features & Amenities" tiles.
 *
 * These are the REAL icon assets exported from Figma node 142:1975 — one SVG per
 * amenity, committed under `public/brand/amenities/<slug>.svg` (32×32, single
 * filled path). Each maps 1:1 to an entry in the locked 12-item taxonomy; no
 * icon is reused across amenities and none are hand-drawn substitutes.
 *
 * Rendered via CSS `mask-image` with `background-color: currentColor` rather
 * than an <img>, so the mark takes the colour of its container (white on the
 * gold #8a795b tile today; adapts automatically if reused on a light surface).
 * The source SVGs are filled white, but a mask uses only the shape's alpha, so
 * the fill colour is irrelevant.
 *
 * `<AmenityIcon>` resolves the asset by the CMS `icon` slug first, then by the
 * amenity's English name, so either can drive it. Unknown values render nothing
 * (an empty tile) rather than a wrong icon.
 */

const BASE = "/brand/amenities";

/** Normalised token (lowercase, alphanumerics only) → committed file slug. */
const FILE: Record<string, string> = {
  // Private Pool
  privatepool: "private-pool", pool: "private-pool", swimmingpool: "private-pool",
  // Gym
  gym: "gym", gymindooroutdoor: "gym", fitness: "gym", fitnesscenter: "gym", dumbbell: "gym",
  // Smart Home System
  smarthomesystem: "smart-home-system", smarthome: "smart-home-system",
  // Covered Parking
  coveredparking: "covered-parking", parking: "covered-parking", garage: "covered-parking",
  // 24/7 Security
  "247security": "24-7-security", security: "24-7-security", shield: "24-7-security",
  // Concierge Service
  conciergeservice: "concierge-service", concierge: "concierge-service",
  // Floor-to-Ceiling Windows
  floortoceilingwindows: "floor-to-ceiling-windows", windows: "floor-to-ceiling-windows", window: "floor-to-ceiling-windows",
  // Spa / Jacuzzi
  spajacuzzi: "spa-jacuzzi", spa: "spa-jacuzzi", jacuzzi: "spa-jacuzzi", sauna: "spa-jacuzzi",
  // Private Garden / Terrace
  privategardenterrace: "private-garden-terrace", garden: "private-garden-terrace", terrace: "private-garden-terrace",
  // Kids Play Area
  kidsplayarea: "kids-play-area", kids: "kids-play-area", playground: "kids-play-area", playarea: "kids-play-area",
  // BBQ Area
  bbqarea: "bbq-area", bbq: "bbq-area", barbecue: "bbq-area", grill: "bbq-area",
  // Premium View
  premiumview: "premium-view", view: "premium-view",
};

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Render the real Figma icon for an amenity. Resolves by CMS `icon` slug, then
 * by `name`; returns null (empty tile) if neither matches a committed asset.
 */
export function AmenityIcon({
  icon,
  name,
  size = 32,
  className,
}: {
  icon?: string;
  name?: string;
  size?: number;
  className?: string;
}) {
  const slug =
    (icon && FILE[normalize(icon)]) ||
    (name && FILE[normalize(name)]) ||
    null;
  if (!slug) return null;

  const url = `url("${BASE}/${slug}.svg")`;
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: "currentColor",
        maskImage: url,
        WebkitMaskImage: url,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
