import { defineType, defineField } from "sanity";

/**
 * Area Region — the top level of the location taxonomy: Dubai, Abu Dhabi and
 * Northern Emirates. Three documents, one per emirate group; the Collection
 * filter renders one collapsible section per region (collapsed by default), so
 * a 45-area list stays scannable.
 *
 * `slug` is the stable machine value — it is what the filter UI checks against
 * and what any future /collection?region=… URL would carry, so renaming the
 * display `name` never breaks a saved filter. `order` sets the section order in
 * the filter (Dubai first); it is not alphabetical by design.
 *
 * Seeded from sanity/seed/areas.ndjson — see the seed README.
 */
export const areaRegion = defineType({
  name: "areaRegion",
  title: "Region",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'e.g. "Dubai", "Abu Dhabi", "Northern Emirates".',
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
      name: "order",
      title: "Display order",
      type: "number",
      description: "Order of the region sections in the Collection location filter.",
    }),
  ],
  orderings: [
    {
      name: "displayOrder",
      title: "Display order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current" },
  },
});
