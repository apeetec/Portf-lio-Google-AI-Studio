import ParticleWave from "../canvas/ParticleWave";
import GlowingOrbs  from "../canvas/GlowingOrbs";

interface HeroT {
  hero: {
    title1: string;
    title2: string;
    subtitle: string;
    tagline: string;
    explore: string;
    description: string;
  };
}

interface HeroSectionProps {
  lang: "pt" | "en";
  t: { pt: HeroT; en: HeroT };
  /** When provided, overrides the static description from translations. */
  apiDescription?: string;
}

const HeroSection = ({ lang, t, apiDescription }: HeroSectionProps) => (
  <section
    id="home"
    className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-12 pt-20"
  >
    <ParticleWave />
    <GlowingOrbs />

    <div className="max-w-7xl w-full mx-auto relative z-10">

      {/* ── Main headline ──────────────────────────────────────────────────── */}
      <div className="relative mb-12">
        <h1 className="hero-text text-[11vw] md:text-[9vw] font-black leading-[0.85] tracking-tighter uppercase">
          {t[lang].hero.title1}
        </h1>

        <div className="flex items-start gap-4 md:gap-8">
          {/* Vertical accent line */}
          <div className="hero-line w-[1px] bg-gray-700 self-stretch mt-4" />
          <h1 className="hero-text text-[11vw] md:text-[9vw] font-black leading-[0.85] tracking-tighter uppercase text-[#E8175D]">
            {t[lang].hero.title2}
          </h1>
        </div>

        {/* Small descriptor — bottom right of headline block */}
        <div className="absolute right-0 bottom-0 text-right">
          <p className="hero-text font-mono text-[10px] tracking-widest text-gray-400">
            {t[lang].hero.subtitle}
          </p>
        </div>
      </div>

      {/* ── Sub-content row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mt-24">

        {/* Left: tagline + CTA */}
        <div className="space-y-12">
          <div className="h-[1px] w-full bg-gray-800" />
          <div className="font-mono text-[11px] tracking-[0.2em] text-gray-400">
            {t[lang].hero.tagline}
          </div>
          <a
            href="#projects"
            className="group flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase hover:text-[#E8175D] transition-colors"
          >
            {t[lang].hero.explore}
            <span className="inline-block transform group-hover:translate-y-1 transition-transform">
              ↓
            </span>
          </a>
        </div>

        {/* Right: bio */}
        <div className="flex flex-col items-end text-right">
          <p className="max-w-md font-mono text-[11px] leading-relaxed text-gray-500 uppercase tracking-tight">
            {apiDescription ?? t[lang].hero.description}
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
