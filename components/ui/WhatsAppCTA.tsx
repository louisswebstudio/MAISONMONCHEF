import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

/**
 * WhatsApp is the PRIMARY conversion mechanism site-wide (CLAUDE.md §5 —
 * "no forms, no queues, just a conversation"). Deep-links to wa.me with a
 * pre-filled message. Two presentations: inline button, or a fixed floating
 * action button for persistent access on every page.
 */
export function WhatsAppCTA({
  label,
  message,
  variant = "inline",
  className,
}: {
  label: string;
  message?: string;
  variant?: "inline" | "floating";
  className?: string;
}) {
  const href = whatsappLink(message);

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={cn(
          "fixed bottom-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-none",
          "bg-navy text-ivory shadow-lg transition-colors duration-150 hover:bg-charcoal",
          "end-6", // logical inset — mirrors correctly under RTL
          className,
        )}
      >
        <WhatsAppIcon width={26} height={26} />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-none px-7 py-3.5",
        "bg-navy text-ivory text-sm font-medium uppercase tracking-[0.12em]",
        "transition-colors duration-150 hover:bg-charcoal",
        className,
      )}
    >
      <WhatsAppIcon />
      {label}
    </a>
  );
}
