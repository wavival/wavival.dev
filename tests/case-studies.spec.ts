import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import {
  isRichPart,
  projects,
  projectFilters,
  type Project,
  type ProjectPart,
} from "../src/data/projects";

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

const vercel = JSON.parse(readFileSync("vercel.json", "utf8")) as {
  redirects: { source: string; destination: string; permanent: boolean }[];
};

const richParts = (project: Project) => project.parts.filter(isRichPart);
const metaFor = (project: Project, lang: "es" | "en") =>
  (lang === "en" ? project.en?.metaDescription : undefined) ??
  project.metaDescription ??
  project.parts[0].metaDescription ??
  "";

test.describe("project data", () => {
  test("slugs are unique and every project has a primary part", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const project of projects) expect(project.parts.length, project.slug).toBeGreaterThan(0);
  });

  test("the official names are used", () => {
    expect(projects.map((p) => p.name)).toEqual([
      "TerraCore | Campo Inteligente",
      "OKroot | Come sano, vive libre",
      "NullBreach | AI-Powered AppSec Chat",
      "Lúmina W | Software & Technology",
      "wavival.dev",
      "Forgotten Portal",
    ]);
  });

  for (const project of projects) {
    test(`${project.slug}: ES and EN carry the same project content`, () => {
      expect(project.name.trim(), "name").toBeTruthy();
      expect(project.shortName.trim(), "shortName").toBeTruthy();
      expect(project.imageAlt?.trim(), "imageAlt").toBeTruthy();
      expect(project.en?.imageAlt?.trim(), "en.imageAlt").toBeTruthy();
      const summary = project.summary ?? project.parts[0].summary;
      const enSummary = project.en?.summary ?? project.parts[0].en?.summary;
      expect(summary?.trim(), "summary").toBeTruthy();
      expect(enSummary?.trim(), "en.summary").toBeTruthy();
      expect(projectFilters(project).length, "filters").toBeGreaterThan(0);
    });

    test(`${project.slug}: meta descriptions fit in 160 characters`, () => {
      for (const lang of ["es", "en"] as const) {
        const meta = metaFor(project, lang);
        expect(meta.length, `${lang} meta length`).toBeGreaterThan(60);
        expect(meta.length, `${lang} meta length`).toBeLessThanOrEqual(160);
      }
    });

    test(`${project.slug}: parts are unique, ordered kinds with ES and EN content`, () => {
      const kinds = project.parts.map((part) => part.kind);
      expect(new Set(kinds).size, "a kind appears once per project").toBe(kinds.length);

      for (const part of project.parts) {
        const id = `${project.slug}#${part.kind}`;
        expect(part.blurb.trim(), `${id} blurb`).toBeTruthy();
        expect(part.en?.blurb.trim(), `${id} en.blurb`).toBeTruthy();
        expect(part.links.length + (part.designLink ? 1 : 0), `${id} has a link`).toBeGreaterThan(
          0
        );
        for (const link of [...part.links, ...(part.en?.links ?? [])]) {
          expect(link.ariaLabel.trim(), `${id} ${link.href} ariaLabel`).toBeTruthy();
          expect(link.href, `${id} link is https`).toMatch(/^https:\/\//);
        }
        expect(part.en?.links?.length ?? part.links.length, `${id} en links`).toBe(
          part.links.length
        );
        // Link-only kinds carry no case-study content; the rest must be rich or a plain site.
        if (["repo", "api"].includes(part.kind)) {
          expect(isRichPart(part), `${id} stays link-only`).toBe(false);
        }
      }
    });

    for (const part of richParts(project)) {
      test(`${project.slug}#${part.kind}: ES and EN lists match`, () => {
        for (const field of listFields) {
          const es = part[field as keyof ProjectPart] as unknown[] | undefined;
          const en = part.en?.[field as keyof NonNullable<ProjectPart["en"]>] as
            unknown[] | undefined;
          expect(en?.length ?? 0, `${field} length`).toBe(es?.length ?? 0);
        }
        for (const column of ["now", "next", "later"] as const) {
          expect(part.en?.roadmap?.[column]?.length ?? 0, `roadmap.${column}`).toBe(
            part.roadmap?.[column]?.length ?? 0
          );
        }
        expect(part.en?.summary?.trim() ?? "", "en.summary").toBeTruthy();
      });
    }
  }
});

