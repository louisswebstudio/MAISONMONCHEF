import Image from "next/image";
import Link from "next/link";

/**
 * The ONE blog/insight card used everywhere on the site — the homepage "Refined
 * real estate insights" row and the "Related Blogs" row on a single article
 * page. Extracted verbatim from components/sections/Blog.tsx (Figma file
 * r2XTjIJ5uaZ0VFCG2kfCdn, node 138:3440) so those two rows can never drift
 * apart. The only change to the extracted markup is `flex-1` + `mt-auto` on the
 * divider, which bottom-aligns the meta row across a row of cards whose copy
 * differs in length; on the homepage (identical placeholder copy in all three)
 * it is a no-op.
 *
 * Callers normalize their own data into {@link BlogCardData} rather than the
 * card knowing about dictionaries or Sanity — the homepage feeds it static
 * dictionary items, the article page feeds it Sanity `blogPost` documents.
 *
 * `excerpt` is OPTIONAL and renders nothing when absent: the Figma homepage
 * card has no description line, while the Related Blogs card does. Same
 * component, one conditional row.
 */
export type BlogCardData = {
  /** Where the card links. Locale prefix is the caller's job. */
  href: string;
  /** Resolved image URL — a local asset path or a Sanity CDN URL. */
  image: string;
  imageAlt?: string;
  /** Display label, already translated (e.g. "Selling Guide"). */
  category?: string;
  title: string;
  /** Short description. Omit to render the homepage's tighter card. */
  excerpt?: string;
  /** Read time value shown before `minutesLabel` (e.g. 5 or "5"). */
  minutes?: number | string;
  /** Publish date, already formatted for the active locale. */
  date: string;
};

export function BlogCard({
  data,
  minutesLabel,
  sizes = "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw",
}: {
  data: BlogCardData;
  minutesLabel: string;
  sizes?: string;
}) {
  return (
    <Link
      href={data.href}
      className="card-surface card-interactive group flex h-full flex-col gap-[10px] p-[10px]"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={data.image}
          alt={data.imageAlt ?? ""}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>

      <div className="flex flex-1 flex-col items-start gap-[10px] p-[10px]">
        {data.category && (
          <span className="bg-warm-taupe px-[12px] py-[4px] text-[16px] font-normal leading-[24px] tracking-[0.3px] text-white">
            {data.category}
          </span>
        )}

        <h3 className="text-[20px] font-medium leading-[30.8px] text-navy">
          {data.title}
        </h3>

        {data.excerpt && (
          <p className="text-[15px] font-normal leading-[24px] text-charcoal/80">
            {data.excerpt}
          </p>
        )}

        <div aria-hidden className="mt-auto w-full border-t border-linen" />

        <div className="flex items-center gap-[19px] text-navy">
          {data.minutes != null && (
            <span className="flex items-center gap-[5px] py-[6px]">
              <BookIcon />
              <span className="flex items-center gap-[4px]">
                <span className="text-[14px] font-normal leading-[24px] tracking-[0.3px]">
                  {data.minutes}
                </span>
                <span className="text-[12px] font-normal leading-[24px] tracking-[0.3px]">
                  {minutesLabel}
                </span>
              </span>
            </span>
          )}
          <span className="flex items-center gap-[5px] py-[6px]">
            <CalendarIcon />
            <span className="text-[12px] font-normal leading-[24px] tracking-[0.3px]">
              {data.date}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Open-book read-time mark (node 64:1726) — 1:1 from Figma. Exported so the
 * article page's byline row uses the SAME mark as the cards.
 */
export function BookIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M18.125 3.75H12.5C12.0149 3.75 11.5364 3.86295 11.1025 4.07992C10.6685 4.29688 10.2911 4.61189 10 5C9.70892 4.61189 9.33147 4.29688 8.89754 4.07992C8.46362 3.86295 7.98514 3.75 7.5 3.75H1.875C1.70924 3.75 1.55027 3.81585 1.43306 3.93306C1.31585 4.05027 1.25 4.20924 1.25 4.375V15.625C1.25 15.7908 1.31585 15.9497 1.43306 16.0669C1.55027 16.1842 1.70924 16.25 1.875 16.25H7.5C7.99728 16.25 8.47419 16.4475 8.82583 16.7992C9.17746 17.1508 9.375 17.6277 9.375 18.125C9.375 18.2908 9.44085 18.4497 9.55806 18.5669C9.67527 18.6842 9.83424 18.75 10 18.75C10.1658 18.75 10.3247 18.6842 10.4419 18.5669C10.5592 18.4497 10.625 18.2908 10.625 18.125C10.625 17.6277 10.8225 17.1508 11.1742 16.7992C11.5258 16.4475 12.0027 16.25 12.5 16.25H18.125C18.2908 16.25 18.4497 16.1842 18.5669 16.0669C18.6842 15.9497 18.75 15.7908 18.75 15.625V4.375C18.75 4.20924 18.6842 4.05027 18.5669 3.93306C18.4497 3.81585 18.2908 3.75 18.125 3.75ZM7.5 15C6.82367 14.9989 6.16542 15.2183 5.625 15.625H2.5V5H7.5C7.99728 5 8.47419 5.19754 8.82583 5.54917C9.17746 5.90081 9.375 6.37772 9.375 6.875V15.625C8.83458 15.2183 8.17633 14.9989 7.5 15ZM17.5 15H14.375C13.6987 14.9989 13.0404 15.2183 12.5 15.625V6.875C12.5 6.37772 12.6975 5.90081 13.0492 5.54917C13.4008 5.19754 13.8777 5 14.375 5H17.5V15Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Calendar date mark (node 64:1739) — 1:1 from Figma. */
export function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M16.25 2.5H14.375V1.875C14.375 1.70924 14.3092 1.55027 14.1919 1.43306C14.0747 1.31585 13.9158 1.25 13.75 1.25C13.5842 1.25 13.4253 1.31585 13.3081 1.43306C13.1908 1.55027 13.125 1.70924 13.125 1.875V2.5H6.875V1.875C6.875 1.70924 6.80915 1.55027 6.69194 1.43306C6.57473 1.31585 6.41576 1.25 6.25 1.25C6.08424 1.25 5.92527 1.31585 5.80806 1.43306C5.69085 1.55027 5.625 1.70924 5.625 1.875V2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM5.625 3.75V4.375C5.625 4.54076 5.69085 4.69973 5.80806 4.81694C5.92527 4.93415 6.08424 5 6.25 5C6.41576 5 6.57473 4.93415 6.69194 4.81694C6.80915 4.69973 6.875 4.54076 6.875 4.375V3.75H13.125V4.375C13.125 4.54076 13.1908 4.69973 13.3081 4.81694C13.4253 4.93415 13.5842 5 13.75 5C13.9158 5 14.0747 4.93415 14.1919 4.81694C14.3092 4.69973 14.375 4.54076 14.375 4.375V3.75H16.25V6.25H3.75V3.75H5.625ZM16.25 16.25H3.75V7.5H16.25V16.25Z"
        fill="currentColor"
      />
    </svg>
  );
}
