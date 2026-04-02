import type { MutableRefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

interface UseScrollAnimationsParams {
  /** GSAP scope container — all selectors are scoped to this element. */
  container:        MutableRefObject<HTMLDivElement | null>;
  /** Ref to the Experience section — used for the mouse-tracking light effect. */
  experienceRef:    MutableRefObject<HTMLDivElement | null>;
  /** Callback to update the active nav item (scroll-spy). */
  setActiveSection: (section: string) => void;
}

/**
 * Centralises all GSAP animations, ScrollTrigger instances, and Lenis
 * smooth-scroll configuration for the portfolio.
 *
 * Registered effects:
 * 1. Lenis smooth scroll synced with GSAP ticker.
 * 2. Experience section radial light that follows the mouse (cached rect
 *    to avoid forced reflow on every mousemove).
 * 3. Hero section entrance animations (.hero-text, .hero-line, social icons).
 * 4. Section header scroll-reveal (`.section-header`).
 * 5. Project row batch scroll-reveal (`.project-item`).
 * 6. Experience card batch scroll-reveal (`.experience-card-wrapper`).
 * 7. Scroll-spy: updates `activeSection` as each section enters the viewport.
 *
 * Note: the Technologies 3D tunnel is self-contained in TechnologiesSection.tsx
 * (RAF loop + position:fixed viewport — no GSAP pin, no sticky, iOS-safe).
 *
 * All animations are scoped to `container` via `useGSAP({ scope: container })`
 * and cleaned up automatically on unmount.
 */
export function useScrollAnimations({
  container,
  experienceRef,
  setActiveSection,
}: UseScrollAnimationsParams): void {

  useGSAP(
    () => {
      // ── 1. Lenis Smooth Scroll ─────────────────────────────────────────────
      // Lenis overrides native scroll events. On iOS (all browsers use WebKit),
      // this conflicts with the native momentum scroll and can leave GSAP
      // animations stuck at their FROM state (opacity: 0), producing a black
      // screen. Native iOS scroll is already smooth — Lenis adds nothing there.
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      let lenis: Lenis | undefined;

      if (!isTouchDevice) {
        lenis = new Lenis({
          duration: 1.2,
          easing:   (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        // Keep ScrollTrigger in sync with Lenis scroll position
        lenis.on("scroll", ScrollTrigger.update);

        // Drive Lenis from GSAP's ticker so they share the same clock
        gsap.ticker.add((time) => { lenis!.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
      } else {
        // On touch devices, let ScrollTrigger listen to native scroll directly
        ScrollTrigger.normalizeScroll(false);
      }

      // ── 2. Experience Section — Mouse-Tracking Radial Light ────────────────
      const expLight = document.querySelector(".experience-light") as HTMLElement;
      let updateLight: ((e: MouseEvent) => void) | undefined;

      if (expLight && experienceRef.current) {
        // Cache rect once and refresh on resize/scroll to avoid forced reflow
        // inside every mousemove (which would trigger layout thrashing).
        let cachedRect = experienceRef.current.getBoundingClientRect();

        const refreshRect = () => {
          cachedRect = experienceRef.current!.getBoundingClientRect();
        };
        window.addEventListener("resize", refreshRect, { passive: true });
        window.addEventListener("scroll", refreshRect, { passive: true });

        updateLight = (e: MouseEvent) => {
          const x = e.clientX - cachedRect.left;
          const y = e.clientY - cachedRect.top;
          // Only update when cursor is actually over the section
          if (x >= 0 && x <= cachedRect.width && y >= 0 && y <= cachedRect.height) {
            expLight.style.background =
              `radial-gradient(circle 300px at ${x}px ${y}px, rgba(232, 23, 93, 0.15), transparent 80%)`;
          }
        };
        window.addEventListener("mousemove", updateLight);
      }

      // ── 3. Hero Entrance Animations ────────────────────────────────────────
      gsap.from(".hero-text", {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.2,
      });
      gsap.from(".hero-line", {
        height: 0, duration: 1, ease: "power3.inOut", delay: 0.5,
      });
      gsap.from(".social-icons a", {
        x: -20, opacity: 0, duration: 0.5, stagger: 0.1, delay: 1, ease: "power2.out",
      });

      // ── 4. Section Headers — Scroll Reveal ────────────────────────────────
      gsap.utils.toArray(".section-header").forEach((header: any) => {
        gsap.from(header, {
          scrollTrigger: { trigger: header, start: "top 85%" },
          y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
        });
      });

      // ── 7. Project Rows — Batch Reveal ────────────────────────────────────
      ScrollTrigger.batch(".project-item", {
        start:   "top 90%",
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
          });
        },
        once: true,
      });

      // ── 8. Experience Cards — Batch Reveal ────────────────────────────────
      ScrollTrigger.batch(".experience-card-wrapper", {
        start:   "top 80%",
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out",
          });
        },
        once: true,
      });

      // ── 9. Scroll Spy — Active Section Tracking ───────────────────────────
      const SECTIONS = ["home", "projects", "experience", "education", "skills", "contact"];

      SECTIONS.forEach((section) => {
        ScrollTrigger.create({
          trigger:     `#${section}`,
          start:       "top center",
          end:         "bottom center",
          onEnter:     () => setActiveSection(section),
          onEnterBack: () => setActiveSection(section),
        });
      });

      // ── Cleanup ────────────────────────────────────────────────────────────
      return () => {
        lenis?.destroy();
        if (updateLight) window.removeEventListener("mousemove", updateLight);
      };
    },
    { scope: container }
  );
}
