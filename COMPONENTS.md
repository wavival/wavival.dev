# COMPONENTS.md: Component Reference

Inventory of every Astro component in `src/components/` (atomic design: atoms, molecules, organisms), the base layout, the page routes, and the client scripts. Props, behavior, and where each one lives in the page composition. The site is bilingual: Spanish (default) at the root, English mirrored under `/en/`. Organisms take a `lang` prop and pick routes/strings through `siteRoutes()` and `useTranslations()`, so nothing is hardcoded to one locale. UI follows the "Señal v4" design (Claude Design project `wavival-dev-v4`).

Related: [README.md](./README.md) · [DESIGN.md](./DESIGN.md) · [CLAUDE.md](./CLAUDE.md)

## Table of contents

- [Layout](#layout)
- [Atomic structure](#atomic-structure)
- [Atoms](#atoms)
- [Molecules](#molecules)
- [Organisms](#organisms)
- [Data](#data)
  - [projects.ts](#projectsts)
  - [projectView.ts](#projectviewts)
  - [stack.ts](#stackts)
  - [github.ts](#githubts)
- [Pages](#pages)
- [Client scripts](#client-scripts)

## Layout

### `Layout.astro`

Path: `src/layouts/Layout.astro`. Template for every page. Owns the full `<head>` (including the `<ClientRouter />` for View Transitions), skip link, NavBar, Footer.

| Prop          | Type                                   | Default                                                                                                                                                                                                                                        |
| ------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`                               | `"Valentina Ramírez \| Full Stack Developer Django + React"`                                                                                                                                                                                   |
| `description` | `string`                               | `"Full Stack Developer especializada en Django y React. Construyo productos completos..."`                                                                                                                                                     |
| `ogType`      | `"website" \| "article" \| "profile"`  | `"website"` (`profile` on home, `article` on case studies)                                                                                                                                                                                     |
| `image`       | `string`                               | `"/images/profile.webp"` (used for the JSON-LD Person `image`)                                                                                                                                                                                 |
| `ogImage`     | `string`                               | unset (falls back to `/images/og-card-es.webp` or `/images/og-card-en.webp` according to the page locale for OG + Twitter cards)                                                                                                               |
| `noindex`     | `boolean`                              | `false`                                                                                                                                                                                                                                        |
| `lang`        | `string`                               | Derived internally from the URL via `getLangFromUrl(Astro.url)` (drives `<html lang>`, `og:locale`, JSON-LD `inLanguage`, translations). The prop is retained for back-compat but ignored, so `<html lang>` always matches the rendered locale |
| `alternates`  | `{ hreflang: string; href: string }[]` | `[]` (emitted as `<link rel="alternate" hreflang>` tags)                                                                                                                                                                                       |

`lang` derives `ogLocale` (`en_US` / `es_CO`), the `socialCardAlt` text, the translator (`useTranslations`), and the home-only `ProfilePage` `inLanguage` (`en-US` / `es-CO`).

What it injects in `<head>` (in order):

- `<ClientRouter />` (Astro View Transitions): same-origin navigations swap without a full reload; DOM-binding scripts re-run on `astro:page-load`.
- **Pre-paint theme script** (`is:inline`, synchronous): first script in `<head>`. Adds `.dark` to `<html>` before stylesheets load unless `localStorage["theme"] === "light"` (dark is the default; `prefers-color-scheme` is not consulted), and sets the `theme-color` meta to match. Re-applies on `astro:after-swap`. Prevents FOUC.
- Title, description, author (`Valentina Ramírez`)
- Robots meta: `noindex, nofollow` when `noindex` is true, otherwise `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`
- Canonical URL from `Astro.url.pathname` against `https://www.wavival.dev`
- `<link rel="alternate" hreflang>` for each entry in `alternates`
- OpenGraph: `og:type`, `og:url`, `og:title`, `og:description`, `og:image` (1200x630; `og:image:type` derived from the file extension, `image/webp` for the locale-specific default `og-card-es.webp` or `og-card-en.webp`; alt, locale `ogLocale` + `og:locale:alternate` for the other locale), `og:site_name`
- Twitter Card (`summary_large_image`, title, description, image, image alt)
- Favicons / icons: `favicon.ico`, `icon-192.png`, `apple-touch-icon.png`, `site.webmanifest`
- A single `theme-color` meta (default `#0f1117`; `#f0f4ff` in light), kept in sync with the class-based theme by JS (not a media-conditional pair)
- Self-hosted font preloads (`<link rel="preload" as="font">` for the critical weights Poppins 400 + Raleway variable) and `<link rel="preload" as="image">` for the hero portrait (LCP optimization, gated by `preloadHero`)
- Fonts (Poppins + Raleway): self-hosted latin-subset `woff2` in `public/fonts/` (Poppins 400/500/600 static + Raleway variable `wght` 600-800), declared via `@font-face` (`font-display: swap`) in `global.css`. No Google Fonts request or `preconnect`
- **Umami analytics**: emitted **only when both `PUBLIC_UMAMI_SRC` and `PUBLIC_UMAMI_ID` are set** (`is:inline defer`). Cookieless. No Google Analytics.
- **Core Web Vitals RUM**: `src/scripts/vitals.ts` (imported under the same Umami env gate) reports LCP/INP/CLS/FCP/TTFB to Umami as `web-vitals` custom events.
- JSON-LD `@graph` (`is:inline`, `application/ld+json`): `Person`, `Organization`, and `WebSite` on every page, plus a `ProfilePage` appended only on the home pages (`isHome`):
  - `Person` (`#person`): `knowsAbout`, `knowsLanguage`, `nationality`, `alumniOf` (SENA, Universidad de San Buenaventura, Platzi), `worksFor` referencing the Organization by `@id`, `sameAs` identity profiles
  - `Organization` (`#organization`): Lúmina W, `founder` referencing the Person by `@id`, `sameAs`
  - `WebSite` (`#website`): fixed `name`, `author` referencing the Person; omits `inLanguage` (shared `@id` must not mutate per locale)
  - `ProfilePage` (`#profilepage`, home only): per-locale `inLanguage`, `mainEntity` → `#person`, `isPartOf` → `#website`, build-date `dateModified`

Per-page JSON-LD (Breadcrumb, Service, FAQPage, ContactPage, and the case-study `SoftwareApplication` / `WebSite` / `CreativeWork`) is emitted by the individual pages, not by `Layout`.

Body contents (in order):

- Skip link → `#main-content` (visible only on focus; label from `common.skip`)
- `<NavBar lang={lang} />` (sticky header)
- `<main id="main-content">` with the page `<slot />` (no top padding: the header is sticky, not fixed)
- `<Footer lang={lang} />`

## Atomic structure

`src/components/` follows atomic design. Atoms are single-purpose and style-only, molecules combine atoms, organisms are page sections or complete blocks. The template is `src/layouts/Layout.astro`. Organisms take a `lang` prop (`"es"` | `"en"`, default `es`) and resolve internal targets through `siteRoutes(lang, base)` and `useTranslations(lang)`, so nothing is hardcoded to one locale. Classes referenced below are documented in [DESIGN.md](./DESIGN.md).

## Atoms

Path: `src/components/atoms/`.

| Component         | Props                                                                                                                                                                   | Notes                                                                                                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button.astro`    | `id`, `href`, `target`, `type`, `variant` (`primary` \| `secondary`), `size` (`md` \| `sm` \| `compact`), `class`, `icon`, `download`, `aria-label`, `data-umami-event` | `<a>` when `href` is set, else `<button>`. `.btn` + variant class. Only the primary variant renders `icon` (a white `<img>` from `public/icons/ui`, `width="20" height="20"`). External targets get `rel="noopener noreferrer"` |
| `TextLink.astro`  | `href`, `target`, `variant` (`text` \| `list` \| `inline`), `class`, `hreflang`, `aria-label`, `aria-current`, `data-umami-event`                                       | `.text-link` (uppercase underlined), `.list-link` (footer/nav lists, `aria-current` switches to `--link`), `.inline-link` (in prose). No icons                                                                                  |
| `IconLink.astro`  | `href`, `icon`, `label`, `target`, `size` (`md` \| `lg`), `class`, `data-umami-event`                                                                                   | Icon-only anchor: `.icon-btn` with a `MaskIcon`, `label` is the `aria-label`. 44px (`md`) or 50px (`lg`) target                                                                                                                 |
| `MaskIcon.astro`  | `name`, `size` (`md` \| `lg` \| `xl`), `class`                                                                                                                          | Decorative (`aria-hidden`) span that tints `public/icons/ui/<name>.svg` with `--link` through CSS mask (`--icon` custom property)                                                                                               |
| `Chip.astro`      | `class`                                                                                                                                                                 | `.chip` tag/tool label (slot)                                                                                                                                                                                                   |
| `StatusDot.astro` | `tone` (`green` \| `blue` \| `orange` \| `gray`), `class`                                                                                                               | `.status` + `.status-dot` with optional text slot                                                                                                                                                                               |
| `Badge.astro`     | `class`                                                                                                                                                                 | `.badge` solid label (slot)                                                                                                                                                                                                     |
| `Eyebrow.astro`   | `as` (`span` \| `p` \| `div`), `class`                                                                                                                                  | `.eyebrow` uppercase blue label                                                                                                                                                                                                 |
| `Index.astro`     | `class`                                                                                                                                                                 | `.index` two-digit number (`01`, `02`) in `--blue`                                                                                                                                                                              |

## Molecules

Path: `src/components/molecules/`.

| Component              | Props                                                                                                 | Notes                                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SectionHeader.astro`  | `title`, `label`, `index`, `intro`, `as` (`h1` \| `h2` \| `h3`), `titleClass`, `class`                | Section heading block: `.rule-section` top rule, optional `Index` + `label`, title in the display scale, optional intro paragraph, default slot for extras |
| `PageIntro.astro`      | `eyebrow`, `size` (`page` \| `index` \| `contact` \| `case` \| `uses` \| `about`), `class`            | The page `h1` (`.display-page`, font size from `--fs-display-*`). Slots: `title` (heading content) and default (lead copy). Used on every non-home page    |
| `ChipList.astro`       | `items`, `label`, `loose`, `class`                                                                    | `<ul role="list">` of `Chip`; `label` becomes the list `aria-label`                                                                                        |
| `ProjectMeta.astro`    | `index`, `tag`, `tone`, `overline`                                                                    | Index + `StatusDot` tag + optional overline for a project                                                                                                  |
| `ProjectActions.astro` | `actions` (`ProjectAction[]`), `class`                                                                | Row of `TextLink`s, one per action (external ones open in a new tab); forwards each action's `event` as `data-umami-event`                                 |
| `Metric.astro`         | `value`, `label`, `note`, `size` (`sm` \| `md` \| `lg`)                                               | Large Raleway figure with label and optional note                                                                                                          |
| `DefRow.astro`         | `label`, `tone` (`muted` \| `link`), `last`, `class`                                                  | `<dt>`/`<dd>` row for definition lists (problem / what I built); the label highlights in `--link` with `tone="link"`                                       |
| `SocialLinks.astro`    | `lang`, `size` (`md` \| `lg`), `items` (`linkedin` \| `github` \| `instagram` \| `whatsapp`), `class` | Row of `IconLink`s with localized labels                                                                                                                   |
| `ThemeToggle.astro`    | `placement` (`desktop` \| `mobile`), `label`                                                          | `.icon-btn` with sun/moon `MaskIcon`s; ids `theme-toggle-<placement>`, `sun-<placement>`, `moon-<placement>` are what `theme.ts` binds to                  |
| `Disclosure.astro`     | `index`, `title`, `openLabel`, `closeLabel`                                                           | Native `<details class="disclosure">`; the summary shows "Ver"/"Cerrar" (ES) or "View"/"Close" (EN) as text. No JS                                         |
| `PullQuote.astro`      | `size` (`md` \| `lg`), `class`                                                                        | Large quote (slot) with a named `footer` slot for attribution                                                                                              |

## Organisms

Path: `src/components/organisms/`.

| Component                | Props                                                                                         | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NavBar.astro`           | `lang`                                                                                        | Sticky 64px header (`border-b`, `--nav` fill, backdrop blur). Desktop: logo, `<ul role="list">` of `.nav-link`s (Projects, Services, Stack, About; active = text color + 2px blue bar via `aria-current`), "EN"/"ES" `.lang-toggle`, `ThemeToggle`, compact mailto `Button` (`contacto-email`). Below 900px: language toggle, theme toggle, and `#menu-btn` opening the full-screen `#mobile-menu` overlay (numbered display links, "Blog W" primary `Button`, mailto secondary). Imports `nav.ts` + `theme.ts` |
| `Footer.astro`           | `lang`                                                                                        | Logo + social links, site navigation, resources (real `<h2>` group titles), outlined wordmark SVG, year from `new Date().getFullYear()`                                                                                                                                                                                                                                                                                                                                                                         |
| `ContactBand.astro`      | `lang`, `showServicesLink`                                                                    | `#contact` band (`--surface`, top rule): heading, pricing line, availability, "Quiero mi producto" `Button` (`cta-quiero-producto`) and optional services `TextLink`. Home end, and also the end of services, about, and case studies                                                                                                                                                                                                                                                                           |
| `Hero.astro`             | `lang`                                                                                        | `#hero`: meta bar with availability `StatusDot`, `h1.display-xl`, 4:5 `.photo-frame` portrait (`width=320 height=400`, `fetchpriority="high"`), lead, CV `Button` (`cv-descarga-es`/`-en`), services `Button`, `SocialLinks`, stat row                                                                                                                                                                                                                                                                          |
| `FeaturedProjects.astro` | `lang`                                                                                        | `#projects`: `SectionHeader` + `ProjectRow`s for `terracore`, `okroot`, `nullbreach` + link to the full index                                                                                                                                                                                                                                                                                                                                                                                                   |
| `StackSection.astro`     | `lang`                                                                                        | `#stack`: `SectionHeader` + `StackGrid`                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `StackGrid.astro`        | `lang`                                                                                        | `.cell-grid` of stack categories from `src/data/stack.ts` (`descriptionEn`, `toolsEn ?? tools` when `isEn`) rendered with `ChipList`                                                                                                                                                                                                                                                                                                                                                                            |
| `AboutSection.astro`     | `lang`                                                                                        | `#about`: bio, `PullQuote`, additional links                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `ProjectRow.astro`       | `project` (`ProjectView`), `index`, `lang`                                                    | Editorial row (`ProjectMeta`, `.h3-project` title, `DefRow`s for problem/what I built, `ChipList`, `ProjectActions`, cover) used on the home                                                                                                                                                                                                                                                                                                                                                                    |
| `ProjectCard.astro`      | `project` (`ProjectView`), `index`                                                            | Compact card used in the filterable index (`ProjectMeta`, `ChipList`, `ProjectActions`); carries `data-project-card` and `data-filters` for `ProjectFilters`                                                                                                                                                                                                                                                                                                                                                    |
| `ProjectsIndex.astro`    | `lang`                                                                                        | `/proyectos` body: `PageIntro` (h1), `ProjectFilters`, grid of `ProjectCard`s, `role="status"` empty block                                                                                                                                                                                                                                                                                                                                                                                                      |
| `ProjectFilters.astro`   | `lang`, `counts`                                                                              | `#project-filters` group of `[data-filter]` buttons with `aria-pressed`; bundled script toggles `display` of the cards                                                                                                                                                                                                                                                                                                                                                                                          |
| `RepoCard.astro`         | `repo` (`GithubRepo`), `lang`, `variant` (`featured` \| `resource`)                           | GitHub repo card for `/herramientas` and `/en/uses`. Name is a plain `<span>`, stars are localized text (never a glyph), no `aria-label` (accessible name from visible content)                                                                                                                                                                                                                                                                                                                                 |
| `ServiceRow.astro`       | `index`, `title`, `body`, `tools`, `timeline`, `specialty`, `examples`, `quoteHref`, `labels` | One service: index, title, description, tools `ChipList`, duration, optional specialty `Badge`, example links, and localized quote link                                                                                                                                                                                                                                                                                                                                                                         |
| `QuoteForm.astro`        | `services`, `selectedService`, `labels`, `privacyHref`                                        | Quote form with preselected service, multi-service checklist, 500-word description limit, client confirmation, and same-origin `POST /api/quote` submission                                                                                                                                                                                                                                                                                                                                                     |
| `ServicesDetail.astro`   | `fit`, `processTitle`, `processLabel`, `process`, `faqTitle`, `faqs`                          | "Good fit / not a fit" lists, numbered process, and a FAQ list                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `LegalSection.astro`     | `index`, `title`                                                                              | Numbered section of the privacy page (slot for copy)                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `NotFound.astro`         | `title`, `text`, `homeHref`, `homeLabel`                                                      | 404 body: large numeral, message, home `Button`                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `CaseStudy.astro`        | `project`, `lang`, `dateLabel`                                                                | Full case-study page body: `PageIntro` (h1), cover, `Metric`s, `CaseToc`, `CaseSection`s (decisions rendered as `Disclosure`s), project actions, and a closing `ContactBand`                                                                                                                                                                                                                                                                                                                                    |
| `CaseToc.astro`          | `items` (`{ id, n, label }`), `label`                                                         | In-page table of contents (`<nav aria-label>`) linking to the `cs-*` section ids                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `CaseSection.astro`      | `id`, `n`, `title`, `gap`                                                                     | `<section id>` with a ruled numbered `h2` header (`--fs-h2-case`); ids used: `cs-problem`, `cs-architecture`, `cs-design`, `cs-decisions`, `cs-results`, `cs-learnings`, `cs-roadmap`                                                                                                                                                                                                                                                                                                                           |

Home section ids: `hero`, `projects`, `stack`, `about`, `contact`.

## Data

### `projects.ts`

Path: `src/data/projects.ts`. Exports the `projects: Project[]` array plus the `Project`, `ProjectEn`, and `ProjectLink` interfaces.

`Project` key fields:

- `title`, `slug`, `tag`, `tagColor` (`green` / `blue` / `orange` / `gray`), `stack: string[]`
- Optional cover image: `image`, `imageAlt`, `imageWidth`, `imageHeight`
- `filters?: string[]` (any of `full-stack`, `ai`, `pwa`, `landing`, `design`, `security`) used by `ProjectFilters`
- `problem`, `solution`, and optional case-study content: `architecture`, `decisions`, `results`, `learnings`, `painPoints`, `modules`, `chainSteps`, `chainStepsTitle`, `chains` (several `{ title, steps }` cascades; takes precedence over `chainSteps`), `design` (string list), `roadmap` (`{ now, next, later, out? }`), `metrics`
- `links: ProjectLink[]` (`{ href, text, ariaLabel, event? }`; `event` becomes `data-umami-event`)
- `designLink?: ProjectLink` is rendered only in the internal case study; it is not included in project cards or rows
- `caseStudy?: boolean` (true means the slug gets its own `/proyectos/<slug>` + `/en/projects/<slug>` case-study page)
- `linkedCaseStudy?: string` (points at an existing case-study slug instead of generating a new page; available on the type, currently unused)
- `metaDescription?` (case-study meta description)
- `schemaType?: "SoftwareApplication" | "WebSite" | "CreativeWork"` (drives the case-study JSON-LD)
- `en?: ProjectEn` (English overrides: `imageAlt`, `tag`, `problem`, `solution`, `links`, `designLink`, plus the optional case-study fields). `projectView()` (below) and the case-study pages read `p.en?.<field> ?? p.<field>` when `isEn`.

Current projects (in array order): **TerraCore PWA** (`terracore`, SoftwareApplication), **TerraCore Landing** (`terracore-landing`, WebSite), **OKroot PWA** (`okroot`, SoftwareApplication), **OKroot Landing** (`okroot-landing`, WebSite), **NullBreach** (`nullbreach`, SoftwareApplication), **Lúmina W** (`lumina-w`, WebSite), **Blog Lúmina W** (`blog-lumina-w`, WebSite), **wavival.dev** (`wavival-dev`, WebSite), **Forgotten Portal** (`forgotten-portal`, CreativeWork). Featured set on the home (`FeaturedProjects`): `terracore`, `okroot`, `nullbreach`.

### `projectView.ts`

Path: `src/data/projectView.ts`. `projectView(project, lang, base)` returns a localized, presentation-ready `ProjectView` (`slug`, `title`, `tag`, `tone`, `overline`, `image`, `problem`, `solution`, `summary`, `stack`, `filters`, `caseHref`, `actions`). Content is untouched; it only picks ES/EN fields, builds the case-study href with `siteRoutes`, and orders `actions` (case study first, then the site link, then the rest) as `{ href, text, ariaLabel, external, event? }`. Consumed by `FeaturedProjects`, `ProjectsIndex`, `ProjectRow`, `ProjectCard`, and `ProjectActions`.

### `stack.ts`

Path: `src/data/stack.ts`. Exports the `stack: StackCategory[]` array and the `StackCategory` interface (`category`, `description`, `descriptionEn?`, `tools: string[]`, plus `why?` / `whyEn?` rationale used by the uses/herramientas page).

Six categories: **Backend**, **Frontend**, **Design & UX**, **Product Engineering**, **Security**, **AI Integrations**.

### `github.ts`

Path: `src/data/github.ts`. Build-time only. `fetchGithubProfile()` fetches the public GitHub profile + non-fork repos in Astro frontmatter on `/herramientas` + `/en/uses` (the `#repos` section). Unauthenticated (no token; GitHub's ~60 req/h per IP) and fails soft: any error or rate-limit returns nulls, so the build never breaks and the widget just does not render that build. No client JS, no CSP change (the fetch runs server-side at build). `curateRepos()` splits the repos into a flagship spotlight (`FEATURED_REPOS`: the single `nullbreach` repository) and a learning-resources grid, hiding `HIDDEN_REPOS` (`wavival`, `wavival.dev`, `prueba-tecnica-logika`). Both tiers render through `RepoCard.astro` (organisms). Exports the `GithubRepo` type.

## Pages

Spanish lives at the root with Spanish slugs; English mirrors it under `/en/` with English slugs. The ES↔EN slug mapping is the single source of truth in `src/i18n/utils.ts` (`EN_PAGE_MAP` / `ES_PAGE_MAP` + the `/proyectos/<slug>` ↔ `/en/projects/<slug>` special case in `getAltLangUrl`).

| Spanish route       | English route         | File(s)                                               |
| ------------------- | --------------------- | ----------------------------------------------------- |
| `/`                 | `/en`                 | `index.astro` / `en/index.astro`                      |
| `/proyectos`        | `/en/projects`        | `proyectos/index.astro` / `en/projects/index.astro`   |
| `/proyectos/[slug]` | `/en/projects/[slug]` | `proyectos/[slug].astro` / `en/projects/[slug].astro` |
| `/servicios`        | `/en/services`        | `servicios.astro` / `en/services/index.astro`         |
| `/cotizar`          | `/en/quote`           | `cotizar.astro` / `en/quote/index.astro`              |
| `/sobre-mi`         | `/en/about`           | `sobre-mi.astro` / `en/about/index.astro`             |
| `/contacto`         | `/en/contact`         | `contacto.astro` / `en/contact/index.astro`           |
| `/herramientas`     | `/en/uses`            | `herramientas.astro` / `en/uses/index.astro`          |
| `/privacidad`       | `/en/privacy`         | `privacidad.astro` / `en/privacy/index.astro`         |
| `/404`              | `/en/404`             | `404.astro` / `en/404.astro`                          |

### Home (`index.astro`, `en/index.astro`)

Single-page assembly. Both pass `alternates` (es / en / x-default) to `Layout`; the EN page also passes `title`, `description`, and `lang="en"`. Composition:

```
<Layout alternates={...} preloadHero [title description lang="en"]>
  <Hero [lang] />
  <FeaturedProjects [lang] />
  <StackSection [lang] />
  <AboutSection [lang] />
  <ContactBand [lang] />
</Layout>
```

`FeaturedProjects` renders the three featured projects plus a link to the full index.

### `proyectos/[slug].astro`, `en/projects/[slug].astro`

Dynamic case-study pages generated from the `projects` array (one per `caseStudy: true` slug). Render `CaseStudy` (problem, architecture, design, decisions, results, learnings, roadmap under ids `cs-*`, plus metrics and a closing `ContactBand`), and emit per-page JSON-LD (`SoftwareApplication` / `WebSite` / `CreativeWork` per `project.schemaType`, plus `BreadcrumbList`).

### Other standalone pages

Each opens with `PageIntro` (the single `h1`):

- `proyectos` / `en/projects`: `ProjectsIndex` (filters + cards)
- `servicios` / `en/services`: `ServiceRow`s link to the localized quote page, followed by `ServicesDetail` + `ContactBand` (Service + FAQPage JSON-LD)
- `cotizar` / `en/quote`: `PageIntro` + `QuoteForm`; the selected service travels in the `service` query parameter and submission reaches `api/quote.ts`
- `sobre-mi` / `en/about`: bio sections with `SectionHeader`, `PullQuote`, closing `ContactBand` (hero photo preloaded)
- `contacto` / `en/contact`: contact channels with `SectionHeader` (ContactPage JSON-LD)
- `herramientas` / `en/uses`: stack breakdown with the `why` rationale (`ChipList`), plus a `#repos` GitHub widget rendered from the build-time `github.ts` fetch via `RepoCard`
- `privacidad` / `en/privacy`: `LegalSection`s

### 404 (`404.astro`, `en/404.astro`)

Rendered inside `<Layout noindex={true}>` (EN also passes `lang="en"`). `NotFound`: large numeral, message, and a `Button` back home.

## Client scripts

### `src/scripts/nav.ts`

Mobile menu controller with full focus management. Wires:

- `#menu-btn` click → toggles the full-screen `#mobile-menu` overlay (opacity/translate classes) + `#icon-open` / `#icon-close` swap + `aria-expanded` + a state-aware localized `aria-label` (read from `data-label-open` / `data-label-close` on the button)
- The menu carries `inert` while closed (set in markup + JS, so closed links are never tabbable, also correct without JS); opening moves focus to the first link, Tab/Shift+Tab are trapped within the open menu
- Any `<a>` inside `#mobile-menu` → close
- `document` `keydown` `Escape` → close (only when open) and restore focus to `#menu-btn`
- Document-level handlers bind once and re-query the DOM, so they survive View Transitions navigations

### `src/scripts/theme.ts`

Theme controller for **post-paint** state. The initial `.dark` class (dark by default) is already applied by the pre-paint `is:inline` script in `Layout.astro` `<head>` (see Layout); `theme.ts` syncs the sun/moon icons (`#sun-desktop` / `#moon-desktop` / `#sun-mobile` / `#moon-mobile`) and a state-aware `aria-label` to that initial state, keeps the single `theme-color` meta in sync (`#0f1117` dark, the default / `#f0f4ff` light), and wires the toggle buttons. On click it flips `.dark` on `<html>`, persists the new value to `localStorage["theme"]`, and re-syncs icons + meta. It re-binds on `astro:page-load` (the toggle buttons are new DOM nodes after each View Transitions swap).

### Navigation loader

The pre-router inline script in `Layout.astro` activates `#navigation-loader` immediately in the capture phase of an internal-link click, with Astro's preparation event as fallback, and keeps it visible for at least one second after that start. It is declared before `ClientRouter` so it always runs first. The persistent overlay contains only the decorative W logo and never receives focus.

### `src/scripts/vitals.ts`

Core Web Vitals RUM. Imported from `Layout.astro` only when both Umami env vars are set; reports LCP/INP/CLS/FCP/TTFB to Umami as `web-vitals` custom events. No-op otherwise.

`nav.ts` and `theme.ts` are imported once from `organisms/NavBar.astro`:

```astro
<script>
  import "@/scripts/nav.ts";
  import "@/scripts/theme.ts";
</script>
```

> `src/scripts/vitals.ts` is imported separately from `Layout.astro` and gated behind the Umami env vars (see [vitals.ts](#srcscriptsvitalsts)). The pre-paint theme script and navigation loader are inline in `Layout.astro`; the loader runs before `ClientRouter`. `Disclosure.astro` keeps native `<details>` semantics and uses a bundled component script only to animate its content. The project filter script lives in `ProjectFilters.astro`.
