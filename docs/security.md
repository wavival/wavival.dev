# Security

> Last updated: 2026-10-06

What protects the site and the quote function, and what to do when you change something that touches them. To report a vulnerability, see [`../SECURITY.md`](../SECURITY.md).

## Surface

The site is static. The only server code is `api/quote.ts` (a Vercel Function), plus whatever Vercel serves. `/nullbreach` belongs to a different Vercel application (`microfrontends.json`) with its own repository and policy. There are no user accounts, no database and no cookies.

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
- `script-src 'self'` plus 17 `sha256-` hashes (one per distinct inline script), plus `https://cloud.umami.is`, `https://analytics.umami.is` and `https://assets.calendly.com`.
- `connect-src 'self'` plus the Umami hosts and `https://calendly.com`; `frame-src https://calendly.com`.
- `style-src 'self' 'unsafe-inline'` plus `https://assets.calendly.com`; `font-src 'self'`.
- `img-src 'self' data:` plus `https://*.calendly.com` and one CloudFront host (`d3v0px0pttie1i.cloudfront.net`).

### Keeping the hashes valid

Inline scripts (theme, navigation loader, the Calendly loader on the contact page, bundled module scripts that Astro inlines; JSON-LD is data and exempt) are allowed only by hash. When an inline script changes, its hash changes and the browser would block it in production.

1. `npm run build`
2. `npm run csp:check` (`scripts/check-csp-hashes.mjs`, which reads `dist/`) lists every inline script whose hash is missing from `vercel.json`.
3. Replace the stale hash with the new one in `script-src`; CI runs the same check.

## The quote function (`api/quote.ts`)

- Accepts only `POST`; anything else returns 405. Responses carry `Cache-Control: no-store`; success is 201.
- Checks run in this order, and a failure stops the request:
  1. Origin: the `Origin` header must be `https://www.wavival.dev`, `https://wavival.dev`, an `http://localhost` or `http://127.0.0.1` origin, the host of the running Vercel deployment (`VERCEL_URL`, `VERCEL_BRANCH_URL`) or a host listed in `QUOTE_ALLOWED_HOSTS`. Anything else, or a missing header, returns 403. This stops other sites from using the visitor's browser to post to the function; it is not authentication, because a script can set any header.
  2. Content type: `application/json` only; anything else returns 415.
  3. Rate limit: 5 requests per source address in 10 minutes, answered with 429 and `Retry-After`. The address comes from `x-real-ip` or the first `x-forwarded-for` value, is held only in the memory of the function instance (at most 1000 entries, expired ones pruned) and is never stored or sent anywhere. It is best-effort: each Vercel instance keeps its own count and a restart clears it, so the durable limit is a Vercel firewall rule (see "Settings that live outside the repository").
  4. Body: more than 20,000 characters returns 413; a body that is not JSON returns 400.
- Validates every field on the server. Name (up to 120 characters), business (up to 160), email (up to 254, well formed), phone and description are required. The phone must be in international format (`+` and 8 to 15 digits; spaces, parentheses and hyphens are stripped first). The description has up to 5000 characters and 500 words. At least one known service or project type is needed. Unknown values are discarded; invalid requests return 400.
- Honeypot: a filled `website` field returns the same 201 success without sending anything.
- Output is escaped (`escapeHtml`) before it goes into the email HTML.
- The email goes to `wavival.dev@luminaw.co` through the Brevo API with a 10 second timeout; `replyTo` is the sender. Nothing is stored.
- `BREVO_API_KEY` is read from the server environment only and never has the `PUBLIC_` prefix. Without it the function returns 500; if Brevo fails, answers with an error or does not answer in time it returns 502.
- Failures are written to the Vercel function logs with a fixed message and, for Brevo, only the status code: never the name, email, phone or description. Those logs are the only monitoring today.
- The browser form posts to the same origin and keeps the submit button disabled until the form and the privacy consent are complete. Any non-success response shows the generic error message.
- Tests: `tests/quote-api.spec.ts` covers validation, origin, content type, size, rate limit, Brevo failures and the honeypot.
- Not implemented: CAPTCHA. Add it only if the rate limit and the firewall rule prove insufficient.

