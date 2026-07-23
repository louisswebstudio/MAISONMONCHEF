/**
 * Generates sanity/seed/areas.ndjson — the 3 `areaRegion` + 45 `area` documents
 * of the location taxonomy, in the client-supplied order (NOT alphabetical).
 *
 *   node sanity/seed/generate-areas.mjs
 *   npx sanity dataset import sanity/seed/areas.ndjson production --replace
 *
 * Document ids are DETERMINISTIC (`region-<slug>` / `area-<slug>`) so re-running
 * the import upserts the same documents instead of creating duplicates, and so
 * listing migrations can build a `_ref` from a slug without a lookup.
 *
 * This file is the CREATION source only. Once imported, the Sanity documents are
 * the source of truth — add or rename areas in the Studio, not here (the
 * Collection filter reads the live documents, so new areas appear without a
 * deploy).
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** Slug rules: lowercase, non-alphanumerics → single dash. "DAMAC Hills 2" → "damac-hills-2". */
const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const TAXONOMY = [
  {
    name: "Dubai",
    areas: [
      "Downtown Dubai",
      "Business Bay",
      "Dubai Marina",
      "Palm Jumeirah",
      "Dubai Harbour",
      "Dubai Creek Harbour",
      "City Walk",
      "Bluewaters Island",
      "Dubai Water Canal",
      "Jumeirah Bay Island",
      "Dubai Maritime City",
      "MBR City",
      "Sobha Hartland",
      "Dubai Hills Estate",
      "Meydan",
      "Arabian Ranches",
      "The Valley",
      "Emaar South",
      "Dubai South",
      "Expo City Dubai",
      "DAMAC Hills",
      "DAMAC Hills 2",
      "JVC",
      "JVT",
      "Arjan",
      "Motor City",
      "Dubai Sports City",
      "Al Furjan",
      "Dubai Islands",
      "Palm Jebel Ali",
    ],
  },
  {
    name: "Abu Dhabi",
    areas: [
      "Saadiyat Island",
      "Yas Island",
      "Al Reem Island",
      "Al Raha Beach",
      "Hudayriyat Island",
      "Al Maryah Island",
      "Masdar City",
    ],
  },
  {
    name: "Northern Emirates",
    areas: [
      "Al Marjan Island",
      "Mina Al Arab",
      "Al Hamra Village",
      "Hayat Island",
      "RAK Central",
      "Siniya Island",
      "Downtown Umm Al Quwain",
      "Al Salam City",
    ],
  },
];

const docs = [];

TAXONOMY.forEach((region, regionIndex) => {
  const regionSlug = slugify(region.name);
  const regionId = `region-${regionSlug}`;

  docs.push({
    _id: regionId,
    _type: "areaRegion",
    name: region.name,
    slug: { _type: "slug", current: regionSlug },
    order: regionIndex + 1,
  });

  region.areas.forEach((areaName, areaIndex) => {
    const areaSlug = slugify(areaName);
    docs.push({
      _id: `area-${areaSlug}`,
      _type: "area",
      name: areaName,
      slug: { _type: "slug", current: areaSlug },
      region: { _type: "reference", _ref: regionId },
      order: areaIndex + 1,
    });
  });
});

const outPath = join(dirname(fileURLToPath(import.meta.url)), "areas.ndjson");
writeFileSync(outPath, docs.map((d) => JSON.stringify(d)).join("\n") + "\n", "utf8");

const areaCount = docs.filter((d) => d._type === "area").length;
console.log(`Wrote ${docs.length} docs (${TAXONOMY.length} regions + ${areaCount} areas) → ${outPath}`);
