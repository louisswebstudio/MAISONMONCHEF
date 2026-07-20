import type { PortableTextBlock, Image, Slug } from "sanity";

/** Mirrors the `localeString`/`localeText`/`localeBlockContent` objects. */
export type LocaleString = { en: string; ar?: string; fr?: string };
export type LocaleText = { en: string; ar?: string; fr?: string };
export type LocaleBlockContent = {
  en?: PortableTextBlock[];
  ar?: PortableTextBlock[];
  fr?: PortableTextBlock[];
};

export type SanityImageWithAlt = Image & { alt?: LocaleString };

export type Amenity = {
  _id: string;
  name: LocaleString;
  icon: string;
  description?: LocaleString;
};

export type Developer = {
  _id: string;
  name: string;
  logo?: Image;
  isPlaceholder: boolean;
  website?: string;
};

export type Testimonial = {
  _id: string;
  quote: LocaleText;
  name: string;
  initials: string;
  context?: string;
};

export type Service = {
  _id: string;
  title: LocaleString;
  slug: Slug;
  summary?: LocaleText;
  body?: LocaleBlockContent;
  icon?: string;
};

export type BlogPost = {
  _id: string;
  title: LocaleString;
  slug: Slug;
  category?: string;
  excerpt?: LocaleText;
  coverImage?: SanityImageWithAlt;
  body?: LocaleBlockContent;
  readTime?: number;
  publishedAt: string;
};

export type Listing = {
  _id: string;
  name: LocaleString;
  slug: Slug;
  description?: LocaleBlockContent;
  status: "sales" | "off-plan" | "secondary";
  category?: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  sizeSqft?: number;
  completionYear?: number;
  floors?: number;
  videoUrl?: string;
  amenities?: { amenity: Amenity; descriptionOverride?: LocaleString }[];
  developer?: Developer;
  gallery?: SanityImageWithAlt[];
  featured: boolean;
  isPlaceholder: boolean;
};
