import { test, expect } from "@playwright/test";

const ES_ROUTES = [
  "/",
  "/proyectos",
  "/servicios",
  "/cotizar",
  "/sobre-mi",
  "/contacto",
  "/herramientas",
  "/privacidad",
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
];

const PROJECT_SLUGS = [
  "terracore",
  "okroot",
  "nullbreach",
  "lumina-w",
  "wavival-dev",
  "forgotten-portal",
];

// Prebuilt COP variants of the priced pages (served by middleware.ts to visitors in Colombia).
const COP_VARIANT_ROUTES = ["/cop/servicios", "/cop/cotizar", "/cop/en/services", "/cop/en/quote"];

const ALL_ROUTES = [
  ...ES_ROUTES,
  ...EN_ROUTES,
  ...PROJECT_SLUGS.map((s) => `/proyectos/${s}`),
  ...PROJECT_SLUGS.map((s) => `/en/projects/${s}`),
  ...COP_VARIANT_ROUTES,
];

test.describe("route coverage", () => {
  for (const route of ALL_ROUTES) {
    test(`${route} responds 200 with a single h1`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status(), `status for ${route}`).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    });
  }
});
