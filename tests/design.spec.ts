import { test, expect } from "@playwright/test";

test.describe("design system regressions", () => {
  test("primary button keeps its fill and secondary keeps its outline", async ({ page }) => {
    await page.goto("/");

    const primary = page.locator("#hero .btn-primary").first();
    await expect(primary).toBeVisible();
    await expect(primary).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(primary).toHaveCSS("color", "rgb(255, 255, 255)");

    const secondary = page.locator("#about .btn-secondary").first();
    await expect(secondary).toBeVisible();
    await expect(secondary).toHaveCSS("border-top-width", "1px");
    await expect(secondary).toHaveCSS("border-top-style", "solid");
  });

  test("project title hover keeps the display typography", async ({ page }) => {
    await page.goto("/");

    const title = page.locator("[data-project-row] h3 a").first();
    const before = await title.evaluate((el) => getComputedStyle(el).fontSize);
    await title.hover();
    await expect(title).toHaveCSS("font-size", before);
    await expect(title).toHaveCSS("text-transform", "none");
  });

  test("home about buttons and icons are all 44px", async ({ page }) => {
    await page.goto("/");
    const about = page.locator("#about");
    const heights = await Promise.all(
      ["a.btn-primary", "a.btn-secondary", "a.icon-btn"].map(async (sel) =>
        Math.round((await about.locator(sel).first().boundingBox())?.height ?? 0)
      )
    );
    expect(heights).toEqual([44, 44, 44]);
    for (const [path, label] of [
      ["/", "Ver criterio técnico"],
      ["/en/", "View technical criteria"],
    ]) {
      await page.goto(path);
      const stackButton = page.locator("#stack a.btn-secondary");
      await expect(stackButton).toHaveCount(1);
      await expect(stackButton).toHaveText(label);
      expect(Math.round((await stackButton.boundingBox())?.height ?? 0)).toBe(50);
      await expect(page.locator("#stack a.action-link")).toHaveCount(0);
    }
    await page.goto("/");
    const hero = page.locator("#hero");
    expect(Math.round((await hero.locator("a.btn-primary").boundingBox())?.height ?? 0)).toBe(50);
    expect(Math.round((await hero.locator("a.icon-btn").first().boundingBox())?.height ?? 0)).toBe(
      50
    );
  });

  test.describe("mobile", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("open menu fills the viewport below the header", async ({ page }) => {
      await page.goto("/");
      await page.locator("#menu-btn").click();

      const menu = page.locator("#mobile-menu");
      await expect(menu).toHaveClass(/opacity-100/);
      await expect.poll(async () => (await menu.boundingBox())?.y).toBe(64);
      expect((await menu.boundingBox())?.height).toBe(844 - 64);
    });

    for (const route of [
      "/",
      "/proyectos/",
      "/servicios/",
      "/sobre-mi/",
      "/contacto/",
      "/herramientas/",
    ]) {
      test(`${route} has no horizontal overflow`, async ({ page }) => {
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
});
