# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `/herramientas` and `/en/uses`: a "05 · Redes" / "05 · Social" section after the GitHub block, with the same two-column layout and a non-sticky label column like the GitHub one ("Construyo en público" / "I build in public", a short description and a "Ver perfiles" / "See profiles" link to Instagram) and two profile cards in the style of the featured GitHub card for Instagram and TikTok (`@wavival_dev`, one line about the content each, site icons, new tab with `rel="noopener noreferrer"`, an `aria-label` that repeats the visible text and adds the localized profile name, no follower or post counts, no API, embed or third-party script). New `SocialProfileCard.astro` organism, a `label` slot in `StickyContentSection.astro` and a `handle` field in `src/data/social.ts`. `tests/uses-social.spec.ts`.

- `/servicios` and `/en/services` now use the responsive two-column services catalog layout from `/herramientas` and `/en/uses`: every group has a numbered label column with an eyebrow, title and description that becomes sticky from the `lg` breakpoint, plus a scrolling content column with its shared service illustration and ordered service rows. The layout keeps the same wrapping bases as the tools page while preserving all service details, quote links, anchors and structured data. `ServicesCatalog.astro` and `tests/services.spec.ts` cover the localized group labels, shared banners and responsive behavior in both currencies. The section lives in `StickyContentSection.astro`, and the Stack, Hardware and Software blocks of `/herramientas` and `/en/uses` render through the same component instead of their own copies of the markup, with no visible change.
- Quote leads stored in Supabase: `api/quote.ts` validates every field against closed lists (catalog services, ISO 3166-1 country, `COP` or `USD`, the budget ranges of `src/data/pricing.ts`, `es` or `en`, the three optional answers, `consent: true`, a `source` path under `/cotizar` or `/en/quote`), inserts the lead in `public.leads` of the shared project `db-luminaw-terracore-okroot-pages` as `product = 'wavival'` (name, email, phone, company, message, services, country, `geo_country` from `x-vercel-ip-country`, budget range, currency, how found, preferred channel, timeline, locale, trimmed user agent, source, server-side `consent_at`; the address is never stored) and then emails the owner with every field and the line "Guardado en base de datos: sí / no". 201 when at least one channel worked, 502 only when both fail. Helper `src/server/supabase.ts` (PostgREST, no dependency). Migration `supabase/migrations/20261108120000_wavival_quote_leads.sql` (`wavival` product, partial unique index that keeps one row per email for the other products and one row per quote for wavival, the new columns with `status` and its check, indexes by product, RLS with no policies and an explicit revoke to `anon` and `authenticated`).
- `api/keepalive.ts` and a Vercel Cron every three days (`vercel.json`): a `HEAD` on the leads table, protected by `CRON_SECRET`, so the Free Supabase project is not paused. `tests/keepalive-api.spec.ts`.
- Quote form fields on `/cotizar`, `/en/quote` and their `/cop/` variants: the eleven catalog services plus "APIs REST y backend (equipos técnicos)" (`rest-apis-backend`) with the titles of `/servicios`; required country (`<select>` of ISO codes named through `Intl.DisplayNames`, preselected with Colombia on the `/cop/` variant), required budget range (the ranges of `pricing.ts` in the page currency plus "Solo plan mensual" and "Aún no lo tengo definido"), and the optional "¿Cómo me conociste?" (TikTok, Instagram, LinkedIn, Google, Recomendación, Otro), "Canal preferido de contacto" (WhatsApp, Correo) and "¿Para cuándo lo necesitas?" (Este mes, En 1 a 3 meses, Sin fecha definida), in Spanish and English. `src/data/quoteOptions.ts` and `src/data/countries.ts`.
- `/privacidad` and `/en/privacy`: the quote data is stored in Supabase (us-east-1, United States) to follow up, the full list of stored fields, the country derived from the address without storing it, a "Conservación" / "Retention" section (24 months from the last contact for people who do not become clients, earlier on request) and the new date. `tests/privacy.spec.ts`.
- `.env.example`, README and `docs/security.md`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `CRON_SECRET` (server-only); the keepalive function, the leads data, the database access rules and the updated OWASP table; `docs/ROADMAP.md` lists the retention job and the Vercel settings to check.
- TikTok (`https://www.tiktok.com/@wavival_dev`) as a social channel: new `tiktok` item in `SocialLinks.astro` (icon `public/icons/ui/tiktok.svg`, Phosphor regular like the other UI icons), shown in the footer (Instagram, TikTok, GitHub, LinkedIn) and in the social row at the end of the about pages (the same four icons in the same order; the WhatsApp icon left that row because the floating button is on every page), shown in the social row of the home about section (Instagram, TikTok and the Platzi profile with its own `public/icons/ui/platzi.svg` icon; the WhatsApp link left that row because the floating button is on every page), linked from the new "Marketing y contenido" line of `/sobre-mi` and `/en/about` (marketing and social media at Platzi, self-taught learning and hands-on practice as a content creator), and listed in the JSON-LD `sameAs`, `llms.txt` and `llms-full.txt`.
- `/herramientas` and `/en/uses`: a "Marketing y contenido" / "Marketing and content" group (Claude, referenced from the code group, CapCut, Canva, ElevenLabs, Higgsfield) and a "Móvil y grabación" / "Phone and recording" hardware item (Motorola Edge 60 Fusion, DJI gimbal with extendable selfie stick).
- `src/data/whatsapp.ts`: the WhatsApp number and the prefilled message by language, used by every `wa.me` link on the site (floating button and contact pages).
- `tests/positioning.spec.ts`: home title and description in both languages, no "Full Stack Developer" in the hero lead, footer or home metadata, footer with TikTok and without Facebook, one WhatsApp message per language on every `wa.me` link, the training line and its links on the about pages, the new tools groups and the new fit lists.
- CI uploads the Lighthouse reports (`.lighthouseci/reports/`) as the `lighthouse-reports` artifact.
- Text-free service-group banners in `public/images/services/`: shared 1600x500 WebP illustrations for Development, Complementary and Packages with marketing. `ServicesCatalog.astro` renders the same asset in Spanish and English, below each group title with responsive dimensions, localized alt text, and lazy loading after the first banner. `tests/services.spec.ts` covers the assets and image attributes on both languages and currencies.
- Floating WhatsApp button on every page, in both languages and on the `/cop/` variants (`FloatingActions.astro` in `Layout`, `WhatsAppButton.astro`): a fixed bottom-right stack with room for a second launcher, a link to `https://wa.me/573016560222` with a localized message ("Hola, vengo de wavival.dev y quiero solicitar un servicio." / "Hi, I'm coming from wavival.dev and I'd like to request a service."), a new tab with `rel="noopener noreferrer"`, a localized `aria-label`, an inline SVG icon, safe-area insets and a footer bottom padding so it covers no content. No script, so the CSP is unchanged. `tests/whatsapp-button.spec.ts` covers every route.
- Project brief and technical detail: every home row, index card and case-study header opens with a Problem, Solution and Result block (`ProjectBrief.astro`, `BriefView` in `projectView.ts`, `brief` in `projects.ts`, in both languages), TerraCore and OKroot carry an "In validation with real clients" badge, and the stack becomes a secondary line. Case studies keep architecture, design, decisions, learnings and roadmap inside a closed `TechnicalDetail.astro` block (`layerSections` orders and numbers the sections; anchor links and the URL hash open it). `tests/project-brief.spec.ts` and `tests/project-layers.spec.ts`.
- The services catalog of the 2026 plan on `/servicios` and `/en/services`: eleven services in three groups (Development: conversion landing page, business website, automation with n8n, AI chatbot, custom web app or PWA MVP, AI integration in an existing system; Complementary: basic security review, monthly support plan with Basic and Plus; Packages with marketing, sold only inside a package or to development clients: Digital Presence Kit, Time Saver Kit, monthly SEO), each with its price from `src/data/pricing.ts` in the visitor's currency, timeline, inclusions, exclusions and a link to the quote page with `?service=<id>`; a visible note on the MVP with the Lúmina W referral threshold; the Time Saver Kit saving computed by `savingsPercent` (29% in COP, 30% in USD); the general exclusions block; and REST APIs and backend as a separate block for technical teams, without a price. Copy lives in `src/data/services.ts` (`ServicesCatalog.astro` renders it; `ServiceRow` gains price, tiers, inclusions, exclusions, note and badge), the Service JSON-LD (`src/data/servicesLd.ts`) carries an `OfferCatalog` with every price in COP for Colombia and in USD elsewhere, identical for every visitor, and `llms.txt` and `llms-full.txt` list the same catalog and prices. `tests/services.spec.ts` checks both languages, both currencies, "desde" only on the MVP, "al mes" only on monthly plans, the structured data, and that no page mentions the pentester mindset or an hourly rate.
- Currency by visitor location. `middleware.ts` (Vercel Edge Middleware, no dependencies) reads `x-vercel-ip-country` on the priced routes (`/servicios`, `/cotizar`, `/en/services`, `/en/quote`) and serves visitors in Colombia the prebuilt COP variant under `/cop/` through an internal rewrite; everyone else, crawlers and requests without a country get the USD page. The URL, canonical, hreflang, `og:url` and JSON-LD are the same for everyone, each variant is cached under its own path, a direct request to `/cop/...` is redirected (308) to the public URL, and nothing the visitor controls (query, cookie, headers, language) changes the currency. `GEO_COUNTRY_OVERRIDE` forces a country outside production only.
- `src/data/pricing.ts`, the single source of prices of the 2026 plan: 11 service ids (`landing-page`, `business-website`, `n8n-automation`, `ai-chatbot`, `custom-web-app-mvp`, `ai-integration`, `basic-security-review`, `monthly-support` with `monthly-support-basic` and `monthly-support-plus`, `digital-presence-kit`, `time-saver-kit`, `monthly-seo`), the Lúmina W referral and payment-split thresholds, the quote budget ranges (`entry`, `small`, `medium`, `large`, `above-cap`, `monthly-plan-only`, `undecided`) and the formatting helpers (currency code first, thousands separator by language, "desde" only on the MVP, "al mes" on monthly plans).
- `Price.astro` atom and `src/utils/currency.ts` (the shared rule, the route list and the `/cop/` path helpers used by the middleware, `Layout`, the i18n helpers and the sitemap filter).
- `tests/currency.spec.ts` (middleware rewrites, redirects and overrides; built pages with only COP from Colombia and only USD from Argentina, Chile or no country; identical JSON-LD; no currency switch; variant metadata; sitemap) and `tests/pricing.spec.ts` (amounts, ids, thresholds, ranges and formatting).

