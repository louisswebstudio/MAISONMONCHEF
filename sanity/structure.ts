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
      // Location taxonomy: Regions (3) > Areas (45). Areas default to the
      // region/order ordering rather than alphabetical so the Studio list reads
      // the same way the Collection filter does.
      S.listItem().title("Regions").child(
        S.documentTypeList("areaRegion")
          .title("Regions")
          .defaultOrdering([{ field: "order", direction: "asc" }]),
      ),
      S.listItem().title("Areas").child(
        S.documentTypeList("area")
          .title("Areas")
          .defaultOrdering([
            { field: "region.order", direction: "asc" },
            { field: "order", direction: "asc" },
          ]),
      ),
      S.listItem().title("Developers").child(S.documentTypeList("developer").title("Developers")),
      S.listItem().title("Testimonials").child(S.documentTypeList("testimonial").title("Testimonials")),
      S.divider(),
      S.listItem()
        .title("Contact Submissions")
        .child(
          S.documentTypeList("contactSubmission")
            .title("Contact Submissions")
            .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
        ),
    ]);
