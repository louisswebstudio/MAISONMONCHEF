import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Centered content grid: 1240px max-width with responsive page margins
 * (24px mobile → 100px desktop). The single place page-margin math lives.
 */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-content px-6 md:px-page",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
