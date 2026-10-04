# AGENTS.md

> Last updated: 2026-10-04

Operational rules for agents modifying this repository.

## Scope

- Change only what the requested task requires.
- Do not add editor settings, personal workflow files, local AI configuration, credentials, generated artifacts, or unrelated documentation.
- Preserve existing user changes outside the requested scope.
- Never expose secrets, private infrastructure details, client information, or vulnerabilities.
- Use plain ASCII punctuation. Do not use em dashes, en dashes, or decorative icons in text buttons and links unless explicitly requested.

## Documentation sources

Each topic has one source of truth. Link to it instead of duplicating its contents.

| Topic                                                                             | Source                                                                     |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Repository overview, setup, scripts, architecture, routes, quality and deployment | `README.md`                                                                |
| Visual system, tokens, typography and accessibility design rules                  | `DESIGN.md`                                                                |
| Layout and component contracts                                                    | `COMPONENTS.md`                                                            |
| Version history                                                                   | `CHANGELOG.md`                                                             |
| SEO, indexing, structured data and AI discovery                                   | `docs/seo.md`                                                              |
| Spanish and English pages, copy and rules                                         | `docs/i18n.md`                                                             |
| Accessibility guarantees and checks                                               | `docs/accessibility.md`                                                    |
| Performance decisions and measuring                                               | `docs/performance.md`                                                      |
| Security headers, CSP, quote function and data                                    | `docs/security.md`                                                         |
| Engineering practices, checks and CI                                              | `docs/engineering.md`                                                      |
| Versioning and release process                                                    | `docs/RELEASING.md`                                                        |
| Brand and content boundaries                                                      | `docs/brand.md`                                                            |
| Commercial claims and calls to action                                             | `docs/commercial.md`                                                       |
| Pending work, open decisions and known gaps                                       | `docs/ROADMAP.md`                                                          |
| Claude Code project guide                                                         | `CLAUDE.md`                                                                |
| CV downloads                                                                      | `public/cv_valentina_ramirez_es.pdf`, `public/cv_valentina_ramirez_en.pdf` |
| Vulnerability reporting                                                           | `SECURITY.md` and `public/.well-known/security.txt`                        |

Every document carries a `> Last updated: YYYY-MM-DD` line (`CHANGELOG.md` is dated by its release headings). Update the source document affected by a change and its date. Update the README only when its overview, commands, structure, or document index becomes inaccurate. Do not create duplicate explanations.

## Delivery flow

- `dev` is integration, `stg` is staging, and `main` is production.
- Create work branches from `dev` using `feature/*`, `fix/*`, or `chore/*`. Never name a branch after a tool or agent (for example `claude/*`).
- Open work pull requests to `dev`, ready for review (not as drafts).
- Promote only `dev` to `stg` and `stg` to `main`.
- Do not push directly to protected branches.
- Before opening or updating a pull request, check that it has no conflicts with its base branch, with other local and remote branches, or with other open pull requests (for example `git merge-tree --write-tree --name-only <other> <head>`), and resolve or report any conflict before requesting review.
- Use Conventional Commits: `type(scope): message`.
- Do not merge or promote while required checks are failing, pending, cancelled, skipped, or unavailable.

## Implementation rules

- Keep the Astro pages static and use vanilla TypeScript. `api/quote.ts` is the sole Vercel Function: it validates quote submissions, sends them through Brevo, and reads only the server-side `BREVO_API_KEY` variable.
- Keep Spanish at root and English under `/en/`. Resolve localized targets through `src/i18n/utils.ts`.
- Follow `DESIGN.md` for visual changes and `COMPONENTS.md` for component changes.
- Keep public content aligned with `docs/brand.md` and `docs/commercial.md`. Everything on `wavival.dev` belongs to wavival and everything on `luminaw.co` to Lúmina W; never attribute one to the other.
- Keep public AI-discovery files aligned with site facts when those facts change.
- Do not place source PNG duplicates for Open Graph cards in `assets/`.

## Verification

Run checks proportional to the change:

- Documentation only: format the edited Markdown.
- Code or configuration: run the relevant lint, type, build, CSP, CSS, and test commands documented in `README.md`.
- UI, content, or configuration changes: verify SEO, accessibility, and responsive behavior before delivery.
- Do not report a check as passed unless it completed successfully.

## Repository hygiene

- Keep local state ignored through `.gitignore`.
- Do not commit `.vscode/`, `.idea/`, `.claude/`, `.codex/`, `.agents/`, local environment files, build output, reports, or dependencies.
- Keep `CLAUDE.md` as the Claude Code guide: it imports `AGENTS.md` and links to the documentation set. Do not duplicate rules there.
