# Security

> Last updated: 2026-11-09

What protects the site, the quote and keepalive functions, the leads database and the currency middleware, and what to do when you change something that touches them. To report a vulnerability, see [`../SECURITY.md`](../SECURITY.md).

## Surface

The site is static. The server code is `api/quote.ts` and `api/keepalive.ts` (Vercel Functions) and `middleware.ts` (a Vercel Edge Middleware that only chooses which prebuilt page to serve), plus whatever Vercel serves. `/nullbreach` belongs to a different Vercel application (`microfrontends.json`) with its own repository and policy. There are no user accounts and no cookies. Quote leads are stored in the Supabase project `db-luminaw-terracore-okroot-pages` (table `public.leads`, shared with TerraCore, OKroot and Lúmina W), which only the functions reach with the service role key.

## The currency middleware (`middleware.ts`)

- Runs only on the priced routes (`/servicios`, `/cotizar`, `/en/services`, `/en/quote`, with and without the trailing slash) and on the internal `/cop/` prefix; every other path never reaches it (`config.matcher`).
- Reads one header, `x-vercel-ip-country`, which Vercel sets at the edge and the client cannot spoof. When it is `CO` the request is rewritten internally to the prebuilt `/cop/...` variant of the same page; anything else, or no header, serves the public USD page. It never reads, logs or stores the address, and it sets no cookie.
- A direct request to `/cop/...` is answered with a 308 to the public URL, so the only way to see COP is to be in Colombia. Query strings, cookies and client headers have no effect (`tests/currency.spec.ts`).
- `GEO_COUNTRY_OVERRIDE` replaces the detected country only when `VERCEL_ENV` is not `production`; it exists to check the COP variant from a preview deployment or `vercel dev`. In production it is ignored even if set.
- The variant pages are the same Astro pages built under another path: same inline scripts and CSP hashes, same canonical URL, hreflang and structured data (`publicUrl` in `Layout.astro`), and they are excluded from the sitemap. Nothing new is loaded, so the CSP does not change.
- It has no dependencies: the rewrite and pass-through responses are the `x-middleware-rewrite` and `x-middleware-next` headers the official helpers emit.

## Response headers (`vercel.json`, every path)

| Header                       | Value                                                          |
| ---------------------------- | -------------------------------------------------------------- |
| `X-Frame-Options`            | `DENY`                                                         |
| `X-Content-Type-Options`     | `nosniff`                                                      |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                              |
| `Permissions-Policy`         | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
| `Cross-Origin-Opener-Policy` | `same-origin`                                                  |
| `Strict-Transport-Security`  | `max-age=63072000; includeSubDomains; preload`                 |
| `Content-Security-Policy`    | see below                                                      |

## Content Security Policy

- `default-src 'self'`; `object-src 'none'`; `frame-ancestors 'none'`; `base-uri 'self'`; `form-action 'self'`; `upgrade-insecure-requests`.
- `script-src 'self'` plus 8 `sha256-` hashes (one per distinct inline script, none left over), plus `https://cloud.umami.is`, `https://analytics.umami.is` and `https://assets.calendly.com`.
- `connect-src 'self'` plus the Umami hosts and `https://calendly.com`; `frame-src https://calendly.com`.
- `style-src 'self' 'unsafe-inline'` plus `https://assets.calendly.com`; `font-src 'self'`.
- `img-src 'self' data:` plus `https://*.calendly.com` and one CloudFront host (`d3v0px0pttie1i.cloudfront.net`).

### Keeping the hashes valid

Inline scripts (theme, navigation loader, the Calendly loader on the contact page, bundled module scripts that Astro inlines; JSON-LD is data and exempt) are allowed only by hash. When an inline script changes, its hash changes and the browser would block it in production.

1. `npm run build`
2. `npm run csp:check` (`scripts/check-csp-hashes.mjs`, which reads `dist/`) lists every inline script whose hash is missing from `vercel.json` and every hash in `vercel.json` that no inline script uses; either one fails the check.
3. Replace the stale hash with the new one in `script-src`, or remove it when its script is gone; CI runs the same check.

