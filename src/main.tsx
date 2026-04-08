import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ProjectsPage from './pages/ProjectsPage.tsx';
import './index.css';

// Simple path-based routing without a router library.
// BASE_URL is e.g. "/Portf-lio-Google-AI-Studio/" in production.
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const pathname  = window.location.pathname;
const isProjectsPage =
  pathname === `${basePath}/projects` ||
  pathname === `${basePath}/projects/`;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isProjectsPage ? <ProjectsPage /> : <App />}
  </StrictMode>,
);
