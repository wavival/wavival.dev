# Security

> Last updated: 2026-10-04

What protects the site and the quote function, and what to do when you change something that touches them. To report a vulnerability, see [`../SECURITY.md`](../SECURITY.md).

## Surface

The site is static. The only server code is `api/quote.ts` (a Vercel Function), plus whatever Vercel serves. `/nullbreach` belongs to a different Vercel application (`microfrontends.json`) with its own repository and policy. There are no user accounts, no database and no cookies.

## Response headers (`vercel.json`, every path)

| Header                      | Value                                          |
| --------------------------- | ---------------------------------------------- |
| `X-Frame-Options`           | `DENY`                                         |
| `X-Content-Type-Options`    | `nosniff`                                      |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`     |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Content-Security-Policy`   | see below                                      |

## Content Security Policy

- `default-src 'self'`; `frame-ancestors 'none'`; `base-uri 'self'`; `form-action 'self'`; `upgrade-insecure-requests`.
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

- Accepts only `POST`; anything else returns 405, and a body that is not JSON returns 400. Responses carry `Cache-Control: no-store`; success is 201.
- Validates every field on the server. Name (up to 120 characters), business (up to 160), email (up to 254, well formed), phone and description are required. The phone must be in international format (`+` and 8 to 15 digits; spaces, parentheses and hyphens are stripped first). The description has up to 5000 characters and 500 words. At least one known service or project type is needed. Unknown values are discarded; invalid requests return 400.
- Honeypot: a filled `website` field returns the same 201 success without sending anything.
- Output is escaped (`escapeHtml`) before it goes into the email HTML.
- The email goes to `wavival.dev@luminaw.co` through the Brevo API; `replyTo` is the sender. Nothing is stored.
- `BREVO_API_KEY` is read from the server environment only and never has the `PUBLIC_` prefix. Without it the function returns 500; if Brevo fails it returns 502.
- The browser form posts to the same origin and keeps the submit button disabled until the form and the privacy consent are complete.
- Not implemented yet: rate limiting, origin check and CAPTCHA (see [`ROADMAP.md`](./ROADMAP.md)).

## Data and privacy

- Quote data: name, email, phone, business, selected services and description, used only to answer the request (`/privacidad`).
- Analytics: Umami, cookieless and aggregated, enabled only when both variables are set. No tracking cookies, so no consent banner.
- Third parties: Brevo (quote delivery), Calendly (contact page), Vercel (hosting and logs). Fonts are self-hosted.

## Supply chain and repository

- `scripts/check-audit.mjs` fails CI on high or critical advisories in production dependencies unless the advisory is listed with a reason in `ACCEPTED`. Two are accepted today because no patched release exists: `braces` (GHSA-vfj7-8cjw-p6xm) and `http-cache-semantics` (GHSA-ch52-4w7c-c8xp), both reached only at build time.
- `package.json` `overrides` pin `basic-ftp`, `tmp` and `uuid` to patched versions. The rest of the `npm audit` findings (all high severity: `braces`, `http-cache-semantics`, `extract-zip` and the packages that depend on them) have no patched release and are tracked in [`ROADMAP.md`](./ROADMAP.md).
- Gitleaks scans every push and pull request (`.github/workflows/gitleaks.yml`).
- Reusable workflows come from the public repository `lumina-w/agents`, pinned to a tag.
- Secrets live only in Vercel and GitHub settings. `.env` is ignored by git; `.env.example` documents the names without values.
- Links that open a new tab get `rel="noopener noreferrer"` (`Button` and `TextLink`).
- `public/.well-known/security.txt` (RFC 9116) expires on 2027-06-18 and must be renewed before then.

## Checklist for a change

- New inline script: update the CSP hash and run `npm run csp:check`.
- New third-party host: add the minimum CSP directive, document it here and in the privacy page.
- New environment variable: document it in the README table and `.env.example`; use `PUBLIC_` only for values safe to expose.
- Change to `api/quote.ts`: keep server-side validation and escaping, and update `tests/quote-api.spec.ts`.
- Never put secrets, client data or vulnerabilities in the repository, issues or pull requests.

## Known gaps

See [`ROADMAP.md`](./ROADMAP.md): no rate limit, origin check or CAPTCHA on the quote function, the CloudFront image host and `style-src 'unsafe-inline'` to review, and the `npm audit` advisories without a patched release (production ones are accepted in `scripts/check-audit.mjs`; the rest are development-only and do not gate CI).
