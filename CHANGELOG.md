# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- `CLAUDE.md` is no longer empty: it is the Claude Code project guide, imports `AGENTS.md` and links to the documentation set, and `AGENTS.md` states it. The previous rule that kept `CLAUDE.md` empty is removed from `AGENTS.md` and the README document map.
- Every document carries a `> Last updated: YYYY-MM-DD` line (README, `SECURITY.md`, `CLAUDE.md` and all of `docs/`); a change to a document updates it and is recorded here under `[Unreleased]`.
- Full documentation verification against the code on 2026-10-04: README (workflow triggers, local hooks, document map and table of contents), `docs/engineering.md` (CI triggers, auto-merge and branch cleanup rules, hooks), `docs/RELEASING.md` (`v4.0.0` is now an existing tag) and `docs/ROADMAP.md` (the unused `quoteType` values are `api-backend` and `ai`).
- Positioning: Full Stack developer focused on backend and AI, in the home hero, the about section, the page titles and descriptions, the footer tagline, the structured data, the web manifest, `llms.txt`, `llms-full.txt`, the README, `docs/brand.md` and `docs/commercial.md`. The open positioning decision is removed from `docs/ROADMAP.md`.
- Ownership rule for SEO and GEO: everything on wavival.dev belongs to wavival and everything on luminaw.co to Lúmina W. The structured data now treats the `Person` as the entity of the site (contact email, `publisher` of the `WebSite`) and no longer attaches a contact point or `worksFor` to Lúmina W; `llms.txt` and `llms-full.txt` state the split; the about pages and the footer no longer present clients or services as Lúmina W's; `docs/seo.md`, `docs/brand.md` and `docs/commercial.md` follow the rule.
- Home H1: "Full Stack Developer, backend e IA." ("backend and AI" in English).
- Published price: projects from USD 250 / COP 1,000,000 depending on scope (was COP 2,000,000 / USD 500) and valid only for wavival's own services; Lúmina W has its own pricing. Applied in the contact band, the contact and services pages, the services structured data, `llms-full.txt` and `docs/commercial.md`.
- Dependencies: `overrides` for `basic-ftp`, `tmp` and `uuid` clear their advisories and `npm audit fix` updates `http-cache-semantics` to 4.3.0 (24 vulnerabilities down to 14, all high, none with a patched release). `scripts/check-audit.mjs` no longer accepts `GHSA-ch52-4w7c-c8xp`. `docs/ROADMAP.md` tracks the current count.
- Restored the `[3.1.0] - 2026-09-30` section and its compare link: the tag `v3.1.0` existed but its entries were listed under `[4.0.0]`. The 49 entries that were in the changelog at that tag moved to 3.1.0 unchanged.
- README consistency: project structure (`docs/`, `.husky/`, root configuration, no duplicated quote page line), local Husky hooks, `vercel.json` and `microfrontends.json` in the document map, the Accessibility section pointers, and the `npm audit` counts in `docs/ROADMAP.md`.
- Complete documentation set: `docs/seo.md` (SEO, indexing, structured data, GEO), `docs/i18n.md` (Spanish and English), `docs/accessibility.md`, `docs/performance.md`, `docs/security.md` and `docs/engineering.md`, linked from the README, `AGENTS.md` and `SECURITY.md`.
- Documentation of everything: `DESIGN.md` rows for the Stack nav state, disabled buttons, the projects index highlight and the quote form classes; `ProjectCard` props in `COMPONENTS.md`; English URLs in `public/llms.txt` and `public/llms-full.txt`, with the matching `docs/ROADMAP.md` item removed.
- Documentation refresh: README (environment variable table with where each one is read and required, missing scripts, delivery flow and workflows, `api/` and `.github/` in the structure, `AGENTS.md` in the document map), `COMPONENTS.md` and `DESIGN.md` (project filters, quote page, links to `AGENTS.md`), source paths in `docs/brand.md` and `docs/commercial.md`, and resolved items removed from `docs/ROADMAP.md`.

