import { test, expect, type Page } from "@playwright/test";

const CALENDLY = /calendly\.com/;

/** Records every request to Calendly and answers the widget script with a stub. */
const watchCalendly = async (page: Page) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (CALENDLY.test(request.url())) requests.push(request.url());
  });
  await page.route("https://assets.calendly.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/javascript", body: "window.__calendly = 1;" })
  );
  return requests;
};

const PAGES = [
  { path: "/contacto/", button: "Agendar una llamada", fallback: "Abrir Calendly en otra pestaña" },
  { path: "/en/contact/", button: "Book a call", fallback: "Open Calendly in a new tab" },
];

for (const { path, button, fallback } of PAGES) {
  test.describe(`Calendly on demand ${path}`, () => {
    test("nothing from Calendly loads before the click", async ({ page, context }) => {
      const requests = await watchCalendly(page);
      await page.goto(path, { waitUntil: "networkidle" });
      await page.locator("#calendly-embed").scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      expect(requests).toEqual([]);
      await expect(page.locator("#calendly-embed iframe, .calendly-inline-widget")).toHaveCount(0);
      expect((await context.cookies()).filter((c) => CALENDLY.test(c.domain))).toEqual([]);
      await expect(page.getByRole("button", { name: button })).toBeVisible();
      const link = page.locator("#calendly-embed a", { hasText: fallback });
      await expect(link).toHaveAttribute(
        "href",
        "https://calendly.com/wavival/descubrimiento-servicios-wavival"
      );
      await expect(link).toHaveAttribute("target", "_blank");
    });

    test("the keyboard loads the calendar in place without moving the page", async ({ page }) => {
      const requests = await watchCalendly(page);
      await page.goto(path);
      const region = page.locator("#calendly-embed");
      const load = page.getByRole("button", { name: button });
      await load.focus();
      const before = await region.boundingBox();
      const after = page.locator("#calendly-embed ~ *, footer").first();
      const nextTop = (await after.boundingBox())?.y;
      await page.keyboard.press("Enter");
      const widget = region.locator(".calendly-inline-widget");
      await expect(widget).toHaveCount(1);
      expect(await widget.getAttribute("data-url")).toMatch(
        /^https:\/\/calendly\.com\/wavival\/descubrimiento-servicios-wavival\?hide_gdpr_banner=1&primary_color=[0-9a-f]{6}&background_color=[0-9a-f]{6}&text_color=[0-9a-f]{6}$/
      );
      await expect.poll(() => requests.some((url) => url.includes("widget.js"))).toBe(true);
      await expect(load).toHaveCount(0);
      expect(await page.evaluate(() => document.activeElement?.id)).toBe("calendly-embed");
      const afterBox = await region.boundingBox();
      expect(Math.round(afterBox!.height)).toBe(Math.round(before!.height));
      expect((await after.boundingBox())?.y).toBe(nextTop);
    });
  });
}

for (const path of ["/cop/servicios/", "/cop/cotizar/", "/cop/en/services/", "/cop/en/quote/"]) {
  test(`${path} requests nothing from Calendly`, async ({ page }) => {
    const requests = await watchCalendly(page);
    await page.goto(path, { waitUntil: "networkidle" });
    expect(requests).toEqual([]);
  });
}
