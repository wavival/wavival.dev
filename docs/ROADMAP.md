# Roadmap

> Last updated: 2026-10-02

What is pending in the portfolio. Items marked "Decision" need the owner. Pending work of the projects shown here lives in each project's repository: `nullbreach` (`docs/ROADMAP.md`), `forgotten-portal-writeup` (`docs/ROADMAP.md`), `blog-w` (`ROADMAP.md`), `luminaw-page` (`docs/ROADMAP.md`) and `okroot-docs` (`docs/pendientes-*.md`).

## Decisions

- [ ] NullBreach landing: it is in Next.js today, and the case study says so. Moving it to Astro is pending on the NullBreach roadmap; update the case study when it ships.
- [ ] Blog W as a PWA: the repository has no manifest, service worker or offline mode, so the case study does not claim it. Decide whether to build it or keep it dropped everywhere.
- [ ] Positioning wording: the README describes "a backend developer focused on application security"; the site, `llms.txt`, `llms-full.txt` and `docs/brand.md` say "Full Stack Developer (Django, React, Next.js)". Pick one.
- [ ] OKroot status: `docs/brand.md` and `docs/commercial.md` say "early access"; the case-study tag says "Live". The AI-discovery files now say "live, early access".
- [ ] Confirm that the price "desde COP 2.000.000 / USD 500" applies under Lúmina W (open item in `docs/commercial.md`).
- [ ] Filters: NullBreach has `quoteType: "security"` but is not under the `security` filter. Adding it changes the filter count.

## Security

- [ ] `api/quote.ts` has a honeypot and validation but no rate limit, origin check or CAPTCHA, so it can be used to flood `wavival.dev@luminaw.co`. Add a Vercel WAF rule or a limit in the function.
- [ ] Renew `public/.well-known/security.txt` before 2027-06-18.
- [ ] Review the CSP origin `d3v0px0pttie1i.cloudfront.net` (probably a Calendly asset host) and `style-src 'unsafe-inline'`.
- [ ] Confirm that `Button.astro` sets `rel="noopener noreferrer"` itself when it renders `target="_blank"`.
- [ ] `npm audit` reports 14 vulnerabilities (11 high) in dev dependencies through `@lhci/cli` and `uuid`. CI audits production dependencies only, so they do not gate; update `@lhci/cli` when a fix exists.

## SEO and GEO

- [ ] Add `lastmod` to the sitemap from each project's `dateModified`.
- [ ] Regenerate the Forgotten Portal OG image at 1200 by 630 (it is 1280 by 853 and gets cropped).
- [ ] Decide whether `robots.txt` should name AI crawlers explicitly (GPTBot, ClaudeBot, PerplexityBot, Google-Extended). It allows everyone today.
- [ ] Add the English case-study URLs (`/en/projects/<slug>`) to the AI-discovery files.

## Performance and accessibility

- [ ] Preload Poppins 500 and 600 (only 400 and the Raleway variable font are preloaded).
- [ ] Add an axe pass for case-study pages to the Playwright suite (heading order and contrast are checked by hand today).

## Quality and docs

- [ ] Document the scripts missing from the README: `lint:fix`, `format`, `test:ui`, `test:install` and `commitlint`.
- [ ] `quoteType: "api-backend"` is valid but no project uses it.
