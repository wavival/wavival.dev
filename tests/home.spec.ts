import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders single h1 with the headline", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("El código que firmo también lo rompo");
  });

  test("has canonical and OG meta pointing to www.wavival.dev", async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toMatch(/^https:\/\/www\.wavival\.dev/);

    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
    expect(ogUrl).toMatch(/^https:\/\/www\.wavival\.dev/);

    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("es");
  });

  test("emits Person + WebSite JSON-LD", async ({ page }) => {
    const jsonLdRaw = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLdRaw).toBeTruthy();
    const data = JSON.parse(jsonLdRaw!);
    expect(data["@graph"]).toBeDefined();
    const types = (data["@graph"] as Array<{ "@type": string }>).map((n) => n["@type"]);
    expect(types).toContain("Person");
    expect(types).toContain("WebSite");
  });

  test("hero profile image has explicit dimensions and high fetch priority", async ({ page }) => {
    const img = page.locator('img[alt="Foto de perfil de Valentina Ramírez"]');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute("width", "320");
    await expect(img).toHaveAttribute("height", "400");
    await expect(img).toHaveAttribute("fetchpriority", "high");
  });

  test("all section anchors exist", async ({ page }) => {
    for (const id of ["hero", "projects", "stack", "about", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test("skip link becomes visible on focus and targets main", async ({ page }) => {
    const skip = page.getByRole("link", { name: /saltar al contenido principal/i });
    await skip.focus();
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute("href", "#main-content");
  });

  test("the Stack nav link stays marked while the stack section is in view", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const link = page.locator('header a[href$="#stack"]');
    await expect(link).not.toHaveAttribute("aria-current", /.+/);
    await page.locator("#stack").scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const el = document.getElementById("stack");
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 200);
    });
    await expect(link).toHaveAttribute("aria-current", "location");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(link).not.toHaveAttribute("aria-current", /.+/);
  });
});
