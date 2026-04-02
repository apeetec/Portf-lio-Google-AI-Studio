import type { RefObject } from "react";
import SectionHeader from "../ui/SectionHeader";

interface TechnologiesSectionProps {
  skills: string[];
  sectionTitle: string;
  /**
   * Ref to the outer <section> — used by GSAP ScrollTrigger for scroll
   * pinning and the background text parallax in `useScrollAnimations`.
   */
  sectionRef: RefObject<HTMLDivElement | null>;
  /**
   * Ref to the inner preserve-3d container — each `.tech-card` inside
   * this div is positioned on the Z axis and animated by `useScrollAnimations`.
   */
  containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * Technologies section with a 3D tunnel scroll effect.
 *
 * As the user scrolls, each `.tech-card` flies from far on the Z axis
 * toward the camera and then past it — powered entirely by GSAP
 * ScrollTrigger quickSetters in `useScrollAnimations`.
 *
 * Decorative elements:
 * - `.tech-bg-text` — large ghost text with parallax.
 * - `.scanlines` / `.vignette` — CSS-only CRT post-processing overlays.
 * - HUD readouts (`#vel-readout`, `#fps`) — updated by `useScrollAnimations`.
 *
 * Note: `style={{ perspective: "1000px" }}` on the section and
 * `transformStyle: "preserve-3d"` on the container are required for the
 * 3D effect to work.
 */
const TechnologiesSection = ({ skills, sectionTitle, sectionRef, containerRef }: TechnologiesSectionProps) => {
  // perspective + preserve-3d are only needed for the desktop 3D tunnel.
  // On iOS (touch) applying perspective to a section that later gets
  // preserve-3d children can still trigger a WebKit GPU compositing bug
  // that renders the compositor layer as solid black.
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  return (
  <section
    id="skills"
    ref={sectionRef}
    className="relative z-10 bg-[#030303] min-h-screen flex flex-col justify-center"
    style={isTouchDevice ? undefined : { perspective: "1000px" }}
  >
    {/* Section title — positioned absolutely so it stays visible during pin */}
    <div className="absolute top-20 left-8 md:left-12 z-20 w-full max-w-7xl mx-auto">
      <SectionHeader number="05" title={sectionTitle} />
    </div>

    {/* CRT post-processing overlays (CSS-only, defined in index.css) */}
    <div className="scanlines z-30" />
    <div className="vignette z-30" />

    {/* Large ghost text — parallax driven by useScrollAnimations */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <h2 className="tech-bg-text font-display text-[20vw] text-white/[0.02] leading-none select-none whitespace-nowrap uppercase">
        Deep Stack
      </h2>
    </div>

    {/* 3D world container
        - Mobile: flex-col scrollable list (no preserve-3d, no absolute positioning)
        - Desktop: preserve-3d with absolute cards for the GSAP Z-axis tunnel
        overflow-hidden is intentionally ABSENT on both section and container:
        WebKit iOS bug — overflow:hidden on an ancestor flattens preserve-3d children
        into a black composited texture. */}
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center gap-8 py-24 px-4 md:h-screen md:flex-row md:items-center md:justify-center md:py-0 md:px-0 z-10"
      style={isTouchDevice ? undefined : { transformStyle: "preserve-3d" }}
    >
      {skills.map((skill, index) => (
        <div
          key={index}
          className="tech-card flex-shrink-0 flex flex-col justify-between w-full max-w-sm md:w-[380px] md:absolute md:h-[450px] bg-[#0a0a0a]/40 backdrop-blur-md border border-white/10 p-8 md:p-10 group hover:border-[#E8175D]"
          style={{ transformOrigin: "center center" }}
        >
          {/* Corner accent marks */}
          <div className="absolute -top-px    -left-px  w-4 h-4 border-t border-l border-white/30 group-hover:border-[#E8175D] transition-colors" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-white/30 group-hover:border-[#E8175D] transition-colors" />

          {/* Card header — ID badge + status indicator */}
          <div className="card-header border-b border-white/10 pb-4 flex justify-between items-center">
            <span className="font-mono text-[10px] text-[#E8175D] tracking-widest">
              ID-{Math.floor(1000 + Math.random() * 9000)}
            </span>
            <div className="w-2 h-2 bg-[#E8175D] shadow-[0_0_10px_#E8175D]" />
          </div>

          {/* Skill name — centred, large display font */}
          <div className="flex-1 flex items-center justify-center">
            <h3 className="font-display text-5xl md:text-6xl tracking-tighter uppercase leading-none text-center group-hover:text-[#E8175D] transition-colors mix-blend-hard-light">
              {skill}
            </h3>
          </div>

          {/* Card footer — fake metadata + index number */}
          <div className="card-footer pt-4 border-t border-white/10 flex justify-between items-end">
            <div className="font-mono text-[8px] text-gray-500 space-y-1">
              <div>GRID: {Math.floor(Math.random() * 10)}x{Math.floor(Math.random() * 10)}</div>
              <div>DATA_SIZE: {(Math.random() * 100).toFixed(1)}MB</div>
            </div>
            <span className="font-mono text-4xl text-white/5 group-hover:text-white/10 transition-colors font-black">
              0{index + 1}
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* HUD overlay — live readouts updated by useScrollAnimations */}
    <div className="absolute inset-8 pointer-events-none z-20 flex flex-col justify-between font-mono text-[10px] text-white/30 uppercase">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-[#E8175D]">SYS.READY</span>
          <div className="w-24 h-px bg-white/20 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#E8175D]" />
          </div>
        </div>
        <span>LOC: 37.7749° N, 122.4194° W</span>
      </div>

      <div className="flex justify-between items-center">
        <span>
          SCROLL_VELOCITY //{" "}
          <span id="vel-readout" className="text-[#E8175D]">0.00</span>
        </span>
        <div className="flex items-center gap-4">
          <div className="w-24 h-px bg-white/20 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#E8175D]" />
          </div>
          <span>FPS: <span id="fps">60</span></span>
        </div>
      </div>
    </div>
  </section>
  );
};

export default TechnologiesSection;
