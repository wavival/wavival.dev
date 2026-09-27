# COMPONENTS.md: Component Reference

Inventory of every Astro component in `src/components/`, the base layout, the page routes, and the client scripts. Props, behavior, and where each one lives in the page composition. The site is bilingual: Spanish (default) at the root, English mirrored under `/en/`. Section, NavBar, and Footer components take a `lang` prop and pick routes/strings with an `isEn` ternary, so nothing is hardcoded to one locale.

Related: [README.md](./README.md) · [DESIGN.md](./DESIGN.md) · [CLAUDE.md](./CLAUDE.md)

## Table of contents

- [Layout](#layout)
- [UI primitives](#ui-primitives)
  - [Button.astro](#buttonastro)
  - [Link.astro](#linkastro)
  - [NavBar.astro](#navbarastro)
  - [Footer.astro](#footerastro)
  - [RepoCard.astro](#repocardastro)
- [Sections](#sections)
  - [Hero.astro](#heroastro)
  - [Projects.astro](#projectsastro)
  - [Stack.astro](#stackastro)
  - [About.astro](#aboutastro)
  - [Contact.astro](#contactastro)
- [Data](#data)
  - [projects.ts](#projectsts)
  - [stack.ts](#stackts)
- [Pages](#pages)
- [Client scripts](#client-scripts)

## Layout

### `Layout.astro`

Path: `src/layouts/Layout.astro`. Wraps every page. Owns the full `<head>` (including the `<ClientRouter />` for View Transitions), skip link, NavBar, Footer.

| Prop          | Type                                   | Default                                                                                                                                                                                                                                        |
| ------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`                               | `"Valentina Ramírez \| Full Stack Developer Django + React"`                                                                                                                                                                                   |
| `description` | `string`                               | `"Full Stack Developer especializada en Django y React. Construyo productos completos..."`                                                                                                                                                     |
| `image`       | `string`                               | `"/images/profile.webp"` (used for the JSON-LD Person `image`)                                                                                                                                                                                 |
| `ogImage`     | `string`                               | unset (falls back to `/images/og-card.webp` for OG + Twitter cards)                                                                                                                                                                            |
| `noindex`     | `boolean`                              | `false`                                                                                                                                                                                                                                        |
| `lang`        | `string`                               | Derived internally from the URL via `getLangFromUrl(Astro.url)` (drives `<html lang>`, `og:locale`, JSON-LD `inLanguage`, translations). The prop is retained for back-compat but ignored, so `<html lang>` always matches the rendered locale |
| `alternates`  | `{ hreflang: string; href: string }[]` | `[]` (emitted as `<link rel="alternate" hreflang>` tags)                                                                                                                                                                                       |

`lang` derives `ogLocale` (`en_US` / `es_CO`), the `socialCardAlt` text, the translator (`useTranslations`), and the home-only `ProfilePage` `inLanguage` (`en-US` / `es-CO`).

What it injects in `<head>` (in order):

- `<ClientRouter />` (Astro View Transitions): same-origin navigations swap without a full reload; DOM-binding scripts re-run on `astro:page-load`.
- **Pre-paint theme script** (`is:inline`, synchronous): first script in `<head>`. Reads `localStorage["theme"]` (falls back to `prefers-color-scheme`), adds `.dark` to `<html>` before stylesheets load, and sets the `theme-color` meta to match. Re-applies on `astro:after-swap`. Prevents FOUC.
- Title, description, author (`Valentina Ramírez`)
- Robots meta: `noindex, nofollow` when `noindex` is true, otherwise `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`
- Canonical URL from `Astro.url.pathname` against `https://www.wavival.dev`
- `<link rel="alternate" hreflang>` for each entry in `alternates`
- OpenGraph: `og:type`, `og:url`, `og:title`, `og:description`, `og:image` (1200x630; `og:image:type` derived from the file extension, `image/webp` for the default `og-card.webp`; alt, locale `ogLocale` + `og:locale:alternate` for the other locale), `og:site_name`
- Twitter Card (`summary_large_image`, title, description, image, image alt)
- Favicons / icons: `favicon.ico`, `icon-192.png`, `apple-touch-icon.png`, `site.webmanifest`
- A single `theme-color` meta (`#f0f4ff` light / `#0f1117` dark), kept in sync with the class-based theme by JS (not a media-conditional pair)
- Self-hosted font preloads (`<link rel="preload" as="font">` for the critical weights Poppins 400 + Raleway variable) and `<link rel="preload" as="image">` for the hero portrait (LCP optimization, gated by `preloadHero`)
- Fonts (Poppins + Raleway): self-hosted latin-subset `woff2` in `public/fonts/` (Poppins 400/500/600 static + Raleway variable `wght` 600-800), declared via `@font-face` (`font-display: swap`) in `global.css`. No Google Fonts request or `preconnect`
- **Umami analytics**: emitted **only when both `PUBLIC_UMAMI_SRC` and `PUBLIC_UMAMI_ID` are set** (`is:inline defer`). Cookieless. No Google Analytics.
- **Core Web Vitals RUM**: `src/scripts/vitals.ts` (imported under the same Umami env gate) reports LCP/INP/CLS/FCP/TTFB to Umami as `web-vitals` custom events.
- Scroll-reveal script (inline): a custom IntersectionObserver that adds `.aos-in` to each `[data-aos]` element as it enters, then `unobserve`s it; under `prefers-reduced-motion` (or no IntersectionObserver support) every element is revealed immediately. No JS animation library.
- JSON-LD `@graph` (`is:inline`, `application/ld+json`): `Person`, `Organization`, and `WebSite` on every page, plus a `ProfilePage` appended only on the home pages (`isHome`):
  - `Person` (`#person`): `knowsAbout`, `knowsLanguage`, `nationality`, `alumniOf` (SENA, Universidad de San Buenaventura, Platzi), `worksFor` referencing the Organization by `@id`, `sameAs` identity profiles
  - `Organization` (`#organization`): Lúmina W, `founder` referencing the Person by `@id`, `sameAs`
  - `WebSite` (`#website`): fixed `name`, `author` referencing the Person; omits `inLanguage` (shared `@id` must not mutate per locale)
  - `ProfilePage` (`#profilepage`, home only): per-locale `inLanguage`, `mainEntity` → `#person`, `isPartOf` → `#website`, build-date `dateModified`

Per-page JSON-LD (Breadcrumb, Service, FAQPage, ContactPage, and the case-study `SoftwareApplication` / `WebSite` / `CreativeWork`) is emitted by the individual pages, not by `Layout`.

Body contents (in order):

- Skip link → `#main-content` (visible only on focus; label from `common.skip`)
- `<NavBar lang={lang} />`
- `<main id="main-content" class="pt-16">` with the page `<slot />`
- `<Footer lang={lang} />`

## UI primitives

### `Button.astro`

Path: `src/components/ui/Button.astro`. Renders an `<a>` if `href` is provided, otherwise a `<button>`. Always applies `.btn-primary`.

| Prop         | Type                              | Default    | Notes                                                                      |
| ------------ | --------------------------------- | ---------- | -------------------------------------------------------------------------- |
| `id`         | `string`                          | -          |                                                                            |
| `href`       | `string`                          | -          | Presence determines `<a>` vs `<button>`                                    |
| `target`     | `"_blank" \| "_self"`             | `"_self"`  | `_blank` auto-applies `rel="noopener noreferrer"` (only on the `<a>` form) |
| `type`       | `"button" \| "submit" \| "reset"` | `"button"` | Only relevant when rendered as `<button>`                                  |
| `class`      | `string`                          | `""`       | Appended to `.btn-primary`                                                 |
| `icon`       | `string`                          | -          | SVG filename in `public/icons/ui/` (no extension)                          |
| `download`   | `string`                          | -          | Forwarded to `<a download>`                                                |
| `aria-label` | `string`                          | -          |                                                                            |

Icon `<img>` is locked to `width="20" height="20"` and `alt=""`.

### `Link.astro`

Path: `src/components/ui/Link.astro`. Text link with optional icon. Applies `.link`.

| Prop         | Type                  | Default   | Notes                                             |
| ------------ | --------------------- | --------- | ------------------------------------------------- |
| `href`       | `string`              | required  |                                                   |
| `target`     | `"_blank" \| "_self"` | `"_self"` | `_blank` auto-applies `rel="noopener noreferrer"` |
| `class`      | `string`              | `""`      | Appended to `.link`                               |
| `icon`       | `string`              | -         | SVG filename in `public/icons/ui/` (no extension) |
| `aria-label` | `string`              | -         |                                                   |

Icon `<img>` is locked to `width="24" height="24"` and `alt=""`.

### `NavBar.astro`

Path: `src/components/ui/NavBar.astro`. Fixed header with backdrop blur. Takes an optional `lang` prop (falls back to `getLangFromUrl(Astro.url)`). All hrefs and labels resolve per-locale: desktop links use `isEn ? "/en/..." : "/<es-slug>"`, strings come from `useTranslations(lang)`.

Composition:

- Logo link → `homeHref(lang)` (`logo-w.webp`, 72x40)
- Desktop nav (`md:` and up): `<ul role="list">` with the `desktopLinks` (Projects, Services, Stack, About), a `Contáctame` / `Get in touch` `Button` (`mailto:wavival.dev@luminaw.co`), a **language toggle** link, and the desktop theme toggle
- Mobile bar: `Contáctame` / `Get in touch` `Button`, language toggle, mobile theme toggle, hamburger
- Mobile slide-down nav (`#mobile-menu`): Home + the `desktopLinks` (Projects, Services, Stack, About) + Contact, then a `Blog W` `Button` (`https://blog.luminaw.co`)

`desktopLinks` (label keys: `nav.projects`, `nav.services`, `nav.stack`, `nav.about`):

- Projects → `/en/projects` or `/proyectos`
- Services → `/en/services` or `/servicios`
- Stack → `${home}#stack` (anchor on the home page)
- About → `/en/about` or `/sobre-mi`

Language toggle: an `<a href={alt.href} hreflang={alt.lang}>` where `alt` comes from `getAltLangUrl(Astro.url)`. Shows a `translate.svg` icon plus the label `nav.toggleLabel` (`EN` on Spanish pages, `ES` on English pages). Present in both the desktop and mobile bars.

Interactive behaviors (wired by `src/scripts/nav.ts` and `src/scripts/theme.ts`, imported at the bottom of the file):

- `#menu-btn` toggles `#mobile-menu` opacity/translate + swaps `#icon-open` / `#icon-close`
- Clicking any `<a>` inside `#mobile-menu` closes the menu
- Escape key closes the menu (only when open)
- `#theme-toggle-desktop` and `#theme-toggle-mobile` flip `.dark` on `<html>` + persist `localStorage["theme"]` and sync the sun/moon icons

ARIA:

- `aria-label` (from `nav.mainAria` / `nav.mobileAria`) on the `<nav>` elements
- `aria-label` on every Link / Button (from i18n keys)
- `aria-expanded` and `aria-controls="mobile-menu"` on `#menu-btn`; `aria-label` updates between open/close (in `nav.ts`)
- Theme toggles and hamburger have `focus-visible:ring-2 focus-visible:ring-[var(--accent-link)]`

### `Footer.astro`

Path: `src/components/ui/Footer.astro`. Takes an optional `lang` prop (falls back to `getLangFromUrl(Astro.url)`). Strings from `useTranslations(lang)`; per-locale routes via `isEn` ternary.

- **Left:** logo (→ `homeHref(lang)`) + tagline (`footer.tagline`) + social icon Links: LinkedIn, GitHub, Instagram
- **Middle (`footer.navHeading` = Navegación / Navigation):** Projects, Services, Stack (`${home}#stack`), About, Contact
- **Right (`footer.resourcesHeading` = Recursos / Resources):** Repositories (`github.com/wavival?tab=repositories`), Uses (`/en/uses` or `/herramientas`), Blog W (`blog.luminaw.co`), Privacy (`/en/privacy` or `/privacidad`)
- **Bottom CTA strip:** a centered paragraph (`footer.cta`) plus a `Link` to `https://luminaw.co` labeled `footer.discover` (Descubre Lúmina W / Discover Lúmina W)
- **Copyright line:** `© {year} Valentina Ramírez`

Year is rendered with `new Date().getFullYear()` at build time.

### `RepoCard.astro`

Path: `src/components/ui/RepoCard.astro`. GitHub repo card used in the `#repos` section of `/herramientas` + `/en/uses`, for both the featured spotlight and the resources grid. Data comes from the build-time fetch in `src/data/github.ts` (see [Data](#data)).

| Prop      | Type                       | Default      | Notes                                                                                                                                                        |
| --------- | -------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `repo`    | `GithubRepo`               | required     | A single repo (name, description, language, stars, url)                                                                                                      |
| `lang`    | `"es" \| "en"`             | `"es"`       | Localizes the star label (`estrella(s)` / `star(s)`)                                                                                                         |
| `variant` | `"featured" \| "resource"` | `"featured"` | `featured` uses `.card` (display-font name); `resource` is a thin-border card that lifts + highlights its border to `--brand-blue` on hover (monospace name) |

- Shows name (a plain `<span>`, never `<strong>`), description, a language label with a small `--brand-blue` dot, and star count as localized text, never a `★` glyph (no-decorative-icon rule).
- The card `<a>` carries no `aria-label`: its accessible name is computed from the visible content, so screen readers announce the description/language/stars too (info parity).
- Tokens only, no `<style>` block. Keeps ES/EN and featured/resource DRY.

## Sections

All sections render inside `.section` and carry a `data-aos` attribute for entry reveal (driven by the custom IntersectionObserver in `Layout.astro` + CSS in `global.css`, not the AOS library). Each accepts a `lang` prop (`"es" | "en"`, default `"es"`) and switches copy/routes on `isEn`. Section anchors (`#hero`, `#projects`, `#stack`, `#about`, `#contact`) are stable across locales.

### `Hero.astro`

Path: `src/components/sections/Hero.astro`. `id="hero"`. `min-h-[calc(100dvh-64px)]`.

| Prop   | Type           | Default | Notes                |
| ------ | -------------- | ------- | -------------------- |
| `lang` | `"es" \| "en"` | `"es"`  | Switches copy/routes |

- Profile image (`fetchpriority="high"`, `decoding="async"`, 320x320, circular, brand-blue border)
- Single `<h1>` headline with a brand-blue accent line
- Body copy + a small `font-display` line ("3 apps en producción · Fundadora de Lúmina W")
- CV download `Button` (`href={cvHref(lang, base)}`, `download` = the per-locale filename), tracked via a `data-umami-event` attribute (`cv-descarga-es` / `cv-descarga-en`, Umami's zero-JS automatic capture), not a `window.umami.track()` call.
- A "See services" / "Ver servicios" `Link` → `/en/services` or `/servicios`
- Social icon Links: LinkedIn and GitHub only (no Blog icon)

### `Projects.astro`

Path: `src/components/sections/Projects.astro`. `id="projects"`.

| Prop       | Type           | Default | Notes                                                           |
| ---------- | -------------- | ------- | --------------------------------------------------------------- |
| `featured` | `boolean`      | `false` | When true, renders only the featured slugs and a "See all" link |
| `lang`     | `"es" \| "en"` | `"es"`  | Switches copy/routes; reads `p.en` overrides                    |
| `heading`  | `"h1" \| "h2"` | `"h2"`  | Tag for the section title (`h1` on the projects index page)     |

Data comes from the local `projects` array in `src/data/projects.ts` (see [Data](#data)). When `featured`, the list is filtered to `["terracore", "okroot", "nullbreach"]`; otherwise it renders every project.

Each project renders inside a `.card` with:

- Optional cover image (lazy, with a hover zoom)
- Optional overline (`Proyecto destacado` / `Featured project` for terracore, `IA · Seguridad` / `AI · Security` for nullbreach)
- Title (`h3`) + status tag (color from the `tagStyles` map: `green` / `blue` / `orange` / `gray`)
- A two-column "El reto / Lo que construí" ("The challenge / What I built") block
- Stack chips
- Footer Links: a **case-study** Link (when the project has a case study) plus the project's own `links` ("Ver sitio" / "Visit site", "Ver repositorio" / "View repo", "Ver writeup", etc.). The case-study target is `p.linkedCaseStudy ?? (p.caseStudy ? p.slug : null)` and resolves to `/en/projects/{slug}` or `/proyectos/{slug}`.

**Filter UI** (only when not `featured`): a `#project-filters` button group with keys `all`, `full-stack`, `ia`, `pwa`, `landing`, `diseno` (labels localized). The inline `<script>` (`initProjectFilters`, also re-run on `astro:page-load`) toggles `[data-active]` / `aria-pressed`, matches each card's `data-filters`, animates non-matches out, and shows the `#projects-no-results` block when nothing matches.

When `featured`, a centered "See all projects" / "Ver todos los proyectos" `Link` is appended → `/en/projects` or `/proyectos`.

To edit a project, modify the `projects` array. No external CMS.

### `Stack.astro`

Path: `src/components/sections/Stack.astro`. `id="stack"`.

| Prop   | Type           | Default | Notes                |
| ------ | -------------- | ------- | -------------------- |
| `lang` | `"es" \| "en"` | `"es"`  | Switches copy/routes |

Grid of `.card-plain` items from the local `stack` array (see [Data](#data)). Each category shows a brand-blue heading, an italic description (`descriptionEn` when `isEn`), and tool chips. Ends with a "Criterio técnico" / "Technical criteria" `Link` → `/en/uses` or `/herramientas`.

### `About.astro`

Path: `src/components/sections/About.astro`. `id="about"`.

| Prop   | Type           | Default | Notes         |
| ------ | -------------- | ------- | ------------- |
| `lang` | `"es" \| "en"` | `"es"`  | Switches copy |

Two paragraphs of bio, a brand-blue accent quote (`<blockquote>`), and a row of Links: Instagram (icon), WhatsApp (`wa.me/573116865766`, icon), Platzi (`platzi.com/p/wavival`, `link` icon), and a text "Blog W" Link (`blog.luminaw.co`).

### `Contact.astro`

Path: `src/components/sections/Contact.astro`. `id="contact"`.

| Prop               | Type           | Default | Notes                                           |
| ------------------ | -------------- | ------- | ----------------------------------------------- |
| `lang`             | `"es" \| "en"` | `"es"`  | Switches copy/routes                            |
| `showServicesLink` | `boolean`      | `true`  | Toggles the "See services" link next to the CTA |

Split CTA: a heading + paragraph on the left, and on the right a pricing line ("Proyectos desde COP 2.000.000 / USD 500..."), an availability note, a "Quiero mi producto" / "Start my project" `Button` → the contact page (`/en/contact` or `/contacto`), and (when `showServicesLink`) a "See services" / "Ver servicios" `Link` → the services page.

## Data

### `projects.ts`

Path: `src/data/projects.ts`. Exports the `projects: Project[]` array plus the `Project`, `ProjectEn`, and `ProjectLink` interfaces.

`Project` key fields:

- `title`, `slug`, `tag`, `tagColor` (`green` / `blue` / `orange` / `gray`), `stack: string[]`
- Optional cover image: `image`, `imageAlt`, `imageWidth`, `imageHeight`
- `filters?: string[]` (any of `full-stack`, `ia`, `pwa`, `landing`, `diseno`) used by the Projects filter UI
- `problem`, `solution`, and optional case-study content: `architecture`, `decisions`, `results`, `learnings`, `painPoints`, `modules`, `chainSteps`, `chainStepsTitle`, `metrics`
- `links: ProjectLink[]` (`{ href, text, ariaLabel }`)
- `caseStudy?: boolean` (true means the slug gets its own `/proyectos/<slug>` + `/en/projects/<slug>` case-study page)
- `linkedCaseStudy?: string` (points at an existing case-study slug instead of generating a new page; available on the type, currently unused)
- `metaDescription?` (case-study meta description)
- `schemaType?: "SoftwareApplication" | "WebSite" | "CreativeWork"` (drives the case-study JSON-LD)
- `en?: ProjectEn` (English overrides: `imageAlt`, `tag`, `problem`, `solution`, `links`, plus the optional case-study fields). Section/page components read `p.en?.<field> ?? p.<field>` when `isEn`.

Current projects (in array order): **TerraCore PWA** (`terracore`, SoftwareApplication), **TerraCore Landing** (`terracore-landing`, WebSite), **OKroot PWA** (`okroot`, SoftwareApplication), **OKroot Landing** (`okroot-landing`, WebSite), **NullBreach** (`nullbreach`, SoftwareApplication), **Lúmina W** (`lumina-w`, WebSite), **Blog Lúmina W** (`blog-lumina-w`, WebSite), **Forgotten Portal** (`forgotten-portal`, CreativeWork). Featured set (home + `featured` prop): `terracore`, `okroot`, `nullbreach`.

### `stack.ts`

Path: `src/data/stack.ts`. Exports the `stack: StackCategory[]` array and the `StackCategory` interface (`category`, `description`, `descriptionEn?`, `tools: string[]`, plus `why?` / `whyEn?` rationale used by the uses/herramientas page).

Six categories: **Backend**, **Frontend**, **Design & UX**, **Product Engineering**, **Security**, **AI Integrations**.

### `github.ts`

Path: `src/data/github.ts`. Build-time only. `fetchGithubProfile()` fetches the public GitHub profile + non-fork repos in Astro frontmatter on `/herramientas` + `/en/uses` (the `#repos` section). Unauthenticated (no token; GitHub's ~60 req/h per IP) and fails soft: any error or rate-limit returns nulls, so the build never breaks and the widget just does not render that build. No client JS, no CSP change (the fetch runs server-side at build). `curateRepos()` splits the repos into a flagship spotlight (`FEATURED_REPOS`: `nullbreach-api` + `nullbreach-web`) and a learning-resources grid, hiding `HIDDEN_REPOS` (`wavival`, `wavival.dev`, `prueba-tecnica-logika`). Both tiers render through `RepoCard.astro`. Exports the `GithubRepo` type.

## Pages

Spanish lives at the root with Spanish slugs; English mirrors it under `/en/` with English slugs. The ES↔EN slug mapping is the single source of truth in `src/i18n/utils.ts` (`EN_PAGE_MAP` / `ES_PAGE_MAP` + the `/proyectos/<slug>` ↔ `/en/projects/<slug>` special case in `getAltLangUrl`).

| Spanish route       | English route         | File(s)                                               |
| ------------------- | --------------------- | ----------------------------------------------------- |
| `/`                 | `/en`                 | `index.astro` / `en/index.astro`                      |
| `/proyectos`        | `/en/projects`        | `proyectos/index.astro` / `en/projects/index.astro`   |
| `/proyectos/[slug]` | `/en/projects/[slug]` | `proyectos/[slug].astro` / `en/projects/[slug].astro` |
| `/servicios`        | `/en/services`        | `servicios.astro` / `en/services/index.astro`         |
| `/sobre-mi`         | `/en/about`           | `sobre-mi.astro` / `en/about/index.astro`             |
| `/contacto`         | `/en/contact`         | `contacto.astro` / `en/contact/index.astro`           |
| `/herramientas`     | `/en/uses`            | `herramientas.astro` / `en/uses/index.astro`          |
| `/privacidad`       | `/en/privacy`         | `privacidad.astro` / `en/privacy/index.astro`         |
| `/404`              | `/en/404`             | `404.astro` / `en/404.astro`                          |

### Home (`index.astro`, `en/index.astro`)

Single-page assembly. Both pass `alternates` (es / en / x-default) to `Layout`; the EN page also passes `title`, `description`, and `lang="en"`. Composition:

```
<Layout alternates={...} [title description lang="en"]>
  <Hero [lang] />
  <Projects featured [lang] />
  <Stack [lang] />
  <About [lang] />
  <Contact [lang] />
</Layout>
```

`Projects featured` renders the three featured projects plus a "See all projects" link.

### `proyectos/[slug].astro`, `en/projects/[slug].astro`

Dynamic case-study pages generated from the `projects` array (one per `caseStudy: true` slug). Render the architecture, decisions, modules, metrics, results, and learnings for the project, and emit per-page JSON-LD (`SoftwareApplication` / `WebSite` / `CreativeWork` per `project.schemaType`, plus `BreadcrumbList`).

### Other standalone pages

`proyectos` / `en/projects` (full project index, uses `<Projects heading="h1" />`), `servicios` / `en/services` (Service + FAQPage JSON-LD), `sobre-mi` / `en/about`, `contacto` / `en/contact` (ContactPage JSON-LD), `herramientas` / `en/uses` (stack breakdown with the `why` rationale, plus a `#repos` GitHub widget rendered from the build-time `github.ts` fetch via `RepoCard.astro`), `privacidad` / `en/privacy`.

### 404 (`404.astro`, `en/404.astro`)

Rendered inside `<Layout noindex={true}>` (EN also passes `lang="en"`). Centered 404 numeral, message, and a `Link` back home.

## Client scripts

### `src/scripts/nav.ts`

Mobile menu controller with full focus management. Wires:

- `#menu-btn` click → toggles `#mobile-menu` visibility (opacity/translate classes) + `#icon-open` / `#icon-close` swap + `aria-expanded` + a state-aware localized `aria-label` (read from `data-label-open` / `data-label-close` on the button)
- The menu carries `inert` while closed (set in markup + JS, so closed links are never tabbable, also correct without JS); opening moves focus to the first link, Tab/Shift+Tab are trapped within the open menu
- Any `<a>` inside `#mobile-menu` → close
- `document` `keydown` `Escape` → close (only when open) and restore focus to `#menu-btn`
- Document-level handlers bind once and re-query the DOM, so they survive View Transitions navigations

### `src/scripts/theme.ts`

Theme controller for **post-paint** state. The initial `.dark` class is already applied by the pre-paint `is:inline` script in `Layout.astro` `<head>` (see Layout); `theme.ts` syncs the sun/moon icons (`#sun-desktop` / `#moon-desktop` / `#sun-mobile` / `#moon-mobile`) and a state-aware `aria-label` to that initial state, keeps the single `theme-color` meta in sync (`#f0f4ff` light / `#0f1117` dark), and wires the toggle buttons. On click it flips `.dark` on `<html>`, persists the new value to `localStorage["theme"]`, and re-syncs icons + meta. It re-binds on `astro:page-load` (the toggle buttons are new DOM nodes after each View Transitions swap).

### `src/scripts/vitals.ts`

Core Web Vitals RUM. Imported from `Layout.astro` only when both Umami env vars are set; reports LCP/INP/CLS/FCP/TTFB to Umami as `web-vitals` custom events. No-op otherwise.

Both scripts are imported once from `NavBar.astro`:

```astro
<script>
  import "@/scripts/nav.ts";
  import "@/scripts/theme.ts";
</script>
```

> `src/scripts/vitals.ts` is imported separately from `Layout.astro`, gated behind the Umami env vars (see [vitals.ts](#srcscriptsvitalsts)). The scroll-reveal and pre-paint theme scripts are inlined in `Layout.astro`, not in `src/scripts/`.
