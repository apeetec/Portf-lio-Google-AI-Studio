import { useState, useEffect } from "react";
import type { SobreMim, ApiProject, ApiExperience, ApiFormacao } from "../types";

const API_URL: string = import.meta.env.VITE_API_URL ?? "";

interface PortfolioData {
  sobreMim: SobreMim;
  apiProjects: ApiProject[];
  apiExperiences: ApiExperience[];
  apiFormacoes: ApiFormacao[];
  apiTechStack: string[];
  loading: boolean;
}

export const usePortfolioData = (): PortfolioData => {
  const [sobreMim, setSobreMim]               = useState<SobreMim>({});
  const [apiProjects, setApiProjects]         = useState<ApiProject[]>([]);
  const [apiExperiences, setApiExperiences]   = useState<ApiExperience[]>([]);
  const [apiFormacoes, setApiFormacoes]       = useState<ApiFormacao[]>([]);
  const [apiTechStack, setApiTechStack]       = useState<string[]>([]);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    if (!API_URL) {
      setLoading(false);
      return;
    }

    const fetchJSON = (path: string) =>
      fetch(`${API_URL}${path}`, { credentials: "omit" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

    Promise.all([
      fetchJSON("/wp-json/client/v1/sobre-mim"),
      fetchJSON("/wp-json/client/v1/projetos"),
      fetchJSON("/wp-json/client/v1/experiencia"),
      fetchJSON("/wp-json/client/v1/formacao"),
      fetchJSON("/wp-json/client/v1/tech-stack"),
    ]).then(([sm, proj, exp, form, tech]) => {
      if (sm && typeof sm === "object" && !Array.isArray(sm)) setSobreMim(sm as SobreMim);
      if (Array.isArray(proj)) setApiProjects(proj as ApiProject[]);
      if (Array.isArray(exp))  setApiExperiences(exp as ApiExperience[]);
      if (Array.isArray(form)) setApiFormacoes(form as ApiFormacao[]);
      if (Array.isArray(tech)) setApiTechStack(tech as string[]);
      setLoading(false);
    });
  }, []);

  return { sobreMim, apiProjects, apiExperiences, apiFormacoes, apiTechStack, loading };
};
