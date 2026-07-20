import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";

const builder = imageUrlBuilder({ projectId, dataset });

/**
 * Build a URL for a Sanity image source. Use with next/image; request WebP/AVIF
 * via `.format()` / `.auto("format")` and size with `.width()` for responsive
 * srcset. Sharp 0px corners are enforced by the frontend wrapper, not here.
 */
export function urlForImage(source: Image) {
  return builder.image(source).auto("format").fit("max");
}
