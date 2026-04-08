import { ArrowUpRight } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import type { ApiProject } from "../../types";

const BASE_PATH: string = import.meta.env.BASE_URL ?? "/";

interface ProjectsSectionProps {
  projects: ApiProject[];
  sectionTitle: string;
  verMaisLabel?: string;
  verTodosLabel?: string;
}

/**
 * Lists all portfolio projects as interactive hover rows.
 *
 * Each row reveals:
 * - A thumbnail image (slides in from the left on hover).
 * - The project title (shifts right and turns red on hover).
 * - An excerpt on hover.
 * - A "Ver mais" action button.
 *
 * Shows "Em breve" when the projects array is empty.
 *
 * GSAP target: `.project-item` — batch scroll-reveal managed by
 * `useScrollAnimations`.
 */
const ProjectsSection = ({ projects, sectionTitle, verMaisLabel = "VER MAIS", verTodosLabel = "VER TODOS OS PROJETOS" }: ProjectsSectionProps) => (
  <section id="projects" className="relative z-10 py-32 px-8 md:px-12">
    <div className="max-w-7xl w-full mx-auto">
      <SectionHeader number="02" title={sectionTitle} />

      {projects.length === 0 ? (
        <div className="mt-16 flex items-center justify-center py-24 border border-dashed border-gray-800">
          <p className="font-mono text-[11px] tracking-[0.3em] text-gray-600 uppercase">
            Em breve
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-item group relative border-b border-gray-800 py-12 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 px-4 transition-colors"
            >
              {/* Left side — thumbnail + title + excerpt */}
              <div className="flex items-center gap-6">

                {/* Thumbnail — hidden by default, reveals on hover */}
                {project.thumbnail && (
                  <div className="w-0 opacity-0 group-hover:w-32 group-hover:opacity-100 transition-all duration-500 ease-out hidden md:block overflow-hidden h-20 shrink-0">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-32 h-20 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-4xl md:text-6xl tracking-tighter group-hover:translate-x-4 group-hover:text-[#E8175D] transition-all duration-500">
                    {project.title}
                  </h3>
                  {project.excerpt && (
                    <p
                      className="font-mono text-[10px] text-gray-500 max-w-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: project.excerpt }}
                    />
                  )}
                </div>
              </div>

              {/* Right side — external project link */}
              <div className="flex items-center gap-4 mt-6 md:mt-0 shrink-0">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] tracking-widest border border-gray-700 px-4 py-2 text-gray-400 hover:border-[#E8175D] hover:text-white transition-colors uppercase flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {verMaisLabel}
                    <ArrowUpRight size={12} />
                  </a>
                ) : null}
              </div>

              {/* Arrow icon — visible only on hover */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                <ArrowUpRight size={32} className="text-[#E8175D]" />
              </div>
            </div>
          ))}

          {/* View all projects link */}
          <div className="flex justify-end pt-12">
            <a
              href={`${BASE_PATH}projects`}
              className="group font-mono text-[10px] tracking-widest border border-gray-700 px-6 py-3 text-gray-400 hover:border-[#E8175D] hover:text-white transition-all duration-300 uppercase flex items-center gap-3"
            >
              {verTodosLabel}
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
          </div>
        </div>
      )}
    </div>
  </section>
);

export default ProjectsSection;
