import React, { useState, useEffect, useRef } from "react";

interface FormTranslations {
  contact: {
    form: {
      name: string; email: string; message: string;
      send: string; thanks: string; success: string;
      error: string; sending: string;
    };
  };
}

interface ContactFormProps {
  lang: "pt" | "en";
  t: { pt: FormTranslations; en: FormTranslations };
}

const API_BASE = "http://localhost/back-end-portfolio/wp-json/client/v1";

const ContactForm = ({ lang, t }: ContactFormProps) => {
  const [nome,     setNome]     = useState("");
  const [email,    setEmail]    = useState("");
  const [mensagem, setMensagem] = useState("");
  const [token,    setToken]    = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  // Track when the form was first rendered (used for bot speed detection)
  const loadTime = useRef<number>(Date.now());
  // Honeypot ref — real users never touch this field
  const hpRef = useRef<HTMLInputElement>(null);

  // Fetch one-time submission token on mount
  useEffect(() => {
    fetch(`${API_BASE}/contato`)
      .then((r) => r.json())
      .then((d) => setToken(d.token ?? ""))
      .catch(() => setToken(""));
  }, []);

  const refreshToken = () => {
    fetch(`${API_BASE}/contato`)
      .then((r) => r.json())
      .then((d) => setToken(d.token ?? ""))
      .catch(() => {});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side honeypot guard (should always be empty)
    if (hpRef.current?.value) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/contato`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          mensagem,
          _token:     token,
          _hp:        "",
          _load_time: loadTime.current,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? t[lang].contact.form.error);
        refreshToken();
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setNome(""); setEmail(""); setMensagem("");
        loadTime.current = Date.now();
        refreshToken();
      }, 5000);
    } catch {
      setError(t[lang].contact.form.error);
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center border border-gray-800 p-12 text-center bg-black/20 backdrop-blur-sm">
        <h3 className="font-display text-3xl mb-4 text-[#E8175D]">{t[lang].contact.form.thanks}</h3>
        <p className="font-mono text-xs text-gray-400">
          {t[lang].contact.form.success}
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
      {/* Honeypot — hidden from real users, bait for bots */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
      >
        <label htmlFor="_hp">Website</label>
        <input id="_hp" type="text" name="_hp" tabIndex={-1} autoComplete="off" ref={hpRef} />
      </div>

      {error && (
        <p className="font-mono text-xs text-red-400 border border-red-900/60 bg-red-950/30 p-3">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] text-gray-500 uppercase">{t[lang].contact.form.name}</label>
        <input
          required
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={200}
          className="bg-transparent border-b border-gray-800 pb-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8175D] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] text-gray-500 uppercase">{t[lang].contact.form.email}</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent border-b border-gray-800 pb-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8175D] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] text-gray-500 uppercase">{t[lang].contact.form.message}</label>
        <textarea
          required
          rows={4}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          maxLength={5000}
          className="bg-transparent border-b border-gray-800 pb-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8175D] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full py-6 border border-white font-display text-xl uppercase hover:bg-[#E8175D] hover:border-[#E8175D] hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? t[lang].contact.form.sending : t[lang].contact.form.send}
      </button>
    </form>
  );
};

export default ContactForm;
