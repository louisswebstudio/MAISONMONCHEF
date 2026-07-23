import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDir, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import {
  listingBySlugQuery,
  listingSlugsQuery,
  type ListingDetail,
} from "@/sanity/lib/queries";
import { whatsappLink } from "@/lib/site";
import { collectionListingToCardData } from "@/lib/property-card-data";
import { formatRange } from "@/lib/listing-format";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { LocationPinIcon } from "@/components/ui/amenity-icons";
import { AmenityIcon } from "@/components/ui/amenity-tile-icons";
import {
  PropertyGallery,
  type GalleryImage,
} from "@/components/property/PropertyGallery";
import { PropertyVideo } from "@/components/property/PropertyVideo";

/**
 * Single Property Listing page (Figma node 25:33). A TEMPLATE, not a hardcoded
 * page: every value (title, location, price, specs, description, amenities,
 * gallery, video) binds to the property's Sanity `listing` document, fetched by
 * slug. It renders whatever real data is eventually entered — varying image
 * counts, amenity selections and specs per property.
 *
 * NOTE (placeholder data, CLAUDE.md §7.5): the seeded listings are all "The
 * Sundial Residence" with no gallery/amenities/completionYear/floors/video —
 * expected until real inventory is entered. The template handles the empty
 * states gracefully (gallery falls back to brand imagery; missing spec rows
 * show "—"; the amenities section hides when none are selected).
 *
 * Fetched at request time with 60s ISR, matching the Collection page.
 */

export const revalidate = 60;

/** Local placeholder gallery used until real media is uploaded to the CMS. */
const PLACEHOLDER_GALLERY = [
  "/brand/properties/listing-waterfront.jpg",
  "/brand/properties/listing-glass-house.jpg",
  "/brand/properties/listing-modern-villa.jpg",
  "/brand/properties/grove-residence.jpg",
];

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(listingSlugsQuery);
    return slugs.filter(Boolean).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

