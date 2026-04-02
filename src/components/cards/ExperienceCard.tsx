import type { Experience } from "../../types";

interface ExperienceCardProps {
  exp: Experience;
  /**
   * Small status label shown in the top-right corner.
   * e.g. "DATA STREAM 03 // LIVE"
   */
  status: string;
  /**
   * Decorative coordinate string shown in the bottom-left corner.
   * e.g. "X:450 Y:220"
   */
  pos: string;
}

/**
 * Cyberpunk-styled card for a single work experience entry.
 *
 * Visual details:
 * - Diagonal clipped corners via CSS clip-path polygon.
 * - Animated border on hover (gray-800 → gray-600 outer wrapper).
 * - Glowing year badge positioned above the card top edge.
 * - Red corner accent lines (top-left / bottom-right).
 * - Horizontal tick marks extending outside the card sides.
 */
const ExperienceCard = ({ exp, status, pos }: ExperienceCardProps) => (
  <div className="relative group">

    {/* Year badge — floats above the card top edge */}
    <div className="absolute -top-3 left-6 bg-[#E8175D] text-white px-4 py-1.5 font-mono text-[10px] font-bold tracking-widest shadow-[0_0_15px_rgba(232,23,93,0.5)] rounded-sm z-20">
      {exp.year}
    </div>

    {/* Outer 1px border wrapper using clip-path for diagonal cut effect */}
    <div className="p-[1px] bg-gray-800 group-hover:bg-gray-600 transition-colors duration-500 [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))]">

      {/* Inner content area — same clip-path to align both layers */}
      <div className="bg-[#0a0a0a] p-8 pt-12 h-full [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))] relative">

        {/* Subtle hover glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Status label — top right (hidden on small screens) */}
        <div className="absolute top-4 right-6 font-mono text-[8px] text-gray-500 tracking-widest uppercase hidden sm:block">
          {status}
        </div>

        {/* Main content */}
        <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tighter text-white mb-1 relative z-10">
          {exp.role}
        </h3>
        <div className="font-mono text-xs text-[#E8175D] uppercase tracking-widest mb-6 relative z-10">
          {exp.company}
        </div>
        <p className="font-mono text-xs text-gray-400 leading-relaxed mb-8 relative z-10">
          {exp.description}
        </p>

        {/* Coordinate label — bottom left */}
        <div className="absolute bottom-4 left-6 font-mono text-[8px] text-gray-600 tracking-widest">
          POS: {pos}
        </div>

        {/* Corner accent lines */}
        <div className="absolute top-0    left-0  w-4 h-4 border-t-2 border-l-2 border-[#E8175D] opacity-50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#E8175D] opacity-50" />
      </div>
    </div>

    {/* Horizontal tick marks extending outside the card */}
    <div className="absolute top-1/2 -left-2  w-4 h-[1px] bg-gray-700 z-10" />
    <div className="absolute top-1/2 -right-2 w-4 h-[1px] bg-gray-700 z-10" />
  </div>
);

export default ExperienceCard;
