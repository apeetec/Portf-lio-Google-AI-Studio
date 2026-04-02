import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Custom crosshair cursor that replaces the native OS pointer.
 *
 * - Tracks the mouse via GSAP quickTo for smooth high-performance movement.
 * - Expands bracket corners and extends crosshair lines when hovering over
 *   interactive elements (links, buttons, inputs, card groups).
 * - Uses event delegation (one listener on document.body) instead of
 *   attaching handlers to every interactive element.
 */
const CustomCursor = () => {
  const cursorRef  = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // quickTo is faster than calling gsap.to() on every mousemove
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    // Event delegation — one pair of listeners instead of N
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, .group, .tech-card, .project-item")) {
        setIsHovering(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, .group, .tech-card, .project-item")) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseover", onMouseOver);
    document.body.addEventListener("mouseout",  onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseover", onMouseOver);
      document.body.removeEventListener("mouseout",  onMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      <div className={`relative transition-all duration-500 ${isHovering ? "scale-150" : "scale-100"}`}>

        {/* Corner bracket — top left */}
        <div className={`absolute -top-5 -left-5 w-3 h-3 border-t-2 border-l-2 border-[#E8175D] transition-all duration-500 ${isHovering ? "translate-x-[-4px] translate-y-[-4px]" : ""}`} />
        {/* Corner bracket — top right */}
        <div className={`absolute -top-5 -right-5 w-3 h-3 border-t-2 border-r-2 border-[#E8175D] transition-all duration-500 ${isHovering ? "translate-x-[4px] translate-y-[-4px]" : ""}`} />
        {/* Corner bracket — bottom left */}
        <div className={`absolute -bottom-5 -left-5 w-3 h-3 border-b-2 border-l-2 border-[#E8175D] transition-all duration-500 ${isHovering ? "translate-x-[-4px] translate-y-[4px]" : ""}`} />
        {/* Corner bracket — bottom right */}
        <div className={`absolute -bottom-5 -right-5 w-3 h-3 border-b-2 border-r-2 border-[#E8175D] transition-all duration-500 ${isHovering ? "translate-x-[4px] translate-y-[4px]" : ""}`} />

        {/* Horizontal crosshair line */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] bg-[#E8175D] transition-all duration-300 ${isHovering ? "w-12 opacity-100" : "w-4 opacity-50"}`} />
        {/* Vertical crosshair line */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] bg-[#E8175D] transition-all duration-300 ${isHovering ? "h-12 opacity-100" : "h-4 opacity-50"}`} />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#E8175D]" />
      </div>
    </div>
  );
};

export default CustomCursor;
