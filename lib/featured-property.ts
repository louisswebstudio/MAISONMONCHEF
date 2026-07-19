/**
 * The featured properties shown in the "Our properties" carousel — cloned from
 * Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node 138:2376 "Section - Properties").
 * See components/sections/Properties.tsx.
 *
 * PLACEHOLDER CONTENT (see CLAUDE.md): the Figma frame shows a single mock
 * listing ("The Grove Residence", a non-Dubai stock photo) with the prev/next
 * cards as faded duplicates. Real featured properties will come from the
 * `listing` Sanity documents; this file reproduces the carousel with a small
 * set of placeholder cards until that query is wired in. A few slides (rather
 * than one) so the carousel controls, position counter and auto-play have
 * something real to cycle through. Feature VALUES are as authored in Figma;
 * only the labels are translated (via the dictionary). Locations are real
 * Dubai areas (LISTING_LOCATIONS); images are the two local placeholder photos.
 */
export type PropertyFeature = "area" | "bedrooms" | "bathrooms" | "floors" | "parking" | "balconies";

export type FeaturedProperty = {
  id: string;
  title: string;
  /** Real Dubai area label (proper noun — not translated per-locale). */
  location: string;
  /** Pre-formatted price string incl. currency, as authored in Figma. */
  price: string;
  image: string;
  /** Feature key → value string, in display order. */
  features: { key: PropertyFeature; value: string }[];
};

// Three visually-distinct placeholder property photos, one per slide, so the
// carousel's crossfade is actually visible while advancing (the earlier single
// stock house repeated across slides made the transition impossible to see).
// Stand-ins until real gallery images are uploaded to the `listing` documents.
const IMG_GROVE = "/brand/properties/listing-modern-villa.jpg";
const IMG_SUNDIAL = "/brand/properties/listing-glass-house.jpg";
const IMG_MARINA = "/brand/properties/listing-waterfront.jpg";

export const FEATURED_PROPERTIES: FeaturedProperty[] = [
  {
    id: "the-grove-residence",
    title: "The Grove Residence",
    location: "Dubai Hills",
    price: "AED 950,000",
    image: IMG_GROVE,
    features: [
      { key: "area", value: "1700 sq/ft" },
      { key: "bedrooms", value: "04" },
      { key: "bathrooms", value: "02" },
      { key: "floors", value: "03" },
      { key: "parking", value: "02" },
      { key: "balconies", value: "02" },
    ],
  },
  {
    id: "the-sundial-residence",
    title: "The Sundial Residence",
    location: "Palm Jumeirah",
    price: "AED 3,650,000",
    image: IMG_SUNDIAL,
    features: [
      { key: "area", value: "2150 sq/ft" },
      { key: "bedrooms", value: "03" },
      { key: "bathrooms", value: "03" },
      { key: "floors", value: "02" },
      { key: "parking", value: "02" },
      { key: "balconies", value: "03" },
    ],
  },
  {
    id: "the-marina-residence",
    title: "The Marina Residence",
    location: "Downtown Dubai",
    price: "AED 1,480,000",
    image: IMG_MARINA,
    features: [
      { key: "area", value: "1400 sq/ft" },
      { key: "bedrooms", value: "02" },
      { key: "bathrooms", value: "02" },
      { key: "floors", value: "01" },
      { key: "parking", value: "01" },
      { key: "balconies", value: "02" },
    ],
  },
];
