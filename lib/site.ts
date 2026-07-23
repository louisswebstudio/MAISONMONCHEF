/**
 * Central contact + brand constants. Defined ONCE here so the recurring
 * corrections in CLAUDE.md §5 can never drift back in per-component:
 *   - Public email is bonjour@ ONLY (never info@/contact@/office@).
 *   - Phone is ALWAYS full international format for tel:/WhatsApp links.
 *   - Socials: Instagram + LinkedIn only for now (room left for FB/YouTube).
 */

export const site = {
  name: "Maison Monchef",
  legalName: "Maison Monchef Real Estate L.L.C.",
  /** Display phone — full international format, never the local 0507025116. */
  phoneDisplay: "+971 50 702 5116",
  /** tel: href (E.164, no spaces). */
  phoneHref: "tel:+971507025116",
  /** wa.me deep-link base — digits only, no "+" or spaces. */
  whatsappNumber: "971507025116",
  /** Public email — bonjour@ only. */
  email: "bonjour@maisonmonchef.ae",
  emailHref: "mailto:bonjour@maisonmonchef.ae",
  /** No specific street address anywhere — general locality only (CLAUDE.md §5). */
  locality: "Business Bay, Dubai, UAE",
} as const;

/** Instagram + LinkedIn only. Facebook/YouTube intentionally reserved, not shown. */
export const socials = [
  { name: "Instagram", href: "https://www.instagram.com/maisonmonchef?igsh=aTlqeG0ydXg0eTc1" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/maison-monchef/about/?viewAsMember=true" },
] as const;

/** Build a wa.me deep link with an optional pre-filled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
