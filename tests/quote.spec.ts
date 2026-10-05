import { test, expect } from "@playwright/test";
import { projects } from "../src/data/projects";

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
    await page.locator('input[name="privacy"]').check();
    await page.getByRole("button", { name: "Send quote request" }).click();

    await expect(page.getByRole("heading", { name: "Thank you for reaching out" })).toBeVisible();
    await expect(page.locator("[data-quote-form]")).toBeHidden();
  });

  test("has a title, placeholders and a description of what happens next", async ({ page }) => {
    await page.goto("/cotizar");
    await expect(page.getByRole("heading", { name: "Solicitud de cotización" })).toBeVisible();
    await expect(page.getByText("Te respondo en un máximo de 24 horas.")).toBeVisible();
    for (const name of ["name", "email", "phone", "business"]) {
      await expect(page.locator(`input[name="${name}"]`)).toHaveAttribute("placeholder", /.+/);
    }
    await expect(page.locator('textarea[name="description"]')).toHaveAttribute("placeholder", /.+/);

    await page.goto("/en/quote");
    await expect(page.getByRole("heading", { name: "Quote request" })).toBeVisible();
    await expect(page.getByText("I reply within 24 hours.")).toBeVisible();
  });

  test("submit stays disabled until every field, an option and the consent are set", async ({
    page,
  }) => {
    await page.goto("/cotizar?service=ai-integrations");
    const submit = page.locator(".quote-form button[type=submit]");
    await expect(submit).toBeDisabled();

    await page.locator('input[name="name"]').fill("Ada Lovelace");
    await page.locator('input[name="email"]').fill("ada@example.com");
    await page.locator('input[name="phone"]').fill("3000000000");
    await page.locator('input[name="business"]').fill("Analytical Engines");
    await page.locator('textarea[name="description"]').fill("Necesito una app con IA.");
    await page.locator('input[name="privacy"]').check();
    await expect(submit).toBeDisabled();

    await page.locator('input[name="phone"]').fill("+57 300 000 0000");
    await expect(submit).toBeEnabled();

    await page.locator('input[name="privacy"]').uncheck();
    await expect(submit).toBeDisabled();
    await page.locator('input[name="privacy"]').check();
    await expect(submit).toBeEnabled();

    await page.locator('input[name="services"][value="ai-integrations"]').uncheck();
    await expect(submit).toBeDisabled();
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

  test("case studies open the quote form on the project types with none selected", async ({
    page,
  }) => {
    await page.goto("/proyectos/terracore");
    await page.getByRole("link", { name: "Cotizar un proyecto así" }).click();
    await expect(page).toHaveURL(/\/cotizar\?mode=types$/);
    await expect(page.locator('[data-quote-group="types"]')).toBeVisible();
    await expect(page.locator('[data-quote-group="services"]')).toBeHidden();
    await expect(page.locator('input[name="projectTypes"]')).toHaveCount(6);
    await expect(page.locator('input[name="projectTypes"]:checked')).toHaveCount(0);
    await expect(page.locator(".quote-form button[type=submit]")).toBeDisabled();

    await page.goto("/en/projects/lumina-w");
    await page.getByRole("link", { name: "Quote a project like this" }).click();
    await expect(page).toHaveURL(/\/en\/quote\?mode=types$/);
    await expect(page.locator('input[name="projectTypes"]:checked')).toHaveCount(0);
  });

  test("every case study sends the visitor to the quote form without a preselected type", async ({
    page,
  }) => {
    for (const project of projects) {
      await page.goto(`/proyectos/${project.slug}`);
      await expect(page.getByRole("link", { name: "Cotizar un proyecto así" })).toHaveAttribute(
        "href",
        "/cotizar?mode=types"
      );
    }
  });

  test("a type in the URL still preselects it", async ({ page }) => {
    await page.goto("/cotizar?type=landing");
    await expect(page.locator('input[name="projectTypes"][value="landing"]')).toBeChecked();
  });

  test("choosing a type in the form enables the submit once the rest is filled", async ({
    page,
  }) => {
    await page.goto("/cotizar?mode=types");
    await page.locator('input[name="name"]').fill("Ada Lovelace");
    await page.locator('input[name="email"]').fill("ada@example.com");
    await page.locator('input[name="phone"]').fill("+57 300 000 0000");
    await page.locator('input[name="business"]').fill("Analytical Engines");
    await page.locator('textarea[name="description"]').fill("Necesito una app.");
    await page.locator('input[name="privacy"]').check();
    const submit = page.locator(".quote-form button[type=submit]");
    await expect(submit).toBeDisabled();
    await page.locator('input[name="projectTypes"][value="web-app"]').check();
    await expect(submit).toBeEnabled();
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
    await page.locator('input[name="privacy"]').check();
    await page.getByRole("button", { name: "Enviar cotización" }).click();

    await expect(page.getByRole("heading", { name: "Gracias por contactar" })).toBeVisible();
  });

  test("marks required fields with a red asterisk and a tooltip", async ({ page }) => {
    await page.goto("/cotizar");
    await expect(page.getByText("Campos obligatorios")).toBeVisible();
    const marks = page.locator(".quote-form abbr.quote-required");
    await expect(marks.first()).toHaveAttribute("title", "Obligatorio");
    expect(await marks.count()).toBeGreaterThanOrEqual(7);

    await page.goto("/en/quote");
    await expect(page.getByText("Required fields")).toBeVisible();
    await expect(page.locator(".quote-form abbr.quote-required").first()).toHaveAttribute(
      "title",
      "Required"
    );
  });

  test("the submit button keeps its natural width and is centered", async ({ page }) => {
    await page.goto("/cotizar");
    const form = await page.locator("[data-quote-form]").boundingBox();
    const button = await page.locator(".quote-form button[type=submit]").boundingBox();
    expect(button!.width).toBeLessThan(form!.width * 0.7);
    const buttonCenter = button!.x + button!.width / 2;
    const formCenter = form!.x + form!.width / 2;
    expect(Math.abs(buttonCenter - formCenter)).toBeLessThan(2);
  });
});
