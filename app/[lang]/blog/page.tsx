import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { BlogExplorer } from "@/components/blog/BlogExplorer";

/**
 * Blog ("The Journal") — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node
 * 83:595 "blog"): page header (eyebrow + title + subtitle), then a filter panel
 * beside a 2-up article grid with Load More. Nav/Footer (and the pre-footer CTA
 * band) come from the locale layout, as on every page.
 *
 * Posts are static placeholders (lib/blog-posts.ts) pending the CMS `post`
 * collection — same staging approach as the Collection page.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.blogPage.metaTitle,
    description: dict.blogPage.subtitle,
    alternates: { canonical: `/${lang}/blog` },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const t = dict.blogPage;

  return (
    <div className="w-full pb-[78px] pt-[56px]">
      <Container className="flex flex-col gap-[40px]">
        <Reveal className="flex max-w-[620px] flex-col gap-[14px]">
          <div className="flex items-center gap-[7px]">
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

          <h1 className="font-display text-[36px] font-semibold leading-[1.08] text-navy sm:text-[58px]">
            {t.title}
          </h1>

          <p className="max-w-[520px] text-[17px] font-medium leading-[28px] tracking-[-0.34px] text-[#5f5f5f]">
            {t.subtitle}
          </p>
        </Reveal>

        <BlogExplorer lang={locale} dict={dict} />
      </Container>
    </div>
  );
}
