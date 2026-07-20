import { defineType, defineField } from "sanity";

/**
 * Editorial block types that can be dropped INTO a `localeBlockContent` body
 * (see localeFields.ts). The single Blog Article page renders long-form copy in
 * a narrow reading column, and unbroken text reads as a dense blog rather than
 * the magazine/editorial page the brand wants — so the body array carries two
 * rhythm-breakers beyond paragraphs, H3s and lists:
 *
 *  - `articleImage` — a full-reading-width inline photo. `caption` is optional
 *    and localized; when absent the renderer emits no <figcaption> at all.
 *  - `pullQuote`    — a short lifted line, set large with a warm-taupe rule.
 *
 * Both are plain objects (not documents): they only ever exist inline in a body.
 */

export const articleImage = defineType({
  name: "articleImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", title: "Alt text", type: "localeString" }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "localeString",
      description: "Optional. Shown under the image; leave empty for none.",
    }),
  ],
  preview: {
    select: { title: "caption.en", subtitle: "alt.en", media: "asset" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || subtitle || "Image",
      subtitle: title ? subtitle : undefined,
      media,
    }),
  },
});

export const pullQuote = defineType({
  name: "pullQuote",
  title: "Pull quote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "localeText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
      description: "Optional — e.g. a named advisor.",
    }),
  ],
  preview: {
    select: { title: "quote.en", subtitle: "attribution" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Pull quote",
      subtitle,
    }),
  },
});
