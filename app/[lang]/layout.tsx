import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { montserrat, cormorant } from "@/lib/fonts";
import {
  locales,
  defaultLocale,
  getDir,
  isLocale,
  localeNames,
  siteUrl,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { PageLoader } from "@/components/ui/PageLoader";

/** Pre-render all three locales at build time. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Base metadata for every page: per-language title/description + hreflang
 * alternates for all three locales (plus x-default). Deeper pages can extend
 * this via their own generateMetadata.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `/${locale}`]),
  );

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.defaultTitle,
      template: `%s · ${dict.meta.siteName}`,
    },
    description: dict.meta.defaultDescription,
    alternates: {
      canonical: `/${lang}`,
      languages: { ...languages, "x-default": `/${defaultLocale}` },
    },
    openGraph: {
      siteName: dict.meta.siteName,
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
      locale: lang,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={getDir(locale)}
      className={`${montserrat.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory text-charcoal">
        <PageLoader />
        <Nav lang={locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer lang={locale} dict={dict} />
        <WhatsAppCTA
          variant="floating"
          label={dict.cta.whatsapp}
          message={dict.cta.whatsappMessage}
        />
      </body>
    </html>
  );
}
