import { Github, Linkedin, Mail, Twitter } from "lucide-react";

/**
 * Fixed vertical social links bar, anchored to the bottom-left of the viewport.
 * Only visible on large screens (lg breakpoint).
 *
 * The `.social-icons` class is targeted by the GSAP entrance animation
 * registered in `useScrollAnimations`.
 */
const SocialBar = () => (
  <div className="fixed left-6 bottom-0 z-50 hidden lg:flex flex-col items-center gap-6 pb-12">
    <div className="social-icons flex flex-col gap-6">
      <a href="#" className="text-gray-500 hover:text-[#E8175D] transition-colors">
        <Github size={18} />
      </a>
      <a href="#" className="text-gray-500 hover:text-[#E8175D] transition-colors">
        <Linkedin size={18} />
      </a>
      <a href="#" className="text-gray-500 hover:text-[#E8175D] transition-colors">
        <Twitter size={18} />
      </a>
      <a href="#" className="text-gray-500 hover:text-[#E8175D] transition-colors">
        <Mail size={18} />
      </a>
    </div>
    {/* Decorative vertical line below icons */}
    <div className="w-[1px] h-24 bg-gray-800 mt-4" />
  </div>
);

export default SocialBar;
