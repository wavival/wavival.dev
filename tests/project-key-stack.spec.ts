import { test, expect } from "@playwright/test";
import { projects } from "../src/data/projects";

const RETIRED = /nginx|ghcr|vps|gunicorn|\b\d+\.\d+(\.\d+)?\b/i;

const pages = {
  es: { home: "/", index: "/proyectos" },
  en: { home: "/en/", index: "/en/projects" },
};

test.describe("project key stack", () => {
  test("every project declares 4 to 8 names taken from its parts", () => {
    for (const p of projects) {
      const all = new Set(p.parts.flatMap((part) => part.stack ?? []));
      expect(p.keyStack.length, p.slug).toBeGreaterThanOrEqual(4);
      expect(p.keyStack.length, p.slug).toBeLessThanOrEqual(8);
      expect(new Set(p.keyStack).size, p.slug).toBe(p.keyStack.length);
      for (const name of p.keyStack) expect(all.has(name), `${p.slug}: ${name}`).toBe(true);
      expect(p.keyStack.join(" · "), p.slug).not.toMatch(RETIRED);
    }
    const terracore = projects.find((p) => p.slug === "terracore")!;
    expect(terracore.keyStack).toEqual(expect.arrayContaining(["Django", "PostgreSQL", "React"]));
  });

  for (const [lang, paths] of Object.entries(pages)) {
    test(`${lang} index cards show the key stack of every project`, async ({ page }) => {
      await page.goto(paths.index);
      for (const p of projects) {
        const line = page.locator(
          `[data-project-card]:has(a[href$="/${p.slug}"]) [data-key-stack]`
        );
        await expect(line, p.slug).toHaveText(`Stack: ${p.keyStack.join(" · ")}`);
        await expect(line, p.slug).not.toContainText(RETIRED);
      }
    });

    test(`${lang} home rows show the key stack with backend and frontend names`, async ({
      page,
    }) => {
      await page.goto(paths.home);
      const rows = page.locator("[data-project-row]");
      await expect(rows).toHaveCount(3);
      const lines = rows.locator("[data-key-stack]");
      await expect(lines).toHaveCount(3);
      for (let i = 0; i < 3; i += 1) {
        const text = (await lines.nth(i).textContent()) ?? "";
        const slug = projects.find((p) => p.keyStack.join(" · ") === text.trim())?.slug;
        expect(slug, text).toBeTruthy();
        expect(text).not.toMatch(RETIRED);
        const line = lines.nth(i);
        const box = (await line.boundingBox())!;
        const viewport = page.viewportSize()!;
        expect(box.x + box.width, slug).toBeLessThanOrEqual(viewport.width + 1);
      }
      const terracore = rows.filter({ has: page.locator('a[href$="/terracore"]') }).first();
      await expect(terracore.locator("[data-key-stack]")).toContainText("Django");
      await expect(terracore.locator("[data-key-stack]")).toContainText("React");
    });
  }
});
