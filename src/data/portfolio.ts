/**
 * Static portfolio data — all content displayed in the portfolio lives here.
 * To update projects, experience or skills, edit only this file.
 */

import type { NavItem, Project, Experience } from "../types";

// ── Navigation ────────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { id: "01", label: "HOME",         href: "#home"       },
  { id: "02", label: "PROJECTS",     href: "#projects"   },
  { id: "03", label: "EXPERIENCE",   href: "#experience" },
  { id: "04", label: "TECHNOLOGIES", href: "#skills"     },
  { id: "05", label: "CONTACT",      href: "#contact"    },
];

// ── Projects ──────────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    title:    "NEURAL NETWORK VISUALIZER",
    category: "AI / FRONTEND",
    year:     "2024",
    tech:     ["REACT", "D3.JS", "PYTHON"],
    image:    "https://picsum.photos/seed/neural/600/400",
  },
  {
    title:    "E-COMMERCE CORE ENGINE",
    category: "BACKEND / DATABASE",
    year:     "2023",
    tech:     ["PHP", "SQL", "REDIS"],
    image:    "https://picsum.photos/seed/ecommerce/600/400",
  },
  {
    title:    "CLOUD INFRA DASHBOARD",
    category: "FULLSTACK",
    year:     "2023",
    tech:     ["C#", "REACT", "AZURE"],
    image:    "https://picsum.photos/seed/cloud/600/400",
  },
];

// ── Work Experience ───────────────────────────────────────────────────────────

export const EXPERIENCES: Experience[] = [
  {
    role:        "SENIOR FRONTEND ENGINEER",
    company:     "TECH CORP",
    year:        "2022 - PRESENT",
    description: "Leading the frontend architecture for high-traffic web applications. Implementing complex UI/UX designs with React and GSAP, improving performance by 40%.",
  },
  {
    role:        "FULLSTACK DEVELOPER",
    company:     "DIGITAL AGENCY",
    year:        "2019 - 2022",
    description: "Developed scalable e-commerce solutions and interactive marketing sites. Managed database architecture and API integrations.",
  },
  {
    role:        "JUNIOR DEVELOPER",
    company:     "STARTUP INC",
    year:        "2018 - 2019",
    description: "Assisted in building internal tools and maintaining legacy systems. Gained strong foundational skills in JavaScript and PHP.",
  },
];

// ── Technology Stack ──────────────────────────────────────────────────────────

export const SKILLS: string[] = [
  "PHP", "HTML", "CSS", "JAVASCRIPT", "SQL", "PYTHON", "C#", "REACT",
];
