"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Container } from "./Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Site header — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node
 * 138:3559 "nav bar"). Bar is 95px tall, white/blurred, full-width, with
 * content capped at the shared 1240px `max-w-content` token.
 *
 * The wordmark is NOT shrunk to fit — the source file is a large square
 * lockup and only a 242x242 crop of it is shown, positioned via the exact
 * offsets from the Figma frame, clipped by the bar's own overflow-hidden.
 * `start-`/`end-` (logical) are used instead of `left-`/`right-` wherever a
 * position isn't symmetric, so /ar genuinely mirrors (logo + CTA swap
 * sides) instead of just flipping text inside an LTR skeleton.
 */
export function Nav({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const base = `/${lang}`;

  const links = [
    { href: base, label: dict.nav.home },
    { href: `${base}/about`, label: dict.nav.about },
    // Services temporarily hidden until the page is ready — the /services route
    // and its content still exist; only the nav link is removed for now.
    { href: `${base}/collection`, label: dict.nav.collection },
    { href: `${base}/blog`, label: dict.nav.blog },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="relative h-[95px] w-full border-b border-navy/5 bg-white/90 backdrop-blur-[20px]">
        <Container className="relative flex h-full items-center">
          {/* Logo — whitespace-trimmed wordmark (logo-wordmark.png, generated
              from the 4096² source via sharp .trim()). Sized by height and laid
              out as a normal flex child so the Container's items-center centres
              it vertically in the 95px bar — no absolute-position crop offsets. */}
          <Link
            href={base}
            aria-label={dict.meta.siteName}
            className="relative z-10 inline-flex items-center"
          >
            <Image
              src="/brand/logo-wordmark.png"
              alt={dict.meta.siteName}
              width={2952}
              height={1080}
              sizes="164px"
              className="h-[60px] w-auto"
              priority
            />
          </Link>

          {/* Desktop nav — centered on the 1240px bar, offset -41px from dead
              center to match node 138:3585 (Figma balances it against the
              logo + right cluster rather than true 50%). `start-[calc(...)]`
              is a logical inset, so it mirrors automatically under dir="rtl". */}
          <nav
            aria-label="Primary"
            className="absolute start-[calc(50%-41px)] top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-10 lg:flex"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-base leading-[24.8px] font-medium tracking-[-0.32px] text-navy transition-colors duration-200 hover:text-warm-taupe"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right cluster — language switcher (low-weight utility) then a
              hairline divider, then the Contact CTA, so Contact reads as the
              single primary nav action rather than one of two boxed controls. */}
          <div className="ms-auto hidden items-center gap-4 lg:flex">
            <LanguageSwitcher current={lang} label={dict.languageSwitcher.label} />
            <span aria-hidden className="h-5 w-px bg-navy/15" />
            <Button href={`${base}/contact`} variant="primary">
              {dict.cta.contact}
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="ms-auto inline-flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-label={open ? dict.nav.close : dict.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? dict.nav.close : dict.nav.menu}</span>
            <div className="flex flex-col gap-1.5">
              <span className={cn("block h-px w-6 bg-navy transition-transform", open && "translate-y-[7px] rotate-45")} />
              <span className={cn("block h-px w-6 bg-navy transition-opacity", open && "opacity-0")} />
              <span className={cn("block h-px w-6 bg-navy transition-transform", open && "-translate-y-[7px] -rotate-45")} />
            </div>
          </button>
        </Container>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-stone-grey/30 bg-white lg:hidden">
          <Container className="py-6">
            <nav aria-label="Primary mobile" className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-[44px] items-center text-base font-medium tracking-[-0.32px] text-navy transition-opacity duration-150 hover:opacity-70"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex items-center justify-between">
              <LanguageSwitcher current={lang} label={dict.languageSwitcher.label} />
              <Button href={`${base}/contact`} variant="primary" onClick={() => setOpen(false)}>
                {dict.cta.contact}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
