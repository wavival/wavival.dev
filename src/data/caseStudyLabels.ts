import type { Lang } from "@/i18n/utils";

export interface CaseLabels {
  projects: string;
  by: string;
  toc: string;
  tocParts: string;
  stack: string;
  summary: string;
  problem: string;
  architecture: string;
  decisions: string;
  design: string;
  results: string;
  learnings: string;
  roadmap: string;
  roadmapNow: string;
  roadmapNext: string;
  roadmapLater: string;
  roadmapOut: string;
  context: string;
  tradeoff: string;
  decision: string;
  view: string;
  close: string;
  prev: string;
  next: string;
  navLabel: string;
  backAria: string;
  quote: string;
  chainDefault: string;
  partsHeading: string;
  partOpen: string;
  partClose: string;
  partDesign: string;
}

const es: CaseLabels = {
  projects: "Proyectos",
  by: "Por",
  toc: "Contenido",
  tocParts: "Ecosistema",
  stack: "Stack",
  summary: "Resumen",
  problem: "El problema",
  architecture: "Qué construí",
  decisions: "Decisiones de arquitectura",
  design: "Diseño",
  results: "Resultados",
  learnings: "Aprendizajes",
  roadmap: "Roadmap",
  roadmapNow: "Ahora",
  roadmapNext: "Siguiente",
  roadmapLater: "Después",
  roadmapOut: "Fuera del alcance del MVP",
  context: "Contexto",
  tradeoff: "Trade-off",
  decision: "Decisión",
  view: "Ver",
  close: "Cerrar",
  prev: "Anterior",
  next: "Siguiente",
  navLabel: "Navegación entre proyectos",
  backAria: "Volver a todos los proyectos",
  quote: "Cotizar un proyecto así",
  chainDefault: "Ejemplo de cadena de acciones",
  partsHeading: "Componentes del ecosistema",
  partOpen: "Ver detalle",
  partClose: "Ocultar",
  partDesign: "Ver diseño",
};

const en: CaseLabels = {
  projects: "Projects",
  by: "By",
  toc: "Contents",
  tocParts: "Ecosystem",
  stack: "Stack",
  summary: "Summary",
  problem: "The problem",
  architecture: "What I built",
  decisions: "Architecture decisions",
  design: "Design",
  results: "Results",
  learnings: "Learnings",
  roadmap: "Roadmap",
  roadmapNow: "Now",
  roadmapNext: "Next",
  roadmapLater: "Later",
  roadmapOut: "Out of scope for the MVP",
  context: "Context",
  tradeoff: "Trade-off",
  decision: "Decision",
  view: "View",
  close: "Close",
  prev: "Previous",
  next: "Next",
  navLabel: "Project navigation",
  backAria: "Back to all projects",
  quote: "Quote a project like this",
  chainDefault: "Example action chain",
  partsHeading: "Ecosystem components",
  partOpen: "View details",
  partClose: "Hide",
  partDesign: "View design",
};

export const caseLabels = (lang: Lang): CaseLabels => (lang === "en" ? en : es);

export interface CaseSectionItem {
  key: string;
  label: string;
  id: string;
  n: string;
}

/** Numbered sections a part shows, in order. Only the sections the part has data for. */
export function partSections(
  part: {
    problem?: string;
    architecture?: string[];
    design?: string[];
    decisions?: unknown[];
    results?: string[];
    learnings?: string[];
    roadmap?: unknown;
  },
  t: CaseLabels,
  idPrefix: string
): CaseSectionItem[] {
  return [
    { key: "problem", label: t.problem, show: !!part.problem },
    { key: "architecture", label: t.architecture, show: !!part.architecture },
    { key: "design", label: t.design, show: !!part.design },
    { key: "decisions", label: t.decisions, show: !!part.decisions },
    { key: "results", label: t.results, show: !!part.results },
    { key: "learnings", label: t.learnings, show: !!part.learnings },
    { key: "roadmap", label: t.roadmap, show: !!part.roadmap },
  ]
    .filter((s) => s.show)
    .map((s, i) => ({
      key: s.key,
      label: s.label,
      id: `${idPrefix}${s.key}`,
      n: String(i + 1).padStart(2, "0"),
    }));
}
