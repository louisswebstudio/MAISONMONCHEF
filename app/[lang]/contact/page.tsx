import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  LocationPinIcon,
  PhoneLineIcon,
  MailLineIcon,
} from "@/components/ui/contact-icons";

/**
 * Contact — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node 57:334
 * "Contact & Form"): a two-column hero (intro + three contact items on the
 * left, enquiry form on the right) over the 1240px content grid, then a
 * content-width photo band of the Business Bay skyline.
 *
 * All contact VALUES (locality, phone, email) come from the single source in
 * lib/site.ts — never inlined here — so the corrections logged in CLAUDE.md §5
 * against the original template's placeholder address, foreign phone number
 * and stock email domain can never drift back in. Nav/Footer come from the
 * locale layout, as on every page.
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
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
    alternates: { canonical: `/${lang}/contact` },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const t = dict.contact;

  const items = [
    {
      icon: <LocationPinIcon />,
      label: t.items.officeLabel,
      value: site.locality,
    },
    {
      icon: <PhoneLineIcon />,
      label: t.items.directLabel,
      value: site.phoneDisplay,
      href: site.phoneHref,
    },
    {
      icon: <MailLineIcon />,
      label: t.items.enquiriesLabel,
      value: site.email,
      href: site.emailHref,
    },
  ];

  return (
    <div className="pb-[96px] pt-[80px]">
      <Container className="flex flex-col gap-[80px]">
        {/* ── Hero: intro + items | form ─────────────────────────────────── */}
        {/* Column split is the Figma 585:655 ratio scaled to the real 1040px
            inner grid (Container is max-w 1240px minus 2×100px page margin):
            491px intro / 549px form, flush with no gap — the form panel's own
            #fcfcfc fill and 20px padding provide the separation. The form is
            deliberately the WIDER column. */}
        <div className="flex flex-col items-start gap-[54px] lg:flex-row lg:items-start lg:gap-0">
          {/* Left — intro + contact items */}
          <div className="flex w-full flex-col gap-[54px] lg:w-[491px] lg:shrink-0 lg:pe-[40px]">
            <div className="flex flex-col gap-[8px]">
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

              <div className="flex flex-col gap-[9px]">
                <h1 className="text-[36px] font-semibold leading-[1.1] tracking-[-1.44px] text-charcoal sm:text-[46px] sm:leading-[59.34px]">
                  {t.heading}
                </h1>
                <p className="max-w-[520px] text-[18px] font-medium leading-[28px] tracking-[-0.54px] text-[#5f5f5f]">
                  {t.subhead}
                </p>
              </div>
            </div>

            <ul className="flex flex-col gap-[25px]">
              {items.map((item) => (
                <li key={item.label} className="flex items-center gap-[15px]">
                  <span
                    aria-hidden
                    className="flex size-[46px] shrink-0 items-center justify-center bg-[#e7e5de] text-navy"
                  >
                    {item.icon}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[16px] font-medium leading-[25.6px] tracking-[-0.48px] text-charcoal">
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-[15px] font-medium leading-[24px] tracking-[-0.45px] text-[#5f5f5f] transition-colors duration-150 hover:text-navy [overflow-wrap:anywhere]"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-[15px] font-medium leading-[24px] tracking-[-0.45px] text-[#5f5f5f]">
                        {item.value}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — enquiry form */}
          <div className="w-full lg:flex-1">
            <ContactForm t={t} />
          </div>
        </div>

        {/* ── Full-width (content-width) photo band ──────────────────────── */}
        <div className="relative h-[280px] w-full overflow-hidden sm:h-[360px] lg:h-[405px]">
          <Image
            src="/brand/reception-centered.webp"
            alt={t.photoAlt}
            fill
            sizes="(min-width: 1240px) 1040px, (min-width: 768px) calc(100vw - 200px), calc(100vw - 48px)"
            className="object-cover"
          />
        </div>
      </Container>
    </div>
  );
}
