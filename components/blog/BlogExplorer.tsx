"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { ButtonButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import {
  BLOG_POSTS,
  BLOG_CATEGORIES,
  READ_TIME_BUCKETS,
  readTimeBucket,
  type BlogPost,
} from "@/lib/blog-posts";

/**
 * Blog filter panel + article grid — cloned from Figma (file
 * r2XTjIJ5uaZ0VFCG2kfCdn, node 83:595 "blog"): a 300px filter card (Sort By
 * select, Category / Read Time checkbox groups split by a hairline) beside a
 * 2-up grid of BLOG CARDs with a "Load More" button. Mirrors the Collection
 * page's explorer so the two catalogue pages behave identically; the sidebar
 * stacks above the grid below lg (no mobile frame supplied).
 *
 * Filtering, sorting and paging are client-side over the static placeholder set
 * (lib/blog-posts.ts) — trivially cheap, and the real posts will arrive as a
 * small CMS collection. `#eaeaea` (borders) and `#f3f2f0` (input fill) match the
 * Collection filter panel; the card is the premium `bg-paper` treatment.
 */

const PAGE_SIZE = 6;

type Filters = { categories: string[]; readTimes: string[] };
type SortOrder = "latest" | "oldest";

export function BlogExplorer({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const t = dict.blogPage;
  const [filters, setFilters] = useState<Filters>({ categories: [], readTimes: [] });
  const [sort, setSort] = useState<SortOrder>("latest");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const hasFilters = filters.categories.length > 0 || filters.readTimes.length > 0;

  const results = useMemo(() => {
    const filtered = BLOG_POSTS.filter((p) => {
      if (filters.categories.length > 0 && !filters.categories.includes(p.category))
        return false;
      if (
        filters.readTimes.length > 0 &&
        !filters.readTimes.includes(readTimeBucket(p.readMinutes))
      )
        return false;
      return true;
    });
    return filtered.sort((a, b) => {
      const diff = +new Date(b.date) - +new Date(a.date);
      return sort === "latest" ? diff : -diff;
    });
  }, [filters, sort]);

  const update = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setVisible(PAGE_SIZE); // any filter change resets paging
  };

  const toggle = (key: keyof Filters, value: string) =>
    update({
      [key]: filters[key].includes(value)
        ? filters[key].filter((v) => v !== value)
        : [...filters[key], value],
    });

  return (
    <div className="flex flex-col gap-[32px] lg:flex-row lg:items-start">
      {/* Filter panel */}
      <aside className="w-full shrink-0 rounded-hairline border border-[#eaeaea] bg-white px-[24px] pb-[24px] pt-[23px] lg:sticky lg:top-[112px] lg:w-[300px]">
        <div className="flex flex-col gap-[23px]">
          {/* Sort By */}
          <div className="flex flex-col gap-[8px]">
            <FilterLabel>{t.sortBy}</FilterLabel>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOrder)}
                className="w-full appearance-none rounded-hairline border border-[#eaeaea] bg-[#f3f2f0] p-[12px] pe-[38px] text-[16px] leading-[20.8px] text-navy outline-none focus-visible:outline-2 focus-visible:outline-navy"
              >
                <option value="latest">{t.sortLatest}</option>
                <option value="oldest">{t.sortOldest}</option>
              </select>
              <ChevronIcon />
            </div>
          </div>

          <CheckboxGroup
            label={t.category}
            options={BLOG_CATEGORIES.map((c) => ({
              value: c.value,
              label: t.categories[c.value],
            }))}
            selected={filters.categories}
            onToggle={(v) => toggle("categories", v)}
          />

          <Divider />

          <CheckboxGroup
            label={t.readTime}
            options={READ_TIME_BUCKETS.map((r) => ({
              value: r.value,
              label: t.readTimes[r.value],
            }))}
            selected={filters.readTimes}
            onToggle={(v) => toggle("readTimes", v)}
          />

          {hasFilters && (
            <button
              type="button"
              onClick={() => update({ categories: [], readTimes: [] })}
              className="self-start text-[14px] font-medium text-warm-taupe underline-offset-4 transition-colors hover:underline"
            >
              {t.clear}
            </button>
          )}
        </div>
      </aside>

      {/* Results */}
      <div className="flex min-w-0 flex-1 flex-col items-center gap-[48px]">
        {results.length === 0 ? (
          <p className="py-[64px] text-center text-[18px] font-medium leading-[28.8px] tracking-[-0.36px] text-[#5f5f5f]">
            {t.empty}
          </p>
        ) : (
          <div className="grid w-full grid-cols-1 gap-[32px] md:grid-cols-2">
            {results.slice(0, visible).map((post, i) => (
              <Reveal key={post.slug} delay={(i % 2) * 90}>
                <BlogCard post={post} dict={dict} lang={lang} />
              </Reveal>
            ))}
          </div>
        )}

        {results.length > visible && (
          <ButtonButton
            variant="primary"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="px-[34px]"
          >
            {t.loadMore}
          </ButtonButton>
        )}
      </div>
    </div>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[14px] font-normal leading-[18.2px] text-navy">
      {children}
    </span>
  );
}

