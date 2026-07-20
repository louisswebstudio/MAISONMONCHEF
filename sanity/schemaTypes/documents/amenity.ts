import { defineType, defineField } from "sanity";

/**
 * Amenity — the taxonomy is LOCKED at 12 (CLAUDE.md §6). This is a single
 * reference type (name + icon), multi-selected per listing, so filters never
 * drift. Do NOT let listings store free-text amenities.
 *
 * The 12 confirmed: Private Pool · Gym · Smart Home System · Covered Parking ·
 * 24/7 Security · Concierge Service · Floor-to-Ceiling Windows · Spa/Jacuzzi ·
 * Private Garden/Terrace · Kids Play Area · BBQ Area · Premium View.
 * (Seed them via sanity/seed/amenities.ndjson — see README.)
 */
export const amenity = defineType({
  name: "amenity",
  title: "Amenity",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description:
        "Icon name from the single chosen library (Phosphor/Lucide/Tabler) — keep stroke weight consistent. e.g. 'swimming-pool'.",
      validation: (rule) => rule.required(),
    }),
    // Added for the Property Listing page's "Features & Amenities" section
    // (node 25:33): each amenity shows an icon + title + short description.
    // Flag to the client — the amenity document had no description before.
    defineField({
      name: "description",
      title: "Short description",
      type: "localeString",
      description:
        "One short line shown under the amenity title on the property page, e.g. 'Temperature-controlled infinity pool'.",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "name.en", subtitle: "icon" },
  },
});
