import { test, expect } from "@playwright/test";
import { projects, projectFilters } from "../src/data/projects";

test.describe("projects index filters", () => {
  test("filtering narrows the grid and updates aria-pressed", async ({ page }) => {
    await page.goto("/proyectos");
    const cards = page.locator("[data-project-card]");
    const total = await cards.count();
    expect(total).toBeGreaterThan(0);

    const ai = page.locator('#project-filters [data-filter="ai"]');
    await ai.click();
    await expect(ai).toHaveAttribute("aria-pressed", "true");

    await expect
      .poll(() =>
        cards.evaluateAll(
          (els) => els.filter((el) => (el as HTMLElement).style.display !== "none").length
        )
      )
      .toBe(projects.filter((p) => projectFilters(p).includes("ai")).length);

    await page.locator('#project-filters [data-filter="all"]').click();
    const restored = await cards.evaluateAll(
      (els) => els.filter((el) => (el as HTMLElement).style.display !== "none").length
    );
    expect(restored).toBe(total);
  });

  test("EN index renders the localized filter group", async ({ page }) => {
    await page.goto("/en/projects");
    await expect(page.getByRole("group", { name: "Filter projects" })).toBeVisible();
    await expect(page.getByRole("button", { name: /security/i })).toBeVisible();
  });

  test("design links appear only in the case studies, one per part with a prototype", async ({
    page,
  }) => {
    await page.goto("/proyectos");
    await expect(page.locator('a:has-text("Ver diseño")')).toHaveCount(0);

    for (const project of projects) {
      const designs = project.parts.filter((part) => part.designLink).length;
      await page.goto(`/proyectos/${project.slug}`);
      await expect(page.locator('a:text-is("Ver diseño")'), project.slug).toHaveCount(designs);

      await page.goto(`/en/projects/${project.slug}`);
      await expect(page.locator('a:text-is("View design")'), project.slug).toHaveCount(designs);
    }
  });

  test("case studies animate disclosures and render learnings as cards", async ({ page }) => {
    await page.goto("/proyectos/terracore");

    const disclosure = page.locator("[data-disclosure]:not([data-part])").first();
    await disclosure.locator("summary").click();
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(disclosure.locator("[data-disclosure-content]")).toHaveCSS("overflow", "hidden");

    await disclosure.locator("summary").click();
    await expect(disclosure).not.toHaveAttribute("open", "");

    await expect(page.locator("#cs-app-learnings [data-learnings-cards] > article")).toHaveCount(6);
  });

  test("design links point to Netlify prototypes and only wavival.dev has a design system", async ({
    page,
  }) => {
    for (const project of projects) {
      for (const part of project.parts) {
        if (part.designLink) {
          expect(part.designLink.href).toMatch(/^https:\/\/[a-z-]+-prototype\.netlify\.app\/$/);
        }
      }
      await page.goto(`/proyectos/${project.slug}`);
      await expect(page.locator('a:has-text("Ver sistema de diseño")')).toHaveCount(
        project.slug === "wavival-dev" ? 1 : 0
      );
    }

    await page.goto("/proyectos/wavival-dev");
    await expect(page.locator('a:has-text("Ver sitio")')).toHaveCount(0);
  });
});
