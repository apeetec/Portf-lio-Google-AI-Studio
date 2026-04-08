/**
 * Shared TypeScript types for the portfolio application.
 * All data shapes used across components are defined here.
 */

/** Navigation item displayed in the top nav bar. */
export interface NavItem {
  /** Zero-padded display number, e.g. "01" */
  id: string;
  label: string;
  href: string;
}

/** Portfolio project entry. */
export interface Project {
  title: string;
  category: string;
  year: string;
  /** Technology tags displayed as badges. */
  tech: string[];
  /** Thumbnail image URL (used on row hover). */
  image: string;
}

/** Work experience / career entry. */
export interface Experience {
  role: string;
  company: string;
  /** Date range string, e.g. "2022 - PRESENT". */
  year: string;
  description: string;
}

// ── API response types (WordPress REST API) ───────────────────────────────────

/** /wp-json/client/v1/sobre-mim */
export interface SobreMim {
  descricao?: string;
  github_link?: string;
  linkedin_link?: string;
  twitter_link?: string;
  email?: string;
}

/** /wp-json/client/v1/projetos */
export interface ApiProject {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
  /** External project URL from CMB2 `projeto_link` field. */
  link?: string;
}

/** /wp-json/client/v1/experiencia — single item */
export interface ApiExperience {
  cargo: string;
  empresa: string;
  ano: string;
  descricao_cargo: string;
}

/** /wp-json/client/v1/formacao — single item */
export interface ApiFormacao {
  curso: string;
  instituicao: string;
  ano: string;
  descricao_curso: string;
}
