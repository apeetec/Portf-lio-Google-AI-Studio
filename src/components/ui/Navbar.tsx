import type { NavItem } from "../../types";

interface NavbarProps {
  items: NavItem[];
  /**
   * ID of the section currently in the viewport.
   * Driven by GSAP ScrollTrigger scroll-spy in `useScrollAnimations`.
   */
  activeSection: string;
}

/**
 * Fixed top navigation bar.
 *
 * Highlights the active item based on `activeSection` prop.
 * Uses a gradient fade at the bottom so it blends into page content.
 */
const Navbar = ({ items, activeSection }: NavbarProps) => (
  <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 md:px-12 bg-gradient-to-b from-[#0a0a0a] to-transparent">
    <div className="text-xl font-black tracking-tighter">GABRIELDEV</div>

    <div className="hidden md:flex gap-8">
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
    </div>
  </nav>
);

export default Navbar;
