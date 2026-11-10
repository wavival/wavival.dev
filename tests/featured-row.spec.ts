import { test, expect } from "@playwright/test";

const HOMES = [
  { path: "/", projects: "/proyectos/", badge: "Destacado" },
  { path: "/en/", projects: "/en/projects/", badge: "Featured" },
];

test.describe("featured project row on the home", () => {
  for (const home of HOMES) {
    test(`${home.path} highlights TerraCore in blue like the featured card of ${home.projects}`, async ({
      page,
    }) => {
      await page.goto(home.projects);
      const card = page.locator("[data-project-card][data-featured]");
      await expect(card).toHaveCount(1);
      const cardStyle = await card.evaluate((el) => {
        const s = getComputedStyle(el);
        return { background: s.backgroundColor, border: s.borderTopColor };
      });

      await page.goto(home.path);
      const rows = page.locator("[data-project-row]");
      const featured = page.locator("[data-project-row][data-featured]");
      await expect(featured).toHaveCount(1);
      expect(await rows.first().getAttribute("data-featured")).not.toBeNull();
      await expect(featured.locator("h3")).toContainText("TerraCore");
      const badge = featured.locator(".project-featured-label");
      await expect(badge).toHaveText(home.badge);
      await expect(badge).toBeVisible();
      const rowStyle = await featured.evaluate((el) => {
        const s = getComputedStyle(el);
        return { background: s.backgroundColor, border: s.borderTopColor };
      });
      expect(rowStyle).toEqual(cardStyle);
      await expect(rows.nth(1).locator(".project-featured-label")).toHaveCount(0);
      // The badge says it already, so the row carries no "Featured project" overline.
      await expect(featured.locator(".label-sm-link")).toHaveCount(0);
    });
  }
});
