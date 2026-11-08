import { test, expect } from "@playwright/test";

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, closes via Escape, and updates aria-expanded", async ({ page }) => {
    await page.goto("/");

    const btn = page.locator("#menu-btn");
    const menu = page.locator("#mobile-menu");

    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveClass(/opacity-0/);

    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toHaveClass(/opacity-100/);

    await page.keyboard.press("Escape");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveClass(/opacity-0/);
  });

  for (const path of ["/", "/en/"]) {
    test(`${path} shows Instagram, TikTok and LinkedIn above the Blog W and contact row`, async ({
      page,
    }) => {
      await page.goto(path);
      await page.locator("#menu-btn").click();
      const menu = page.locator("#mobile-menu");
      await expect(menu).toHaveClass(/opacity-100/);
      const actions = menu.locator("[data-menu-actions]");
      const blog = actions.locator("a.btn-primary");
      const contact = actions.locator("a.btn-secondary");
      await expect(blog).toHaveAttribute("href", "https://blog.luminaw.co");
      await expect(blog).toHaveAttribute("target", "_blank");
      await expect(contact).toHaveAttribute("href", "mailto:wavival.dev@luminaw.co");
      // The overlay slides in for 300ms, so boxes are read after the transition settles.
      await menu.evaluate(
        (el) =>
          new Promise<void>((done) => {
            if (getComputedStyle(el).transform === "none") return done();
            el.addEventListener("transitionend", () => done(), { once: true });
            setTimeout(done, 600);
          })
      );
      const [blogBox, contactBox] = await Promise.all([blog.boundingBox(), contact.boundingBox()]);
      expect(Math.round(blogBox?.y ?? 0)).toBe(Math.round(contactBox?.y ?? -1));
      expect((blogBox?.x ?? 0) + (blogBox?.width ?? 0)).toBeLessThanOrEqual(contactBox?.x ?? 0);
      const social = menu.locator("[data-social-links] a.icon-btn");
      expect(await social.evaluateAll((links) => links.map((a) => a.getAttribute("href")))).toEqual(
        [
          "https://instagram.com/wavival_dev",
          "https://www.tiktok.com/@wavival_dev",
          "https://linkedin.com/in/wavival",
        ]
      );
      const socialBox = await social.first().boundingBox();
      expect((socialBox?.y ?? 0) + (socialBox?.height ?? 0)).toBeLessThan(blogBox?.y ?? 0);
    });
  }

  test("clicking a same-page anchor closes the menu", async ({ page }) => {
    await page.goto("/");

    await page.locator("#menu-btn").click();
    await expect(page.locator("#mobile-menu")).toHaveClass(/opacity-100/);

    await page.locator('#mobile-menu a[href="/#stack"]').first().click();

    await expect(page.locator("#menu-btn")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#mobile-menu")).toHaveClass(/opacity-0/);
  });
});
