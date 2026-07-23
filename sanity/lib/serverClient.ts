import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Write-capable Sanity client — server-only (API routes, route handlers).
 * Requires SANITY_API_WRITE_TOKEN (a token with Editor/write access, created
 * in manage.sanity.io → API → Tokens). Never import this from a client
 * component or anything under "use client" — the `server-only` import above
 * makes that a build-time error, not just a convention.
 */
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
