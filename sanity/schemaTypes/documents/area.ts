import { defineType, defineField } from "sanity";

/**
 * Area — the leaf of the location taxonomy (Downtown Dubai, Saadiyat Island,
 * Al Marjan Island, …), each belonging to exactly one {@link areaRegion}. 45
 * areas are seeded; listings REFERENCE one of these rather than storing a
 * string, so the Collection filter, the card labels and the CMS can never drift
 * apart, and adding a new area is a content edit rather than a code change.
 *
 * Names are proper nouns and are deliberately NOT localized (localeString) —
 * "Palm Jumeirah" is "Palm Jumeirah" in every locale, and a filterable value
 * has to compare identically across languages (same rule as status/category on
 * the listing schema).
 *
 * `slug` is the stable machine value the filter checks against; `order` keeps
 * each region's areas in the client-supplied order rather than alphabetical.
 *
 * Seeded from sanity/seed/areas.ndjson — see the seed README.
 */
export const area = defineType({
  name: "area",
  title: "Area",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'e.g. "Downtown Dubai", "Yas Island", "Al Marjan Island".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      description: "Stable filter/URL value — do not change once listings are live.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "reference",
      to: [{ type: "areaRegion" }],
      description: "Which emirate group this area belongs to.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Order within its region in the Collection location filter.",
    }),
  ],
  orderings: [
    {
      name: "displayOrder",
      title: "Region, then display order",
      by: [
        { field: "region.order", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "region.name" },
  },
});
