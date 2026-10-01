# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- "Señal v4" UI design (UI only, content unchanged), from the Claude Design project `wavival-dev-v4`: 1px rules instead of shadow cards, editorial Raleway 800 display scale, numbered indexes, and a single blue signal.
- Atomic component structure (`src/components/atoms`, `molecules`, `organisms`) replacing `ui/` and `sections/`, plus `ContactBand` shared at the end of home, services, about, and case studies.
- `siteRoutes()` and `ariaCurrent()` helpers in `src/i18n/utils.ts` and the `projectView()` helper in `src/data/projectView.ts`.
- Tests: `tests/projects.spec.ts` (filters), `siteRoutes` cases in `tests/i18n-utils.spec.ts`, and a default-dark case in `tests/theme.spec.ts`.

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

### Changed

- New design tokens (`--bg`, `--surface`, `--line`, `--line-2`, `--tint`, `--text`, `--muted`, `--link`, `--link-h`, `--blue`, `--btn`, `--btn-h`, `--nav`, `--ok`, `--warn`, `--on-btn` plus container, gutter, section, radius, and type-scale variables) replace the previous token set; Tailwind colors, `max-w-container`, `rounded-control`, and `gut`/`sec`/`nav` spacing map to them. Component classes now live in `@layer components`.
- Dark is now the default theme: the pre-paint script applies `.dark` unless `localStorage.theme` is `light`, and no longer follows `prefers-color-scheme`.
- Header is sticky (64px) with an active-link bar; below 900px the menu is a full-screen overlay with numbered links. Language toggle is now the text "EN"/"ES". Footer gains an outlined wordmark.
- Case-study accordion uses native `<details>` ("Ver"/"Cerrar", "View"/"Close"); project filters toggle `display` and `aria-pressed`. Case-study sections have ids `cs-problem`, `cs-architecture`, `cs-decisions`, `cs-results`, `cs-learnings`.
- Home hero photo is a 4:5 frame (320x400). CSP hashes in `vercel.json` updated for the changed inline script set.
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

### Removed

- Scroll reveal (`[data-aos]`, IntersectionObserver script, `.aos-in` styles) and the accordion script: the design is static.
- Old tokens and classes (`--brand-blue`, `--brand-blue-text`, `--bg-page`, `--bg-card`, `--accent-link`, `--btn-bg`, `--shadow-base`, `--space-section`, `.section`, `.btn-ghost`, `.card`, `.link`, `.icon-*`, `.profile-photo`) and the `ui/` and `sections/` component folders.
- Dependabot version-update configuration and its automated weekly pull requests.
- Legacy hosting configuration and repository references.

### Added

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

- Hardened CSP: `script-src` is now hash-based (sha256 per inline script), dropping `'unsafe-inline'`. Removed the unused `fonts.googleapis.com` / `fonts.gstatic.com` allowances (fonts are self-hosted). `style-src` keeps `'unsafe-inline'` for Astro/Tailwind inline style attributes.
- Repositioned SEO and copy around full-stack (Django + React) identity.
- Reworked the Projects section content and ordering.
- Colors are now token-only (no hardcoded color values in components).
- Synced `COMPONENTS.md`, `DESIGN.md`, and `README.md` to the current code.
- Scroll reveal reimplemented with CSS transitions + IntersectionObserver (inlined, re-run on `astro:page-load`), dropping the AOS dependency.
- Social card `og-card` converted from PNG to WebP (~97 KB → ~21 KB).

### Removed

- AOS animation library (`aos` + `@types/aos`) and its render-blocking ~26 KB stylesheet.
- Full-screen `Loader` overlay (superseded by View Transitions).
- Google Fonts `<link>` and `preconnect`, plus the now-unused `fonts.googleapis.com` / `fonts.gstatic.com` CSP allowances.
- Dead ~200 KB `public/brand/logo-w.ico` (the favicon is already served by the 16 KB `favicon.ico`).

### Changed

- Okroot moved to its own domain: project links and `llms.txt`/`llms-full.txt` now point at `https://okroot.co` (landing) and `https://app.okroot.co` (PWA) instead of `https://wavival.dev/root/`.

### Removed

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

[Unreleased]: https://github.com/wavival/wavival.dev/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/wavival/wavival.dev/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/wavival/wavival.dev/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/wavival/wavival.dev/releases/tag/v1.0.0