## The quote function (`api/quote.ts`)

- Accepts only `POST`; anything else returns 405. Responses carry `Cache-Control: no-store`; success is 201.
- Monthly SEO is sold only to development clients: a quote that asks for `monthly-seo` is accepted only when `public.leads` holds a `wavival` lead with status `won`, the same email and at least one development service, the REST APIs block or a kit. The lookup is a read (`select=id&limit=1`); when it finds nothing, fails or the Supabase variables are missing, the function answers 422 `Development clients only` and neither stores nor emails the quote. The form then shows the development-clients message instead of the generic error.
- Checks run in this order, and a failure stops the request:
  1. Origin: the `Origin` header must be `https://www.wavival.dev`, `https://wavival.dev`, an `http://localhost` or `http://127.0.0.1` origin, the host of the running Vercel deployment (`VERCEL_URL`, `VERCEL_BRANCH_URL`) or a host listed in `QUOTE_ALLOWED_HOSTS`. Anything else, or a missing header, returns 403. This stops other sites from using the visitor's browser to post to the function; it is not authentication, because a script can set any header.
  2. Content type: `application/json` only; anything else returns 415.
  3. Rate limit: 5 requests per source address in 10 minutes, answered with 429 and `Retry-After`. The address comes from `x-real-ip` or the first `x-forwarded-for` value, is held only in the memory of the function instance (at most 1000 entries, expired ones pruned) and is never stored or sent anywhere. It is best-effort: each Vercel instance keeps its own count and a restart clears it, so the durable limit is a Vercel firewall rule (see "Settings that live outside the repository").
  4. Body: more than 20,000 characters returns 413; a body that is not JSON returns 400.
- Validates every field on the server against closed lists (`src/data/quoteOptions.ts`, `src/data/countries.ts`, `src/data/pricing.ts`, `src/utils/currency.ts`). Name (up to 120 characters), business (up to 160), email (up to 254, well formed), phone, description, services, country, budget range, currency, locale, consent and source are required. The phone must be in international format (`+` and 8 to 15 digits; spaces, parentheses and hyphens are stripped first). The description has up to 5000 characters and 500 words. Services must all be catalog ids (the ids of the previous form are mapped first: `custom-web-applications`, `ai-integrations`, `security-appsec`), the country an ISO 3166-1 alpha-2 code of the list, the currency `COP` or `USD`, the budget range one of the seven ids with bounds in that currency, the locale `es` or `en`, the three optional fields (how found, preferred channel, timeline) empty or one of their options, `consent` exactly `true`, and `source` a path that starts with `/cotizar`, `/en/quote` or their `/cop/` variants. Anything else returns 400; nothing unknown is silently dropped.
- Reads two request headers into the lead: `x-vercel-ip-country` (set by Vercel, stored as `geo_country`) and `user-agent` (trimmed to 512 characters). The address is never read or stored. `consent_at` is the server time.
- Honeypot: a filled `website` field returns the same 201 success without sending anything.
- Output is escaped (`escapeHtml`) before it goes into the email HTML.
- Stores the lead first, then notifies. The insert goes to `public.leads` through PostgREST (`src/server/supabase.ts`, `POST /rest/v1/leads` with `Prefer: return=minimal`, 10 second timeout) as `product = 'wavival'` with `name`, `email`, `phone`, `company`, `message`, `services`, `country`, `geo_country`, `budget_range`, `currency`, `how_found`, `preferred_channel`, `timeline`, `locale`, `user_agent`, `source` and `consent_at`. The email then goes to `wavival.dev@luminaw.co` through the Brevo API with a 10 second timeout, `replyTo` the sender, every field above and the line "Guardado en base de datos: sí / no".
- Answers 201 when at least one of the two channels worked and 502 only when both failed (a missing variable counts as a failure of that channel), so a database outage never loses the email and an email outage never loses the row.
- `BREVO_API_KEY`, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are read from the server environment only and never have the `PUBLIC_` prefix. The service role key bypasses RLS, so `src/server/supabase.ts` is imported only by the functions and never by browser code.
- Failures are written to the Vercel function logs with a fixed message ("Supabase insert failed or timed out", "Supabase variables are not set, lead not stored", "Brevo request failed or timed out") and, for Brevo, only the status code: never the name, email, phone, description or any key. Those logs are the only monitoring today.
- The browser form posts to the same origin and keeps the submit button disabled until the form and the privacy consent are complete. Any non-success response shows the generic error message.
- Tests: `tests/quote-api.spec.ts` covers the closed-list validation, the legacy id mapping, the stored row, the email content, origin, content type, size, rate limit, each channel failing alone and both together, the honeypot, and that neither key nor any personal data reaches a response or a log line.

