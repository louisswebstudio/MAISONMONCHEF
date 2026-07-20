import { defineType, defineField } from "sanity";

/**
 * Developer — for the "Developers We Work With" ticker (CLAUDE.md §6).
 * Real logos approved: EMAAR, BINGHATTI, SOBHA.
 * Text placeholders pending logo files: DAMAC, OMNIYAT, ORA, NAKHEEL —
 * mark these `isPlaceholder: true` so the frontend renders the wordmark
 * instead of a broken/missing image.
 */
export const developer = defineType({
  name: "developer",
  title: "Developer",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description:
        "Transparent SVG/PNG. Leave empty and set 'Placeholder' if the logo file has not been delivered yet.",
      options: { hotspot: false },
    }),
    defineField({
      name: "isPlaceholder",
      title: "Placeholder (render name as text, no logo yet)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "name", media: "logo", placeholder: "isPlaceholder" },
    prepare: ({ title, media, placeholder }) => ({
      title,
      subtitle: placeholder ? "Text placeholder (no logo)" : "Logo",
      media,
    }),
  },
});