## Data and privacy

- Quote data: name, email, phone, business, selected services and description, used only to answer the request (`/privacidad`). The source address used by the rate limit is not part of that data and is not stored; `/privacidad` and `/en/privacy/` say so (section 02).
- Analytics: Umami, cookieless and aggregated, enabled only when both variables are set. No tracking cookies, so no consent banner.
- Third parties: Brevo (quote delivery), Calendly (contact page), Vercel (hosting and logs). Fonts are self-hosted.

## Supply chain and repository

- `scripts/check-audit.mjs` fails CI on high or critical advisories in production dependencies unless the advisory is listed with a reason in `ACCEPTED`. The list is empty today: `npm audit` reports 0 vulnerabilities. Add an entry only when no patched release exists, with the reason and when to look at it again. The script reports an accepted advisory that is no longer flagged so it can be removed.
- `package.json` `overrides` pin patched versions of transitive packages: `basic-ftp`, `tmp` and `uuid`; `lighthouse`, `puppeteer-core` and `@puppeteer/browsers` (the Lighthouse CI chain, which also drops `extract-zip`); and `js-yaml` 4 inside `@lhci/utils` (it removes `argparse` 1 and `sprintf-js`; it is safe because `lighthouserc.json` is JSON and `@lhci/utils` only calls the removed `yaml.safeLoad` for YAML configuration files). `eslint-plugin-astro` is on 3, which fixes the `fast-glob` chain of `astro-eslint-parser`. `@vercel/microfrontends` was removed: its Vite plugin only served the local development proxy, production routing of `/nullbreach` stays in `microfrontends.json`, and the package carried the `braces` advisory (GHSA-vfj7-8cjw-p6xm, no patched release) through `fast-glob` and `micromatch`. `npm audit` reports 0 vulnerabilities. Tailwind 4 and `npm audit fix` cleared the others.
- Gitleaks scans every push and pull request (`.github/workflows/gitleaks.yml`).
- CodeQL (`.github/workflows/codeql.yml`) analyzes the TypeScript, JavaScript and GitHub Actions code on pushes and pull requests to `dev`, `stg` and `main`, and weekly. Results appear under Security > Code scanning.
- Dependabot (`.github/dependabot.yml`) opens weekly pull requests to `dev` for npm packages (minor and patch versions, grouped) and GitHub Actions (including major versions), titled `chore(deps): ...`. npm major versions are ignored and migrated by hand (see [`ROADMAP.md`](./ROADMAP.md)). Dependabot pull requests are not auto-merged: a person reviews them, and CI must be green.
- Reusable workflows come from the public repository `lumina-w/agents`, pinned to a tag. First-party actions are pinned to a major version tag.
- `scripts/check-security-txt.mjs` runs in CI (`npm run security-txt:check`): it fails when `security.txt` has expired and warns during the last 60 days.
- Secrets live only in Vercel and GitHub settings. `.env` is ignored by git; `.env.example` documents the names without values.
- Links that open a new tab get `rel="noopener noreferrer"` (`Button` and `TextLink`).
- `public/.well-known/security.txt` (RFC 9116) expires on 2027-06-18 and must be renewed before then; CI warns from 2027-04-19 and fails after the date.

## OWASP Top 10 (2021) coverage

How each category applies to this site, what covers it and what is left. "Not applicable" means the site has no such feature today; if it gains one, the category applies.

