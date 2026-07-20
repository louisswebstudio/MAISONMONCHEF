import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Read-only Sanity client for the Next.js app. `useCdn: false` keeps content
 * fresh in the App Router (pair with Next's own caching/revalidation). Never
 * attach a write token here — this can run in the browser.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});
