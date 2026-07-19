import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { FEATURED_LISTINGS } from "@/lib/featured-listings";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PropertyCard } from "@/components/ui/PropertyCard";

/**
 * "Homes Selected for you" — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn,
 * node 138:1831 "Listing Section"). Authored as a fixed 1240px desktop frame
 * (3-up card grid, 32px column / 36px row gaps); reproduced responsively
 * (1 → 2 → 3 columns) since no mobile frame has been supplied yet.
 *
 * Card content is placeholder — see lib/featured-listings.ts. Only the section
 * chrome (eyebrow, heading, "View all", unit labels) is translated via the
 * dictionary; the six locations are the real Dubai areas from LISTING_LOCATIONS.
 *
 * The card itself is the shared components/ui/PropertyCard (single source of
 * truth) — the Collection grid and the property page's "You May Also Consider"
 * row render the very same component, so the card styles can never drift apart.
 */
export function FeaturedListings({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const t = dict.listings;

  return (
    <section className="w-full py-section">
      <Container>
        {/* Header: eyebrow + heading on the left, "View all" on the right */}
        <Reveal className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-[120px]">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-[6px]">
              <span
                aria-hidden
                className="flex items-center justify-center rounded-hairline border border-navy p-[3px]"
              >
                <span className="size-[6px] bg-warm-taupe" />
              </span>
              <span className="text-[12px] font-semibold uppercase leading-[27px] tracking-[0.18em] text-navy">
                {t.eyebrow}
              </span>
            </div>
            <h2 className="font-display text-[34px] font-semibold leading-[1.1] text-navy sm:text-[46px]">
              {t.heading}
            </h2>
          </div>

          <Button href={`/${lang}/collection`} variant="primary" className="shrink-0">
            {t.viewAll}
          </Button>
        </Reveal>

        {/* Card grid — shared PropertyCard, one per placeholder listing. */}
        <div className="mt-[48px] grid grid-cols-1 gap-x-[32px] gap-y-[36px] sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_LISTINGS.map((listing, i) => (
            <Reveal key={listing.id} delay={(i % 3) * 110} className="h-full">
              <PropertyCard
                data={{
                  href: `/${lang}/collection/${listing.id}`,
                  image: listing.image,
                  location: listing.location,
                  price: listing.price,
                  title: listing.title,
                  description: listing.description,
                  beds: listing.beds,
                  baths: listing.baths,
                  area: listing.area.toLocaleString("en-US"),
                }}
                labels={{ beds: t.beds, baths: t.baths, area: t.area, forSale: t.forSale, cta: t.cta }}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
