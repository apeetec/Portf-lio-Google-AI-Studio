import SectionHeader from "../ui/SectionHeader";
import ContactForm   from "../forms/ContactForm";

interface ContactT {
  sections: { contact: string };
  contact: {
    title: string;
    status: string;
    form: {
      name: string; email: string; message: string;
      send: string; thanks: string; success: string;
    };
  };
}

interface ContactSectionProps {
  lang: "pt" | "en";
  t: { pt: ContactT; en: ContactT };
}

const ContactSection = ({ lang, t }: ContactSectionProps) => (
  <section id="contact" className="relative z-10 py-32 px-8 md:px-12">
    <div className="max-w-7xl w-full mx-auto">
      <SectionHeader number="06" title={t[lang].sections.contact} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">

        {/* Left — CTA copy + email */}
        <div className="space-y-8">
          <p
            className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tighter uppercase"
            dangerouslySetInnerHTML={{ __html: t[lang].contact.title }}
          />

          <div className="flex flex-col gap-4">
            <a
              href="mailto:gabriel938@gmail.com"
              className="font-mono text-xl md:text-2xl hover:text-[#E8175D] transition-colors underline underline-offset-8 decoration-gray-800 hover:decoration-[#E8175D]"
            >
              gabriel938@gmail.com
            </a>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
              {t[lang].contact.status}
            </p>
          </div>
        </div>

        {/* Right — contact form */}
        <div className="flex flex-col justify-end gap-12">
          <ContactForm lang={lang} t={t} />
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;
