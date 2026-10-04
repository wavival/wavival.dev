# Versions and releases

> Last updated: 2026-10-04

The release standard (version format, how the number is chosen, changelog shape
and what the workflow checks) is shared by the Lúmina W repos and lives in
[`docs/release-standard.md`](https://github.com/lumina-w/dev-standards/blob/main/docs/release-standard.md)
of `lumina-w/dev-standards`. Only what is specific to this repo is here.

## Specific to this repo

- **Changelog:** [`CHANGELOG.md`](../CHANGELOG.md). Work that has not shipped goes
  under `[Unreleased]`.
- **Version file:** `package.json` (and `package-lock.json`). Its version must
  equal the tag.
- **Workflow:** `.github/workflows/release.yml`, which calls `shared-release.yml`
  of `lumina-w/agents` on a GitHub-hosted runner. Run it from the Actions tab,
  `Release`, `Run workflow`. It runs from `dev` (the default branch) but always
  checks out `main`.
- **Existing tags:** `v1.0.0`, `v2.0.0`, `v3.0.0`, `v3.1.0` and `v4.0.0`.
  Tags are never moved or deleted, so the next version must be higher than
  `v4.0.0`.

## How a release is made

1. Everything in the version is already on `main`: promote `dev -> stg -> main`,
   the last step merged by the owner.
2. Claude proposes the version and the changelog section: it lists the PRs merged
   into `dev` since the last tag and applies the table of the standard. The owner
   confirms.
3. A PR into `dev` turns `[Unreleased]` into `[X.Y.Z] - YYYY-MM-DD`, leaves an
   empty `[Unreleased]` above it, updates the compare links at the bottom and
   bumps the version with `npm version X.Y.Z --no-git-tag-version`. It is promoted
   to `main` like any other change.
4. In Actions, `Release`, `Run workflow`: enter the version without the `v` and
   tick `prerelease` only for a suffix (`4.1.0-rc.1`). With `dry-run` it runs every
   check and creates nothing.
5. Check the release page and that production matches.

If a check fails, the workflow creates nothing and the message says what is
missing. A wrong release is fixed with a new PATCH version.

## Claude's tools

The session tools of Claude can read releases and tags, and the session proxy
blocks pushing tags. The workflow creates the tag and the release. Claude can
start it only if the Actions tool of the session allows it; otherwise the owner
starts it from the Actions tab.
