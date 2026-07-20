/**
 * "Developers We Work With" — a grid of bordered logo cards (see
 * components/sections/Partners.tsx). Brand names are proper nouns, not
 * translated per-locale (matches the `developer` Sanity schema's name+logo
 * shape).
 *
 * All 7 developers now have real logo files in /public/brand/developers/
 * (originals kept in ./_original/). To add another, drop a whitespace-trimmed
 * PNG in that folder and add its `logo` path + intrinsic dimensions here.
 */
export type Developer = {
  name: string;
  logo?: string;
  logoWidth: number;
  logoHeight: number;
  /**
   * On-site rendered height in px (Partners.tsx). Optional — defaults to the
   * shared 34px. Overridden per-logo where matching the raw *bounding-box*
   * height would NOT match visual weight: DAMAC is a heavy, wide wordmark whose
   * letters fill the whole box (looks oversized at 34px), while NAKHEEL's box is
   * dominated by a tall icon so its wordmark shrinks to ~11px at 34px (looks
   * tiny). Values below are calibrated so every mark reads at the same optical
   * weight as the four original wordmarks (which stay at 34px).
   */
  opticalHeight?: number;
};

export const DEVELOPERS: Developer[] = [
  // Dimensions are the trimmed (whitespace-cropped) intrinsic sizes of each PNG
  // in /public/brand/developers/ — originals are kept in ./_original/. Each file
  // is tight to its mark; the four originals share the base 34px height, and the
  // three newer marks carry an `opticalHeight` override so all seven read at
  // equal visual weight (see the type note above).
  { name: "Emaar", logo: "/brand/developers/emaar.png", logoWidth: 831, logoHeight: 173 },
  { name: "Binghatti", logo: "/brand/developers/binghatti.png", logoWidth: 385, logoHeight: 93 },
  { name: "Sobha Realty", logo: "/brand/developers/sobha.png", logoWidth: 300, logoHeight: 107 },
  { name: "Omniyat", logo: "/brand/developers/omniyat.png", logoWidth: 331, logoHeight: 60 },
  // Damac: heavy wide wordmark — scaled down so it doesn't dominate the row.
  { name: "Damac", logo: "/brand/developers/damac.png", logoWidth: 235, logoHeight: 30, opticalHeight: 22 },
  // Ora: cropped to the OΓΔ monogram (the "Reimagining Time" tagline in the
  // source lockup is dropped so the mark carries equal weight at the shared
  // height) and converted to the same monochrome as the other wordmarks. The
  // solid monogram reads slightly heavy, so it's nudged down a touch.
  { name: "Ora", logo: "/brand/developers/ora.png", logoWidth: 1000, logoHeight: 366, opticalHeight: 28 },
  // Nakheel: source is a colored (teal) icon + wordmark; converted to the same
  // monochrome treatment as the other 6 for ticker consistency. Its tall wave
  // icon inflates the bounding box, so it's scaled UP so the wordmark is legible
  // (the icon then sits a little taller than the row — expected for an icon mark).
  { name: "Nakheel", logo: "/brand/developers/nakheel.png", logoWidth: 1140, logoHeight: 420, opticalHeight: 48 },
];