- Security hardening of the quote function (`api/quote.ts`): origin check (403), JSON content type (415), 20,000 character body limit (413), best-effort rate limit of 5 requests per source in 10 minutes (429 with `Retry-After`), 10 second Brevo timeout and 502 when Brevo fails or does not answer, and failure logs without personal data. Optional `QUOTE_ALLOWED_HOSTS` variable for extra domains. Tests in `tests/quote-api.spec.ts`.
- Response headers: `Cross-Origin-Opener-Policy: same-origin`, `payment=()` and `usb=()` in `Permissions-Policy`, and `object-src 'none'` in the CSP, checked by the new `tests/security-headers.spec.ts`.
- `.github/dependabot.yml` (weekly npm and GitHub Actions updates to `dev`) and `.github/workflows/codeql.yml` (CodeQL on pushes, pull requests and weekly).
- `scripts/check-security-txt.mjs` (`npm run security-txt:check`, run in CI): fails when `security.txt` has expired and warns during its last 60 days; tested by `tests/security-txt.spec.ts`.
- `docs/security.md`: OWASP Top 10 (2021) coverage table and the list of GitHub and Vercel settings that live outside the repository.
- Projects as ecosystems: each of the six projects (TerraCore, OKroot, NullBreach, Lúmina W, wavival.dev, Forgotten Portal) has one card and one page, split into parts (`PartKind`: app, landing, docs, blog, repo, api, site, writeup). A multi-part page shows the official name, an ecosystem summary, one action per part, a contents list of the parts and one "Ver detalle" accordion per part (`<details id="app">`; the first part is open, and a `#landing` style link, a hash change or a contents click opens its part). Single-part projects keep the classic case-study layout.
- Components `PartBody` and `PartDisclosure`, the scripts `src/scripts/disclosure.ts` and `src/scripts/part-disclosure.ts`, and the data modules `projectSeo.ts` and `caseStudyLabels.ts`.
- JSON-LD with one object per project, `alternateName` (the short name) and, on multi-part projects, `hasPart` listing each linked part with its own schema.org type.
- Links as parts: documentation of TerraCore (`docs.terracoreapp.co`) and OKroot (`docs.okroot.co`), and the NullBreach repository and Swagger UI; Umami events `ver-docs-terracore` and `ver-docs-okroot`.
- `tests/ecosystem.spec.ts`.
- Open decisions in `docs/ROADMAP.md`: the OKroot docs stack, the docs counts and the NullBreach Swagger route.
- `src/utils/a11y.ts` (`labelInName`, `visibleText`) and `tests/label-in-name.spec.ts`: every control with visible text keeps it inside its `aria-label` (WCAG 2.5.3, Label in Name) on every page of the sitemap.

