import { test, expect, type Page } from "@playwright/test";
import { projects } from "../src/data/projects";
import {
  QUOTE_SERVICE_IDS,
  quoteHrefForProject,
  quoteServiceLabel,
  quoteServicesForProject,
} from "../src/data/quoteOptions";

const fillRequired = async (
  page: Page,
  options: { service?: string; country?: string; budget?: string } = {}
) => {
  await page.locator('input[name="name"]').fill("Ada Lovelace");
  await page.locator('input[name="email"]').fill("ada@example.com");
  await page.locator('input[name="phone"]').fill("+57 300 000 0000");
  await page.locator('input[name="business"]').fill("Analytical Engines");
  if (options.service) {
    await page.locator(`input[name="services"][value="${options.service}"]`).check();
  }
  await page.locator('select[name="country"]').selectOption(options.country ?? "CO");
  await page.locator('select[name="budgetRange"]').selectOption(options.budget ?? "entry");
  await page.locator('textarea[name="description"]').fill("Necesito una landing page.");
  await page.locator('input[name="privacy"]').check();
};

test.describe("quote form", () => {
  test("service links carry the catalog id to the localized quote page", async ({ page }) => {
    await page.goto("/servicios");
    await page.getByRole("link", { name: "Cotizar este servicio" }).first().click();
    await expect(page).toHaveURL(/\/cotizar\?service=landing-page$/);
    await expect(page.locator('input[name="services"][value="landing-page"]')).toBeChecked();

    await page.goto("/en/services");
    await page.getByRole("link", { name: "Request a quote" }).first().click();
    await expect(page).toHaveURL(/\/en\/quote\?service=landing-page$/);
    await expect(page.locator('input[name="services"][value="landing-page"]')).toBeChecked();
  });

  for (const [path, lang] of [
    ["/cotizar", "es"],
    ["/en/quote", "en"],
    ["/cop/cotizar", "es"],
    ["/cop/en/quote", "en"],
  ] as const) {
    test(`${path} lists the eleven catalog services plus the backend block`, async ({ page }) => {
      await page.goto(path);
      const inputs = page.locator('input[name="services"]');
      await expect(inputs).toHaveCount(12);
      for (const id of QUOTE_SERVICE_IDS) {
        const option = page.locator(".quote-check", {
          has: page.locator(`input[value="${id}"]`),
        });
        await expect(option).toHaveText(quoteServiceLabel(id, lang));
      }
      await expect(page.locator('input[name="services"]:checked')).toHaveCount(0);
      await expect(page.locator('input[name="projectTypes"]')).toHaveCount(0);
    });
  }

  test("required and optional fields are present in Spanish", async ({ page }) => {
    await page.goto("/cotizar");
    for (const name of ["name", "email", "phone", "business"]) {
      await expect(page.locator(`input[name="${name}"]`)).toHaveAttribute("required", "");
      await expect(page.locator(`input[name="${name}"]`)).toHaveAttribute("placeholder", /.+/);
    }
    await expect(page.locator('select[name="country"]')).toHaveAttribute("required", "");
    await expect(page.locator('select[name="budgetRange"]')).toHaveAttribute("required", "");
    await expect(page.locator('textarea[name="description"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="privacy"]')).toHaveAttribute("required", "");
    for (const name of ["howFound", "preferredChannel", "timeline"]) {
      await expect(page.locator(`select[name="${name}"]`)).not.toHaveAttribute("required", "");
    }
    await expect(page.getByText("¿Cómo me conociste?")).toBeVisible();
    await expect(page.getByText("Canal preferido de contacto")).toBeVisible();
    await expect(page.getByText("¿Para cuándo lo necesitas?")).toBeVisible();
    await expect(page.locator('select[name="howFound"] option')).toHaveText([
      "Selecciona una opción",
      "TikTok",
      "Instagram",
      "LinkedIn",
      "Google",
      "Recomendación",
      "Otro",
    ]);
    await expect(page.locator('select[name="preferredChannel"] option')).toHaveText([
      "Selecciona una opción",
      "WhatsApp",
      "Correo",
    ]);
    await expect(page.locator('select[name="timeline"] option')).toHaveText([
      "Selecciona una opción",
      "Este mes",
      "En 1 a 3 meses",
      "Sin fecha definida",
    ]);
    await expect(page.locator('select[name="country"] option[value="CO"]')).toHaveText("Colombia");
  });

  test("required and optional fields are present in English", async ({ page }) => {
    await page.goto("/en/quote");
    await expect(page.getByText("How did you find me?")).toBeVisible();
    await expect(page.getByText("Preferred contact channel")).toBeVisible();
    await expect(page.getByText("When do you need it?")).toBeVisible();
    await expect(page.locator('select[name="howFound"] option')).toHaveText([
      "Choose an option",
      "TikTok",
      "Instagram",
      "LinkedIn",
      "Google",
      "Referral",
      "Other",
    ]);
    await expect(page.locator('select[name="timeline"] option')).toHaveText([
      "Choose an option",
      "This month",
      "In 1 to 3 months",
      "No date yet",
    ]);
    await expect(page.locator('select[name="country"] option[value="US"]')).toHaveText(
      "United States"
    );
  });

  test("USD pages show USD ranges and leave the country open", async ({ page }) => {
    for (const path of ["/cotizar", "/en/quote"]) {
      await page.goto(path);
      const ranges = page.locator('select[name="budgetRange"] option:not([value=""])');
      await expect(ranges).toHaveCount(7);
      const labels = await ranges.allTextContents();
      expect(labels.filter((label) => label.includes("USD"))).toHaveLength(5);
      expect(labels.some((label) => label.includes("COP"))).toBe(false);
      await expect(page.locator('select[name="country"]')).toHaveValue("");
    }
    await page.goto("/cotizar");
    await expect(page.locator('select[name="budgetRange"] option:not([value=""])')).toHaveText([
      "USD 550 a USD 1.000",
      "USD 1.000 a USD 2.000",
      "USD 2.000 a USD 5.500",
      "USD 5.500 a USD 12.000",
      "Más de USD 12.000",
      "Solo plan mensual",
      "Aún no lo tengo definido",
    ]);
  });

  test("COP variants show COP ranges and preselect Colombia", async ({ page }) => {
    for (const path of ["/cop/cotizar", "/cop/en/quote"]) {
      await page.goto(path);
      const ranges = page.locator('select[name="budgetRange"] option:not([value=""])');
      const labels = await ranges.allTextContents();
      expect(labels.filter((label) => label.includes("COP"))).toHaveLength(5);
      expect(labels.some((label) => label.includes("USD"))).toBe(false);
      await expect(page.locator('select[name="country"]')).toHaveValue("CO");
      await expect(page.locator("[data-quote-form]")).toHaveAttribute("data-currency", "COP");
    }
    await page.goto("/cop/en/quote");
    await expect(page.locator('select[name="budgetRange"] option:not([value=""])')).toHaveText([
      "COP 1,600,000 to COP 3,000,000",
      "COP 3,000,000 to COP 6,000,000",
      "COP 6,000,000 to COP 16,000,000",
      "COP 16,000,000 to COP 40,000,000",
      "More than COP 40,000,000",
      "Monthly plan only",
      "Not defined yet",
    ]);
  });

  test("submits the full brief and confirms without leaving the page", async ({ page }) => {
    let payload: Record<string, unknown> = {};
    await page.route("**/api/quote", async (route) => {
      expect(route.request().method()).toBe("POST");
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 201, contentType: "application/json", body: '{"ok":"true"}' });
    });

    await page.goto("/en/quote?service=ai-integration");
    await fillRequired(page, { country: "US", budget: "small" });
    await page.locator('select[name="timeline"]').selectOption("this-month");
    await page.getByRole("button", { name: "Send quote request" }).click();

    await expect(page.getByRole("heading", { name: "Thank you for reaching out" })).toBeVisible();
    await expect(page.locator("[data-quote-form]")).toBeHidden();
    expect(payload).toMatchObject({
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+57 300 000 0000",
      business: "Analytical Engines",
      services: ["ai-integration"],
      country: "US",
      budgetRange: "small",
      currency: "USD",
      locale: "en",
      consent: true,
      source: "/en/quote?service=ai-integration",
      timeline: "this-month",
      website: "",
    });
    expect(payload.howFound).toBeUndefined();
    expect(payload.preferredChannel).toBeUndefined();
    expect(payload.projectTypes).toBeUndefined();
  });

  test("has a title, placeholders and a description of what happens next", async ({ page }) => {
    await page.goto("/cotizar");
    await expect(page.getByRole("heading", { name: "Solicitud de cotización" })).toBeVisible();
    await expect(page.getByText("Te respondo en un máximo de 24 horas.")).toBeVisible();
    await expect(page.getByText("Tu solicitud se guarda para darle seguimiento")).toBeVisible();

    await page.goto("/en/quote");
    await expect(page.getByRole("heading", { name: "Quote request" })).toBeVisible();
    await expect(page.getByText("I reply within 24 hours.")).toBeVisible();
    await expect(page.getByText("Your request is stored for follow-up")).toBeVisible();
  });

  test("submit stays disabled until every required field, a service and the consent are set", async ({
    page,
  }) => {
    await page.goto("/cotizar?service=ai-chatbot");
    const submit = page.locator(".quote-form button[type=submit]");
    await expect(submit).toBeDisabled();

    await page.locator('input[name="name"]').fill("Ada Lovelace");
    await page.locator('input[name="email"]').fill("ada@example.com");
    await page.locator('input[name="phone"]').fill("3000000000");
    await page.locator('input[name="business"]').fill("Analytical Engines");
    await page.locator('textarea[name="description"]').fill("Necesito un chatbot.");
    await page.locator('input[name="privacy"]').check();
    await expect(submit).toBeDisabled();

    await page.locator('input[name="phone"]').fill("+57 300 000 0000");
    await expect(submit).toBeDisabled();

    await page.locator('select[name="country"]').selectOption("MX");
    await expect(submit).toBeDisabled();

    await page.locator('select[name="budgetRange"]').selectOption("undecided");
    await expect(submit).toBeEnabled();

    await page.locator('input[name="privacy"]').uncheck();
    await expect(submit).toBeDisabled();
    await page.locator('input[name="privacy"]').check();
    await expect(submit).toBeEnabled();

    await page.locator('input[name="services"][value="ai-chatbot"]').uncheck();
    await expect(submit).toBeDisabled();
  });

  test("the description accepts up to 500 words", async ({ page }) => {
    await page.goto("/cotizar");
    await fillRequired(page, { service: "landing-page" });
    const submit = page.locator(".quote-form button[type=submit]");
    await expect(submit).toBeEnabled();
    await page.locator('textarea[name="description"]').fill("palabra ".repeat(501).trim());
    await expect(page.locator("[data-quote-words]")).toHaveText("501/500");
    await expect(submit).toBeDisabled();
  });

  test("preselects current and legacy service ids from the URL", async ({ page }) => {
    await page.goto("/cotizar?service=monthly-support");
    await expect(page.locator('input[name="services"]:checked')).toHaveCount(1);
    await expect(page.locator('input[name="services"][value="monthly-support"]')).toBeChecked();

    for (const [legacy, current] of [
      ["custom-web-applications", "custom-web-app-mvp"],
      ["ai-integrations", "ai-integration"],
      ["security-appsec", "basic-security-review"],
      ["rest-apis-backend", "rest-apis-backend"],
    ]) {
      await page.goto(`/en/quote?service=${legacy}`);
      await expect(page.locator('input[name="services"]:checked')).toHaveCount(1);
      await expect(page.locator(`input[name="services"][value="${current}"]`)).toBeChecked();
    }

    await page.goto("/cotizar?service=unknown");
    await expect(page.locator('input[name="services"]:checked')).toHaveCount(0);
  });

  test("the old project-type links open the form with nothing selected", async ({ page }) => {
    for (const path of ["/cotizar?mode=types", "/en/quote?type=landing", "/cotizar?type=ai"]) {
      await page.goto(path);
      await expect(page.locator('input[name="services"]')).toHaveCount(12);
      await expect(page.locator('input[name="services"]:checked')).toHaveCount(0);
      await expect(page.locator(".quote-form button[type=submit]")).toBeDisabled();
    }
  });

  test("case-study buttons link to the quote form with the related services", async ({ page }) => {
    const expectedByProject = {
      terracore: ["landing-page", "custom-web-app-mvp"],
      okroot: ["landing-page", "custom-web-app-mvp", "ai-integration"],
      nullbreach: ["ai-integration", "rest-apis-backend"],
      "lumina-w": [],
      "wavival-dev": [],
      "forgotten-portal": [],
    };
    for (const project of projects) {
      expect(quoteServicesForProject(project.slug)).toEqual(
        expectedByProject[project.slug as keyof typeof expectedByProject]
      );
      await page.goto(`/proyectos/${project.slug}`);
      await expect(page.getByRole("link", { name: "Cotizar un proyecto así" })).toHaveAttribute(
        "href",
        quoteHrefForProject("/cotizar", project.slug)
      );
      await page.goto(`/en/projects/${project.slug}`);
      await expect(page.getByRole("link", { name: "Quote a project like this" })).toHaveAttribute(
        "href",
        quoteHrefForProject("/en/quote", project.slug)
      );
    }
  });

  test("the TerraCore button preselects its services and Lúmina W preselects none", async ({
    page,
  }) => {
    await page.goto("/proyectos/terracore");
    await page.getByRole("link", { name: "Cotizar un proyecto así" }).click();
    await expect(page).toHaveURL(/\/cotizar\?service=landing-page&service=custom-web-app-mvp$/);
    await expect(page.locator('input[name="services"]:checked')).toHaveCount(2);
    await expect(page.locator('input[name="services"][value="landing-page"]')).toBeChecked();
    await expect(page.locator('input[name="services"][value="custom-web-app-mvp"]')).toBeChecked();

    await page.goto("/en/projects/lumina-w");
    await page.getByRole("link", { name: "Quote a project like this" }).click();
    await expect(page).toHaveURL(/\/en\/quote$/);
    await expect(page.locator('input[name="services"]:checked')).toHaveCount(0);
  });

  test("marks required fields with a red asterisk and a tooltip", async ({ page }) => {
    await page.goto("/cotizar");
    await expect(page.locator(".quote-required-note")).toHaveText(/Campos obligatorios/);
    const marks = page.locator(".quote-form abbr.quote-required");
    await expect(marks.first()).toHaveAttribute("title", "Obligatorio");
    expect(await marks.count()).toBeGreaterThanOrEqual(9);

    await page.goto("/en/quote");
    await expect(page.locator(".quote-required-note")).toHaveText(/Required fields/);
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
