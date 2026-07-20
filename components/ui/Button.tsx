import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand button — the single shared CTA component (UI/UX pass). Three intentional
 * weights so exactly one PRIMARY reads per section/card and the alternate action
 * is visibly demoted:
 *
 *  - `primary`   — solid navy fill, white text. The one high-emphasis action.
 *  - `secondary` — ghost/outline on light backgrounds: hairline navy border,
 *                  navy text, near-transparent hover fill. Lower visual weight.
 *  - `on-photo`  — ghost over dark photos/overlays (hero, footer CTA band):
 *                  translucent white border + text, blur backing.
 *
 * The Figma "pill" treatment (2px radius, 16/8 padding, 16px normal-case text)
 * is now the BASE here, so callers no longer stitch on a `pillButtonClass` +
 * one-off shadow. Renders an <a>/next Link when `href` is set, else a <button>.
 */
type Variant = "primary" | "secondary" | "on-photo";

const base =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-hairline px-4 py-2 " +
  "text-base font-medium leading-[24.8px] tracking-[-0.32px] " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-150 " +
  "hover:-translate-y-[1.5px] active:translate-y-0 motion-reduce:transform-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-white shadow-[0px_10px_20px_-8px_rgba(18,28,45,0.45)] hover:bg-charcoal hover:shadow-[0px_14px_26px_-8px_rgba(18,28,45,0.5)]",
  secondary:
    "border border-navy/25 bg-transparent text-navy hover:border-navy hover:bg-navy/[0.05]",
  "on-photo":
    "border border-white/45 bg-white/10 text-white backdrop-blur-[2.5px] hover:bg-white/20 hover:border-white/70",
};

type CommonProps = { variant?: Variant; className?: string; children: ReactNode };

export function Button({
  variant = "primary",
  className,
  children,
  href,
  ...props
}: CommonProps &
  ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)) {
  const cls = cn(base, variants[variant], className);
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  if (external) {
    return (
      <a className={cls} href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link className={cls} href={href} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </Link>
  );
}

export function ButtonButton({
  variant = "primary",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
