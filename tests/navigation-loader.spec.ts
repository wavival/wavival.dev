import { test, expect } from "@playwright/test";

test.describe("navigation loader", () => {
  test("shows the decorative W logo while Astro prepares a navigation", async ({ page }) => {
    await page.goto("/");

    const loader = page.locator("#navigation-loader");
    await expect(loader).toHaveAttribute("aria-hidden", "true");
    await expect(loader.locator('img[src="/brand/logo-w.webp"]')).toHaveCount(1);
    await expect(loader).not.toHaveClass(/is-active/);

    await page.evaluate(() => document.dispatchEvent(new Event("astro:before-preparation")));
    await expect(loader).toHaveClass(/is-active/);

    await page.evaluate(() => document.dispatchEvent(new Event("astro:page-load")));
    await expect(loader).toHaveClass(/is-active/);
    await expect(loader).not.toHaveClass(/is-active/);
  });
});
