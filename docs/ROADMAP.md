# Roadmap

> Last updated: 2026-10-05

What is pending in the portfolio. Items marked "Decision" need the owner. Pending work of the projects shown here lives in each project's repository: `nullbreach` (`docs/ROADMAP.md`), `forgotten-portal-writeup` (`docs/ROADMAP.md`), `blog-w` (`ROADMAP.md`), `luminaw-page` (`docs/ROADMAP.md`) and `okroot-docs` (`docs/pendientes-*.md`).

## Decisions

- [ ] OKroot docs stack: the `docs` part of OKroot describes the same stack as the TerraCore documentation, as stated by the owner. `okroot-docs` has no site yet (only markdown), so check the part against the real site when it ships.
- [ ] Docs page counts: the TerraCore `docs` part states 34 pages in 8 groups (checked against `terracore-docs` on 2026-10-05); update it when the guide grows.
- [ ] NullBreach Swagger: the `api` part links to `https://www.wavival.dev/nullbreach/swagger`. The upstream NullBreach documentation says production returns 404 for it until the next deployment that includes the route. Check the link after that deployment.
- [ ] Blog W as a PWA: the repository has no manifest, service worker or offline mode, so the case study does not claim it. Decide whether to build it or keep it dropped everywhere.
- [ ] OKroot status: `docs/brand.md` and `docs/commercial.md` say "early access"; the case-study tag says "Live". The AI-discovery files now say "live, early access".
- [ ] Filters: decide whether NullBreach (an AI-powered AppSec chat) belongs under the `security` filter, from which it is left out today. Adding it changes the filter count.

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
- [ ] Verify the accordion headings (an `h2` inside each `<summary>`) with real screen readers (VoiceOver, NVDA); only Chromium's accessibility tree was checked.
- [ ] Add an axe pass for case-study pages to the Playwright suite (heading order and contrast are checked by hand today).

## Quality and docs
