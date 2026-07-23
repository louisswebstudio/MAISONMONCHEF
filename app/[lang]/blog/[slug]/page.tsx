import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import {
  blogPostBySlugQuery,
  blogPostSlugsQuery,
  type BlogPostCard,
  type BlogPostDetail,
} from "@/sanity/lib/queries";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import {
  BlogCard,
  BookIcon,
  CalendarIcon,
  type BlogCardData,
} from "@/components/ui/BlogCard";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { AdvisoryCTAStrip } from "@/components/blog/AdvisoryCTAStrip";

/**
 * Single Blog Article page (Figma node 26:952). A TEMPLATE, not a hardcoded
 * page: hero image, category, title, byline, body, and the Related Blogs row
 * all bind to the article's Sanity `blogPost` document, fetched by slug.
 *
 * Layout note — two different widths on one page, per the design: the hero
 * image spans the FULL 1240px content width, while every text element below it
 * (chip, title, byline, body, CTA) sits in a narrower centred reading column so
 * long-form copy never runs the full width.
 *
 * The nav and footer come from the locale layout, as on every page. The Figma
 * frame for this page shows a DIFFERENT nav ("Home / About / Services /
 * Properties / Blog / Contact Us") from the site's real global nav ("Home / The
 * House / Services / Collection / Journal / Contact"); the shared Nav is used
 * unchanged and the Figma labels are deliberately ignored (client-confirmed).
 *
 * Fetched at request time with 60s ISR, matching the Collection/property pages.
 */

export const revalidate = 60;

/**
 * ~62% of the 1240px content max-width. The brief specifies "roughly 60–65%";
 * 760px is the value picked inside that band, ESTIMATED not measured — Figma
 * was unavailable when this was built. Change this one constant to retune the
 * measure; every text element on the page is bound to it.
 */
const READING_COLUMN = "max-w-[760px]";

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(blogPostSlugsQuery);
    return slugs.filter(Boolean).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

