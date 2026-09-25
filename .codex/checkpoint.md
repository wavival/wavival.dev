# wavival.dev global checkpoint

Last verified: 2026-09-25

## Production baseline

- Hosting: Vercel project `wavival-dev` under the `wavival` team.
- Framework: static Astro 7 with output in `dist/`.
- Runtime: Node 22, pinned by `.nvmrc`, `package.json`, and GitHub Actions.
- Deployment contract: `vercel.json` owns the build, install, output, security headers, cache rules, permanent redirects, and `/api/*` rewrite.
- Path composition: Vercel Microfrontends group `wavival` uses `wavival-dev` as the default app and routes `/nullbreach/:path*` to the `nullbreach` project.
- CSP: hash-based `script-src`, validated after every build by `npm run csp:check`.
- Analytics: Umami and Core Web Vitals run only when both public Umami variables are present.

## Delivery baseline

- `dev` is the integration branch, `stg` is staging, and `main` is production.
- Create work branches from `dev` using `feature/*`, `fix/*`, or `chore/*`.
- Use Conventional Commits in English: `type(scope): message`.
- Open work PRs to `dev`; promote `dev` to `stg` and `stg` to `main` only after required checks pass.
- Required checks: `commitlint`, `quality`, `tests`, `security scan`, and `validate-pr-base`.

## Verification baseline

- Run `npm audit --audit-level=high --omit=dev`.
- Run `npm run format:check`, `npm run lint`, and `npm run check`.
- Run `npm run build`, then `npm run csp:check` and `npm test`.
- Run `npm run lhci` and `npm run links` against the current `dist/`.
- Validate Vercel configuration and preview deployment before promotion.

## Documentation baseline

- Keep `README.md`, `AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md`, this checkpoint, and `.claude/checkpoint.md` aligned with infrastructure changes.
- Keep `COMPONENTS.md`, `DESIGN.md`, and `assets/README.md` aligned when their documented areas change.
