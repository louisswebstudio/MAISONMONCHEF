"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image with a graceful fallback: if the source fails to load (missing or
 * broken asset), it swaps to a placeholder image instead of leaving the browser
 * to paint its broken-image icon over empty space. A soft skeleton tint sits
 * behind the image until it settles, so a slow/failed load never shows as a
 * bare box.
 *
 * `onError` handling requires a client component, so this thin wrapper exists to
 * keep server components (e.g. the Properties spotlight) able to render images
 * without becoming client components themselves.
 */
const DEFAULT_FALLBACK = "/brand/listings/property-placeholder.jpg";

export function FallbackImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className,
  onError,
  onLoad,
  ...props
}: ImageProps & { fallbackSrc?: string }) {
  const [current, setCurrent] = useState(src);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Skeleton tint — revealed until the image (or its fallback) settles. */}
      {!loaded && (
        <span aria-hidden className="absolute inset-0 animate-pulse bg-linen" />
      )}
      <Image
        {...props}
        src={current}
        alt={alt}
        className={className}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          // Guard against an infinite loop if the fallback itself is missing.
          if (current !== fallbackSrc) setCurrent(fallbackSrc);
          onError?.(e);
        }}
      />
    </>
  );
}
