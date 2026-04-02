import type { NavItem } from "../../types";

interface NavbarProps {
  items: NavItem[];
  /**
   * ID of the section currently in the viewport.
   * Driven by GSAP ScrollTrigger scroll-spy in `useScrollAnimations`.
   */
  activeSection: string;
  lang?: "pt" | "en";
  setLang?: (lang: "pt" | "en") => void;
}

/**
 * Fixed top navigation bar.
 *
 * Highlights the active item based on `activeSection` prop.
 * Uses a gradient fade at the bottom so it blends into page content.
 * Optionally renders a language toggle when `lang` and `setLang` are provided.
 */
const Navbar = ({ items, activeSection, lang, setLang }: NavbarProps) => (
  <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 md:px-12 bg-gradient-to-b from-[#0a0a0a] to-transparent">
    <div className="text-xl font-black tracking-tighter">GABRIELDEV</div>

    <div className="hidden md:flex gap-8 items-center">
      {items.map((item) => {
        const isActive = activeSection === item.href.substring(1);

        return (
          <a
            key={item.id}
            href={item.href}
            className={`group flex items-center gap-1 text-[10px] font-mono tracking-widest transition-colors ${
              isActive ? "text-[#E8175D]" : "text-gray-400 hover:text-[#E8175D]"
            }`}
          >
            <span
              className={`transition-colors ${
                isActive ? "text-[#E8175D]" : "text-gray-600 group-hover:text-[#E8175D]"
              }`}
            >
              {item.id}
            </span>
            <span>/{item.label}</span>
          </a>
        );
      })}
      {lang && setLang && (
        <button
          onClick={() => setLang(lang === "pt" ? "en" : "pt")}
          className="ml-4 px-2 py-1 border border-gray-700 font-mono text-[10px] tracking-widest hover:border-[#E8175D] hover:text-[#E8175D] transition-all rounded uppercase"
        >
          {lang === "pt" ? "EN" : "PT"}
        </button>
      )}
    </div>

    {/* Mobile language toggle */}
    {lang && setLang && (
      <button
        onClick={() => setLang(lang === "pt" ? "en" : "pt")}
        className="md:hidden px-2 py-1 border border-gray-700 font-mono text-[10px] tracking-widest hover:border-[#E8175D] hover:text-[#E8175D] transition-all rounded uppercase"
      >
        {lang === "pt" ? "EN" : "PT"}
      </button>
    )}
  </nav>
);

export default Navbar;
