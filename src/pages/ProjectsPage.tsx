import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { usePortfolioData } from "../hooks/usePortfolioData";
import CustomCursor from "../components/ui/CustomCursor";
import type { ApiProject } from "../types";

gsap.registerPlugin(ScrollTrigger);

const BASE_PATH: string = import.meta.env.BASE_URL ?? "/";

// ── Project Card ──────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: ApiProject;
  index: number;
  lang: "pt" | "en";
}

const ProjectCard = ({ project, index, lang }: ProjectCardProps) => (
  <div className="project-card group relative overflow-hidden border border-gray-800 hover:border-[#E8175D]/60 transition-all duration-500 flex flex-col">
    {/* Thumbnail */}
    <div className="relative overflow-hidden bg-gray-900" style={{ aspectRatio: "16/9" }}>
      {project.thumbnail ? (
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-mono text-gray-700 text-[10px] tracking-widest">—</span>
        </div>
      )}

      {/* Red glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[#E8175D]/0 group-hover:bg-[#E8175D]/10 transition-all duration-500" />

      {/* Index badge */}
      <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.25em] text-gray-500">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* External link icon */}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/30 p-1.5 hover:border-[#E8175D] hover:bg-[#E8175D] bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Abrir ${project.title}`}
        >
          <ExternalLink size={11} />
        </a>
      )}
    </div>

    {/* Card body */}
    <div className="p-6 flex flex-col flex-1 gap-4">
      <h3 className="font-display text-2xl md:text-3xl tracking-tighter leading-tight group-hover:text-[#E8175D] transition-colors duration-300">
        {project.title}
      </h3>

      {project.excerpt && (
        <p
          className="font-mono text-[10px] text-gray-500 leading-relaxed line-clamp-3 flex-1"
          dangerouslySetInnerHTML={{ __html: project.excerpt }}
        />
      )}

      {/* Action row */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-800">
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[9px] tracking-widest border border-gray-700 px-4 py-2 text-gray-400 hover:border-[#E8175D] hover:text-white transition-colors uppercase flex items-center gap-2"
          >
            {lang === "pt" ? "VER MAIS" : "VIEW MORE"}
            <ArrowUpRight size={10} />
          </a>
        ) : (
          <span className="font-mono text-[9px] tracking-widest text-gray-700 uppercase">
            {lang === "pt" ? "EM BREVE" : "COMING SOON"}
          </span>
        )}

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight size={18} className="text-[#E8175D]" />
        </div>
      </div>
    </div>
  </div>
);

// ── Projects Page ─────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const container = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const { apiProjects, loading } = usePortfolioData();

  // Persist lang preference via localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lang") as "pt" | "en" | null;
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  // ── GSAP entrance animations ───────────────────────────────────────────
  useGSAP(
    () => {
      // Hero title reveal
      gsap.from(".hero-line-1, .hero-line-2", {
        yPercent: 110,
        opacity: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "power4.out",
        delay: 0.1,
      });

      // Metadata fade
      gsap.from(".hero-meta", {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.5,
      });

      // Cards stagger on scroll
      gsap.from(".project-card", {
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 85%",
        },
        y: 80,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
      });

      // Decorative line expand
      gsap.from(".accent-line", {
        scaleX: 0,
        duration: 1.2,
        ease: "power4.inOut",
        delay: 0.6,
        transformOrigin: "left center",
      });
    },
    { scope: container }
  );

  const count = apiProjects.length;

  return (
    <div
      ref={container}
      className="relative min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#E8175D] selection:text-white"
    >
      {/* Global overlays — same as main page */}
      <CustomCursor />
      <div className="noise-overlay" />
      <div className="scanlines pointer-events-none" />

      {/* ── Top navigation ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 md:px-12 bg-gradient-to-b from-[#0a0a0a] to-transparent">
        <a
          href={BASE_PATH}
          className="group flex items-center gap-3 font-mono text-[10px] tracking-widest text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft
            size={13}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span className="text-white font-black tracking-tighter font-sans text-base">GABRIELDEV</span>
        </a>

        <div className="flex items-center gap-5">
          {count > 0 && (
            <span className="font-mono text-[10px] tracking-[0.25em] text-gray-600 hidden md:block">
              {String(count).padStart(2, "0")}&nbsp;
              {lang === "pt" ? "PROJETOS" : "PROJECTS"}
            </span>
          )}
          <button
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
            className="px-2 py-1 border border-gray-700 font-mono text-[10px] tracking-widest hover:border-[#E8175D] hover:text-[#E8175D] transition-all rounded uppercase"
          >
            {lang === "pt" ? "EN" : "PT"}
          </button>
        </div>
      </nav>

      {/* ── Hero header ────────────────────────────────────────────────────── */}
      <header className="pt-36 pb-20 px-8 md:px-12 max-w-7xl mx-auto">
        {/* Section rule */}
        <div className="hero-meta flex items-center gap-4 mb-10">
          <span className="font-mono text-[11px] tracking-[0.3em] text-gray-600">02</span>
          <div className="accent-line h-[1px] flex-1 bg-gray-800" />
        </div>

        {/* Large title */}
        <div className="overflow-hidden">
          <h1 className="hero-line-1 font-display text-[15vw] md:text-[11vw] leading-[0.85] tracking-tighter uppercase">
            {lang === "pt" ? "TODOS OS" : "ALL MY"}
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-line-2 font-display text-[15vw] md:text-[11vw] leading-[0.85] tracking-tighter uppercase text-[#E8175D]">
            {lang === "pt" ? "PROJETOS" : "PROJECTS"}
          </h1>
        </div>

        {/* Tagline row */}
        <div className="hero-meta mt-8 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-[#E8175D]" />
            <p className="font-mono text-[10px] tracking-[0.3em] text-gray-500 uppercase">
              {lang === "pt" ? "PORTFÓLIO COMPLETO" : "COMPLETE PORTFOLIO"}
            </p>
          </div>
          {count > 0 && (
            <span className="font-mono text-[10px] tracking-[0.2em] text-gray-700 border border-gray-800 px-3 py-1">
              {String(count).padStart(2, "0")}&nbsp;ITENS
            </span>
          )}
        </div>
      </header>

      {/* ── Projects grid ──────────────────────────────────────────────────── */}
      <main className="px-8 md:px-12 pb-40 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <p className="font-mono text-[11px] tracking-[0.3em] text-gray-600 uppercase animate-pulse">
              {lang === "pt" ? "CARREGANDO..." : "LOADING..."}
            </p>
          </div>
        ) : count === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 border border-dashed border-gray-800 gap-4">
            <p className="font-mono text-[11px] tracking-[0.3em] text-gray-600 uppercase">
              {lang === "pt" ? "EM BREVE" : "COMING SOON"}
            </p>
            <p className="font-mono text-[9px] tracking-[0.2em] text-gray-700">
              {lang === "pt" ? "NOVOS PROJETOS SERÃO ADICIONADOS EM BREVE" : "NEW PROJECTS WILL BE ADDED SOON"}
            </p>
          </div>
        ) : (
          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} lang={lang} />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800 px-8 md:px-12 py-8 max-w-7xl mx-auto flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-widest text-gray-700">
          © {new Date().getFullYear()} GABRIELDEV
        </span>
        <a
          href={BASE_PATH}
          className="font-mono text-[9px] tracking-widest text-gray-500 hover:text-[#E8175D] transition-colors flex items-center gap-2 uppercase"
        >
          <ArrowLeft size={10} />
          {lang === "pt" ? "VOLTAR AO INÍCIO" : "BACK TO HOME"}
        </a>
      </footer>
    </div>
  );
}
