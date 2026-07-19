import "server-only";
import type { Locale } from "./config";
import type DictionaryShape from "@/dictionaries/en.json";

/**
 * Server-only dictionary loader. Each locale's UI strings live in
 * `dictionaries/<locale>.json` and are dynamically imported so only the
 * requested locale ships to the server render — never to the client bundle.
 *
 * NOTE (blocker, see CLAUDE.md §7.6): EN is the final brand voice. Ownership of
 * AR/FR translation (client vs. agency) is unconfirmed. The AR/FR strings here
 * are reasonable UI-chrome defaults to make RTL and routing testable — page
 * body copy still needs sign-off from whoever owns translation.
 */

// NOTE: deliberately no `satisfies Record<Locale, ...>` on the object below —
// TS's contextual typing from a `satisfies` clause against a `Promise<unknown>`
// return type bled into the `.then((m) => m.default)` callbacks and collapsed
// the whole inferred `Dictionary` type to `unknown`. Locale-key completeness
// is still enforced structurally: `getDictionary` indexes this object by
// `Locale`, so a missing locale key fails to compile anyway.

/** The canonical dictionary shape — the English source is the source of truth. */
export type Dictionary = typeof DictionaryShape;

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  ar: () => import("@/dictionaries/ar.json").then((m) => m.default),
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]() as Promise<Dictionary>;
