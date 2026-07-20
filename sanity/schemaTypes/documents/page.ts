import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Page — used for Home / The House (About) / Services / Contact (CLAUDE.md
 * §3). Collection and its listing detail template are driven by `listing`
 * documents instead, not this type. Content is a flexible array of section
 * blocks so non-technical staff can reorder/edit without a developer.
 */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      description: "Editorial reference only, not shown on the site.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "localeString",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "localeText",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "richTextSection" }),
        defineArrayMember({ type: "testimonialsSection" }),
        defineArrayMember({ type: "developersSection" }),
        defineArrayMember({ type: "ctaBannerSection" }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
