# wavival.dev Delivery Governance Checkpoint

Date: 2026-09-23

## Done

- Audited the default branch, remote branches, existing workflows, Husky setup, package scripts, and documented Netlify production deploy.
- Created `dev` and `stg` from the current `main` commit.
- Added strict commitlint config for `feature`, `fix`, and `chore` commits with portfolio scopes.
- Added `.husky/commit-msg` and CI commitlint enforcement across pull request commit ranges.
- Updated CI to run on `dev`, `stg`, and `main`, with `quality`, `tests`, `lighthouse`, `links`, and `security scan` jobs.
- Added gitleaks secret scanning with `GITLEAKS_LICENSE`.
- Added `validate-pr-base` to enforce `feature/fix/chore` and Dependabot branches to `dev`, `dev` to `stg`, and `stg` to `main`.
- Added `auto-merge-dev` for non-draft human work PRs into `dev` using `PROMOTE_TOKEN`.
- Added scheduled merged-branch cleanup reporting every 12 hours.
- Updated Dependabot to target `dev` with `chore(deps)` and `chore(ci)` prefixes.
- Upgraded Astro to 7.3.4 and replaced the old Astro Tailwind integration with Tailwind 3 PostCSS processing to clear production dependency audit failures.
- Updated README, AGENTS.md, CLAUDE.md, and CHANGELOG.md.

## Pending validation

- Apply branch protection to `dev`, `stg`, and `main` after the setup branch is pushed and workflow check names are available.
- Open the setup PR to `dev` and verify all required checks complete successfully.

## Valentina decisions

- Staging deploy target: production deploy is documented as Netlify from `main`. No existing `stg` deploy target was found in the repository. Decide whether `stg` should get a separate Netlify site, Deploy Preview convention, or another staging target before wiring staging deployment.
- Branch cleanup deletion: the scheduled workflow reports branches that are fully merged into `dev` and have no open PR, but does not delete them. Scheduled deletion needs explicit human approval because it is a persistent destructive action.
- Dev dependency audit remediation: `npm audit` still reports dev-only vulnerabilities through the Lighthouse CI dependency chain. Production dependency audit with `--omit=dev` is clean. Decide whether to handle dev-only audit remediation in a separate `chore/deps` pass or wait for upstream Lighthouse CI releases.
