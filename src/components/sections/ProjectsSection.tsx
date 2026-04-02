import { ArrowUpRight } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import type { Project } from "../../types";

interface ProjectsSectionProps {
  projects: Project[];
}

/**
 * Lists all portfolio projects as interactive hover rows.
 *
 * Each row reveals:
 * - A thumbnail image (slides in from the left on hover).
 * - The project title (shifts right and turns red on hover).
 * - Technology badges and category label.
 * - An arrow icon (fades in on hover).
 *
 * GSAP target: `.project-item` — batch scroll-reveal managed by
 * `useScrollAnimations`.
 */
const ProjectsSection = ({ projects }: ProjectsSectionProps) => (
  <section id="projects" className="relative z-10 py-32 px-8 md:px-12">
    <div className="max-w-7xl w-full mx-auto">
      <SectionHeader number="02" title="SELECTED PROJECTS" />

      <div className="flex flex-col">
        {projects.map((project, index) => (
          <div
            key={index}
            className="project-item group relative border-b border-gray-800 py-12 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 px-4 transition-colors cursor-pointer"
          >
            {/* Left side — thumbnail + title */}
            <div className="flex items-center gap-6">

              {/* Thumbnail — hidden by default, reveals on hover */}
              <div className="w-0 opacity-0 group-hover:w-32 group-hover:opacity-100 transition-all duration-500 ease-out hidden md:block overflow-hidden h-20">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-32 h-20 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-gray-600">{project.year}</span>
                <h3 className="font-display text-4xl md:text-6xl tracking-tighter group-hover:translate-x-4 group-hover:text-[#E8175D] transition-all duration-500">
                  {project.title}
                </h3>
              </div>
            </div>

            {/* Right side — tech badges + category */}
            <div className="flex flex-col md:items-end gap-4 mt-6 md:mt-0">
              <div className="flex gap-2 flex-wrap">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className="font-mono text-[9px] border border-gray-700 px-2 py-1 text-gray-500 group-hover:border-[#E8175D]/30 group-hover:text-gray-300 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">
                {project.category}
              </span>
            </div>

            {/* Arrow icon — visible only on hover */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={32} className="text-[#E8175D]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
