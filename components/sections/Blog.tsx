import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { BlogCard } from "@/components/ui/BlogCard";
import { BLOG_POSTS } from "@/lib/blog-posts";

/**
 * "Blog" — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node 138:3440
 * "Container → Content"). Authored as a fixed 1240px desktop frame: eyebrow +
 * heading with a "View More" CTA bottom-right, over three 384px article cards
 * (square photo, gold category chip, title, hairline divider, read-time and
 * date row).
 *
 * Figma's three cards were the same placeholder article repeated with no
 * slug to link to; now that real posts exist (lib/blog-posts.ts, mirrored in
 * the Sanity seed), this shows the 3 latest and each card links straight to
 * its own article at /blog/<slug> — same as the article page's own Related
 * Blogs row (app/[lang]/blog/[slug]/page.tsx). Cards reflow 1→2→3 columns (no
 * mobile frame supplied). Figma's chip gold #8a795b is exactly the warm-taupe
 * token; the divider SVG is a 1px #ededed rule, reproduced as a border.
 * `#f7f7f7` (card frame) has no design token.
 *
 * NOTE: this section's heading is 48px MEDIUM / -1.44px in Figma — a step
 * outside the 46px semibold / -1.84px used by the other home sections; kept
 * as authored.
 */

export function Blog({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.blog;
  const base = `/${lang}`;
  const categories = dict.blogPage.categories as Record<string, string>;

  const latest = [...BLOG_POSTS]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 3);

  return (
    <section className="w-full py-section">
      <Container className="flex flex-col gap-[64px]">
        {/* Header — title left, CTA bottom-right */}
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-[16px] pb-[4px]">
            <div className="flex items-center gap-[6px] ps-[2px]">
              <span
                aria-hidden
                className="flex items-center justify-center rounded-hairline border border-navy p-[3px]"
              >
                <span className="size-[6px] bg-warm-taupe" />
              </span>
              <span className="text-[12px] font-semibold uppercase leading-[21px] tracking-[0.18em] text-navy">
                {t.eyebrow}
              </span>
            </div>
            <h2 className="font-display text-[38px] font-medium leading-[1.1] text-navy sm:text-[54px]">
              {t.heading}
            </h2>
          </div>

          <Button
            href={`${base}/blog`}
            variant="primary"
            className="shrink-0 self-start sm:self-auto"
          >
            {t.viewMore}
          </Button>
        </Reveal>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-[40px] sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 110} className="h-full">
              <BlogCard
                data={{
                  href: `${base}/blog/${post.slug}`,
                  image: post.image,
                  category: categories[post.category] ?? post.category,
                  title: post.title,
                  minutes: post.readMinutes,
                  date: formatDate(post.date, lang),
                }}
                minutesLabel={t.minutes}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
