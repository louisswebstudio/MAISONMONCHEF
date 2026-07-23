import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/layout/Container";

/**
 * Privacy Policy — a content-width legal page rendered from the localized
 * `privacy` dictionary section (en/ar/fr). Nothing is inlined here: the body
 * copy lives in dictionaries/<locale>.json, so the page stays in sync with the
 * rest of the site and translates per locale. Nav/Footer come from the locale
 * layout, and the footer's "Privacy Policy" link points here.
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
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
    alternates: { canonical: `/${lang}/privacy` },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const t = dict.privacy;

  return (
    <div className="pb-[96px] pt-[80px]">
      <Container className="flex flex-col gap-[54px]">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="flex max-w-[760px] flex-col gap-[8px]">
          <div className="flex items-center gap-[6px]">
            <span
              aria-hidden
              className="flex items-center justify-center rounded-hairline border border-navy p-[3px]"
            >
              <span className="size-[6px] bg-navy" />
            </span>
            <span className="text-[14px] font-bold uppercase leading-[27px] tracking-[0.3px] text-navy">
              {t.eyebrow}
            </span>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h1 className="text-[36px] font-semibold leading-[1.1] tracking-[-1.44px] text-charcoal sm:text-[46px] sm:leading-[59.34px]">
              {t.heading}
            </h1>
            <p className="text-[14px] font-medium tracking-[-0.28px] text-[#5f5f5f]">
              {t.updatedLabel}: {t.updated}
            </p>
            <p className="text-[18px] font-medium leading-[28px] tracking-[-0.54px] text-[#5f5f5f]">
              {t.intro}
            </p>
          </div>
        </header>

        {/* ── Sections ───────────────────────────────────────────────────── */}
        <div className="flex max-w-[760px] flex-col gap-[40px]">
          {t.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-[14px]">
              <h2 className="text-[24px] font-semibold leading-[1.25] tracking-[-0.72px] text-charcoal">
                {section.title}
              </h2>

              {section.body.map((para, i) => (
                <p
                  key={i}
                  className="text-[16px] font-medium leading-[26px] tracking-[-0.32px] text-[#5f5f5f]"
                >
                  {para}
                </p>
              ))}

              {section.items.length > 0 && (
                <ul className="flex flex-col gap-[10px] ps-[4px]">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-[12px] text-[16px] font-medium leading-[26px] tracking-[-0.32px] text-[#5f5f5f]"
                    >
                      <span
                        aria-hidden
                        className="mt-[10px] size-[6px] shrink-0 rounded-full bg-navy"
                      />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
