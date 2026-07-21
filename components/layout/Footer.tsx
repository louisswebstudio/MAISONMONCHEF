import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site, socials } from "@/lib/site";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Site footer — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node 129:1272
 * "footer"). Rendered on every page via app/[lang]/layout.tsx. Two parts:
 *
 *  1. A "Get started" CTA banner over the brand skyline — reusing the Hero's
 *     exact mask system (diagonal blur band + bottom vignette, both from the
 *     shared /brand/hero-mask-*.svg) so the two skyline treatments match. The
 *     Figma frame's own background was a watermarked Unsplash+ stock preview,
 *     so the clean licensed hero-skyline.jpg is used instead (swap for the
 *     final CTA image if a distinct one is licensed).
 *  2. The footer proper (white): brand column (logo + tagline + Contact Us),
 *     Links / Socials / Other-info columns, and the copyright bar.
 *
 * Contact details come from the single source in lib/site.ts (bonjour@ email,
 * full-international phone). `#5f5f5f` (body grey), `#e5e5e5` / `#f0f0f0`
 * (copyright bar) are exact Figma values with no design token.
 */
export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const base = `/${lang}`;
  const t = dict.footer;
  const year = new Date().getFullYear();

  const links = [
    { href: `${base}/about`, label: dict.nav.about },
    { href: `${base}/services`, label: dict.nav.services },
    { href: `${base}/collection`, label: t.properties },
    { href: `${base}/blog`, label: dict.nav.blog },
    { href: `${base}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="mt-auto">
      {/* ── CTA banner ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[520px] w-full flex-col justify-center overflow-hidden py-[100px]">
        <Image
          src="/brand/hero-skyline.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />

        {/* Full mask: diagonal blur + tint band over the text side. The mask +
            gradient are authored for LTR (concentrated on the left, behind the
            text). `rtl:-scale-x-100` mirrors this single layer horizontally so
            the blur follows the text to the right under Arabic — same technique
            the Hero uses, no second hand-authored mask asset needed. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rtl:-scale-x-100"
          style={{
            backgroundImage:
              "linear-gradient(-48.71764583725056deg, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)",
            maskImage: "url(/brand/hero-mask-full.svg)",
            WebkitMaskImage: "url(/brand/hero-mask-full.svg)",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            backdropFilter: "blur(50px)",
            WebkitBackdropFilter: "blur(50px)",
          }}
        />

        {/* Bottom mask: soft vignette at the base. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[170px] overflow-hidden"
        >
          <div
            className="absolute inset-x-0 bottom-0 h-[240px]"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0) 18.739%, rgba(0,0,0,0.2) 100%)",
              maskImage: "url(/brand/hero-mask-bottom.svg)",
              WebkitMaskImage: "url(/brand/hero-mask-bottom.svg)",
              maskSize: "100% 170px",
              WebkitMaskSize: "100% 170px",
              maskPosition: "0px 70px",
              WebkitMaskPosition: "0px 70px",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              backdropFilter: "blur(4.5px)",
              WebkitBackdropFilter: "blur(4.5px)",
            }}
          />
        </div>

        <Container className="relative flex flex-col">
          <div className="flex max-w-[545px] flex-col items-start gap-[22px]">
            <div className="flex items-center gap-[7px] backdrop-blur-[30px]">
              <span
                aria-hidden
                className="flex items-center justify-center rounded-hairline border border-white p-[3px]"
              >
                <span className="size-[6px] bg-white" />
              </span>
              <span className="text-[14px] font-bold uppercase leading-[21px] text-white">
                {t.ctaEyebrow}
              </span>
            </div>

            <div className="flex flex-col gap-[15.39px]">
              <h2 className="text-[34px] font-semibold leading-[1.15] tracking-[-1.84px] text-white sm:text-[46px] sm:leading-[59.34px]">
                {t.ctaHeading}
              </h2>
              <p className="max-w-[436px] text-[18px] font-medium leading-[28.8px] tracking-[-0.36px] text-white/90">
                {t.ctaSubtext}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-[14px] pt-[8px]">
              <Button href={`${base}/collection`} variant="primary">
                {t.ctaExplore}
              </Button>
              <Button href={`${base}/contact`} variant="on-photo">
                {t.ctaContact}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Footer proper ──────────────────────────────────────────────── */}
      <div className="bg-white pb-[25px] pt-[56px]">
        <Container className="flex flex-col gap-[58px]">
          <div className="flex flex-col gap-14 lg:flex-row lg:gap-[56px]">
            {/* Brand */}
            <div className="flex max-w-[350px] flex-col gap-8 lg:w-[320px] lg:max-w-none lg:shrink-0">
              <Link href={base} aria-label={dict.meta.siteName} className="block">
                {/* Logo is a square lockup — scale the whole thing into a square
                    box (like the Nav) so the full wordmark shows, rather than
                    cropping a fixed window that clips "MAISON MONCHEF". Box is
                    234px to match the Figma footer logo (node 129:1272 →
                    74:2239, size-[234px]) so it anchors the brand column
                    instead of reading as an afterthought. */}
                <span className="relative block aspect-square w-[234px]">
                  <Image
                    src="/brand/logo.png"
                    alt={dict.meta.siteName}
                    fill
                    sizes="234px"
                    className="object-contain"
                  />
                </span>
              </Link>

              <div className="flex flex-col items-start gap-5">
                <p className="max-w-[320px] text-[17px] font-medium leading-[26.35px] tracking-[-0.34px] text-[#5f5f5f]">
                  {t.tagline}
                </p>
                <Button href={`${base}/contact`} variant="primary">
                  {t.contact}
                </Button>
              </div>
            </div>

            {/* Link columns — fill the remaining grid width (no dead middle gap,
                no right-edge overflow); the wider "Other info" column now fits
                the full email on one line. */}
            <div className="grid grid-cols-2 gap-x-[40px] gap-y-10 sm:grid-cols-[1fr_1fr_1.25fr] sm:gap-x-[32px] lg:flex-1">
              <FooterColumn heading={t.links}>
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[16px] font-medium leading-[24.8px] tracking-[-0.32px] text-[#5f5f5f] transition-colors duration-150 hover:text-navy"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </FooterColumn>

              <FooterColumn heading={t.socials}>
                {socials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[16px] font-medium leading-[24.8px] tracking-[-0.32px] text-[#5f5f5f] transition-colors duration-150 hover:text-navy"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </FooterColumn>

              <FooterColumn heading={t.other}>
                <InfoRow icon={<MailIcon />} href={site.emailHref} label={site.email} forceLtr />
                <InfoRow icon={<PhoneIcon />} href={site.phoneHref} label={site.phoneDisplay} forceLtr />
                <InfoRow icon={<LocationIcon />} label={t.office} />
              </FooterColumn>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="bg-[#e5e5e5] p-[5px]">
            <div className="flex items-center justify-center bg-[#f0f0f0] px-[22px] py-[20px] text-center shadow-[0px_8px_7px_rgba(0,0,0,0.05)]">
              <p className="text-[16px] font-medium tracking-[-0.32px] text-[#5f5f5f]">
                {year} {site.legalName} {t.rights}
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <h3 className="text-[18px] font-medium leading-[28.8px] tracking-[-0.36px] text-navy">
        {heading}
      </h3>
      <ul className="flex flex-col gap-[13px]">{children}</ul>
    </div>
  );
}

function InfoRow({
  icon,
  href,
  label,
  forceLtr,
}: {
  icon: React.ReactNode;
  href?: string;
  label: string;
  /** Phone/email-style values whose character order must never reverse,
   *  regardless of the surrounding text direction. */
  forceLtr?: boolean;
}) {
  const body = (
    <span className="flex items-center gap-[6px]">
      <span className="flex size-[28px] shrink-0 items-center justify-center rounded-hairline border border-black/[0.02] bg-[#e5e5e5] text-navy">
        {icon}
      </span>
      <span
        dir={forceLtr ? "ltr" : undefined}
        className={cn(
          "min-w-0 text-[16px] font-medium leading-[24.8px] tracking-[-0.32px] text-[#5f5f5f] [overflow-wrap:anywhere]",
          forceLtr && "text-start",
        )}
      >
        {label}
      </span>
    </span>
  );

  return (
    <li>
      {href ? (
        <a href={href} className="group inline-block transition-opacity duration-150 hover:opacity-80">
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}

/* ── Contact icons (node 129:1272, 12×12, navy) ───────────────────────── */

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 8.9844L0 3.6894V10.5H12V3.6894L6 8.9844ZM6.0006 7.3872L0 2.0886V1.5H12V2.0886L6.0006 7.3872Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.692 8.87602C10.8088 8.99326 10.8964 9.13636 10.9476 9.29373C10.9989 9.45111 11.0123 9.61833 10.9869 9.78187C10.9615 9.94541 10.8979 10.1007 10.8013 10.2351C10.7047 10.3695 10.5779 10.4792 10.431 10.5555C9.59154 11.0042 8.61346 11.1188 7.69298 10.8765C5.25 10.2615 1.73845 6.75 1.12345 4.30697C0.881144 3.3865 0.995827 2.40845 1.4445 1.569C1.52074 1.42209 1.63052 1.29521 1.76492 1.19862C1.89933 1.10203 2.0546 1.03845 2.21815 1.01304C2.3817 0.987622 2.54894 1.00108 2.70632 1.05233C2.8637 1.10357 3.0068 1.19116 3.12403 1.308L4.16653 2.35003C4.31686 2.49886 4.41859 2.68974 4.4583 2.89753C4.49801 3.10531 4.47385 3.32025 4.389 3.51403C4.29614 3.73143 4.1643 3.93001 3.99998 4.09997C2.80795 5.292 6.70852 9.19252 7.89998 8.00002C8.06999 7.83511 8.26877 7.70275 8.48648 7.6095C8.68024 7.52449 8.89522 7.50025 9.10304 7.53998C9.31086 7.5797 9.50175 7.68153 9.65048 7.83202L10.692 8.87602Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function LocationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 0C3.51487 0 1.5 2.01487 1.5 4.5C1.5 5.47855 1.82082 6.3765 2.35407 7.11187C2.36363 7.1295 2.36512 7.14919 2.376 7.16607L5.376 11.6661C5.47944 11.8211 5.63686 11.932 5.81762 11.9773C5.99837 12.0226 6.18952 11.999 6.35383 11.9111C6.46268 11.8529 6.55548 11.7687 6.624 11.6661L9.624 7.16607C9.63505 7.14919 9.63637 7.1295 9.64593 7.11187C10.1792 6.3765 10.5 5.47855 10.5 4.5C10.5 2.01487 8.48512 0 6 0ZM6 6C5.60218 5.99999 5.22065 5.84195 4.93935 5.56065C4.65805 5.27935 4.50001 4.89782 4.5 4.5C4.50001 4.10218 4.65805 3.72066 4.93935 3.43935C5.22065 3.15805 5.60218 3.00001 6 3C6.39782 3.00001 6.77935 3.15805 7.06065 3.43935C7.34195 3.72066 7.49999 4.10218 7.5 4.5C7.49999 4.89782 7.34195 5.27935 7.06065 5.56065C6.77935 5.84195 6.39782 5.99999 6 6Z"
        fill="currentColor"
      />
    </svg>
  );
}
