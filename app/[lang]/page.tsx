import { notFound } from "next/navigation";
import { getDir, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { FeaturedListings } from "@/components/sections/FeaturedListings";
import { About } from "@/components/sections/About";
import { Properties } from "@/components/sections/Properties";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Blog } from "@/components/sections/Blog";

/**
 * Home — built section by section from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn),
 * one node at a time. Only sections that have been cloned from a supplied
 * node ID are rendered here; nothing on this page is invented content.
 */
export default async function HomePage({
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
      <Hero lang={locale} dict={dict} />
      <Partners dict={dict} />
      <FeaturedListings lang={locale} dict={dict} />
      <Process lang={locale} dict={dict} />
      <Properties lang={locale} dict={dict} />
      <About lang={locale} dict={dict} />
      <Testimonials t={dict.testimonials} rtl={getDir(locale) === "rtl"} />
      <Faq lang={locale} t={dict.faq} />
      <Blog lang={locale} dict={dict} />
    </>
  );
}
