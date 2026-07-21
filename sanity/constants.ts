/**
 * Public-safe Sanity project identifiers, shared by sanity/env.ts (the
 * Next.js app, which reads NEXT_PUBLIC_* at build time) and sanity.cli.ts
 * (the standalone Studio, whose Vite bundle does not reliably expose
 * process.env.* set via .env.local). One literal source avoids relying on
 * env-injection behavior that differs between the two build tools.
 */
export const SANITY_PROJECT_ID = "1tsx0da7";
export const SANITY_DATASET = "production";
export const SANITY_API_VERSION = "2025-01-01";
