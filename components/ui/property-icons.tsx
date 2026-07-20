import type { SVGProps } from "react";

/**
 * Property feature marks used on the featured-property card — area, bedrooms,
 * bathrooms, floors, parking and balconies. Paths are lifted 1:1 from Figma
 * (file r2XTjIJ5uaZ0VFCG2kfCdn, node 138:2675 "Section - Properties") on their
 * native 14×14 viewBox.
 *
 * Kept SEPARATE from amenity-icons.tsx (the 18×18 listing-card set): these are
 * the finer stroke marks the Properties section uses, and the final iconography
 * will come from the one library the client is sourcing (CLAUDE.md §6). Figma
 * paints them with a navy fill + stroke; `currentColor` on both lets the caller
 * set the colour (navy in the chip).
 */

type IconProps = SVGProps<SVGSVGElement>;

function FeatureSvg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      width="14"
      height="14"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Area (node 138:2718). */
export function AreaIcon(props: IconProps) {
  return (
    <FeatureSvg {...props}>
      <path d="M10.0625 4.375C10.0625 7.4375 7 9.1875 7 9.1875C7 9.1875 3.9375 7.4375 3.9375 4.375C3.9375 2.68392 5.30892 1.3125 7 1.3125C8.69108 1.3125 10.0625 2.68392 10.0625 4.375Z" fill="currentColor" />
      <path d="M6.125 4.375C6.125 3.892 6.517 3.5 7 3.5C7.483 3.5 7.875 3.892 7.875 4.375C7.875 4.858 7.483 5.25 7 5.25C6.517 5.25 6.125 4.858 6.125 4.375Z" fill="currentColor" />
      <path d="M10.0625 4.375C10.0625 7.4375 7 9.1875 7 9.1875C7 9.1875 3.9375 7.4375 3.9375 4.375C3.9375 2.68392 5.30892 1.3125 7 1.3125C8.69108 1.3125 10.0625 2.68392 10.0625 4.375Z" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.9375 8.484C12.0161 8.88242 12.6875 9.44242 12.6875 10.0625C12.6875 11.2706 10.1413 12.25 7 12.25C3.85875 12.25 1.3125 11.2706 1.3125 10.0625C1.3125 9.44242 1.98392 8.88242 3.0625 8.484" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
    </FeatureSvg>
  );
}

/** Bedrooms (node 138:2735). */
export function BedIcon(props: IconProps) {
  return (
    <FeatureSvg {...props}>
      <path d="M6.125 4.375H11.8125C12.7791 4.375 13.5625 5.15842 13.5625 6.125V9.1875H6.125V4.375Z" fill="currentColor" />
      <path d="M6.125 9.1875V4.375H11.8125C12.7791 4.375 13.5625 5.15842 13.5625 6.125V9.1875" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.3125 11.375V2.625" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.3125 9.1875H13.5625V11.375" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.125 4.375H1.3125" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
    </FeatureSvg>
  );
}

/** Bathrooms (node 138:2753). */
export function BathIcon(props: IconProps) {
  return (
    <FeatureSvg {...props}>
      <path d="M10.9375 5.6875V7.875H7.4375V5.6875H0.875V7.875C0.875 9.32458 2.05042 10.5 3.5 10.5H10.5C11.9496 10.5 13.125 9.32458 13.125 7.875V5.6875H10.9375Z" fill="currentColor" />
      <path d="M3.9375 10.5V11.8125" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.0625 10.5V11.8125" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.4375 7.875V5.25H10.9375V7.875H7.4375Z" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.9375 5.6875H13.125V7.875C13.125 9.32458 11.9496 10.5 10.5 10.5H3.5C2.05042 10.5 0.875 9.32458 0.875 7.875V5.6875H7.4375" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.0625 5.6875V2.84375C3.0625 2.23942 3.55192 1.75 4.15625 1.75C4.68125 1.74884 5.13625 2.11284 5.25 2.625" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
    </FeatureSvg>
  );
}