- `ProjectView.links` and the `stacked` prop of `ProjectActions`: the project page header lists the external links (app, landing, docs, blog, repository, API; every link on a single-part project) as one column of `TextLink`s, followed by the primary "Cotizar un proyecto así" button. Accordions of rich parts show their links, plus the design link, stacked the same way.
- `QUOTE_TYPES_MODE` and `quoteTypesHref` in `src/data/quoteTypes.ts`, and the `?mode=types` query of the quote form.
- Tests for the header link column, cards without external links, `?mode=types`, a malformed hash and a nested hash (`tests/ecosystem.spec.ts`, `tests/quote.spec.ts`).

### Fixed

- `.btn` is 50px tall through `min-height` instead of vertical padding, so the primary and the secondary button (which carries a 1px border) measure the same, so the "Blog W" primary and "Conóceme" secondary buttons of the home about section measure the same; they were 51px and 53px.
- More room for the text of the project cards on `/proyectos` and `/en/projects` (`ProjectCard`, `ProjectBrief` compact): 14px brief text with a looser line height, 12px between the problem, solution and result rows, labels above the text under 640px and in a 96px column from there, 24px between the card blocks and 32px of padding from 640px.
- The Instagram links point to `https://instagram.com/wavival_dev` (the previous `wavival` handle was wrong) in `SocialLinks`, the home about section, the about pages, the JSON-LD `sameAs`, `llms.txt`, `llms-full.txt`, the README badge and `docs/brand.md`. `SocialLinks` is now the only row of profile links and `src/data/social.ts` their only source, including Platzi and Blog W (new `public/icons/ui/blog-w.svg`, Phosphor regular like the other UI icons): the `networks` prop picks which profiles a row shows and the order is always Instagram, TikTok, LinkedIn, GitHub, Platzi, Blog W. The footer keeps the first four, the `Hero` and the home about section show Instagram, TikTok and LinkedIn, and the about pages show all six; the `items` and `whatsapp` options are gone. In the home about section "Blog W" is the primary button (new tab) and "Conóceme" / "Get to know me" the secondary one; "Criterio técnico" / "Technical criteria" in the stack section is a secondary button too instead of a text link. The mobile menu shows Instagram, TikTok and LinkedIn above one row with "Blog W" and the mailto button. The marketing line of the about pages and the stack data name Instagram before TikTok too. `tests/positioning.spec.ts` follows all of it.
- The quote button of the "REST APIs and backend" block on `/servicios` reads "Cotizar este servicio" like every other service (it read "Cotizar"); `/en/services` already said "Request a quote".
- The stack line of the home project rows and the index cards (`ProjectRow`, `ProjectCard`) showed the first six names of the merged part stacks, so TerraCore listed only backend names and no frontend. Each project now declares a `keyStack` in `src/data/projects.ts` (the main technology of each layer it has, 4 to 8 names, backend first, then database, frontend, AI or integrations and content platform), rendered as the same secondary text line with " · " between names. `tests/project-key-stack.spec.ts` checks every project in both languages, the backend and frontend names of TerraCore and the absence of the infrastructure details the case studies generalized.
- Decisions inside an open ecosystem part showed "Cerrar" while they were closed: the "Ver" and "Cerrar" labels of a decision (and "Ver detalle" and "Cerrar" of a part) now belong to its own summary (`.disclosure > summary .when-open`), so a closed decision keeps "Ver" whatever its parent does. Covered by `tests/ecosystem.spec.ts`.
- Dependency audit: `source-map-js` 1.2.2 (high, GHSA-68fv-2mgg-jv7q, a production dependency; it made the `quality` job fail on every pull request), and `proxy-addr` 2.0.8 (critical) and `compression` 1.8.2 (high), both reached only by the Lighthouse chain in development. Lockfile only.

