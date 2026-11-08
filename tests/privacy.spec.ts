import { test, expect } from "@playwright/test";

test.describe("privacy pages", () => {
  test("Spanish page explains the quote storage, the IP handling and the retention", async ({
    page,
  }) => {
    await page.goto("/privacidad/");
    const data = page.locator("section", { hasText: "Qué datos recojo" }).last();
    await expect(data).toContainText("Supabase");
    await expect(data).toContainText("us-east-1");
    await expect(data).toContainText("país");
    await expect(data).toContainText("moneda");
    await expect(data).toContainText("rango de presupuesto");
    await expect(data).toContainText("hora del consentimiento");
    await expect(data).toContainText("sin guardar la dirección");
    await expect(data).toContainText("10 minutos");
    await expect(data).toContainText("dirección IP");
    const retention = page.locator("section", { hasText: "Conservación" }).last();
    await expect(retention).toContainText("24 meses");
    await expect(retention).toContainText("wavival.dev@luminaw.co");
    await expect(page.getByText("Última actualización: 8 de noviembre de 2026")).toBeVisible();
  });

  test("English page explains the quote storage, the IP handling and the retention", async ({
    page,
  }) => {
    await page.goto("/en/privacy/");
    const data = page.locator("section", { hasText: "What data I collect" }).last();
    await expect(data).toContainText("Supabase");
    await expect(data).toContainText("us-east-1");
    await expect(data).toContainText("country");
    await expect(data).toContainText("currency");
    await expect(data).toContainText("budget range");
    await expect(data).toContainText("time of your consent");
    await expect(data).toContainText("without storing the address");
    await expect(data).toContainText("IP address");
    const retention = page.locator("section", { hasText: "Retention" }).last();
    await expect(retention).toContainText("24 months");
    await expect(retention).toContainText("wavival.dev@luminaw.co");
    await expect(page.getByText("Last updated: November 8, 2026")).toBeVisible();
  });
});
