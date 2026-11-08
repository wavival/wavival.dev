import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".html") || entry.name.endsWith(".txt") ? [full] : [];
  });

const SERVICES = {
  es: {
    path: "/servicios/",
    title: "Servicios: software seguro y automatización con IA | Valentina Ramírez",
    description:
      "Landing pages, sitios web, automatización con n8n, chatbots con IA, apps a medida y revisión de seguridad, con precio fijo y plazo claro. Software seguro que le ahorra tiempo a tu negocio.",
  },
  en: {
    path: "/en/services/",
    title: "Services: secure software and AI automation | Valentina Ramírez",
    description:
      "Landing pages, websites, n8n automation, AI chatbots, custom apps and security reviews, each with a fixed price and a clear timeline. Secure software that saves your business time.",
  },
} as const;

test.describe("remaining positioning copy", () => {
  test("the JSON-LD Person is a Software Developer with the localized description", async ({
    page,
  }) => {
    for (const [path, lang] of [
      ["/", "es"],
      ["/en/", "en"],
    ] as const) {
      await page.goto(path);
      const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
      const graph = JSON.parse(raw!)["@graph"] as Array<Record<string, unknown>>;
      const person = graph.find((node) => node["@type"] === "Person")!;
      expect(person.jobTitle).toBe("Software Developer");
      expect(person.knowsAbout).toContain("Software Development");
      expect(person.knowsAbout).not.toContain("Full Stack Development");
      expect(person.description).toBe(
        lang === "en"
          ? "Software developer focused on backend, AI and security. I help entrepreneurs save time with secure software and AI automation. Founder of Lúmina W (luminaw.co)."
          : "Desarrolladora de software con enfoque en backend, IA y seguridad. Ayudo a emprendedores a ahorrar tiempo con software seguro y automatización con IA. Fundadora de Lúmina W (luminaw.co)."
      );
    }
  });

  for (const lang of ["es", "en"] as const) {
    const services = SERVICES[lang];
    test(`${services.path} carries the new title and description`, async ({ page }) => {
      await page.goto(services.path);
      await expect(page).toHaveTitle(services.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        services.description
      );
      await expect(page.locator("main")).not.toContainText(/full stack developer/i);
    });
  }

  test("no built page or llms file says Full Stack Developer", () => {
    const offenders = walk(dist).filter((file) =>
      /full[\s-]?stack developer/i.test(readFileSync(file, "utf8"))
    );
    expect(offenders).toEqual([]);
  });
});
