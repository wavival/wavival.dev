import { test, expect } from "@playwright/test";

test.describe("theme toggle", () => {
  test("defaults to dark when no preference is saved", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("respects saved dark preference before paint (no FOUC)", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("respects saved light preference before paint", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("toggle flips html.dark and persists to localStorage", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto("/");

    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    const toggle = page.locator("#theme-toggle-desktop");
    if (await toggle.isVisible()) {
      await toggle.click();
    } else {
      await page.locator("#theme-toggle-mobile").click();
    }
    await expect(html).toHaveClass(/dark/);

    const stored = await page.evaluate(() => localStorage.getItem("theme"));
    expect(stored).toBe("dark");
  });
});
