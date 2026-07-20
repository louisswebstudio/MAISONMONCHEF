import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { DEVELOPERS, type Developer } from "@/lib/developers";
import { Container } from "@/components/layout/Container";

/**
 * "Developers We Work With" — an infinite, single-line logo ticker. The list
 * is rendered twice back-to-back and the whole track is slid left by exactly
 * one copy's width (`animate-marquee` = translateX(-50%), see globals.css),
 * so copy #2 arrives precisely where copy #1 started and the loop repeats with
 * no visible jump.
 *
 * Seamlessness detail: the inter-logo gap is a *trailing margin per item*
 * (`me-[70px]`), NOT flex `gap`. Flex `gap` omits the space after the last
 * item, which makes the two halves non-periodic and produces a small hitch at
 * the wrap; a trailing margin gives every item — including each copy's last —
 * the same following space, so the doubled track is perfectly periodic.
 *
 * Logos are normalised to equal *optical* weight, not a single raw height: the
 * four original wordmarks share the base 34px, while DAMAC/ORA/NAKHEEL carry a
 * per-logo `opticalHeight` override (see lib/developers.ts) so a heavy wide
 * wordmark and an icon-heavy lockup don't read as over/undersized next to the
 * rest. The source PNGs are pre-trimmed tight to their marks. All 7 developers
 * now have real logo files. The track pauses on hover and is fully static under
 * prefers-reduced-motion.
 */
export function Partners({ dict }: { dict: Dictionary }) {
  const track = [...DEVELOPERS, ...DEVELOPERS];

  return (
    <Container as="section" className="py-section-sm">
      <h2 className="font-display text-[34px] font-semibold leading-[1.1] text-navy sm:text-[46px]">
        {dict.partners.heading}
      </h2>

      <div
        className="group relative mt-10 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        {/* Screen readers get the real, de-duplicated names once; the visual
            track is duplicated + aria-hidden so nothing is announced twice. */}
        <span className="sr-only">{DEVELOPERS.map((d) => d.name).join(", ")}</span>

        <ul
          aria-hidden
          className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        >
          {track.map((dev, i) => (
            <li key={`${dev.name}-${i}`} className="me-[70px] shrink-0">
              <LogoMark dev={dev} />
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

function LogoMark({ dev }: { dev: Developer }) {
  if (!dev.logo) {
    return (
      <span className="block text-[24px] leading-none font-semibold tracking-[0.5px] whitespace-nowrap text-[#5f5f5f] uppercase">
        {dev.name}
      </span>
    );
  }

  return (
    <Image
      src={dev.logo}
      alt={dev.name}
      width={dev.logoWidth}
      height={dev.logoHeight}
      className="w-auto object-contain"
      style={{ height: `${dev.opticalHeight ?? 34}px`, width: "auto" }}
    />
  );
}
