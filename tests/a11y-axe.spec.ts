import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

// The scroll reveal fades elements in while they enter the viewport; a half-faded line would
// read as low contrast. axe audits the settled page, so the reveal is turned off the same way a
// visitor who asks for reduced motion turns it off.
test.use({ reducedMotion: "reduce" });

// Every page of the sitemap plus the COP variants and the 404 pages, in both themes.
const sitemap = readFileSync("dist/sitemap-0.xml", "utf8");
const PATHS = [
  ...[...sitemap.matchAll(/<loc>https:\/\/www\.wavival\.dev([^<]*)<\/loc>/g)].map((m) => m[1]),
  "/cop/servicios/",
  "/cop/cotizar/",
  "/cop/en/services/",
  "/cop/en/quote/",
  "/404.html",
  "/en/404/",
];

const WCAG_22_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const theme of ["light", "dark"] as const) {
  test.describe(`axe WCAG 2.2 AA, ${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
    });

    for (const path of PATHS) {
      test(path, async ({ page }) => {
        await page.goto(path);
        const results = await new AxeBuilder({ page }).withTags(WCAG_22_AA).analyze();
        const violations = results.violations.map(
          (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`
        );
        expect(violations).toEqual([]);
      });
    }
  });
}