## The keepalive function (`api/keepalive.ts`)

- Supabase pauses a Free project after seven days without requests. `vercel.json` schedules a Vercel Cron (`0 9 */3 * *`, every three days) that calls `GET /api/keepalive`.
- Vercel sends the cron request with `Authorization: Bearer <CRON_SECRET>`; the function answers 401 to any other value, to a missing header and when `CRON_SECRET` is not set, and 405 to anything but `GET`.
- It runs one `HEAD /rest/v1/leads?select=id&limit=1` with the service role key and returns `{ "ok": "true" }`: no row, column or count leaves the function. A failure returns 502 (500 when the Supabase variables are missing) with a fixed log line.
- Tests: `tests/keepalive-api.spec.ts`.
- Not implemented: CAPTCHA. Add it only if the rate limit and the firewall rule prove insufficient.

## Data and privacy

- Quote data: name, email, phone, business name, services, country, budget range and currency, description, the three optional answers, page language, user agent, entry page and consent time, stored in Supabase (us-east-1) to follow up and emailed to the owner (`/privacidad`, sections 02, 04 and 05). The source address used by the rate limit is not part of that data and is not stored; the detected country code is stored (`geo_country`) but the address is not.
- Retention: leads of people who do not become clients are deleted 24 months after the last contact, and earlier on request to `wavival.dev@luminaw.co`. The deletion is a pending job (see `ROADMAP.md`).
- Database access: RLS is enabled on `public.leads` with no policies, and `anon` and `authenticated` have no grants, so the Supabase anon key cannot read or write leads. The service role key lives only in Vercel. The migration is `supabase/migrations/20261108120000_wavival_quote_leads.sql`.
- Country: the middleware reads the country code Vercel derives from the address to pick the currency of the page and does not store it; the quote function stores the same code with the lead. The address itself is never read by either.
- Analytics: Umami, cookieless and aggregated, enabled only when both variables are set. No tracking cookies, so no consent banner.
- Third parties: Supabase (lead storage), Brevo (quote delivery), Calendly (contact page), Vercel (hosting, logs and cron). Fonts are self-hosted.

## Supply chain and repository

