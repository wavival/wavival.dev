# Performance

> Last updated: 2026-10-06

The site is static HTML, one stylesheet, vanilla TypeScript and one serverless function. The goal is a fast first paint and no layout shift on every page.

## What makes it fast

- **Static output.** Astro renders every page at build time (`compressHTML: true`, `inlineStylesheets: "auto"`). The only server code is `api/quote.ts`.
- **Fonts self-hosted.** Poppins 400, 500 and 600 and the Raleway variable font (weights 600 to 800) are WOFF2 files in `public/fonts/`, declared with `font-display: swap` and a Latin `unicode-range`. Only Poppins 400 and Raleway are preloaded (`Layout.astro`).
- **LCP image.** The profile photo is preloaded with `fetchpriority="high"` only on the pages that render it (the home and about pages in both languages, `preloadHero`). The image has explicit `width` and `height`.
- **Images.** Raster content images are WebP (`public/images/`, `public/brand/`; the PWA and touch icons are PNG), declare their dimensions and use `loading="lazy"` and `decoding="async"` when they are below the fold.
- **Caching.** `vercel.json` sets `Cache-Control: public, max-age=31536000, immutable` on `/_astro/`, `/images/`, `/brand/`, `/icons/` and `/fonts/`, and one day on the CV PDFs. Filenames under `/_astro/` are content hashed.
- **JavaScript.** Plain TypeScript modules for navigation, theme, the quote form and the project filters; no framework runtime. The ecosystem project pages add no new library: the accordions reuse one bundled `src/scripts/disclosure.ts` and one small `src/scripts/part-disclosure.ts`, and the stack preview on cards and rows is capped at 6 chips. Astro View Transitions (`ClientRouter`) make navigation feel instant.
- **Third parties.** None are loaded by default. Umami (cookieless, `defer`) and the Web Vitals reporter load only when both `PUBLIC_UMAMI_*` variables are set; Calendly loads on the contact page only.
- **CSS.** One global stylesheet source with tokens; Tailwind generates utilities only for classes that appear as complete literals (checked by `npm run css:check`).

## Measuring

- Lighthouse CI (`npm run lhci`, job `lighthouse` in CI) audits home, projects, about and the English home from `dist/` (one run per page, `lighthouserc.json`). Thresholds: performance and best practices warn below 0.9; accessibility and SEO fail below 0.9.
- Core Web Vitals (LCP, INP, CLS, FCP, TTFB) are sent to Umami as `web-vitals` events when analytics is enabled (`src/scripts/vitals.ts`).
- There is no numeric performance budget; Lighthouse scores are the guardrail.

## Trade-offs to remember

- The navigation loader (`Layout.astro`) stays visible for at least one second during a page transition. That is a deliberate visual choice, not a loading cost.
- `style-src` still allows `'unsafe-inline'`; reviewing it is tracked in [`ROADMAP.md`](./ROADMAP.md).

## Checklist for a change

- New image: WebP, explicit dimensions, `alt`, lazy unless it is above the fold.
- New font weight: preload only if it is used on first paint.
- New script: keep it vanilla, import it where it is used, then run `npm run build && npm run csp:check` because inline scripts need a CSP hash.
- New third party: needs a CSP entry and a reason in [`security.md`](./security.md); prefer none.
- Run `npm run build && npm run lhci` before opening a pull request that changes layout, images or scripts.

## Known gaps

Poppins 500 and 600 are not preloaded (see [`ROADMAP.md`](./ROADMAP.md)).
