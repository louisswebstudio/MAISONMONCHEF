"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * "FAQ's" — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node 138:3337
 * "Section - Desktop"). Authored as a fixed 1240px desktop frame: a text
 * column (eyebrow, two-line heading, intro, wide Contact CTA) beside an
 * accordion of six question rows on a grey gutter.
 *
 * Figma only supplies the all-closed state — there is no open variant and no
 * answer copy in the file. Implemented as a real accordion (one panel open at
 * a time, plus icon crossfades to a minus); the ANSWER strings in the
 * dictionaries are placeholder copy written in the brand voice and need
 * client sign-off. Columns stack below lg (no mobile frame supplied).
 * `#e5e5e5` (gutter) and `#5f5f5f` (body grey) are exact Figma values with no
 * design token, as in the neighbouring sections.
 */

export function Faq({ lang, t }: { lang: string; t: Dictionary["faq"] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="w-full py-section">
      <div className="mx-auto flex w-full max-w-content flex-col gap-14 px-6 md:px-page lg:flex-row lg:items-start lg:gap-[100px]">
        {/* Text column */}
        <Reveal className="flex flex-col items-start gap-[22px] lg:max-w-[545px] lg:flex-1">
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

          <div className="flex flex-col gap-[17.4px]">
            <h2 className="font-display text-[38px] font-semibold leading-[1.08] text-navy sm:text-[54px]">
              {t.heading}
            </h2>
            <p className="max-w-[436px] text-[18px] font-medium leading-[28.8px] tracking-[-0.36px] text-[#5f5f5f]">
              {t.intro}
            </p>
          </div>

          <div className="w-full pt-[8px]">
            <Button
              href={`/${lang}/contact`}
              variant="primary"
              className="h-[46px] w-full max-w-[250px]"
            >
              {t.cta}
            </Button>
          </div>
        </Reveal>

        {/* Accordion */}
        <Reveal delay={120} className="lg:flex-1">
          <div className="flex flex-col gap-[8px] bg-linen p-[8px]">
            {t.items.map((item, i) => (
              <FaqRow
                key={item.question}
                item={item}
                index={i}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FaqRow({
  item,
  index,
  open,
  onToggle,
}: {
  item: { question: string; answer: string };
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className="w-full bg-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.06)]">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center gap-[12px] p-[24px] text-start transition-colors duration-200 hover:bg-paper"
        >
          <span className="flex-1 text-[18px] font-medium leading-[28.8px] tracking-[-0.36px] text-navy">
            {item.question}
          </span>
          <span className="relative flex size-[22px] shrink-0 items-center justify-center rounded-hairline bg-navy shadow-[0px_12px_15px_rgba(30,54,93,0.15),inset_0px_2px_4.4px_rgba(255,255,255,0.5)]">
            <PlusIcon
              className={cn(
                "transition-transform duration-300",
                open && "rotate-45",
              )}
            />
          </span>
        </button>
      </h3>

      {/* Answer panel — grid-rows trick animates height between 0fr and 1fr. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="px-[24px] pb-[24px] text-[16px] font-normal leading-[24px] tracking-[0.3px] text-[#5f5f5f]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Plus mark (node 138:3370) — rotates 45° into a close mark when open. */
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1.875 6H10.125"
        stroke="white"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 1.875V10.125"
        stroke="white"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
