import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";

/**
 * Standalone Sanity Studio (see README "CMS: embedded vs. standalone" for the
 * tradeoff). Run with `npm run studio` locally; deploy with `npm run
 * studio:deploy` to Sanity's free *.sanity.studio hosting, independent of the
 * Next.js app's own deploy pipeline.
 */
export default defineConfig({
  name: "maison-monchef",
  title: "Maison Monchef",
  projectId,
  dataset,
  schema,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
