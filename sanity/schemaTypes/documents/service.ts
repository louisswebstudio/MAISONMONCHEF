import { defineType, defineField } from "sanity";

/**
 * Service (CLAUDE.md §6) — the SET is fixed at exactly 3: Investment Advisory,
 * Portfolio Building, Consultation. Do NOT treat this as an open, growable list,
 * and never reintroduce the generic 8-item template services.
 *
 * Judgment call / flag: the brief noted services "likely don't need to be a CMS
 * type at all." They are modelled here anyway — but ONLY so marketing/management
 * can edit the DESCRIPTIONS across EN/AR/FR (a stated requirement: non-technical
 * staff self-editing multilingual copy). Enforce the count of 3 at import/review
 * time; the identities are not meant to change.
 */
export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "localeText",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "localeBlockContent",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Icon name from the single chosen library (see amenity note).",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "title.en" },
  },
});
