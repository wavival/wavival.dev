# CLAUDE.md

> Last updated: 2026-11-11

Guide for Claude Code in this repository. The operational rules live in `AGENTS.md` and are imported here, so there is one source:

@AGENTS.md

## What this repository is

The personal portfolio of Valentina Ramírez (wavival): a bilingual Astro 7 static site, Spanish at the root and English under `/en/`, deployed on Vercel. `api/quote.ts` (quotes: validate, accept monthly SEO only from development clients, store in Supabase, email through Brevo) and `api/keepalive.ts` (cron that keeps the database awake) are the Vercel Functions, and `middleware.ts` is the Edge Middleware that picks the currency variant of a priced page by visitor location (prices: `src/data/pricing.ts`). Positioning (since 2026-11-11): software developer and digital strategist, with software and digital marketing as her two strengths, who helps entrepreneurs save time and sell more with software and digital marketing and helps creators, experts and trainers (the second audience of the services) structure and launch their offer; never a marketing agency or daily social media management. Overview, setup, commands, architecture and routes are in `README.md`.

## Ownership rule

Everything on `wavival.dev` (services, published price, contact, projects) belongs to wavival. Everything on `luminaw.co` belongs to Lúmina W, a separate software company with its own services, prices and products. Never attribute one to the other. Details: `docs/brand.md` and `docs/commercial.md`.

## Where to look

- Visual system and tokens: `DESIGN.md`. Components and layout contracts: `COMPONENTS.md`.
- SEO, structured data and AI discovery: `docs/seo.md`. Spanish and English copy: `docs/i18n.md`.
- Accessibility, performance and security: `docs/accessibility.md`, `docs/performance.md`, `docs/security.md`.
- Engineering practices, checks and CI: `docs/engineering.md`. Releases: `docs/RELEASING.md`.
- Pending work and open decisions: `docs/ROADMAP.md`. History: `CHANGELOG.md`.

## Working rules that are easy to miss

- Branches: `feature/*`, `fix/*` or `chore/*` from `dev`, pull requests to `dev`, opened ready for review. Never branches named after the tool, such as `claude/*`.
- Every document carries a `> Last updated: YYYY-MM-DD` line; a change to a document updates it, and `CHANGELOG.md` records the change under `[Unreleased]`.
- When a fact changes (a service, a price, a project, a contact channel), update the site, `public/llms.txt`, `public/llms-full.txt` and the documents that own it together.
- Plain ASCII punctuation in text: no em dashes, en dashes or decorative icons.
- "wavival" is always lowercase, also at the start of a sentence, in titles, metadata, JSON-LD and `alt` (`docs/brand.md`). The English tools page is "Tools" wherever it is named.
