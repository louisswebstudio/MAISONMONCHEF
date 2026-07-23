import type { SchemaTypeDefinition } from "sanity";

import { localeString, localeText, localeBlockContent } from "./objects/localeFields";
import { articleImage, pullQuote } from "./objects/articleBlocks";
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
import { areaRegion } from "./documents/areaRegion";
import { area } from "./documents/area";
import { developer } from "./documents/developer";
import { testimonial } from "./documents/testimonial";
import { blogPost } from "./documents/blogPost";
import { service } from "./documents/service";
import { contactSubmission } from "./documents/contactSubmission";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    page,
    listing,
    amenity,
    areaRegion,
    area,
    developer,
    testimonial,
    blogPost,
    service,
    contactSubmission,
    // Reusable field/section objects
    localeString,
    localeText,
    localeBlockContent,
    articleImage,
    pullQuote,
    heroSection,
    richTextSection,
    testimonialsSection,
    developersSection,
    ctaBannerSection,
  ],
};