| Category                               | Status         | What covers it                                                                                                                                            | Gap                                                      |
| -------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| A01 Broken Access Control              | Not applicable | No accounts, roles or protected data. The only function accepts one action and checks the request origin.                                                 | None.                                                    |
| A02 Cryptographic Failures             | Covered        | HTTPS only (`Strict-Transport-Security` with preload, `upgrade-insecure-requests`); the Brevo key lives in server variables; no passwords or stored data. | None.                                                    |
| A03 Injection                          | Covered        | Server-side validation and allow-lists, `escapeHtml` in the email, JSON body parsed as data, CSP with script hashes, no `eval`, no SQL.                   | None.                                                    |
| A04 Insecure Design                    | Partial        | Honeypot, field limits, body limit, origin check, rate limit, timeout and generic errors.                                                                 | Rate limit is per instance; no CAPTCHA.                  |
| A05 Security Misconfiguration          | Partial        | Full header set (CSP, HSTS, framing, MIME sniffing, referrer, permissions, opener), checked by `tests/security-headers.spec.ts`; `.env` ignored.          | `style-src 'unsafe-inline'`; the CloudFront image host.  |
| A06 Vulnerable and Outdated Components | Partial        | `check-audit.mjs` gates CI on production advisories; Dependabot; CodeQL; overrides for patched transitive packages.                                       | Advisories without a patched release (see `ROADMAP.md`). |
| A07 Identification and Authentication  | Not applicable | No login on this site. `/nullbreach` is another application with its own policy.                                                                          | None here.                                               |
| A08 Software and Data Integrity        | Partial        | Lockfile with `npm ci`, hashed inline scripts, reusable workflows pinned to a tag, Gitleaks, CodeQL on workflows, `contents: read` permissions.           | Actions are pinned to tags, not commit SHAs.             |
| A09 Logging and Monitoring             | Partial        | The function logs every failure without personal data; Vercel keeps the logs; CI reports every check.                                                     | No alert on repeated function errors.                    |
| A10 Server-Side Request Forgery        | Not applicable | The function calls one fixed Brevo URL; no request or user value reaches the URL.                                                                         | None.                                                    |

## Settings that live outside the repository

These are set in GitHub and Vercel, so no pull request can enforce them. Check them after any change of repository, plan or team, and tick them off in [`ROADMAP.md`](./ROADMAP.md).

- GitHub, Settings > Rules or Branches: `dev`, `stg` and `main` protected, pull request required, status checks required (`quality`, `tests`, `lighthouse`, `links`, `gitleaks`, commit lint, PR title, base check), force pushes and deletions blocked.
- GitHub, Settings > Code security: Dependabot alerts and security updates, secret scanning with push protection, and code scanning (fed by `codeql.yml`) enabled.
- Vercel, Firewall: a rate limit rule on `POST /api/quote` (for example 5 requests per 10 minutes per IP) so the limit survives instance restarts and spans instances.
- Vercel, Environment variables: `BREVO_API_KEY` in Production and Preview only; `QUOTE_ALLOWED_HOSTS` only when another domain (for example a staging domain) must post quotes.
- Gitleaks over the whole history: run `gitleaks git` once from a clone after any change of its configuration; the CI job scans each push.

## Checklist for a change

- New inline script: update the CSP hash and run `npm run csp:check`.
- New third-party host: add the minimum CSP directive, document it here and in the privacy page.
- New environment variable: document it in the README table and `.env.example`; use `PUBLIC_` only for values safe to expose.
- Change to `api/quote.ts`: keep the origin, content type, rate limit and body checks, server-side validation and escaping, and update `tests/quote-api.spec.ts`.
- New feature with accounts, uploads, stored data or outbound requests: revisit the OWASP table above before merging.
- Change to the headers: update the table above and `tests/security-headers.spec.ts`.
- Never put secrets, client data or vulnerabilities in the repository, issues or pull requests.

## Known gaps

See [`ROADMAP.md`](./ROADMAP.md): the quote limit is per instance and has no CAPTCHA, actions are pinned to tags and not SHAs, the CloudFront image host and `style-src 'unsafe-inline'` are to review.
