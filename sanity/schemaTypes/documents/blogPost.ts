import { defineType, defineField } from "sanity";

/**
 * Blog post / "Journal" (CLAUDE.md §3 — added to scope by client request).
 * Per-language title/excerpt/body. `readTime` is stored explicitly per the
 * brief rather than computed, so editors control it.
 */
export const blogPost = defineType({
  name: "blogPost",
  title: "Blog post",
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
      options: { source: "title.en", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "localeText",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "localeString" }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "localeBlockContent",
    }),
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      description:
        'Optional. A specific advisor, e.g. "Sarah Monchef". Falls back to the house byline when empty.',
    }),
    defineField({
      name: "authorRole",
      title: "Author role",
      type: "localeString",
      description: 'Optional. Shown under the name, e.g. "Senior Advisor".',
    }),
    defineField({
      name: "readTime",
      title: "Read time (minutes)",
      type: "number",
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Published date, newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title.en", subtitle: "category", media: "coverImage" },
  },
});
