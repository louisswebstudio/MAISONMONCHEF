import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import {
  AdvisoryIcon,
  PortfolioIcon,
  ConsultationIcon,
} from "@/components/ui/process-icons";

/**
 * "Why Maison Monchef" — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node
 * 138:3117 "Section - Our Process"). Authored as a fixed 1240px desktop frame:
 * a text column (eyebrow, heading, intro, two CTAs) beside a three-step
 * vertical timeline (white icon tiles on a grey gutter, joined by a 3px line),
 * over a full-width 384px brand photo band.
 *
 * Reproduced responsively (no mobile frame supplied): the columns stack below
 * lg and the fixed 171px step heights relax to content height + padding so the
 * connector line still spans the gap. `#e5e5e5` (tile gutter / line) and
 * `#5f5f5f` (body grey) are exact Figma values with no design token, as in the
 * neighbouring sections.
 */

type Step = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function Process({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.process;
  const base = `/${lang}`;

  const steps: Step[] = [
    { icon: <AdvisoryIcon />, ...t.steps.advisory },
    { icon: <PortfolioIcon />, ...t.steps.portfolio },
    { icon: <ConsultationIcon />, ...t.steps.consultation },
  ];

  return (
    <section className="w-full py-section">
      <Container>
        <div className="flex flex-col gap-[58px]">
          <div className="flex flex-col gap-14 lg:flex-row lg:items-start lg:gap-[154px]">
            {/* Text column */}
            <Reveal className="flex flex-1 flex-col items-start gap-[22px]">
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

              <div className="flex flex-col gap-[15.4px]">
                <h2 className="font-display text-[38px] font-semibold leading-[1.08] text-navy sm:text-[54px]">
                  {t.heading}
                </h2>
                <p className="max-w-[436px] text-[18px] font-medium leading-[28.8px] tracking-[-0.36px] text-[#5f5f5f]">
                  {t.intro}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-[14px] gap-y-3 pt-[8px]">
                <Button href={`${base}/collection`} variant="primary">
                  {t.ctaPrimary}
                </Button>
                <Button href={`${base}/contact`} variant="secondary">
                  {t.ctaSecondary}
                </Button>
              </div>
            </Reveal>

            {/* Timeline column */}
            <ProcessTimeline steps={steps} />
          </div>

          {/* Skyline photo band */}
          <Reveal className="relative h-[240px] w-full overflow-hidden bg-[#939292] sm:h-[384px]">
            <Image
              src="/brand/reception-centered.webp"
              alt={t.imageAlt}
              fill
              sizes="(min-width: 1240px) 1190px, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
