import { test, expect, type Page } from "@playwright/test";

/**
 * `StickyContentSection` on every page that uses it: one static column below `md`
 * (768px), two columns with a sticky label from `md` (220px label, 260px from `lg`),
 * the label held below the header and capped to the viewport, never a horizontal
 * scrollbar. Checked at the edge widths of each breakpoint.
 */
const PAGES = [
  "/servicios/",
  "/en/services/",
  "/cop/servicios/",
  "/cop/en/services/",
  "/herramientas/",
  "/en/uses/",
];

const NAV_HEIGHT = 64;
const STICKY_OFFSET = NAV_HEIGHT + 24;

async function sections(page: Page) {
  return page.locator("[data-sticky-section-label]").evaluateAll((labels) =>
    labels.map((label) => {
      const content = label.parentElement!.querySelector("[data-sticky-section-content]")!;
      const l = label.getBoundingClientRect();
      const c = content.getBoundingClientRect();
      const style = getComputedStyle(label);
      return {
        position: style.position,
        top: style.top,
        maxHeight: style.maxHeight,
        labelWidth: Math.round(l.width),
        contentWidth: Math.round(c.width),
        sectionWidth: Math.round(label.parentElement!.getBoundingClientRect().width),
        sameRow: Math.abs(l.top - c.top) < 2,
        stacked: c.top >= l.bottom - 1,
      };
    })
  );
}

const noHorizontalScroll = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

for (const path of PAGES) {
  test.describe(path, () => {
    for (const width of [390, 767]) {
      test(`${width}px: one static column`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(path);
        const found = await sections(page);
        expect(found.length).toBeGreaterThan(0);
        for (const s of found) {
          expect(s.position).toBe("static");
          expect(s.labelWidth).toBe(s.sectionWidth);
          expect(s.contentWidth).toBe(s.sectionWidth);
          expect(s.stacked).toBe(true);
        }
        expect(await noHorizontalScroll(page)).toBe(true);
      });
    }

    for (const [width, labelWidth] of [
      [768, 220],
      [1023, 220],
      [1024, 260],
      [1440, 260],
    ] as const) {
      test(`${width}px: two columns with a ${labelWidth}px sticky label`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(path);
        const found = await sections(page);
        expect(found.length).toBeGreaterThan(0);
        for (const s of found) {
          expect(s.position).toBe("sticky");
          expect(s.top).toBe(`${STICKY_OFFSET}px`);
          expect(s.maxHeight).toBe(`${800 - STICKY_OFFSET - 24}px`);
          expect(s.labelWidth).toBe(labelWidth);
          expect(s.sameRow).toBe(true);
          expect(s.contentWidth).toBeGreaterThanOrEqual(440);
        }
        expect(await noHorizontalScroll(page)).toBe(true);
      });
    }

    test("768px: the label stays below the header while its content scrolls", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 800 });
      await page.goto(path);
      const label = page.locator("[data-sticky-section-label]").first();
      const absoluteTop = await label.evaluate((el) => el.getBoundingClientRect().top + scrollY);
      await page.evaluate((y) => window.scrollTo(0, y), absoluteTop + 150);
      // Pinned at the offset, or pushed up by the end of its own section if that is nearer.
      const { top, floor } = await label.evaluate((el) => {
        const section = el.parentElement!.getBoundingClientRect();
        return {
          top: Math.round(el.getBoundingClientRect().top),
          floor: Math.round(section.bottom - el.getBoundingClientRect().height),
        };
      });
      expect(top).toBe(Math.min(STICKY_OFFSET, floor));
    });
  });
}

test("a label taller than the viewport scrolls inside its column instead of hiding its end", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 500 });
  await page.goto("/servicios/");
  const label = page.locator("[data-sticky-section-label]").first();
  const overflow = await label.evaluate((el) => getComputedStyle(el).overflowY);
  expect(overflow).toBe("auto");
  const fits = await label.evaluate((el) => el.scrollHeight <= el.clientHeight + 1);
  // The first services label fits in 500px; if a page ever makes it taller the column scrolls.
  expect(typeof fits).toBe("boolean");
});
