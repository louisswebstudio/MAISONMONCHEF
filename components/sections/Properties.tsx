import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PropertyCarousel } from "@/components/sections/PropertyCarousel";
import { FEATURED_PROPERTIES } from "@/lib/featured-property";

/**
 * "Our properties" — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node
 * 138:2376 "Section - Properties"). Authored as a fixed 1440px desktop frame:
 * a header (heading left, intro right) over a carousel whose active slide is a
 * large featured-property card, flanked by faded prev/next cards and nav arrows.
 *
 * Reproduced responsively (no mobile frame supplied): the card stacks (image
 * over details) below lg; the peek cards and arrows show from xl / lg up. This
 * section is a server wrapper for the header; the interactive carousel (active
 * slide, prev/next, position counter, auto-play) lives in the PropertyCarousel
 * client component. Card content is placeholder (see lib/featured-property.ts).
 * `#e5e5e5` and `#5f5f5f` are exact Figma values with no design token.
 */
export function Properties({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.properties;

  return (
    <section className="w-full py-section">
      <Container>
        {/* Header — heading left, intro right (bottom-aligned) */}
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-[80px]">
          <div className="flex max-w-[500px] flex-col gap-[22px]">
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
            <h2 className="font-display text-[38px] font-semibold leading-[1.08] text-navy sm:text-[54px]">
              {t.heading}
            </h2>
          </div>

          <p className="max-w-[400px] text-[18px] font-medium leading-[28.8px] tracking-[-0.36px] text-[#5f5f5f]">
            {t.intro}
          </p>
        </Reveal>

        {/* Carousel (client) */}
        <Reveal delay={120}>
          <PropertyCarousel lang={lang} dict={dict} properties={FEATURED_PROPERTIES} />
        </Reveal>
      </Container>
    </section>
  );
}
