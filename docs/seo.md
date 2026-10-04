# SEO, indexing and GEO

> Last updated: 2026-10-04

How the site is made discoverable by search engines and AI assistants, and what to update when a page, a project or a slug changes. Per-language rules live in [`i18n.md`](./i18n.md); performance and accessibility have their own documents.

## Single sources of truth

| What                                                   | Where                                     |
| ------------------------------------------------------ | ----------------------------------------- |
| Head tags, canonical URL, Open Graph, Twitter, JSON-LD | `src/layouts/Layout.astro`                |
| ES to EN page pairs and language-toggle targets        | `src/i18n/utils.ts` (`EN_PAGE_MAP`)       |
| Sitemap, priorities and sitemap hreflang               | `astro.config.mjs` (`@astrojs/sitemap`)   |
| Crawler directives                                     | `public/robots.txt`                       |
| Legacy and renamed URLs                                | `vercel.json` (`redirects`)               |
| Project content, case-study dates, schema type         | `src/data/projects.ts`                    |
| AI-discovery files                                     | `public/llms.txt`, `public/llms-full.txt` |

## Metadata every page receives

`Layout.astro` emits, from the props a page passes (`title`, `description`, `alternates`, `ogImage`, `ogType`, `noindex`, `preloadHero`):

- `<title>` and `<meta name="description">`.
- `<meta name="robots">`: `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`, or `noindex, nofollow` when `noindex` is set.
- `<link rel="canonical">` built from the pathname against `https://www.wavival.dev`. The canonical host is always `www`.
- One `<link rel="alternate" hreflang>` per entry of `alternates` (`es`, `en`, `x-default`).
- Open Graph: type, url, title, description, image (1200x630), image alt, `og:locale` (`es_CO` or `en_US`) with the other one as `og:locale:alternate`, site name.
- Twitter Card `summary_large_image` with `@wavival0`.
- Icons, `site.webmanifest` and `theme-color`.

Default social cards are `public/images/og-card-es.webp` and `og-card-en.webp`. Case studies pass their own card (`public/images/og-*.webp`).

## Structured data (JSON-LD)

All pages carry a graph with `Person`, `Organization` and `WebSite`. Everything on wavival.dev belongs to wavival: the `Person` is the entity of the site (it holds the contact email and is the `author` and `publisher` of the `WebSite` and the `provider` of the services), and the `Organization` is Lúmina W, a separate company that she founded (`founder`) and that has its own site, services and pricing at `luminaw.co`. The `Organization` carries no contact point or service of this site. On top of it:

| Page type                    | Extra schema                                                                |
| ---------------------------- | --------------------------------------------------------------------------- |
| Home (`/`, `/en`)            | `ProfilePage`                                                               |
| About, tools, projects index | `BreadcrumbList`                                                            |
| Contact                      | `ContactPage` and `BreadcrumbList`                                          |
| Services                     | `Service`, `FAQPage` and `BreadcrumbList`                                   |
| Case studies                 | `BreadcrumbList` and a project node chosen by `schemaType` in `projects.ts` |
| Quote, privacy, 404          | none beyond the shared graph                                                |

The project node is `SoftwareApplication` by default (TerraCore, OKroot, NullBreach), `WebSite` for site projects (landings, Blog Lúmina W, Lúmina W, wavival.dev) and `CreativeWork` for the Forgotten Portal writeup.

## Indexing

- `robots.txt` allows every crawler, disallows `/cdn-cgi/` and points to `https://www.wavival.dev/sitemap-index.xml`.
- The sitemap is generated at build time. Priority is 1.0 for the two homes, 0.8 for regular pages, 0.7 for case studies and 0.3 for privacy; `changefreq` is monthly. Every URL that has a counterpart lists `es`, `en` and `x-default` (the Spanish URL) alternates.
- `/404` and `/en/404` are `noindex` and have no alternates.
- `/nullbreach` belongs to another Vercel application (`microfrontends.json`) and is not part of this sitemap.
- Permanent redirects keep old links alive: the former OKroot slugs (`/proyectos/root`, `/proyectos/root-landing` and the English pair) and the unprefixed English paths (`/projects`, `/services`, `/about`, `/contact`, `/uses`).

## GEO (AI-assistant discovery)

- `public/llms.txt` is the index: profile, every project with its case-study URL, the stack, contact data and the English version of the site.
- `public/llms-full.txt` is the long-form companion: one section per case study, services and contact.
- Both state that wavival.dev (services, pricing, contact) belongs to wavival and luminaw.co to Lúmina W.
- Both are written by hand. A test (`tests/case-studies.spec.ts`) fails when a case study slug is missing from either file.
- Keep both aligned with the site whenever a project, a service, a price or a contact channel changes (rule also in `AGENTS.md`).

## Checklist when something changes

- New page: add it to `EN_PAGE_MAP` (or the project special case), pass `alternates` to `Layout`, give it a unique title and a description, add JSON-LD if it has a schema type.
- New or renamed project: update `projects.ts` (`slug`, `en`, `metaDescription` up to 160 characters, `schemaType`, dates), the social card, `llms.txt` and `llms-full.txt`, and add a redirect if a slug was published before.
- Run `npm run build && npm test`; `tests/seo.spec.ts`, `tests/i18n.spec.ts` and `tests/redirects.spec.ts` cover robots, sitemap, hreflang and redirects.

## Known gaps

Tracked in [`ROADMAP.md`](./ROADMAP.md): `lastmod` in the sitemap, explicit AI crawlers in `robots.txt`, and the Forgotten Portal social image size. The quote pages (`/cotizar`, `/en/quote`) have short meta descriptions (about 70 characters).
