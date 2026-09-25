import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { microfrontends } from "@vercel/microfrontends/experimental/vite";
import { fileURLToPath } from "url";
import path from "path";
import { EN_PAGE_MAP } from "./src/i18n/utils.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE = "https://wavival.dev";
const EN_TO_ES = Object.fromEntries(Object.entries(EN_PAGE_MAP).map(([es, en]) => [en, es]));

const withSlash = (p) => (p === "/" ? "/" : p.endsWith("/") ? p : `${p}/`);

/**
 * Pair an ES or EN page path with its counterpart so the sitemap can emit
 * reciprocal hreflang alternates. Astro's built-in i18n only pairs URLs that
 * share a locale path prefix, which our Spanish slugs (e.g. /servicios) do not,
 * so we resolve the pair explicitly from EN_PAGE_MAP (the single source of
 * truth) plus the /proyectos/<slug> <-> /en/projects/<slug> special case.
 */
const altPair = (absUrl) => {
  const path = new URL(absUrl).pathname.replace(/\/$/, "") || "/";
  let esPath, enPath;
  if (path === "/en" || path.startsWith("/en/")) {
    enPath = path;
    if (EN_TO_ES[path]) esPath = EN_TO_ES[path];
    else if (path.startsWith("/en/projects/"))
      esPath = path.replace("/en/projects/", "/proyectos/");
    else return null;
  } else {
    esPath = path;
    if (EN_PAGE_MAP[path]) enPath = EN_PAGE_MAP[path];
    else if (path.startsWith("/proyectos/")) enPath = path.replace("/proyectos/", "/en/projects/");
    else return null;
  }
  return { esUrl: SITE + withSlash(esPath), enUrl: SITE + withSlash(enPath) };
};

/** Priority by page type so the sitemap stops flat-lining every URL at 1.0. */
const priorityFor = (absUrl) => {
  const p = new URL(absUrl).pathname.replace(/\/$/, "") || "/";
  if (p === "/" || p === "/en") return 1.0;
  if (p === "/privacidad" || p === "/en/privacy") return 0.3;
  if (p.startsWith("/proyectos/") || p.startsWith("/en/projects/")) return 0.7;
  return 0.8;
};

export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      changefreq: "monthly",
      priority: 1.0,
      lastmod: new Date(),
      i18n: {
        defaultLocale: "es",
        locales: { es: "es", en: "en" },
      },
      serialize(item) {
        item.priority = priorityFor(item.url);
        const pair = altPair(item.url);
        if (pair) {
          item.links = [
            { lang: "es", url: pair.esUrl },
            { lang: "en", url: pair.enUrl },
            { lang: "x-default", url: pair.esUrl },
          ];
        }
        return item;
      },
    }),
  ],
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    plugins: [microfrontends()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
});
