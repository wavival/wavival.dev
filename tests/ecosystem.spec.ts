import { test, expect } from "@playwright/test";
import { isRichPart, projects } from "../src/data/projects";

const multi = projects.filter((p) => p.parts.length > 1);

test.describe("projects index", () => {
  test("shows one card per project, not one per part", async ({ page }) => {
    await page.goto("/proyectos");
    await expect(page.locator("[data-project-card]")).toHaveCount(projects.length);
    for (const project of projects) {
      await expect(
        page.locator("[data-project-card] h2", { hasText: project.name }),
        project.name
      ).toHaveCount(1);
    }
    await expect(page.getByText(/TerraCore (PWA|Landing)|OKroot (PWA|Landing)/)).toHaveCount(0);
  });

  test("an ecosystem card links to each part and keeps tracking events", async ({ page }) => {
    await page.goto("/proyectos");
    const card = page.locator("[data-project-card]", { hasText: "TerraCore | Campo Inteligente" });
    await expect(card.getByRole("link", { name: /Leer el caso de estudio/ })).toHaveAttribute(
      "href",
      "/proyectos/terracore"
    );
    const app = card.getByRole("link", { name: /^Ver app/ });
    await expect(app).toHaveAttribute("href", "https://app.terracoreapp.co");
    await expect(app).toHaveAttribute("data-umami-event", "ver-app-terracore");
    await expect(card.getByRole("link", { name: /^Ver landing/ })).toHaveAttribute(
      "href",
      "https://terracoreapp.co"
    );
    await expect(card.getByRole("link", { name: /^Ver documentación/ })).toHaveAttribute(
      "href",
      "https://docs.terracoreapp.co"
    );
    await expect(card.locator("a[target=_blank]")).toHaveCount(3);
    for (const link of await card.locator("a[target=_blank]").all()) {
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  test("NullBreach lists app, landing, repository and API", async ({ page }) => {
    await page.goto("/en/projects");
    const card = page.locator("[data-project-card]", { hasText: "NullBreach" });
    for (const [name, href] of [
      [/^View app/, "https://www.wavival.dev/nullbreach/login"],
      [/^View landing/, "https://www.wavival.dev/nullbreach"],
      [/^View repository/, "https://github.com/wavival/nullbreach"],
      [/^View Swagger/, "https://www.wavival.dev/nullbreach/swagger"],
    ] as const) {
      await expect(card.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  test("the stack preview stays short", async ({ page }) => {
    await page.goto("/proyectos");
    for (const card of await page.locator("[data-project-card]").all()) {
      expect(await card.locator("li").count()).toBeLessThanOrEqual(8);
    }
  });
});

test.describe("ecosystem pages", () => {
  for (const project of multi) {
    test(`${project.slug}: one panel per part, the first rich part open`, async ({ page }) => {
      await page.goto(`/proyectos/${project.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.name);
      let firstRich = true;
      for (const part of project.parts) {
        const panel = page.locator(`#${part.kind}`);
        await expect(panel).toHaveCount(1);
        if (isRichPart(part)) {
          await expect(panel).toHaveAttribute("data-part", "");
          if (firstRich) await expect(panel).toHaveAttribute("open", "");
          else await expect(panel).not.toHaveAttribute("open", "");
          firstRich = false;
        } else {
          await expect(panel).not.toHaveAttribute("data-part", "");
        }
        await expect(panel.getByRole("heading", { level: 2 })).toHaveCount(1);
      }
    });
  }

  test("a URL hash opens its part", async ({ page }) => {
    await page.goto("/proyectos/terracore#landing");
    await expect(page.locator("#landing")).toHaveAttribute("open", "");
    await expect(page.locator("#cs-landing-architecture")).toBeVisible();
  });

  test("the same hash works in English and for Lúmina W's blog", async ({ page }) => {
    await page.goto("/en/projects/lumina-w#blog");
    await expect(page.locator("#blog")).toHaveAttribute("open", "");
  });

  test("changing the hash opens another part without a reload", async ({ page }) => {
    await page.goto("/proyectos/okroot");
    await expect(page.locator("#landing")).not.toHaveAttribute("open", "");
    await page.evaluate(() => {
      location.hash = "#landing";
    });
    await expect(page.locator("#landing")).toHaveAttribute("open", "");
  });

  test("the contents list opens the part it links to", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/proyectos/terracore");
    await page.locator("aside").getByRole("link", { name: "Landing" }).click();
    await expect(page.locator("#landing")).toHaveAttribute("open", "");
  });

  test("a part toggles from the keyboard", async ({ page }) => {
    await page.goto("/proyectos/terracore");
    const summary = page.locator("#landing > summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#landing")).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(page.locator("#landing")).not.toHaveAttribute("open", "");
  });

  test("link-only parts show a row with their link", async ({ page }) => {
    await page.goto("/proyectos/terracore");
    const docs = page.locator("#docs");
    await expect(docs.getByRole("heading", { level: 2, name: "Documentación" })).toBeVisible();
    await expect(docs.getByRole("link", { name: /^Ver documentación/ })).toHaveAttribute(
      "href",
      "https://docs.terracoreapp.co"
    );

    await page.goto("/en/projects/nullbreach");
    await expect(
      page.locator("#repo").getByRole("link", { name: /^View repository/ })
    ).toBeVisible();
    await expect(page.locator("#api").getByRole("link", { name: /^View Swagger/ })).toBeVisible();
  });

  test("every in-page anchor has a target", async ({ page }) => {
    for (const project of projects) {
      for (const path of [`/proyectos/${project.slug}`, `/en/projects/${project.slug}`]) {
        await page.goto(path);
        const hrefs = await page
          .locator('main a[href^="#"]')
          .evaluateAll((els) => els.map((el) => el.getAttribute("href")!));
        for (const href of hrefs) {
          await expect(page.locator(href), `${path} ${href}`).toHaveCount(1);
        }
      }
    }
  });

  test("single-part projects keep the classic case-study layout", async ({ page }) => {
    await page.goto("/proyectos/forgotten-portal");
    await expect(page.locator("details[data-part]")).toHaveCount(0);
    await expect(page.locator("#cs-problem")).toHaveCount(1);
    await page.goto("/proyectos/wavival-dev");
    await expect(page.locator("details[data-part]")).toHaveCount(0);
  });

  test("the quote button keeps the project type", async ({ page }) => {
    await page.goto("/proyectos/nullbreach");
    await expect(page.getByRole("link", { name: "Cotizar un proyecto así" })).toHaveAttribute(
      "href",
      "/cotizar?type=security"
    );
  });
});