- `src/scripts/part-disclosure.ts` guards `decodeURIComponent` against a malformed hash and, after opening a closed part, scrolls to a nested target.
- `softwareRequirements` in the project JSON-LD uses the stack of the app part (the first part when there is none); the merged stack is used only when that part declares no stack.
- NullBreach app text: the landing is a separate static Astro site (`apps/landing`) published inside the Next.js deployment, and the app link points to `/nullbreach/login`. The matching open decision is removed from `docs/ROADMAP.md`.
- Label in Name: `Button`, `TextLink` and the language toggle build the accessible name with `labelInName`; project links read "View app: TerraCore PWA" instead of a label that dropped the visible text; the previous and next project links use their visible text; redundant labels on the "See services" buttons are removed; the English CV, "See projects" and footer "Uses" labels contain their visible text.

### Changed

- The TerraCore row of the home (`FeaturedProjects`, first `ProjectRow`) is highlighted like the featured card of `/proyectos`: blue outline, tint, top bar, side padding and the "Destacado" / "Featured" badge, without the "Proyecto destacado" overline the badge would repeat. `tests/featured-row.spec.ts` compares both.
- The case-study button "Cotizar un proyecto así" links to the quote form with the project's related catalog services preselected (`quoteHrefForProject` in `src/data/quoteOptions.ts`, derived from the `examples` of `src/data/services.ts`): TerraCore and OKroot open with landing page and MVP (OKroot also AI integration), NullBreach with AI integration and REST APIs; Lúmina W and wavival.dev, which no example names, open with business website and Forgotten Portal with basic security review (`ASSIGNED_QUOTE_SERVICES`). `?service=` is repeatable and the ids of the previous form (`custom-web-applications`, `ai-integrations`, `security-appsec`) are mapped in the browser and in the function. The inline `QuoteForm` script changed, so a new `script-src` hash was added to `vercel.json`.
- The "Negocio o empresa" field is now "Nombre del negocio" / "Business name", and the form intro and "what happens next" steps say the request is stored for follow-up.
- `ContactBand` closes every page from `Layout` (end of `<main>`, before the footer), in both languages and on the `/cop/` variants, except `/contacto`, `/en/contact`, `/privacidad`, `/en/privacy`, `/cotizar`, `/en/quote` and the 404 pages (`contactBand={false}`); the manual mounts on the home, services, about and case-study pages are gone. New copy with the same design: "A un click" / "One click away", "Deja de hacer a mano lo que el software puede hacer por ti." / "Stop doing by hand what software can do for you.", "Construyo landing pages, sitios web, automatizaciones, chatbots y apps a medida, con seguridad desde el diseño y precio fijo." / "I build landing pages, websites, automations, chatbots and custom apps, with security by design and a fixed price.", "MVP de 6 a 10 semanas. Disponibilidad limitada, respondo en 24 horas." / "MVP in 6 to 10 weeks. Limited availability, I reply within 24 hours." with the MVP timeline read from `src/data/services.ts`, primary button "Cotizar mi proyecto" / "Get a quote" to the quote page, secondary "Ver servicios" / "See services", or "Escríbeme" / "Write to me" to contact on the services pages (`contactBandSecondary="contact"`). The `/contacto` and `/en/contact` headings follow the same idea: "Cuéntame qué quieres dejar de hacer a mano." / "Tell me what you want to stop doing by hand." `tests/contact-band.spec.ts`.
- Positioning of the 2026 plan across the site. Home title and description: "Valentina Ramírez | Software seguro y automatización con IA para emprendedores" / "Ayudo a emprendedores a ahorrar tiempo con software seguro y automatización con IA: landing pages, sitios web, chatbots y apps a medida, construidos en público." (English pair on `/en/`). The hero lead and the home about section describe a software developer focused on backend, AI and security (no "Full Stack Developer"), and the footer tagline reads "Desarrolladora de software. Backend, IA y seguridad. Herramientas que le ahorran tiempo a tu negocio." / "Software developer. Backend, AI and security. Tools that save your business time.". The default `og:image:alt` now describes the default social cards ("Creo productos digitales..." / "I build digital products..."); the card images are unchanged. Documented in `docs/brand.md`, `docs/commercial.md`, `docs/seo.md` and `COMPONENTS.md`.
- English pages spell the name "Valentina Ramírez" with its accent everywhere (page titles, JSON-LD, aria labels and copy; the previous "Valentina Ramirez" is gone), and the `/en/about` meta description says the same as `/sobre-mi` ("Beyond code: photography and drums.").
- The remaining "Full Stack Developer" wording follows the new positioning: JSON-LD `jobTitle` "Software Developer" with a localized Person description and "Software Development" in `knowsAbout`; `/servicios` and `/en/services` title ("Servicios: software seguro y automatización con IA | Valentina Ramírez" / "Services: secure software and AI automation | Valentina Ramirez"), description, `Service` name and intro; the about pages description and summary figure ("Backend e IA" / "Backend and AI"); the tools pages description; the privacy pages; the headings, profile and services paragraphs of `llms.txt` and `llms-full.txt`; `README.md`, `CLAUDE.md` and `docs/seo.md`. The "Full Stack" project filter is a project type and stays.
- Ideal client on `/servicios` and `/en/services` ("Trabajo mejor con" / "No es para ti si", `docs/commercial.md` section 3): owners of micro service businesses of 1 to 10 people that already sell, run on WhatsApp, Instagram, spreadsheets and email and want time saved and more sales; not for businesses at the idea stage, teams over 10 people or projects above the Lúmina W threshold, certified pentests or compliance certifications, or daily social media management.
- WhatsApp messages unified by language: `/contacto` and every other `wa.me` link now open with "Hola, vengo de wavival.dev y quiero solicitar un servicio." and the English pages with "Hi, I'm coming from wavival.dev and I'd like to request a service.".
- `lighthouserc.json` uploads to `filesystem` (`.lighthouseci/reports/`) instead of `temporary-public-storage`, so no report is published to public storage (`docs/performance.md`, `docs/engineering.md`).
- `.husky/pre-commit` is executable again in git, so `lint-staged` runs on every commit.
- Home headline: the `h1` reads "Ayudo a emprendedores a ahorrar tiempo con software seguro y automatización con IA, y muestro en público cómo lo construyo." ("I help entrepreneurs save time with secure software and AI automation, and I show how I build it in public.") in the new `.display-hero` scale (`--fs-display-hero`), and "El código que firmo también lo rompo." ("The code I ship, I also break.") becomes the tagline below it. The contact band quotes the unified MVP timeline, 6 to 10 weeks, instead of 3-6. `docs/brand.md`, `docs/commercial.md`, `COMPONENTS.md` and `DESIGN.md` follow; `tests/home.spec.ts` checks both languages.
- Case-study content generalized: infrastructure, token, isolation and hardening details are described in general terms, learnings are capped at three per part, the TerraCore roadmap matches its validation status, project summaries and meta descriptions (`projectSeo.ts` reads them from `projects.ts` in Spanish and English) drop technology names, NullBreach reads as an open-source, non-commercial AppSec portfolio, and the summary box that repeated the case-study header is gone. `llms.txt` and `llms-full.txt` follow the same rules (problem, solution, result and validation per project, no infrastructure detail). "Lumina W" is written "Lúmina W" on the English about and privacy pages.
- The MVP description speaks to "emprendedores" / "entrepreneurs" instead of founders, the technical block "REST APIs and backend" links to the quote page with `?service=rest-apis-backend` (the form mapping comes with the quote form update), `docs/brand.md` says "criterio de seguridad" instead of "criterio de pentester", and Lighthouse CI also audits `/servicios` and `/en/services`.
- The services page intro, `docs/commercial.md`, `COMPONENTS.md`, `DESIGN.md` and `docs/seo.md` describe the new catalog. `tests/quote.spec.ts` and `tests/ecosystem.spec.ts` follow the new ids and example links; the quote-form preselection check returns when the form adopts the catalog ids.
- The services JSON-LD `priceRange` now comes from `priceRangeLd` in `src/data/pricing.ts` and lists the fixed COP range for Colombia and the USD range for everyone else, in both languages. `llms.txt` and `llms-full.txt` state the per-service pricing policy (COP in Colombia, USD elsewhere, charged by location, independent lists reviewed every January) instead of the old general price. `docs/commercial.md` records the currency policy (section 2.1).
- `getLangFromUrl`, `getAltLangUrl` and `ariaCurrent` read the public pathname, and `Layout.astro` derives the canonical URL, `og:url` and the home check from it, so the `/cop/` variants resolve the same language, links and metadata as the pages they mirror. The sitemap leaves the variants out.
- Documentation of the server surface (`AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/security.md`, `docs/performance.md`, `docs/seo.md`, `COMPONENTS.md`) now names the Edge Middleware next to the quote function, and `.env.example` and the README table document `GEO_COUNTRY_OVERRIDE`.
- Profile photo (`public/images/profile.webp`) replaced with a new portrait: 720x900 WebP (24 KB, no metadata) tightly cropped to the 4:5 frame (hair to crossed arms), same path. The About pages now declare the real 320x400 size.

