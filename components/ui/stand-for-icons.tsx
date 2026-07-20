import type { SVGProps } from "react";

/**
 * Value marks for the About page "What We Stand For" section — handshake,
 * heart, building and trophy. Paths are lifted 1:1 from Figma (file
 * r2XTjIJ5uaZ0VFCG2kfCdn, node 90:866 "Our Values Section") on their native
 * 39×39 viewBox.
 *
 * These are STROKE icons (Figma strokes them black at 2.4375); `currentColor`
 * on the stroke lets the caller set the colour (navy on the white card). Kept
 * separate from the process/value/amenity sets for the same reason those are
 * split — final iconography comes from the one library the client is sourcing
 * (CLAUDE.md §6).
 */

type IconProps = SVGProps<SVGSVGElement>;

function StandForSvg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 39 39"
      fill="none"
      aria-hidden="true"
      width="39"
      height="39"
      stroke="currentColor"
      strokeWidth="2.4375"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Handshake (node 90:889) — Integrity First. */
export function IntegrityIcon(props: IconProps) {
  return (
    <StandForSvg {...props}>
      <path d="M30.4688 23.1562L24.375 29.25L14.625 26.8125L6.09375 20.7188" />
      <path d="M11.0728 10.7608L19.5 8.53125L27.9289 10.7608" />
      <path d="M5.23613 9.20389L1.34751 16.9828C1.04688 17.584 1.29063 18.3169 1.89188 18.6175L6.09413 20.7186L11.0715 10.759L6.87251 8.66114C6.58326 8.51489 6.24851 8.49214 5.94138 8.59289C5.63426 8.69527 5.38076 8.91464 5.23613 9.20389Z" />
      <path d="M32.9063 20.7186L37.1069 18.6175C37.7081 18.3169 37.9519 17.584 37.6513 16.9828L33.7643 9.20389C33.618 8.91464 33.3645 8.69527 33.0574 8.59289C32.7519 8.49214 32.4171 8.51489 32.1279 8.66114L27.9273 10.759L32.9063 20.7186Z" />
      <path d="M28.031 10.9688H21.9372L14.9822 17.7157C14.7206 17.9774 14.5906 18.3446 14.6328 18.7119C14.6735 19.0807 14.8798 19.4106 15.1918 19.6089C17.8601 21.3135 21.4806 21.1949 24.3747 18.2812L30.4685 23.1562L32.906 20.7188" />
      <path d="M18.9004 32.9062L12.5434 31.317L8.53125 28.4505" />
    </StandForSvg>
  );
}

/** Heart (node 90:907) — Client-Centered Service. */
export function ClientCenteredIcon(props: IconProps) {
  return (
    <StandForSvg {...props}>
      <path d="M19.5 34.125C19.5 34.125 3.65625 25.5938 3.65625 15.5399C3.65625 10.9964 7.34013 7.3125 11.8836 7.3125C15.3238 7.3125 18.2715 9.18775 19.5 12.1875C20.7285 9.18775 23.6762 7.3125 27.118 7.3125C31.6599 7.3125 35.3438 10.9964 35.3438 15.5399C35.3438 25.5938 19.5 34.125 19.5 34.125Z" />
    </StandForSvg>
  );
}

/** Building (node 90:920) — Market Expertise. */
export function MarketExpertiseIcon(props: IconProps) {
  return (
    <StandForSvg {...props}>
      <path d="M20.7188 32.9061V4.87482C20.7188 4.4247 20.4701 4.01195 20.0753 3.8007C19.6788 3.58782 19.1978 3.6122 18.824 3.86082L6.6365 11.9858C6.29687 12.2117 6.09375 12.5936 6.09375 13.0014V32.9061" />
      <path d="M20.7188 13.4062H31.6875C32.3603 13.4062 32.9062 13.9522 32.9062 14.625V32.9062" />
      <path d="M2.4375 32.9062H36.5625" />
      <path d="M15.8438 17.0625V19.5" />
      <path d="M10.9688 17.0625V19.5" />
      <path d="M10.9688 25.5938V28.0312" />
      <path d="M15.8438 25.5938V28.0312" />
    </StandForSvg>
  );
}

/** Trophy (node 90:939) — Exceptional Results. */
export function ResultsIcon(props: IconProps) {
  return (
    <StandForSvg {...props}>
      <path d="M14.625 34.125H24.375" />
      <path d="M19.5 28.0312V34.125" />
      <path d="M8.83675 19.5H7.3125C4.61988 19.5 2.4375 17.3176 2.4375 14.625V12.1875C2.4375 11.5147 2.9835 10.9688 3.65625 10.9688H8.53125" />
      <path d="M30.1649 19.5H31.6891C34.3801 19.5 36.5641 17.3176 36.5641 14.625V12.1875C36.5641 11.5147 36.0181 10.9688 35.3454 10.9688H30.4704" />
      <path d="M8.53125 7.3125H30.4688V16.926C30.4688 22.9742 25.6311 27.9857 19.5845 28.0312C16.6595 28.054 13.8482 26.9084 11.7731 24.8479C9.698 22.789 8.53125 19.9859 8.53125 17.0625V7.3125Z" />
    </StandForSvg>
  );
}
