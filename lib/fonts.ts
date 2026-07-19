import { Montserrat, Cormorant_Garamond } from "next/font/google";

/**
 * Montserrat carries body/UI. Exposed as the CSS variable `--font-montserrat`,
 * which globals.css maps onto --font-body.
 *
 * Cormorant Garamond is the interim DISPLAY face (headlines, prices, stats,
 * pull-quotes) — a licensed high-contrast serif standing in for The Seasons
 * (unlicensed, CLAUDE.md §7.1). To swap in The Seasons later: load it here as
 * another next/font (local file), expose e.g. --font-seasons, then repoint
 * --font-display in globals.css to it. That is the whole swap.
 */
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