- Tailwind CSS 3 to 4 (`tailwindcss` and `@tailwindcss/vite` 4.3): the theme moves from `tailwind.config.mjs` to the `@theme` block of `src/styles/global.css`, dark mode is a `@custom-variant`, and `tailwind.config.mjs`, `postcss.config.cjs` and `autoprefixer` are removed. The site's component CSS is imported into the `utilities` layer so the cascade stays flat as in Tailwind 3, and element rules sit in `@layer base`. Class names that Tailwind 4 renamed were migrated with the official upgrade tool. Compared with the Tailwind 3 build: same geometry and computed styles on every page and 412 Playwright tests pass; the only pixel difference is how `text-wrap: pretty` breaks one paragraph of `/en/projects/wavival-dev/`.

- Privacy pages (`/privacidad`, `/en/privacy/`, updated 2026-10-06): section 02 states that the quote rate limit counts submissions per IP address for at most 10 minutes in the temporary memory of the server, and that the address is not stored, shared or part of the quote data. Covered by `tests/privacy.spec.ts`.
- Dependency audit: `npm audit` drops from 21 findings to 8. `eslint-plugin-astro` 3.2.1 (clears the `fast-glob` chain of `astro-eslint-parser`); overrides for `lighthouse` 13.5, `puppeteer-core` 25.12 and `@puppeteer/browsers` 3.2 (the Lighthouse CI chain, which also drops `extract-zip`) and for `js-yaml` 4 inside `@lhci/utils` (drops `argparse` 1 and `sprintf-js`). Lighthouse CI collects and asserts as before. `npm audit fix` then clears `postcss-selector-parser`, and the Tailwind 4 migration (see Changed) clears `tailwindcss` 3, `postcss-nested` and `chokidar`. Removing `@vercel/microfrontends` (see Removed) clears the last 4, so `npm audit` reports 0 vulnerabilities and `scripts/check-audit.mjs` no longer accepts any advisory.
- Dependency updates (minor and patch): `astro` 7.3.5, `@astrojs/sitemap` 3.7.4, `@astrojs/check` 0.9.10, `@playwright/test` 1.63.0, `eslint` 10.12.0, `globals` 17.13.0, `lint-staged` 17.6.0, `prettier` 3.9.9 and `typescript-eslint` 8.71.0; `actions/setup-node` 7 in the workflows. `tests/case-studies.spec.ts` reformatted with the new Prettier.
- Dependabot: titles are `chore(deps): ...` for every ecosystem (the previous `chore(deps-dev)` scope failed commitlint and the PR title check), and npm major versions are ignored; the pending migrations are listed in `docs/ROADMAP.md`.

