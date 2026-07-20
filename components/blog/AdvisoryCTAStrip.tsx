import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

/**
 * Quiet advisory prompt placed after an article body, before "Related Blogs".
 * A standalone component (not inline page markup) because it is intended for
 * reuse on other content pages — it takes only copy + labels and owns none of
 * the article's data.
 *
 * Deliberately NOT a banner: no fill, no border box, no eyebrow. A hairline
 * rule above it, generous section-scale padding, and a single primary action.
 * The strip is meant to be read as a pause between the article and the next
 * section, not as an advertisement interrupting it.
 *
 * Copy is STATIC/global — the same on every article regardless of category
 * (no per-category CTA logic in this version). It routes to the site-wide
 * WhatsApp conversion flow via `whatsappLink()`, the same helper WhatsAppCTA
 * and the property page use — nothing about that integration is rebuilt here.
 */
export function AdvisoryCTAStrip({
  text,
  buttonLabel,
  whatsappMessage,
  className,
}: {
  /** The invitation line, e.g. "Thinking about your next move? …" */
  text: string;
  /** Primary button label, e.g. "Contact Us". */
  buttonLabel: string;
  /** Optional pre-filled WhatsApp message. */
  whatsappMessage?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "w-full border-t border-linen pt-[56px] md:pt-[72px]",
        className,
      )}
    >
      <div className="flex flex-col items-start gap-[24px] sm:flex-row sm:items-center sm:justify-between sm:gap-[40px]">
        <p className="max-w-[46ch] text-[17px] font-medium leading-[1.55] tracking-[-0.34px] text-navy md:text-[19px]">
          {text}
        </p>
        <Button
          href={whatsappLink(whatsappMessage)}
          variant="primary"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          {buttonLabel}
        </Button>
      </div>
    </aside>
  );
}
