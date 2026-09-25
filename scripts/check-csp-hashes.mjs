// Verifies that every inline <script> emitted into dist/ has a matching sha256
// hash in the script-src directive of the Content-Security-Policy header in
// vercel.json. This guards the hash-based CSP: if an inline
// script changes or a new one is added, its hash drifts and the browser would
// block it in production. Run after `npm run build`. Exits non-zero on any miss.
//
// External scripts (src=...) are covered by host allow-lists, not hashes.
// JSON-LD (type=application/ld+json) is a CSP data block, not gated by script-src.

import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(root, "dist");

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full);
    return e.name.endsWith(".html") ? [full] : [];
  });

const hashesFromCsp = (csp) => {
  const scriptSrc = csp.split(";").find((d) => d.trim().startsWith("script-src")) ?? "";
  return new Set([...scriptSrc.matchAll(/'(sha256-[A-Za-z0-9+/=]+)'/g)].map((m) => m[1]));
};

const vercel = JSON.parse(readFileSync(path.join(root, "vercel.json"), "utf8"));
const vercelCsp = vercel.headers
  ?.flatMap((rule) => rule.headers ?? [])
  .find((header) => header.key.toLowerCase() === "content-security-policy")?.value;

if (!vercelCsp) {
  console.error("check-csp-hashes: CSP missing from vercel.json");
  process.exit(1);
}

const policies = [{ file: "vercel.json", hashes: hashesFromCsp(vercelCsp) }];

let htmlFiles = [];
try {
  htmlFiles = walk(distDir);
} catch {
  console.error("check-csp-hashes: dist/ not found (run `npm run build` first)");
  process.exit(1);
}
if (htmlFiles.length === 0) {
  console.error("check-csp-hashes: no HTML in dist/ (run `npm run build` first)");
  process.exit(1);
}

// Inline <script> with no src= and not a data block (ld+json / json / importmap).
const tag = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
const isDataBlock = (attrs) =>
  /type\s*=\s*["'](application\/(ld\+json|json)|importmap)["']/i.test(attrs);

const misses = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const [, attrs, body] of html.matchAll(tag)) {
    if (isDataBlock(attrs)) continue;
    const hash = "sha256-" + createHash("sha256").update(body, "utf8").digest("base64");
    const missingFrom = policies
      .filter((policy) => !policy.hashes.has(hash))
      .map((policy) => policy.file);
    if (missingFrom.length) {
      misses.push({
        file: path.relative(root, file),
        hash,
        attrs: attrs.trim(),
        missingFrom,
      });
    }
  }
}

if (misses.length) {
  console.error(`check-csp-hashes: ${misses.length} inline script(s) missing a CSP hash:\n`);
  const seen = new Set();
  for (const m of misses) {
    if (seen.has(m.hash)) continue;
    seen.add(m.hash);
    console.error(
      `  '${m.hash}'  (${m.missingFrom.join(", ")}; e.g. ${m.file}${m.attrs ? `, <script ${m.attrs}>` : ""})`
    );
  }
  console.error(`\nAdd the hash(es) above to script-src in vercel.json.`);
  process.exit(1);
}

console.log(
  `check-csp-hashes: OK (${htmlFiles.length} pages, ${policies.map((p) => `${p.hashes.size} hashes in ${p.file}`).join(", ")}).`
);