- The examples of each service on the Services pages (ES and EN) open the section of their project that matches the service: TerraCore and OKroot `#app` for web apps, NullBreach `#app` for APIs and backend, OKroot and NullBreach `#app` for AI integrations; Forgotten Portal keeps its single-part page.
- The `docs` parts of TerraCore and OKroot are rich accordions: summary, architecture and design of the documentation sites (Astro 7, MDX content collections, client-side search, design tokens, security headers, tests), taken from `terracore-docs` and without business logic. OKroot documentation uses the same stack. `llms.txt` and `llms-full.txt` carry the same facts.
- Project page header: the link column and the "Cotizar un proyecto así" button are always left-aligned (also on mobile). The wide TerraCore card on the index keeps its cover touching the card on the top, left and bottom edges: the frame keeps the cover ratio, the image uses `object-fit: cover`, and the summary is clamped to three lines so the text column fits.
- Every part of a multi-part project page, including the link-only ones (docs, repository, API), is an accordion with the same "Ver detalle" design; the panel of a link-only part holds its links. `PartLinkRow` was removed.
- Project cards on `/proyectos` and the home featured rows show only the "Caso de estudio" link (`ProjectView.actions`); the external links moved to the project page header.
- The case-study quote button opens `<quote route>?mode=types`: the form shows the project types with none selected and the visitor chooses in the form. `?type=<id>` still preselects a type and `?service=` is unchanged; fields, required rules and submission are unchanged. The inline `QuoteForm` script changed, so its `script-src` hash in `vercel.json` was replaced.
- The portfolio lists 6 projects instead of 9, one page per project (6 per language in the sitemap instead of 9). Page titles use the official name (`<official name>: Caso de estudio | Valentina Ramírez`, `<official name>: Case study | Valentina Ramirez`), and `CaseStudy`, `CaseSection` (new `level` prop) and `Disclosure` (its script moved to `src/scripts/disclosure.ts`) follow the new model. Cards and the home featured rows show only the case study link and a stack preview capped at 6 chips.
- Merged slugs redirect permanently (301) to the part that replaced them, each with its `/en/projects/...` and unprefixed `/projects/...` equivalent: `terracore-landing` to `/proyectos/terracore#landing`, `okroot-landing` and `root-landing` to `/proyectos/okroot#landing`, `blog-lumina-w` to `/proyectos/lumina-w#blog`, and `root` to `/proyectos/okroot`.
- Documentation updated for the change: `README.md`, `COMPONENTS.md`, `docs/seo.md`, `docs/i18n.md`, `docs/brand.md`, `docs/commercial.md` (the Umami event list and the stale `terracore-landing` source), `docs/accessibility.md` and `docs/performance.md`.
- The footer flag next to "Made in Colombia" stays, as an owner-decided exception to the no-emoji rule (`docs/brand.md`).

