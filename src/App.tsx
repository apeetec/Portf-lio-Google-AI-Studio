/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Data ──────────────────────────────────────────────────────────────────────
import { NAV_ITEMS, PROJECTS, EXPERIENCES, SKILLS } from "./data/portfolio";

// ── Hooks ─────────────────────────────────────────────────────────────────────
import { useScrollAnimations } from "./hooks/useScrollAnimations";

// ── UI Components ─────────────────────────────────────────────────────────────
import CustomCursor from "./components/ui/CustomCursor";
import SocialBar    from "./components/ui/SocialBar";
import Navbar       from "./components/ui/Navbar";

// ── Section Components ────────────────────────────────────────────────────────
import HeroSection          from "./components/sections/HeroSection";
import ProjectsSection      from "./components/sections/ProjectsSection";
import ExperienceSection    from "./components/sections/ExperienceSection";
import TechnologiesSection  from "./components/sections/TechnologiesSection";
import ContactSection       from "./components/sections/ContactSection";
import Footer               from "./components/sections/Footer";

// Register GSAP plugins once at module level
gsap.registerPlugin(ScrollTrigger);

/**
 * Root application component.
 *
 * Responsibilities:
 * - Holds the DOM refs required by GSAP (scope container + section refs).
 * - Tracks the active nav section via scroll-spy state.
 * - Delegates all animation setup to `useScrollAnimations`.
 * - Composes the full-page layout from isolated section components.
 */
export default function App() {
  // ── Refs passed to GSAP animations ──────────────────────────────────────
  const container      = useRef<HTMLDivElement>(null);
  const experienceRef  = useRef<HTMLDivElement>(null);
  const techSectionRef = useRef<HTMLDivElement>(null);
  const techContainerRef = useRef<HTMLDivElement>(null);

  // ── Scroll-spy state — updated by useScrollAnimations ───────────────────
  const [activeSection, setActiveSection] = useState("home");

  // ── All GSAP / Lenis animation logic ────────────────────────────────────
  useScrollAnimations({
    container,
    experienceRef,
    techSectionRef,
    techContainerRef,
    setActiveSection,
  });

  return (
    <div
      ref={container}
      className="relative min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#E8175D] selection:text-white"
    >
      {/* Global UI overlays */}
      <CustomCursor />
      <SocialBar />
      <div className="wavy-overlay fixed inset-0 z-0 pointer-events-none" />

      {/* Top navigation */}
      <Navbar items={NAV_ITEMS} activeSection={activeSection} />

      {/* Page sections */}
      <HeroSection />
      <ProjectsSection     projects={PROJECTS} />
      <ExperienceSection   experiences={EXPERIENCES} sectionRef={experienceRef} />
      <TechnologiesSection skills={SKILLS} sectionRef={techSectionRef} containerRef={techContainerRef} />
      <ContactSection />
      <Footer />
    </div>
  );
}

