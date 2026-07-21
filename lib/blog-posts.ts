/**
 * Journal / blog posts — the article grid on the blog page, cloned from Figma
 * (file r2XTjIJ5uaZ0VFCG2kfCdn, node 83:595 "blog"). See
 * components/blog/BlogExplorer.tsx.
 *
 * PLACEHOLDER CONTENT (see CLAUDE.md §7.5): the Figma frame repeats one mock
 * card ("Downsizing Your Home…", Investment, 6 minutes, May 27 2026) six times.
 * That is scaffold, not real editorial — replaced here with a spread of tasteful
 * real-estate insight posts so the filters, sort, and Load More can be
 * exercised. Real posts will come from the CMS `post` documents (mirrors the
 * Collection page's Sanity wiring); until then these stand in. Titles/excerpts
 * are the English source of truth; only the taxonomy labels are translated
 * (via dict.blogPage). `blog-1.png` is the single seeded blog photo — swap for
 * per-post imagery when the CMS media is uploaded.
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

export type BlogPost = {
  slug: string;
  category: BlogCategory;
  /** English source title. */
  title: string;
  /** English source excerpt. */
  excerpt: string;
  /** Reading time in minutes. */
  readMinutes: number;
  /** ISO date (formatted per-locale at render). */
  date: string;
  image: string;
};

const IMG = "/brand/blog/blog-1.png";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "downsizing-your-home",
    category: "sellingGuide",
    title: "Downsizing Your Home: Tips for a Smooth Transition",
    excerpt:
      "Practical guidance for downsizing without losing what matters most about home.",
    readMinutes: 6,
    date: "2026-05-27",
    image: IMG,
  },
  {
    slug: "reading-dubais-off-plan-market",
    category: "investment",
    title: "Reading Dubai's Off-Plan Market in 2026",
    excerpt:
      "Where the fundamentals point this year, and the projects worth waiting for.",
    readMinutes: 9,
    date: "2026-05-14",
    image: IMG,
  },
  {
    slug: "what-discretion-buys-you",
    category: "news",
    title: "What Discretion Actually Buys You in a Sale",
    excerpt:
      "Why the quietest transactions often close on the strongest terms.",
    readMinutes: 4,
    date: "2026-04-30",
    image: IMG,
  },
  {
    slug: "portfolio-that-outlasts-the-cycle",
    category: "investment",
    title: "Building a Portfolio That Outlasts the Cycle",
    excerpt:
      "A considered acquisition strategy for wealth that compounds across decades, not quarters.",
    readMinutes: 12,
    date: "2026-04-18",
    image: IMG,
  },
  {
    slug: "buyers-checklist-business-bay",
    category: "buyingTips",
    title: "The Buyer's Checklist for Business Bay",
    excerpt:
      "The questions to ask before you commit, from service charges to skyline.",
    readMinutes: 7,
    date: "2026-03-29",
    image: IMG,
  },
  {
    slug: "when-to-hold-when-to-list",
    category: "sellingGuide",
    title: "When to Hold, When to List: A Seller's Framework",
    excerpt:
      "Reading demand, timing, and motivation so you sell from a position of strength.",
    readMinutes: 11,
    date: "2026-03-10",
    image: IMG,
  },
  {
    slug: "secondary-market-signals",
    category: "news",
    title: "Secondary Market Signals Worth Watching",
    excerpt:
      "The indicators that tell you where established communities are heading next.",
    readMinutes: 5,
    date: "2026-02-24",
    image: IMG,
  },
  {
    slug: "off-plan-vs-ready",
    category: "buyingTips",
    title: "Off-Plan vs. Ready: Choosing Your Entry Point",
    excerpt:
      "Weighing payment plans, timelines, and risk to match a purchase to your goals.",
    readMinutes: 8,
    date: "2026-02-06",
    image: IMG,
  },
  {
    slug: "the-quiet-case-for-long-term-ownership",
    category: "investment",
    title: "The Quiet Case for Long-Term Ownership",
    excerpt:
      "Patience as strategy: how holding well-chosen assets outperforms the churn.",
    readMinutes: 15,
    date: "2026-01-20",
    image: IMG,
  },
];