- `CLAUDE.md` is no longer empty: it is the Claude Code project guide, imports `AGENTS.md` and links to the documentation set, and `AGENTS.md` states it. The previous rule that kept `CLAUDE.md` empty is removed from `AGENTS.md` and the README document map.
- Every document carries a `> Last updated: YYYY-MM-DD` line (README, `SECURITY.md`, `CLAUDE.md` and all of `docs/`); a change to a document updates it and is recorded here under `[Unreleased]`.
- Full documentation verification against the code on 2026-10-04: README (workflow triggers, local hooks, document map and table of contents), `docs/engineering.md` (CI triggers, auto-merge and branch cleanup rules, hooks), `docs/RELEASING.md` (`v4.0.0` is now an existing tag) and `docs/ROADMAP.md` (the unused `quoteType` values are `api-backend` and `ai`).
- Positioning: Full Stack developer focused on backend and AI, in the home hero, the about section, the page titles and descriptions, the footer tagline, the structured data, the web manifest, `llms.txt`, `llms-full.txt`, the README, `docs/brand.md` and `docs/commercial.md`. The open positioning decision is removed from `docs/ROADMAP.md`.
- Ownership rule for SEO and GEO: everything on wavival.dev belongs to wavival and everything on luminaw.co to Lúmina W. The structured data now treats the `Person` as the entity of the site (contact email, `publisher` of the `WebSite`) and no longer attaches a contact point or `worksFor` to Lúmina W; `llms.txt` and `llms-full.txt` state the split; the about pages and the footer no longer present clients or services as Lúmina W's; `docs/seo.md`, `docs/brand.md` and `docs/commercial.md` follow the rule.
- Home H1: "Full Stack Developer, backend e IA." ("backend and AI" in English).
- Published price: projects from USD 250 / COP 1,000,000 depending on scope (was COP 2,000,000 / USD 500) and valid only for wavival's own services; Lúmina W has its own pricing. Applied in the contact band, the contact and services pages, the services structured data, `llms-full.txt` and `docs/commercial.md`.
- `DESIGN.md` and `COMPONENTS.md` verified against the code on 2026-10-04: full Layout props and head order, real Person JSON-LD fields, missing components, props, classes and tokens, recomputed contrast ratios, and ASCII-only punctuation. The Label-in-Name gaps found are tracked in `docs/ROADMAP.md`.
- Owner decisions recorded in `docs/brand.md` and `docs/commercial.md`: product prices are not published on wavival.dev, and the three apps counted on the home are TerraCore, OKroot and NullBreach. The unverified TerraCore Semilla price is removed from the documents.
- Dependencies: `overrides` for `basic-ftp`, `tmp` and `uuid` clear their advisories and `npm audit fix` updates `http-cache-semantics` to 4.3.0 (24 vulnerabilities down to 14, all high, none with a patched release). `scripts/check-audit.mjs` no longer accepts `GHSA-ch52-4w7c-c8xp`. `docs/ROADMAP.md` tracks the current count.
- Restored the `[3.1.0] - 2026-09-30` section and its compare link: the tag `v3.1.0` existed but its entries were listed under `[4.0.0]`. The 49 entries that were in the changelog at that tag moved to 3.1.0 unchanged.
- README consistency: project structure (`docs/`, `.husky/`, root configuration, no duplicated quote page line), local Husky hooks, `vercel.json` and `microfrontends.json` in the document map, the Accessibility section pointers, and the `npm audit` counts in `docs/ROADMAP.md`.
- Complete documentation set: `docs/seo.md` (SEO, indexing, structured data, GEO), `docs/i18n.md` (Spanish and English), `docs/accessibility.md`, `docs/performance.md`, `docs/security.md` and `docs/engineering.md`, linked from the README, `AGENTS.md` and `SECURITY.md`.
- Documentation of everything: `DESIGN.md` rows for the Stack nav state, disabled buttons, the projects index highlight and the quote form classes; `ProjectCard` props in `COMPONENTS.md`; English URLs in `public/llms.txt` and `public/llms-full.txt`, with the matching `docs/ROADMAP.md` item removed.
- Documentation refresh: README (environment variable table with where each one is read and required, missing scripts, delivery flow and workflows, `api/` and `.github/` in the structure, `AGENTS.md` in the document map), `COMPONENTS.md` and `DESIGN.md` (project filters, quote page, links to `AGENTS.md`), source paths in `docs/brand.md` and `docs/commercial.md`, and resolved items removed from `docs/ROADMAP.md`.
- Dependencies: minor and patch updates (astro 7.4, `@astrojs/check`, commitlint, Playwright, ESLint, Prettier, typescript-eslint) with the lockfile regenerated on Node 22 so `npm ci` passes in CI (including `sharp` 0.35.5 and `undici` 8.12.x to clear the high advisories flagged by `check-audit`), and two new inline script hashes in the CSP (`vercel.json`) after the Astro bump.
- Home "Stack favorito" / "Go-to stack" grid uses six cards in a three-column zigzag: Backend (featured) + Frontend, Design & UX + AI Integrations (featured), and Marketing & Content (featured) + Security. The mobile order is 01, 02, 04, 03, 05, 06, so featured cards never share a side at any width. All 41 chips remain. `usesStack` preserves the existing five grouped categories on `/herramientas` and `/en/uses`; only the home renders the separated Frontend and Design & UX cards. `llms.txt` and the stack tests follow the six-card home layout.

