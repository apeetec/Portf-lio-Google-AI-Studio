import { useEffect, useRef } from "react";

/**
 * Renders an animated 3D perspective particle dot-ring pattern on a canvas.
 *
 * Behaviour:
 * - Particles react to mouse position (normalised -1 to 1 on each axis).
 * - Influence fades out as the user scrolls down (scrollFactor).
 * - Uses IntersectionObserver to pause the rAF loop when off-screen.
 * - scrollY is cached via a passive scroll listener to avoid forced reflow
 *   inside the animation frame.
 */
const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let isVisible = true;

    // ── Mouse tracking (values normalised -1 to 1) ──────────────────────────
    let targetMouseX  = 0;
    let targetMouseY  = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth)  * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    // ── Cached scroll position (prevents forced reflow inside rAF) ──────────
    let cachedScrollY = window.scrollY;
    const handleScroll = () => { cachedScrollY = window.scrollY; };

    // ── Canvas resize ────────────────────────────────────────────────────────
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width  = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize",    resize);
    window.addEventListener("scroll",    handleScroll, { passive: true });
    resize();

    // ── Render loop ──────────────────────────────────────────────────────────
    const render = () => {
      if (!isVisible) return;

      time += 0.0015;

      // Smooth lerp on mouse position
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Particle influence decreases as user scrolls (0 at 500px, 1 at top)
      const scrollFactor   = Math.max(0, 1 - cachedScrollY / 500);
      const mouseInfluenceX = currentMouseX * 150 * scrollFactor;
      const mouseInfluenceY = currentMouseY * 150 * scrollFactor;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.65)";

      // Origin at 85% across the canvas for dramatic depth perspective
      const cx = canvas.width  * 0.85 + mouseInfluenceX;
      const cy = canvas.height * 0.5  + mouseInfluenceY;

      const numRings    = 26;
      const ringSpacing = 16;
      const dotSpacing  = 15;

      // Pre-compute tilt values once per frame
      const tilt    = Math.PI / 3.5;
      const cosTilt = Math.cos(tilt);
      const sinTilt = Math.sin(tilt);

      // Batch all rects into a single ctx.fill() call
      ctx.beginPath();

      for (let i = 0; i < numRings; i++) {
        const radius  = i * ringSpacing;
        const numDots = Math.max(8, Math.floor((Math.PI * 2 * radius) / dotSpacing));

        for (let j = 0; j < numDots; j++) {
          const angle = (j / numDots) * Math.PI * 2;

          const z        = Math.sin(angle * 2 + time) * 40 + Math.cos(i * 0.1 - time) * 40;
          const scale    = 800 / (800 + z);
          const yRotated = Math.sin(angle) * radius * cosTilt - z * sinTilt;

          const particleMouseOffsetX = currentMouseX * (radius * 0.3) * scrollFactor;
          const particleMouseOffsetY = currentMouseY * (radius * 0.3) * scrollFactor;

          const px = cx + Math.cos(angle) * radius * scale - particleMouseOffsetX;
          const py = cy + yRotated         * scale          - particleMouseOffsetY;

          // Viewport culling — skip particles outside visible area
          if (px > canvas.width * 0.3 && px < canvas.width && py > 0 && py < canvas.height) {
            ctx.rect(px, py, 2.0 * scale, 2.0 * scale);
          }
        }
      }

      ctx.fill();
      animationFrameId = requestAnimationFrame(render);
    };

    // ── Pause rAF when canvas is scrolled off-screen ─────────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) render();
          else cancelAnimationFrame(animationFrameId);
        });
      },
      { threshold: 0 }
    );

    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll",    handleScroll);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 z-0"
      style={{
        maskImage:          "linear-gradient(to bottom, black 50%, transparent 100%)",
        WebkitMaskImage:    "linear-gradient(to bottom, black 50%, transparent 100%)",
      }}
    />
  );
};

export default ParticleWave;
