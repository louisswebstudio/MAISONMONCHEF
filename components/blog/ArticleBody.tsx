import Image from "next/image";
import Link from "next/link";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock as RendererBlock,
} from "@portabletext/react";
import type { Image as SanityImage, PortableTextBlock } from "sanity";
import { urlForImage } from "@/sanity/lib/image";
import type { Locale } from "@/lib/i18n/config";

/**
 * Long-form article body — renders the `blogPost.body` portable text for the
 * active locale (see blogPostBySlugQuery).
 *
 * Editorial, not dense-blog: 17px charcoal at 1.7 line-height with real
 * paragraph separation, H3 subheads in navy with extra space ABOVE them so a
 * new subhead reads as a new movement, and list items pulled off the paragraph
 * rhythm with their own warm-taupe marker so a list never blends into prose.
 * Beyond paragraphs / H3 / lists it handles the two rhythm-breaker blocks from
 * the schema (objects/articleBlocks.ts): `articleImage` and `pullQuote`.
 *
 * Bullet markers are drawn as a small square (`list-none` + an absolute mark)
 * rather than a native disc, so they sit on the brand's sharp-corner geometry
 * and carry the accent colour a native `list-disc` can't.
 *
 * The body is fetched as RAW portable text for one locale, so text INSIDE the
 * inline objects (an image's alt/caption, a pull quote's text) is still the
 * unresolved `{en, ar, fr}` localeString/localeText object. `loc()` resolves
 * those at render with the same EN fallback the GROQ queries use, which keeps
 * the query simple and the fallback rule in one place.
 */
export function ArticleBody({
  value,
  lang,
}: {
  value: PortableTextBlock[];
  lang: Locale;
}) {
  return (
    <div className="flex flex-col">
      {/* Sanity's PortableTextBlock union admits bare inline objects (our
          articleImage / pullQuote) which the renderer's stricter block type
          doesn't model. The values are handled by `components.types` below, so
          the widening is safe and stays contained to this one line. */}
      <PortableText
        value={value as RendererBlock[]}
        components={buildComponents(lang)}
      />
    </div>
  );
}

/** Resolve a localeString/localeText object (or a plain string) for `lang`. */
function loc(value: unknown, lang: Locale): string | undefined {
  if (typeof value === "string") return value || undefined;
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    const v = o[lang] ?? o.en;
    if (typeof v === "string") return v || undefined;
  }
  return undefined;
}

const buildComponents = (lang: Locale): PortableTextComponents => ({
  block: {
    normal: ({ children }) => (
      <p className="mb-[24px] text-[16px] font-normal leading-[1.7] text-charcoal md:text-[17px]">
        {children}
      </p>
    ),
    // An article's own H1 is the page title, so body subheads start at H3 per
    // the brief — h2 is mapped to the same treatment rather than left unstyled.
    h2: ({ children }) => <BodyHeading>{children}</BodyHeading>,
    h3: ({ children }) => <BodyHeading>{children}</BodyHeading>,
    h4: ({ children }) => (
      <h4 className="mb-[12px] mt-[32px] text-[18px] font-semibold leading-[1.35] text-navy md:text-[19px]">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-[32px] mt-[8px] border-s-2 border-warm-taupe ps-[24px] text-[18px] font-medium italic leading-[1.6] text-navy md:text-[20px]">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mb-[32px] mt-[4px] flex list-none flex-col gap-[14px] ps-[4px]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-[32px] mt-[4px] flex list-decimal flex-col gap-[14px] ps-[22px] marker:font-medium marker:text-warm-taupe">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="relative ps-[26px] text-[16px] font-normal leading-[1.7] text-charcoal md:text-[17px]">
        <span
          aria-hidden
          className="absolute start-0 top-[10px] size-[7px] bg-warm-taupe"
        />
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="text-[16px] font-normal leading-[1.7] text-charcoal md:text-[17px]">
        {children}
      </li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-navy">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      const cls =
        "underline decoration-warm-taupe underline-offset-[3px] transition-colors hover:text-warm-taupe";
      return external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {children}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {children}
        </Link>
      );
    },
  },

  types: {
    articleImage: ({ value }) => {
      if (!value?.asset) return null;
      const caption = loc(value.caption, lang);
      return (
        <figure className="mb-[36px] mt-[12px]">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={urlForImage(value as SanityImage).width(1400).url()}
              alt={loc(value.alt, lang) ?? ""}
              fill
              sizes="(min-width: 1024px) 760px, 100vw"
              className="object-cover"
            />
          </div>
          {/* Caption is optional today (none authored yet) — the schema and this
              branch already carry it, so turning captions on is content-only. */}
          {caption && (
            <figcaption className="mt-[10px] text-[13px] leading-[1.5] text-[#5f5f5f]">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },

    pullQuote: ({ value }) => {
      const quote = loc(value?.quote, lang);
      if (!quote) return null;
      return (
        <figure className="mb-[36px] mt-[16px] border-y border-linen py-[28px]">
          <blockquote className="text-[20px] font-medium leading-[1.5] tracking-[-0.4px] text-navy md:text-[24px]">
            {quote}
          </blockquote>
          {value.attribution && (
            <figcaption className="mt-[12px] text-eyebrow text-warm-taupe">
              {value.attribution}
            </figcaption>
          )}
        </figure>
      );
    },
  },
});

/** Shared H3 treatment — 24px SemiBold navy, with room above it. */
function BodyHeading({ children }: { children?: React.ReactNode }) {
  return (
    <h3 className="mb-[14px] mt-[40px] text-[20px] font-semibold leading-[1.3] text-navy first:mt-0 md:text-[24px]">
      {children}
    </h3>
  );
}