/** Floors (node 138:2772). */
export function FloorsIcon(props: IconProps) {
  return (
    <FeatureSvg {...props}>
      <path d="M11.375 2.1875H9.625V4.375C9.625 4.6165 9.429 4.8125 9.1875 4.8125H4.8125C4.571 4.8125 4.375 4.6165 4.375 4.375V2.22717C4.32717 2.24875 4.284 2.2785 4.24725 2.31525L2.31525 4.24725C2.23358 4.32892 2.1875 4.44033 2.1875 4.55583V11.375C2.1875 11.6165 2.3835 11.8125 2.625 11.8125H11.375C11.6165 11.8125 11.8125 11.6165 11.8125 11.375V2.625C11.8125 2.3835 11.6165 2.1875 11.375 2.1875ZM7 10.0625C6.03342 10.0625 5.25 9.27908 5.25 8.3125C5.25 7.34592 6.03342 6.5625 7 6.5625C7.96658 6.5625 8.75 7.34592 8.75 8.3125C8.75 9.27908 7.96658 10.0625 7 10.0625Z" fill="currentColor" />
      <path d="M2.1875 4.55583V11.375C2.1875 11.6165 2.3835 11.8125 2.625 11.8125H11.375C11.6165 11.8125 11.8125 11.6165 11.8125 11.375V2.625C11.8125 2.3835 11.6165 2.1875 11.375 2.1875H4.55583C4.44033 2.1875 4.32892 2.23358 4.24725 2.31525L2.31525 4.24725C2.23358 4.32892 2.1875 4.44033 2.1875 4.55583Z" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.25 8.3125C5.25 7.34592 6.03342 6.5625 7 6.5625C7.96658 6.5625 8.75 7.34592 8.75 8.3125C8.75 9.27908 7.96658 10.0625 7 10.0625C6.03342 10.0625 5.25 9.27908 5.25 8.3125Z" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.375 2.22717V4.375C4.375 4.6165 4.571 4.8125 4.8125 4.8125H9.1875C9.429 4.8125 9.625 4.6165 9.625 4.375V2.1875" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
    </FeatureSvg>
  );
}

/** Parking lots (node 138:2789). */
export function ParkingIcon(props: IconProps) {
  return (
    <FeatureSvg {...props}>
      <path d="M12.25 9.625V10.9375C12.25 11.179 12.054 11.375 11.8125 11.375H10.5C10.2585 11.375 10.0625 11.179 10.0625 10.9375V9.625H12.25Z" fill="currentColor" />
      <path d="M3.9375 9.625V10.9375C3.9375 11.179 3.7415 11.375 3.5 11.375H2.1875C1.946 11.375 1.75 11.179 1.75 10.9375V9.625H3.9375Z" fill="currentColor" />
      <path d="M12.25 6.125L10.6155 2.44708C10.5449 2.28958 10.3886 2.1875 10.2159 2.1875H3.78467C3.61142 2.1875 3.45508 2.28958 3.3845 2.44708L1.75 6.125H12.25Z" fill="currentColor" />
      <path d="M0.875 6.125H13.125" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.25 9.625V10.9375C12.25 11.179 12.054 11.375 11.8125 11.375H10.5C10.2585 11.375 10.0625 11.179 10.0625 10.9375V9.625" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.9375 9.625V10.9375C3.9375 11.179 3.7415 11.375 3.5 11.375H2.1875C1.946 11.375 1.75 11.179 1.75 10.9375V9.625" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 7.875H4.375" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.625 7.875H10.5" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.25 6.125L10.6155 2.44708C10.5449 2.28958 10.3886 2.1875 10.2159 2.1875H3.78467C3.61142 2.1875 3.45508 2.28958 3.3845 2.44708L1.75 6.125V9.625H12.25V6.125Z" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
    </FeatureSvg>
  );
}

/** Balconies (node 138:2811). */
export function BalconiesIcon(props: IconProps) {
  return (
    <FeatureSvg {...props}>
      <path d="M11.375 11.8125L7 11.0174V7.875H11.375V11.8125Z" fill="currentColor" />
      <path d="M5.25 10.6989L1.75 10.0625V7.875H5.25V10.6989Z" fill="currentColor" />
      <path d="M11.375 2.1875L7 2.98317V6.125H11.375V2.1875Z" fill="currentColor" />
      <path d="M5.25 3.30108L1.75 3.9375V6.125H5.25V3.30108Z" fill="currentColor" />
      <path d="M11.375 11.8125L7 11.0174V7.875H11.375V11.8125Z" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.25 10.6989L1.75 10.0625V7.875H5.25V10.6989Z" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.375 2.1875L7 2.98317V6.125H11.375V2.1875Z" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.25 3.30108L1.75 3.9375V6.125H5.25V3.30108Z" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
    </FeatureSvg>
  );
}
