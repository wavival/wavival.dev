import { test, expect } from "@playwright/test";

test.describe("projects index filters", () => {
  test("filtering narrows the grid and updates aria-pressed", async ({ page }) => {
    await page.goto("/proyectos");
    const cards = page.locator("[data-project-card]");
    const total = await cards.count();
    expect(total).toBeGreaterThan(0);

    const ia = page.locator('#project-filters [data-filter="ia"]');
    await ia.click();
    await expect(ia).toHaveAttribute("aria-pressed", "true");

    const visible = await cards.evaluateAll(
      (els) => els.filter((el) => (el as HTMLElement).style.display !== "none").length
    );
    expect(visible).toBeGreaterThan(0);
    expect(visible).toBeLessThan(total);

    await page.locator('#project-filters [data-filter="all"]').click();
    const restored = await cards.evaluateAll(
      (els) => els.filter((el) => (el as HTMLElement).style.display !== "none").length
    );
    expect(restored).toBe(total);
  });

  test("EN index renders the localized filter group", async ({ page }) => {
    await page.goto("/en/projects");
    await expect(page.getByRole("group", { name: "Filter projects" })).toBeVisible();
  });
});
