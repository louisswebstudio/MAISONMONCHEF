import type { SVGProps } from "react";

/**
 * Step marks for the "Why Maison Monchef" process timeline — magnifier
 * (advisory), building (portfolio) and handshake (consultation). Paths are
 * lifted 1:1 from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node 138:3117
 * "Section - Our Process") on their native 24×24 viewBox.
 *
 * Figma paints these navy-fill + black-stroke; `currentColor` on both lets the
 * caller set the colour (navy in the white step tile). Kept separate from the
 * amenity/property sets for the same reason those are split — final iconography
 * comes from the one library the client is sourcing (CLAUDE.md §6).
 */

type IconProps = SVGProps<SVGSVGElement>;

function ProcessSvg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      width="24"
      height="24"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Magnifier (node 138:3157) — Investment Advisory. */
export function AdvisoryIcon(props: IconProps) {
  return (
    <ProcessSvg {...props}>
      <path
        d="M3 10.5C3 6.358 6.358 3 10.5 3C14.642 3 18 6.358 18 10.5C18 14.642 14.642 18 10.5 18C6.358 18 3 14.642 3 10.5Z"
        fill="currentColor"
      />
      <path
        d="M3 10.5C3 6.358 6.358 3 10.5 3C14.642 3 18 6.358 18 10.5C18 14.642 14.642 18 10.5 18C6.358 18 3 14.642 3 10.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.803 15.803L21 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </ProcessSvg>
  );
}

/** Building (node 138:3176) — Portfolio Building. */
export function PortfolioIcon(props: IconProps) {
  return (
    <ProcessSvg {...props}>
      <path
        d="M12.75 20.2499V2.99989C12.75 2.72289 12.597 2.46889 12.354 2.33889C12.11 2.20789 11.814 2.22289 11.584 2.37589L4.084 7.37589C3.875 7.51489 3.75 7.74989 3.75 8.00089V20.2499H12.75Z"
        fill="currentColor"
      />
      <path
        d="M12.75 20.2499V2.99989C12.75 2.72289 12.597 2.46889 12.354 2.33889C12.11 2.20789 11.814 2.22289 11.584 2.37589L4.084 7.37589C3.875 7.51489 3.75 7.74989 3.75 8.00089V20.2499"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 8.25H19.5C19.914 8.25 20.25 8.586 20.25 9V20.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1.5 20.25H22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.75 10.5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.75 10.5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.75 15.75V17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.75 15.75V17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </ProcessSvg>
  );
}

/** Handshake (node 138:3201) — Consultation. */
export function ConsultationIcon(props: IconProps) {
  return (
    <ProcessSvg {...props}>
      <path
        d="M9.349 12.067C9.156 11.945 9.029 11.742 9.004 11.515C8.979 11.289 9.058 11.063 9.219 10.902L13.5 6.75H17.212L17.186 6.622L12 5.25L6.814 6.622L3.75 12.75L9 16.5L15 18L18.75 14.25L15 11.25C13.219 13.043 10.99 13.116 9.349 12.067Z"
        fill="currentColor"
      />
      <path
        d="M18.75 14.25L15 18L9 16.5L3.75 12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.814 6.622L12 5.25L17.187 6.622"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.22223 5.66393L0.829235 10.4509C0.644235 10.8209 0.794235 11.2719 1.16423 11.4569L3.75023 12.7499L6.81323 6.62093L4.22923 5.32993C4.05123 5.23993 3.84523 5.22593 3.65623 5.28793C3.46723 5.35093 3.31123 5.48593 3.22223 5.66393Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.25 12.7499L22.835 11.4569C23.205 11.2719 23.355 10.8209 23.17 10.4509L20.778 5.66393C20.688 5.48593 20.532 5.35093 20.343 5.28793C20.155 5.22593 19.949 5.23993 19.771 5.32993L17.186 6.62093L20.25 12.7499Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.2498 6.75H13.4998L9.21983 10.902C9.05883 11.063 8.97883 11.289 9.00483 11.515C9.02983 11.742 9.15683 11.945 9.34883 12.067C10.9908 13.116 13.2188 13.043 14.9998 11.25L18.7498 14.25L20.2498 12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.631 20.25L7.719 19.272L5.25 17.508"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </ProcessSvg>
  );
}
