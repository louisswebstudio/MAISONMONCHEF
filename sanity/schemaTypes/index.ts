import type { SchemaTypeDefinition } from "sanity";

import { localeString, localeText, localeBlockContent } from "./objects/localeFields";
import {
  heroSection,
  richTextSection,
  testimonialsSection,
  developersSection,
  ctaBannerSection,
} from "./objects/sections";

import { page } from "./documents/page";
import { listing } from "./documents/listing";
import { amenity } from "./documents/amenity";
import { developer } from "./documents/developer";
import { testimonial } from "./documents/testimonial";
import { blogPost } from "./documents/blogPost";
import { service } from "./documents/service";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    page,
    listing,
    amenity,
    developer,
    testimonial,
    blogPost,
    service,
    // Reusable field/section objects
    localeString,
    localeText,
    localeBlockContent,
    heroSection,
    richTextSection,
    testimonialsSection,
    developersSection,
    ctaBannerSection,
  ],
};
