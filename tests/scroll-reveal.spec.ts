import { test, expect } from "@playwright/test";

const BLOCK = "main > section:first-child > :not(:first-child)";

const settled = async (page: import("@playwright/test").Page, selector: string) => {
  const el = page.locator(selector).last();
  await el.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(1000);
  return el;
};

test.describe("scroll reveal", () => {
  test("elements below the fold fade in on a view timeline without moving", async ({ page }) => {
    await page.goto("/sobre-mi");
    const block = page.locator(BLOCK).last();
    const before = await block.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        name: cs.animationName,
        timeline: cs.animationTimeline,
        opacity: Number(cs.opacity),
        translate: cs.translate,
      };
    });
    expect(before.name).toBe("reveal-fade");
    expect(before.timeline).toContain("view");
    expect(before.opacity).toBeLessThan(1);
    expect(before.translate).toBe("none");
    const el = await settled(page, BLOCK);
    await expect(el).toHaveCSS("opacity", "1");
  });

  test("components, text and buttons fade in too", async ({ page }) => {
    await page.goto("/servicios");
    for (const selector of ["main [data-reveal]", "main p", "main .btn"]) {
      await expect(page.locator(selector).last()).toHaveCSS("animation-name", "reveal-fade");
    }
  });

  test("the page content fades in on load from 1% opacity and the hero has no scroll fade", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("main")).toHaveCSS("animation-name", "page-fade");
    await expect(page.locator("main")).toHaveCSS("animation-fill-mode", "backwards");
    const from = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        for (const rule of Array.from(sheet.cssRules)) {
          const found = (function find(r: CSSRule): string | undefined {
            if (r instanceof CSSKeyframesRule && r.name === "page-fade")
              return (r.cssRules[0] as CSSKeyframeRule).style.opacity;
            if ("cssRules" in r)
              for (const c of Array.from((r as CSSGroupingRule).cssRules)) {
                const v = find(c);
                if (v) return v;
              }
          })(rule);
          if (found) return found;
        }
      }
    });
    expect(Number(from)).toBeGreaterThan(0);
    await expect(page.locator("main > section:first-child > :first-child")).toHaveCSS(
      "animation-name",
      "none"
    );
  });

  test("reduced motion keeps every element static and opaque", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/sobre-mi");
    const styles = await page
      .locator("main *")
      .evaluateAll((els) =>
        els.map((el) => [getComputedStyle(el).animationName, getComputedStyle(el).opacity])
      );
    expect(styles.filter(([name]) => name === "reveal-fade")).toHaveLength(0);
    await context.close();
  });

  test("without view timelines the script fallback fades blocks in on scroll", async ({ page }) => {
    await page.addInitScript(() => {
      const supports = CSS.supports.bind(CSS);
      CSS.supports = ((...args: [string, string?]) =>
        String(args[0]).includes("animation-timeline")
          ? false
          : supports(...(args as [string]))) as typeof CSS.supports;
    });
    await page.goto("/sobre-mi");
    await expect(page.locator("html")).toHaveClass(/reveal-js/);
    const last = page.locator(BLOCK).last();
    await expect(last).not.toHaveAttribute("data-revealed", "");
    await expect(last).toHaveCSS("opacity", "0");
    const el = await settled(page, BLOCK);
    await expect(el).toHaveAttribute("data-revealed", "");
    await expect(el).toHaveCSS("opacity", "1");
    await expect(el).toHaveCSS("translate", "none");
  });
});
