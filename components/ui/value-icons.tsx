import type { SVGProps } from "react";

/**
 * Card marks for the About page "Our Value" section — compass, location pin,
 * trend line and padlock. Custom thin-line glyphs on a 32×32 viewBox, matching
 * the stroke weight/style used by the process and "stand for" icon sets
 * elsewhere on the site (these replace the Figma template's stock glyphs,
 * which were leftovers from an unrelated app and didn't match the final
 * copy — see OurValue.tsx).
 *
 * `currentColor` on the stroke lets the caller set the colour (navy on the
 * paper card).
 */

type IconProps = SVGProps<SVGSVGElement>;

function ValueSvg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      width="32"
      height="32"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Compass — Considered Positioning. */
export function PositioningIcon(props: IconProps) {
  return (
    <ValueSvg {...props}>
      <circle cx="16" cy="16" r="13" />
      <path d="M20.5 11.5L17.5 17.5L11.5 20.5L14.5 14.5L20.5 11.5Z" />
      <circle cx="16" cy="16" r="1.25" fill="currentColor" stroke="none" />
    </ValueSvg>
  );
}

/** Location pin — A Central Address. */
export function CentralAddressIcon(props: IconProps) {
  return (
    <ValueSvg {...props}>
      <path d="M16 29C16 29 6 19.7 6 13C6 7.477 10.477 3 16 3C21.523 3 26 7.477 26 13C26 19.7 16 29 16 29Z" />
      <circle cx="16" cy="13" r="3.5" />
    </ValueSvg>
  );
}

/** Trend line — Direct Market Access. */
export function MarketAccessIcon(props: IconProps) {
  return (
    <ValueSvg {...props}>
      <path d="M5 25L12 17L17 21L27 9" />
      <path d="M20 9H27V16" />
    </ValueSvg>
  );
}

/** Padlock — Discretion, Always. */
export function DiscretionIcon(props: IconProps) {
  return (
    <ValueSvg {...props}>
      <rect x="7" y="14" width="18" height="14" rx="2" />
      <path d="M11 14V10a5 5 0 0 1 10 0v4" />
      <circle cx="16" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <path d="M16 21.5V24" />
    </ValueSvg>
  );
}
