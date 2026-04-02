import { useRef, useEffect } from "react";
import SectionHeader from "../ui/SectionHeader";

interface TechnologiesSectionProps {
  skills: string[];
  sectionTitle: string;
}

/**
 * Technologies section — 3D tunnel scroll effect.
 *
 * Architecture (iOS-safe):
 * - Scroll spacer (`id="skills"`) provides scroll distance and anchors
 *   the scroll-spy. Height = skills.length × 100vh.
 * - `position: fixed` viewport — isolated compositor layer, no sticky,
 *   no overflow-hidden ancestor → no WebKit iOS black-screen bug.
 * - RAF loop reads window.scrollY each frame; maps progress linearly to
 *   cameraZ — mirrors the original GSAP scrub behaviour without pin/sticky.
 * - Each card flies through the centre Z-axis one at a time (no x/y spiral),
 *   matching the original visual exactly.
 *
 * Extras vs original GSAP version:
 * - Camera tilt: world rotates slightly with mouse/touch position + velocity
 * - Dynamic FOV: perspective narrows on fast scroll for speed-warp illusion
 * - Chromatic aberration: card drop-shadow shifts on fast scroll
 */
const TechnologiesSection = ({ skills, sectionTitle }: TechnologiesSectionProps) => {
  const spacerRef   = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef    = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const rafIdRef    = useRef<number>(0);

  // Match the original GSAP z-gap exactly
  const Z_GAP = 1000;

  useEffect(() => {
    const spacer   = spacerRef.current;
    const viewport = viewportRef.current;
    const world    = worldRef.current;
    if (!spacer || !viewport || !world) return;

    const totalZ = skills.length * Z_GAP;

    // ── State ───────────────────────────────────────────────────────────────
    let scrollY  = window.scrollY;
    let velocity = 0;
    let mouseX   = 0;
    let mouseY   = 0;
    let lastTime = performance.now();

    // Cache spacer top — recomputed on resize
    let spacerTop = window.scrollY + spacer.getBoundingClientRect().top;
    const onResize = () => {
      spacerTop = window.scrollY + spacer.getBoundingClientRect().top;
    };
    window.addEventListener("resize",    onResize,    { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      mouseX = (t.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (t.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // ── RAF loop ─────────────────────────────────────────────────────────────
    const raf = (time: number) => {
      rafIdRef.current = requestAnimationFrame(raf);

      const delta   = time - lastTime;
      lastTime       = time;

      // Velocity — per-frame scroll delta, smoothed
      const newScrollY  = window.scrollY;
      const rawVelocity = newScrollY - scrollY;
      velocity  += (rawVelocity - velocity) * 0.15;
      scrollY    = newScrollY;

      // HUD readouts
      const velEl = document.getElementById("vel-readout");
      const fpsEl = document.getElementById("fps");
      if (velEl) velEl.innerText = Math.abs(velocity).toFixed(2);
      if (fpsEl && delta > 0) fpsEl.innerText = String(Math.round(1000 / delta));

      // Show fixed viewport only while spacer is on screen
      const spacerBottom = spacerTop + spacer.offsetHeight;
      const inRange      = scrollY >= spacerTop && scrollY < spacerBottom;
      viewport.style.visibility = inRange ? "visible" : "hidden";
      if (!inRange) return;

      // cameraZ: linear map of scroll progress → same behaviour as original GSAP scrub
      const progress = Math.max(0, Math.min(1, (scrollY - spacerTop) / spacer.offsetHeight));
      const cameraZ  = progress * totalZ;

      // Camera tilt — mouse/touch parallax + velocity lean (new)
      const tiltX = mouseY * 5 - velocity * 0.3;
      const tiltY = mouseX * 5;
      world.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      // Dynamic FOV — narrows perspective on fast scroll for speed-warp (new)
      const fov = Math.max(400, 1000 - Math.abs(velocity) * 10);
      viewport.style.perspective = `${fov}px`;

      // ── Cards — identical Z/opacity/scale curve to original GSAP version ──
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        const itemZ = -i * Z_GAP + cameraZ;

        if (itemZ > -2000 && itemZ < 1000) {
          let opacity = 0;
          let scale   = 0.5;

          if (itemZ <= 0) {
            // Approaching from far — fade + scale up
            const ratio = Math.max(0, 1 - Math.abs(itemZ) / 1500);
            opacity = ratio;
            scale   = 0.5 + ratio * 0.5;
          } else {
            // Past the camera — fade out + scale overshoot
            const ratio = Math.max(0, 1 - itemZ / 800);
            opacity = ratio;
            scale   = 1 + (1 - ratio) * 0.5;
          }

          card.style.opacity = String(opacity);
          // translate3d(-50%,-50%) centres the absolutely-positioned card;
          // scale drives the original approach/recede illusion
          card.style.transform = `translate3d(-50%, -50%, ${itemZ}px) scale(${scale})`;
          if (card.style.display !== "flex") card.style.display = "flex";

          // Chromatic aberration — drop-shadow colour split on fast scroll (new)
          const shift = velocity * 1.5;
          card.style.filter =
            Math.abs(velocity) > 2
              ? `drop-shadow(${shift}px 0 0 rgba(255,0,60,.5)) drop-shadow(${-shift}px 0 0 rgba(0,243,255,.5))`
              : "none";

          // Pointer events only when card is near camera
          card.style.pointerEvents = itemZ > -100 && itemZ < 100 ? "auto" : "none";
        } else {
          if (card.style.display !== "none") card.style.display = "none";
        }
      });
    };

    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener("resize",    onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [skills]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* ── Scroll spacer ───────────────────────────────────────────────────
          Provides scroll distance (one full viewport per card) and anchors
          the scroll-spy. The section background colour fills the page flow. */}
      <div
        id="skills"
        ref={spacerRef}
        style={{ height: `${skills.length * 100}vh` }}
        className="bg-[#030303]"
      />

      {/* ── Fixed 3D viewport ───────────────────────────────────────────────
          position:fixed creates its own compositor layer — no sticky, no
          overflow-hidden stacking context → no WebKit iOS black-screen bug.
          Invisible while spacer is off-screen (toggled by RAF). */}
      <div
        ref={viewportRef}
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          width:           "100%",
          height:          "100%",
          perspective:     "1000px",
          overflow:        "hidden",
          zIndex:          20,
          visibility:      "hidden",
          backgroundColor: "#030303",
        }}
      >
        {/* Section title */}
        <div className="absolute top-20 left-8 md:left-12 z-20 pointer-events-none">
          <SectionHeader number="05" title={sectionTitle} />
        </div>

        {/* CRT post-processing overlays */}
        <div className="scanlines z-30" />
        <div className="vignette  z-30" />

        {/* Ghost background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <h2 className="tech-bg-text font-display text-[20vw] text-white/[0.02] leading-none select-none whitespace-nowrap uppercase">
            Deep Stack
          </h2>
        </div>

        {/* ── 3D world ────────────────────────────────────────────────────────
            Fills the full viewport so transform-origin 50% 50% = screen centre.
            RAF applies rotateX/Y for camera tilt.                            */}
        <div
          ref={worldRef}
          style={{
            position:        "absolute",
            top:             0,
            left:            0,
            width:           "100%",
            height:          "100%",
            transformStyle:  "preserve-3d",
            transformOrigin: "50% 50%",
          }}
        >
          {skills.map((skill, index) => (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el; }}
              style={{
                position:        "absolute",
                top:             "50%",
                left:            "50%",
                // translate3d(-50%,-50%) in RAF handles centering — no margin needed
                width:           "min(380px, 88vw)",
                height:          "450px",
                opacity:         0,
                display:         "none",
                transformOrigin: "center center",
              }}
              className="tech-card flex-col justify-between bg-[#0a0a0a]/40 backdrop-blur-md border border-white/10 p-8 md:p-10 group hover:border-[#E8175D]"
            >
              {/* Corner accent marks */}
              <div className="absolute -top-px    -left-px  w-4 h-4 border-t border-l border-white/30 group-hover:border-[#E8175D] transition-colors" />
              <div className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-white/30 group-hover:border-[#E8175D] transition-colors" />

              {/* Card header — ID badge + status indicator */}
              <div className="card-header border-b border-white/10 pb-4 flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#E8175D] tracking-widest">
                  ID-{1000 + ((index * 1337 + 42) % 9000)}
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
                  <div>GRID: {(index * 3) % 10}x{(index * 7) % 10}</div>
                  <div>DATA_SIZE: {((index * 13.7) % 100).toFixed(1)}MB</div>
                </div>
                <span className="font-mono text-4xl text-white/5 group-hover:text-white/10 transition-colors font-black">
                  0{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* HUD overlay */}
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
      </div>
    </>
  );
};

export default TechnologiesSection;
