import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import { caseStudies, type Project } from "../src/data/projects";

const listFields = [
  "architecture",
  "decisions",
  "results",
  "learnings",
  "painPoints",
  "modules",
  "design",
  "chainSteps",
] as const;

const sectionFields = ["design", "decisions", "roadmap"] as const;

test.describe("case study data", () => {
  for (const project of caseStudies) {
    test(`${project.slug}: ES and EN carry the same content`, () => {
      expect(project.imageAlt?.trim(), "imageAlt").toBeTruthy();
      expect(project.en?.imageAlt?.trim(), "en.imageAlt").toBeTruthy();
      expect(project.summary?.trim(), "summary").toBeTruthy();
      expect(project.en?.summary?.trim(), "en.summary").toBeTruthy();

      for (const field of listFields) {
        const es = project[field as keyof Project] as unknown[] | undefined;
        const en = project.en?.[field as keyof NonNullable<Project["en"]>] as unknown[] | undefined;
        expect(en?.length ?? 0, `${field} length`).toBe(es?.length ?? 0);
      }

      for (const column of ["now", "next", "later"] as const) {
        expect(project.en?.roadmap?.[column].length ?? 0, `roadmap.${column}`).toBe(
          project.roadmap?.[column].length ?? 0
        );
      }

      for (const link of [...project.links, ...(project.en?.links ?? [])]) {
        expect(link.ariaLabel.trim(), `${link.href} ariaLabel`).toBeTruthy();
      }
    });

    test(`${project.slug}: meta descriptions fit in 160 characters`, () => {
      expect((project.metaDescription ?? "").length).toBeLessThanOrEqual(160);
      expect((project.en?.metaDescription ?? "").length).toBeLessThanOrEqual(160);
    });
  }
});

test.describe("case study pages", () => {
  for (const project of caseStudies) {
    for (const [lang, path, inLanguage] of [
      ["es", `/proyectos/${project.slug}/`, "es-CO"],
      ["en", `/en/projects/${project.slug}/`, "en-US"],
    ] as const) {
      test(`${lang} ${project.slug}: sections and JSON-LD render`, async ({ page }) => {
        await page.goto(path);
        await expect(page.locator("#cs-problem")).toHaveCount(1);
        for (const field of sectionFields) {
          const present = Boolean(project[field]);
          await expect(page.locator(`#cs-${field}`), field).toHaveCount(present ? 1 : 0);
        }
        const ld = await page
          .locator('script[type="application/ld+json"]')
          .evaluateAll((els) => els.map((el) => el.textContent ?? ""));
        const projectLd = ld.map((t) => JSON.parse(t)).find((j) => j["@id"]?.endsWith("#project"));
        expect(projectLd, "project JSON-LD").toBeTruthy();
        expect(projectLd.inLanguage).toBe(inLanguage);
        if (project.image) expect(projectLd.image).toBe(`https://www.wavival.dev/${project.image}`);
      });
    }
  }
});

test.describe("AI discovery files", () => {
  for (const file of ["public/llms.txt", "public/llms-full.txt"]) {
    test(`${file} lists every case study`, () => {
      const body = readFileSync(file, "utf8");
      for (const project of caseStudies) {
        expect(body, project.slug).toContain(`/proyectos/${project.slug}`);
      }
    });
  }
});
