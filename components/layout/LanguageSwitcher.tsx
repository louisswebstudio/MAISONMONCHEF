"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeLabels, isLocale, type Locale } from "@/lib/i18n/config";
import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Language switcher — minimal flag + code (+ subtle chevron) with no border
 * or button box, opening a dropdown of the other locales on click. Rebuilds
 * the current path under the target locale so switching keeps the user on the
 * same page. (Simplified from the original Figma "pill" node 138:3573 per
 * client direction — reference elmajdoubimmobilier.com nav language style.)
 *
 * AR uses the Saudi Arabia flag (per client direction).
 */
const flagSrc: Partial<Record<Locale, string>> = {
  en: "/brand/flag-en.jpg",
};

export function LanguageSwitcher({
  current,
  label,
  className,
}: {
  current: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function pathFor(target: Locale): string {
    const segments = pathname.split("/").filter(Boolean); // ["ar","services"]
    if (segments.length > 0 && isLocale(segments[0])) {
      segments[0] = target;
    } else {
      segments.unshift(target);
    }
    return "/" + segments.join("/");
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="-my-3 flex items-center gap-1.5 py-3 text-navy/70 transition-colors duration-150 hover:text-navy"
      >
        <FlagSwatch locale={current} />
        <span className="text-sm font-medium">{localeLabels[current]}</span>
        <ChevronDownIcon className={cn("size-2 text-navy/50 transition-transform duration-150", open && "rotate-180")} />
      </button>

      {open && (
        <DropdownPanel label={label}>
          {locales
            .filter((locale) => locale !== current)
            .map((locale) => (
              <li key={locale}>
                <Link
                  href={pathFor(locale)}
                  hrefLang={locale}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center gap-2.5 px-4 py-3 text-sm font-medium text-charcoal transition-colors duration-150 hover:bg-[#f7f7f7] hover:text-navy"
                >
                  <FlagSwatch locale={locale} />
                  {localeLabels[locale]}
                </Link>
              </li>
            ))}
        </DropdownPanel>
      )}
    </div>
  );
}

function DropdownPanel({ label, children }: { label: string; children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <ul
      role="listbox"
      aria-label={label}
      className={cn(
        "absolute end-0 top-[calc(100%+8px)] z-50 min-w-full origin-top-right overflow-hidden border border-[#e5e5e5] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 ease-out rtl:origin-top-left",
        entered ? "scale-100 opacity-100" : "scale-95 opacity-0",
      )}
    >
      {children}
    </ul>
  );
}

function FlagSwatch({ locale }: { locale: Locale }) {
  const src = flagSrc[locale];
  return (
    <span className="relative h-[13px] w-[18px] shrink-0 overflow-hidden rounded-[1px] bg-navy">
      {src ? <Image src={src} alt="" fill sizes="18px" className="object-cover" /> : <FlagIcon locale={locale} />}
    </span>
  );
}

function FlagIcon({ locale }: { locale: Locale }) {
  if (locale === "fr") {
    return (
      <svg viewBox="0 0 3 2" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
        <rect x="0" y="0" width="1" height="2" fill="#002395" />
        <rect x="1" y="0" width="1" height="2" fill="#ffffff" />
        <rect x="2" y="0" width="1" height="2" fill="#ED2939" />
      </svg>
    );
  }
  if (locale === "ar") {
    // Saudi Arabia flag: green field, white Shahada script line + sword.
    // Simplified marks (calligraphy is not legible at 18×13px).
    return (
      <svg viewBox="0 0 18 12" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
        <rect x="0" y="0" width="18" height="12" fill="#006C35" />
        <g fill="none" stroke="#FFFFFF" strokeWidth="0.7" strokeLinecap="round">
          <path d="M4 4.2 H14" />
          <path d="M5 3.1 h1.5 M7.5 3.1 h1.2 M9.7 3.1 h1.6 M12 3.1 h1" />
        </g>
        <path d="M3.5 8 H13" fill="none" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M13 8 l1.6 -0.9 M13 8 l1.6 0.9" fill="none" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return null;
}
