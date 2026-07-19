"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * Quiet full-screen loading veil — the arch symbol on a plain white ground that
 * fades in and then out (~560ms total) whenever a new page settles.
 *
 * Two moments, one treatment:
 *  - Initial visit: the veil is part of the server-rendered HTML, so it covers
 *    the page from the very first paint (before hydration) and simply animates
 *    away once styles load — no flash of unstyled content, no JS required.
 *  - Route-to-route navigation: keying the element on the pathname remounts it
 *    on each navigation, replaying the same gentle fade so page changes read as
 *    a soft cross-fade rather than a hard reload.
 *
 * The whole thing is CSS-driven (see `.page-loader` in globals.css): no spinner,
 * no text, no progress bar, and it collapses to nothing under
 * `prefers-reduced-motion`. `usePathname` is the only reason this is a client
 * component — it supplies the remount key, nothing more.
 *
 * In-page interactions (accordions, filters, paging) never change the pathname,
 * so they never trigger the veil — exactly as intended.
 */
export function PageLoader() {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-loader" aria-hidden="true">
      <Image
        src="/brand/arch-mark.png"
        alt=""
        width={598}
        height={601}
        priority
        className="page-loader__mark"
      />
    </div>
  );
}
