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
 * Flags are explicitly placeholder art in the source design (node name
 * "Flag placeholder (EN)") — only EN has a real asset from Figma; AR/FR fall
 * back to the navy swatch that sits behind the flag image in Figma too, so
 * the fallback is not a broken/missing-asset state, it's the same layer.
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
        <ul
          role="listbox"
          aria-label={label}
          className="absolute end-0 top-[calc(100%+8px)] z-50 min-w-full overflow-hidden border border-[#d4d1cc] bg-white shadow-[0px_12px_7.5px_rgba(0,0,0,0.05)]"
        >
          {locales
            .filter((locale) => locale !== current)
            .map((locale) => (
              <li key={locale}>
                <Link
                  href={pathFor(locale)}
                  hrefLang={locale}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center gap-2 px-3 py-2 text-sm font-medium text-charcoal transition-colors duration-150 hover:bg-light-stone/40 hover:text-navy"
                >
                  <FlagSwatch locale={locale} />
                  {localeLabels[locale]}
                </Link>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

function FlagSwatch({ locale }: { locale: Locale }) {
  const src = flagSrc[locale];
  return (
    <span className="relative h-[13px] w-[18px] shrink-0 overflow-hidden rounded-[1px] bg-navy">
      {src && <Image src={src} alt="" fill sizes="18px" className="object-cover" />}
    </span>
  );
}
