import SectionHeader from "../ui/SectionHeader";
import ContactForm   from "../forms/ContactForm";

/**
 * Contact section with a CTA headline, direct email link, and the
 * embedded ContactForm component.
 */
const ContactSection = () => (
  <section id="contact" className="relative z-10 py-32 px-8 md:px-12">
    <div className="max-w-7xl w-full mx-auto">
      <SectionHeader number="05" title="GET IN TOUCH" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">

        {/* Left — CTA copy + email */}
        <div className="space-y-8">
          <p className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tighter uppercase">
            Let's build something{" "}
            <span className="text-[#E8175D]">extraordinary</span> together.
          </p>

          <div className="flex flex-col gap-4">
            <a
              href="mailto:gabriel938@gmail.com"
              className="font-mono text-xl md:text-2xl hover:text-[#E8175D] transition-colors underline underline-offset-8 decoration-gray-800 hover:decoration-[#E8175D]"
            >
              gabriel938@gmail.com
            </a>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
              Available for freelance &amp; collaborations
            </p>
          </div>
        </div>

        {/* Right — contact form */}
        <div className="flex flex-col justify-end gap-12">
          <ContactForm />
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;
