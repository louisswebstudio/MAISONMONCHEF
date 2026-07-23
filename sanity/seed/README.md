# Sanity seed data

Import these into the `production` dataset with the Sanity CLI (requires a
deploy/write token — the app's `.env.local` only carries the public read
credentials, so this must be run by someone with write access):

```bash
# from the project root, once `sanity` CLI is authenticated:
npx sanity dataset import sanity/seed/areas.ndjson production --replace
npx sanity dataset import sanity/seed/amenities.ndjson production
npx sanity dataset import sanity/seed/showcase-listing.ndjson production
npx sanity dataset import sanity/seed/test-listings.ndjson production
npx sanity dataset import sanity/seed/blog-posts.ndjson production
# greencrest-listings.ndjson is SUPERSEDED by greencrest-project.ndjson — see below.
npx sanity dataset import sanity/seed/greencrest-project.ndjson production
```

## `areas.ndjson` (generated) + `generate-areas.mjs`

The location taxonomy: 3 `areaRegion` documents (Dubai, Abu Dhabi, Northern
Emirates) and the 45 `area` documents under them, in the client-supplied order
(`order` field — deliberately NOT alphabetical). `listing.location` is a
reference into this set; the Collection filter renders one collapsible section
per region.

`areas.ndjson` is GENERATED — edit the list in `generate-areas.mjs` and re-run
it, don't hand-edit the NDJSON:

```bash
node sanity/seed/generate-areas.mjs
npx sanity dataset import sanity/seed/areas.ndjson production --replace
```

`_id`s are deterministic (`region-<slug>` / `area-<slug>`), so `--replace`
upserts rather than duplicating. **Once imported, Sanity is the source of
truth** — an editor adding an area in the Studio appears in the Collection
filter within the page's 60s ISR window, with no deploy and no code change.
Treat `generate-areas.mjs` as the creation record, not a live mirror.

## `migrate-listing-locations.mjs` (one-off, already run)

Converted `listing.location` from the old 10-value string enum
(`LISTING_LOCATIONS`, since deleted from `lib/listings.ts`) to `area`
references. Idempotent and safe to re-run — it skips documents that already
hold a reference, and patches drafts as well as published docs:

```bash
npx sanity exec sanity/seed/migrate-listing-locations.mjs --with-user-token
```

Run it again if a draft that predates the migration is ever published with a
legacy string. Two legacy values (`majan`, `al-yalayis`) have no counterpart in
the 45-area taxonomy; nothing used them, and the script reports rather than
guesses if anything ever does.

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

## `greencrest-project.ndjson` (current) & `greencrest-listings.ndjson` (superseded)

First real (non-placeholder) listing — sourced from a competitor brokerage's
public project page (springfieldproperties.ae), facts only (price, unit mix,
location, handover date, developer), not their marketing copy or photos.
Description text is original.

Greencrest at Dubai Hills Estate, by Emaar — off-plan, Q2 2029 handover. Now
modelled as **one project** (`listing.greencrest-dubai-hills`) with a
`unitTypes[]` breakdown, matching the project-level schema:

- `unitTypes[0]` — 1 Bedroom, AED 1.57M, 774 sq ft
- `unitTypes[1]` — 2 Bedroom, AED 2.60M, 1,266 sq ft
- `unitTypes[2]` — 3 Bedroom, AED 3.89M, 1,735 sq ft

Cards show a computed "From AED 1,570,000" and a 774–1,735 sq ft range; the
detail page renders the three rows in its Unit Types table.

`developer.emaar` (`isPlaceholder: true` — no logo yet) is bundled as the first
line of `greencrest-project.ndjson`, so the project is self-contained for the
developer reference. The three amenity references (`amenity.gym`,
`amenity.kids-play-area`, `amenity.bbq-area`) are NOT bundled — they must already
exist, so **import `amenities.ndjson` before this file** (see the import order at
the top). Only 3 of the source project's ~9 amenities matched the locked 12-item
taxonomy (Gym, Kids Play Area, BBQ Area); the rest were left untagged. No
`gallery` images yet — add real photography before publishing (the source page's
photos aren't ours to use).

### Migration: retire the old single-unit Greencrest docs

`greencrest-listings.ndjson` seeded **three separate** single-unit listings
(`listing.greencrest-1br/2br/3br`) — the pre-`unitTypes` shape. The
project-level model replaces all three with the single doc above. After
importing `greencrest-project.ndjson` **and verifying** the new project card +
detail page render, delete the superseded docs (this is destructive — only run
once the new doc is confirmed live):

```bash
npx sanity documents delete \
  listing.greencrest-1br listing.greencrest-2br listing.greencrest-3br
```
