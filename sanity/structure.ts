import type { StructureResolver } from "sanity/structure";

/**
 * Studio desk structure, grouped roughly along the management/agents/
 * marketing access levels named in CLAUDE.md §0 — Pages + Services + Contact
 * content skews marketing/management, Listings skews agents, Site content
 * (amenities/developers/testimonials) is shared reference data.
 *
 * This groups navigation only. Actual role-based PERMISSIONS (who can edit
 * what) require Sanity's role-based access control, which is a paid-plan
 * feature — see README "CMS roles & plan tier" before assuming this is
 * enforced today.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Maison Monchef")
    .items([
      S.listItem().title("Pages").child(S.documentTypeList("page").title("Pages")),
      S.listItem().title("Services").child(S.documentTypeList("service").title("Services")),
      S.divider(),
      S.listItem().title("Listings").child(S.documentTypeList("listing").title("Listings")),
      S.divider(),
      S.listItem().title("Blog").child(S.documentTypeList("blogPost").title("Blog posts")),
      S.divider(),
      S.listItem().title("Amenities").child(S.documentTypeList("amenity").title("Amenities")),
      S.listItem().title("Developers").child(S.documentTypeList("developer").title("Developers")),
      S.listItem().title("Testimonials").child(S.documentTypeList("testimonial").title("Testimonials")),
    ]);
