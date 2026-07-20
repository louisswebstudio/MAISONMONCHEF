import type { ComponentType, SVGProps } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import {
  IntegrityIcon,
  ClientCenteredIcon,
  MarketExpertiseIcon,
  ResultsIcon,
} from "@/components/ui/stand-for-icons";

/**
 * "What We Stand For" — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node
 * 90:866 "Our Values Section"). Authored as a fixed 1240px desktop frame: a
 * left header column (eyebrow + trailing rule, H2, standfirst) that Figma
 * pins `sticky top-0`, beside a 595px panel holding four value cards.
 *
 * The cards are a plain list. A scroll-driven stacking deck was tried here and
 * removed at the client's request — if it is ever revisited, it was pure CSS
 * `position: sticky` with a per-card offset, no scroll listener.
 *
 * Figma paints the panel #e5e5e5 with white cards — mapped to the warm `linen`
 * gutter + white tile pairing already used by the About stats bar and the
 * Process timeline. Radii are flattened to the brand's sharp 0px (Figma draws
 * them at 8px) and Inter is mapped to Montserrat, as in the neighbouring
 * sections. `#5f5f5f` (standfirst grey) and `#c6c6c6` (rule) are exact Figma
 * values with no design token.
 */

type Value = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

export function StandFor({ dict }: { dict: Dictionary }) {
  const t = dict.standFor;

  const values: Value[] = [
    { icon: IntegrityIcon, ...t.values.integrity },
    { icon: ClientCenteredIcon, ...t.values.clientCentered },
    { icon: MarketExpertiseIcon, ...t.values.marketExpertise },
    { icon: ResultsIcon, ...t.values.results },
  ];

  return (
    <section className="w-full py-section">
      <Container>
        <div className="flex flex-col gap-[40px] lg:flex-row lg:items-start lg:gap-[60px]">
          {/* ── Header column — pinned beside the deck at lg ─────────────── */}
          <Reveal className="flex flex-col gap-[28px] lg:sticky lg:top-[112px] lg:flex-1">
            <div className="flex w-full items-center gap-[10px]">
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
              <span aria-hidden className="h-px flex-1 bg-[#c6c6c6]" />
            </div>

            <div className="flex flex-col gap-[12px]">
              <h2 className="font-display text-[32px] font-semibold leading-[1.29] tracking-[-0.04em] text-charcoal sm:text-[46px]">
                {t.heading}
              </h2>
              <p className="max-w-[520px] text-[18px] font-normal leading-[28px] tracking-[-0.4px] text-[#5f5f5f] sm:text-[20px]">
                {t.intro}
              </p>
            </div>
          </Reveal>

          {/* ── The deck ─────────────────────────────────────────────────── */}
          {/* Figma splits the 1240px frame 585 | 60 | 595 — near enough 50/50,
              so both columns flex rather than pinning the panel to 595px,
              which would starve the header inside this project's 1040px band. */}
          <div className="flex w-full flex-col gap-[16px] bg-linen p-[8px] lg:max-w-[595px] lg:flex-1">
            {values.map((value) => (
              <ValueCard key={value.title} value={value} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ValueCard({ value }: { value: Value }) {
  const Icon = value.icon;

  return (
    <div className="flex flex-col justify-center gap-[15px] bg-white p-[24px] shadow-[0px_11px_26px_0px_rgba(0,0,0,0.05),0px_-2px_8px_0px_rgba(0,0,0,0.03)]">
      <Icon className="size-[39px] shrink-0 text-navy" />

      <div className="flex flex-col gap-[9px]">
        <h3 className="font-display text-[22px] font-semibold leading-[1.4] tracking-[-0.48px] text-navy sm:text-[24px]">
          {value.title}
        </h3>
        <p className="text-[16px] font-normal leading-[25.6px] tracking-[-0.16px] text-charcoal">
          {value.description}
        </p>
      </div>
    </div>
  );
}
