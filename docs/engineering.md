# Engineering practices

> Last updated: 2026-10-05

How work is done in this repository. Operational rules for agents are in [`../AGENTS.md`](../AGENTS.md); this document is the human-readable version with the reasons and the commands.

## Branches and pull requests

- Flow: `feature/*`, `fix/*` or `chore/*` into `dev`, then `dev` into `stg`, then `stg` into `main`. Promotions use merge commits, `stg` into `main` is merged only by the owner, and nothing is pushed to the protected branches.
- Start every task from an up-to-date `dev`, one branch and one pull request per task.
- Pull requests into `dev` merge automatically (`auto-merge-dev.yml`) once the required checks pass. Merged branches are deleted by `delete-merged-branches.yml`, every 12 hours or on demand with its `dry_run` input; it skips protected branches, branches with an open pull request and branches whose tip moved past the merged head. Only `feature/*`, `fix/*` and `chore/*` branches get auto-merge.
- The pull request base is validated (`validate-pr-base.yml`).
- A promotion head can be a branch whose tree is identical to the base side when a direct head would be reported as behind; it is checked with `git diff --quiet`.

## Commits and titles

- Conventional Commits, `type(scope): message`, scope required. Scopes: `api`, `ui`, `db`, `auth`, `ci`, `deploy`, `docs`, `config`, `tests`, `security`, `deps`, `core`, `seo`, `a11y` (`commitlint.config.cjs`).
- Plain ASCII punctuation: no em dashes, en dashes or decorative icons in text, buttons and links.
- Hooks: `pre-commit` runs `lint-staged` (ESLint and Prettier on staged files); `commit-msg` runs commitlint, then `~/.claude/git-hooks/commit-msg` when that executable exists on the machine. In CI, `commit-lint.yml` checks commit messages on every push.

## Code

- Astro pages stay static; client behavior is vanilla TypeScript in `src/scripts/` or in a component script. TypeScript uses Astro's `strict` preset.
- Use the `@/` alias for imports from `src/`.
- Components follow atomic design (`atoms`, `molecules`, `organisms`) and the contracts in [`../COMPONENTS.md`](../COMPONENTS.md). Visual rules and tokens are in [`../DESIGN.md`](../DESIGN.md).
- Write component class names as complete literals so Tailwind keeps them; `npm run css:check` fails when a class is purged.
- Resolve every localized route through `src/i18n/utils.ts`; never hard-code a path.
- Content follows [`brand.md`](./brand.md) and [`commercial.md`](./commercial.md): no claim without evidence.
- Both languages change together (see [`i18n.md`](./i18n.md)).

## Checks before opening a pull request

Proportional to the change; for code, all of these:

```bash
npm run format:check
npm run lint
npm run check
npm run build
npm run csp:check
npm run css:check
npm run security-txt:check
npm test
```

`npm run lhci` and `npm run links` run in CI after a build. Do not report a check as passed unless it completed successfully.

## CI

`ci.yml` runs on pushes and pull requests to `dev`, `stg` and `main`. It has four jobs: `quality` (audit, `security.txt` expiry, format, lint, type check, build, CSP and CSS checks), `tests` (Playwright against a production preview on port 4329), `lighthouse` and `links`. Pull requests also run the title check, the base check and Gitleaks; Gitleaks and commit lint also run on every push. `codeql.yml` (CodeQL for TypeScript, JavaScript and workflows) runs on the same branches and weekly. `.github/dependabot.yml` opens weekly `chore(deps)` pull requests to `dev` (npm minor and patch grouped, GitHub Actions including majors); Dependabot branches are not auto-merged. npm major versions are ignored and migrated by hand in their own pull request. When an update changes how Prettier formats files, run `npm run format` in the same pull request. Do not merge or promote while a required check is failing, pending, cancelled, skipped or unavailable.

## Documentation

Each topic has one source of truth ([`../AGENTS.md`](../AGENTS.md) has the table). A change updates the document it affects and its "Last updated" line, plus the `CHANGELOG.md` entry under `[Unreleased]`; the README changes only when its overview, commands, structure or document index stops being accurate.

## Releases

Versions follow SemVer and are published with the manual `Release` workflow; see [`RELEASING.md`](./RELEASING.md).