### Removed

- `cspell.json`, which no script, hook or workflow used.

## [4.0.0] - 2026-10-03

### Added

- Quote form (`/cotizar` and `/en/quote`, services and project-type modes): title, short description with the documented response process, placeholders on every field, a required privacy and data-processing consent checkbox, and a submit button that stays disabled until all required fields, one option and the consent are set. `Button` accepts `disabled` and `aria-describedby`.
- `/projects` index: the first visible result under every filter is highlighted with a blue border, top bar and a "Featured" badge (`data-featured`, updated by the filter script); TerraCore PWA, first under "all", also spans two columns there from 1280px (`.project-wide`).
- "Core" label and a blue tint on the Backend and AI Integrations cells of the home stack grid (`featured` in `src/data/stack.ts`).
- `Release` workflow (`.github/workflows/release.yml`) that creates the tag and the GitHub release of a version through the shared `shared-release.yml` of `lumina-w/agents`, and `docs/RELEASING.md` with the process.
- `Bento` molecule and `src/utils/bento.ts`: card grids with irregular column spans whose rows always fill the 12 columns (no lone card in a corner), applied to case-study pain points, modules, learnings and roadmap, the stack grid, the services process and the about method.
- Quote form: red asterisk with a tooltip on required fields, a "Campos obligatorios" note, and a `--danger` token.
- Case studies can render a `roadmap` section (now, next, later, out of scope) and several `chains` cascades; id `cs-roadmap`.
- `wavival.dev` case study (`/proyectos/wavival-dev` and `/en/projects/wavival-dev`) focused on the @wavival | Design System v4 design, with the Claude Design prototype link and an OG card.
- Optional `design` field for case studies, rendered as its own section (`cs-design`).
- Optional `designSystemLink` for case studies, shown beside the design prototype link; set on the `wavival.dev` case study.
- Bilingual quote pages with service preselection, multi-service selection, a 500-word project brief, and an in-page confirmation.
- `api/quote.ts` Vercel Function: validates quote submissions and sends a formatted transactional email through Brevo to `wavival.dev@luminaw.co`.
- Quote form project-type mode: every case study has a `quoteType` and a "Cotizar un proyecto así" button that opens the quote page with `?type=<type>`, showing the project types (web app, landing, API, design, security, AI) instead of the services. `api/quote.ts` accepts `projectTypes`.
- `npm run css:check` (`scripts/check-component-css.mjs`, run in CI `quality`) and `tests/design.spec.ts` as guards against purged component CSS, hover typography regressions, a collapsed mobile menu, and mobile horizontal overflow.
- "@wavival | Design System v4" UI design (UI only, content unchanged), from the Claude Design project `wavival-dev-v4`: 1px rules instead of shadow cards, editorial Raleway 800 display scale, numbered indexes, and a single blue signal.
- Atomic component structure (`src/components/atoms`, `molecules`, `organisms`) replacing `ui/` and `sections/`, plus `ContactBand` shared at the end of home, services, about, and case studies.
- `siteRoutes()` and `ariaCurrent()` helpers in `src/i18n/utils.ts` and the `projectView()` helper in `src/data/projectView.ts`.
- Tests: `tests/projects.spec.ts` (filters), `siteRoutes` cases in `tests/i18n-utils.spec.ts`, and a default-dark case in `tests/theme.spec.ts`.
- `tests/case-studies.spec.ts`: ES and EN parity of every case study, meta descriptions within 160 characters, section ids and project JSON-LD on each case-study page, and `llms.txt` and `llms-full.txt` coverage of every case-study slug.
- Case-study JSON-LD now carries `inLanguage` and `image`.
- `docs/ROADMAP.md` with pending work, decisions that need the owner and known gaps.
- `llms.txt` and `llms-full.txt` list the TerraCore Landing and OKroot Landing case studies, and `llms.txt` lists the X profile.

### Changed

