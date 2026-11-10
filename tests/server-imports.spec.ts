import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

// Vercel compiles `middleware.ts` and `api/*.ts` file by file as Node ESM, so a
// relative import without its `.js` extension is not found at run time: the
// middleware answers 500 MIDDLEWARE_INVOCATION_FAILED and the functions crash
// with ERR_MODULE_NOT_FOUND, while `astro dev`, `astro preview` and these tests
// (which resolve extensionless imports) keep working.

const ROOT = resolve(".");
const ENTRIES = ["middleware.ts", "api/quote.ts", "api/keepalive.ts"];
const RELATIVE_IMPORT = /\bfrom\s+["'](\.{1,2}\/[^"']+)["']/g;

function serverImportGraph(): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  const queue = ENTRIES.map((entry) => join(ROOT, entry));
  while (queue.length > 0) {
    const file = queue.pop() as string;
    if (graph.has(file)) continue;
    const specifiers = [...readFileSync(file, "utf8").matchAll(RELATIVE_IMPORT)].map((m) => m[1]);
    graph.set(file, specifiers);
    for (const specifier of specifiers) {
      queue.push(resolve(dirname(file), specifier.replace(/\.js$/, ".ts")));
    }
  }
  return graph;
}

test("every relative import reachable from the middleware and the functions names its .js file", () => {
  const missing: string[] = [];
  for (const [file, specifiers] of serverImportGraph()) {
    for (const specifier of specifiers) {
      if (!specifier.endsWith(".js")) missing.push(`${relative(ROOT, file)}: ${specifier}`);
    }
  }
  expect(missing).toEqual([]);
});
