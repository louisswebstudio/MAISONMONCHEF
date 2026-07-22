/**
 * Journal / blog taxonomy + the view shape the blog index renders, cloned from
 * Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node 83:595 "blog"). See
 * components/blog/BlogExplorer.tsx.
 *
 * Posts themselves are NO LONGER hardcoded here — they come from the Sanity
 * `blogPost` documents (project 1tsx0da7 / production), fetched with 60s ISR in
 * app/[lang]/blog/page.tsx and the homepage components/sections/Blog.tsx, the
 * same wiring the Collection page uses. This module now holds only the filter
 * taxonomy (categories + read-time buckets) and the {@link BlogPost} view shape
 * those server pages map each CMS document into.
 */

/** Category taxonomy — keys mirror dict.blogPage.categories. */
export const BLOG_CATEGORIES = [
  { value: "news", },
  { value: "sellingGuide" },
  { value: "investment" },
  { value: "buyingTips" },
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]["value"];

/** Read-time buckets — keys mirror dict.blogPage.readTimes. */
export const READ_TIME_BUCKETS = [
  { value: "under5" },
  { value: "5to10" },
  { value: "10to15" },
  { value: "over15" },
] as const;

export type ReadTimeBucket = (typeof READ_TIME_BUCKETS)[number]["value"];

/** Map a minute count to its filter bucket. */
export function readTimeBucket(minutes: number): ReadTimeBucket {
  if (minutes < 5) return "under5";
  if (minutes <= 10) return "5to10";
  if (minutes <= 15) return "10to15";
  return "over15";
}

/**
 * The shape the blog index (BlogExplorer) and homepage journal row render — one
 * per Sanity `blogPost`, mapped from a {@link BlogPostCard} by the server pages
 * that fetch them. `category` is a free string (the CMS field is unconstrained):
 * when it matches a {@link BlogCategory} key it filters and renders translated,
 * otherwise it still renders as authored and simply matches no filter.
 */
export type BlogPost = {
  slug: string;
  /** Raw CMS category — a BlogCategory key when aligned, else free text. */
  category: string;
  title: string;
  excerpt: string;
  /** Reading time in minutes (0 when the CMS field is empty). */
  readMinutes: number;
  /** ISO date (formatted per-locale at render). */
  date: string;
  /** Resolved cover image URL (Sanity CDN, or the local fallback). */
  image: string;
  imageAlt?: string;
};

/** Local stand-in until every post has a cover image uploaded to the CMS. */
export const BLOG_FALLBACK_IMAGE = "/brand/blog/blog-1.png";
