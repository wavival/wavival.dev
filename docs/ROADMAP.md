# Roadmap

> Last updated: 2026-10-04

What is pending in the portfolio. Items marked "Decision" need the owner. Pending work of the projects shown here lives in each project's repository: `nullbreach` (`docs/ROADMAP.md`), `forgotten-portal-writeup` (`docs/ROADMAP.md`), `blog-w` (`ROADMAP.md`), `luminaw-page` (`docs/ROADMAP.md`) and `okroot-docs` (`docs/pendientes-*.md`).

## Decisions

- [ ] NullBreach landing: it is in Next.js today, and the case study says so. Moving it to Astro is pending on the NullBreach roadmap; update the case study when it ships.
- [ ] Blog W as a PWA: the repository has no manifest, service worker or offline mode, so the case study does not claim it. Decide whether to build it or keep it dropped everywhere.
- [ ] OKroot status: `docs/brand.md` and `docs/commercial.md` say "early access"; the case-study tag says "Live". The AI-discovery files now say "live, early access".
- [ ] Filters: NullBreach has `quoteType: "security"` but is not under the `security` filter. Adding it changes the filter count.

## Security

- [ ] `api/quote.ts` has a honeypot and validation but no rate limit, origin check or CAPTCHA, so it can be used to flood `wavival.dev@luminaw.co`. Add a Vercel WAF rule or a limit in the function.
- [ ] Renew `public/.well-known/security.txt` before 2027-06-18.
- [ ] Review the CSP origin `d3v0px0pttie1i.cloudfront.net` (probably a Calendly asset host) and `style-src 'unsafe-inline'`.
- [ ] `npm audit` reports 14 vulnerabilities (all high) as of 2026-10-04, none with a patched release: `braces` and `extract-zip`, plus the packages that depend on them (`chokidar`, `micromatch`, `fast-glob`, `tailwindcss`, `@vercel/microfrontends`, `eslint-plugin-astro` and `astro-eslint-parser`, and the `@lhci/cli` chain). 6 are in production dependencies and are covered by the advisory accepted in `scripts/check-audit.mjs` (`GHSA-vfj7-8cjw-p6xm`, `braces`); the other 8 are dev-only and do not gate CI. Re-check when a patched version of `braces` or `extract-zip` is published.

## SEO and GEO

- [ ] Add `lastmod` to the sitemap from each project's `dateModified`.
- [ ] Regenerate the Forgotten Portal OG image at 1200 by 630 (it is 1280 by 853 and gets cropped).
- [ ] Decide whether `robots.txt` should name AI crawlers explicitly (GPTBot, ClaudeBot, PerplexityBot, Google-Extended). It allows everyone today.

## Performance and accessibility

- [ ] Preload Poppins 500 and 600 (only 400 and the Raleway variable font are preloaded).
- [ ] Label-in-Name: some controls with visible text have an `aria-label` that does not contain it (the `ContactBand` CTA reads "Quiero mi producto" but is labelled "Ir a la página de contacto"; "Ver servicios" in `ContactBand`, the hero and the about page; the English footer "Uses" link). `DESIGN.md` and `docs/accessibility.md` state the rule, so fix the labels in the code.
- [ ] Add an axe pass for case-study pages to the Playwright suite (heading order and contrast are checked by hand today).

## Quality and docs

- [ ] `quoteType: "api-backend"` and `"ai"` are valid (`src/data/quoteTypes.ts`) but no project uses them.
