import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { CollectionListing } from "@/sanity/lib/queries";
import type { PropertyCardData } from "@/components/ui/PropertyCard";
import { urlForImage } from "@/sanity/lib/image";

/** Local placeholder used until real gallery media is uploaded to the CMS. */
const PLACEHOLDER_IMAGE = "/brand/listings/property-placeholder.jpg";

/**
 * Map a Sanity {@link CollectionListing} to the shared card's
 * {@link PropertyCardData}. One adapter so the Collection grid AND the property
 * page's "You May Also Consider" row format price, location and image the same
 * way — the card component stays purely presentational.
 */
export function collectionListingToCardData(
  listing: CollectionListing,
  lang: Locale,
  dict: Dictionary,
): PropertyCardData {
  const tc = dict.collection;
  const locationLabel =
    tc.locations[listing.location as keyof typeof tc.locations] ?? listing.location;

  return {
    href: `/${lang}/collection/${listing.slug}`,
    image: listing.image
      ? urlForImage(listing.image).width(800).url()
      : PLACEHOLDER_IMAGE,
    location: `${locationLabel}, ${tc.dubai}`,
    price: `AED ${listing.price.toLocaleString("en-US")}`,
    title: listing.name,
    description: listing.description,
    beds: listing.bedrooms,
    baths: listing.bathrooms,
    area: listing.sizeSqft?.toLocaleString("en-US"),
  };
}
