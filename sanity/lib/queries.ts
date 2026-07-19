import { groq } from "next-sanity";

/**
 * GROQ queries for the Next.js app. Text fields resolve to the requested
 * locale with an English fallback ($lang param), since AR/FR content entry
 * lags EN (see dictionaries.ts note). Filterable fields (status, category,
 * location, price, …) are never localized — see the listing schema.
 */

/** All published listings for the Collection page, oldest first (stable order). */
export const collectionListingsQuery = groq`
  *[_type == "listing" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
    _id,
    "name": coalesce(name[$lang], name.en),
    "slug": slug.current,
    "description": coalesce(pt::text(description[$lang]), pt::text(description.en)),
    status,
    category,
    location,
    price,
    bedrooms,
    bathrooms,
    sizeSqft,
    "image": gallery[0],
  }
`;

/** Shape returned by {@link collectionListingsQuery}. */
export type CollectionListing = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  category?: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  sizeSqft?: number;
  image?: import("sanity").Image | null;
};

/** All listing slugs — for `generateStaticParams` on the detail route. */
export const listingSlugsQuery = groq`
  *[_type == "listing" && defined(slug.current) && !(_id in path("drafts.**"))].slug.current
`;

/**
 * A single listing by slug for the Property Listing page (node 25:33). Resolves
 * the full detail: localized name/description, every spec (incl. the new
 * completionYear / floors / videoUrl), the whole gallery (with per-image alt),
 * and the selected amenities dereferenced to name + icon + short description.
 * Plus up to three OTHER listings for "You May Also Consider" (same location
 * first where possible, newest otherwise) so the section never re-shows this one.
 */
export const listingBySlugQuery = groq`
  *[_type == "listing" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    _id,
    "name": coalesce(name[$lang], name.en),
    "slug": slug.current,
    "description": coalesce(pt::text(description[$lang]), pt::text(description.en)),
    status,
    category,
    location,
    price,
    bedrooms,
    bathrooms,
    sizeSqft,
    completionYear,
    floors,
    videoUrl,
    isPlaceholder,
    "gallery": gallery[]{
      ...,
      "alt": coalesce(alt[$lang], alt.en)
    },
    "amenities": amenities[]{
      "_id": amenity->_id,
      "name": coalesce(amenity->name[$lang], amenity->name.en),
      "icon": amenity->icon,
      "description": coalesce(
        descriptionOverride[$lang], descriptionOverride.en,
        amenity->description[$lang], amenity->description.en
      ),
      "order": amenity->order
    },
    "related": *[
      _type == "listing" &&
      slug.current != $slug &&
      !(_id in path("drafts.**"))
    ] | order(select(location == ^.location => 0, 1) asc, _createdAt desc) [0...3]{
      _id,
      "name": coalesce(name[$lang], name.en),
      "slug": slug.current,
      "description": coalesce(pt::text(description[$lang]), pt::text(description.en)),
      status,
      category,
      location,
      price,
      bedrooms,
      bathrooms,
      sizeSqft,
      "image": gallery[0]
    }
  }
`;

/** A single selected amenity, dereferenced for display on the property page. */
export type ListingAmenity = {
  _id: string;
  name: string;
  icon: string;
  description?: string;
  order?: number;
};

/** Shape returned by {@link listingBySlugQuery}. */
export type ListingDetail = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  category?: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  sizeSqft?: number;
  completionYear?: number;
  floors?: number;
  videoUrl?: string;
  isPlaceholder?: boolean;
  gallery?: (import("sanity").Image & { alt?: string })[];
  amenities?: ListingAmenity[];
  related?: CollectionListing[];
};
