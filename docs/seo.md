# SEO, indexing and GEO

> Last updated: 2026-10-05

How the site is made discoverable by search engines and AI assistants, and what to update when a page, a project or a slug changes. Per-language rules live in [`i18n.md`](./i18n.md); performance and accessibility have their own documents.

## Single sources of truth

| What                                                   | Where                                     |
| ------------------------------------------------------ | ----------------------------------------- |
| Head tags, canonical URL, Open Graph, Twitter, JSON-LD | `src/layouts/Layout.astro`                |
| ES to EN page pairs and language-toggle targets        | `src/i18n/utils.ts` (`EN_PAGE_MAP`)       |
| Sitemap, priorities and sitemap hreflang               | `astro.config.mjs` (`@astrojs/sitemap`)   |
| Crawler directives                                     | `public/robots.txt`                       |
| Legacy and renamed URLs                                | `vercel.json` (`redirects`)               |
| Project content, dates, schema type, parts             | `src/data/projects.ts`                    |
| Project page title, meta description and JSON-LD       | `src/data/projectSeo.ts`                  |
| AI-discovery files                                     | `public/llms.txt`, `public/llms-full.txt` |

## Metadata every page receives

`Layout.astro` emits, from the props a page passes (`title`, `description`, `alternates`, `ogImage`, `ogType`, `noindex`, `preloadHero`):

- `<title>` and `<meta name="description">`.
- `<meta name="robots">`: `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`, or `noindex, nofollow` when `noindex` is set.
- `<link rel="canonical">` built from the pathname against `https://www.wavival.dev`. The canonical host is always `www`.
- One `<link rel="alternate" hreflang>` per entry of `alternates` (`es`, `en`, `x-default`).
- Open Graph: type, url, title, description, image (1200x630), image alt, `og:locale` (`es_CO` or `en_US`) with the other one as `og:locale:alternate`, site name. The type is `profile` on the two homes and `article` on case studies, which add `article:published_time` and `article:modified_time`; every other page is `website`.
- Twitter Card `summary_large_image` with `@wavival0`.
- Icons, `site.webmanifest` and `theme-color`.

Default social cards are `public/images/og-card-es.webp` and `og-card-en.webp`. Project pages pass their own card (`image` in `projects.ts`: `public/images/og-*.webp`, and `forgotten-portal.webp` for the Forgotten Portal writeup).

## Structured data (JSON-LD)

All pages carry a graph with `Person`, `Organization` and `WebSite`. Everything on wavival.dev belongs to wavival: the `Person` is the entity of the site (it holds the contact email and is the `author` and `publisher` of the `WebSite` and the `provider` of the services), and the `Organization` is Lúmina W, a separate company that she founded (`founder`) and that has its own site, services and pricing at `luminaw.co`. The `Organization` carries no contact point or service of this site, and the `Person` has no `worksFor`. The `Person` is a Full Stack Developer (`jobTitle`) and the description states the focus on backend and AI. On top of it:

| Page type                    | Extra schema                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------- |
| Home (`/`, `/en`)            | `ProfilePage` (its `mainEntity` is the `Person`)                              |
| About, tools, projects index | `BreadcrumbList`                                                              |
| Contact                      | `ContactPage` (its `mainEntity` is the `Person`) and `BreadcrumbList`         |
| Services                     | `Service` (provider: the `Person`), `FAQPage` and `BreadcrumbList`            |
| Project pages                | `BreadcrumbList` and one project node chosen by `schemaType` in `projects.ts` |
| Quote, privacy, 404          | none beyond the shared graph                                                  |

Each project has one page and one project node (`projectSchema`), with the `Person` as `author`. It is `SoftwareApplication` for TerraCore, OKroot and NullBreach, `WebSite` for Lúmina W and wavival.dev, and `CreativeWork` for the Forgotten Portal writeup. `name` is the official name and `alternateName` is the short name when it differs. On a project with several parts the node adds `hasPart`, one entry per part that has a link, with its own schema.org type (`SoftwareApplication`, `WebSite`, `Blog`, `SoftwareSourceCode`, `WebAPI` or `TechArticle`), a name such as "TerraCore Landing", the part blurb and its URL.

The page title is `<official name>: Caso de estudio | Valentina Ramírez` in Spanish and `<official name>: Case study | Valentina Ramirez` in English (`projectMeta`).

## Indexing

- `robots.txt` allows every crawler, disallows `/cdn-cgi/` and points to `https://www.wavival.dev/sitemap-index.xml`.
- The sitemap is generated at build time. Priority is 1.0 for the two homes, 0.8 for regular pages, 0.7 for project pages (six per language) and 0.3 for privacy; `changefreq` is monthly. Every URL that has a counterpart lists `es`, `en` and `x-default` (the Spanish URL) alternates; each project has a single URL per language, so its hreflang pair is `/proyectos/<slug>` and `/en/projects/<slug>`, and a part is only a hash on it, never a separate URL.
- `/404` and `/en/404` are `noindex` and have no alternates.
- `/nullbreach` belongs to another Vercel application (`microfrontends.json`) and is not part of this sitemap.
- Permanent (301) redirects keep old links alive. Merged slugs go to the part of the ecosystem that replaced them: `terracore-landing` to `/proyectos/terracore#landing`, `okroot-landing` and `root-landing` to `/proyectos/okroot#landing`, `root` to `/proyectos/okroot`, and `blog-lumina-w` to `/proyectos/lumina-w#blog`, each with its `/en/projects/...` and unprefixed `/projects/...` equivalent (`vercel.json`). The unprefixed English paths (`/projects`, `/projects/<slug>`, `/services`, `/about`, `/contact`, `/uses`), which resolve to the Spanish pages.

## GEO (AI-assistant discovery)

- `public/llms.txt` is the index: profile, every project with its page URL, the stack, contact data and the English version of the site.
- `public/llms-full.txt` is the long-form companion: one section per project, services and contact.
- Both state that wavival.dev (services, pricing, contact) belongs to wavival and luminaw.co to Lúmina W, and that the published price (from USD 250 / COP 1,000,000, depending on scope) is wavival's. `llms-full.txt` carries the price and services.
- Both are written by hand. A test (`tests/case-studies.spec.ts`) fails when a project slug is missing from either file.
- Keep both aligned with the site whenever a project, a service, a price or a contact channel changes (rule also in `AGENTS.md`).

## Checklist when something changes

- New page: add it to `EN_PAGE_MAP` (or the project special case), pass `alternates` to `Layout`, give it a unique title and a description, add JSON-LD if it has a schema type.
- New, merged or renamed project: update `projects.ts` (`slug`, `name`, `parts`, `en`, `metaDescription` up to 160 characters, `schemaType`, dates), the social card, `llms.txt` and `llms-full.txt`, and add a 301 redirect for every slug that was published before, pointing at the part that replaced it.
- Run `npm run build && npm test`; `tests/seo.spec.ts`, `tests/i18n.spec.ts` and `tests/redirects.spec.ts` cover robots, sitemap, hreflang and redirects.

## Known gaps

Tracked in [`ROADMAP.md`](./ROADMAP.md): `lastmod` in the sitemap, explicit AI crawlers in `robots.txt`, and the Forgotten Portal social image size. The quote pages (`/cotizar`, `/en/quote`) have short meta descriptions (about 70 characters).
