import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
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
 * over a full-width 384px skyline photo band.
 *
 * Reproduced responsively (no mobile frame supplied): the columns stack below
 * lg and the fixed 171px step heights relax to content height + padding so the
 * connector line still spans the gap. `#e5e5e5` (tile gutter / line) and
 * `#5f5f5f` (body grey) are exact Figma values with no design token, as in the
 * neighbouring sections.
 */

type Step = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

export function Process({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.process;
  const base = `/${lang}`;

  const steps: Step[] = [
    { icon: AdvisoryIcon, ...t.steps.advisory },
    { icon: PortfolioIcon, ...t.steps.portfolio },
    { icon: ConsultationIcon, ...t.steps.consultation },
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
            <div className="flex flex-1 flex-col">
              {steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 140}>
                  <ProcessStep step={step} isLast={i === steps.length - 1} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Skyline photo band */}
          <Reveal className="relative h-[240px] w-full overflow-hidden bg-[#939292] sm:h-[384px]">
            <Image
              src="/brand/process/process-skyline.png"
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

function ProcessStep({ step, isLast }: { step: Step; isLast: boolean }) {
  const Icon = step.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-[24px] sm:gap-[34px]",
        !isLast && "min-h-[171px] pb-[30px]",
      )}
    >
      {/* Icon tile + connector line */}
      <div className="flex flex-col items-center self-stretch">
        <span className="flex shrink-0 items-center justify-center bg-linen p-[5px]">
          <span className="flex size-[56px] items-center justify-center bg-white text-navy shadow-[0px_7px_16px_0px_rgba(0,0,0,0.15)]">
            <Icon />
          </span>
        </span>
        {!isLast && <span aria-hidden className="w-[3px] flex-1 bg-linen" />}
      </div>

      <div className="flex flex-col gap-[11.4px] pt-[2px]">
        <h3 className="font-display text-[26px] font-semibold leading-[1.2] text-navy">
          {step.title}
        </h3>
        <p className="text-[18px] font-medium leading-[28.8px] tracking-[-0.36px] text-[#5f5f5f]">
          {step.description}
        </p>
      </div>
    </div>
  );
}
