import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * Proxy = Next.js 16's renamed Middleware (same signature/behaviour).
 *
 * Responsibility: guarantee every request lands on a locale-prefixed path
 * (/en, /ar, /fr). Requests without a prefix are 307-redirected to the best
 * locale inferred from the Accept-Language header, defaulting to English.
 */

function getPreferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  // Parse "fr-FR,fr;q=0.9,en;q=0.8" into base languages ordered by q-weight.
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const hit = locales.find((locale) => locale === tag);
    if (hit) return hit;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals, API routes, and files with an
  // extension (images, fonts, robots.txt, sitemap.xml, etc.).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
