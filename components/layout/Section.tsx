import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Background = "ivory" | "navy" | "light-stone";

const backgrounds: Record<Background, string> = {
  ivory: "bg-ivory text-charcoal",
  navy: "bg-navy text-ivory",
  "light-stone": "bg-light-stone text-charcoal",
};

/**
 * Standard page section: ~80px vertical rhythm (py-section) with an optional
 * brand background. Wrap content in the centered Container unless `bleed`.
 */
export function Section({
  background = "ivory",
  bleed = false,
  className,
  containerClassName,
  children,
}: {
  background?: Background;
  bleed?: boolean;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn("py-section", backgrounds[background], className)}
    >
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
