/**
 * Sanity environment. In the Next.js app these come from .env.local
 * (NEXT_PUBLIC_*); the standalone Studio (`npm run studio`) falls back to the
 * literals in sanity/constants.ts since its Vite bundle doesn't reliably see
 * process.env.* from .env.local. The write token is never read here and must
 * never be imported into a client component.
 */
import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from "./constants";

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? SANITY_API_VERSION;

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? SANITY_DATASET;

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? SANITY_PROJECT_ID;
