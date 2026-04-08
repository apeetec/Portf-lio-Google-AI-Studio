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

const STATUSES = [
  "DATA STREAM 03 // LIVE",
  "SYSTEM STATUS: OPTIMAL",
  "DATA STREAM 02 // LIVE",
  "MODULE ACTIVE // ONLINE",
  "PROCESS RUNNING // OK",
];

const POSITIONS = [
  "X:450 Y:220",
  "X:520 Y:310",
  "X:1150 Y:580",
  "X:780 Y:420",
  "X:320 Y:650",
];

/**
 * Career experience section with a branching grid layout.
 *
 * Left column  → first experience.
 * Right column → all remaining experiences connected by dashed lines.
 * Handles any number of experiences from the API dynamically.
 *
 * GSAP target: `.experience-card-wrapper` — batch scroll-reveal in
 * `useScrollAnimations`.
 */
const ExperienceSection = ({ experiences, sectionTitle, sectionRef }: ExperienceSectionProps) => {
  const [first, ...rest] = experiences;

  return (
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

        {experiences.length === 0 ? (
          <div className="mt-16 flex items-center justify-center py-24 border border-dashed border-gray-800">
            <p className="font-mono text-[11px] tracking-[0.3em] text-gray-600 uppercase">Em breve</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative mt-16">

            {/* ── Left column — first experience ──────────────────────────── */}
            {first && (
              <div className="lg:col-span-5 lg:col-start-1 flex items-center relative z-10 experience-card-wrapper">
                <div className="w-full">
                  <ExperienceCard exp={first} status={STATUSES[0]} pos={POSITIONS[0]} />
                </div>
                <div className="hidden lg:block absolute top-1/2 -right-8 lg:-right-16 w-8 lg:w-16 h-[1px] border-t border-dashed border-[#E8175D] opacity-30" />
              </div>
            )}

            {/* ── Right column — remaining experiences ────────────────────── */}
            {rest.length > 0 && (
              <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-16 relative z-10">
                {/* Vertical trunk line */}
                <div className="hidden lg:block absolute top-[5%] bottom-[5%] -left-8 lg:-left-16 w-[1px] border-l border-dashed border-[#E8175D] opacity-30" />

                {rest.map((exp, i) => (
                  <div
                    key={i}
                    className={`w-full experience-card-wrapper relative${i % 2 !== 0 ? " lg:ml-12" : ""}`}
                  >
                    <div className={`hidden lg:block absolute top-1/2 -left-8 ${i % 2 !== 0 ? "lg:-left-[76px] w-8 lg:w-[76px]" : "lg:-left-16 w-8 lg:w-16"} h-[1px] border-t border-dashed border-[#E8175D] opacity-30`} />
                    <ExperienceCard
                      exp={exp}
                      status={STATUSES[(i + 1) % STATUSES.length]}
                      pos={POSITIONS[(i + 1) % POSITIONS.length]}
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
