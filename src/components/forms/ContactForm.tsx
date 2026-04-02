import React, { useState } from "react";

/**
 * Contact form with a client-side submitted confirmation state.
 *
 * On successful submit the form is replaced with a "Thank You" message
 * for 5 seconds, then resets automatically.
 *
 * Note: form submission is currently front-end only — wire up a backend
 * endpoint or service (e.g. Resend, Formspree) in `handleSubmit` to
 * actually deliver messages.
 */
const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Auto-reset after 5 seconds so the form can be used again
    setTimeout(() => setSubmitted(false), 5000);
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center border border-gray-800 p-12 text-center bg-black/20 backdrop-blur-sm">
        <h3 className="font-display text-3xl mb-4 text-[#E8175D]">THANK YOU</h3>
        <p className="font-mono text-xs text-gray-400">
          Your message has been received. I'll get back to you soon.
        </p>
      </div>
    );
  }

  // ── Default form ───────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 bg-black/20 backdrop-blur-sm p-8 border border-gray-800/50"
    >
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] text-gray-500 uppercase">Name</label>
        <input
          required
          type="text"
          className="bg-transparent border-b border-gray-800 pb-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8175D] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] text-gray-500 uppercase">Email</label>
        <input
          required
          type="email"
          className="bg-transparent border-b border-gray-800 pb-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8175D] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] text-gray-500 uppercase">Message</label>
        <textarea
          required
          rows={4}
          className="bg-transparent border-b border-gray-800 pb-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8175D] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full py-6 border border-white font-display text-xl uppercase hover:bg-[#E8175D] hover:border-[#E8175D] hover:text-white transition-all duration-300"
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;
