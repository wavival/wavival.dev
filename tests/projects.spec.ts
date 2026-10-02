import { test, expect } from "@playwright/test";

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
      .toBe(3);

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

  test("design projects expose a design link only in their case studies", async ({ page }) => {
    const slugs = [
      "terracore",
      "terracore-landing",
      "okroot",
      "okroot-landing",
      "lumina-w",
      "blog-lumina-w",
    ];

    await page.goto("/proyectos");
    await expect(page.locator('a:has-text("Ver diseño")')).toHaveCount(0);

    for (const slug of slugs) {
      await page.goto(`/proyectos/${slug}`);
      await expect(page.locator('a:has-text("Ver diseño")')).toHaveCount(1);

      await page.goto(`/en/projects/${slug}`);
      await expect(page.locator('a:has-text("View design")')).toHaveCount(1);
    }
  });

  test("case studies animate disclosures and render learnings as cards", async ({ page }) => {
    await page.goto("/proyectos/terracore");

    const disclosure = page.locator("[data-disclosure]").first();
    await disclosure.locator("summary").click();
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(disclosure.locator("[data-disclosure-content]")).toHaveCSS("overflow", "hidden");

    await disclosure.locator("summary").click();
    await expect(disclosure).not.toHaveAttribute("open", "");

    await expect(page.locator("[data-learnings-cards] > article")).toHaveCount(1);
  });
});
