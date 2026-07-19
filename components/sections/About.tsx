import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * "About us" — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node 138:2296
 * "Section - About"). Authored as a fixed 1240px desktop frame; reproduced
 * responsively (decorative photo stacks show from lg up; stats reflow 2→4
 * columns) since no mobile frame has been supplied yet.
 *
 * Figma masks the whole content band with a horizontal alpha gradient that
 * fades the outer ~5% to transparent — reproduced here as a CSS linear-gradient
 * mask (a plain gradient, unlike the Hero's diagonal SVG masks) so the framed
 * side photos dissolve softly into the page at the left/right edges.
 *
 * Stat VALUES are placeholder ("X+" / "99%") exactly as in Figma — real figures
 * are pending from the client; only the labels are translated via the dictionary.
 * `#e5e5e5` (stats gutter) is an exact Figma value with no design token.
 */

/** Edge-fade mask matching Figma's paint0_linear_172_1788 gradient stops. */
const edgeFadeMask =
  "linear-gradient(90deg, transparent 0%, #000 5.05%, #000 95.5%, transparent 100%)";

type Stat = { value: string; label: string };

export function About({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.about;
  const base = `/${lang}`;

  const stats: Stat[] = [
    { value: "99%", label: t.stats.satisfaction },
    { value: "X+", label: t.stats.markets },
    { value: "X+", label: t.stats.expertise },
    { value: "X+", label: t.stats.properties },
  ];

  return (
    <section className="w-full py-section">
      <Container>
        <div
          className="relative mx-auto w-full max-w-content px-[25px]"
          style={{ maskImage: edgeFadeMask, WebkitMaskImage: edgeFadeMask }}
        >
          {/* Decorative framed photo stacks flanking the text (lg+ only). */}
          <AboutPhotos />

          {/* Centered text column */}
          <Reveal className="relative z-[1] mx-auto flex w-full max-w-[560px] flex-col items-center gap-[21.3px]">
            <div className="flex items-center gap-[7px]">
              <span
                aria-hidden
                className="flex items-center justify-center rounded-hairline border border-navy p-[3px]"
              >
                <span className="size-[6px] bg-warm-taupe" />
              </span>
              <span className="text-[12px] font-semibold uppercase leading-[21px] tracking-[0.18em] text-navy">
                {t.eyebrow}
              </span>
            </div>

            <h2 className="text-center font-display text-[30px] font-medium leading-[1.3] text-navy sm:text-[40px]">
              {t.heading}
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-x-[14px] gap-y-3 pt-[14.7px]">
              <Button href={`${base}/contact`} variant="primary">
                {t.ctaPrimary}
              </Button>

              <Button href={`${base}/about`} variant="secondary" className="group gap-[10px]">
                {t.ctaSecondary}
                <ArrowIcon />
              </Button>
            </div>
          </Reveal>

          {/* Stats bar */}
          <Reveal delay={150} className="relative z-[1] mt-[78px]">
            <div className="grid grid-cols-2 gap-[8px] bg-linen p-[8px] sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center gap-[8px] overflow-hidden bg-white p-[26px] shadow-[0px_11px_26px_0px_rgba(0,0,0,0.05),0px_-2px_8px_0px_rgba(0,0,0,0.03)]"
                >
                  <span className="font-display text-[44px] font-semibold leading-[1.1] text-navy sm:text-[56px]">
                    {stat.value}
                  </span>
                  <span className="text-center text-[16px] font-medium leading-[24px] tracking-[-0.3px] text-navy/70 sm:text-[18px]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/**
 * The four decorative photos — a smaller frame set behind and a larger frame in
 * front, mirrored on each side. Absolutely positioned against the content band;
 * hidden below lg where they would collide with the centered text.
 */
function AboutPhotos() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {/* Left — small back frame */}
      <PhotoFrame
        src="/brand/about/about-1.png"
        className="left-[-16px] top-[38px] h-[150px] w-[125px]"
      />
      {/* Right — small back frame */}
      <PhotoFrame
        src="/brand/about/about-1.png"
        className="right-[-16px] top-[38px] h-[150px] w-[125px]"
      />
      {/* Left — large front frame (handshake) */}
      <PhotoFrame
        src="/brand/about/about-2.png"
        className="left-[34px] top-[78px] h-[180px] w-[175px]"
      />
      {/* Right — large front frame */}
      <PhotoFrame
        src="/brand/about/about-3.png"
        className="right-[34px] top-[78px] h-[180px] w-[175px]"
      />
    </div>
  );
}

function PhotoFrame({ src, className }: { src: string; className: string }) {
  return (
    <div
      className={cn(
        "absolute overflow-hidden rounded-hairline border-2 border-white shadow-[0px_1px_15px_0px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      <Image src={src} alt="" fill sizes="175px" className="object-cover" />
    </div>
  );
}

/** Right-arrow (node 138:2330) — lifted 1:1 from Figma on its 11×11 viewBox.
 *  `currentColor` so it inherits the ghost button's navy text. Nudges right on
 *  hover to signal the link. */
function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path
        d="M2.29167 5.5H8.70833M5.5 8.70833L8.70833 5.5L5.5 2.29167"
        stroke="currentColor"
        strokeWidth="0.916667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