- `scripts/check-audit.mjs` fails CI on high or critical advisories in production dependencies unless the advisory is listed with a reason in `ACCEPTED`. The list is empty today: `npm audit` reports 0 vulnerabilities. Add an entry only when no patched release exists, with the reason and when to look at it again. The script reports an accepted advisory that is no longer flagged so it can be removed.
- `package.json` `overrides` pin patched versions of transitive packages: `basic-ftp`, `tmp` and `uuid`; `lighthouse`, `puppeteer-core` and `@puppeteer/browsers` (the Lighthouse CI chain, which also drops `extract-zip`); and `js-yaml` 4 inside `@lhci/utils` (it removes `argparse` 1 and `sprintf-js`; it is safe because `lighthouserc.json` is JSON and `@lhci/utils` only calls the removed `yaml.safeLoad` for YAML configuration files). `eslint-plugin-astro` is on 3, which fixes the `fast-glob` chain of `astro-eslint-parser`. `@vercel/microfrontends` was removed: its Vite plugin only served the local development proxy, production routing of `/nullbreach` stays in `microfrontends.json`, and the package carried the `braces` advisory (GHSA-vfj7-8cjw-p6xm, no patched release) through `fast-glob` and `micromatch`. `npm audit` reports 0 vulnerabilities. Tailwind 4 and `npm audit fix` cleared the others.
- Gitleaks scans every push and pull request (`.github/workflows/gitleaks.yml`).
- CodeQL (`.github/workflows/codeql.yml`) analyzes the TypeScript, JavaScript and GitHub Actions code on pushes and pull requests to `dev`, `stg` and `main`, and weekly. Results appear under Security > Code scanning.
- Dependency updates are manual. Run `npm outdated` and `npm audit` periodically; `check-audit.mjs` gates CI on production advisories. npm major versions are migrated by hand in their own pull request (see [`ROADMAP.md`](./ROADMAP.md)).
- Reusable workflows come from the public repository `lumina-w/agents`, pinned to a tag. First-party actions are pinned to a major version tag.
- `scripts/check-security-txt.mjs` runs in CI (`npm run security-txt:check`): it fails when `security.txt` has expired and warns during the last 60 days.
- Secrets live only in Vercel and GitHub settings. `.env` is ignored by git; `.env.example` documents the names without values.
- Links that open a new tab get `rel="noopener noreferrer"` (`Button` and `TextLink`).
- `public/.well-known/security.txt` (RFC 9116) expires on 2027-06-18 and must be renewed before then; CI warns from 2027-04-19 and fails after the date.

## OWASP Top 10 (2021) coverage

How each category applies to this site, what covers it and what is left. "Not applicable" means the site has no such feature today; if it gains one, the category applies.

| Category                               | Status         | What covers it                                                                                                                                                                                                                                                                                                                                                     | Gap                                                      |
| -------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| A01 Broken Access Control              | Covered        | No accounts or roles on the site. The leads table has RLS enabled with no policies and no grants to `anon` or `authenticated`; only the service role key, held in Vercel, reaches it from the two functions. The quote function accepts one action and checks the request origin; the keepalive requires `CRON_SECRET`; the middleware only picks a prebuilt page. | None.                                                    |
| A02 Cryptographic Failures             | Covered        | HTTPS only (`Strict-Transport-Security` with preload, `upgrade-insecure-requests`); the Brevo key, the Supabase service key and the cron secret live in server variables; leads travel to Supabase over TLS and rest in a managed Postgres.                                                                                                                        | None.                                                    |
| A03 Injection                          | Covered        | Server-side validation against closed lists, `escapeHtml` in the email, JSON body parsed as data, the insert sent to PostgREST as JSON (no SQL is built from input), CSP with script hashes, no `eval`.                                                                                                                                                            | None.                                                    |
| A04 Insecure Design                    | Partial        | Honeypot, field limits, body limit, origin check, rate limit, timeout and generic errors. Currency decided from a header the client cannot set; the override is ignored in production.                                                                                                                                                                             | Rate limit is per instance; no CAPTCHA.                  |
| A05 Security Misconfiguration          | Partial        | Full header set (CSP, HSTS, framing, MIME sniffing, referrer, permissions, opener), checked by `tests/security-headers.spec.ts`; `.env` ignored.                                                                                                                                                                                                                   | `style-src 'unsafe-inline'`; the CloudFront image host.  |
| A06 Vulnerable and Outdated Components | Partial        | `check-audit.mjs` gates CI on production advisories; CodeQL; overrides for patched transitive packages.                                                                                                                                                                                                                                                            | Advisories without a patched release (see `ROADMAP.md`). |
| A07 Identification and Authentication  | Not applicable | No login on this site. `/nullbreach` is another application with its own policy.                                                                                                                                                                                                                                                                                   | None here.                                               |
| A08 Software and Data Integrity        | Partial        | Lockfile with `npm ci`, hashed inline scripts, reusable workflows pinned to a tag, Gitleaks, CodeQL on workflows, `contents: read` permissions.                                                                                                                                                                                                                    | Actions are pinned to tags, not commit SHAs.             |
| A09 Logging and Monitoring             | Partial        | Both functions log every failure without personal data or keys; the middleware logs nothing; Vercel keeps the logs and the cron history; the email says whether the lead was stored; CI reports every check.                                                                                                                                                       | No alert on repeated function errors.                    |
| A10 Server-Side Request Forgery        | Not applicable | The functions call two fixed destinations: the Brevo URL and the Supabase project URL from a server variable; no request or user value reaches a URL.                                                                                                                                                                                                              | None.                                                    |

