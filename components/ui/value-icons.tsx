import type { SVGProps } from "react";

/**
 * Card marks for the About page "Our Value" section — graduation cap, delivery
 * truck, price tag and activity-pulse. Paths are lifted 1:1 from Figma (file
 * r2XTjIJ5uaZ0VFCG2kfCdn, node 108:316 "Our Value Section") on their native
 * 32×32 viewBox.
 *
 * Figma fills these solid black; `currentColor` lets the caller set the colour
 * (navy on the paper card). These are the Figma template's stock glyphs, kept
 * verbatim per the design — final iconography comes from the one library the
 * client is sourcing (CLAUDE.md §6), so this set stays separate like the
 * amenity/process sets.
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
      {...props}
    >
      {children}
    </svg>
  );
}

/** Graduation cap (node 142:2416) — Considered Positioning. */
export function PositioningIcon(props: IconProps) {
  return (
    <ValueSvg {...props}>
      <path
        d="M16 2.667L0 12L16 21.333L29.333 13.555V23.333H32V12L16 2.667ZM5.332 17.987V24C6.57287 25.6574 8.18329 27.0025 10.0352 27.9283C11.8872 28.8541 13.9295 29.3351 16 29.333C18.0703 29.3349 20.1125 28.8538 21.9642 27.9281C23.816 27.0023 25.4262 25.6573 26.667 24V17.988L16 24.21L5.332 17.987Z"
        fill="currentColor"
      />
    </ValueSvg>
  );
}

/** Delivery truck (node 142:2429) — A Central Address. */
export function CentralAddressIcon(props: IconProps) {
  return (
    <ValueSvg {...props}>
      <path
        d="M22.667 10.667H26.667L30.667 16.074V24H27.953C27.7925 25.1108 27.2371 26.1266 26.3886 26.8613C25.5401 27.5959 24.4553 28.0003 23.333 28.0003C22.2107 28.0003 21.1259 27.5959 20.2774 26.8613C19.4289 26.1266 18.8735 25.1108 18.713 24H11.953C11.7925 25.1108 11.2371 26.1266 10.3886 26.8613C9.54012 27.5959 8.45535 28.0003 7.333 28.0003C6.21065 28.0003 5.12588 27.5959 4.2774 26.8613C3.42892 26.1266 2.87354 25.1108 2.713 24H1.333V8C1.333 7.263 1.93 6.667 2.667 6.667H21.333C22.07 6.667 22.667 7.263 22.667 8V10.667ZM22.667 13.333V17.333H28V16.953L25.322 13.333H22.667Z"
        fill="currentColor"
      />
    </ValueSvg>
  );
}

/** Price tag (node 142:2453) — Direct Market Access. */
export function MarketAccessIcon(props: IconProps) {
  return (
    <ValueSvg {...props}>
      <path
        d="M14.539 2.8L27.739 4.686L29.624 17.886L17.367 30.142C16.847 30.662 16.003 30.662 15.482 30.142L2.282 16.942C2.03206 16.692 1.89165 16.353 1.89165 15.9995C1.89165 15.646 2.03206 15.307 2.282 15.057L14.539 2.8ZM18.31 14.114C18.5558 14.3695 18.8501 14.5735 19.1757 14.7139C19.5013 14.8544 19.8516 14.9285 20.2062 14.9319C20.5608 14.9353 20.9125 14.868 21.2407 14.7339C21.5689 14.5998 21.8672 14.4016 22.1179 14.1509C22.3686 13.9002 22.5668 13.6019 22.7009 13.2737C22.835 12.9455 22.9023 12.5938 22.8989 12.2392C22.8955 11.8846 22.8214 11.5343 22.6809 11.2087C22.5405 10.8831 22.3365 10.5888 22.081 10.343C21.5768 9.86377 20.9052 9.60053 20.2096 9.60943C19.514 9.61832 18.8494 9.89865 18.3576 10.3906C17.8658 10.8826 17.5856 11.5472 17.5769 12.2428C17.5682 12.9384 17.8316 13.6099 18.311 14.114"
        fill="currentColor"
      />
    </ValueSvg>
  );
}

/** Activity pulse with spark (node 142:2466) — Discretion, Always. */
export function DiscretionIcon(props: IconProps) {
  return (
    <ValueSvg {...props}>
      <path
        d="M26.285 10.838L25.955 11.592C25.9034 11.7144 25.8169 11.8188 25.7063 11.8922C25.5956 11.9656 25.4658 12.0048 25.333 12.0048C25.2002 12.0048 25.0704 11.9656 24.9597 11.8922C24.8491 11.8188 24.7626 11.7144 24.711 11.592L24.382 10.838C23.8057 9.50294 22.7504 8.43199 21.424 7.836L20.411 7.386C19.863 7.142 19.863 6.346 20.411 6.102L21.367 5.676C22.7277 5.06508 23.802 3.95504 24.368 2.575L24.706 1.76C24.7558 1.63426 24.8423 1.52639 24.9542 1.45038C25.0661 1.37437 25.1982 1.33373 25.3335 1.33373C25.4688 1.33373 25.6009 1.37437 25.7128 1.45038C25.8247 1.52639 25.9112 1.63426 25.961 1.76L26.298 2.575C26.8642 3.95522 27.9389 5.06529 29.3 5.676L30.256 6.102C30.804 6.345 30.804 7.142 30.256 7.386L29.243 7.836C27.9166 8.43199 26.8613 9.50294 26.285 10.838ZM20 28.718L12 10.052L8.88 17.334H1.332V14.667H7.12L12 3.282L20 21.949L23.12 14.667H30.667V17.334H24.879L20 28.718Z"
        fill="currentColor"
      />
    </ValueSvg>
  );
}
