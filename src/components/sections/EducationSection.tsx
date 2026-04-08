import {
  Files,
  Search,
  GitBranch,
  Play,
  LayoutGrid,
  Settings,
  ChevronRight,
  ChevronDown,
  X,
  FileCode2,
} from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import type { ApiFormacao } from "../../types";

interface EducationTranslations {
  degree1: { title: string; period: string; inst: string; skills: string };
  degree2: { title: string; period: string; inst: string; skills: string };
  degree3: { title: string; period: string; inst: string; desc: string };
}

interface Translations {
  sections: { education: string };
  education: EducationTranslations;
}

interface EducationSectionProps {
  lang: "pt" | "en";
  t: { pt: Translations; en: Translations };
  /** When provided and non-empty, replaces the static degree content. */
  formacoes?: ApiFormacao[];
}

const EducationSection = ({ lang, t, formacoes }: EducationSectionProps) => {
  const useApi = formacoes && formacoes.length > 0;

  // Uniform structure for rendering — either from API or static translations
  const degrees = useApi
    ? formacoes!.map((f) => ({
        title: f.curso,
        period: f.ano,
        inst: f.instituicao,
        body: f.descricao_curso,
        tag: "Description",
      }))
    : [
        { title: t[lang].education.degree1.title, period: t[lang].education.degree1.period, inst: t[lang].education.degree1.inst, body: t[lang].education.degree1.skills, tag: "Skills" },
        { title: t[lang].education.degree2.title, period: t[lang].education.degree2.period, inst: t[lang].education.degree2.inst, body: t[lang].education.degree2.skills, tag: "Skills" },
        { title: t[lang].education.degree3.title, period: t[lang].education.degree3.period, inst: t[lang].education.degree3.inst, body: t[lang].education.degree3.desc,   tag: "Description" },
      ];

  // Count lines for the line-number gutter
  const lineCount = 2 + degrees.length * 9 + 1;

  return (
    <section id="education" className="relative z-10 py-32 px-8 md:px-12">
      <div className="max-w-7xl w-full mx-auto relative z-10">
        <SectionHeader number="04" title={t[lang].sections.education} />

        {/* VSCode-themed editor window */}
        <div className="mt-12 rounded-lg overflow-hidden border border-[#333333] bg-[#1e1e1e] shadow-2xl flex flex-col relative font-sans">

          {/* Title Bar */}
          <div className="h-8 bg-[#323233] flex items-center px-4 justify-between select-none">
            <div className="flex gap-2 w-20">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-[#cccccc] text-xs flex-1 text-center">
              App.tsx — GabrielDev — Visual Studio Code
            </div>
            <div className="w-20" />
          </div>

          <div className="flex flex-1 h-[600px]">
            {/* Activity Bar */}
            <div className="w-12 bg-[#333333] flex flex-col items-center py-4 justify-between">
              <div className="flex flex-col gap-6 text-[#858585]">
                <Files size={24} className="text-white cursor-pointer" />
                <Search size={24} className="cursor-pointer hover:text-white transition-colors" />
                <GitBranch size={24} className="cursor-pointer hover:text-white transition-colors" />
                <Play size={24} className="cursor-pointer hover:text-white transition-colors" />
                <LayoutGrid size={24} className="cursor-pointer hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-6 text-[#858585]">
                <Settings size={24} className="cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>

            {/* Sidebar (Explorer) */}
            <div className="w-60 bg-[#252526] flex-col hidden md:flex border-r border-[#333333]">
              <div className="text-[#cccccc] text-[11px] uppercase tracking-wider px-4 py-3">
                Explorer
              </div>
              <div className="flex flex-col text-[#cccccc] text-sm">
                <div className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-[#2a2d2e]">
                  <ChevronDown size={16} />
                  <span className="font-bold text-xs">PORTFOLIO</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 px-4 py-1 cursor-pointer hover:bg-[#2a2d2e]">
                    <ChevronDown size={16} />
                    <span>src</span>
                  </div>
                  <div className="flex items-center gap-2 px-8 py-1 bg-[#37373d] text-white cursor-pointer">
                    <FileCode2 size={16} className="text-[#519aba]" />
                    <span>App.tsx</span>
                  </div>
                  <div className="flex items-center gap-2 px-8 py-1 cursor-pointer hover:bg-[#2a2d2e]">
                    <FileCode2 size={16} className="text-[#519aba]" />
                    <span>index.css</span>
                  </div>
                  <div className="flex items-center gap-2 px-8 py-1 cursor-pointer hover:bg-[#2a2d2e]">
                    <FileCode2 size={16} className="text-[#cbcb41]" />
                    <span>main.tsx</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
              {/* Tabs */}
              <div className="flex h-9 bg-[#252526] overflow-x-auto">
                <div className="flex items-center gap-2 px-4 bg-[#1e1e1e] border-t border-[#E8175D] text-white cursor-pointer min-w-fit">
                  <FileCode2 size={16} className="text-[#519aba]" />
                  <span className="text-sm">App.tsx</span>
                  <X size={14} className="ml-2 text-[#858585] hover:text-white rounded hover:bg-[#333333]" />
                </div>
                <div className="flex items-center gap-2 px-4 text-[#858585] hover:bg-[#2d2d2d] cursor-pointer min-w-fit">
                  <FileCode2 size={16} className="text-[#519aba]" />
                  <span className="text-sm">index.css</span>
                </div>
              </div>

              {/* Breadcrumbs */}
              <div className="flex items-center gap-1 px-4 h-6 text-[#cccccc] text-xs border-b border-[#333333]">
                <span>src</span>
                <ChevronRight size={14} />
                <FileCode2 size={14} className="text-[#519aba]" />
                <span>App.tsx</span>
                <ChevronRight size={14} />
                <span>AcademicBackground</span>
              </div>

              {/* Code Area */}
              <div className="flex-1 flex overflow-auto p-4 font-mono text-[13px] md:text-sm leading-[1.6]">
                {/* Line Numbers */}
                <div className="flex flex-col text-[#858585] text-right pr-6 select-none">
                  {Array.from({ length: lineCount }).map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>

                {/* Code Content — dynamic from API or static fallback */}
                <div className="flex flex-col text-[#d4d4d4] whitespace-pre">
                  <div><span className="text-[#808080]">&lt;</span><span className="text-[#569cd6]">AcademicBackground</span><span className="text-[#808080]">&gt;</span></div>

                  {degrees.map((deg, idx) => (
                    <div key={idx}>
                      <div className="ml-4"><span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">Degree</span></div>
                      <div className="ml-8"><span className="text-[#9cdcfe]">title</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">"{deg.title}"</span></div>
                      <div className="ml-8"><span className="text-[#9cdcfe]">period</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">"{deg.period}"</span></div>
                      <div className="ml-8"><span className="text-[#9cdcfe]">institution</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">"{deg.inst}"</span><span className="text-[#808080]">&gt;</span></div>
                      <div className="ml-8"><span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">{deg.tag}</span><span className="text-[#808080]">&gt;</span></div>
                      <div className="ml-12 text-[#ce9178] whitespace-normal max-w-xl" dangerouslySetInnerHTML={{ __html: deg.body }} />
                      <div className="ml-8"><span className="text-[#808080]">&lt;/</span><span className="text-[#4ec9b0]">{deg.tag}</span><span className="text-[#808080]">&gt;</span></div>
                      <div className="ml-4"><span className="text-[#808080]">&lt;/</span><span className="text-[#4ec9b0]">Degree</span><span className="text-[#808080]">&gt;</span></div>
                      {idx < degrees.length - 1 && <div />}
                    </div>
                  ))}

                  <div><span className="text-[#808080]">&lt;/</span><span className="text-[#569cd6]">AcademicBackground</span><span className="text-[#808080]">&gt;</span></div>
                </div>
              </div>
            </div>

            {/* Right Panel (Minimap simulation) */}
            <div className="hidden lg:block w-16 bg-[#1e1e1e] border-l border-[#333333] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-32 bg-[#ffffff05] border-l-2 border-[#85858540]" />
              <div className="p-2 opacity-30 flex flex-col gap-[2px]">
                <div className="w-full h-[2px] bg-[#569cd6]" />
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-2" />
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4" />
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4" />
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4" />
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-4" />
                <div className="w-full h-[2px] bg-[#ce9178] ml-6" />
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-4" />
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-2" />
                <div className="h-2" />
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-2" />
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4" />
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4" />
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4" />
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-4" />
                <div className="w-full h-[2px] bg-[#ce9178] ml-6" />
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-4" />
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-2" />
                <div className="w-full h-[2px] bg-[#569cd6]" />
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="h-6 bg-[#007acc] flex items-center justify-between px-3 text-white text-xs select-none">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 rounded">
                <GitBranch size={12} />
                <span>main</span>
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 rounded">
                <X size={12} />
                <span>0</span>
                <span className="ml-1">⚠</span>
                <span>0</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline cursor-pointer hover:bg-white/20 px-1 rounded">Ln 1, Col 1</span>
              <span className="hidden md:inline cursor-pointer hover:bg-white/20 px-1 rounded">Spaces: 2</span>
              <span className="hidden md:inline cursor-pointer hover:bg-white/20 px-1 rounded">UTF-8</span>
              <span className="hidden md:inline cursor-pointer hover:bg-white/20 px-1 rounded">CRLF</span>
              <span className="cursor-pointer hover:bg-white/20 px-1 rounded">TypeScript React</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
