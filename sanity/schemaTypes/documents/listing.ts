import { defineType, defineField, defineArrayMember } from "sanity";
import { LISTING_STATUSES, LISTING_CATEGORIES } from "../../../lib/listings";

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
    // Location is a REFERENCE into the `area` taxonomy (45 UAE areas grouped
    // under 3 regions), not the old 10-value string enum — so the Collection
    // filter, the card labels and the CMS share one source of truth and a new
    // area is a content edit rather than a code change. Legacy string values
    // were migrated by sanity/seed/migrate-listing-locations.mjs.
    defineField({
      name: "location",
      title: "Location",
      type: "reference",
      group: "specs",
      to: [{ type: "area" }],
      description:
        "Real UAE areas only (Dubai / Abu Dhabi / Northern Emirates) — never US placeholder locations.",
      // The taxonomy is seeded and published; never offer a draft area.
      options: { filter: "!(_id in path('drafts.**'))" },
      validation: (rule) => rule.required(),
    }),
    // --- Unit types (project-level model). A listing is a PROJECT; each entry
    // here is one unit configuration (1 Bedroom, 3 Bedroom Townhouse, …) with
    // its own price and size. Cards show a computed starting price + size range
    // (see the GROQ `startingPrice`/`minSize`/`maxSize` in sanity/lib/queries.ts,
    // which are derived from this array — not entered by hand). The single-unit
    // price/bedrooms/bathrooms/sizeSqft fields below are DEPRECATED, kept only so
    // legacy documents aren't destroyed until they're migrated to unitTypes.
    defineField({
      name: "unitTypes",
      title: "Unit Types",
      type: "array",
      group: "specs",
      description:
        "One entry per unit configuration in this project (e.g. 1 Bedroom, 3 Bedroom Townhouse). The 'from' price and size range shown on listing cards are computed from these — you don't enter them separately.",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "unitType",
          title: "Unit Type",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "localeString",
              description: 'e.g. "1 Bedroom", "3 Bedroom Townhouse", "Studio".',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Price (AED)",
              type: "number",
              validation: (rule) => rule.required().positive(),
            }),
            defineField({
              name: "bedrooms",
              title: "Bedrooms",
              type: "number",
              description: "Use 0 for a studio.",
              validation: (rule) => rule.min(0).integer(),
            }),
            defineField({
              name: "bathrooms",
              title: "Bathrooms",
              type: "number",
              validation: (rule) => rule.min(0).integer(),
            }),
            defineField({
              name: "minSizeSqft",
              title: "Min size (sq ft)",
              type: "number",
              validation: (rule) => rule.required().positive(),
            }),
            defineField({
              name: "maxSizeSqft",
              title: "Max size (sq ft)",
              type: "number",
              description: "Leave empty if the size is fixed (same as min).",
              validation: (rule) => rule.positive(),
            }),
            defineField({
              name: "unitsAvailable",
              title: "Units available",
              type: "number",
              validation: (rule) => rule.min(0).integer(),
            }),
          ],
          preview: {
            select: { label: "label.en", price: "price", beds: "bedrooms" },
            prepare: ({ label, price, beds }) => ({
              title:
                label ?? (beds === 0 ? "Studio" : beds != null ? `${beds} Bedroom` : "Unit type"),
              subtitle:
                price != null ? `AED ${price.toLocaleString("en-US")}` : "No price set",
            }),
          },
        }),
      ],
    }),

    // --- DEPRECATED single-unit fields (superseded by unitTypes[]). Kept, but
    // hidden/read-only, so existing documents keep their data during migration;
    // they vanish from the editor once a doc has no legacy value. Do not remove
    // until every listing has been migrated (see plan §8).
    defineField({
      name: "price",
      title: "Price (AED) — legacy",
      type: "number",
      group: "specs",
      readOnly: true,
      deprecated: { reason: "Replaced by unitTypes[] — legacy data kept for migration." },
      hidden: ({ value }) => value === undefined,
    }),
    defineField({
      name: "bedrooms",
      title: "Bedrooms — legacy",
      type: "number",
      group: "specs",
      readOnly: true,
      deprecated: { reason: "Replaced by unitTypes[] — legacy data kept for migration." },
      hidden: ({ value }) => value === undefined,
    }),
    defineField({
      name: "bathrooms",
      title: "Bathrooms — legacy",
      type: "number",
      group: "specs",
      readOnly: true,
      deprecated: { reason: "Replaced by unitTypes[] — legacy data kept for migration." },
      hidden: ({ value }) => value === undefined,
    }),
    defineField({
      name: "sizeSqft",
      title: "Living Space (sq ft) — legacy",
      type: "number",
      group: "specs",
      readOnly: true,
      deprecated: { reason: "Replaced by unitTypes[] — legacy data kept for migration." },
      hidden: ({ value }) => value === undefined,
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
    select: { title: "name.en", subtitle: "location.name", media: "gallery.0", placeholder: "isPlaceholder" },
    prepare: ({ title, subtitle, media, placeholder }) => ({
      title: placeholder ? `⚠ ${title} (placeholder)` : title,
      subtitle,
      media,
    }),
  },
});
