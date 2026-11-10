import { test, expect } from "@playwright/test";

const NUMBER = "573016560222";
const MESSAGE = {
  es: "Hola, vengo de wavival.dev y quiero solicitar un servicio.",
  en: "Hi, I'm coming from wavival.dev and I'd like to request a service.",
} as const;
const LABEL = {
  es: "Escribir a Valentina Ramírez por WhatsApp",
  en: "Message Valentina Ramírez on WhatsApp",
} as const;

const PROJECT_SLUGS = [
  "terracore",
  "okroot",
  "nullbreach",
  "lumina-w",
  "wavival-dev",
  "forgotten-portal",
];

const ES_ROUTES = [
  "/",
  "/proyectos",
  "/servicios",
  "/cotizar",
  "/sobre-mi",
  "/contacto",
  "/herramientas",
  "/privacidad",
  "/cop/servicios",
  "/cop/cotizar",
  ...PROJECT_SLUGS.map((s) => `/proyectos/${s}`),
];

const EN_ROUTES = [
  "/en",
  "/en/projects",
  "/en/services",
  "/en/quote",
  "/en/about",
  "/en/contact",
  "/en/uses",
  "/en/privacy",
  "/cop/en/services",
  "/cop/en/quote",
  ...PROJECT_SLUGS.map((s) => `/en/projects/${s}`),
];

const expectedHref = (lang: "es" | "en") =>
  `https://wa.me/${NUMBER}?text=${encodeURIComponent(MESSAGE[lang])}`;

test.describe("floating WhatsApp button", () => {
  for (const [lang, routes] of [
    ["es", ES_ROUTES],
    ["en", EN_ROUTES],
  ] as const) {
    for (const route of routes) {
      test(`${route} shows one WhatsApp button with the ${lang} message`, async ({ page }) => {
        await page.goto(route);
        const stack = page.locator("[data-floating-actions]");
        await expect(stack).toHaveCount(1);
        const link = stack.locator("a[data-whatsapp]");
        await expect(link).toHaveCount(1);
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", expectedHref(lang));
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
        await expect(link).toHaveAttribute("aria-label", LABEL[lang]);
        await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
      });
    }
  }

  test("is a fixed, keyboard reachable 44px+ target inside the viewport", async ({ page }) => {
    await page.goto("/");
    const link = page.locator("a[data-whatsapp]");
    await link.focus();
    await expect(link).toBeFocused();
    const box = (await link.boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const after = (await link.boundingBox())!;
    expect(after.y).toBeCloseTo(box.y, 0);
  });

  test("does not cover the last footer line when scrolled to the end", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const button = (await page.locator("a[data-whatsapp]").boundingBox())!;
    const footerLine = (await page.locator("footer").getByText("Hecho en Colombia").boundingBox())!;
    const overlaps =
      button.x < footerLine.x + footerLine.width &&
      button.x + button.width > footerLine.x &&
      button.y < footerLine.y + footerLine.height &&
      button.y + button.height > footerLine.y;
    expect(overlaps).toBe(false);
  });

  test("does not steal the quote form submit button on mobile", async ({ page }) => {
    await page.goto("/cotizar");
    const submit = page.locator("form button[type=submit]");
    await submit.scrollIntoViewIfNeeded();
    const button = (await page.locator("a[data-whatsapp]").boundingBox())!;
    const submitBox = (await submit.boundingBox())!;
    const overlaps =
      button.x < submitBox.x + submitBox.width &&
      button.x + button.width > submitBox.x &&
      button.y < submitBox.y + submitBox.height &&
      button.y + button.height > submitBox.y;
    expect(overlaps).toBe(false);
  });
});
