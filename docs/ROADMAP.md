# Roadmap

> Last updated: 2026-11-07

What is pending in the portfolio. Items marked "Decision" need the owner. Pending work of the projects shown here lives in each project's repository: `nullbreach` (`docs/ROADMAP.md`), `forgotten-portal-writeup` (`docs/ROADMAP.md`), `blog-w` (`ROADMAP.md`), `luminaw-page` (`docs/ROADMAP.md`) and `okroot-docs` (`docs/pendientes-*.md`).

## Decisions

- [ ] OKroot docs stack: the `docs` part of OKroot describes the same stack as the TerraCore documentation, as stated by the owner. `okroot-docs` has no site yet (only markdown), so check the part against the real site when it ships.
- [ ] Docs page counts: the TerraCore `docs` part states 34 pages in 8 groups (checked against `terracore-docs` on 2026-10-05); update it when the guide grows.
- [ ] NullBreach Swagger: the `api` part links to `https://www.wavival.dev/nullbreach/swagger`. The upstream NullBreach documentation says production returns 404 for it until the next deployment that includes the route. Check the link after that deployment.
- [ ] Blog W as a PWA: the repository has no manifest, service worker or offline mode, so the case study does not claim it. Decide whether to build it or keep it dropped everywhere.
- [ ] OKroot status: `docs/brand.md` and `docs/commercial.md` say "early access"; the case-study tag says "Live". The AI-discovery files now say "live, early access".
- [ ] Filters: decide whether NullBreach (an AI-powered AppSec chat) belongs under the `security` filter, from which it is left out today. Adding it changes the filter count.
- [ ] Internal hourly rate: the 2026 plan defines one, but it is not published and `src/data/pricing.ts` does not hold it because the repository is public. Decide where it lives if a later step needs it.
- [ ] Pricing review: the COP and USD lists in `src/data/pricing.ts` are independent (no exchange rate) and are reviewed every January.

## Security

- [ ] Quote function: add a Vercel firewall rule that rate limits `POST /api/quote` (the in-function limit is best-effort per instance). Consider a CAPTCHA only if abuse continues.
- [ ] Currency middleware: Playwright exercises `middleware.ts` as a function and the built pages, not Vercel's edge. On the first preview deployment check the three cases listed in `docs/security.md` ("Settings that live outside the repository"), and that view-transition navigations keep the COP variant.
- [ ] Check the GitHub and Vercel settings listed in `docs/security.md` ("Settings that live outside the repository"): branch protection with required checks, secret scanning with push protection, code scanning. Nothing in the repository can verify them.
- [ ] After the first CodeQL run, review the findings under Security > Code scanning and fix or dismiss each one with a reason.
- [ ] Pin GitHub Actions (and the `lumina-w/agents` workflows) to commit SHAs instead of tags. Bump the pins by hand.
- [ ] Alert on repeated function errors (Vercel log drain or alert) so a failing Brevo key is noticed before a lead is lost.
- [ ] `QUOTE_ALLOWED_HOSTS`: set it in Vercel only if a domain other than wavival.dev (for example a staging domain) needs the quote form. Without it that domain gets 403.
- [ ] Renew `public/.well-known/security.txt` before 2027-06-18 (CI warns from 2027-04-19 and fails after the date).
- [ ] Review the CSP origin `d3v0px0pttie1i.cloudfront.net` (probably a Calendly asset host) and `style-src 'unsafe-inline'`.

## Dependencies

- [ ] `@lumina-w/dev-standards` (phase 4): the shared commit rules and Husky guards were reverted from this repository because the package resolved over git+ssh from a private repository, which `npm ci` cannot fetch on Vercel or in the shared commitlint workflow. Bring it back once the package is published on GitHub Packages and Vercel holds a read-only token for it. Do not vendor a tarball: this repository is public.
- [ ] Major versions pending a manual migration (checked on 2026-10-05): `typescript` 6 to 7, `web-vitals` 5 to 6 (check the reporting script and its CSP hash) and `prettier-plugin-astro` 0.14 to 1.1 (re-format the whole repository). Do one per pull request, with the full test suite and Lighthouse.

## SEO and GEO

- [ ] Add `lastmod` to the sitemap from each project's `dateModified`.
- [ ] Regenerate the Forgotten Portal OG image at 1200 by 630 (it is 1280 by 853 and gets cropped).
- [ ] Decide whether `robots.txt` should name AI crawlers explicitly (GPTBot, ClaudeBot, PerplexityBot, Google-Extended). It allows everyone today.

## Performance and accessibility

- [ ] Preload Poppins 500 and 600 (only 400 and the Raleway variable font are preloaded).
- [ ] Verify the accordion headings (an `h2` inside each `<summary>`) with real screen readers (VoiceOver, NVDA); only Chromium's accessibility tree was checked.
- [ ] Add an axe pass for case-study pages to the Playwright suite (heading order and contrast are checked by hand today).

## Quality and docs
