import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { client } from "@/sanity/lib/client";
import {
  collectionListingsQuery,
  areaFilterQuery,
  type CollectionListing,
  type AreaRegionGroup,
} from "@/sanity/lib/queries";
import { CollectionExplorer } from "@/components/collection/CollectionExplorer";
import { Container } from "@/components/layout/Container";

/**
 * Collection ("Explore Properties") — cloned from Figma (file
 * r2XTjIJ5uaZ0VFCG2kfCdn, node 66:538 "listings"): page header (eyebrow +
 * heading + intro), then the filter panel + listing grid. Nav/Footer (and the
 * pre-footer CTA band) come from the locale layout, as on every page.
 *
 * Listings are fetched from Sanity (project 1tsx0da7 / production) at request
 * time with 60s ISR — content edits in the Studio show up within a minute
 * without a redeploy. All seeded listings are flagged `isPlaceholder` in the
 * CMS; do not launch until real data replaces them (CLAUDE.md §7.5).
 */

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.collection.metaTitle,
    description: dict.collection.intro,
    alternates: { canonical: `/${lang}/collection` },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const t = dict.collection;

  // The location filter's options are CMS documents (regions + areas), so they
  // are fetched alongside the listings and share the same 60s ISR window — an
  // area added in the Studio shows up in the filter without a deploy.
  const [listings, areaRegions] = await Promise.all([
    client.fetch<CollectionListing[]>(
      collectionListingsQuery,
      { lang: locale },
      { next: { revalidate } },
    ),
    client.fetch<AreaRegionGroup[]>(areaFilterQuery, {}, { next: { revalidate } }),
  ]);

  return (
    <div className="w-full pb-[78px] pt-[48px]">
      <Container className="flex flex-col gap-[32px]">
        {/* Page header (node 76:5726) */}
        <header className="flex max-w-[585px] flex-col gap-[8px]">
          <div className="flex items-center gap-[6px]">
            <span
              aria-hidden
              className="flex items-center justify-center rounded-hairline border border-navy p-[3px]"
            >
              <span className="size-[6px] bg-navy" />
            </span>
            <span className="text-[14px] font-bold uppercase leading-[27px] text-navy">
              {t.eyebrow}
            </span>
          </div>
          <div className="flex flex-col gap-[9px]">
            <h1 className="text-[36px] font-semibold leading-[1.2] tracking-[-1.28px] text-navy sm:text-[38px] sm:leading-[51px]">
              {t.heading}
            </h1>
            <p className="max-w-[480px] text-[16px] font-medium leading-[28px] tracking-[-0.32px] text-[#5f5f5f]">
              {t.intro}
            </p>
          </div>
        </header>

        <CollectionExplorer
          lang={locale}
          dict={dict}
          listings={listings}
          areaRegions={areaRegions}
        />
      </Container>
    </div>
  );
}
