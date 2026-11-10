import { test, expect, type Page } from "@playwright/test";

const PAGES = [
  { path: "/servicios/", label: "Volver arriba" },
  { path: "/en/services/", label: "Back to top" },
  { path: "/cop/servicios/", label: "Volver arriba" },
  { path: "/sobre-mi/", label: "Volver arriba" },
  { path: "/en/about/", label: "Back to top" },
];

const button = (page: Page) => page.locator("[data-back-to-top] button");

/** Records the behavior of every window.scrollTo call. */
const recordScrolls = (page: Page) =>
  page.addInitScript(() => {
    const original = window.scrollTo.bind(window);
    (window as unknown as { scrolls: string[] }).scrolls = [];
    window.scrollTo = ((...args: [ScrollToOptions]) => {
      const options = args[0];
      if (typeof options === "object") {
        (window as unknown as { scrolls: string[] }).scrolls.push(options.behavior ?? "auto");
      }
      return original(...(args as [ScrollToOptions]));
    }) as typeof window.scrollTo;
  });

const scrollDown = async (page: Page) => {
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
  await expect(button(page)).toBeVisible();
};

for (const { path, label } of PAGES) {
  test(`${path}: hidden at the top, shown after one viewport, labelled and 44px`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(button(page)).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.5));
    await expect(button(page)).toBeHidden();
    await scrollDown(page);
    await expect(button(page)).toHaveAttribute("aria-label", label);
    expect(await button(page).evaluate((el) => el.tagName)).toBe("BUTTON");
    const box = await button(page).boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(button(page)).toBeHidden();
  });
}

test("the keyboard reaches it, Enter scrolls to the top and focuses the main content", async ({
  page,
}) => {
  await page.goto("/servicios/");
  await scrollDown(page);
  await button(page).focus();
  expect(await button(page).evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  expect(await page.evaluate(() => document.activeElement?.id)).toBe("main-content");
  await expect(button(page)).toBeHidden();
});

test("scrolls smoothly, and instantly with reduced motion", async ({ page }) => {
  await recordScrolls(page);
  await page.goto("/en/services/");
  await scrollDown(page);
  await button(page).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  const scrolls = () => page.evaluate(() => (window as unknown as { scrolls: string[] }).scrolls);
  expect((await scrolls()).at(-1)).toBe("smooth");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await scrollDown(page);
  await button(page).click();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  expect((await scrolls()).at(-1)).toBe("auto");
});

for (const width of [390, 768, 1440]) {
  test(`never overlaps the WhatsApp button at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/servicios/");
    await scrollDown(page);
    const top = await button(page).boundingBox();
    const whatsapp = await page.locator("[data-floating-actions] [data-whatsapp]").boundingBox();
    expect(top && whatsapp).toBeTruthy();
    const overlap =
      top!.x < whatsapp!.x + whatsapp!.width &&
      whatsapp!.x < top!.x + top!.width &&
      top!.y < whatsapp!.y + whatsapp!.height &&
      whatsapp!.y < top!.y + top!.height;
    expect(overlap).toBe(false);
    expect(top!.y + top!.height).toBeLessThanOrEqual(whatsapp!.y);
    // At the end of the page the centered legal lines stay clear of the stack.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const stack = (await page.locator("[data-floating-actions]").boundingBox())!;
    for (const line of await page.locator("[data-footer-legal] > span").all()) {
      const box = (await line.boundingBox())!;
      const hit =
        box.x < stack.x + stack.width &&
        stack.x < box.x + box.width &&
        box.y < stack.y + stack.height &&
        stack.y < box.y + box.height;
      expect(hit).toBe(false);
    }
  });
}