## Settings that live outside the repository

These are set in GitHub and Vercel, so no pull request can enforce them. Check them after any change of repository, plan or team, and tick them off in [`ROADMAP.md`](./ROADMAP.md).

- GitHub, Settings > Rules or Branches: `dev`, `stg` and `main` protected, pull request required, status checks required (`quality`, `tests`, `lighthouse`, `links`, `gitleaks`, commit lint, PR title, base check), force pushes and deletions blocked.
- GitHub, Settings > Code security: secret scanning with push protection, and code scanning (fed by `codeql.yml`) enabled.
- Vercel, Firewall: a rate limit rule on `POST /api/quote` (for example 5 requests per 10 minutes per IP) so the limit survives instance restarts and spans instances.
- Vercel, Environment variables: `BREVO_API_KEY` in Production and Preview only; `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `CRON_SECRET` in Production only, never in Preview or Development, so no preview deployment can reach the shared database (a quote sent from a preview is emailed with "Guardado en base de datos: no" and the cron only runs in production); `QUOTE_ALLOWED_HOSTS` only when another domain (for example a staging domain) must post quotes; `GEO_COUNTRY_OVERRIDE` never in Production (the code ignores it there, but keep it out as well).
- Vercel, Cron Jobs: `/api/keepalive` every three days (`vercel.json`); check the first runs after the deployment.
- Supabase, project `db-luminaw-terracore-okroot-pages`: `public.leads` with RLS enabled, no policies, no grants to `anon` or `authenticated`. After the 2026-11-08 migration the security advisor reports only the INFO notice "RLS enabled, no policy", which is the intended state, and the performance advisor only the two new indexes as unused so far. Any change goes through a migration file in `supabase/migrations/` shown to the owner first, because the table is shared with TerraCore, OKroot and Lúmina W.
- Vercel, first deployment of the middleware: check from a preview deployment that `/servicios` returns the COP variant with `GEO_COUNTRY_OVERRIDE=CO`, that `/cop/servicios` redirects to `/servicios`, and that `/servicios` without the override shows USD.
- Gitleaks over the whole history: run `gitleaks git` once from a clone after any change of its configuration; the CI job scans each push.

## Checklist for a change

- New inline script: update the CSP hash and run `npm run csp:check`.
- New third-party host: add the minimum CSP directive, document it here and in the privacy page.
- New environment variable: document it in the README table and `.env.example`; use `PUBLIC_` only for values safe to expose.
- Change to `api/quote.ts`: keep the origin, content type, rate limit and body checks, the closed-list validation and escaping, the store-then-email order and the 201/502 rule, and update `tests/quote-api.spec.ts`.
- Change to the database: write a new file in `supabase/migrations/`, show the full SQL to the owner and apply it only after her confirmation; never touch the columns of the other products; run the Supabase security advisors afterwards.
- New page with a price: add its route to `PRICED_ROUTES` (`src/utils/currency.ts`), to the matcher in `middleware.ts` and a one-line variant page under `src/pages/cop/`; `tests/currency.spec.ts` checks the three stay in sync and that no page mixes currencies.
- New feature with accounts, uploads, stored data or outbound requests: revisit the OWASP table above before merging.
- Change to the headers: update the table above and `tests/security-headers.spec.ts`.
- Never put secrets, client data or vulnerabilities in the repository, issues or pull requests.

## Known gaps

See [`ROADMAP.md`](./ROADMAP.md): the quote limit is per instance and has no CAPTCHA, actions are pinned to tags and not SHAs, the CloudFront image host and `style-src 'unsafe-inline'` are to review.
