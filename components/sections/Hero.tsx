import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

/**
 * Hero — cloned from Figma (file r2XTjIJ5uaZ0VFCG2kfCdn, node 138:1676
 * "Header - Hero section"). Authored frame is 1440x726.
 *
 * Height: the Figma 726px frame INCLUDES the nav — its "Nav - Desktop
 * transparent" bar (node 138:3559) sits at y=0 as a transparent overlay on
 * the skyline, with content starting at 120px (a 25px gap below the 95px
 * nav). We render the nav instead as a separate solid 95px sticky bar
 * stacked above the hero, so this section reproduces only the part BELOW the
 * nav: 726 − 95 = 631px, with a 25px top pad. Nav (95) + hero (631) = 726,
 * and the tag/heading/CTAs land at the exact Figma offsets. A fixed pixel
 * height (not min-h-screen / vh) keeps the CTAs at a stable, above-the-fold
 * position instead of ballooning on tall or wide viewports.
 *
 * No mobile frame exists in Figma (the file has only desktop-width designs),
 * so mobile is content-driven: min-height + vertical padding rather than a
 * fixed height, so the taller mobile text stack (big heading + stacked CTAs)
 * always fits with breathing room and never clips under overflow-hidden.
 *
 * Two overlay layers reproduce Figma's exact mask + backdrop-blur effect
 * rather than approximating it with a flat scrim:
 *  - "Full mask": a diagonal band (SVG alpha mask) getting a 50px backdrop
 *    blur + faint black gradient, concentrated over the text side of the photo.
 *  - "Bottom mask": a soft blurred vignette hugging the bottom edge.
 * Both mask SVGs are pure linear-gradient shapes exported from Figma —
 * downloaded as-is (public/brand/hero-mask-*.svg) rather than redrawn.
 */
export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const base = `/${lang}`;

  return (
    <section className="relative flex min-h-[600px] w-full flex-col overflow-hidden pt-[32px] pb-[52px] lg:h-[631px] lg:min-h-0 lg:pt-[25px] lg:pb-0">
      {/* Background video — muted/looping ambient footage. Poster is the former
          skyline still, so the first paint (and any device that blocks autoplay
          or prefers reduced motion) shows the same framed image behind the text. */}
      <video
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/brand/hero-skyline.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/brand/videobg.mp4" type="video/mp4" />
      </video>

      {/* Full mask: diagonal blur + tint band over the photo (node 138:1680) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          // Overlay opacity raised (0.2 → 0.55) so the white heading/subtext
          // clear WCAG AA over the bright blurred skyline (UI/UX pass).
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

      {/* Bottom mask: soft vignette at the base of the hero (node 138:1681) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[170px] overflow-hidden">
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

      <Container className="relative flex flex-1 flex-col justify-center">
        <div className="flex w-full max-w-[600px] flex-col items-start gap-[22.9px]">
          {/* Tag — width is content-driven (not the fixed 239px from Figma's EN
              measurement) so AR/FR labels of different lengths don't clip. */}
          <div
            className="flex animate-rise items-center gap-2 bg-white/10 py-[3px] ps-[3px] pe-[14px] backdrop-blur-[6px] motion-reduce:animate-none"
            style={{ animationDelay: "100ms" }}
          >
            <span className="flex shrink-0 items-center justify-center bg-white px-[9px] pt-px pb-[2px] text-[12px] leading-[16.8px] font-medium tracking-[-0.48px] text-navy">
              {dict.hero.tagRanking}
            </span>
            <span className="text-[12px] leading-[16.8px] font-medium tracking-[-0.48px] whitespace-nowrap text-white">
              {dict.hero.tagLabel}
            </span>
          </div>

          <div className="flex w-full flex-col items-start gap-[15.39px]">
            <h1
              className="animate-rise font-display text-[36px] leading-[1.08] font-medium tracking-[-0.01em] text-white motion-reduce:animate-none sm:text-[64px]"
              style={{ animationDelay: "220ms" }}
            >
              {dict.hero.heading}
            </h1>
            <p
              className="max-w-[480px] animate-rise text-[18px] leading-[28.8px] font-medium tracking-[-0.36px] text-white/90 motion-reduce:animate-none"
              style={{ animationDelay: "360ms" }}
            >
              {dict.hero.subtext}
            </p>
          </div>

          <div
            className="flex animate-rise flex-wrap items-center gap-[14px] pt-[9.1px] motion-reduce:animate-none"
            style={{ animationDelay: "500ms" }}
          >
            <Button href={`${base}/collection`} variant="primary">
              {dict.hero.ctaPrimary}
            </Button>
            <Button href={`${base}/about`} variant="on-photo">
              {dict.hero.ctaSecondary}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
