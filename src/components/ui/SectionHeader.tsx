import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

interface SectionHeaderProps {
  /** Zero-padded section number, e.g. "02" */
  number: string;
  title: string;
}

/**
 * Animated section title used at the top of every portfolio section.
 *
 * On scroll-enter, the title text is split into individual characters
 * via SplitType and each char is animated in with a 3D flip (rotateX)
 * using GSAP + ScrollTrigger.
 *
 * CSS class `.section-header` is also targeted by a scroll-reveal animation
 * registered globally in `useScrollAnimations`.
 */
const SectionHeader = ({ number, title }: SectionHeaderProps) => {
  const headerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!headerRef.current) return;

      const text = new SplitType(headerRef.current, { types: "chars" });

      gsap.from(text.chars, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
        },
        y:        50,
        opacity:  0,
        rotateX:  -90,
        stagger:  0.02,
        duration: 0.8,
        ease:     "power4.out",
      });
    },
    { scope: headerRef }
  );

  return (
    <div className="section-header flex items-center gap-4 mb-12">
      <span className="font-mono text-xs text-gray-600">{number}</span>
      <div className="h-[1px] flex-1 bg-gray-800" />
      <h2
        ref={headerRef}
        className="font-display text-4xl md:text-6xl uppercase tracking-tighter overflow-hidden"
      >
        {title}
      </h2>
    </div>
  );
};

export default SectionHeader;