### Removed

- The "by project type" mode of the quote form: `src/data/quoteTypes.ts` (`QUOTE_PROJECT_TYPES`, `quoteTypesHref`, `QUOTE_TYPES_MODE`), the `projectTypes` fieldset and payload field, and `PROJECT_TYPE_LABELS` in `api/quote.ts`. Links with `?mode=types` or `?type=` open the form with nothing selected.
- The downloadable CV: `public/cv_valentina_ramirez_es.pdf` and `public/cv_valentina_ramirez_en.pdf`, their `Cache-Control` entries in `vercel.json`, the "Descargar CV" / "Download CV" buttons of the hero and the about pages (with their `cv-descarga-*` Umami events and the `download-cv-*` icons), `cvHref()` and the `common.downloadCv*` keys, and the CV links in `llms.txt`, `llms-full.txt`, `README.md`, `AGENTS.md` and the docs. The two PDF URLs redirect permanently to `/sobre-mi` and `/en/about` (`vercel.json`, `tests/redirects.spec.ts`). The hero keeps "Ver servicios" / "See services" as its primary button and shows the Instagram, TikTok and LinkedIn icons from `SocialLinks`.
- The four previous services (custom web applications, REST APIs and backend as a priced row, security and AppSec, AI integrations) from the services pages, the structured data and the AI-discovery files, and the phrase "pentester mindset" / "mentalidad de pentester" everywhere on the site. The quote form and `api/quote.ts` still use the previous ids until the form adopts the catalog ones.
- The general price "from USD 250 / COP 1,000,000 depending on scope" from the contact band (ES and EN), the contact pages, the services structured data, `llms.txt`, `llms-full.txt` and `docs/commercial.md`. The MVP timeline in the contact band is unchanged.
- `.github/dependabot.yml`: the repository no longer opens automatic weekly update pull requests, and Dependabot alerts and security updates are switched off in the GitHub settings. Dependencies are updated by hand.
- `@vercel/microfrontends` and its Vite plugin in `astro.config.mjs`: the plugin only served the local development proxy, which the project does not use. Production routing of `/nullbreach` stays in `microfrontends.json` and the Vercel project settings, and the built site is identical. It carried the `braces` advisory (GHSA-vfj7-8cjw-p6xm, no patched release).
- `Project.quoteType` and `quoteTypeHref` (replaced by `quoteTypesHref`). The `quoteType: "api-backend"` and `"ai"` unused item and the NullBreach `quoteType` filter wording are removed from `docs/ROADMAP.md`.
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
