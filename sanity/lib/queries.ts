import { groq } from "next-sanity";

/**
 * GROQ queries for the Next.js app. Text fields resolve to the requested
 * locale with an English fallback ($lang param), since AR/FR content entry
 * lags EN (see dictionaries.ts note). Filterable fields (status, category,
 * location, price, …) are never localized — see the listing schema.
 */

/**
 * The computed project-card fields, shared by every listing query. A listing is
 * a PROJECT with an array of unit types; cards show a starting (lowest) price and
 * a bedroom / size RANGE across those units. Each value coalesces to the
 * DEPRECATED single-unit field (`price`/`bedrooms`/`sizeSqft`) so documents that
 * haven't been migrated to `unitTypes[]` yet still render a sensible card. The
 * `.{ "v": … }.v` projection on `maxSize` takes each unit's max (or its min when
 * fixed) before `math::max`, so a project's high end is never understated.
 */
const CARD_COMPUTED_FIELDS = `
    "startingPrice": coalesce(math::min(unitTypes[].price), price),
    "minSize": coalesce(math::min(unitTypes[].minSizeSqft), sizeSqft),
    "maxSize": coalesce(math::max(unitTypes[]{ "v": coalesce(maxSizeSqft, minSizeSqft) }.v), sizeSqft),
    "minBeds": coalesce(math::min(unitTypes[].bedrooms), bedrooms),
    "maxBeds": coalesce(math::max(unitTypes[].bedrooms), bedrooms)
`;

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
    ${CARD_COMPUTED_FIELDS},
    "image": gallery[0],
  }
`;

/**
 * The computed card shape shared by the Collection grid, the "You May Also
 * Consider" row, and (as `related`) the detail query. `startingPrice` is the
 * lowest unit price; beds/size are ranges (min === max when the project has a
 * single configuration).
 */
export type CollectionListing = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  category?: string;
  location: string;
  startingPrice: number;
  minSize?: number;
  maxSize?: number;
  minBeds?: number;
  maxBeds?: number;
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
    ${CARD_COMPUTED_FIELDS},
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
  startingPrice: number;
  minSize?: number;
  maxSize?: number;
  minBeds?: number;
  maxBeds?: number;
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
    ${CARD_COMPUTED_FIELDS},
    "unitTypes": unitTypes[]{
      "label": coalesce(label[$lang], label.en),
      price,
      bedrooms,
      bathrooms,
      minSizeSqft,
      maxSizeSqft,
      unitsAvailable
    },
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
      ${CARD_COMPUTED_FIELDS},
      "image": gallery[0]
    }
  }
`;

/**
 * Every published blog post for the /blog index and the homepage "Journal" row,
 * newest first — the LIST counterpart to {@link blogPostBySlugQuery}. Returns
 * the shared {@link BlogPostCard} shape (localized title/excerpt with an EN
 * fallback, cover image with localized alt) that both the index explorer and
 * the shared BlogCard consume.
 */
export const blogPostsQuery = groq`
  *[_type == "blogPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
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

/** One unit configuration within a project listing (localized label). */
export type UnitType = {
  label: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  minSizeSqft: number;
  maxSizeSqft?: number;
  unitsAvailable?: number;
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
  startingPrice: number;
  minSize?: number;
  maxSize?: number;
  minBeds?: number;
  maxBeds?: number;
  unitTypes?: UnitType[];
  completionYear?: number;
  floors?: number;
  videoUrl?: string;
  isPlaceholder?: boolean;
  gallery?: (import("sanity").Image & { alt?: string })[];
  amenities?: ListingAmenity[];
  related?: CollectionListing[];
};
