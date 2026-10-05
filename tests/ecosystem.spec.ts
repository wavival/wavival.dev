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

  test("a card has only the case study link", async ({ page }) => {
    for (const path of ["/proyectos", "/en/projects"]) {
      await page.goto(path);
      for (const card of await page.locator("[data-project-card]").all()) {
        const links = card.locator("a[href]");
        // The image and the title link to the case study, and so does the action.
        for (const link of await links.all()) {
          await expect(link).toHaveAttribute("href", /^\/(proyectos|en\/projects)\/[a-z-]+$/);
        }
        await expect(card.locator("a[target=_blank]")).toHaveCount(0);
      }
    }
  });

  test("the home featured rows have only the case study link", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-project-row] a[target=_blank]")).toHaveCount(0);
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

  test("a hash that points inside a closed part opens it", async ({ page }) => {
    await page.goto("/proyectos/terracore#cs-landing-architecture");
    await expect(page.locator("#landing")).toHaveAttribute("open", "");
    await expect(page.locator("#cs-landing-architecture")).toBeInViewport();
  });

  test("a malformed hash does not throw", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/proyectos/okroot#%E0%A4%A");
    await page.evaluate(() => {
      location.hash = "#%E0%A4%B";
    });
    await expect(page.locator("#app")).toHaveAttribute("open", "");
    expect(errors).toEqual([]);
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

  test("the page header lists every link in one column with the quote as main call to action", async ({
    page,
  }) => {
    await page.goto("/proyectos/terracore");
    const header = page.locator("main header").first();
    const links = header.locator("a[target=_blank]");
    await expect(links).toHaveCount(3);
    const boxes = await links.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), h: Math.round(r.height) };
      })
    );
    for (let i = 1; i < boxes.length; i++) {
      expect(boxes[i].y, "one link per row").toBeGreaterThanOrEqual(
        boxes[i - 1].y + boxes[i - 1].h
      );
    }
    expect(boxes[0].y).toBeLessThan(boxes[1].y);
    expect(boxes[1].y).toBeLessThan(boxes[2].y);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    await expect(links.nth(0)).toHaveAttribute("href", "https://app.terracoreapp.co");
    await expect(links.nth(0)).toHaveAttribute("data-umami-event", "ver-app-terracore");
    await expect(links.nth(1)).toHaveAttribute("href", "https://terracoreapp.co");
    await expect(links.nth(2)).toHaveAttribute("href", "https://docs.terracoreapp.co");
    const quote = header.getByRole("link", { name: "Cotizar un proyecto así" });
    const quoteBox = await quote.boundingBox();
    expect(quoteBox!.y).toBeGreaterThan(boxes[2].y);
  });

  test("the header links use the text link style, not buttons", async ({ page }) => {
    await page.goto("/proyectos/nullbreach");
    const header = page.locator("main header").first();
    const textLink = header.locator("a[target=_blank]").first();
    const cardLinkClass = await textLink.getAttribute("class");
    await page.goto("/proyectos");
    const cardLink = page.locator("[data-project-card] a", { hasText: "Caso de estudio" }).first();
    expect(await cardLink.getAttribute("class")).toBe(cardLinkClass);
  });

  test("NullBreach lists app, landing, repository and API in its header", async ({ page }) => {
    await page.goto("/en/projects/nullbreach");
    const header = page.locator("main header").first();
    for (const [name, href] of [
      [/^View app/, "https://www.wavival.dev/nullbreach/login"],
      [/^View landing/, "https://www.wavival.dev/nullbreach"],
      [/^View repository/, "https://github.com/wavival/nullbreach"],
      [/^View Swagger/, "https://www.wavival.dev/nullbreach/swagger"],
    ] as const) {
      await expect(header.getByRole("link", { name })).toHaveAttribute("href", href);
    }
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
});