test.describe("redirects of the merged slugs", () => {
  const redirects = new Map(vercel.redirects.map((r) => [r.source, r]));
  const merged = [
    ["terracore-landing", "terracore", "landing"],
    ["okroot-landing", "okroot", "landing"],
    ["root-landing", "okroot", "landing"],
    ["blog-lumina-w", "lumina-w", "blog"],
  ] as const;

  test("each former slug redirects permanently to its project and part anchor", () => {
    for (const [oldSlug, slug, kind] of merged) {
      expect(redirects.get(`/proyectos/${oldSlug}`)).toMatchObject({
        destination: `/proyectos/${slug}#${kind}`,
        permanent: true,
      });
      expect(redirects.get(`/en/projects/${oldSlug}`)).toMatchObject({
        destination: `/en/projects/${slug}#${kind}`,
        permanent: true,
      });
      expect(redirects.get(`/projects/${oldSlug}`)).toMatchObject({
        destination: `/proyectos/${slug}#${kind}`,
        permanent: true,
      });
    }
  });

  test("every redirect that targets a project points to a real project and part", () => {
    for (const redirect of vercel.redirects) {
      const match = redirect.destination.match(
        /^\/(?:en\/projects|proyectos)\/([a-z-]+)(?:#(.+))?$/
      );
      if (!match) continue;
      const project = projects.find((p) => p.slug === match[1]);
      expect(project, `${redirect.source} -> ${redirect.destination}`).toBeTruthy();
      if (match[2]) {
        expect(
          project!.parts.map((part) => part.kind),
          `${redirect.source} anchor`
        ).toContain(match[2]);
      }
    }
  });

  test("redirects never chain through a former slug", () => {
    const sources = new Set(vercel.redirects.map((r) => r.source));
    for (const redirect of vercel.redirects) {
      const path = redirect.destination.split("#")[0];
      if (path.includes(":")) continue;
      expect(sources.has(path), `${redirect.source} -> ${path} is itself redirected`).toBe(false);
    }
  });
});

test.describe("case study pages", () => {
  for (const project of projects) {
    for (const [lang, path, inLanguage] of [
      ["es", `/proyectos/${project.slug}/`, "es-CO"],
      ["en", `/en/projects/${project.slug}/`, "en-US"],
    ] as const) {
      test(`${lang} ${project.slug}: sections and JSON-LD render`, async ({ page }) => {
        await page.goto(path);
        const multi = project.parts.length > 1;
        const prefix = (kind: string) => (multi ? `#cs-${kind}-` : "#cs-");

        for (const part of project.parts) {
          if (multi) await expect(page.locator(`#${part.kind}`), `#${part.kind}`).toHaveCount(1);
          if (!isRichPart(part)) continue;
          await expect(page.locator(`${prefix(part.kind)}problem`)).toHaveCount(
            part.problem ? 1 : 0
          );
          for (const field of ["design", "decisions", "roadmap"] as const) {
            await expect(page.locator(`${prefix(part.kind)}${field}`), field).toHaveCount(
              part[field] ? 1 : 0
            );
          }
        }

        const ld = await page
          .locator('script[type="application/ld+json"]')
          .evaluateAll((els) => els.map((el) => el.textContent ?? ""));
        const projectLd = ld.map((t) => JSON.parse(t)).find((j) => j["@id"]?.endsWith("#project"));
        expect(projectLd, "project JSON-LD").toBeTruthy();
        expect(projectLd.name).toBe(project.name);
        expect(projectLd.inLanguage).toBe(inLanguage);
        if (project.image) expect(projectLd.image).toBe(`https://www.wavival.dev/${project.image}`);
        if (multi) {
          expect(projectLd.hasPart.length, "hasPart").toBe(
            project.parts.filter((part) => part.links.length > 0).length
          );
          for (const part of projectLd.hasPart) expect(part.url).toMatch(/^https:\/\//);
        } else {
          expect(projectLd.hasPart, "single-part projects have no hasPart").toBeUndefined();
        }
      });
    }
  }
});

test.describe("AI discovery files", () => {
  for (const file of ["public/llms.txt", "public/llms-full.txt"]) {
    test(`${file} lists every project and every part link`, () => {
      const body = readFileSync(file, "utf8");
      for (const project of projects) {
        expect(body, project.slug).toContain(`/proyectos/${project.slug}`);
        expect(body, `${project.slug} official name`).toContain(project.name);
        for (const part of project.parts) {
          for (const link of part.links) {
            expect(body, `${project.slug}#${part.kind} ${link.href}`).toContain(
              link.href.replace(/\/$/, "")
            );
          }
        }
      }
    });

    test(`${file} no longer lists the merged slugs as separate case studies`, () => {
      const body = readFileSync(file, "utf8");
      for (const slug of ["terracore-landing", "okroot-landing", "blog-lumina-w"]) {
        expect(body, slug).not.toContain(`/proyectos/${slug}`);
        expect(body, slug).not.toContain(`/en/projects/${slug}`);
      }
    });
  }
});
