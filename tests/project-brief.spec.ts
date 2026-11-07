import { test, expect } from "@playwright/test";
import { projects } from "../src/data/projects";

const validated = ["terracore", "okroot"];
const spanishHints = /\b(el|la|los|las|una|un|que|con|sin|para|por|del|y)\b .*\b(de|en|es|se)\b/i;

test.describe("problem, solution and result brief", () => {
  test("every project carries a brief in both languages, with validation only on two", () => {
    for (const p of projects) {
      for (const brief of [p.brief, p.en?.brief]) {
        expect(brief?.problem, p.slug).toBeTruthy();
        expect(brief?.solution, p.slug).toBeTruthy();
        expect(brief?.result, p.slug).toBeTruthy();
        expect(!!brief?.validation, p.slug).toBe(validated.includes(p.slug));
      }
    }
  });

  for (const [path, lang] of [
    ["/proyectos", "es"],
    ["/en/projects", "en"],
  ] as const) {
    test(`${lang} index cards show the brief and the validation badge only on TerraCore and OKroot`, async ({
      page,
    }) => {
      await page.goto(path);
      const cards = page.locator("[data-project-card]");
      await expect(cards).toHaveCount(projects.length);
      for (const p of projects) {
        const card = page.locator(`[data-project-card]:has(a[href$="/${p.slug}"])`);
        await expect(card.locator("[data-brief-row]"), p.slug).toHaveCount(3);
        await expect(card.locator("[data-validation]"), p.slug).toHaveCount(
          validated.includes(p.slug) ? 1 : 0
        );
        await expect(card.getByText(/Stack:/)).toBeVisible();
      }
      const label =
        lang === "en" ? "In validation with real clients" : "En validación con clientes reales";
      await expect(page.locator("[data-validation]")).toHaveCount(validated.length);
      await expect(page.locator("[data-validation]").first()).toContainText(label);
    });

    test(`${lang} home shows the brief on the featured rows`, async ({ page }) => {
      await page.goto(lang === "en" ? "/en" : "/");
      const rows = page.locator("[data-project-row]");
      await expect(rows).toHaveCount(3);
      await expect(rows.locator("[data-brief]")).toHaveCount(3);
      await expect(rows.locator("[data-validation]")).toHaveCount(2);
    });

    test(`${lang} detail pages open with the brief before the summary box`, async ({ page }) => {
      for (const p of projects) {
        await page.goto(`${lang === "en" ? "/en/projects" : "/proyectos"}/${p.slug}`);
        const brief = page.locator("[data-brief]").first();
        await expect(brief, p.slug).toBeVisible();
        await expect(page.locator("[data-validation]"), p.slug).toHaveCount(
          validated.includes(p.slug) ? 1 : 0
        );
      }
    });
  }

  test("English briefs and summaries carry no Spanish wording", () => {
    for (const p of projects) {
      for (const text of [
        p.en?.brief?.problem,
        p.en?.brief?.solution,
        p.en?.brief?.result,
        p.en?.brief?.validation,
        p.en?.summary,
      ]) {
        if (text === undefined) continue;
        expect(text, `${p.slug}: ${text}`).not.toMatch(spanishHints);
      }
    }
  });

  test("the wide TerraCore card keeps the brief and its validation badge", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto("/proyectos");
    const card = page.locator("[data-project-card][data-featured]");
    await expect(card).toHaveClass(/project-wide/);
    await expect(card.locator("[data-brief-row]")).toHaveCount(3);
    await expect(card.locator("[data-validation]")).toHaveCount(1);
  });
});
