import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDir, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { About } from "@/components/sections/About";
import { OurValue } from "@/components/sections/OurValue";
import { StandFor } from "@/components/sections/StandFor";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";

/**
 * The House (About) — built section by section from Figma (file
 * r2XTjIJ5uaZ0VFCG2kfCdn), one node at a time, exactly as the home page is.
 * Only sections cloned from a supplied node ID are rendered here; nothing on
 * this page is invented content.
 *
 * Cloned so far: "Our Value Section" (node 108:316) and "Our Values Section"
 * (node 90:866). "Section - About", Testimonials and FAQ are the same shared
 * components the home page renders — reused here, not copied, so the two pages
 * can never drift apart. The page hero and the remaining About sections are
 * pending their node IDs.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.nav.about,
    alternates: { canonical: `/${lang}/about` },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <About lang={locale} dict={dict} />
      <OurValue dict={dict} />
      <StandFor dict={dict} />
      <Testimonials t={dict.testimonials} rtl={getDir(locale) === "rtl"} />
      <Faq lang={locale} t={dict.faq} />
    </>
  );
}
