import type { RefObject } from "react";
import SectionHeader  from "../ui/SectionHeader";
import ExperienceCard from "../cards/ExperienceCard";
import type { Experience } from "../../types";

interface ExperienceSectionProps {
  experiences: Experience[];
  sectionTitle: string;
  /**
   * Ref to the outer <section> element.
   * Required by `useScrollAnimations` to cache the bounding rect for the
   * mouse-tracking radial light effect without triggering forced reflow.
   */
  sectionRef: RefObject<HTMLDivElement | null>;
}

/**
 * Career experience section with a branching grid layout.
 *
 * Layout:
 * - Left column  → latest experience (item 0).
 * - Right column → two earlier experiences (items 1 & 2) connected by
 *   dashed lines that form a visual branch diagram.
 *
 * Special elements:
 * - `.experience-light` — a radial gradient div whose position is updated
 *   on mousemove via `useScrollAnimations` to create a dynamic lighting effect
 *   over the dot-grid background.
 *
 * GSAP target: `.experience-card-wrapper` — batch scroll-reveal in
 * `useScrollAnimations`.
 */
const ExperienceSection = ({ experiences, sectionTitle, sectionRef }: ExperienceSectionProps) => (
  <section
    id="experience"
    ref={sectionRef}
    className="relative z-10 py-32 px-8 md:px-12 bg-[#050505] overflow-hidden"
  >
    {/* Dot-grid background pattern */}
    <div
      className="absolute inset-0 pointer-events-none opacity-10"
      style={{
        backgroundImage: "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
        backgroundSize:  "40px 40px",
      }}
    />

    {/* Dynamic radial light — position updated by useScrollAnimations on mousemove */}
    <div
      className="experience-light absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
      style={{ background: "radial-gradient(circle 300px at 0px 0px, rgba(232, 23, 93, 0.15), transparent 80%)" }}
    />

    {/* Decorative crosshair corner symbols */}
    <div className="absolute top-20    left-20  text-gray-700 font-mono text-xs">+</div>
    <div className="absolute bottom-20 right-20 text-gray-700 font-mono text-xs">+</div>

    <div className="max-w-7xl w-full mx-auto relative z-10">
      <SectionHeader number="03" title={sectionTitle} />

      {/* 12-column branching grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative mt-16">

        {/* ── Left column — item 0 ───────────────────────────────────────── */}
        <div className="lg:col-span-5 lg:col-start-1 flex items-center relative z-10 experience-card-wrapper">
          <div className="w-full">
            <ExperienceCard exp={experiences[0]} status="DATA STREAM 03 // LIVE" pos="X:450 Y:220" />
          </div>
          {/* Connecting line to the vertical trunk */}
          <div className="hidden lg:block absolute top-1/2 -right-8 lg:-right-16 w-8 lg:w-16 h-[1px] border-t border-dashed border-[#E8175D] opacity-30" />
        </div>

        {/* ── Right column — items 1 & 2 ─────────────────────────────────── */}
        <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-16 relative z-10">

          {/* Vertical trunk line */}
          <div className="hidden lg:block absolute top-[20%] bottom-[20%] -left-8 lg:-left-16 w-[1px] border-l border-dashed border-[#E8175D] opacity-30" />

          <div className="w-full experience-card-wrapper relative">
            {/* Branch to trunk */}
            <div className="hidden lg:block absolute top-1/2 -left-8 lg:-left-16 w-8 lg:w-16 h-[1px] border-t border-dashed border-[#E8175D] opacity-30" />
            <ExperienceCard exp={experiences[1]} status="SYSTEM STATUS: OPTIMAL" pos="X:520 Y:310" />
          </div>

          <div className="w-full experience-card-wrapper lg:ml-12 relative">
            {/* Branch to trunk (longer to account for ml offset) */}
            <div className="hidden lg:block absolute top-1/2 -left-8 lg:-left-[76px] w-8 lg:w-[76px] h-[1px] border-t border-dashed border-[#E8175D] opacity-30" />
            <ExperienceCard exp={experiences[2]} status="DATA STREAM 02 // LIVE" pos="X:1150 Y:580" />
          </div>
        </div>

      </div>
    </div>
  </section>
);

export default ExperienceSection;
