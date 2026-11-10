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
    title: "Servicios: software y marketing digital",
    description:
      "Landing pages, sitios web, n8n, chatbots con IA, apps a medida y seguridad, con precio fijo y plazo claro. Software seguro que le ahorra tiempo a tu negocio.",
  },
  en: {
    path: "/en/services/",
    title: "Services: software and digital marketing",
    description:
      "Landing pages, websites, n8n, AI chatbots, custom apps and security, each with a fixed price and timeline. Secure software that saves your business time.",
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
      expect(person.jobTitle).toBe("Software Developer and Digital Marketer");
      expect(person.knowsAbout).toContain("Software Development");
      expect(person.knowsAbout).toContain("Digital Marketing");
      expect(person.knowsAbout).not.toContain("Full Stack Development");
      expect(person.description).toBe(
        lang === "en"
          ? "Software developer and digital marketer. I help entrepreneurs save time and sell more with secure software, AI and content. Founder of Lúmina W (luminaw.co)."
          : "Desarrolladora de software y marketing digital. Ayudo a emprendedores a ahorrar tiempo y vender más con software seguro, IA y contenido. Fundadora de Lúmina W (luminaw.co)."
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
