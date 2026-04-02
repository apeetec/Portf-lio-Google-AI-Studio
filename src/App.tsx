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
import EducationSection     from "./components/sections/EducationSection";

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
  const [lang, setLang] = useState<"pt" | "en">("pt");

  const t = {
    pt: {
      sections: {
        education: "FORMAÇÃO ACADÊMICA",
      },
      education: {
        degree1: {
          title: "Análise e Desenvolvimento de Sistemas",
          period: "2022 – 2024",
          inst: "Universidade Anhembi Morumbi",
          skills: "Desenvolvimento web avançado, segurança da informação, modelagem de software",
        },
        degree2: {
          title: "Informática para Internet (Técnico)",
          period: "2020 – 2021",
          inst: "ETEC Centro Paula Souza",
          skills: "Programação, banco de dados, integração de sistemas, front-end/back-end",
        },
        degree3: {
          title: "Mecatrônica",
          period: "2013 – 2015",
          inst: "Senai Roberto Mange",
          desc: "Formação voltada à implementação, manutenção e desenvolvimento de sistemas e equipamentos automatizados, com foco em normas técnicas, qualidade, segurança do trabalho e sustentabilidade.",
        },
      },
    },
    en: {
      sections: {
        education: "ACADEMIC BACKGROUND",
      },
      education: {
        degree1: {
          title: "Systems Analysis and Development",
          period: "2022 – 2024",
          inst: "Anhembi Morumbi University",
          skills: "Advanced web development, information security, software modeling",
        },
        degree2: {
          title: "Internet Informatics (Technician)",
          period: "2020 – 2021",
          inst: "ETEC Centro Paula Souza",
          skills: "Programming, databases, systems integration, front-end/back-end",
        },
        degree3: {
          title: "Mechatronics",
          period: "2013 – 2015",
          inst: "Senai Roberto Mange",
          desc: "Training focused on the implementation, maintenance, and development of automated systems and equipment, with a focus on technical standards, quality, workplace safety, and sustainability.",
        },
      },
    },
  } as const;

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
      <Navbar items={NAV_ITEMS} activeSection={activeSection} lang={lang} setLang={setLang} />

      {/* Page sections */}
      <HeroSection />
      <ProjectsSection     projects={PROJECTS} />
      <ExperienceSection   experiences={EXPERIENCES} sectionRef={experienceRef} />
      <EducationSection    lang={lang} t={t} />
      <TechnologiesSection skills={SKILLS} sectionRef={techSectionRef} containerRef={techContainerRef} />
      <ContactSection />
      <Footer />
    </div>
  );
}

