/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Data ──────────────────────────────────────────────────────────────────────
import { SKILLS } from "./data/portfolio";

// ── Hooks ─────────────────────────────────────────────────────────────────────
import { useScrollAnimations } from "./hooks/useScrollAnimations";
import { usePortfolioData }    from "./hooks/usePortfolioData";

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

  // ── Scroll-spy state — updated by useScrollAnimations ───────────────────
  const [activeSection, setActiveSection] = useState("home");
  const [lang, setLang] = useState<"pt" | "en">("pt");

  const t = {
    pt: {
      nav: {
        home: "INÍCIO",
        projects: "PROJETOS",
        experience: "EXPERIÊNCIA",
        education: "FORMAÇÃO",
        technologies: "TECNOLOGIAS",
        contact: "CONTATO",
      },
      hero: {
        title1: "Desenvolvedor Web",
        title2: "FullStack",
        subtitle: "Gabriel / Desenvolvedor Web FullStack",
        tagline: "// SOLUÇÕES WEB ESCALÁVEIS.",
        explore: "Explore meu trabalho",
        description:
          "Desenvolvedor Web Fullstack com mais de 4 anos de experiência em desenvolvimento de aplicações escaláveis, APIs RESTful e integrações com sistemas ERP. Expertise em PHP, Laravel, JavaScript, React.js e Vue.js, com sólida atuação em ambientes ágeis (Scrum/Kanban). Histórico comprovado de melhoria de performance — redução de 60% no tempo de carregamento de páginas e 40% no tempo de emissão de documentos fiscais via automação. Experiência com Docker, CI/CD, Redis e desenvolvimento de soluções de Business Intelligence.",
      },
      sections: {
        projects: "PROJETOS SELECIONADOS",
        experience: "CARREIRA & EXPERIÊNCIA",
        education: "FORMAÇÃO ACADÊMICA",
        technologies: "TECNOLOGIAS",
        contact: "ENTRE EM CONTATO",
      },
      contact: {
        title: "Vamos construir algo <span class='text-[#E8175D]'>extraordinário</span> juntos.",
        status: "Disponível para freelance & colaborações",
        form: {
          name: "Nome",
          email: "E-mail",
          message: "Mensagem",
          send: "Enviar",
          sending: "Enviando...",
          thanks: "OBRIGADO",
          success: "Sua mensagem foi recebida. Entrarei em contato em breve.",
          error: "Erro ao enviar. Verifique sua conexão e tente novamente.",
        },
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
      nav: {
        home: "HOME",
        projects: "PROJECTS",
        experience: "EXPERIENCE",
        education: "EDUCATION",
        technologies: "TECHNOLOGIES",
        contact: "CONTACT",
      },
      hero: {
        title1: "Web Developer",
        title2: "FullStack",
        subtitle: "Gabriel / Web Developer FullStack",
        tagline: "// SCALABLE WEB SOLUTIONS.",
        explore: "Explore my work",
        description:
          "Fullstack Web Developer with over 4 years of experience in developing scalable applications, RESTful APIs, and ERP system integrations. Expertise in PHP, Laravel, JavaScript, React.js, and Vue.js, with solid performance in agile environments (Scrum/Kanban). Proven track record of performance improvement — 60% reduction in page load time and 40% in tax document issuance via automation. Experience with Docker, CI/CD, Redis, and Business Intelligence solutions development.",
      },
      sections: {
        projects: "SELECTED PROJECTS",
        experience: "CAREER & EXPERIENCE",
        education: "ACADEMIC BACKGROUND",
        technologies: "TECHNOLOGIES",
        contact: "GET IN TOUCH",
      },
      contact: {
        title: "Let's build something <span class='text-[#E8175D]'>extraordinary</span> together.",
        status: "Available for freelance & collaborations",
        form: {
          name: "Name",
          email: "Email",
          message: "Message",
          send: "Send",
          sending: "Sending...",
          thanks: "THANK YOU",
          success: "Your message has been received. I'll get back to you soon.",
          error: "Failed to send. Check your connection and try again.",
        },
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
  };

  // ── Dynamic nav items with translated labels ─────────────────────────────
  const navItems = [
    { id: "01", label: t[lang].nav.home,         href: "#home"       },
    { id: "02", label: t[lang].nav.projects,     href: "#projects"   },
    { id: "03", label: t[lang].nav.experience,   href: "#experience" },
    { id: "04", label: t[lang].nav.education,    href: "#education"  },
    { id: "05", label: t[lang].nav.technologies, href: "#skills"     },
    { id: "06", label: t[lang].nav.contact,      href: "#contact"    },
  ];

  // ── API data from WordPress REST routes ──────────────────────────────────
  const { sobreMim, apiProjects, apiExperiences, apiFormacoes, apiTechStack } = usePortfolioData();

  // Map API experiences → internal Experience type; fall back to static when empty
  const experiences = apiExperiences.length > 0
    ? apiExperiences.map((e) => ({
        role: e.cargo,
        company: e.empresa,
        year: e.ano,
        description: e.descricao_cargo,
      }))
    : (lang === "pt" ? [
    {
      role: "WEB DEVELOPER FULLSTACK",
      company: "HOSPITAL MATERNIDADE DE CAMPINAS",
      year: "DEZ 2025 – PRESENTE",
      description: "Desenvolvi painéis de BI com WeKnow para análise de dados hospitalares (+5 departamentos). Otimizei queries SQL no banco MV. Criei aplicações React.js para processos administrativos e integrações via APIs RESTful. Refatorei sistemas legados e gerenciei versionamento com GitLab.",
    },
    {
      role: "WEB DEVELOPER FULLSTACK",
      company: "AGROSS INSUMOS AGRÍCOLAS",
      year: "JUL 2025 – DEZ 2025",
      description: "Desenvolvimento Vue.js 3 em ciclos ágeis. Implementei sistema de recompensas, APIs REST para sistemas internos e administrei containers Docker. Integrei APIs de IA para automação de processos.",
    },
    {
      role: "WEB DEVELOPER FULLSTACK",
      company: "VITABE",
      year: "FEV 2025 – ABR 2025",
      description: "Automatizei processos com PHP/Laravel (redução de 40% no tempo de NF). Integrei Uappi e Vindi via APIs. Desenvolvi interfaces Vue.js e iniciei integração com Shopify API.",
    },
    {
      role: "WEB DEVELOPER FULLSTACK",
      company: "C4 PUBLICIDADE",
      year: "2021 – 2024",
      description: "Desenvolvi +20 sites com PHP/JS. Otimizei performance front-end (redução de 60% no carregamento). Automatizei tarefas com PHP/jQuery e colaborei em UX/Acessibilidade.",
    },
    {
      role: "SUPORTE TÉCNICO E DESENV. WEB",
      company: "LUMINOSOS CAMPINAS",
      year: "2019 – 2021",
      description: "Manutenção de ERP em Visual Basic/SQL. Desenvolvi novo site institucional e realizei suporte de infraestrutura.",
    },
  ] : [
    {
      role: "FULLSTACK WEB DEVELOPER",
      company: "HOSPITAL MATERNIDADE DE CAMPINAS",
      year: "DEC 2025 – PRESENT",
      description: "Developed BI dashboards with WeKnow for hospital data analysis (+5 departments). Optimized SQL queries in MV database. Created React.js apps for administrative processes and RESTful API integrations. Refactored legacy systems and managed versioning with GitLab.",
    },
    {
      role: "FULLSTACK WEB DEVELOPER",
      company: "AGROSS INSUMOS AGRÍCOLAS",
      year: "JUL 2025 – DEC 2025",
      description: "Vue.js 3 development in agile cycles. Implemented rewards system, REST APIs for internal systems, and managed Docker containers. Integrated AI APIs for process automation.",
    },
    {
      role: "FULLSTACK WEB DEVELOPER",
      company: "VITABE",
      year: "FEB 2025 – APR 2025",
      description: "Automated processes with PHP/Laravel (40% reduction in invoice time). Integrated Uappi and Vindi via APIs. Developed Vue.js interfaces and started Shopify API integration.",
    },
    {
      role: "FULLSTACK WEB DEVELOPER",
      company: "C4 PUBLICIDADE",
      year: "2021 – 2024",
      description: "Developed +20 sites with PHP/JS. Optimized front-end performance (60% reduction in load time). Automated tasks with PHP/jQuery and collaborated on UX/Accessibility.",
    },
    {
      role: "TECH SUPPORT & WEB DEV",
      company: "LUMINOSOS CAMPINAS",
      year: "2019 – 2021",
      description: "ERP maintenance in Visual Basic/SQL. Developed new institutional website and provided infrastructure support.",
    },
  ]);

  // Tech stack: use API data when available, else static fallback
  const techStack = apiTechStack.length > 0 ? apiTechStack : SKILLS;

  // ── All GSAP / Lenis animation logic ────────────────────────────────────
  useScrollAnimations({
    container,
    experienceRef,
    setActiveSection,
  });

  return (
    <div
      ref={container}
      className="relative min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#E8175D] selection:text-white"
    >
      {/* Global UI overlays */}
      <CustomCursor />
      <SocialBar links={{ github: sobreMim.github_link, linkedin: sobreMim.linkedin_link, twitter: sobreMim.twitter_link, email: sobreMim.email }} />
      <div className="wavy-overlay fixed inset-0 z-0 pointer-events-none" />
      <div className="noise-overlay" />

      {/* Top navigation */}
      <Navbar items={navItems} activeSection={activeSection} lang={lang} setLang={setLang} />

      {/* Page sections */}
      <HeroSection lang={lang} t={t} apiDescription={sobreMim.descricao} />
      <ProjectsSection     projects={apiProjects}    sectionTitle={t[lang].sections.projects} verMaisLabel={lang === "pt" ? "VER MAIS" : "VIEW MORE"} verTodosLabel={lang === "pt" ? "VER TODOS OS PROJETOS" : "VIEW ALL PROJECTS"} />
      <ExperienceSection   experiences={experiences} sectionTitle={t[lang].sections.experience} sectionRef={experienceRef} />
      <EducationSection    lang={lang} t={t} formacoes={apiFormacoes} />
      <TechnologiesSection skills={techStack} sectionTitle={t[lang].sections.technologies} />
      <ContactSection      lang={lang} t={t} apiEmail={sobreMim.email} />
      <Footer />
    </div>
  );
}