- Tools page (ES/EN): the closing "See projects" and "See services" buttons are centered on every breakpoint.
- Tools page (ES/EN): the Backend row and its stack chips are highlighted in blue with a "Destacado" / "Core" label; the Hardware, Software and GitHub blocks take the full width on mobile; the Hardware block lists both machines again, Linux (Intel Core i5, Fedora) and Windows (AMD Ryzen 5 3400G, Windows 11 Pro, WSL2 Ubuntu), restored from the previous content.
- Tools page (ES/EN): the "Con qué desarrollo" / stack block takes the full width on mobile (below 790px); desktop is unchanged.
- About page (ES/EN): the profile photo is centered on mobile, and the summary row, the closing quote, the CV button and the social icons are centered on desktop (900px and up) and left-aligned on mobile.
- Contact page: the `h1` uses the `--fs-display-xl` token (the unused `--fs-display-contact` token was removed).
- NavBar: the "Stack" link stays marked (`aria-current="location"`, same style as the current page) while the `#stack` section of the home page is in view, on desktop and in the mobile menu. CSP hash of the nav script refreshed.
- CSP: refreshed the `script-src` hash of the quote form script in `vercel.json`.
- `wavival.dev` case study banner (`og-wavival-dev.webp`) is now a screenshot of the @wavival | Design System v4 (colors section) in Claude Design, with updated alt text in ES and EN.
- NullBreach case study roadmap shows only "Now" and "Next"; `later` is now optional in `ProjectRoadmap` and its column renders only when it has items.
- CSP: refreshed the `script-src` hash of the project filters script in `vercel.json` after it began marking the first visible result as featured.
- TerraCore Landing case study (ES/EN) and the `llms` files no longer mention prices: the three plans are described only by their limits and features.
- Mobile: the `/projects` filters and the case-study action buttons are centered.
- Home alignment: the hero is centered on every breakpoint, the mobile menu aligns to the top left, the home project rows keep their actions left on mobile (stack chips and image stay centered), "See all projects" and "Technical criteria" are always centered, and the two footer columns split the width 50/50 on mobile.

