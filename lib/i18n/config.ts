/**
 * i18n configuration — single source of truth for supported locales.
 *
 * Locales are served as separate URL path prefixes (/en, /ar, /fr), NOT a
 * client-side text-swap switcher. See `proxy.ts` for the locale redirect and
 * `app/[lang]/layout.tsx` for how `dir`/`lang` are applied per request.
 */

export const locales = ["en", "ar", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Locales that must render in a genuine right-to-left layout. */
export const rtlLocales: readonly Locale[] = ["ar"];

/** Human-readable names for the language switcher, shown in each own language. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  fr: "Français",
};

/** Short labels (EN / AR / FR) for compact switcher display. */
export const localeLabels: Record<Locale, string> = {
  en: "EN",
  ar: "AR",
  fr: "FR",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDir(locale: Locale): "rtl" | "ltr" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

/** The absolute site URL, used for canonical + hreflang alternates. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://maisonmonchef.ae";
