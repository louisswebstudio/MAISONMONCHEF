import { defineCliConfig } from "sanity/cli";
import { SANITY_DATASET, SANITY_PROJECT_ID } from "./sanity/constants";

/**
 * Required for the standalone `sanity` CLI (studio/studio:deploy) — it does
 * not read Next's NEXT_PUBLIC_* env loading, so projectId/dataset come from
 * the shared constants (see sanity/env.ts).
 */
export default defineCliConfig({
  api: {
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
  },
});
