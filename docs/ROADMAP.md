# Roadmap

> Last updated: 2026-11-10

What is pending in the portfolio. Items marked "Decision" need the owner. Pending work of the projects shown here lives in each project's repository: `nullbreach` (`docs/ROADMAP.md`), `forgotten-portal-writeup` (`docs/ROADMAP.md`), `blog-w` (`ROADMAP.md`), `luminaw-page` (`docs/ROADMAP.md`) and `okroot-docs` (`docs/pendientes-*.md`).

## Decisions

- [x] Calendly on the contact pages (resolved 2026-11-09): it loads only after a click, so no third-party cookie reaches the first load; best practices 77 to 100.
- [ ] Payment methods: Bancolombia, Global66 and Bold with a 50% deposit come from the owner's brief (2026-11-09) and appear in the services FAQ and `llms-full.txt`. Add which method applies to which case if that matters.
- [ ] Monthly SEO check (`api/quote.ts`): it counts a won `wavival` lead with a development service, the REST APIs block or a kit, and every refusal answers the same way. A new client asking for a development service and monthly SEO in the same quote is refused today; decide whether that combination should pass.
- [ ] OKroot docs stack: the `docs` part of OKroot describes the same stack as the TerraCore documentation, as stated by the owner. `okroot-docs` has no site yet (only markdown), so check the part against the real site when it ships.
- [ ] Docs page counts: the TerraCore `docs` part states 34 pages in 8 groups (checked against `terracore-docs` on 2026-10-05); update it when the guide grows.
- [ ] NullBreach Swagger: the `api` part links to `https://www.wavival.dev/nullbreach/swagger`. The upstream NullBreach documentation says production returns 404 for it until the next deployment that includes the route. Check the link after that deployment.
- [ ] Blog W as a PWA: the repository has no manifest, service worker or offline mode, so the case study does not claim it. Decide whether to build it or keep it dropped everywhere.
- [ ] OKroot status: `docs/brand.md` and `docs/commercial.md` say "early access"; the case-study tag says "Live". The AI-discovery files now say "live, early access".
- [ ] Filters: decide whether NullBreach (an AI-powered AppSec chat) belongs under the `security` filter, from which it is left out today. Adding it changes the filter count.
- [ ] Internal hourly rate: the 2026 plan defines one, but it is not published and `src/data/pricing.ts` does not hold it because the repository is public. Decide where it lives if a later step needs it.
- [ ] Pricing review: the COP and USD lists in `src/data/pricing.ts` are independent (no exchange rate) and are reviewed every January.
- [x] Decision (resolved 2026-11-09): the removed CV files keep their permanent redirects in `vercel.json`, each to the about page in its own language: `/cv_valentina_ramirez_es.pdf` to `/sobre-mi` and `/cv_valentina_ramirez_en.pdf` to `/en/about`. `tests/redirects.spec.ts` checks both.

## Security

- [ ] Quote function: add a Vercel firewall rule that rate limits `POST /api/quote` (the in-function limit is best-effort per instance). Consider a CAPTCHA only if abuse continues.
- [ ] Currency middleware: Playwright exercises `middleware.ts` as a function and the built pages, not Vercel's edge. On the first preview deployment check the three cases listed in `docs/security.md` ("Settings that live outside the repository"), and that view-transition navigations keep the COP variant.
- [ ] Check the GitHub and Vercel settings listed in `docs/security.md` ("Settings that live outside the repository"): branch protection with required checks, secret scanning with push protection, code scanning. Nothing in the repository can verify them.
- [ ] After the first CodeQL run, review the findings under Security > Code scanning and fix or dismiss each one with a reason.
- [ ] Pin GitHub Actions (and the `lumina-w/agents` workflows) to commit SHAs instead of tags. Bump the pins by hand.
- [ ] Alert on repeated function errors (Vercel log drain or alert) so a failing Brevo key or a failing Supabase insert is noticed before a lead is lost.
- [ ] Lead retention: `/privacidad` promises that leads of people who do not become clients are deleted 24 months after the last contact. No job does it yet; delete the `wavival` rows of `public.leads` whose `contacted_at` (or `created_at` when never contacted) is older than 24 months and whose `status` is not `won`, by hand or with a scheduled function, after the first anniversary of the form (2027-11).
- [ ] Supabase keepalive: `api/keepalive.ts` runs every three days through Vercel Cron so the Free project is not paused. After the first deployment check Vercel > Cron Jobs for the runs and that `CRON_SECRET` is set.
- [ ] Verify in production, after the first deployment with the quote form: submit a real quote and confirm the row in `public.leads` (`product = 'wavival'`) and the notification email; confirm the country header reaches `middleware.ts` (COP variant) and the quote function (`geo_country` filled); confirm the keepalive cron shows a successful run in Vercel > Cron Jobs.
- [ ] Vercel variables for leads: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `CRON_SECRET` in Production only (never Preview). Without the Supabase ones the quote function still emails and the email says the lead was not stored.
- [ ] `QUOTE_ALLOWED_HOSTS`: set it in Vercel only if a domain other than wavival.dev (for example a staging domain) needs the quote form. Without it that domain gets 403.
- [ ] Renew `public/.well-known/security.txt` before 2027-06-18 (CI warns from 2027-04-19 and fails after the date).
- [ ] Review the CSP origin `d3v0px0pttie1i.cloudfront.net` (probably a Calendly asset host) and `style-src 'unsafe-inline'`.
- [x] Clean up the `script-src` hashes in `vercel.json` (resolved 2026-11-09): the 13 hashes that matched no inline script in `dist/` were removed, 7 remain, and `npm run csp:check` now also fails on a hash that no inline script uses.

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
- [x] Axe pass in the Playwright suite (resolved 2026-11-09): `tests/a11y-axe.spec.ts` covers every page in both themes.

## Integrations

- [ ] Social networks by API (phase 2): show the latest Instagram and TikTok posts through their APIs with a server-side cache (build-time or a Vercel function), not through the platforms' embeds, so no third-party script or iframe is added to the CSP and the pages stay static.
- [ ] Later: a chatbot powered by Claude on the site. Not started and left out of the release promoted to production on 2026-11-10 by the owner's decision; scope, data handling and its effect on the CSP are still to be defined. Its launcher goes in the slot reserved between the back-to-top button and WhatsApp in `FloatingActions.astro`.

## Quality and docs
