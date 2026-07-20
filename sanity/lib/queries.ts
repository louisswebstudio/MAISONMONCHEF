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

/**
 * Listings for the home page's "Our properties" coverflow spotlight. Same
 * filter and ordering as {@link collectionListingsQuery} so the carousel shows
 * the same published set as /collection, but it additionally selects `floors`
 * (which the Collection grid never renders) because the spotlight's info panel
 * shows a full spec row.
 *
 * NOTE: the panel's Figma design also calls for "Parking lots" and "Balconies"
 * chips, but neither field exists on the `listing` schema — they exist only as
 * amenity references, which are a presence list rather than the numeric counts
 * the chips render. The mapper therefore emits only the specs that have a real
 * CMS field; see `listingToFeaturedProperty` in lib/featured-property.ts.
 */
export const featuredCarouselQuery = groq`
  *[_type == "listing" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
    _id,
    "name": coalesce(name[$lang], name.en),
    "slug": slug.current,
    location,
    price,
    bedrooms,
    bathrooms,
    sizeSqft,
    floors,
    "image": gallery[0],
  }
`;

/** Shape returned by {@link featuredCarouselQuery}. */
export type FeaturedCarouselListing = {
  _id: string;
  name: string;
  slug: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  sizeSqft?: number;
  floors?: number;
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

/** All blog post slugs — for `generateStaticParams` on the article route. */
export const blogPostSlugsQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))].slug.current
`;

/**
 * A single article by slug for the Blog Article page. Localized title/excerpt
 * with an EN fallback (same convention as the listing queries); `body` is
 * returned as RAW portable text for the locale — it is NOT flattened with
 * pt::text, since the page renders blocks, lists, inline images and pull
 * quotes rather than a plain string.
 *
 * `related` pulls up to three OTHER posts, same category first, newest
 * otherwise, in the exact card shape the shared BlogCard consumes — so the
 * "Related Blogs" row never re-shows the article you're reading.
 */
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    _id,
    "title": coalesce(title[$lang], title.en),
    "slug": slug.current,
    category,
    "excerpt": coalesce(excerpt[$lang], excerpt.en),
    "coverImage": coverImage{
      ...,
      "alt": coalesce(alt[$lang], alt.en)
    },
    "body": coalesce(body[$lang], body.en),
    authorName,
    "authorRole": coalesce(authorRole[$lang], authorRole.en),
    readTime,
    publishedAt,
    "related": *[
      _type == "blogPost" &&
      slug.current != $slug &&
      !(_id in path("drafts.**"))
    ] | order(select(category == ^.category => 0, 1) asc, publishedAt desc) [0...3]{
      _id,
      "title": coalesce(title[$lang], title.en),
      "slug": slug.current,
      category,
      "excerpt": coalesce(excerpt[$lang], excerpt.en),
      "coverImage": coverImage{
        ...,
        "alt": coalesce(alt[$lang], alt.en)
      },
      readTime,
      publishedAt
    }
  }
`;

/** A post in the shape the shared BlogCard consumes. */
export type BlogPostCard = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  excerpt?: string;
  coverImage?: (import("sanity").Image & { alt?: string }) | null;
  readTime?: number;
  publishedAt: string;
};

/** Shape returned by {@link blogPostBySlugQuery}. */
export type BlogPostDetail = BlogPostCard & {
  body?: import("sanity").PortableTextBlock[];
  authorName?: string;
  authorRole?: string;
  related?: BlogPostCard[];
};

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