- `delete-merged-branches` workflow now deletes the remote branches of pull requests merged into `dev` (through the shared workflow of `lumina-w/agents`, with a `dry_run` input) instead of only reporting them; merges made by the auto-merge job with `GITHUB_TOKEN` do not delete their branch.
- Case-study design links point to each project's Netlify prototype (TerraCore, TerraCore Landing, OKroot, OKroot Landing, Lúmina W, Blog W, wavival.dev) instead of the generic placeholder.
- Quote form: the submit button is centered with its natural width instead of full width.
- The design system is named "@wavival | Design System v4" in the `wavival.dev` case study and the AI-discovery files; that case study has no site link, only the prototype and the design system.
- TerraCore PWA case study rewritten from the repositories: connected modules (vaccine, supply, animal, finance), why offline-first, multi-user and multitenancy, design (with the Claude Design prototype link), results, learnings, and roadmap. Status: in production, in active sales, under validation with clients in Antioquia, Colombia. `llms.txt`, `llms-full.txt`, `docs/brand.md`, and `docs/commercial.md` aligned.
- Delivery governance docs: note that auto-merge merges into `dev` do not trigger the push-based `commitlint` check (leaving the `dev` to `stg` promotion PR blocked) and that `stg` must be synced into `dev` when the promotion PR is `behind`.
- New design tokens (`--bg`, `--surface`, `--line`, `--line-2`, `--tint`, `--text`, `--muted`, `--link`, `--link-h`, `--blue`, `--btn`, `--btn-h`, `--nav`, `--ok`, `--warn`, `--on-btn` plus container, gutter, section, radius, and type-scale variables) replace the previous token set; Tailwind colors, `max-w-container`, `rounded-control`, and `gut`/`sec`/`nav` spacing map to them. Component classes now live in `@layer components`.
- Dark is now the default theme: the pre-paint script applies `.dark` unless `localStorage.theme` is `light`, and no longer follows `prefers-color-scheme`.
- Header is sticky (64px) with an active-link bar; below 900px the menu is a full-screen overlay with numbered links. Language toggle is now the text "EN"/"ES". Footer gains an outlined wordmark.
- Case-study accordion uses native `<details>` ("Ver"/"Cerrar", "View"/"Close"); project filters toggle `display` and `aria-pressed`. Case-study sections have ids `cs-problem`, `cs-architecture`, `cs-decisions`, `cs-results`, `cs-learnings`.
- Home hero photo is a 4:5 frame (320x400). CSP hashes in `vercel.json` updated for the changed inline script set.
- Case studies for TerraCore Landing, OKroot, OKroot Landing, NullBreach, Forgotten Portal, Blog Lúmina W and Lúmina W rewritten in Spanish and English from what each repository does in code. `llms.txt`, `llms-full.txt`, `docs/brand.md` and `COMPONENTS.md` aligned.
- Blog Lúmina W is no longer presented as a PWA (the repository has no manifest, service worker or offline mode) and is filtered only under `full-stack`. It is a bilingual platform with accounts, an approval flow, moderated comments, a newsletter and Claude API translation.
- NullBreach: the landing is described as part of the Next.js application, and moving it to Astro is listed as pending on its roadmap.
- Forgotten Portal is described at methodology and findings level: seven findings with CVSS and CWE, PTES, MITRE ATT&CK, and two reports. It no longer includes credentials, hidden paths or payloads.
- Lúmina W: removed the light and dark mode claim and the "no server" claim; the contact form is a Vercel Function that writes to Supabase.
- OKroot is listed as live in early access in `llms.txt`.
- Meta descriptions of the Lúmina W and TerraCore Landing case studies shortened to 160 characters or fewer.
- `README.md` documentation table (the `DESIGN.md` row had a stray `|` that split the cell) and `COMPONENTS.md` `Project` fields (`quoteType`, `summary`, dates, `appCategory`, `designSystemLink`, and the full list of `en` overrides).

### Removed

- The unvalidated 42% administrative-time figure, the one-week onboarding and "6 modules" metric cards, and the pilot-farm and Urabá producer claims from the TerraCore case studies and AI-discovery files.
- Scroll reveal (`[data-aos]`, IntersectionObserver script, `.aos-in` styles) and the accordion script: the design is static.
- Old tokens and classes (`--brand-blue`, `--brand-blue-text`, `--bg-page`, `--bg-card`, `--accent-link`, `--btn-bg`, `--shadow-base`, `--space-section`, `.section`, `.btn-ghost`, `.card`, `.link`, `.icon-*`, `.profile-photo`) and the `ui/` and `sections/` component folders.
- `docs/blog-w-stack-pendiente.md`: its content was applied to the Blog Lúmina W case study and `docs/brand.md`.

### Security

- Removed the `/api/*` rewrite to `nullbreach-api.wavival.dev` and that origin from the CSP `connect-src`. NullBreach now serves its own API under `/nullbreach/api`, and the rewrite proxied any unknown `/api` path to an external host. `tests/redirects.spec.ts` now asserts that no rewrite exists.
- The CI dependency audit now runs `scripts/check-audit.mjs` instead of `npm audit --audit-level=high --omit=dev`. It still fails on any high or critical advisory in production dependencies, except `GHSA-vfj7-8cjw-p6xm` (`braces`) and `GHSA-ch52-4w7c-c8xp` (`http-cache-semantics`), which have no patched release and only reach the build through `tailwindcss@3` and `astro`. Each accepted advisory is listed with its reason in the script and is reported in the CI log.

### Fixed

