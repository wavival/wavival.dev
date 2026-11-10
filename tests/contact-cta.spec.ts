import { test, expect } from "@playwright/test";

// One generic contact CTA per language, in the infinitive in Spanish like every
// other button of the site.
const PAGES = {
  es: { label: "Contactar", paths: ["/", "/servicios", "/sobre-mi", "/proyectos/terracore"] },
  en: {
    label: "Contact me",
    paths: ["/en", "/en/services", "/en/about", "/en/projects/terracore"],
  },
} as const;

const RETIRED =
  /Get in touch|Write to me|Escríbeme|Contáctame|Conóceme|Gracias por contactar\b|reaching out/;

for (const [lang, { label, paths }] of Object.entries(PAGES)) {
  for (const path of paths) {
    test(`${lang} ${path}: the menu contact button reads "${label}"`, async ({ page }) => {
      await page.goto(path);
      const header = page.locator("header");
      await expect(header.locator('a[href^="mailto:"]', { hasText: label }).first()).toBeAttached();
      await expect(page.locator("body")).not.toContainText(RETIRED);
    });
  }
}

test("the services contact band button reads the same CTA", async ({ page }) => {
  await page.goto("/servicios");
  await expect(page.locator("#contact").getByRole("link", { name: "Contactar" })).toBeVisible();
  await page.goto("/en/services");
  await expect(page.locator("#contact").getByRole("link", { name: "Contact me" })).toBeVisible();
});