async function getListing(slug: string, lang: Locale) {
  return client.fetch<ListingDetail | null>(
    listingBySlugQuery,
    { slug, lang },
    { next: { revalidate } },
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const listing = await getListing(slug, lang);
  if (!listing) return {};
  return {
    title: listing.name,
    description: listing.description ?? `${listing.name} — ${formatLocation(listing)}.`,
    alternates: { canonical: `/${lang}/collection/${slug}` },
  };
}

/**
 * "Area, Region" — e.g. "Palm Jumeirah, Dubai". Both come from the `area`
 * taxonomy in Sanity; they're proper nouns, so there is no per-locale lookup,
 * and the region is read from the document rather than hardcoded to Dubai (the
 * taxonomy also covers Abu Dhabi and the Northern Emirates).
 */
function formatLocation(listing: ListingDetail) {
  return listing.region ? `${listing.location}, ${listing.region}` : listing.location;
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const listing = await getListing(slug, locale);
  if (!listing) notFound();

  const t = dict.propertyDetail;
  const fullLocation = formatLocation(listing);
  const startingPriceDisplay = `AED ${listing.startingPrice.toLocaleString("en-US")}`;
  const dash = t.notProvided;
  const unitTypes = listing.unitTypes ?? [];

  // Gallery — real CMS media if present, else the brand placeholder set so the
  // carousel is demonstrable until images are uploaded.
  const gallery: GalleryImage[] =
    listing.gallery && listing.gallery.length > 0
      ? listing.gallery.map((img, i) => ({
          src: urlForImage(img).width(1600).url(),
          alt: img.alt ?? `${listing.name} — ${t.photo} ${i + 1}`,
        }))
      : PLACEHOLDER_GALLERY.map((src, i) => ({
          src,
          alt: `${listing.name} — ${t.photo} ${i + 1}`,
        }));

  // Project Info rows (node 25:33) — now project-LEVEL only. Per-unit price /
  // beds / baths / size moved into the Unit Types breakdown below; what remains
  // here applies to the whole project. Missing values show a dash rather than
  // dropping the row, keeping the table stable.
  const infoRows: { label: string; value: string }[] = [
    { label: t.info.price, value: startingPriceDisplay },
    {
      label: t.info.completionYear,
      value: listing.completionYear != null ? String(listing.completionYear) : dash,
    },
    { label: t.info.floors, value: listing.floors != null ? String(listing.floors) : dash },
  ];

  const amenities = listing.amenities ?? [];
  const related = listing.related ?? [];

  const whatsappHref = whatsappLink(
    t.whatsappMessage.replace("{property}", listing.name),
  );

  return (
    <div className="w-full pb-[96px] pt-[28px] md:pt-[36px]">
      <Container className="flex flex-col gap-[40px]">
        {/* 1 — Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px] text-[14px] leading-[1.4]">
            <BreadcrumbLink href={`/${locale}`}>{t.breadcrumbHome}</BreadcrumbLink>
            <Separator />
            <BreadcrumbLink href={`/${locale}/collection`}>
              {t.breadcrumbProperties}
            </BreadcrumbLink>
            <Separator />
            <li aria-current="page" className="min-w-0 truncate font-medium text-navy">
              {listing.name}
            </li>
          </ol>
        </nav>

        {/* 2 — Image gallery */}
        <PropertyGallery
          images={gallery}
          labels={{ prev: t.gallery.prev, next: t.gallery.next, thumb: t.gallery.thumb }}
          rtl={getDir(locale) === "rtl"}
        />

        {/* 3 + 4 — Left content column & sticky sidebar */}
        <div className="grid grid-cols-1 items-start gap-[40px] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-[48px]">
          {/* Left column */}
          <div className="flex min-w-0 flex-col gap-[48px]">
            {/* Title + location + description */}
            <header className="flex flex-col gap-[16px]">
              <h1 className="text-display text-navy">{listing.name}</h1>
              <p className="flex items-center gap-[8px] text-[#5f5f5f]">
                <LocationPinIcon width={20} height={20} className="shrink-0 text-navy" />
                <span className="text-[16px] font-medium leading-[1.4] tracking-[-0.32px]">
                  {fullLocation}
                </span>
              </p>
              {/* Starting-from headline — the project's lowest unit price. The
                  "Starting from" label is intentionally smaller/regular against
                  the bold price, matching the card prefix treatment. */}
              <p className="flex flex-wrap items-baseline gap-x-[8px] gap-y-[2px]">
                <span className="text-[15px] font-normal leading-[1.4] text-[#5f5f5f]">
                  {t.startingFrom}
                </span>
                <span className="text-[30px] font-semibold leading-[1.1] tracking-[-0.6px] text-navy">
                  {startingPriceDisplay}
                </span>
              </p>
              {listing.description && (
                <p className="max-w-[62ch] text-body text-charcoal/85">
                  {listing.description}
                </p>
              )}
            </header>

            {/* Property Info */}
            <section aria-labelledby="property-info-heading" className="flex flex-col gap-[20px]">
              <h2 id="property-info-heading" className="text-h3 text-navy">
                {t.info.heading}
              </h2>
              <dl className="flex flex-col">
                {infoRows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between gap-[16px] py-[16px] ${
                      i > 0 ? "border-t border-[#e5e5e5]" : ""
                    }`}
                  >
                    <dt className="text-[15px] font-medium leading-[1.4] text-[#5f5f5f]">
                      {row.label}
                    </dt>
                    <dd className="text-end text-[16px] font-semibold leading-[1.4] text-navy">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Unit Types — the per-configuration breakdown (1BR / 3BR Townhouse
                / …) that replaces the old single price/beds/size. Scrolls
                horizontally on narrow screens rather than squashing; logical
                (start/end) spacing so it mirrors correctly under RTL. */}
            {unitTypes.length > 0 && (
              <section
                aria-labelledby="unit-types-heading"
                className="flex flex-col gap-[20px]"
              >
                <h2 id="unit-types-heading" className="text-h3 text-navy">
                  {t.unitTypesHeading}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e5e5] text-[12.5px] font-medium uppercase tracking-[0.08em] text-[#5f5f5f]">
                        <th className="py-[12px] pe-[16px] text-start font-medium">{t.unit.label}</th>
                        <th className="px-[16px] py-[12px] text-start font-medium">{t.unit.beds}</th>
                        <th className="px-[16px] py-[12px] text-start font-medium">{t.unit.baths}</th>
                        <th className="px-[16px] py-[12px] text-start font-medium">{t.unit.size}</th>
                        <th className="px-[16px] py-[12px] text-start font-medium">{t.unit.price}</th>
                        <th className="py-[12px] ps-[16px] text-start font-medium">{t.unit.units}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitTypes.map((u, i) => {
                        const size = formatRange(u.minSizeSqft, u.maxSizeSqft);
                        return (
                          <tr
                            key={`${u.label}-${i}`}
                            className="border-b border-[#e5e5e5] text-[15px] leading-[1.4] text-navy"
                          >
                            <td className="py-[14px] pe-[16px] font-medium">{u.label}</td>
                            <td className="px-[16px] py-[14px]">
                              {u.bedrooms == null
                                ? dash
                                : u.bedrooms === 0
                                  ? t.studio
                                  : String(u.bedrooms)}
                            </td>
                            <td className="px-[16px] py-[14px]">
                              {u.bathrooms != null ? String(u.bathrooms) : dash}
                            </td>
                            <td className="whitespace-nowrap px-[16px] py-[14px]">
                              {size ? `${size} ${t.sqft}` : dash}
                            </td>
                            <td className="whitespace-nowrap px-[16px] py-[14px] font-semibold">
                              AED {u.price.toLocaleString("en-US")}
                            </td>
                            <td className="py-[14px] ps-[16px]">
                              {u.unitsAvailable != null ? String(u.unitsAvailable) : dash}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Features & Amenities (Figma node 142:1975) — only the amenities
                selected for THIS property (a per-property multi-select of the
                locked 12-item taxonomy) are rendered, so the count varies 1–12.
                Each feature stacks vertically: gold icon tile → 20px → title +
                description; 32px between feature cells. */}
            {amenities.length > 0 && (
              <section
                aria-labelledby="amenities-heading"
                className="flex flex-col gap-[28px]"
              >
                <h2 id="amenities-heading" className="text-h3 text-navy">
                  {t.amenitiesHeading}
                </h2>
                <ul className="grid grid-cols-1 gap-x-[32px] gap-y-[20px] sm:grid-cols-2 lg:grid-cols-3">
                  {amenities.map((a) => (
                    <li key={a._id} className="flex flex-col items-start gap-[20px]">
                      <span
                        aria-hidden
                        className="flex size-[52px] shrink-0 items-center justify-center bg-warm-taupe text-white"
                      >
                        <AmenityIcon icon={a.icon} name={a.name} size={32} />
                      </span>
                      <div className="flex min-w-0 flex-col gap-[6px]">
                        <span className="text-[18px] font-medium leading-[1.35] text-navy">
                          {a.name}
                        </span>
                        {a.description && (
                          <span className="text-[14.5px] font-normal leading-[1.5] text-[#5f5f5f]">
                            {a.description}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Video */}
            <PropertyVideo
              url={listing.videoUrl}
              labels={{
                heading: t.video.heading,
                placeholder: t.video.placeholder,
                title: `${listing.name} — ${t.video.heading}`,
              }}
            />
          </div>

          {/* Right column — sticky "Request a Viewing" card. Pinned within the
              content area (top offset = nav height + gap); it scrolls away with
              the page once the column ends, so it never overlaps the footer. */}
          <aside className="lg:sticky lg:top-[111px]">
            <div className="card-surface flex flex-col gap-[16px] p-[28px]">
              <h2 className="text-h3 text-navy">{t.sidebar.heading}</h2>
              <p className="text-[15px] font-normal leading-[1.55] text-[#5f5f5f]">
                {t.sidebar.supporting}
              </p>
              <Button
                href={whatsappHref}
                variant="primary"
                className="w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.sidebar.cta}
              </Button>
            </div>
          </aside>
        </div>

        {/* 5 — You May Also Consider */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="flex flex-col gap-[32px] pt-[24px]">
            <Reveal className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="related-heading" className="text-h2 text-navy">
                {t.relatedHeading}
              </h2>
              <Button href={`/${locale}/collection`} variant="primary" className="shrink-0">
                {t.viewAll}
              </Button>
            </Reveal>
            <div className="grid grid-cols-1 gap-x-[32px] gap-y-[36px] sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r._id} delay={(i % 3) * 110} className="h-full">
                  <PropertyCard
                    data={collectionListingToCardData(r, locale, dict)}
                    labels={{
                      beds: dict.listings.beds,
                      baths: dict.listings.baths,
                      area: dict.listings.area,
                      forSale: dict.listings.forSale,
                      cta: dict.listings.cta,
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}

function BreadcrumbLink({ href, children }: { href: string; children: React.ReactNode }) {
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
