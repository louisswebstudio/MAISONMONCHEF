import { defineType, defineField, defineArrayMember } from "sanity";
import { LISTING_STATUSES, LISTING_CATEGORIES, LISTING_LOCATIONS } from "../../../lib/listings";

/** Sanity's `options.list` wants `{value, title}`; the shared taxonomy (also
 * consumed by the future filter UI) uses `{value, label}` — map at this
 * boundary rather than renaming the shared source of truth. */
const toSanityList = (items: readonly { value: string; label: string }[]) =>
  items.map(({ value, label }) => ({ value, title: label }));

/**
 * Listing — the Collection/Portfolio is a real filterable system (Status,
 * Category, Price Range, Location), not a static showcase (CLAUDE.md §3).
 * SALES ONLY: `status` options come from lib/listings.ts and there is
 * deliberately no rental/lease value — never add one (CLAUDE.md §1).
 *
 * name/description are per-language; numeric/filterable fields (price, beds,
 * baths, size, status, category, location) are NOT localized, since filters
 * must compare consistently across languages.
 *
 * Do not launch with placeholder listings (CLAUDE.md §7.5) — this schema
 * exists so real data can be entered, not so placeholder rows go live.
 */
export const listing = defineType({
  name: "listing",
  title: "Listing",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "specs", title: "Specs & Filters" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "localeString",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name.en", maxLength: 96 },
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeBlockContent",
      group: "content",
    }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "specs",
      options: { list: toSanityList(LISTING_STATUSES) },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "specs",
      options: { list: toSanityList(LISTING_CATEGORIES) },
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "specs",
      description: "Real Dubai areas only — never US placeholder locations.",
      options: { list: toSanityList(LISTING_LOCATIONS) },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (AED)",
      type: "number",
      group: "specs",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "bedrooms",
      title: "Bedrooms",
      type: "number",
      group: "specs",
    }),
    defineField({
      name: "bathrooms",
      title: "Bathrooms",
      type: "number",
      group: "specs",
    }),
    defineField({
      name: "sizeSqft",
      title: "Living Space (sq ft)",
      type: "number",
      group: "specs",
      description: "Interior living space in square feet — shown as 'Living Space' in the Property Info table.",
    }),
    // --- Fields added for the single Property Listing page's "Property Info"
    // table + video block (node 25:33). Flag to the client before locking:
    // Completion Year, Floors, and Video URL did not exist on the schema before.
    defineField({
      name: "completionYear",
      title: "Completion Year",
      type: "number",
      group: "specs",
      description: "Handover / completion year, e.g. 2026. Shown in the Property Info table.",
      validation: (rule) => rule.min(1900).max(2100).integer(),
    }),
    defineField({
      name: "floors",
      title: "Floors",
      type: "number",
      group: "specs",
      description: "Number of floors/levels in the residence. Shown in the Property Info table.",
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      group: "media",
      description: "Property walkthrough video (YouTube/Vimeo embed URL or MP4). Leave empty until a real asset exists — the page shows a clearly-marked placeholder when unset.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      group: "specs",
      description:
        "Selected from the locked 12-item amenity taxonomy — not free text. Drag to set the display ORDER shown on the property page (the order here is preserved, it is not re-sorted).",
      of: [
        defineArrayMember({
          type: "object",
          name: "amenitySelection",
          title: "Amenity",
          fields: [
            defineField({
              name: "amenity",
              title: "Amenity",
              type: "reference",
              to: [{ type: "amenity" }],
              validation: (rule) => rule.required(),
            }),
            // Optional per-property copy. The Figma demo (node 25:150) shows a
            // location-specific line for Premium View ("…Downtown Dubai skyline
            // and canal") that differs from the generic master-list copy — a
            // Premium View means something different per building. When set,
            // this overrides the amenity's own description for THIS property
            // only; when empty, the shared master description is used.
            defineField({
              name: "descriptionOverride",
              title: "Description override (this property only)",
              type: "localeString",
              description:
                "Optional. Overrides the amenity's default description for this property — e.g. name the actual view. Leave empty to use the shared master copy.",
            }),
          ],
          preview: {
            select: { title: "amenity.name.en", subtitle: "descriptionOverride.en" },
            prepare: ({ title, subtitle }) => ({
              title: title ?? "Amenity",
              subtitle: subtitle ? `Override: ${subtitle}` : "Master description",
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "developer",
      title: "Developer",
      type: "reference",
      group: "specs",
      to: [{ type: "developer" }],
    }),

    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "localeString" }),
          ],
        }),
      ],
    }),

    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "isPlaceholder",
      title: "Placeholder content (do not publish live)",
      type: "boolean",
      group: "content",
      description: "Every listing in the current designs is placeholder brand-voice content, not real data — flag it here until real data replaces it.",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "name.en", subtitle: "location", media: "gallery.0", placeholder: "isPlaceholder" },
    prepare: ({ title, subtitle, media, placeholder }) => ({
      title: placeholder ? `⚠ ${title} (placeholder)` : title,
      subtitle,
      media,
    }),
  },
});
