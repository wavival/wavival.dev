import { test, expect } from "@playwright/test";
import { projects } from "../src/data/projects";
import { projectView } from "../src/data/projectView";

const base = { es: "/proyectos", en: "/en/projects" } as const;
const redacted = [
  "24 horas",
  "180 días",
  "24 hours",
  "180 days",
  "GHCR",
  "Nginx",
  "VPS",
  "hardening",
  "tenant",
  "vercel.json",
];
const redactedSlugs = ["terracore", "okroot", "lumina-w", "wavival-dev"];

test.describe("layered case study detail", () => {
  for (const lang of ["es", "en"] as const) {
    test(`${lang}: technical detail starts closed and opens with the keyboard`, async ({
      page,
    }) => {
      for (const p of projects) {
        await page.goto(`${base[lang]}/${p.slug}`);
        const first = page.locator("details[data-technical]").first();
        await expect(first, p.slug).not.toHaveAttribute("open", "");
        // The content stays in the HTML while closed.
        expect(await first.locator("section").count(), p.slug).toBeGreaterThan(0);
        const summary = first.locator("> summary");
        await expect(summary).toContainText(
          lang === "en" ? "View technical details" : "Ver detalle técnico"
        );
        await summary.focus();
        await page.keyboard.press("Enter");
        await expect(first, p.slug).toHaveAttribute("open", "");
      }
    });

    test(`${lang}: a link to a technical section opens the closed detail`, async ({ page }) => {
      await page.setViewportSize({ width: 1366, height: 900 });
      await page.goto(`${base[lang]}/forgotten-portal`);
      const panel = page.locator("details[data-technical]").first();
      await expect(panel).not.toHaveAttribute("open", "");
      await page.locator('nav a[href="#cs-architecture"]').first().click();
      await expect(panel).toHaveAttribute("open", "");

      await page.goto(`${base[lang]}/wavival-dev#cs-design`);
      await expect(page.locator("details[data-technical]").first()).toHaveAttribute("open", "");
    });

    test(`${lang}: the project summary appears once per page`, async ({ page }) => {
      for (const p of projects) {
        const summary = projectView(p, lang).summary;
        await page.goto(`${base[lang]}/${p.slug}`);
        const text = (await page.locator("main").textContent()) ?? "";
        expect(text.split(summary).length - 1, p.slug).toBe(1);
        for (const part of p.parts) {
          const own = (lang === "en" ? part.en?.summary : undefined) ?? part.summary;
          if (own && own !== summary) {
            expect(text.split(own).length - 1, `${p.slug} ${part.kind}`).toBeLessThanOrEqual(1);
          }
        }
      }
    });

    test(`${lang}: no part shows more than three learnings`, async ({ page }) => {
      for (const p of projects) {
        await page.goto(`${base[lang]}/${p.slug}`);
        const groups = page.locator("[data-learnings-cards]");
        const n = await groups.count();
        for (let i = 0; i < n; i++) {
          expect(await groups.nth(i).locator("article").count(), p.slug).toBeLessThanOrEqual(3);
        }
      }
    });

    test(`${lang}: redacted infrastructure details never reach the HTML`, async ({ page }) => {
      for (const slug of redactedSlugs) {
        const response = await page.goto(`${base[lang]}/${slug}`);
        // The contact band that closes every page says "respondo en 24 horas"; only the case study is checked.
        const html = (await response!.text())
          .replace(/<section\b[^>]*\bid="contact"[\s\S]*?<\/section>/, "")
          .toLowerCase();
        for (const term of redacted) {
          expect(html.includes(term.toLowerCase()), `${slug}: ${term}`).toBe(false);
        }
      }
    });

    test(`${lang}: the TerraCore roadmap matches the validation status`, async ({ page }) => {
      const response = await page.goto(`${base[lang]}/terracore`);
      const html = await response!.text();
      expect(html).not.toMatch(/venta activa|active sales/i);
      expect(html).toContain(
        lang === "en"
          ? "Product in production, in validation with real clients in Colombia."
          : "Producto en producción, en validación con clientes reales en Colombia."
      );
    });
  }

  test("every part keeps at most three learnings in the data", () => {
    for (const p of projects) {
      for (const part of p.parts) {
        expect(part.learnings?.length ?? 0, `${p.slug} ${part.kind}`).toBeLessThanOrEqual(3);
        expect(part.en?.learnings?.length ?? 0, `${p.slug} ${part.kind} en`).toBeLessThanOrEqual(3);
      }
    }
  });
});
