"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Step = {
  icon: ReactNode;
  title: string;
  description: string;
};

/**
 * Icon column + connector for the "Why Maison Monchef" timeline. The
 * connector is one continuous line behind the tiles, measured from the
 * first icon's center to the last icon's center — not a fixed height —
 * so it keeps working if a step is added/removed or text wraps differently.
 */
export function ProcessTimeline({ steps }: { steps: Step[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const update = () => {
      const icons = iconRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (icons.length < 2) return;
      const containerTop = container.getBoundingClientRect().top;
      const first = icons[0].getBoundingClientRect();
      const last = icons[icons.length - 1].getBoundingClientRect();
      const firstCenter = first.top + first.height / 2 - containerTop;
      const lastCenter = last.top + last.height / 2 - containerTop;
      line.style.top = `${firstCenter}px`;
      line.style.height = `${lastCenter - firstCenter}px`;
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, [steps.length]);

  return (
    <div ref={containerRef} className="relative isolate flex flex-1 flex-col">
      <span
        ref={lineRef}
        aria-hidden
        className="absolute left-[33px] -z-10 w-[3px] bg-linen"
      />
      {steps.map((step, i) => (
        <Reveal key={step.title} delay={i * 140}>
          <ProcessStep
            step={step}
            isLast={i === steps.length - 1}
            iconRef={(el) => {
              iconRefs.current[i] = el;
            }}
          />
        </Reveal>
      ))}
    </div>
  );
}

function ProcessStep({
  step,
  isLast,
  iconRef,
}: {
  step: Step;
  isLast: boolean;
  iconRef: (el: HTMLSpanElement | null) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-[24px] sm:gap-[34px]",
        !isLast && "min-h-[171px] pb-[30px]",
      )}
    >
      {/* Icon tile (sits over the shared connector line) */}
      <span
        ref={iconRef}
        className="flex shrink-0 items-center justify-center bg-linen p-[5px]"
      >
        <span className="flex size-[56px] items-center justify-center bg-white text-navy shadow-[0px_7px_16px_0px_rgba(0,0,0,0.15)]">
          {step.icon}
        </span>
      </span>

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