async function getPost(slug: string, lang: Locale) {
  try {
    return await client.fetch<BlogPostDetail | null>(blogPostBySlugQuery, {
      slug,
      lang,
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const post = await getPost(slug, lang);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/${lang}/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      images: post.coverImage
        ? [urlForImage(post.coverImage).width(1200).height(630).url()]
        : undefined,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const t = dict.blogArticle;

  const post = await getPost(slug, locale);
  if (!post) notFound();

  const base = `/${locale}`;
  const related = post.related ?? [];
  const heroSrc = post.coverImage
    ? urlForImage(post.coverImage).width(1600).url()
    : FALLBACK_IMAGE;

  return (
    <div className="w-full pb-[96px] pt-[28px] md:pt-[36px]">
      <Container className="flex flex-col gap-[32px]">
        {/* 2 — Breadcrumb (same pattern/styling as the property listing page) */}
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px] text-[14px] leading-[1.4]">
            <BreadcrumbLink href={base}>{t.breadcrumbHome}</BreadcrumbLink>
            <Separator />
            <BreadcrumbLink href={`${base}/blog`}>
              {t.breadcrumbJournal}
            </BreadcrumbLink>
            <Separator />
            <li
              aria-current="page"
              className="min-w-0 truncate font-medium text-navy"
            >
              {post.title}
            </li>
          </ol>
        </nav>

        {/* 3 — Hero image: single, full CONTENT width (not the reading width).
            Wrapped in a <figure> with no caption today so a credit line can be
            added later as a <figcaption> without restructuring anything. */}
        <Reveal>
          <figure className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[2.2/1]">
            <Image
              src={heroSrc}
              alt={post.coverImage?.alt ?? post.title}
              fill
              priority
              sizes="(min-width: 1240px) 1040px, 100vw"
              className="object-cover"
            />
          </figure>
        </Reveal>

        {/* 4–8 — Everything textual sits in the narrow reading column. */}
        <div className={`mx-auto flex w-full flex-col ${READING_COLUMN}`}>
          <Reveal className="flex flex-col">
            {/* 4 — Category chip, held clear of the title below it */}
            {post.category && (
              <span className="mb-[24px] self-start bg-warm-taupe px-[12px] py-[4px] text-[14px] font-medium leading-[24px] tracking-[0.3px] text-white">
                {categoryLabel(post.category, dict)}
              </span>
            )}

            {/* 5 — Title */}
            <h1 className="text-display text-navy">{post.title}</h1>

            {/* 6 — Byline + meta */}
            <div className="mt-[28px] flex flex-wrap items-center gap-x-[28px] gap-y-[12px]">
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold leading-[1.4] text-navy">
                  {post.authorName ?? t.byline}
                </span>
                {post.authorRole && (
                  <span className="text-[13px] font-normal leading-[1.4] text-[#5f5f5f]">
                    {post.authorRole}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-[19px] text-navy">
                {post.readTime != null && (
                  <span className="flex items-center gap-[5px]">
                    <BookIcon />
                    <span className="text-[14px] font-normal leading-[24px] tracking-[0.3px]">
                      {post.readTime} {t.minutes}
                    </span>
                  </span>
                )}
                <span className="flex items-center gap-[5px]">
                  <CalendarIcon />
                  <span className="text-[14px] font-normal leading-[24px] tracking-[0.3px]">
                    {formatDate(post.publishedAt, locale)}
                  </span>
                </span>
              </div>
            </div>

            {/* 7 — Divider across the reading column */}
            <hr className="my-[40px] w-full border-0 border-t border-linen" />
          </Reveal>

          {/* 8 — Article body */}
          {post.body && post.body.length > 0 && (
            <ArticleBody value={post.body} lang={locale} />
          )}

          {/* 10 — Advisory CTA strip (own reusable component) */}
          <AdvisoryCTAStrip
            className="mt-[32px]"
            text={t.ctaText}
            buttonLabel={t.ctaButton}
            whatsappMessage={t.ctaWhatsappMessage.replace(
              "{article}",
              post.title,
            )}
          />
        </div>
      </Container>

      {/* 11 — Related Blogs. Its own <section> with the standard section
          rhythm above it so it never crowds the CTA strip. */}
      {related.length > 0 && (
        <section className="w-full pt-section">
          <Container className="flex flex-col gap-[48px]">
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
                    {t.relatedEyebrow}
                  </span>
                </div>
                <h2 className="text-h2 text-navy">{t.relatedHeading}</h2>
              </div>

              <Button
                href={`${base}/blog`}
                variant="primary"
                className="shrink-0 self-start sm:self-auto"
              >
                {t.relatedViewMore}
              </Button>
            </Reveal>

            <div className="grid grid-cols-1 gap-[40px] sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item._id} delay={(i % 3) * 110} className="h-full">
                  <BlogCard
                    data={toCardData(item, locale, dict)}
                    minutesLabel={t.minutes}
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}

/** Local stand-in until article cover images are uploaded to the CMS. */
const FALLBACK_IMAGE = "/brand/blog/blog-1.png";

/**
 * Map a Sanity `blogPost` into the shared BlogCard's shape — the ONE place the
 * article page adapts CMS data to the card the homepage also uses.
 */
function toCardData(
  post: BlogPostCard,
  locale: Locale,
  dict: Dictionary,
): BlogCardData {
  return {
    href: `/${locale}/blog/${post.slug}`,
    image: post.coverImage
      ? urlForImage(post.coverImage).width(800).url()
      : FALLBACK_IMAGE,
    imageAlt: post.coverImage?.alt ?? "",
    category: post.category ? categoryLabel(post.category, dict) : undefined,
    title: post.title,
    excerpt: post.excerpt,
    minutes: post.readTime,
    date: formatDate(post.publishedAt, locale),
  };
}

/**
 * `category` is a free string in the CMS. When it matches a key in the blog
 * page's taxonomy it renders translated; anything else renders as authored,
 * so a new category never shows a missing-translation blank.
 */
function categoryLabel(category: string, dict: Dictionary): string {
  const categories = dict.blogPage.categories as Record<string, string>;
  return categories[category] ?? category;
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

function BreadcrumbLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-[#5f5f5f] transition-colors hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
      >
        {children}
      </Link>
    </li>
  );
}

function Separator() {
  return (
    <li aria-hidden className="text-stone-grey">
      /
    </li>
  );
}