- Buttons: `.btn-primary` and `.btn-secondary` were purged from the production CSS (Tailwind could not see `btn-${variant}`), so primary buttons had no fill and secondary buttons no outline. `Button.astro` now maps variants to literal class names.
- The component class `.text-link` collided with the `text-link` color utility, so `hover:text-link` and the active mobile link pulled in the underlined-uppercase style. It is now `.action-link`.
- Mobile menu: the overlay was nested in the `backdrop-filter` header and collapsed to the header height. It is now a sibling of the header and fills the viewport; the current link shows the link color again.
- `/herramientas` and `/en/uses`: the sidebar columns no longer overflow horizontally on mobile (`flex: 0 0 260px`, as in the design).
- Typography parity with the Claude Design prototype: line-height 1.6 by default (Tailwind `fontSize` scale), per-page `h1` display scales (`display-index`, `display-contact`, `display-case`, `display-uses`, `display-about`), `ContactBand` heading leading, about-page spacing (`section-gap` no longer cancelled by `m-0`), method cards, agenda heading and label, legal copy leading plus its closing contact line.
- Removed every `!important` utility from components and replaced repeated inline font sizes with tokens and classes.
- Small blue text now uses the new `--blue-text` token (4.5:1 or better in both themes); filter counts no longer rely on opacity. axe-core reports 0 violations across all routes.

## [3.1.0] - 2026-09-30

### Added

- `docs/brand.md` and `docs/commercial.md`: living brand and commercial guides for the wavival personal brand.
- Lúmina W branch delivery model with `dev` and `stg` environment branches created from `main`.
- PR base validation workflow for `feature/*`, `fix/*`, and `chore/*` branches into `dev`, `dev` into `stg`, and `stg` into `main`.
- Commitlint config, `commit-msg` hook, and CI commit-message enforcement for strict Conventional Commits.
- Gitleaks security scan job using the org-level `GITLEAKS_LICENSE` secret.
- Dev auto-merge workflow using `PROMOTE_TOKEN` and scheduled cleanup reporting for merged work branches.
- `.claude/checkpoint.md` and `.codex/checkpoint.md` with the global production checkpoint.
- PostCSS config for Tailwind 3 processing without the deprecated Astro Tailwind integration.
- `vercel.json` with the Astro build contract, security headers, immutable asset caches, legacy redirects, and API rewrite.
- `microfrontends.json` plus the Vercel Vite integration for NullBreach path ownership.
- `public/.well-known/security.txt` (RFC 9116): security contact, expiry, and canonical URL.
- CI build-status badge in `README.md`, linked to the GitHub Actions `ci.yml` workflow.
- This `CHANGELOG.md`.
- ESLint (flat config: `eslint-plugin-astro` + `typescript-eslint` + `eslint-config-prettier`) with `lint` / `lint:fix` scripts.
- husky `pre-commit` hook running `lint-staged` (ESLint `--fix` + Prettier on staged files).
- `Lint` step in the CI `quality` job.
- Core Web Vitals RUM (`web-vitals` via `src/scripts/vitals.ts`): reports LCP/INP/CLS/FCP/TTFB to Umami as custom events, gated on the Umami env vars.
- "Design & UX" category to the Stack section.
- Sellable contact copy plus a footer CTA.
- Self-hosted fonts in `public/fonts/` (Poppins 400/500/600 static + Raleway variable `wght` 600-800, latin-subset `woff2`), with `font-display: swap` and critical weights preloaded, removing the Google Fonts network request.
- View Transitions via Astro `<ClientRouter />` for SPA-like same-origin navigation; DOM-binding scripts re-run on `astro:page-load` and the pre-paint theme re-applies on `astro:after-swap`.
- `scripts/check-csp-hashes.mjs` (`npm run csp:check`): CI guard asserting every inline `<script>` in `dist/` has a `sha256-*` in the deployment CSP `script-src`. Runs in the CI `quality` job after build.

### Changed

