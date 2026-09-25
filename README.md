<h1 align="left">
  <img src="assets/logo-w.png" width="48px" valign="middle">
  Valentina Ramírez • Portfolio
</h1>

![Banner principal](assets/mockup.png)

[![Portfolio](https://img.shields.io/badge/Portfolio-wavival.dev-407bff?style=for-the-badge&logo=vercel&logoColor=white)](https://wavival.dev)
[![Blog](https://img.shields.io/badge/Blog-blog.luminaw.co-407bff?style=for-the-badge&logo=hashnode&logoColor=white)](https://blog.luminaw.co/)
[![Lúmina W](https://img.shields.io/badge/Lúmina%20W-luminaw.co-407bff?style=for-the-badge&logo=google-chrome&logoColor=white)](https://luminaw.co/)
[![CI](https://github.com/wavival/wavival.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/wavival/wavival.dev/actions/workflows/ci.yml)

> Portfolio of **Valentina Ramírez**, Full Stack Developer (Django · React), Founder of [Lúmina W](https://luminaw.co). Third iteration of the site, built with Astro 7 and Tailwind 3. Static-rendered, bilingual (ES default, EN), dark-mode aware, SEO + A11Y + performance first. Deployed on Vercel as the default application for `wavival.dev`.

## Table of contents

- [Stack](#stack)
- [Local setup](#local-setup)
  - [npm scripts](#npm-scripts)
- [Environment variables](#environment-variables)
- [Project conventions](#project-conventions)
- [Delivery flow](#delivery-flow)
- [Architecture](#architecture)
  - [Routing and i18n](#routing-and-i18n)
  - [File structure](#file-structure)
  - [Page composition](#page-composition)
  - [Design tokens](#design-tokens)
- [SEO and accessibility](#seo-and-accessibility)
- [Performance](#performance)
- [Testing and CI](#testing-and-ci)
- [Deploying to Vercel](#deploying-to-vercel)
  - [One-time setup](#one-time-setup)
  - [What's already in the repo](#whats-already-in-the-repo)
  - [Security headers and cache](#security-headers-and-cache)
  - [Redirects and proxies](#redirects-and-proxies)
- [Using as a template](#using-as-a-template)
- [Troubleshooting](#troubleshooting)
- [Roadmap / known gaps](#roadmap--known-gaps)
- [License](#license)

Related docs: [DESIGN.md](./DESIGN.md) · [COMPONENTS.md](./COMPONENTS.md) · [CLAUDE.md](./CLAUDE.md) · [AGENTS.md](./AGENTS.md)

## Stack

| Layer         | Choice                                                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Build         | Astro 7 (static output, `compressHTML`, `inlineStylesheets: 'auto'`)                                                          |
| Styling       | Tailwind CSS 3 via PostCSS (`darkMode: 'class'`) + CSS custom property tokens                                                 |
| Scripts       | TypeScript (vanilla, no client-side framework)                                                                                |
| i18n          | Bilingual: ES default at root, EN mirror under `/en/`, slug map in `src/i18n/utils.ts`                                        |
| Sitemap       | `@astrojs/sitemap` (auto-generated at build, both locales)                                                                    |
| Scroll reveal | Custom IntersectionObserver (`[data-aos]` + `.aos-in`), respects `prefers-reduced-motion`; no JS animation library            |
| Navigation    | View Transitions via Astro `<ClientRouter />` (SPA-like same-origin swaps; no full-screen loader)                             |
| Fonts         | Self-hosted latin-subset `woff2` (Poppins static + Raleway variable), `@font-face` with `font-display: swap`; no Google Fonts |
| Analytics     | Umami (cookieless), env-driven, conditionally injected                                                                        |
| Web vitals    | `web-vitals` RUM (`src/scripts/vitals.ts`): reports LCP/INP/CLS/FCP/TTFB to Umami, same env gate as analytics                 |
| GitHub widget | Build-time fetch of profile + non-fork repos (`src/data/github.ts`) on `/herramientas` + `/en/uses`; fails soft               |
| LLM SEO       | `/llms.txt` (llmstxt.org spec) for AI-assistant discovery                                                                     |
| Testing       | Playwright (Chromium desktop + mobile) + pure-unit specs                                                                      |
| Perf budget   | Lighthouse CI (`@lhci/cli`, `lighthouserc.json`)                                                                              |
| Link check    | linkinator (crawls built `dist/` for broken internal links)                                                                   |
| Formatting    | Prettier + `prettier-plugin-astro`                                                                                            |
| CI            | GitHub Actions: quality gate → E2E + Lighthouse + links                                                                       |
| Hosting       | Vercel (static portfolio + path-based microfrontends + security headers + cache + redirects)                                  |

## Local setup

```bash
git clone git@github.com:wavival/wavival.dev.git
cd wavival.dev
nvm use                           # Node 22 (pinned in .nvmrc)
npm install
cp .env.example .env              # optional: Umami vars (all optional)
npm run dev                       # http://localhost:4321
```

**Requires:** Node `22.x` (declared in `package.json` engines; pinned in `.nvmrc` → `22`; all CI jobs read it via `node-version-file`).

### npm scripts

| Script                 | What it does                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run dev`          | Astro dev server with HMR at `localhost:4321`                                                   |
| `npm run build`        | `astro build` → static output in `./dist/`                                                      |
| `npm run preview`      | Serve the production build locally                                                              |
| `npm run check`        | `astro check` (type / diagnostic check, run in CI)                                              |
| `npm run format`       | Prettier write across the repo                                                                  |
| `npm run format:check` | Prettier check (no writes), used in CI                                                          |
| `npm test`             | Playwright E2E (boots `preview` on port 4329)                                                   |
| `npm run test:ui`      | Playwright in interactive UI mode                                                               |
| `npm run test:install` | Install Playwright Chromium browser + system deps                                               |
| `npm run lhci`         | Lighthouse CI against `./dist` (build first)                                                    |
| `npm run links`        | linkinator over `./dist` for broken links (build first)                                         |
| `npm run csp:check`    | Verify every inline `dist/` script has a matching sha256 in the `vercel.json` CSP (build first) |

> `lhci` and `links` run against the built output: run `npm run build` before them locally.

## Environment variables

All client-exposed vars use the `PUBLIC_` prefix (Astro convention). They are baked into the static build at compile time; there is no runtime config. Every one is optional, and the associated script/meta tag is only emitted when its var(s) are set.

| Variable           | Required | Example                            | Notes                                                                       |
| ------------------ | -------- | ---------------------------------- | --------------------------------------------------------------------------- |
| `PUBLIC_UMAMI_SRC` | No       | `https://cloud.umami.is/script.js` | Umami script URL. Both Umami vars must be set or no `<script>` is injected. |
| `PUBLIC_UMAMI_ID`  | No       | `xxxxxxxx-uuid`                    | Umami website ID. Cookieless, no Google Analytics.                          |

Copy `.env.example` to `.env` for local development. In Vercel, set them under _Project Settings > Environment Variables_.

## Project conventions

- **No hardcoded colors.** Every color reference uses `var(--token-name)` from `src/styles/tokens.css`.
- **Utility classes for repeats.** `.section`, `.btn-primary`, `.card`, `.chip`, `.link`, etc. live in `@layer utilities` (`src/styles/utilities.css`).
- **Astro components** type props with `interface Props` in the frontmatter.
- **Locale-aware routing.** Shared section components take a `lang` prop and pick targets with the `isEn ? "/en/..." : "/<es-slug>"` ternary; never hardcode a route that ignores `lang`. The ES↔EN slug map in `src/i18n/utils.ts` is the single source of truth.
- **External links** go through `Link.astro` / `Button.astro`, which both apply `rel="noopener noreferrer"` automatically when `target="_blank"`.
- **Images:** WebP for photos, SVG for icons. Always include explicit `width` + `height` HTML attributes to prevent CLS. Decorative icons use `alt=""`.
- **Dark mode** uses the `.dark` class on `<html>`, never `@media (prefers-color-scheme)`. A blocking `is:inline` script in `Layout.astro` `<head>` applies the saved theme before first paint to avoid FOUC.
- **No client-side frameworks.** Vanilla TypeScript in `src/scripts/` is the only client code.
- **No em dashes, no emojis** anywhere in the repo (copy, code, comments, commits, docs).

Full design-token reference and utility-class catalog: see [DESIGN.md](./DESIGN.md). Component-by-component prop tables: see [COMPONENTS.md](./COMPONENTS.md).

## Delivery flow

- `main` is production, `stg` is staging, and `dev` is the integration base.
- Create human work branches from `dev` with `feature/*`, `fix/*`, or `chore/*` names.
- Open every human work PR to `dev`.
- Promotion PRs move only `dev` to `stg` and `stg` to `main`; Valentina merges promotion PRs manually.
- Required checks are `commitlint`, `quality`, `tests`, `security scan`, and `validate-pr-base`.
- Commit messages use `type(scope): message`. Allowed portfolio scopes are `api`, `ui`, `db`, `auth`, `ci`, `deploy`, `docs`, `config`, `tests`, `security`, `deps`, `core`, `seo`, and `a11y`.

See [AGENTS.md](./AGENTS.md) for the complete delivery rules for coding agents.

## Architecture

Multi-page static site with a bilingual routing scheme. The home is a single-page assembly of sections; the rest are standalone pages plus one dynamic route (`proyectos/[slug]`).

### Routing and i18n

- **Spanish (default)** lives at the root with Spanish slugs:
  `/`, `/proyectos`, `/proyectos/[slug]`, `/servicios`, `/sobre-mi`, `/contacto`, `/herramientas`, `/privacidad`, `/404`
- **English** mirrors it under `/en/` with English slugs:
  `/en`, `/en/projects`, `/en/projects/[slug]`, `/en/services`, `/en/about`, `/en/contact`, `/en/uses`, `/en/privacy`, `/en/404`
- The ES↔EN slug mapping is the single source of truth in `src/i18n/utils.ts` (`EN_PAGE_MAP`, reverse `ES_PAGE_MAP`, and the `proyectos/<slug>` ↔ `en/projects/<slug>` special-case in `getAltLangUrl`). The language toggle reads from here, so any new page or slug rename MUST update this map.
- Per-locale assets resolve through helpers in `src/i18n/utils.ts`: `cvHref(lang, base)` returns `cv_valentina_ramirez_<es|en>.pdf`. UI strings come from `src/i18n/ui.ts` via `useTranslations(lang)`.
- Legacy English-word ES routes (`/projects`, `/services`, `/about`, `/contact`, `/uses`) are permanently redirected to the Spanish slugs in `vercel.json`.
- `microfrontends.json` makes `wavival-dev` the default Vercel application. It serves `/` and every unassigned path; the separate `nullbreach` project exclusively serves `/nullbreach` and `/nullbreach/:path*`.

### File structure

```
src/
├── components/
│   ├── sections/        # Hero · Projects · Stack · About · Contact
│   └── ui/              # Button · Link · NavBar · Footer · RepoCard
├── data/                # projects.ts · stack.ts · github.ts (build-time GitHub fetch)
├── i18n/                # ui.ts (strings) · utils.ts (slug map + helpers)
├── layouts/
│   └── Layout.astro     # Full <head> · ClientRouter · pre-paint theme · skip link · NavBar · Footer
├── pages/
│   ├── index.astro      # ES home: composes all sections
│   ├── 404.astro        # ES error page (noindex)
│   ├── proyectos/       # index.astro + [slug].astro (dynamic case studies)
│   ├── servicios.astro · sobre-mi.astro · contacto.astro
│   ├── herramientas.astro · privacidad.astro
│   └── en/              # EN mirror: index, 404, projects/, services, about, contact, uses, privacy
├── scripts/
│   ├── nav.ts           # Mobile menu: inert/focus trap, Escape, focus restore
│   ├── theme.ts         # Dark/light toggle + localStorage + theme-color sync (post-paint)
│   └── vitals.ts        # Core Web Vitals RUM → Umami (only when Umami env set)
└── styles/
    ├── global.css       # Imports + body base + prefers-reduced-motion
    ├── tokens.css       # CSS custom properties (design tokens)
    └── utilities.css    # @layer utilities: custom classes
public/
├── brand/               # logo-w.webp
├── fonts/               # Self-hosted woff2: Poppins 400/500/600 + Raleway variable
├── icons/ui/            # Decorative SVG icons
├── images/              # profile.webp · og-card.webp · per-case-study OG cards · project covers
├── cv_valentina_ramirez_es.pdf · cv_valentina_ramirez_en.pdf
├── favicon.ico · apple-touch-icon.png · icon-{192,512}.png · icon-maskable-512.png
├── site.webmanifest     # Web app manifest (icons derived from brand/logo-w.webp)
├── llms.txt · llms-full.txt # llmstxt.org index + long-form companion for AI assistants
├── .well-known/security.txt # RFC 9116 security contact
└── robots.txt           # Points at /sitemap-index.xml (generated)
scripts/check-csp-hashes.mjs # Verifies inline-script sha256 hashes against the vercel.json CSP
tests/                   # Playwright E2E + pure-unit specs
lighthouserc.json        # Lighthouse CI config (staticDistDir + category assertions)
.nvmrc                   # Node version pin (22)
.github/workflows/ci.yml # commitlint, quality, tests, lighthouse, links, security scan
```

The favicon/manifest icon set in `public/` is generated from `public/brand/logo-w.webp` with `sharp` (maskable variant gets a dark `#0f1117` safe-zone background). Regenerate if the logo changes.

### Page composition

```astro
<Layout lang="es">
  <Hero lang="es" />
  <Projects lang="es" />
  <Stack lang="es" />
  <About lang="es" />
  <Contact lang="es" />
</Layout>
```

`Layout.astro` owns the entire document head (meta, OG, Twitter, JSON-LD, conditional Umami, self-hosted font preloads, scroll-reveal init, pre-paint theme script), the skip link, the `<NavBar />`, and the `<Footer />`. It derives `lang` from the URL (`getLangFromUrl`), driving `<html lang>`, `og:locale`, translations, and the home-only `ProfilePage` `inLanguage`. Pages render inside `<main id="main-content">`.

### Design tokens

`src/styles/tokens.css` defines every color, radius, shadow, and section spacing as a CSS custom property on `:root` and overrides the subset that needs to invert on `.dark`. Components reference them via `var(--token)`; no hex codes in component files.

Brand palette quick-reference:

| Token               | Hex                          | Usage                                            |
| ------------------- | ---------------------------- | ------------------------------------------------ |
| `--brand-blue`      | `#407bff`                    | Decorative only (fills, borders, large text)     |
| `--brand-blue-text` | `#1565c0` / `#5b8cff` (dark) | Accessible small blue text (subtitles, chips)    |
| `--accent-link`     | `#1565c0` / `#5b8cff` (dark) | Links, icon anchors, focus rings                 |
| `--accent-hover`    | `#0f4c91` / `#82a8ff` (dark) | Link / button hover                              |
| `--btn-bg`          | `#1565c0`                    | `.btn-primary` fill (white text, AA both themes) |
| `--bg-page`         | `#f0f4ff` / `#0f1117` (dark) | Body background                                  |
| `--text-primary`    | `#1a1a2e` / `#e8eaf6` (dark) | Headings, copy                                   |
| `--text-muted`      | `#4b5563` / `#9ca3af` (dark) | Secondary copy                                   |

Interactive blue is one value per theme (`#1565c0` light / `#5b8cff` dark) across buttons, links, icon anchors, and UI SVGs. The previous brighter accent was retired: it failed AA (3.24:1 white-on-fill).

Full token table, dark overrides, utility classes, typography, motion, and A11Y notes: **[DESIGN.md](./DESIGN.md)**.

## SEO and accessibility

`Layout.astro` ships a full baseline so every route inherits it automatically.

**SEO:**

- Meta title, description, author, robots (`max-snippet:-1`, `max-image-preview:large`)
- Canonical URL built from `Astro.url.pathname` against `https://wavival.dev`
- Reciprocal `hreflang` (es / en / x-default) on every page via the `alternates` prop; ES/EN pair point at each other, `x-default` at the Spanish slug
- OpenGraph (image with dimensions + `alt`, `og:locale` plus `og:locale:alternate`)
- Twitter Card (`summary_large_image`)
- JSON-LD `@graph`: `Person` + `Organization` (Lúmina W) + `WebSite` on every page, plus a home-only `ProfilePage`; per-page `BreadcrumbList`, `Service` + `FAQPage` (`/servicios` + `/en/services`), `ContactPage` (`/contacto` + `/en/contact`), and `SoftwareApplication` | `WebSite` | `CreativeWork` per case study
- `lang` on `<html>` driven from the URL via `getLangFromUrl` (`es` default, `en` on `/en/`)
- `/sitemap-index.xml` auto-generated by `@astrojs/sitemap` with both locales (`es-CO`, `en-US`), referenced from `/robots.txt`
- `/llms.txt` (index) + `/llms-full.txt` (long-form companion) describe the site for AI assistants per [llmstxt.org](https://llmstxt.org)
- `/.well-known/security.txt` (RFC 9116): security contact, expiry, canonical URL
- Build-time GitHub widget on `/herramientas` + `/en/uses`: `src/data/github.ts` fetches the public profile + non-fork repos in frontmatter (unauthenticated, fails soft), rendered via `RepoCard.astro`

**A11Y:**

- Skip link to `#main-content` (visible on focus)
- Heading hierarchy: one `h1` per page, `h2` per section, `h3` inside cards
- `aria-label` on every interactive element
- `aria-expanded` + `aria-controls` on the mobile menu trigger; Escape closes the menu
- `role="list"` on desktop nav `<ul>`
- Decorative `<img>` always has `alt=""`
- `focus-visible:ring-2 focus-visible:ring-[var(--accent-link)]` on icon-only buttons
- WCAG AA contrast verified for `--text-muted` over `--bg-page` in both themes

## Performance

- Pre-paint theme script (sync `is:inline` in `<head>`) applies `.dark` before first paint (zero FOUC) and re-applies on `astro:after-swap` so the theme never flashes across View Transitions.
- View Transitions (`<ClientRouter />`): same-origin navigations swap without a full reload. DOM-binding scripts (theme, mobile nav, scroll reveal) re-run on `astro:page-load`.
- Hero portrait: WebP, `fetchpriority="high"`, `decoding="async"`, explicit dimensions, plus `<link rel="preload" as="image">` in `<head>` (gated by `preloadHero`, only on home + about) to win LCP.
- Fonts: self-hosted latin-subset `woff2` in `public/fonts/` (Poppins 400/500/600 static + Raleway variable `wght` 600-800), `@font-face` with `font-display: swap`; critical weights (Poppins 400 + Raleway variable) preloaded. No Google Fonts request or `preconnect`.
- Umami analytics: cookieless, conditionally rendered (no Umami vars = no script tag = no network call). Core Web Vitals RUM (`src/scripts/vitals.ts`) is bundled and run under the same gate.
- Every icon `<img>` has explicit `width` + `height` to prevent CLS.
- Scroll reveal: IntersectionObserver reveals each `[data-aos]` element once, then `unobserve`s. Under `prefers-reduced-motion` (or no IntersectionObserver support), elements show immediately with no transition.
- Astro: `compressHTML: true`, `build.inlineStylesheets: 'auto'`: small critical CSS inlined into the document.
- Vercel serves `/_astro/*`, `/images/*`, `/brand/*`, `/icons/*`, and `/fonts/*` with `Cache-Control: public, max-age=31536000, immutable`.
- Lighthouse CI asserts category scores per commit (a11y + SEO are hard errors, perf + best-practices are warnings) against the built `dist/`.

## Testing and CI

End-to-end and unit specs live in `tests/` and run against `astro preview` on port **4329** (`reuseExistingServer: false`, so a `npm run dev` server on 4321 is never reused: a dev server emits no sitemap and uses localhost canonicals, which would fail the SEO/i18n specs).

```bash
npm run test:install       # one-time: download Chromium + system deps
npm run build              # the suite serves the static dist/, it does not build for you
npm test                   # boot preview on 4329, run full suite
npm run test:ui            # Playwright UI mode for local debugging
```

Two Playwright projects run by default: `chromium-desktop` (Desktop Chrome) and `chromium-mobile` (Pixel 5).

| Suite                 | Covers                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------- |
| `home.spec.ts`        | Single h1, canonical/OG host, JSON-LD types, hero image attrs, skip link               |
| `routes.spec.ts`      | All ES + EN routes and project case studies render (one h1 each)                       |
| `i18n.spec.ts`        | `lang` attrs, per-locale CV, hreflang, language toggle                                 |
| `i18n-utils.spec.ts`  | Pure-unit: `getAltLangUrl` and slug map in `src/i18n/utils.ts`                         |
| `redirects.spec.ts`   | Pure-unit: locks deployment redirects, the API proxy, and microfrontend path ownership |
| `theme.spec.ts`       | Pre-paint dark/light from `localStorage`; toggle flips + persists                      |
| `mobile-menu.spec.ts` | Open/close, `aria-expanded`, Escape, link-click closes menu                            |
| `not-found.spec.ts`   | `/404` renders heading and emits `noindex`                                             |
| `seo.spec.ts`         | `robots.txt` content + localized `<loc>` entries in generated sitemap                  |

CI (`.github/workflows/ci.yml`) runs on every push and PR to `dev`, `stg`, and `main`: `commitlint`, `quality` (dependency audit via `npm audit --audit-level=high --omit=dev` → format check → lint → type check via `astro check` → build → CSP hash check via `npm run csp:check`), `tests` (Playwright), `lighthouse` (Lighthouse CI), `links` (linkinator), and `security scan` (gitleaks). All jobs read the Node version from `.nvmrc`.

## Deploying to Vercel

### One-time setup

1. **Create project:** import this repository as the Vercel project named `wavival-dev`.
2. **Build settings:** use the Astro preset, `npm run build`, `dist`, and Node 22.
3. **Environment variables:** add both values to Preview and Production if Umami is enabled:
   - `PUBLIC_UMAMI_SRC` + `PUBLIC_UMAMI_ID` (both required to enable analytics)
4. **Microfrontends:** create a Vercel microfrontends group containing `wavival-dev` and `nullbreach`; select `wavival-dev` as the default application.
5. **Custom domain:** assign `wavival.dev` to `wavival-dev`.
6. **Deploy:** deploy NullBreach first, then deploy this default application so `microfrontends.json` activates the shared-domain routes.

### What's already in the repo

- `microfrontends.json`: routes `/nullbreach` and its descendants to the independent `nullbreach` Vercel project; all other paths remain on `wavival-dev`.
- `vercel.json`: security headers, immutable cache for static assets, legacy redirects, and the `/api/*` compatibility proxy.
- `astro.config.mjs`: `site: "https://wavival.dev"`, bilingual sitemap integration, HTML compression.
- `postcss.config.cjs` and `tailwind.config.mjs`: Tailwind 3 processing for Astro styles.
- `public/robots.txt`, `public/llms.txt`, `public/llms-full.txt`: `sitemap-index.xml` generated at build; AI-assistant descriptors.
- `public/.well-known/security.txt`: RFC 9116 security contact.
- `scripts/check-csp-hashes.mjs`: CI guard that keeps the CSP inline-script hashes in sync with the build.
- `.github/workflows/ci.yml`: commitlint, quality, tests, lighthouse, links, and security scan gates.

### Security headers and cache

`vercel.json` declares these policies:

| Header                                                          | Value                                                                                                                                                                                       |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`                                       | Hash-based `script-src` (per-inline-script `sha256-`, no `unsafe-inline`) + Umami Cloud + Calendly; `font-src 'self'`; `connect-src` allows Umami + `nullbreach-api.wavival.dev` + Calendly |
| `Strict-Transport-Security`                                     | `max-age=63072000; includeSubDomains; preload`                                                                                                                                              |
| `X-Frame-Options`                                               | `DENY`                                                                                                                                                                                      |
| `X-Content-Type-Options`                                        | `nosniff`                                                                                                                                                                                   |
| `Referrer-Policy`                                               | `strict-origin-when-cross-origin`                                                                                                                                                           |
| `Permissions-Policy`                                            | Locks camera, microphone, geolocation                                                                                                                                                       |
| Cache (`/_astro/`, `/images/`, `/brand/`, `/icons/`, `/fonts/`) | `public, max-age=31536000, immutable`                                                                                                                                                       |

The `script-src` is hash-based: each inline script carries its own `sha256-` hash, so adding or editing an inline script means its hash drifts and the browser would block it. `npm run csp:check` (a CI step, run after `build`) catches that drift before deploy. If you add a third-party endpoint (Sentry, PostHog, etc.) update `script-src` / `connect-src` in the CSP too.

### Redirects and proxies

Vercel uses two routing layers:

- `microfrontends.json` assigns `/nullbreach` and `/nullbreach/:path*` to the independent `nullbreach` project.
- `vercel.json` preserves `/api/:path*` as a compatibility proxy to `https://nullbreach-api.wavival.dev/api/:path*`.
- `vercel.json` preserves the legacy English-word redirects.

Every future independent application must receive a unique, non-overlapping prefix in `microfrontends.json`. Routes not assigned there continue to resolve to the portfolio. Okroot lives on its own domain (`okroot.co` landing, `app.okroot.co` PWA), so it is not proxied here.

## Using as a template

You're welcome to clone this repo as a base for your own portfolio. Design system, layout primitives, i18n scaffold, and SEO/A11Y baseline are reusable.

**Do not copy the personal content:** copy, images, projects, and contact details belong to Valentina Ramírez and are not covered by the license.

### Files to replace

| File                                      | Data to change                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| `src/layouts/Layout.astro`                | Default title, description, JSON-LD (Person + Organization + WebSite), `site` |
| `astro.config.mjs`                        | `site` URL                                                                    |
| `src/components/sections/Hero.astro`      | Name, tagline, CV URL, social links                                           |
| `src/data/projects.ts`                    | Projects (title, tag, stack, problem, solution, links)                        |
| `src/data/stack.ts`                       | Stack categories and tools                                                    |
| `src/components/sections/About.astro`     | Bio, personal quote, additional links                                         |
| `src/components/sections/Contact.astro`   | Contact email                                                                 |
| `src/components/ui/NavBar.astro`          | CTA email, blog URL                                                           |
| `src/components/ui/Footer.astro`          | Name in copyright, Lúmina W links                                             |
| `src/i18n/ui.ts`                          | UI strings (ES + EN)                                                          |
| `public/robots.txt` · `public/llms.txt`   | Sitemap URL · personal description, projects, links                           |
| `public/cv_valentina_ramirez_{es,en}.pdf` | CV files (rename + update `cvHref` in `src/i18n/utils.ts`)                    |
| `public/images/profile.webp`              | Profile photo                                                                 |
| `public/brand/logo-w.*`                   | Brand logo (regenerate favicon/manifest icons with `sharp`)                   |
| `.env.example`                            | `PUBLIC_UMAMI_SRC`, `PUBLIC_UMAMI_ID`                                         |

Token, typography, and utility-class values are centralized in `src/styles/`, so you can re-skin without touching components.

## Troubleshooting

| Symptom                                          | Fix                                                                                                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Dark mode flashes on first paint                 | The pre-paint script lives at the top of `<head>` in `Layout.astro`. Don't move it below other tags.                                        |
| Fonts flash unstyled (FOUT)                      | Fonts are self-hosted in `public/fonts/` with `font-display: swap` and critical weights preloaded. A brief swap is expected and acceptable. |
| `npm test` fails with stale content              | Run `npm run build` first: the suite serves the static `dist/`, it does not build for you.                                                  |
| Playwright fails locally with "browsers missing" | Run `npm run test:install` once.                                                                                                            |
| Language toggle points at a wrong URL            | Update the slug map (`EN_PAGE_MAP` / `getAltLangUrl`) in `src/i18n/utils.ts` after any page or slug rename.                                 |
| Umami not firing                                 | Confirm both `PUBLIC_UMAMI_SRC` and `PUBLIC_UMAMI_ID` are set and the build was triggered after setting them.                               |
| CSP blocks a new third-party script              | Edit `Content-Security-Policy` in `vercel.json` to add the origin to `script-src` / `connect-src`.                                          |

## Roadmap / known gaps

- **Visual regression.** Playwright covers structure + behavior, not pixels. Add `toHaveScreenshot()` baselines once the design is frozen.
- **Image variants.** No `<picture>` / `srcset` for the hero portrait. Acceptable for current LCP, but multi-resolution would help retina.

## License

This project is licensed under the **MIT License**, with the following clarification:

- **Clone**: Clone this repository freely
- **Fork**: Fork and create your own version
- **Contribute**: Pull requests and contributions welcome
- **Learn**: Use this code to study and learn frontend architecture
- **Modify**: Adapt the code to your needs
- **Attribution**: Please credit the original author (Valentina Ramírez / @wavival)

The **content** (copy, images, projects, CV, brand assets) belongs to Valentina Ramírez and is **not** covered by the MIT license. See the [LICENSE](./LICENSE) file for the full text.

Copyright © 2026 Valentina Ramírez.

## Contact

![Banner principal](assets/footer.png)

<h3 align="left">
  <img src="assets/logo-w.png" width="48px" valign="middle">
  Valentina Ramírez • @wavival
</h3>

> Thanks for getting here. Let's build great things.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-wavival-407bff?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/wavival)
[![Instagram](https://img.shields.io/badge/Instagram-@wavival-407bff?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/wavival)
[![Email](https://img.shields.io/badge/Email-wavival.dev@luminaw.co-407bff?style=for-the-badge&logo=gmail&logoColor=white)](mailto:wavival.dev@luminaw.co)
