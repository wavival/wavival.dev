import { test, expect } from "@playwright/test";

for (const path of ["/sobre-mi", "/en/about"]) {
  test(`${path}: the three method steps share the same column width`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(path);
    const cells = page.locator(".bento.cell-grid > div");
    await expect(cells).toHaveCount(3);
    const widths = await cells.evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().width))
    );
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
  });
}
