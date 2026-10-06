import { test, expect } from "@playwright/test";

test.describe("privacy pages", () => {
  test("Spanish page explains the temporary IP count of the quote limit", async ({ page }) => {
    await page.goto("/privacidad/");
    const section = page.locator("section", { hasText: "Qué datos recojo" }).last();
    await expect(section).toContainText("10 minutos");
    await expect(section).toContainText("dirección IP");
    await expect(section).toContainText("no se guarda ni se comparte");
    await expect(page.getByText("Última actualización: 6 de octubre de 2026")).toBeVisible();
  });

  test("English page explains the temporary IP count of the quote limit", async ({ page }) => {
    await page.goto("/en/privacy/");
    const section = page.locator("section", { hasText: "What data I collect" }).last();
    await expect(section).toContainText("10");
    await expect(section).toContainText("IP address");
    await expect(section).toContainText("not stored or shared");
    await expect(page.getByText("Last updated: October 6, 2026")).toBeVisible();
  });
});
