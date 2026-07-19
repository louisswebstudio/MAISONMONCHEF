/**
 * "Developers We Work With" — a grid of bordered logo cards (see
 * components/sections/Partners.tsx). Brand names are proper nouns, not
 * translated per-locale (matches the `developer` Sanity schema's name+logo
 * shape).
 *
 * Real logo files present: EMAAR, BINGHATTI, SOBHA, OMNIYAT. Cards with
 * `logo: undefined` (DAMAC, ORA, NAKHEEL) render a centered text mark in the
 * same bordered card — a "pending logo" slot, not a broken/missing-asset
 * state. Drop a file in /public/brand/developers/ and add its `logo` path to
 * promote one of these to a real logo.
 */
export type Developer = {
  name: string;
  logo?: string;
  logoWidth: number;
  logoHeight: number;
};

export const DEVELOPERS: Developer[] = [
  // Dimensions are the trimmed (whitespace-cropped) intrinsic sizes of each PNG
  // in /public/brand/developers/ — originals are kept in ./_original/. Because
  // each file is tight to its mark, all logos render at one shared height in
  // Partners.tsx and carry equal visual weight (no baked-in padding to shrink them).
  { name: "Emaar", logo: "/brand/developers/emaar.png", logoWidth: 831, logoHeight: 173 },
  { name: "Binghatti", logo: "/brand/developers/binghatti.png", logoWidth: 385, logoHeight: 93 },
  { name: "Sobha Realty", logo: "/brand/developers/sobha.png", logoWidth: 300, logoHeight: 107 },
  { name: "Omniyat", logo: "/brand/developers/omniyat.png", logoWidth: 331, logoHeight: 60 },
  // DAMAC has no logo file yet — text placeholder card until one is added.
  { name: "Damac", logoWidth: 120, logoHeight: 30 },
  { name: "Ora", logoWidth: 41, logoHeight: 30 },
  { name: "Nakheel", logoWidth: 89, logoHeight: 30 },
];
