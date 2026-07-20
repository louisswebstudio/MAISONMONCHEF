import { defineType, defineField } from "sanity";

/**
 * Testimonial (CLAUDE.md §6). No photo field by design — the site uses
 * initials-monogram avatars (charcoal badge, white initials), never stock
 * photos or broken image placeholders. `initials` drives that monogram.
 *
 * Live: James R. · Fatima A. · Sarah L.   In reserve: Daniel M. · Omar K.
 */
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "localeText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "e.g. 'James R.'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "initials",
      title: "Initials (for monogram avatar)",
      type: "string",
      description: "1–2 letters, e.g. 'JR'. Rendered white on a charcoal badge.",
      validation: (rule) => rule.required().max(2),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description: "e.g. 'Off-Plan Buyer, Sobha Realty'.",
    }),
    defineField({
      name: "inReserve",
      title: "In reserve (not shown live yet)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "context" },
  },
});
