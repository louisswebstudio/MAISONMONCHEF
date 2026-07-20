import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Flexible content-block objects for the `page` document (Home/About/
 * Services/Contact — CLAUDE.md §3). Kept intentionally small: this is
 * scaffolding, not the final section library — extend per-page once real
 * design sections are being built.
 */

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localeString" }),
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({ name: "body", title: "Body", type: "localeText" }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "localeString" })],
    }),
  ],
  preview: { select: { title: "heading.en" }, prepare: ({ title }) => ({ title: title ?? "Hero" }) },
});

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich text",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({ name: "body", title: "Body", type: "localeBlockContent" }),
  ],
  preview: { select: { title: "heading.en" }, prepare: ({ title }) => ({ title: title ?? "Rich text" }) },
});

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Testimonials",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "testimonial" }] })],
    }),
  ],
  preview: { select: { title: "heading.en" }, prepare: ({ title }) => ({ title: title ?? "Testimonials" }) },
});

export const developersSection = defineType({
  name: "developersSection",
  title: "Developers ticker",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({
      name: "developers",
      title: "Developers",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "developer" }] })],
    }),
  ],
  preview: { select: { title: "heading.en" }, prepare: ({ title }) => ({ title: title ?? "Developers" }) },
});

export const ctaBannerSection = defineType({
  name: "ctaBannerSection",
  title: "CTA banner",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({ name: "buttonLabel", title: "Button label", type: "localeString" }),
    defineField({ name: "buttonHref", title: "Button link", type: "string" }),
  ],
  preview: { select: { title: "heading.en" }, prepare: ({ title }) => ({ title: title ?? "CTA banner" }) },
});
