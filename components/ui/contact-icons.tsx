import type { SVGProps } from "react";

/**
 * Contact-item marks (Figma node 57:334 — Office / Direct Line / Property
 * Enquiries). 20px line-style icons sized to sit inside the 46px stone tiles.
 * Kept separate from the Footer's 12px filled contact marks: different size,
 * different weight, different context.
 */

type IconProps = SVGProps<SVGSVGElement>;

export function LocationPinIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width="20"
      height="20"
      {...props}
    >
      <path d="M10 18.33c3.33-3.33 6.67-6.32 6.67-10a6.67 6.67 0 0 0-13.34 0c0 3.68 3.34 6.67 6.67 10Z" />
      <circle cx="10" cy="8.33" r="2.5" />
    </svg>
  );
}

export function PhoneLineIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width="20"
      height="20"
      {...props}
    >
      <path d="M17.92 14.08v2.5a1.67 1.67 0 0 1-1.82 1.67 16.5 16.5 0 0 1-7.2-2.56 16.26 16.26 0 0 1-5-5 16.5 16.5 0 0 1-2.56-7.24A1.67 1.67 0 0 1 3 1.67h2.5a1.67 1.67 0 0 1 1.67 1.43c.1.8.29 1.59.56 2.35a1.67 1.67 0 0 1-.38 1.76l-1.06 1.06a13.33 13.33 0 0 0 5 5l1.06-1.06a1.67 1.67 0 0 1 1.76-.38c.76.27 1.55.46 2.35.56a1.67 1.67 0 0 1 1.43 1.7Z" />
    </svg>
  );
}

export function MailLineIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width="20"
      height="20"
      {...props}
    >
      <rect x="1.67" y="3.33" width="16.67" height="13.33" rx="0" />
      <path d="m1.67 4.17 8.33 5.83 8.33-5.83" />
    </svg>
  );
}