- Replaced the circular profile avatar with a new 640x640 webp portrait that fades softly into the page background behind a thin brand-blue gradient frame, on the home and both about pages.
- Renamed the OKroot case-study routes to `/proyectos/okroot`, `/proyectos/okroot-landing`, and their English equivalents; former `/root` routes redirect permanently.
- Updated OKroot case-study modification dates to 2026-09-26 and aligned route coverage tests, service links, featured projects, LLM discovery files, and repository documentation.
- Portfolio work session closed as complete for 2026-09-26.
- CI now runs on pull requests and pushes for `dev`, `stg`, and `main`.
- Playwright CI job is named `tests` for branch protection clarity.
- README, AGENTS.md, and CLAUDE.md document the delivery flow and required checks.
- Upgraded Astro to 7.3.4 to clear production security advisories.
- Migrated production hosting, public copy, privacy disclosures, deployment tests, and CSP validation to Vercel.
- Pinned local, CI, and Vercel builds to Node 22.
- Excluded generated Vercel build output from ESLint.
- Hardened CSP: `script-src` is now hash-based (sha256 per inline script), dropping `'unsafe-inline'`. Removed the unused `fonts.googleapis.com` / `fonts.gstatic.com` allowances (fonts are self-hosted). `style-src` keeps `'unsafe-inline'` for Astro/Tailwind inline style attributes.
- Repositioned SEO and copy around full-stack (Django + React) identity.
- Reworked the Projects section content and ordering.
- Colors are now token-only (no hardcoded color values in components).
- Synced `COMPONENTS.md`, `DESIGN.md`, and `README.md` to the current code.
- Scroll reveal reimplemented with CSS transitions + IntersectionObserver (inlined, re-run on `astro:page-load`), dropping the AOS dependency.
- Social card `og-card` converted from PNG to WebP (~97 KB → ~21 KB).
- Okroot moved to its own domain: project links and `llms.txt`/`llms-full.txt` now point at `https://okroot.co` (landing) and `https://app.okroot.co` (PWA) instead of `https://wavival.dev/root/`.

### Removed

- Dependabot version-update configuration and its automated weekly pull requests.
- Legacy hosting configuration and repository references.
- AOS animation library (`aos` + `@types/aos`) and its render-blocking ~26 KB stylesheet.
- Full-screen `Loader` overlay (superseded by View Transitions).
- Google Fonts `<link>` and `preconnect`, plus the now-unused `fonts.googleapis.com` / `fonts.gstatic.com` CSP allowances.
- Dead ~200 KB `public/brand/logo-w.ico` (the favicon is already served by the 16 KB `favicon.ico`).
- The obsolete `/root/*` proxy and its unused CSP origins after Okroot moved to `okroot.co`.

### Fixed

- Reverted `tailwindcss` from 4.3.1 back to `^3.4.19`: a Dependabot major bump broke the build. Dependabot now ignores `tailwindcss` major bumps until a Tailwind v4 migration is planned.

## [3.0.0] - 2026-04-12

Third iteration of the portfolio: production-ready bilingual static site.

### Added

- Bilingual routing (ES default at root, EN mirror under `/en/`) with a slug map in `src/i18n/utils.ts`.
- SEO, accessibility, and performance pass: meta/OG/Twitter tags, JSON-LD `@graph`, hreflang alternates, sitemap, `llms.txt`, `robots.txt`.
- Custom `404` route with `noindex` (ES + EN).
- Deployment configuration for security headers (CSP, HSTS, frame-deny), immutable asset cache, and legacy-route redirects.
- API proxy and subdirectory redirects wired through the CSP.

## [2.0.0] - 2025-09-24

Second iteration of the portfolio.

## [1.0.0] - 2025-05-04

First public portfolio release.

[Unreleased]: https://github.com/wavival/wavival.dev/compare/v4.0.0...HEAD
[4.0.0]: https://github.com/wavival/wavival.dev/compare/v3.1.0...v4.0.0
[3.1.0]: https://github.com/wavival/wavival.dev/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/wavival/wavival.dev/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/wavival/wavival.dev/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/wavival/wavival.dev/releases/tag/v1.0.0
