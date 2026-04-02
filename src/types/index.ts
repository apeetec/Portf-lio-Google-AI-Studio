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
