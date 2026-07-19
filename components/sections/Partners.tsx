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
 * Logos are normalised to a consistent 34px height (width auto). The source
 * PNGs are pre-trimmed tight to their marks (no baked-in whitespace), so a
 * wide mark (Emaar) and a stacked one (Sobha) carry equal visual weight at the
 * same height. DAMAC/ORA/NAKHEEL have no logo file yet and render as text sized
 * to match that weight (see lib/developers.ts). The track pauses on hover and
 * is fully static under prefers-reduced-motion.
 */
export function Partners({ dict }: { dict: Dictionary }) {
  const track = [...DEVELOPERS, ...DEVELOPERS];

  return (
    <Container as="section" className="py-section-sm">
      <h2 className="font-display text-[30px] leading-normal font-semibold text-navy">
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
      style={{ height: "34px", width: "auto" }}
    />
  );
}
