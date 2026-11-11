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
    title: "Servicios: desarrollo de software y marketing digital",
    description:
      "Landing pages, sitios web, chatbots con IA, apps a medida, estrategia de oferta y lanzamientos digitales, con plazo claro. Software y estrategia que venden.",
  },
  en: {
    path: "/en/services/",
    title: "Services: software development and digital marketing",
    description:
      "Landing pages, websites, AI chatbots, custom apps, offer strategy and digital launches, each with a clear timeline. Software and strategy that sell.",
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
      expect(person.jobTitle).toBe("Software Developer and Digital Strategist");
      expect(person.knowsAbout).toContain("Software Development");
      expect(person.knowsAbout).toContain("Digital Marketing");
      expect(person.knowsAbout).toContain("Digital Strategy");
      expect(person.knowsAbout).not.toContain("Full Stack Development");
      expect(person.description).toBe(
        lang === "en"
          ? "Software developer and digital strategist. I help entrepreneurs save time and sell more with software, AI and digital strategy, and creators structure and launch their offer. Founder of Lúmina W (luminaw.co)."
          : "Desarrolladora de software y estratega digital. Ayudo a emprendedores a ahorrar tiempo y vender más con software, IA y estrategia digital, y a creadores a estructurar y lanzar su oferta. Fundadora de Lúmina W (luminaw.co)."
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
