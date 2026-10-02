import { test, expect } from "@playwright/test";

test.describe("quote form", () => {
  test("service links preselect the localized service", async ({ page }) => {
    await page.goto("/servicios");
    await page.getByRole("link", { name: "Cotizar este servicio" }).first().click();
    await expect(page).toHaveURL(/\/cotizar\?service=custom-web-applications/);
    await expect(
      page.locator('input[name="services"][value="custom-web-applications"]')
    ).toBeChecked();
  });

  test("submits the full brief and confirms without leaving the page", async ({ page }) => {
    await page.route("**/api/quote", async (route) => {
      expect(route.request().method()).toBe("POST");
      const payload = route.request().postDataJSON();
      expect(payload.services).toEqual(["ai-integrations"]);
      await route.fulfill({ status: 201, contentType: "application/json", body: '{"ok":"true"}' });
    });

    await page.goto("/en/quote?service=ai-integrations");
    await page.locator('input[name="name"]').fill("Ada Lovelace");
    await page.locator('input[name="email"]').fill("ada@example.com");
    await page.locator('input[name="phone"]').fill("+57 300 000 0000");
    await page.locator('input[name="business"]').fill("Analytical Engines");
    await page.locator('textarea[name="description"]').fill("I need an AI-assisted application.");
    await page.getByRole("button", { name: "Send quote request" }).click();

    await expect(page.getByRole("heading", { name: "Thank you for reaching out" })).toBeVisible();
    await expect(page.locator("[data-quote-form]")).toBeHidden();
  });
});
