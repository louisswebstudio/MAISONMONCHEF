import { Montserrat } from "next/font/google";

/**
 * Montserrat is the ONLY typeface site-wide right now (DESIGN.md firm rule —
 * no serif anywhere). It carries body/UI AND display: exposed as the CSS
 * variable `--font-montserrat`, which globals.css maps onto BOTH --font-body
 * and --font-display. Italic is loaded because a few display bits (subheads,
 * the testimonial pull-quote) are set in italic.
 *
 * The intended display face, The Seasons, is not licensed yet. When it is:
 * load it here as another next/font (local file), expose e.g. --font-seasons,
 * then repoint ONLY --font-display in globals.css to it. That is the whole swap.
 */
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});
