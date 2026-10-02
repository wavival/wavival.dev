import { test, expect } from "@playwright/test";
import { caseStudies } from "../src/data/projects";
import { QUOTE_PROJECT_TYPES } from "../src/data/quoteTypes";

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

  test("services mode is the default and hides the project types", async ({ page }) => {
    await page.goto("/cotizar");
    await expect(page.locator('[data-quote-group="services"]')).toBeVisible();
    await expect(page.locator('[data-quote-group="types"]')).toBeHidden();
  });

  test("an unknown project type falls back to services", async ({ page }) => {
    await page.goto("/cotizar?type=unknown");
    await expect(page.locator('[data-quote-group="services"]')).toBeVisible();
    await expect(page.locator('[data-quote-group="types"]')).toBeHidden();
  });

  test("case studies link to the quote form with the project type", async ({ page }) => {
    await page.goto("/proyectos/terracore");
    await page.getByRole("link", { name: "Cotizar un proyecto así" }).click();
    await expect(page).toHaveURL(/\/cotizar\?type=web-app/);
    await expect(page.locator('[data-quote-group="types"]')).toBeVisible();
    await expect(page.locator('[data-quote-group="services"]')).toBeHidden();
    await expect(page.locator('input[name="projectTypes"][value="web-app"]')).toBeChecked();

    await page.goto("/en/projects/terracore-landing");
    await page.getByRole("link", { name: "Quote a project like this" }).click();
    await expect(page).toHaveURL(/\/en\/quote\?type=landing/);
    await expect(page.locator('input[name="projectTypes"][value="landing"]')).toBeChecked();
  });

  test("every case study points to a valid project type", async ({ page }) => {
    for (const project of caseStudies) {
      expect(QUOTE_PROJECT_TYPES).toContain(project.quoteType);
      await page.goto(`/proyectos/${project.slug}`);
      await expect(page.getByRole("link", { name: "Cotizar un proyecto así" })).toHaveAttribute(
        "href",
        `/cotizar?type=${project.quoteType}`
      );
    }
  });

  test("project type mode submits projectTypes and no services", async ({ page }) => {
    await page.route("**/api/quote", async (route) => {
      const payload = route.request().postDataJSON();
      expect(payload.projectTypes).toEqual(["landing"]);
      expect(payload.services).toBeUndefined();
      await route.fulfill({ status: 201, contentType: "application/json", body: '{"ok":"true"}' });
    });

    await page.goto("/cotizar?type=landing");
    await page.locator('input[name="name"]').fill("Ada Lovelace");
    await page.locator('input[name="email"]').fill("ada@example.com");
    await page.locator('input[name="phone"]').fill("+57 300 000 0000");
    await page.locator('input[name="business"]').fill("Analytical Engines");
    await page.locator('textarea[name="description"]').fill("Necesito una landing page.");
    await page.getByRole("button", { name: "Enviar cotización" }).click();

    await expect(page.getByRole("heading", { name: "Gracias por contactar" })).toBeVisible();
  });
});
