import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import {
  PositioningIcon,
  CentralAddressIcon,
  MarketAccessIcon,
  DiscretionIcon,
} from "@/components/ui/value-icons";

/**
 * "Our Value" — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node 108:316
 * "Our Value Section"). Authored as a fixed 1240px desktop frame: a centred
 * header (eyebrow set between two hairlines, then the H2) over a three-column
 * band — a stacked pair of value cards, the CEO portrait, and a second stacked
 * pair. The portrait is 406×521 and the two card columns are each 521px tall,
 * so all three columns end on exactly the same baseline; that relationship is
 * reproduced by fixing the row to 521px at lg and letting the cards flex to
 * fill it (2 × 244.5px + the 32px gap).
 *
 * COPY: three of the four cards carried leftover template copy from an
 * unrelated property-search app (school districts, bidding activity, flood and
 * seismic risk) and are NOT cloned — the client-corrected copy lives in the
 * dictionary. Only "A Central Address" is genuine Figma content (it describes
 * the real Business Bay office); it is kept verbatim, retitled from the
 * template's "Metro & Transit". The four ICONS are the Figma originals.
 *
 * Reproduced responsively (no mobile frame supplied): below lg the row unstacks
 * to a single column with the portrait lifted to the top, and the cards relax
 * from the fixed 521px split to their content height.
 *
 * Figma paints the cards #f5f5f5 and the header rules #eaeaea; the card fill is
 * mapped to the warm `paper` token per the premium pass (as with the other
 * sections), while `#eaeaea` stays an exact Figma value with no design token.
 */

type ValueCard = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

export function OurValue({ dict }: { dict: Dictionary }) {
  const t = dict.ourValue;

  const left: ValueCard[] = [
    { icon: PositioningIcon, ...t.cards.positioning },
    { icon: CentralAddressIcon, ...t.cards.centralAddress },
  ];
  const right: ValueCard[] = [
    { icon: MarketAccessIcon, ...t.cards.marketAccess },
    { icon: DiscretionIcon, ...t.cards.discretion },
  ];

  return (
    <section className="w-full py-section">
      <Container>
        {/* ── Header: eyebrow between two rules, then the heading ────────── */}
        <Reveal className="flex flex-col items-center gap-[12px]">
          <div className="flex w-full items-center justify-center gap-[16px]">
            <span aria-hidden className="h-px flex-1 bg-[#eaeaea]" />
            <span className="flex shrink-0 items-center gap-[7px]">
              <span
                aria-hidden
                className="flex items-center justify-center rounded-hairline border border-navy p-[3px]"
              >
                <span className="size-[6px] bg-navy" />
              </span>
              <span className="text-[14px] font-bold uppercase leading-[21px] tracking-[0.3px] text-navy">
                {t.eyebrow}
              </span>
            </span>
            <span aria-hidden className="h-px flex-1 bg-[#eaeaea]" />
          </div>

          <h2 className="text-center font-display text-[32px] font-semibold leading-[1.29] tracking-[-0.04em] text-charcoal sm:text-[46px]">
            {t.heading}
          </h2>
        </Reveal>

        {/* ── Cards | portrait | cards ───────────────────────────────────── */}
        <div className="mt-[34px] flex flex-col gap-[32px] lg:flex-row lg:items-start lg:justify-center lg:gap-[14px]">
          <ValueColumn cards={left} />

          {/* CEO portrait — 406×521 in Figma, matching both card columns.
              Lifted above the cards below lg, where the row is a single stack. */}
          <div className="h-[380px] w-full max-lg:order-first sm:h-[520px] lg:h-[521px] lg:w-[406px] lg:shrink-0">
            <Reveal delay={140} className="relative h-full w-full overflow-hidden">
              <Image
                src="/brand/about/our-value-ceo.png"
                alt={t.photoAlt}
                fill
                sizes="(min-width: 1024px) 406px, (min-width: 768px) calc(100vw - 200px), calc(100vw - 48px)"
                /* The subject's head sits in the top ~quarter of the frame, so a
                   centred cover-crop drops his face on the shorter mobile/tablet
                   containers. Anchor the crop to the top to keep the head in
                   view; at lg the container aspect ≈ the source, so this is
                   imperceptible there. */
                className="object-cover object-top"
              />
            </Reveal>
          </div>

          <ValueColumn cards={right} delay={70} />
        </div>
      </Container>
    </section>
  );
}

/** One 521px-tall stack of two cards; the cards split the height evenly at lg.
 *  Layout classes stay on plain wrappers rather than on `Reveal`, which owns
 *  only the reveal transition. */
function ValueColumn({ cards, delay = 0 }: { cards: ValueCard[]; delay?: number }) {
  return (
    <div className="flex flex-col gap-[32px] lg:h-[521px] lg:flex-1">
      {cards.map((card, i) => (
        <div key={card.title} className="lg:min-h-0 lg:flex-1">
          <Reveal delay={delay + i * 140} className="h-full">
            <ValueCardTile card={card} />
          </Reveal>
        </div>
      ))}
    </div>
  );
}

function ValueCardTile({ card }: { card: ValueCard }) {
  const Icon = card.icon;

  return (
    <div className="flex h-full flex-col justify-center gap-[24px] bg-paper px-[24px] py-[34px]">
      <Icon className="size-[32px] shrink-0 text-navy" />

      <div className="flex flex-col gap-[13px]">
        <h3 className="font-display text-[22px] font-semibold leading-[1.43] text-navy">
          {card.title}
        </h3>
        <p className="text-[16px] font-normal leading-[25.6px] text-charcoal">
          {card.description}
        </p>
      </div>
    </div>
  );
}
