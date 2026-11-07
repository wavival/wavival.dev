// The shared rules (types, header length, em dash policy) come from
// @lumina-w/dev-standards. Only the scope list is overridden: this repo
// does not use the package's "billing" scope.
const scopes = [
  "api",
  "ui",
  "db",
  "auth",
  "ci",
  "deploy",
  "docs",
  "config",
  "tests",
  "security",
  "deps",
  "core",
  "seo",
  "a11y",
];

module.exports = {
  extends: ["@lumina-w/dev-standards/commitlint"],
  rules: {
    "scope-enum": [2, "always", scopes],
  },
};
