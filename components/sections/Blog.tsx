import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { BlogCard } from "@/components/ui/BlogCard";

/**
 * "Blog" — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node 138:3440
 * "Container → Content"). Authored as a fixed 1240px desktop frame: eyebrow +
 * heading with a "View More" CTA bottom-right, over three 384px article cards
 * (square photo, gold category chip, title, hairline divider, read-time and
 * date row).
 *
 * The three cards in Figma are the SAME placeholder article repeated — no real
 * posts exist yet — so the card content (title, category, date, image) is
 * placeholder data in the dictionaries, and every card links to the journal
 * index rather than a slug. Cards reflow 1→2→3 columns (no mobile frame
 * supplied). Figma's chip gold #8a795b is exactly the warm-taupe token; the
 * divider SVG is a 1px #ededed rule, reproduced as a border. `#f7f7f7` (card
 * frame) has no design token.
 *
 * NOTE: this section's heading is 48px MEDIUM / -1.44px in Figma — a step
 * outside the 46px semibold / -1.84px used by the other home sections; kept
 * as authored.
 */

export function Blog({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.blog;
  const base = `/${lang}`;

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
          {t.items.map((item, i) => (
            <Reveal key={i} delay={(i % 3) * 110} className="h-full">
              <BlogCard
                data={{
                  href: `${base}/blog`,
                  image: item.image,
                  category: item.category,
                  title: item.title,
                  minutes: item.minutes,
                  date: item.date,
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
