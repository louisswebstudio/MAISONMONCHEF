# Sanity seed data

Import these into the `production` dataset with the Sanity CLI (requires a
deploy/write token — the app's `.env.local` only carries the public read
credentials, so this must be run by someone with write access):

```bash
# from the project root, once `sanity` CLI is authenticated:
npx sanity dataset import sanity/seed/amenities.ndjson production
npx sanity dataset import sanity/seed/showcase-listing.ndjson production
npx sanity dataset import sanity/seed/test-listings.ndjson production
npx sanity dataset import sanity/seed/blog-posts.ndjson production
```

## `amenities.ndjson`

The locked 12-item Amenity taxonomy (title + short description + icon slug),
copy exactly as signed off. Multi-selected per listing via the `amenities`
reference field. `_id`s are stable (`amenity.<slug>`) so re-importing updates
in place rather than duplicating.

**Icons:** the `icon` field holds a slug (`private-pool`, `gym`, …). The real
icon assets exported from Figma node 142:1975 are committed under
`public/brand/amenities/<slug>.svg`; `components/ui/amenity-tile-icons.tsx`
resolves each slug (or the amenity name) to its asset.

## `showcase-listing.ndjson`

The demo/showcase property that mirrors the Figma single-property instance
(node 25:150): `/collection/the-sundial-residence`, Downtown Dubai, with exactly
7 amenities in the Figma order (Private Pool, Gym, Smart Home System, Covered
Parking, Spa / Jacuzzi, Premium View, BBQ Area). Premium View carries a
per-property `descriptionOverride` ("…Downtown Dubai skyline and canal"); the
other six fall back to the shared master copy. Flagged `isPlaceholder`.

The amenity display order follows the array order on the listing (drag to
reorder in the Studio) — the query no longer re-sorts by the amenity's own
`order` field.

## `test-listings.ndjson`

Two QA properties, both flagged `isPlaceholder`, for checking the
Features & Amenities section renders a variable count:

- `/collection/test-all-amenities` — all 12 amenities selected
- `/collection/test-partial-amenities` — 5 amenities selected

## `blog-posts.ndjson`

One `blogPost` document per entry in `lib/blog-posts.ts`, so every card on the
Journal index links to an article page that actually resolves. The file is
GENERATED from that TypeScript array (slug, title, excerpt, category, readTime
and date are copied verbatim) — if you add a post to `lib/blog-posts.ts`, add a
matching document here or the card will 404.

The bodies are placeholder editorial, not real copy: each carries paragraphs,
H3 subheads, a bullet list and one `pullQuote` block so every branch in
`components/blog/ArticleBody.tsx` is exercised. Three posts carry a named
`authorName`/`authorRole`; the rest fall back to the house byline, covering both
states. No `coverImage` is set (no article photography uploaded yet), so the
page falls back to `/brand/blog/blog-1.png` — the same single seeded blog photo
the index uses. `_id`s are stable (`blogPost.<slug>`) so re-importing updates in
place rather than duplicating.

Replace with real posts before launch:

```bash
npx sanity documents delete \
  blogPost.downsizing-your-home \
  blogPost.reading-dubais-off-plan-market \
  blogPost.what-discretion-buys-you \
  blogPost.portfolio-that-outlasts-the-cycle \
  blogPost.buyers-checklist-business-bay \
  blogPost.when-to-hold-when-to-list \
  blogPost.secondary-market-signals \
  blogPost.off-plan-vs-ready \
  blogPost.the-quiet-case-for-long-term-ownership
```

Delete the placeholder/QA docs before launch:

```bash
npx sanity documents delete listing.showcase-sundial listing.test-all-amenities listing.test-partial-amenities
```
