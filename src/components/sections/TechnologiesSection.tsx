import { useRef, useEffect } from "react";
import SectionHeader from "../ui/SectionHeader";

interface TechnologiesSectionProps {
  skills: string[];
  sectionTitle: string;
}

/**
 * Technologies section — 3D tunnel scroll effect.
 *
 * Architecture (matches the reference implementation):
 * - A tall scroll spacer (`id="skills"`, height = skills.length × 100vh) provides
 *   the scroll distance and anchors the scroll-spy.
 * - A `position: fixed` viewport div is shown only while the spacer is in the
 *   scroll range. It holds the 3D world and never participates in overflow stacking,
 *   so WebKit iOS never composites it to a black texture.
 * - A `requestAnimationFrame` loop (no GSAP pin / no sticky) reads `window.scrollY`
 *   each frame and computes `cameraZ = relativeScroll × CAM_SPEED`.
 * - Each card's transform is set via `element.style.transform = translate3d(x,y,z)`
 *   directly — the same technique as the reference jQuery code.
 *
 * Why this avoids the iOS black screen:
 * - No `position: sticky` (GSAP `pin: true`) + `perspective` + `preserve-3d` combo.
 * - No `overflow-hidden` ancestor above a `preserve-3d` subtree.
 * - Cards are always in the DOM; the RAF controls visibility via opacity.
 */
const TechnologiesSection = ({ skills, sectionTitle }: TechnologiesSectionProps) => {
  const spacerRef   = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef    = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const rafIdRef    = useRef<number>(0);

  const Z_GAP    = 800;
  const CAM_SPEED = 2.5;

  useEffect(() => {
    const spacer   = spacerRef.current;
    const viewport = viewportRef.current;
    const world    = worldRef.current;
    if (!spacer || !viewport || !world) return;

    const loopSize = skills.length * Z_GAP;

    // ── Card spiral positions — computed once on mount ──────────────────────
    const cardData = skills.map((_, i) => {
      const angle = (i / skills.length) * Math.PI * 6;
      const x     = Math.cos(angle) * (window.innerWidth  * 0.28);
      const y     = Math.sin(angle) * (window.innerHeight * 0.28);
      const rot   = (((i * 137) % 60) - 30); // deterministic spread, no Math.random
      return { x, y, rot, baseZ: -i * Z_GAP };
    });

    // ── State ───────────────────────────────────────────────────────────────
    let scrollY  = window.scrollY;
    let velocity = 0;
    let mouseX   = 0;
    let mouseY   = 0;
    let lastTime = performance.now();

    // Absolute top of the spacer — recomputed on resize
    let spacerTop = window.scrollY + spacer.getBoundingClientRect().top;
    const onResize = () => {
      spacerTop = window.scrollY + spacer.getBoundingClientRect().top;
    };
    window.addEventListener("resize", onResize, { passive: true });

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

      const delta = time - lastTime;
      lastTime    = time;

      // Velocity — computed from per-frame scroll delta and smoothed
      const newScrollY  = window.scrollY;
      const rawVelocity = newScrollY - scrollY;
      velocity  += (rawVelocity - velocity) * 0.15;
      scrollY    = newScrollY;

      // HUD readouts
      const velEl = document.getElementById("vel-readout");
      const fpsEl = document.getElementById("fps");
      if (velEl) velEl.innerText = Math.abs(velocity).toFixed(2);
      if (fpsEl && delta > 0) fpsEl.innerText = String(Math.round(1000 / delta));

      // Show fixed viewport only while the spacer's scroll range is active
      const spacerBottom = spacerTop + spacer.offsetHeight;
      const inRange      = scrollY >= spacerTop && scrollY < spacerBottom;
      viewport.style.visibility = inRange ? "visible" : "hidden";
      if (!inRange) return;

      // Virtual camera Z-position relative to section start
      const cameraZ = (scrollY - spacerTop) * CAM_SPEED;

      // Camera tilt — mouse parallax + velocity lean
      const tiltX = mouseY * 5 - velocity * 0.3;
      const tiltY = mouseX * 5;
      world.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      // Dynamic FOV warp — narrows perspective on fast scroll (speed illusion)
      const fov = Math.max(400, 1000 - Math.abs(velocity) * 10);
      viewport.style.perspective = `${fov}px`;

      // ── Cards ─────────────────────────────────────────────────────────────
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const { x, y, rot, baseZ } = cardData[i];

        // Infinite loop wrapping (same modulo formula as reference)
        let vizZ = ((baseZ + cameraZ) % loopSize + loopSize) % loopSize;
        if (vizZ > 500) vizZ -= loopSize;

        // Opacity curve — fade in from far, fade out past camera
        let alpha = 1;
        if      (vizZ < -3000) alpha = 0;
        else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000;
        if      (vizZ >   100) alpha = Math.max(0, 1 - (vizZ - 100) / 400);

        card.style.opacity = String(Math.max(0, alpha));

        if (alpha > 0) {
          // Subtle float (bobbing) per card, offset by x position
          const float = Math.sin(time * 0.001 + x * 0.01) * 8;

          // Chromatic aberration simulation via drop-shadow on fast scroll
          const shift = velocity * 1.5;
          card.style.filter =
            Math.abs(velocity) > 2
              ? `drop-shadow(${shift}px 0 0 rgba(255,0,60,.5)) drop-shadow(${-shift}px 0 0 rgba(0,243,255,.5))`
              : "none";

          card.style.transform =
            `translate3d(${x}px, ${y}px, ${vizZ}px) rotateZ(${rot}deg) rotateY(${float}deg)`;
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
          Provides the scroll distance for the tunnel and anchors the scroll-spy.
          Height = one full viewport per skill card. */}
      <div
        id="skills"
        ref={spacerRef}
        style={{ height: `${skills.length * 100}vh` }}
        className="relative bg-[#030303]"
      />

      {/* ── Fixed 3D viewport ───────────────────────────────────────────────
          position:fixed creates its own isolated compositor layer — no sticky,
          no overflow-hidden ancestor, no WebKit iOS black-screen bug.
          Visibility toggled by RAF based on scroll position. */}
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

        {/* ── 3D world ──────────────────────────────────────────────────────
            Fills the viewport so transform-origin 50% 50% is the screen centre.
            RAF applies rotateX/rotateY for the camera tilt effect. */}
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
                width:           "380px",
                height:          "450px",
                marginLeft:      "-190px",
                marginTop:       "-225px",
                opacity:         0,
                transformStyle:  "preserve-3d",
                transformOrigin: "center center",
              }}
              className="tech-card flex flex-col justify-between bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 p-10 group hover:border-[#E8175D]"
            >
              {/* Corner accent marks */}
              <div className="absolute -top-px -left-px  w-4 h-4 border-t border-l border-white/30 group-hover:border-[#E8175D] transition-colors" />
              <div className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-white/30 group-hover:border-[#E8175D] transition-colors" />

              {/* Card header */}
              <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#E8175D] tracking-widest">
                  ID-{1000 + ((index * 1337 + 42) % 9000)}
                </span>
                <div className="w-2 h-2 bg-[#E8175D] shadow-[0_0_10px_#E8175D]" />
              </div>

              {/* Skill name */}
              <div className="flex-1 flex items-center justify-center">
                <h3 className="font-display text-5xl md:text-6xl tracking-tighter uppercase leading-none text-center group-hover:text-[#E8175D] transition-colors mix-blend-hard-light">
                  {skill}
                </h3>
              </div>

              {/* Card footer */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
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
