/**
 * Site footer — copyright notice, legal links, and back-to-top button.
 */
const Footer = () => (
  <footer className="relative z-10 py-12 border-t border-gray-900 px-8 md:px-12">
    <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

      <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
        © 2024 GABRIELDEV / ALL RIGHTS RESERVED
      </div>

      <div className="flex gap-8 font-mono text-[10px] text-gray-600 uppercase tracking-widest">
        <a href="#" className="hover:text-[#E8175D] transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-[#E8175D] transition-colors">Terms of Service</a>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="font-mono text-[10px] text-gray-400 hover:text-[#E8175D] transition-colors flex items-center gap-2"
      >
        BACK TO TOP ↑
      </button>
    </div>
  </footer>
);

export default Footer;
