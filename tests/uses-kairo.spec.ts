import { test, expect } from "@playwright/test";

const PAGES = [
  { path: "/herramientas", group: "Productividad y navegación", kairo: "Kairo" },
  { path: "/en/uses", group: "Productivity and browsing", kairo: "Kairo" },
];

for (const { path, group, kairo } of PAGES) {
  test(`${path}: the productivity group lists Kairo instead of Todoist and Focus To-Do`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.getByText(group, { exact: true })).toBeVisible();
    await expect(page.getByText(kairo, { exact: true })).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/Todoist|Focus To-Do/);
  });
}
