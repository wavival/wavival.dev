import { test, expect } from "@playwright/test";
import { serviceById } from "../src/data/services";

const PROJECT_SLUGS = [
  "terracore",
  "okroot",
  "nullbreach",
  "lumina-w",
  "wavival-dev",
  "forgotten-portal",
];

const INCLUDED = {
  es: [
    "/",
    "/proyectos",
    "/servicios",
    "/cop/servicios",
    "/sobre-mi",
    "/herramientas",
    ...PROJECT_SLUGS.map((s) => `/proyectos/${s}`),
  ],
  en: [
    "/en",
    "/en/projects",
    "/en/services",
    "/cop/en/services",
    "/en/about",
    "/en/uses",
    ...PROJECT_SLUGS.map((s) => `/en/projects/${s}`),
  ],
} as const;

const EXCLUDED = [
  "/contacto",
  "/en/contact",
  "/privacidad",
  "/en/privacy",
  "/cotizar",
  "/en/quote",
  "/cop/cotizar",
  "/cop/en/quote",
  "/no-existe",
  "/en/does-not-exist",
];

const COPY = {
  es: {
    eyebrow: "A un click",
    title: "Deja de hacer a mano lo que el software puede hacer por ti.",
    text: "Construyo landing pages, sitios web, automatizaciones, chatbots y apps a medida, con seguridad desde el diseño y precio fijo.",
    line: `MVP de ${serviceById("custom-web-app-mvp").timeline.es}. Disponibilidad limitada, respondo en 24 horas.`,
    primary: { text: "Cotizar mi proyecto", href: "/cotizar" },
    services: { text: "Ver servicios", href: "/servicios" },
    contact: { text: "Escríbeme", href: "/contacto" },
  },
  en: {
    eyebrow: "One click away",
    title: "Stop doing by hand what software can do for you.",
    text: "I build landing pages, websites, automations, chatbots and custom apps, with security by design and a fixed price.",
    line: `MVP in ${serviceById("custom-web-app-mvp").timeline.en}. Limited availability, I reply within 24 hours.`,
    primary: { text: "Get a quote", href: "/en/quote" },
    services: { text: "See services", href: "/en/services" },
    contact: { text: "Write to me", href: "/en/contact" },
  },
} as const;

const OLD = /Tu próxima idea merece|Your next idea deserves|Quiero mi producto|Start my project/;

const intersects = (a: { x: number; y: number; width: number; height: number }, b: typeof a) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

test.describe("contact band", () => {
  for (const [lang, routes] of Object.entries(INCLUDED) as ["es" | "en", readonly string[]][]) {
    const copy = COPY[lang];
    for (const path of routes) {
      test(`${path} closes with one contact band with the new copy`, async ({ page }) => {
        await page.goto(path);
        const band = page.locator("#contact");
        await expect(band).toHaveCount(1);
        await expect(band).toContainText(copy.eyebrow);
        await expect(band.locator("h2")).toHaveText(copy.title);
        await expect(band).toContainText(copy.text);
        await expect(band.locator("[data-mvp-timeline]")).toHaveText(copy.line);
        await expect(band).not.toContainText(OLD);
        const primary = band.getByRole("link", { name: copy.primary.text });
        await expect(primary).toHaveAttribute("href", copy.primary.href);
        const isServices = /\/services$|\/servicios$/.test(path);
        const secondary = isServices ? copy.contact : copy.services;
        const secondaryLink = band.getByRole("link", { name: secondary.text });
        await expect(secondaryLink).toHaveAttribute("href", secondary.href);
        for (const href of await band
          .locator("a[href]")
          .evaluateAll((a) => a.map((l) => l.getAttribute("href")))) {
          expect(href, path).not.toContain("/cop/");
        }
        // The band sits at the end of <main>, right before the footer.
        expect(
          await page.evaluate(() => document.querySelector("main")?.lastElementChild?.id)
        ).toBe("contact");
        expect(
          await page.evaluate(
            () => document.querySelector("#contact")?.parentElement?.nextElementSibling?.tagName
          )
        ).toBe("FOOTER");
        // The floating WhatsApp button never covers the band buttons on a phone.
        const viewport = page.viewportSize()!;
        if (viewport.width < 600) {
          await primary.scrollIntoViewIfNeeded();
          const floating = (await page.locator("a[data-whatsapp]").boundingBox())!;
          for (const link of [primary, secondaryLink]) {
            const box = (await link.boundingBox())!;
            expect(intersects(box, floating), path).toBe(false);
          }
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          const floatingBottom = (await page.locator("a[data-whatsapp]").boundingBox())!;
          for (const link of [primary, secondaryLink]) {
            const box = (await link.boundingBox())!;
            expect(intersects(box, floatingBottom), path).toBe(false);
          }
        }
      });
    }
  }

  for (const path of EXCLUDED) {
    test(`${path} has no contact band`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("#contact")).toHaveCount(0);
    });
  }

  // The contact pages keep their own heading with that phrase; they never carry the band.
  test("no built page with the band carries the previous band copy", async () => {
    const { readdirSync, readFileSync, statSync } = await import("node:fs");
    const { join } = await import("node:path");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full);
        else if (name.endsWith(".html") && !/\/(en\/)?contact(o)?\//.test(full)) files.push(full);
      }
    };
    walk("dist");
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) expect(readFileSync(file, "utf8"), file).not.toMatch(OLD);
  });
});
