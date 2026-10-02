// Verifies that every component class declared in src/styles/utilities.css
// survives into the built CSS. Tailwind purges `@layer components` classes it
// cannot find as complete strings in the source (for example a class assembled
// as `btn-${variant}`), which silently strips the styling in production.
// Run after `npm run build`. Exits non-zero when a class is missing.

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const astroDir = path.join(root, "dist", "_astro");

const source = readFileSync(path.join(root, "src/styles/utilities.css"), "utf8");
const declared = [...new Set([...source.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]))];

const built = readdirSync(astroDir)
  .filter((f) => f.endsWith(".css"))
  .map((f) => readFileSync(path.join(astroDir, f), "utf8"))
  .join("\n");

const missing = declared.filter((name) => !new RegExp(`\\.${name}(?![a-z0-9-])`).test(built));

if (missing.length > 0) {
  console.error(`Component classes purged from the build: ${missing.join(", ")}`);
  console.error("Reference each class as a literal string in a component so Tailwind keeps it.");
  process.exit(1);
}

console.log(`OK: all ${declared.length} component classes are present in the build.`);
