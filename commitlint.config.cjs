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
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", scopes],
    "scope-empty": [2, "never"],
    "subject-case": [0],
  },
};
