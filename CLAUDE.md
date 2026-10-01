# CLAUDE.md: Project Context

## What this is

Personal portfolio of **Valentina Ramírez**, Full Stack Developer (Django · React · Next.js), Founder of [Lúmina W](https://luminaw.co). Third iteration of the site, built to reflect real technical identity, not just a résumé.

**Production URL:** `https://www.wavival.dev`
**Repository:** `https://github.com/wavival/wavival.dev`

---

## Stack and versions

- **Astro 7** (static output, no SSR, no server functions; `compressHTML: true`)
- **Tailwind CSS v3** via PostCSS (`darkMode: 'class'`; colors, `max-w-container`, `rounded-control`, and `gut`/`sec`/`nav` spacing map to the CSS tokens)
- **Design: "Señal v4"**: static editorial UI (1px rules instead of shadow cards, Raleway 800 display scale, numbered indexes, one blue signal). Atomic component structure (`atoms` / `molecules` / `organisms`). No scroll-reveal or JS animation library; the design is static
- **TypeScript** (client-side scripts only)
- **View Transitions**: Astro `<ClientRouter />` for SPA-like same-origin navigation (replaces the old full-screen Loader)
- **web-vitals**: Core Web Vitals RUM, reports LCP/INP/CLS/FCP/TTFB to Umami as custom events (only when Umami env is set)
- **GitHub widget**: build-time only. `src/data/github.ts` (`fetchGithubProfile`) fetches the public GitHub profile + non-fork repos in Astro frontmatter on `/herramientas` and `/en/uses` (the `#repos` section). Unauthenticated and fails soft on network errors or rate limits. `curateRepos()` splits the repos into the NullBreach flagship spotlight (the single `nullbreach` repository) and a learning-resources grid; profile README, this portfolio, and the one-off `prueba-tecnica-logika` test stay hidden. Both use `RepoCard.astro`.
- **`@astrojs/sitemap`**: generates `/sitemap-index.xml` + `/sitemap-0.xml` at build
- **Vercel Microfrontends**: `wavival-dev` is the default application; the independent `nullbreach` project owns `/nullbreach` and `/nullbreach/:path*` through `microfrontends.json`
- **Playwright**: E2E smoke tests (`tests/`)
- **Lighthouse CI** (`@lhci/cli`, config in `lighthouserc.json`): asserts perf/a11y/best-practices/SEO category scores against the built `dist/` per commit
- **linkinator**: crawls the built `dist/` for broken internal links (catches dead routes after slug renames)
- **Prettier** + `prettier-plugin-astro`
- **ESLint** (flat config `eslint.config.mjs`: `eslint-plugin-astro` + `typescript-eslint` + `eslint-config-prettier`; generated `dist/` and `.vercel/` output is ignored)
- **husky** + **lint-staged**: `.husky/pre-commit` runs `lint-staged` (ESLint `--fix` + Prettier on staged files); `.husky/commit-msg` runs the repository Commitlint rules and, when installed, the shared checker at `~/.claude/git-hooks/commit-msg`
- **Node 22.x** (repo pins `.nvmrc` → `22`; all CI jobs read it via `node-version-file: ".nvmrc"`)

The production target is **Vercel**. `vercel.json` defines the security headers, cache rules, legacy redirects, and `/api/*` compatibility proxy. CI (`.github/workflows/ci.yml`) runs `commitlint`, `quality` (dependency audit (`npm audit --audit-level=high --omit=dev`) → format check → lint (`npm run lint`) → type check (`astro check`) → build → CSP hash check (`npm run csp:check`)), `tests` (Playwright), `lighthouse` (Lighthouse CI), `links` (linkinator), and `security scan` (gitleaks).

## Delivery governance

- `main` is production, `stg` is staging, and `dev` is the integration base for human `feature/*`, `fix/*`, and `chore/*` work branches.
- Every human work PR targets `dev`. Promotion PRs move only `dev` to `stg` and `stg` to `main`; Valentina merges them manually with a merge commit, not squash or rebase, to preserve branch ancestry.
- Protected branch checks are `commitlint`, `quality`, `tests`, `security scan`, and `validate-pr-base`.
- `validate-pr-base` accepts human work branches into `dev`, `dev` into `stg`, and `stg` into `main`.
- Branch names (read before branching): every work branch MUST be `feature/*`, `fix/*` or `chore/*`; `validate-pr-base` fails any other prefix (including tool-generated `claude/*`). Create the correctly named branch before the first commit and never work around the check in CI.
- `auto-merge-dev` enables merge-commit auto-merge for non-draft `feature/*`, `fix/*`, and `chore/*` PRs to `dev` with the built-in GitHub token and write permissions. It does not use squash or rebase.
- `delete-merged-branches` runs every 12 hours and reports merged `feature/*`, `fix/*`, and `chore/*` remote branch cleanup candidates. Actual scheduled deletion needs explicit human approval.
- Commit messages use strict Conventional Commits in the form `type(scope): message`. Portfolio scopes are `api`, `ui`, `db`, `auth`, `ci`, `deploy`, `docs`, `config`, `tests`, `security`, `deps`, `core`, `seo`, and `a11y`.

---

## General architecture

Multi-page static site with a bilingual (ES default, EN) routing scheme. The home is a single-page assembly of sections; the rest are standalone pages plus one dynamic route (`proyectos/[slug]`).

### Routing and i18n

- **Spanish (default)** lives at the root with Spanish slugs:
  - `/` (home), `/proyectos`, `/proyectos/[slug]`, `/servicios`, `/sobre-mi`, `/contacto`, `/herramientas`, `/privacidad`, `/404`
- **English** mirrors it under `/en/` with English slugs:
  - `/en`, `/en/projects`, `/en/projects/[slug]`, `/en/services`, `/en/about`, `/en/contact`, `/en/uses`, `/en/privacy`, `/en/404`
- The ES↔EN slug mapping (e.g. `/proyectos` ↔ `/en/projects`) is the single source of truth in `src/i18n/utils.ts` (`EN_PAGE_MAP`, its reverse `ES_PAGE_MAP`, and the `/proyectos/<slug>` ↔ `/en/projects/<slug>` special-case in `getAltLangUrl`). The language toggle reads from here, and `astro.config.mjs` imports the exported `EN_PAGE_MAP` for its sitemap `serialize` hook, so any new page or slug rename MUST update this map. `getAltLangUrl` also special-cases `/404` and `/en/404`: both redirect to the opposite locale's home instead of trying to find a translated 404 page.
- Organisms (`Hero`, `FeaturedProjects`, `StackSection`, `AboutSection`, `ContactBand`, `NavBar`, `Footer`, ...) take a `lang` prop. Internal targets come from `siteRoutes(lang, base)` in `src/i18n/utils.ts` (`home`, `projects`, `services`, `about`, `contact`, `uses`, `privacy`, `stack`, `project(slug)`), the single helper for localized routes; `ariaCurrent(href, Astro.url)` returns `"page"` for the active link (hash-only links excluded). Never hardcode a route that ignores `lang`.
- Per-locale assets resolve through helpers in `src/i18n/utils.ts`: `cvHref(lang)` returns `cv_valentina_ramirez_<es|en>.pdf`. UI strings come from `src/i18n/ui.ts` via `useTranslations(lang)`. Data files carry parallel `*En` fields for translatable content (`src/data/stack.ts`: `descriptionEn` / `whyEn` / `toolsEn`; `src/data/projects.ts`: the `en` block). `toolsEn` is set only on stack categories with translatable chips (Design & UX, Product Engineering) and falls back to `tools`; proper-noun chips (Python, React) need no translation. Render with `isEn ? (s.toolsEn ?? s.tools) : s.tools` (home `StackGrid.astro`) or `s.toolsEn ?? s.tools` (always-EN `/en/uses`).
- **CV PDFs:** editable sources live in `docs/wavival-dev-cv-es.html` and `docs/wavival-dev-cv-en.html`. Preserve their two-page, compact Arial sans-serif layout and existing content unless a specific update is requested; export to the existing locale-specific PDF paths in `public/`.
- **Brand and commercial docs:** `docs/brand.md` and `docs/commercial.md` are living, undated guides for the wavival personal brand. They may only state facts verifiable in this repository or recorded as decisions inside them; anything else stays `[PENDIENTE]`, and a `[PENDIENTE]` blocks only the specific piece that needs it. Current decisions: V1 channels are Instagram and LinkedIn in Spanish; commercial services point primarily to Lúmina W (a software company) and wavival is the trust and discovery channel; TerraCore and OKroot are Lúmina W products (TerraCore: only the Semilla plan is treated as available; OKroot: early access); the 42% TerraCore figure is not used in public content; CV third-party names and experiences are not V1 content. Update both docs when positioning, offer, pricing, or product status changes.
- **Portfolio project facts:** `src/data/projects.ts` is the bilingual source for case studies. NullBreach's app uses Next.js, NextAuth, Prisma Postgres, and OpenAI; its landing remains in Astro. Its current source repo is `wavival/nullbreach`. Blog W is presented as a Next.js PWA; incomplete stack details are tracked in `docs/blog-w-stack-pendiente.md`. TerraCore is an offline-first PWA. The uses page lists an Intel Core i5, 16 GB RAM, 1 TB, Fedora, and Firefox. WhatsApp is +57 301 656 0222. Keep `public/llms.txt` and `public/llms-full.txt` aligned with these project facts. `src/data/stack.ts` feeds both the home stack and `/herramientas` + `/en/uses`; keep Next.js, OpenAI, and OpenClaw entries in sync across both locales.
- Legacy English-word ES routes (`/projects`, `/services`, `/about`, `/contact`, `/uses`) are 301-redirected to the Spanish slugs in `vercel.json`. The former OKroot case-study slugs `/proyectos/root` and `/proyectos/root-landing` (plus their EN equivalents) permanently redirect to `/proyectos/okroot` and `/proyectos/okroot-landing`. Content stays Spanish; only the URL changed.
- Vercel path ownership lives in the default application's `microfrontends.json`: `wavival-dev` handles `/` and every unassigned path, while the separate `nullbreach` project handles both `/nullbreach` and `/nullbreach/:path*`. Add future independent applications as new, non-overlapping path groups; never claim `/` or reuse another application's prefix.
- EN pages declare `hreflang` alternates (es / en / x-default) in their `Layout` call; the `es`/`x-default` hrefs point at the Spanish slugs.

The base layout (`src/layouts/Layout.astro`) owns the entire `<head>`: meta tags, OG, JSON-LD, fonts, Umami, skip link, NavBar, and Footer. It derives `lang` from the URL (`getLangFromUrl(Astro.url)`), which drives `<html lang>`, `og:locale`, translations, and the home-only `ProfilePage` `inLanguage`. The `lang` prop remains in the interface for back-compat but is ignored, so `<html lang>` always matches the actual route.

---

## File structure

```
src/
  components/
    atoms/            # Button, TextLink, IconLink, MaskIcon, Chip, StatusDot, Badge, Eyebrow, Index
    molecules/        # SectionHeader, PageIntro, ChipList, ProjectMeta, ProjectActions, Metric, DefRow, SocialLinks, ThemeToggle, Disclosure, PullQuote
    organisms/        # NavBar, Footer, ContactBand, Hero, FeaturedProjects, StackSection, StackGrid, AboutSection, ProjectRow, ProjectCard, ProjectsIndex, ProjectFilters, RepoCard, ServiceRow, ServicesDetail, LegalSection, NotFound, CaseStudy, CaseToc, CaseSection
  data/
    projects.ts       # Bilingual case-study source
    projectView.ts    # projectView(project, lang, base): localized presentation view (cards, actions, filters)
    stack.ts          # Stack categories (home + uses pages)
    github.ts         # Build-time GitHub profile/repos fetch
  i18n/
    ui.ts             # UI strings
    utils.ts          # getLangFromUrl, EN_PAGE_MAP, getAltLangUrl, cvHref, siteRoutes, ariaCurrent
  layouts/
    Layout.astro      # Template: full head, skip link, sticky NavBar, Footer
  pages/
    index.astro       # ES home: assembles all sections
    404.astro         # ES error page with noindex
    proyectos/        # ES: index.astro + [slug].astro (dynamic case studies)
    servicios.astro   # ES services
    sobre-mi.astro    # ES about
    contacto.astro    # ES contact
    herramientas.astro # ES uses
    privacidad.astro  # ES privacy
    en/               # EN mirror: index, 404, projects/, services, about, contact, uses, privacy
  scripts/
    nav.ts            # Mobile overlay menu: inert/focus management, Escape, focus trap
    theme.ts          # Dark/light toggle + localStorage (post-paint sync; dark is the default)
    vitals.ts         # Core Web Vitals RUM, reports to Umami (only when Umami env set)
  styles/
    global.css        # Imports, @font-face, body base, focus outline, prefers-reduced-motion
    tokens.css        # CSS custom properties (design tokens, dark overrides)
    utilities.css     # @layer components: component classes (.wrap, .btn, .eyebrow, ...)
public/
  brand/              # logo-w.webp (visible brand logo in NavBar/Footer)
  icons/ui/           # Decorative SVGs (always alt=""); icon-only controls tint them through CSS mask with --link (MaskIcon/IconLink), the *-white files are <img> icons inside the primary Button
  images/             # profile.webp and optimized 1200x630 OG banners (og-card, og-terracore, og-okroot, og-nullbreach, og-lumina-w, og-blogw)
  fonts/              # Self-hosted woff2: Poppins 400/500/600 (static), Raleway variable 600-800 (latin subset)
  favicon.ico         # Favicon (16/32/48 multi-res, generated from logo-w.webp)
  apple-touch-icon.png # 180x180 iOS home-screen icon
  icon-192.png        # PWA/manifest icon (purpose any)
  icon-512.png        # PWA/manifest icon (purpose any)
  icon-maskable-512.png # PWA/manifest icon (purpose maskable, dark safe-zone bg)
  site.webmanifest    # Web app manifest (icons, theme/background color, lang es)
  cv_valentina_ramirez_es.pdf   # Spanish CV (served on ES pages)
  cv_valentina_ramirez_en.pdf   # English CV (served on EN pages)
  llms.txt            # llmstxt.org descriptor for AI assistants (index)
  llms-full.txt       # Long-form companion: expanded prose for all sections
  robots.txt          # Allows indexing, references /sitemap-index.xml
  .well-known/
    security.txt      # RFC 9116 security contact (Contact, Expires, Canonical)
docs/
  blog-w-stack-pendiente.md # Confirmed Next.js/PWA facts and missing blog stack details
  brand.md                 # Living brand guide for the wavival personal brand (audience, positioning, voice, pillars, limits, visual identity, Lúmina W relationship)
  commercial.md            # Living commercial guide (offer, ideal client, capabilities, conversion toward Lúmina W, CTAs, allowed claims)
  wavival-dev-cv-es.html   # Editable Spanish CV source, exported to public/cv_valentina_ramirez_es.pdf
  wavival-dev-cv-en.html   # Editable English CV source, exported to public/cv_valentina_ramirez_en.pdf
scripts/
  check-csp-hashes.mjs # CI guard: every inline <script> in dist/ must have a sha256 hash in vercel.json CSP script-src
tests/                # Playwright E2E smoke tests + pure-unit specs (redirects, i18n-utils)
microfrontends.json    # Vercel path ownership: default portfolio + /nullbreach child app
vercel.json            # Vercel headers, cache, redirects, and /api compatibility proxy
lighthouserc.json     # Lighthouse CI config (staticDistDir + category assertions)
.nvmrc                # Node version pin (22)
.github/workflows/ci.yml  # commitlint, quality, tests, lighthouse, links, security scan
postcss.config.cjs    # Tailwind 3 PostCSS processing
eslint.config.mjs     # ESLint flat config (astro + typescript-eslint + prettier)
.husky/pre-commit     # Runs lint-staged (ESLint --fix + Prettier on staged files)
.husky/commit-msg     # Validates the commit subject via ~/.claude/git-hooks/commit-msg when installed (no-op elsewhere)
CHANGELOG.md          # Keep a Changelog format, SemVer; update on every release
```

The favicon/manifest icon set in `public/` is generated from `public/brand/logo-w.webp` (square canvas, contained logo; maskable variant gets a dark `#0f1117` safe-zone background). Regenerate with `sharp` if the logo changes. The visible brand logo (`brand/logo-w.*`) is separate and unchanged.

The pre-paint theme script is inlined synchronously at the top of `<head>` in `Layout.astro`: it adds `.dark` to `<html>` before first paint unless `localStorage["theme"] === "light"` (dark is the default theme and no longer follows `prefers-color-scheme`; the `theme-color` meta defaults to `#0f1117`). `src/scripts/theme.ts` only handles toggle clicks and icon sync after hydration.

---

## Design system

**Design source:** the UI follows the Claude Design project `wavival-dev-v4` (files `wavival-dev-v4.dc.html`, `wavival-dev-v4-design-system.dc.html`, `wavival-dev-v4-design.md`). Concept "Señal": rules not boxes; editorial scale; one blue signal; icons only on icon buttons and the primary button; one-column narrative at full container width; vertical centering; no icons in text buttons/links; accordion state shown as text. See `DESIGN.md` and `COMPONENTS.md`.

### Tokens (`src/styles/tokens.css`)

All color, spacing, and type values live as CSS custom properties in `:root` and `.dark`. **Never hardcode colors in components**: always use `var(--token-name)` or the Tailwind color aliases that map to them.

Key tokens:

- Colors: `--bg` (page), `--surface` (cards, bands), `--line` / `--line-2` (1px rules; `--line-2` for stronger borders), `--tint` (subtle blue wash), `--text`, `--muted`, `--ok`, `--warn`, `--nav` (translucent header fill)
- Blue: `--link` (`#1565c0` light / `#5b8cff` dark) and `--link-h` (`#0f4c91` / `#82a8ff`) for text, links, icons, and focus; `--blue-text` (`#1565c0` light / `#407bff` dark) for small blue text such as the `.index` numbers; `--blue` (`#407bff`, fills, borders, bars, and large/display text only; fails AA for small text); `--btn` / `--btn-h` (`#1565c0` / `#0f4c91`) for the primary button fill with `--on-btn` (`#ffffff`) text, theme-independent so white text stays >=4.5:1
- Structure: `--container: 1280px`, `--gut`, `--sec`, `--sec-compact`, `--nav-h: 64px`, radii `--radius-surface: 0`, `--radius-control: 2px`, `--radius-dot: 50%`
- Type: `--fs-*` scale (`display-xl`, `display-page`, `display-about`, `display-case`, `h2`, `h2-case`, `h3-project`, `lead`, `body-lg`, `body`, `body-sm`, `label`, `label-sm`) and `--tracking-*` (`display`, `h2`, `label`, `button`)
- Tailwind aliases (`tailwind.config.mjs`): colors `bg`, `surface`, `line`, `line-2`, `tint`, `ink` (= `--text`), `muted`, `link`, `link-h`, `blue`, `btn`, `btn-h`, `ok`; `max-w-container`; `rounded-control`; spacing `gut`, `sec`, `nav`
- The old tokens (`--brand-blue`, `--brand-blue-text`, `--bg-page`, `--bg-card`, `--bg-blur`, `--nav-blur`, `--text-primary`, `--text-muted`, `--accent-link`, `--accent-hover`, `--btn-bg`, `--border-base`, `--shadow-base`, `--radius-sm/md/lg`, `--space-section`) no longer exist. There are no shadows

### Typography

- `font-display` (Raleway, 800 for display and titles) for headings, buttons, uppercase labels, indexes
- `font-body` (Poppins) for body text
- Configured in `tailwind.config.mjs`; scale in `tokens.css`

### Component classes (`src/styles/utilities.css`)

All inside `@layer components`, 2-space indentation throughout. Available classes:

- Structure: `.wrap` (container + gutters), `.page-top`, `.section-gap`, `.rule-section` (1px top rule in `--text`), `.rule-line`
- Type: `.eyebrow`, `.label-sm` (+ `.label-sm-link`), `.index`, `.display-xl`, `.display-page`, `.h2-section`, `.h3-project`, `.h-title`, `.lead`, `.body-lg`, `.body`, `.accent`
- Actions: `.btn` with `.btn-primary` / `.btn-secondary` and sizes `.btn-sm` / `.btn-compact`; `.text-link`, `.list-link`, `.inline-link`; `.icon-btn` (+ `.icon-btn-lg`), `.mask-icon` (+ `-lg`, `-xl`), `.lang-toggle`
- Labels: `.chip`, `.status`, `.status-dot` (+ `-ok`, `-link`, `-warn`), `.badge`
- Patterns: `.cell-grid`, `.nav-link`, `.media-frame` (1200x630 images), `.photo-frame` (4:5 portrait), `.disclosure` (native `<details>` text state)
- Removed: `.section`, `.section-title`, `.section-subtitle`, `.btn-ghost`, `.card`, `.card-plain`, `.link`, `.icon-*`, `.profile-photo`

---

## UI Components

Atomic design under `src/components/`; the template is `src/layouts/Layout.astro`. Full prop reference in `COMPONENTS.md`.

- **Atoms:** `Button` (`variant` primary/secondary, `size` md/sm/compact, optional `icon`; renders `<a>` or `<button>`), `TextLink` (`variant` text/list/inline), `IconLink` (icon-only, tinted via CSS mask with `--link`, >=44px target), `MaskIcon`, `Chip`, `StatusDot`, `Badge`, `Eyebrow`, `Index`. `Button`, `TextLink`, and `IconLink` forward `data-umami-event`; external links get `target="_blank"` + `rel="noopener noreferrer"` automatically
- **Molecules:** `SectionHeader`, `PageIntro` (the page `h1`), `ChipList`, `ProjectMeta`, `ProjectActions`, `Metric`, `DefRow`, `SocialLinks`, `ThemeToggle`, `Disclosure` (native `<details>`, no JS), `PullQuote`
- **Organisms:** `NavBar` (sticky 64px header; active link = text color + 2px blue bar via `aria-current`; below 900px a full-screen overlay menu with numbered display links, "Blog W" primary and mailto secondary; language toggle is the text "EN"/"ES"), `Footer` (outlined wordmark SVG), `ContactBand` (home `#contact`, also closes services, about, and case studies), `Hero`, `FeaturedProjects`, `StackSection`, `StackGrid`, `AboutSection`, `ProjectRow`, `ProjectCard`, `ProjectsIndex`, `ProjectFilters`, `RepoCard`, `ServiceRow`, `ServicesDetail`, `LegalSection`, `NotFound`, `CaseStudy`, `CaseToc`, `CaseSection`
- **Home sections** carry ids `hero`, `projects`, `stack`, `about`, `contact`. Case-study sections carry ids `cs-problem`, `cs-architecture`, `cs-decisions`, `cs-results`, `cs-learnings`
- **RepoCard:** props `repo` (`GithubRepo`), `lang`, `variant` (`featured` | `resource`). Name is a plain `<span>`, stars are localized text (never a `★` glyph), and the card `<a>` has no `aria-label` so its accessible name comes from the visible content
- **Project filters** (`ProjectFilters.astro`) toggle `display` and `aria-pressed`; the "no results" block is `role="status"`. `projectView(project, lang, base)` in `src/data/projectView.ts` builds the localized view model (title, tag, actions, filters, case-study href) used by cards, rows, and actions

---

## SEO / A11Y: current state

### SEO

- Meta title, description, author, robots with extended directives
- Canonical URL generated from `Astro.url.pathname` + site base
- Reciprocal `hreflang` (es / en / x-default) on every page via the `alternates` prop passed to `Layout`: the ES and EN pair point at each other, `x-default` points at the Spanish slug
- Full OpenGraph (og:image with dimensions, alt, `og:locale` plus `og:locale:alternate` for the other locale); `og:image:type` is derived from the OG image file extension (`.webp` yields `image/webp`, otherwise `image/png`). `og:type` is set per page via the `ogType` Layout prop: `website` (default, section/index/legal pages), `profile` (both home pages), `article` (case studies, which also emit `article:published_time` / `article:modified_time` from `ogPublishedTime` / `ogModifiedTime`, the project's `toIsoDateTime(datePublished/dateModified)`). Case studies set a per-project OG card via `project.image` (optimized 1200x630 WebP in `public/images/`: `og-terracore`, `og-okroot`, `og-nullbreach`, `og-lumina-w`, and `og-blogw`) and a per-project `og:image:alt` / `twitter:image:alt` via the `ogImageAlt` Layout prop (passed from `project.imageAlt`, EN from `project.en.imageAlt`); it falls back to the generic locale alt when unset. Generate OG cards with `sharp` using a 1200x630 cover crop, WebP quality around 82, and stripped metadata. The main README banner remains a README-only PNG in `assets/banner.png`.
- Twitter Card (`summary_large_image`, with `twitter:site` / `twitter:creator` = `@wavival0`)
- JSON-LD `@graph` in `Layout.astro`: `Person` (with `knowsAbout`, `knowsLanguage`, `nationality`, `alumniOf`, `worksFor` referencing the Organization by `@id`, a `sameAs` of identity profiles only (canonical www + trailing-slash forms), `image` as an `ImageObject` with `@id`/`url`/`width`/`height`/`caption`, and a stable `description` constant independent of the page meta description), `Organization` (Lúmina W, own `@id`, `logo` as an `ImageObject`, a `contactPoint`, and an external-only `sameAs` that excludes its own `url`), and `WebSite` (fixed `name`; no `inLanguage` to avoid per-locale mutation under the shared `@id`)
- Per-page JSON-LD: `BreadcrumbList` on section/index pages, `/proyectos/[slug]`, `/contacto`, and `/en/contact`; `Service` (with `@id` and `priceRange`) + `FAQPage` on `/servicios` and `/en/services`; `ContactPage` on `/contacto` and `/en/contact`; case studies emit `SoftwareApplication` | `WebSite` | `CreativeWork` per `project.schemaType`, each with an `@id` (`<pageURL>#project`) and `datePublished`/`dateModified` sourced from `project.datePublished`/`dateModified` in `src/data/projects.ts` (every project sets real dates; fallback is build date only if unset; also drives the visible "Actualizado"/"Updated" date). In the JSON-LD these are emitted as full ISO 8601 datetimes: a date-only `YYYY-MM-DD` value is normalized to `YYYY-MM-DDT00:00:00-05:00` via `toIsoDateTime()` (Google's Profile page rich result rejects date-only `dateModified` as an invalid datetime); the visible label keeps the date-only form. `SoftwareApplication` nodes carry `applicationCategory` (`project.appCategory`), real `programmingLanguage` (`project.programmingLanguage`: Python/TypeScript/SQL), and `softwareRequirements` (frameworks/tools from `project.stack`)
- All hreflang `href` values and BreadcrumbList/Service `item`/`url` values use trailing slashes to match canonical URLs
- `lang` on `<html>` driven by the `lang` prop (`es` default, `en` on `/en/` pages)
- Google Search Console: the repository does not prove external ownership status. Verify the `wavival.dev` Domain property through DNS, then submit `https://www.wavival.dev/sitemap-index.xml` and use URL Inspection plus Page indexing, Core Web Vitals, Manual actions, Security issues, and Search performance reports. No verification token belongs in the repository when DNS verification is used.
- Analytics: Umami, env-driven via `PUBLIC_UMAMI_SRC` + `PUBLIC_UMAMI_ID` (cookieless; script only emitted when both are set; no Google Analytics)
- CTA event tracking: key CTAs declare a `data-umami-event="<name>"` attribute (Umami's zero-JS automatic capture); no `window.umami.track()` calls. `Button`, `TextLink`, and `IconLink` accept and forward a `data-umami-event` prop. Tracked events: `cta-quiero-producto` (`ContactBand` CTA), `cv-descarga-es` / `cv-descarga-en` (Hero CV button, by locale), `contacto-email` (every `mailto:` CTA: NavBar desktop + mobile, contact-page email channel), `contacto-whatsapp`, `contacto-calendly` (contact-page channels, ES + EN), and `ver-app-terracore` / `ver-app-root` / `ver-app-nullbreach` (project app/site links, sourced from an optional `event` field on `ProjectLink` in `src/data/projects.ts`, exposed through `projectView()` and forwarded by `ProjectActions.astro` on the project cards and both `[slug].astro` case-study pages). Add new CTA tracking via this attribute, not inline scripts.
- Real User Monitoring: `src/scripts/vitals.ts` reports Core Web Vitals (LCP/INP/CLS/FCP/TTFB) to Umami as `web-vitals` custom events; bundled and emitted only when the Umami env vars are set (same gate as analytics), sent to `cloud.umami.is` / `analytics.umami.is` (both in CSP `script-src` + `connect-src`)
- Sitemap auto-generated at `/sitemap-index.xml` by `@astrojs/sitemap` with both locales (`es`, `en`); referenced from `robots.txt`. A `serialize` hook in `astro.config.mjs` emits reciprocal `xhtml:link` alternates (`es` / `en` / `x-default`) on every bilingual URL by pairing ES↔EN from the exported `EN_PAGE_MAP` plus the `/proyectos/<slug>` ↔ `/en/projects/<slug>` rule (Astro's built-in i18n only pairs URLs sharing a locale path prefix, which the Spanish slugs do not). Alternate hrefs use trailing slashes to match the canonical. The same hook sets a per-type `priority` (home 1.0, section/index pages 0.8, case studies 0.7, legal pages 0.3) instead of a flat 1.0.
- `llms.txt` at `/llms.txt` describes the site for AI assistants (llmstxt.org spec); `/llms-full.txt` is its long-form companion with expanded prose for every section (about, all case studies, services), linked from the `## Optional` section of `llms.txt`. These files support AI discovery but are not a substitute for Google Search Console or a ranking signal. Keep both in sync with site content (project metrics, stacks, services, contact).

### A11Y

- Skip link to `#main-content` (visible on focus)
- Heading hierarchy: single h1 per page (`Hero` on home, `PageIntro` elsewhere), h2 in each section, h3 in cards. Footer group titles ("Navegación"/"Recursos") are real `<h2>` elements (not `aria-hidden` spans)
- `aria-label` on all interactive elements, respecting Label-in-Name (WCAG 2.5.3): when a control has visible text, its `aria-label` must contain that text verbatim (e.g. nav email CTA, blog link, Stack "Criterio técnico"/"Technical criteria")
- `aria-expanded` + `aria-controls` on mobile menu button
- Mobile menu focus management (`src/scripts/nav.ts`): the menu carries `inert` while closed (set in markup + JS, so closed links are never tabbable, also correct without JS); opening moves focus to the first link, Escape and link-clicks close it, Escape restores focus to the hamburger, and Tab is trapped within the open menu. The hamburger's `aria-label` is localized and state-aware: NavBar passes `data-label-open`/`data-label-close` (from `nav.openMenu`/`nav.closeMenu` translations) on the button, and `nav.ts` reads them to swap the label on open/close instead of hardcoding Spanish strings
- `aria-current="page"` on the active NavBar + Footer link (computed via `ariaCurrent()` from `src/i18n/utils.ts`, hash-only links excluded); styled beyond color alone: `.nav-link` gets a 2px blue bar, `.list-link` and the mobile overlay links switch to `--link`, and `Projects` stays current on case-study pages
- Status messages (WCAG 4.1.3): the project filter "Sin resultados"/"No results" block (`ProjectsIndex`/`ProjectFilters`) is `role="status"` so filtering to an empty set is announced, not a silent visual swap. Filter buttons themselves convey state via `aria-pressed`
- The GitHub `RepoCard` link has no `aria-label`: its accessible name comes from the visible content (repo name + description + language + stars) so screen-reader users get the same info sighted users see. The repo name is a plain `<span>` (not `<strong>`: emphasis is not a title)
- Theme toggle exposes the current state: `theme.ts` sets a dynamic `aria-label` ("Cambiar a tema claro/oscuro" per locale) on each toggle in `syncIcons`. `syncIcons` and the pre-paint inline script also keep the single `<meta name="theme-color">` (`#f0f4ff` light / `#0f1117` dark, default `#0f1117`) in sync with the class-based theme. Dark is the default and the OS `prefers-color-scheme` is not consulted (so the meta is not media-conditional)
- All decorative icon `<img>` elements have `alt=""` (including the NavBar/Footer brand logo, whose link is named by `aria-label`)
- Icon-only controls (`.icon-btn`, `.lang-toggle`, `IconLink`) are >=44x44 px (WCAG 2.5.8); their SVGs are CSS-masked and tinted with `--link`
- `role="list"` on desktop nav `<ul>`
- `prefers-reduced-motion` respected in `global.css` (animations/transitions clamped, smooth scroll off). The case-study accordion is a native `<details>` (`Disclosure`, "Ver"/"Cerrar" ES, "View"/"Close" EN: state shown as text) with no JS, so there is nothing to cancel or desync
- Visible focus on every interactive element via the global `:focus-visible { outline: 2px solid var(--link); outline-offset: 2px }` in `global.css` (no per-component ring classes). The skip link is also covered.
- WCAG AA contrast: `--text-muted` light `#4b5563` (~5.9:1 on `#f0f4ff`), dark `#9ca3af` (~7.4:1 on `#0f1117`). Interactive blue is `--link` (`#1565c0` light / `#5b8cff` dark): button fill `--btn` with white `--on-btn` text is 5.67:1, and link/icon text on `--bg` is 5.13:1 (light) / 5.93:1 (dark), all >=4.5:1. Small blue text uses `--link`; `--blue` (#407bff) is reserved for fills, borders, indexes, and large/display text (>=3:1) only

### Performance

- Pre-paint theme script (sync `is:inline` in `<head>`) avoids FOUC; it re-applies `.dark` on `astro:after-swap` so the theme never flashes across View Transitions navigations.
- View Transitions (`<ClientRouter />`): same-origin navigations swap without a full reload. DOM-binding scripts (theme toggle, mobile nav, project filters) re-run on `astro:page-load`; document-level handlers (Escape/Tab focus trap) bind once and re-query the DOM. No full-screen Loader.
- Hero image: WebP, `fetchpriority="high"`, `decoding="async"`, explicit dimensions, plus a `<link rel="preload" as="image">` for LCP emitted only on pages that render the photo (home and about) via the `preloadHero` Layout prop, so other routes do not preload an image they never show. The home hero photo is a 4:5 `.photo-frame` (`width="320" height="400"`, `fetchpriority="high"`); there is no scroll reveal, so nothing hides above-fold content.
- Fonts self-hosted in `public/fonts/`: Poppins 400/500/600 (static, latin subset) + Raleway as a single variable `woff2` (`wght` 600-800, latin subset, one `@font-face` with `font-weight: 600 800`). `font-display: swap` in `global.css`; critical weights (Poppins 400 + Raleway variable) preloaded in `Layout.astro`. No Google Fonts request or `preconnect`. Regenerate with `pyftsubset` (Raleway: `fonttools varLib.instancer ... wght=600:800` then `pyftsubset --flavor=woff2 --no-hinting`).
- Umami analytics: cookieless, script injected only when `PUBLIC_UMAMI_SRC` + `PUBLIC_UMAMI_ID` are set.
- Core Web Vitals RUM (`web-vitals` via `src/scripts/vitals.ts`): bundled and run only when the Umami env vars are set; reports field LCP/INP/CLS/FCP/TTFB to Umami.
- All icon `<img>` elements have `width` and `height` to prevent CLS.
- Vercel cache: `/_astro/`, `/images/`, `/brand/`, `/icons/`, `/fonts/` are served immutable (1y). HSTS (preload) + frame-deny + nosniff + Referrer-Policy + Permissions-Policy live in `vercel.json`.
- CSP (`vercel.json`): `script-src` is **hash-based, no `'unsafe-inline'`**. It lists a `sha256-*` for every inline `<script>` Astro emits (pre-paint theme, web-vitals import, Astro view-transition glue, Calendly `define:vars`; the scroll-reveal and accordion scripts no longer exist). Hashes are deterministic per build; `npm run csp:check` recomputes them from `dist/` and fails if an inline script lacks a matching hash. JSON-LD (`type="application/ld+json"`) is a CSP data block, not gated. `style-src` keeps `'unsafe-inline'`. After adding or editing any inline script, run `npm run build && npm run csp:check`; it prints the missing hash to add to the CSP. Self-hosted fonts mean `font-src 'self'`; Umami and Calendly are allow-listed by host.

---

## Personal data locations

If used as a template, these are the files containing Valentina's personal information:

| File                                                                     | Data                                                                                                                                        |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/layouts/Layout.astro`                                               | Default title, description, `site` constant, JSON-LD (Person + Organization + WebSite `@graph`: name, jobTitle, alumniOf, worksFor, sameAs) |
| `.env` (`PUBLIC_UMAMI_SRC`, `PUBLIC_UMAMI_ID`)                           | Umami script URL + website ID                                                                                                               |
| `src/components/organisms/Hero.astro`                                    | Name, tagline, CV URL, social links                                                                                                         |
| `src/data/projects.ts` + `organisms/FeaturedProjects.astro`              | All projects (title, description, links) and the home selection                                                                             |
| `src/data/stack.ts` + `organisms/StackSection.astro` / `StackGrid.astro` | Stack categories and tools                                                                                                                  |
| `src/components/organisms/AboutSection.astro`                            | Bio, personal quote, additional links                                                                                                       |
| `src/components/organisms/ContactBand.astro`                             | Contact email                                                                                                                               |
| `src/components/organisms/NavBar.astro`                                  | CTA email, blog URL                                                                                                                         |
| `src/components/organisms/Footer.astro`                                  | Name in copyright, Lúmina W links                                                                                                           |
| `public/robots.txt`                                                      | Sitemap absolute URL                                                                                                                        |
| `public/llms.txt`                                                        | Personal description, projects, links (llmstxt.org spec)                                                                                    |
| `astro.config.mjs`                                                       | `site` URL                                                                                                                                  |
| `public/cv_valentina_ramirez_es.pdf`                                     | Spanish CV (exported from `docs/wavival-dev-cv-es.html`, resolved per-locale via `cvHref()` in `src/i18n/utils.ts`)                         |
| `public/cv_valentina_ramirez_en.pdf`                                     | English CV (exported from `docs/wavival-dev-cv-en.html`, resolved per-locale via `cvHref()` in `src/i18n/utils.ts`)                         |
| `public/images/profile.webp`                                             | Profile photo                                                                                                                               |
| `public/brand/logo-w.*`                                                  | Brand logo                                                                                                                                  |
| `public/site.webmanifest`                                                | App name + description (personal); icons derived from `brand/logo-w.webp`                                                                   |

---

## Code conventions

- **Astro components:** Props typed with `interface Props` in frontmatter
- **No unnecessary comments**: code is documented via descriptive names
- **CSS:** always use `var()` for tokens; component classes inside `@layer components` with 2-space indentation
- **Scripts:** vanilla TypeScript, no client-side frameworks
- **Images:** WebP for photos, SVG for icons. Always include `width`, `height`, and appropriate `alt`
- **External links:** always `target="_blank"` + `rel="noopener noreferrer"` (handled automatically by `TextLink`, `IconLink`, and `Button`)
- **Dark mode:** only via `.dark` class on `<html>`, never via `@media (prefers-color-scheme)`
- **No em dashes:** never use the em-dash character (Unicode U+2014) anywhere in this repo (copy, comments, docs, commits, code). Use normal punctuation instead: colon for explanations, comma for asides, parentheses for parentheticals, hyphen for ranges/separators. Do not substitute an en-dash (U+2013) either; plain ASCII only. This applies to generated and edited content alike.
- **No emojis:** never use emoji characters anywhere in this repo: data files, copy, comments, docs, commits, or code. This rule applies to Claude and all subagents without exception.
- **Pre-delivery audit (mandatory for UI, content or config changes):** Before opening or updating a PR, audit and fix: SEO (one h1, title and description lengths, canonical, hreflang, valid JSON-LD, image `alt`/`width`/`height`, named links, `noopener`), GEO (keep `public/llms.txt` and `public/llms-full.txt` in sync with site facts), accessibility (axe-core with WCAG 2.0 to 2.2 AA and best-practice rules over every route, both themes and desktop plus mobile widths must report 0 violations; small text never uses `--blue`), and performance (CSS/JS size, preloaded LCP image, lazy below-the-fold images, `npm run csp:check`). Keep all docs updated in the same change.
- **Keep docs in sync (ALWAYS, mandatory):** ALWAYS update both `CLAUDE.md` and `AGENTS.md` in the same change whenever ANY important change happens in the repository. This is non-negotiable, with no exceptions. "Important" includes (but is not limited to): infrastructure, dependencies, tooling, repo structure/file layout, build or deploy config, routing/i18n conventions, SEO / schema / JSON-LD / metadata, analytics, design-system or token decisions, accessibility behavior, and any other structural or behavioral decision. Treat the docs as part of the change, never a follow-up: if a change makes any statement in either file wrong or incomplete, fix it before finishing. This applies to Claude and all subagents, every time.

---

## Available commands

```bash
npm run dev           # Dev server at localhost:4321
npm run build         # Static build to ./dist/
npm run preview       # Preview the build
npm run check         # astro check (type + diagnostic)
npm run format        # Format with Prettier
npm run format:check  # Check formatting without writing
npm run lint          # ESLint (flat config, eslint-plugin-astro + typescript-eslint)
npm run lint:fix      # ESLint with --fix
npm test              # Playwright E2E (builds nothing; runs `astro preview` on port 4329)
npm run test:ui       # Playwright UI mode
npm run test:install  # One-time: download Chromium + system deps
npm run lhci          # Lighthouse CI against ./dist (run `npm run build` first)
npm run links         # linkinator: check ./dist for broken internal links (build first)
npm run csp:check     # Verify every inline <script> in ./dist has a sha256 in vercel.json CSP (build first)
```

> Run `npm run build` before `npm test`: the suite serves the static `dist/` via preview, it does not build for you.
> Playwright runs its own preview on **port 4329** with `reuseExistingServer: false`, so a `npm run dev` server on 4321 never gets reused for tests (a dev server emits no sitemap and uses localhost canonicals, which would fail SEO/i18n specs). Coverage: home, all ES + EN routes and project case studies, mobile menu, theme, i18n (lang attrs, per-locale CV, hreflang, language toggle), and SEO (robots, sitemap, localized `<loc>` entries).

---

## What NOT to do

- Do not add SSR or server endpoints: this is a pure static site
- Do not install client-side JS frameworks (React, Vue, etc.) without a real need
- Do not hardcode colors in components: use design tokens (the pre-v4 token names are gone)
- Do not reintroduce shadow cards, scroll-reveal (`data-aos`), or a JS accordion: the design is static, rules instead of boxes, and the accordion is native `<details>`
- Do not use `@media (prefers-color-scheme)` for dark mode: the toggle uses the `.dark` class
- Do not omit `aria-label` on interactive elements with no visible text
- Do not set image dimensions via CSS only: always include HTML `width` and `height` attributes as well
- Do not commit a static `public/sitemap.xml`: the sitemap is generated by `@astrojs/sitemap` at build time
- Do not hardcode analytics tokens: wire them through `PUBLIC_UMAMI_SRC` / `PUBLIC_UMAMI_ID`
- Do not add an inline `<script>` (or edit an existing one) without updating the CSP: `script-src` is hash-based with no `'unsafe-inline'`, so a new/changed inline script is blocked in production until its `sha256-*` is added to `vercel.json`. After any such change run `npm run build && npm run csp:check` and paste the printed hash. Prefer Umami's `data-umami-event` attribute over inline tracking scripts
- Do not move the pre-paint theme `<script is:inline>` out of the top of `<head>`: it must execute before stylesheets load to avoid FOUC
- Do not use the em-dash character (Unicode U+2014): use a colon, comma, parentheses, or hyphen instead (see Code conventions)
- Do not use emoji characters anywhere: data files, copy, comments, docs, commits, or code
- Do not add arrows (`←`, `→`, `↑`, `↓`) or decorative icons to buttons or links unless explicitly requested by Valentina: icons appear only on icon-only buttons and the primary button (`icon=` prop); text buttons and links carry no icons
