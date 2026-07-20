/**
 * Property video block (node 25:33). Wired to accept a real video URL from the
 * property's CMS entry (`listing.videoUrl`):
 *   - an .mp4/.webm URL renders a native <video> player;
 *   - a YouTube/Vimeo watch or embed URL renders a responsive <iframe>;
 *   - when EMPTY (the current state — no real asset yet) it shows a clearly
 *     marked placeholder so it's obvious a walkthrough still needs uploading.
 *
 * NEEDS REAL ASSET: none of the seeded listings have `videoUrl` set. Replace the
 * placeholder by adding the walkthrough URL to the listing in Sanity.
 */
export function PropertyVideo({
  url,
  labels,
}: {
  url?: string;
  labels: { heading: string; placeholder: string; title: string };
}) {
  return (
    <section aria-labelledby="property-video-heading" className="flex flex-col gap-[20px]">
      <h2 id="property-video-heading" className="text-h3 text-navy">
        {labels.heading}
      </h2>

      {url ? (
        <div className="relative aspect-video w-full overflow-hidden bg-navy">
          {isFileVideo(url) ? (
            <video
              src={url}
              controls
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <iframe
              src={toEmbedUrl(url)}
              title={labels.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>
      ) : (
        <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-navy text-center">
          {/* Placeholder — clearly marked as awaiting a real asset. */}
          <div className="flex flex-col items-center gap-[14px] px-6">
            <span
              aria-hidden
              className="flex size-[64px] items-center justify-center border border-white/40 text-white"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <p className="max-w-[420px] text-[14px] font-medium leading-[1.5] tracking-[0.02em] text-white/75">
              {labels.placeholder}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function isFileVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

/** Normalise common YouTube/Vimeo watch URLs to their embeddable form. */
function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes("vimeo.com") && !u.pathname.startsWith("/video")) {
      return `https://player.vimeo.com/video${u.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
}
