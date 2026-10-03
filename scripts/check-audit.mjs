// Fails when `npm audit` reports a high or critical advisory in production
// dependencies, except for the advisories listed in ACCEPTED. This replaces
// `npm audit --audit-level=high --omit=dev` in CI so that an advisory with no
// patched release does not block every pull request.
//
// Each entry in ACCEPTED must name why it is accepted and when to look at it
// again. Remove it as soon as a patched version exists: the gate then covers it.

import { spawnSync } from "node:child_process";

const ACCEPTED = {
  // Flagged for every published version (latest is 3.0.3). Enters through
  // tailwindcss@3 (chokidar, micromatch, fast-glob) and the Vercel routing
  // package, only at build and dev time. Re-check when tailwindcss@4 is adopted.
  "GHSA-vfj7-8cjw-p6xm": "braces: stack exhaustion on deeply nested patterns",
  // Flagged for every published version (latest is 4.2.0). Enters through astro,
  // only at build time. Re-check on the next astro upgrade.
  "GHSA-ch52-4w7c-c8xp": "http-cache-semantics: max-stale handling can leak cached responses",
};

const BLOCKING = new Set(["high", "critical"]);

const result = spawnSync("npm", ["audit", "--omit=dev", "--json"], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  console.error("check-audit: could not read the output of `npm audit`");
  console.error(result.stderr || result.stdout);
  process.exit(1);
}

if (report.error) {
  console.error(`check-audit: npm audit failed: ${report.error.summary ?? report.error.code}`);
  process.exit(1);
}

// Only entries in `via` that are objects are advisories; strings point to another package.
const advisories = new Map();
for (const [name, vulnerability] of Object.entries(report.vulnerabilities ?? {})) {
  for (const via of vulnerability.via) {
    if (typeof via === "string" || !BLOCKING.has(via.severity)) continue;
    const id = via.url?.split("/").pop() ?? String(via.source);
    advisories.set(id, { name, severity: via.severity, title: via.title, url: via.url });
  }
}

const blocking = [...advisories].filter(([id]) => !(id in ACCEPTED));
const accepted = [...advisories].filter(([id]) => id in ACCEPTED);

for (const [id] of accepted) {
  console.log(`check-audit: accepted ${id} (${ACCEPTED[id]})`);
}

const stale = Object.keys(ACCEPTED).filter((id) => !advisories.has(id));
for (const id of stale) {
  console.log(`check-audit: ${id} no longer reported, remove it from ACCEPTED`);
}

if (blocking.length > 0) {
  for (const [id, a] of blocking) {
    console.error(`check-audit: ${a.severity} ${a.name}: ${a.title} (${id}) ${a.url}`);
  }
  console.error("check-audit: fix the dependency, or accept the advisory with a reason");
  process.exit(1);
}

console.log("check-audit: no blocking advisories in production dependencies");
