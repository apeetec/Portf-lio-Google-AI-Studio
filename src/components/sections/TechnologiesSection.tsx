import { useRef, useEffect } from "react";
import SectionHeader from "../ui/SectionHeader";

interface TechnologiesSectionProps {
  skills: string[];
  sectionTitle: string;
}

/**
 * Technologies section — 3D tunnel scroll effect (iOS-safe).
 *
 * Architecture:
 * - Scroll spacer (`id="skills"`) owns scroll distance + SectionHeader in
 *   normal DOM flow so ScrollTrigger char animation fires like every other
 *   section (number + line + title, right-aligned).
 * - `position:fixed` viewport fades in after header has been seen; isolates
 *   3D compositor layer from any overflow ancestor (no iOS black-screen bug).
 * - RAF loop: cameraZ = progress × totalZ, no GSAP pin / no sticky.
 * - baseZ = -(i+1) × Z_GAP → tunnel opens empty, cards arrive one at a time.
 * - Viewport opacity transitions 0→1 over first 300px scroll and 1→0 over
 *   last 300px → smooth entry/exit, no abrupt pop.
 * - Tilt, dynamic FOV and chromatic-aberration all retained.
 */
const TechnologiesSection = ({ skills, sectionTitle }: TechnologiesSectionProps) => {
  const spacerRef   = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef    = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const rafIdRef    = useRef<number>(0);

  const Z_GAP = 1000;

  useEffect(() => {
    const spacer   = spacerRef.current;
    const viewport = viewportRef.current;
    const world    = worldRef.current;
    if (!spacer || !viewport || !world) return;

    // baseZ = -(i+1)*Z_GAP → card i reaches z=0 at progress (i+1)/N
    // (tunnel starts empty; first card arrives after ~1/N of total scroll)
    const totalZ   = skills.length * Z_GAP;
    const loopSize = skills.length * Z_GAP; // infinite-loop wrapping size
    const CAM_SPEED = 2.5;

    // Spiral x/y positions — computed once, identical to reference
    const cardData = skills.map((_, i) => {
      const angle = (i / skills.length) * Math.PI * 6;
      const x     = Math.cos(angle) * (window.innerWidth  * 0.3);
      const y     = Math.sin(angle) * (window.innerHeight * 0.3);
      const rot   = (((i * 137) % 60) - 30); // deterministic, no Math.random
      return { x, y, rot, baseZ: -i * Z_GAP };
    });

    let scrollY  = window.scrollY;
    let velocity = 0;
    let mouseX   = 0;
    let mouseY   = 0;
    let lastTime = performance.now();

    let spacerTop = window.scrollY + spacer.getBoundingClientRect().top;

    const onResize    = () => { spacerTop = window.scrollY + spacer.getBoundingClientRect().top; };
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      mouseX = (t.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (t.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("resize",    onResize,    { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const raf = (time: number) => {
      rafIdRef.current = requestAnimationFrame(raf);

      const delta      = time - lastTime;
      lastTime         = time;

      const newScrollY  = window.scrollY;
      velocity += ((newScrollY - scrollY) - velocity) * 0.15;
      scrollY   = newScrollY;

      // HUD readouts
      const velEl = document.getElementById("vel-readout");
      const fpsEl = document.getElementById("fps");
      if (velEl) velEl.innerText = Math.abs(velocity).toFixed(2);
      if (fpsEl && delta > 0) fpsEl.innerText = String(Math.round(1000 / delta));

      const spacerBottom = spacerTop + spacer.offsetHeight;
      const relScroll    = scrollY - spacerTop;
      const inRange      = scrollY >= spacerTop && scrollY < spacerBottom;

      if (!inRange) {
        viewport.style.opacity    = "0";
        viewport.style.visibility = "hidden";
        return;
      }

      viewport.style.visibility = "visible";

      // Smooth entry (first 300px) and exit (last 300px)
      const fadeIn  = Math.min(1, relScroll / 300);
      const fadeOut = Math.min(1, (spacer.offsetHeight - relScroll) / 300);
      viewport.style.opacity = String(Math.max(0, Math.min(fadeIn, fadeOut)));

      // Camera Z — unbounded, matches reference CAM_SPEED approach
      const cameraZ = relScroll * CAM_SPEED;

      // Camera tilt — mouse/touch + velocity lean
      const tiltX = mouseY * 5 - velocity * 0.3;
      const tiltY = mouseX * 5;
      world.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      // Dynamic FOV warp
      const fov = Math.max(400, 1000 - Math.abs(velocity) * 10);
      viewport.style.perspective = `${fov}px`;

      // Cards — reference: spiral x/y, infinite modulo loop, float/bob
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        const { x, y, rot, baseZ } = cardData[i];

        // Infinite loop wrapping (exact reference formula)
        let vizZ = ((baseZ + cameraZ) % loopSize + loopSize) % loopSize;
        if (vizZ > 500) vizZ -= loopSize;

        // Reference opacity curve
        let alpha = 1;
        if      (vizZ < -3000) alpha = 0;
        else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000;
        if      (vizZ >   100) alpha = Math.max(0, 1 - (vizZ - 100) / 400);

        card.style.opacity = String(Math.max(0, alpha));

        if (alpha > 0) {
          // Float / bob per card
          const float = Math.sin(time * 0.001 + x * 0.01) * 8;
          // Chromatic aberration on fast scroll
          const shift = velocity * 1.5;
          card.style.filter =
            Math.abs(velocity) > 2
              ? `drop-shadow(${shift}px 0 0 rgba(255,0,60,.5)) drop-shadow(${-shift}px 0 0 rgba(0,243,255,.5))`
              : "none";
          // Spiral x/y offset from viewport center + Z depth
          card.style.transform = `translate3d(${x}px, ${y}px, ${vizZ}px) rotateZ(${rot}deg) rotateY(${float}deg)`;
          if (card.style.display !== "flex") card.style.display = "flex";
          card.style.pointerEvents = vizZ > -100 && vizZ < 100 ? "auto" : "none";
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
      {/* ── Scroll spacer ────────────────────────────────────────────────────
          Owns scroll distance AND the section header in normal DOM flow.
          SectionHeader renders identical to other sections: number + line + title.
          ScrollTrigger char animation fires as this area scrolls into view. */}
      <div
        id="skills"
        ref={spacerRef}
        style={{ height: `${skills.length * 100}vh` }}
        className="relative bg-[#030303] px-8 md:px-12 pt-24"
      >
        <SectionHeader number="05" title={sectionTitle} />
      </div>

      {/* ── Fixed 3D viewport ────────────────────────────────────────────────
          position:fixed = own compositor layer, never inside overflow ancestor
          → no WebKit iOS black-screen bug.
          opacity:0 initially; RAF fades it in 0→1 after header is seen.      */}
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
          opacity:         0,
          backgroundColor: "#030303",
        }}
      >
        {/* CRT post-processing overlays */}
        <div className="scanlines z-30" />
        <div className="vignette  z-30" />

        {/* Ghost background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <h2 className="tech-bg-text font-display text-[20vw] text-white/[0.02] leading-none select-none whitespace-nowrap uppercase">
            Deep Stack
          </h2>
        </div>

        {/* 3D world — RAF sets rotateX/Y for camera tilt */}
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
                marginLeft:      "-190px",   // center: half of 380px
                marginTop:       "-225px",   // center: half of 450px
                opacity:         0,
                display:         "none",
                transformOrigin: "center center",
              }}
              className="tech-card flex-col justify-between bg-[#0a0a0a]/40 backdrop-blur-md border border-white/10 p-8 md:p-10 group hover:border-[#E8175D]"
            >
              <div className="absolute -top-px    -left-px  w-4 h-4 border-t border-l border-white/30 group-hover:border-[#E8175D] transition-colors" />
              <div className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-white/30 group-hover:border-[#E8175D] transition-colors" />

              <div className="card-header border-b border-white/10 pb-4 flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#E8175D] tracking-widest">
                  ID-{1000 + ((index * 1337 + 42) % 9000)}
                </span>
                <div className="w-2 h-2 bg-[#E8175D] shadow-[0_0_10px_#E8175D]" />
              </div>

              <div className="flex-1 flex items-center justify-center">
                <h3 className="font-display text-5xl md:text-6xl tracking-tighter uppercase leading-none text-center group-hover:text-[#E8175D] transition-colors mix-blend-hard-light">
                  {skill}
                </h3>
              </div>

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
