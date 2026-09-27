import { test, expect } from "@playwright/test";

test.describe("i18n", () => {
  test("ES home is lang=es, serves the ES CV, and links to the EN locale", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator('a[href="/cv_valentina_ramirez_es.pdf"]').first()).toBeVisible();
    await expect(page.locator('a[hreflang="en"][href="/en"]').first()).toBeAttached();
  });

  test("EN home is lang=en, canonical /en/, serves the EN CV, links back to ES", async ({
    page,
  }) => {
    await page.goto("/en");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe("https://www.wavival.dev/en/");

    await expect(page.locator('a[href="/cv_valentina_ramirez_en.pdf"]').first()).toBeVisible();
    await expect(page.locator('a[hreflang="es"]').first()).toBeAttached();
  });

  test("home emits reciprocal hreflang alternates", async ({ page }) => {
    await page.goto("/");
    const alts = page.locator('link[rel="alternate"][hreflang]');
    const langs = await alts.evaluateAll((els) => els.map((e) => e.getAttribute("hreflang")));
    expect(langs).toEqual(expect.arrayContaining(["es", "en", "x-default"]));
  });
});
