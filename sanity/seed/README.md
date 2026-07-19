# Sanity seed data

Import these into the `production` dataset with the Sanity CLI (requires a
deploy/write token — the app's `.env.local` only carries the public read
credentials, so this must be run by someone with write access):

```bash
# from the project root, once `sanity` CLI is authenticated:
npx sanity dataset import sanity/seed/amenities.ndjson production
npx sanity dataset import sanity/seed/showcase-listing.ndjson production
npx sanity dataset import sanity/seed/test-listings.ndjson production
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

Delete the placeholder/QA docs before launch:

```bash
npx sanity documents delete listing.showcase-sundial listing.test-all-amenities listing.test-partial-amenities
```