function Divider() {
  return <div aria-hidden className="h-px w-full bg-[#eaeaea]" />;
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-[20px]">
      <legend className="mb-[20px] p-0">
        <FilterLabel>{label}</FilterLabel>
      </legend>
      <div className="-mt-[20px] flex flex-col gap-[8px]">
        {options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <label key={opt.value} className="flex cursor-pointer items-center gap-[10px]">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(opt.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "flex size-[20px] shrink-0 items-center justify-center rounded-hairline border border-[#eaeaea] transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-navy",
                  checked ? "bg-navy" : "bg-[#f3f2f0]",
                )}
              >
                {checked && <CheckIcon />}
              </span>
              <span className="text-[16px] font-normal leading-[24px] tracking-[0.3px] text-[#5f5f5f]">
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * BLOG CARD (node 83:1655) — image with category chip, serif title, excerpt,
 * hairline divider, then read-time + published-date meta. Premium pass: warm
 * `bg-paper` fill, `font-display` title, and a hover lift + slow image zoom.
 *
 * The whole card links to the single article template at /blog/<slug>. That
 * route resolves its content from the Sanity `blogPost` document with the
 * MATCHING slug — this index is still the static placeholder set, so the two
 * are kept in sync by hand until the index itself moves to the CMS: every slug
 * in lib/blog-posts.ts has a counterpart in sanity/seed/blog-posts.ndjson. A
 * slug present here but not in the dataset renders the 404, by design.
 */
function BlogCard({
  post,
  dict,
  lang,
}: {
  post: BlogPost;
  dict: Dictionary;
  lang: Locale;
}) {
  const t = dict.blogPage;
  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(lang, {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(post.date)),
    [lang, post.date],
  );

  return (
    <Link
      href={`/${lang}/blog/${post.slug}`}
      className="card-surface card-interactive group flex h-full flex-col gap-[10px] p-[10px]"
    >
      <div className="relative aspect-[422/279] w-full overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 430px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* Category chip */}
        <span className="absolute bottom-[12px] left-[12px] inline-flex items-center bg-warm-taupe px-[12px] py-[5px] text-[12px] font-semibold uppercase leading-[16px] tracking-[0.1em] text-white shadow-[0px_6px_16px_rgba(0,0,0,0.14)]">
          {t.categories[post.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[10px] p-[10px]">
        <h2 className="font-display text-[23px] font-semibold leading-[1.15] text-navy">
          {post.title}
        </h2>

        <p className="text-[14.5px] font-normal leading-[22.4px] text-[#5f5f5f]">
          {post.excerpt}
        </p>

        <div aria-hidden className="mt-auto h-px w-full bg-navy/10" />

        <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[6px] pt-[2px] text-[14px] font-normal text-[#5f5f5f]">
          <span className="inline-flex items-center gap-[8px]">
            <ClockIcon />
            {post.readMinutes} {t.readSuffix}
          </span>
          <span className="inline-flex items-center gap-[8px]">
            <CalendarIcon />
            {dateLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Icons ─────────────────────────────────────────────────────────────── */

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute end-[11px] top-1/2 -translate-y-1/2 text-[#5f5f5f]"
    >
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.5L4.75 8.75L9.5 3.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0 text-navy">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6.25V10L12.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0 text-navy">
      <rect x="3.25" y="4.5" width="13.5" height="12.25" rx="1.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.25 8.25H16.75M7 3.25V5.5M13 3.25V5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
