import type { Lang } from "@/i18n/utils";

export const QUOTE_PROJECT_TYPES = [
  "web-app",
  "landing",
  "api-backend",
  "design",
  "security",
  "ai",
] as const;

export type QuoteProjectType = (typeof QUOTE_PROJECT_TYPES)[number];

const labels: Record<QuoteProjectType, Record<Lang, string>> = {
  "web-app": { es: "Aplicación web o PWA", en: "Web app or PWA" },
  landing: { es: "Landing page o sitio web", en: "Landing page or website" },
  "api-backend": { es: "API y backend", en: "API and backend" },
  design: { es: "Diseño de interfaz y prototipo", en: "UI design and prototype" },
  security: { es: "Seguridad y AppSec", en: "Security and AppSec" },
  ai: { es: "Producto con IA", en: "AI-powered product" },
};

export const quoteProjectTypeLabel = (type: QuoteProjectType, lang: Lang) => labels[type][lang];

export const quoteProjectTypeOptions = (lang: Lang) =>
  QUOTE_PROJECT_TYPES.map((id) => ({ id, label: labels[id][lang] }));

/** Query that opens the quote form on the project types, with none selected. */
export const QUOTE_TYPES_MODE = "types";

/** Link to the quote form on its project types: the visitor picks them in the form. */
export const quoteTypesHref = (quoteRoute: string) => `${quoteRoute}?mode=${QUOTE_TYPES_MODE}`;
