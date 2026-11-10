import { ui, defaultLang, type Lang } from "./ui";
import { stripVariantPrefix } from "../utils/currency";

export type { Lang } from "./ui";

// Every helper reads the public pathname: the `/cop/` currency variant of a
// page (see `src/utils/currency.ts`) has the same language, routes and links
// as the page it mirrors.

/** Detect the active language from the URL path (/en/... → en, otherwise es). */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = stripVariantPrefix(url.pathname).split("/");
  if (seg === "en") return "en";
  return defaultLang as Lang;
}

/** Translator bound to a language, with safe fallback to the default language. */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * ES paths that have an EN equivalent.
 * Add entries here as more pages get translated.
 */
export const EN_PAGE_MAP: Record<string, string> = {
  "/": "/en",
  "/proyectos": "/en/projects",
  "/sobre-mi": "/en/about",
  "/servicios": "/en/services",
  "/cotizar": "/en/quote",
  "/contacto": "/en/contact",
  "/herramientas": "/en/uses",
  "/privacidad": "/en/privacy",
};

/** Reverse of EN_PAGE_MAP: EN path → ES path, for pages where names differ. */
const ES_PAGE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(EN_PAGE_MAP).map(([es, en]) => [en, es])
);

/**
 * Target URL for the language toggle.
 * EN pages check the reverse map first, then strip the /en prefix.
 * ES pages map to their EN counterpart if one exists, else fall back to /en.
 */
export function getAltLangUrl(url: URL): { href: string; lang: Lang } {
  const path = stripVariantPrefix(url.pathname);
  const normalizedPath = path.replace(/\/$/, "") || "/";
  if (normalizedPath === "/404" || normalizedPath === "/en/404") {
    return getLangFromUrl(url) === "en" ? { href: "/", lang: "es" } : { href: "/en", lang: "en" };
  }
  if (getLangFromUrl(url) === "en") {
    const normalized = path.replace(/\/$/, "") || "/";
    if (ES_PAGE_MAP[normalized]) {
      return { href: ES_PAGE_MAP[normalized], lang: "es" };
    }
    if (normalized.startsWith("/en/projects/")) {
      return { href: normalized.replace("/en/projects/", "/proyectos/"), lang: "es" };
    }
    const stripped = path.replace(/^\/en(\/|$)/, "/") || "/";
    return { href: stripped, lang: "es" };
  }
  const normalized = path.replace(/\/$/, "") || "/";
  if (EN_PAGE_MAP[normalized]) {
    return { href: EN_PAGE_MAP[normalized], lang: "en" };
  }
  if (normalized.startsWith("/proyectos/")) {
    return { href: normalized.replace("/proyectos/", "/en/projects/"), lang: "en" };
  }
  return { href: "/en", lang: "en" };
}

/** Home path for a language. */
export function homeHref(lang: Lang): string {
  return lang === "en" ? "/en" : "/";
}

export interface SiteRoutes {
  home: string;
  projects: string;
  services: string;
  quote: string;
  about: string;
  contact: string;
  uses: string;
  privacy: string;
  stack: string;
  project: (slug: string) => string;
}

/** Localized internal routes, resolved against the site base. */
export function siteRoutes(lang: Lang, base: string = "/"): SiteRoutes {
  const en = lang === "en";
  const path = (es: string, enPath: string) => `${base}${en ? enPath : es}`;
  const home = en ? `${base}en` : base;
  return {
    home,
    projects: path("proyectos", "en/projects"),
    services: path("servicios", "en/services"),
    quote: path("cotizar", "en/quote"),
    about: path("sobre-mi", "en/about"),
    contact: path("contacto", "en/contact"),
    uses: path("herramientas", "en/uses"),
    privacy: path("privacidad", "en/privacy"),
    stack: `${home}#stack`,
    project: (slug: string) => path(`proyectos/${slug}`, `en/projects/${slug}`),
  };
}

const normalizePath = (p: string) => p.replace(/\/+$/, "") || "/";

/** "page" when href (without hash) points at the current pathname. */
export function ariaCurrent(href: string, current: URL): "page" | undefined {
  const url = new URL(href, current);
  if (url.hash) return undefined;
  return normalizePath(url.pathname) === normalizePath(stripVariantPrefix(current.pathname))
    ? "page"
    : undefined;
}
