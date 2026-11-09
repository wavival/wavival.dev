import { test, expect } from "@playwright/test";

// The wide project card shows its 1200x630 cover whole: the frame keeps that ratio, so
// `object-fit: cover` never crops it, in both languages and at every desktop width.
for (const path of ["/proyectos/", "/en/projects/"]) {
  for (const width of [1280, 1440, 1920]) {
    test(`${path} at ${width}px keeps the wide cover at 1200x630 without cropping`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const cards = page.locator(".project-wide");
      expect(await cards.count()).toBeGreaterThan(0);
      for (const card of await cards.all()) {
        const frame = await card.locator(".media-frame").boundingBox();
        expect(frame).not.toBeNull();
        expect(Math.abs(frame!.height - (frame!.width * 630) / 1200)).toBeLessThan(1.5);
        const box = await card.boundingBox();
        // The cover fills the card height: the text column fits beside it.
        expect(box!.height - frame!.height).toBeLessThanOrEqual(2);
      }
    });
  }
}
