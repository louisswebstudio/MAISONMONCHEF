/**
 * One-off migration: `listing.location` from a plain string (the old 10-value
 * LISTING_LOCATIONS enum) to a reference into the new `area` taxonomy.
 *
 *   npx sanity exec sanity/seed/migrate-listing-locations.mjs --with-user-token
 *
 * Idempotent: documents whose `location` is already a reference are skipped, so
 * it is safe to re-run (e.g. after an editor publishes a draft that still holds
 * a legacy string). Patches drafts as well as published documents.
 *
 * Two legacy values — `majan` and `al-yalayis` — have NO counterpart in the
 * 45-area taxonomy the client supplied. Nothing currently uses them; if a
 * document ever does, this script reports it and leaves the field untouched
 * rather than guessing an area.
 */
import { getCliClient } from "sanity/cli";

/** Legacy enum value → `area` document id (deterministic ids from generate-areas.mjs). */
const LEGACY_TO_AREA = {
  "business-bay": "area-business-bay",
  "palm-jumeirah": "area-palm-jumeirah",
  "palm-jebel-ali": "area-palm-jebel-ali",
  "downtown-dubai": "area-downtown-dubai",
  "dubai-marina": "area-dubai-marina",
  // The old label was "Dubai Hills"; the taxonomy's name is "Dubai Hills Estate".
  "dubai-hills": "area-dubai-hills-estate",
  "dubai-south": "area-dubai-south",
  arjan: "area-arjan",
  // No taxonomy counterpart — see the note above.
  majan: null,
  "al-yalayis": null,
};

const client = getCliClient();

const listings = await client.fetch(
  `*[_type == "listing" && defined(location)]{ _id, "name": name.en, location }`,
);

const unmapped = [];
let patched = 0;
let alreadyDone = 0;

const tx = client.transaction();

for (const doc of listings) {
  if (typeof doc.location !== "string") {
    alreadyDone++;
    continue;
  }
  const areaId = LEGACY_TO_AREA[doc.location];
  if (!areaId) {
    unmapped.push(doc);
    continue;
  }
  tx.patch(doc._id, (p) =>
    p.set({ location: { _type: "reference", _ref: areaId } }),
  );
  patched++;
  console.log(`  ${doc._id} (${doc.name}): "${doc.location}" → ${areaId}`);
}

if (patched > 0) {
  await tx.commit();
}

console.log(
  `\nDone. ${patched} patched, ${alreadyDone} already referencing an area, ${unmapped.length} unmapped.`,
);
for (const doc of unmapped) {
  console.warn(`  UNMAPPED: ${doc._id} (${doc.name}) has location "${doc.location}" — set it by hand in the Studio.`);
}
