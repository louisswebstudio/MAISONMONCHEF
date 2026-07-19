import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

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
            <div className="flex items-center gap-[6px] pl-[2px]">
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
              <BlogCard lang={lang} item={item} minutesLabel={t.minutes} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

type BlogItem = Dictionary["blog"]["items"][number];

function BlogCard({
  lang,
  item,
  minutesLabel,
}: {
  lang: Locale;
  item: BlogItem;
  minutesLabel: string;
}) {
  return (
    <Link
      href={`/${lang}/blog`}
      className="card-surface card-interactive group flex h-full flex-col gap-[10px] p-[10px]"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>

      <div className="flex flex-col items-start gap-[10px] p-[10px]">
        <span className="bg-warm-taupe px-[12px] py-[4px] text-[16px] font-normal leading-[24px] tracking-[0.3px] text-white">
          {item.category}
        </span>

        <h3 className="text-[20px] font-medium leading-[30.8px] text-navy">
          {item.title}
        </h3>

        <div aria-hidden className="w-full border-t border-linen" />

        <div className="flex items-center gap-[19px] text-navy">
          <span className="flex items-center gap-[5px] py-[6px]">
            <BookIcon />
            <span className="flex items-center gap-[4px]">
              <span className="text-[14px] font-normal leading-[24px] tracking-[0.3px]">
                {item.minutes}
              </span>
              <span className="text-[12px] font-normal leading-[24px] tracking-[0.3px]">
                {minutesLabel}
              </span>
            </span>
          </span>
          <span className="flex items-center gap-[5px] py-[6px]">
            <CalendarIcon />
            <span className="text-[12px] font-normal leading-[24px] tracking-[0.3px]">
              {item.date}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Open-book read-time mark (node 64:1726) — 1:1 from Figma. */
function BookIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M18.125 3.75H12.5C12.0149 3.75 11.5364 3.86295 11.1025 4.07992C10.6685 4.29688 10.2911 4.61189 10 5C9.70892 4.61189 9.33147 4.29688 8.89754 4.07992C8.46362 3.86295 7.98514 3.75 7.5 3.75H1.875C1.70924 3.75 1.55027 3.81585 1.43306 3.93306C1.31585 4.05027 1.25 4.20924 1.25 4.375V15.625C1.25 15.7908 1.31585 15.9497 1.43306 16.0669C1.55027 16.1842 1.70924 16.25 1.875 16.25H7.5C7.99728 16.25 8.47419 16.4475 8.82583 16.7992C9.17746 17.1508 9.375 17.6277 9.375 18.125C9.375 18.2908 9.44085 18.4497 9.55806 18.5669C9.67527 18.6842 9.83424 18.75 10 18.75C10.1658 18.75 10.3247 18.6842 10.4419 18.5669C10.5592 18.4497 10.625 18.2908 10.625 18.125C10.625 17.6277 10.8225 17.1508 11.1742 16.7992C11.5258 16.4475 12.0027 16.25 12.5 16.25H18.125C18.2908 16.25 18.4497 16.1842 18.5669 16.0669C18.6842 15.9497 18.75 15.7908 18.75 15.625V4.375C18.75 4.20924 18.6842 4.05027 18.5669 3.93306C18.4497 3.81585 18.2908 3.75 18.125 3.75ZM7.5 15C6.82367 14.9989 6.16542 15.2183 5.625 15.625H2.5V5H7.5C7.99728 5 8.47419 5.19754 8.82583 5.54917C9.17746 5.90081 9.375 6.37772 9.375 6.875V15.625C8.83458 15.2183 8.17633 14.9989 7.5 15ZM17.5 15H14.375C13.6987 14.9989 13.0404 15.2183 12.5 15.625V6.875C12.5 6.37772 12.6975 5.90081 13.0492 5.54917C13.4008 5.19754 13.8777 5 14.375 5H17.5V15Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Calendar date mark (node 64:1739) — 1:1 from Figma. */
function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M16.25 2.5H14.375V1.875C14.375 1.70924 14.3092 1.55027 14.1919 1.43306C14.0747 1.31585 13.9158 1.25 13.75 1.25C13.5842 1.25 13.4253 1.31585 13.3081 1.43306C13.1908 1.55027 13.125 1.70924 13.125 1.875V2.5H6.875V1.875C6.875 1.70924 6.80915 1.55027 6.69194 1.43306C6.57473 1.31585 6.41576 1.25 6.25 1.25C6.08424 1.25 5.92527 1.31585 5.80806 1.43306C5.69085 1.55027 5.625 1.70924 5.625 1.875V2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM5.625 3.75V4.375C5.625 4.54076 5.69085 4.69973 5.80806 4.81694C5.92527 4.93415 6.08424 5 6.25 5C6.41576 5 6.57473 4.93415 6.69194 4.81694C6.80915 4.69973 6.875 4.54076 6.875 4.375V3.75H13.125V4.375C13.125 4.54076 13.1908 4.69973 13.3081 4.81694C13.4253 4.93415 13.5842 5 13.75 5C13.9158 5 14.0747 4.93415 14.1919 4.81694C14.3092 4.69973 14.375 4.54076 14.375 4.375V3.75H16.25V6.25H3.75V3.75H5.625ZM16.25 16.25H3.75V7.5H16.25V16.25Z"
        fill="currentColor"
      />
    </svg>
  );
}
