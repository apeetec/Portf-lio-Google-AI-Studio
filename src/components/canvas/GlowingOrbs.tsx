/**
 * Static decorative background for the Hero section.
 *
 * Renders two blurred ambient glow blobs and three concentric wireframe
 * rings that spin at different speeds via CSS animation.
 * Pure CSS — no JavaScript animation loop.
 */
const GlowingOrbs = () => (
  <div
    className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    style={{
      maskImage:       "linear-gradient(to bottom, black 50%, transparent 100%)",
      WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
    }}
  >
    {/* Ambient glow blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#E8175D]/5 blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-[#E8175D]/5 blur-[100px]" />

    {/* Spinning wireframe rings — three layers at different scales and speeds */}
    <div className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] border border-[#E8175D]/20 rounded-full animate-[spin_20s_linear_infinite] opacity-30" />
    <div className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] border border-[#E8175D]/10 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-30 scale-110" />
    <div className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] border border-[#E8175D]/5  rounded-full animate-[spin_25s_linear_infinite] opacity-30 scale-90" />
  </div>
);

export default GlowingOrbs;
