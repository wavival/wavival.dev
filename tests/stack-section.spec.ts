import { test, expect } from "@playwright/test";

const CARDS = [
  { title: "Backend", featured: true },
  { title: "Frontend & UX", featured: false },
  { title: "Security", featured: false },
  { title: "AI Integrations", featured: true },
  { title: "Marketing & Content", featured: true },
];

const CHIPS = {
  es: [
    "Python",
    "Django",
    "Django REST Framework",
    "PostgreSQL",
    "JWT",
    "Arquitectura de software",
    "PWAs",
    "Offline-first",
    "APIs REST",
    "Multitenancy",
    "Modelado relacional",
    "Next.js",
    "React",
    "TypeScript",
    "Astro",
    "Tailwind CSS",
    "JavaScript",
    "UX/UI",
    "Figma",
    "Accesibilidad (a11y)",
    "SEO técnico",
    "Web Performance",
    "OWASP",
    "MITRE ATT&CK",
    "PTES",
    "Linux",
    "AppSec",
    "OpenAI",
    "OpenClaw",
    "Claude API",
    "LLM Workflows",
    "Prompt Engineering",
    "n8n",
    "Marketing digital",
    "Creación de contenido",
    "TikTok",
    "Instagram",
    "CapCut",
    "Canva",
    "ElevenLabs",
    "Higgsfield",
  ],
  en: [
    "Python",
    "Django",
    "Django REST Framework",
    "PostgreSQL",
    "JWT",
    "Software architecture",
    "PWAs",
    "Offline-first",
    "REST APIs",
    "Multitenancy",
    "Relational modeling",
    "Next.js",
    "React",
    "TypeScript",
    "Astro",
    "Tailwind CSS",
    "JavaScript",
    "UX/UI",
    "Figma",
    "Accessibility (a11y)",
    "Technical SEO",
    "Web Performance",
    "OWASP",
    "MITRE ATT&CK",
    "PTES",
    "Linux",
    "AppSec",
    "OpenAI",
    "OpenClaw",
    "Claude API",
    "LLM Workflows",
    "Prompt Engineering",
    "n8n",
    "Digital marketing",
    "Content creation",
    "TikTok",
    "Instagram",
    "CapCut",
    "Canva",
    "ElevenLabs",
    "Higgsfield",
  ],
};

const SECURITY = {
  es: {
    description: "Seguridad desde el diseño en cada línea de código.",
    why: "Reviso cada sistema con criterios de OWASP para encontrar sus fallas antes que alguien más y escribir código que no se rompa así.",
    featured: "Destacado",
    uses: "/herramientas",
  },
  en: {
    description: "Security by design in every line of code.",
    why: "I review every system against OWASP criteria to find its flaws before someone else does and write code that does not break that way.",
    featured: "Featured",
    uses: "/en/uses",
  },
};

const RETIRED = /mentalidad ofensiva|offensive mindset|hago pentesting|I do pentesting/i;

test.describe("home stack grid", () => {
  for (const [lang, home] of [
    ["es", "/"],
    ["en", "/en/"],
  ] as const) {
    test(`${home} shows the five cards in order with the three featured axes`, async ({ page }) => {
      await page.goto(home);
      const cards = page.locator("#stack article");
      await expect(cards).toHaveCount(5);
      await expect(cards.locator("h3")).toHaveText(CARDS.map((c) => c.title));
      for (const [i, card] of CARDS.entries()) {
        const article = cards.nth(i);
        await expect(article.locator(".index")).toHaveText(String(i + 1).padStart(2, "0"));
        const label = article.locator(".label-sm");
        await expect(label).toHaveCount(card.featured ? 1 : 0);
        if (card.featured) await expect(label).toHaveText(SECURITY[lang].featured);
        expect(await article.evaluate((el) => el.style.getPropertyValue("--span"))).toBe(
          card.featured ? "6" : "3"
        );
      }
    });

    test(`${home} keeps every chip and the new Security sentence`, async ({ page }) => {
      await page.goto(home);
      const chips = await page.locator("#stack .chip").allTextContents();
      for (const chip of CHIPS[lang]) expect(chips, chip).toContain(chip);
      expect(chips).toHaveLength(CHIPS[lang].length);
      const security = page.locator("#stack article").nth(2);
      await expect(security.locator("p")).toHaveText(SECURITY[lang].description);
      await expect(page.locator("#stack")).not.toContainText(RETIRED);
      await expect(page.locator("main")).not.toContainText(RETIRED);
    });

    test(`${SECURITY[lang].uses} lists the same five categories and the new Security rationale`, async ({
      page,
    }) => {
      await page.goto(SECURITY[lang].uses);
      const section = page.locator("main section").first();
      const titles = section.locator("h3").filter({
        hasText: /^(Backend|Frontend & UX|Security|AI Integrations|Marketing & Content)$/,
      });
      await expect(titles).toHaveText(CARDS.map((c) => c.title));
      await expect(section).toContainText(SECURITY[lang].description);
      await expect(section).toContainText(SECURITY[lang].why);
      await expect(page.locator("main")).not.toContainText(RETIRED);
    });
  }

  test("no built page carries the retired security wording", async () => {
    const { readdirSync, readFileSync, statSync } = await import("node:fs");
    const { join } = await import("node:path");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full);
        else if (/\.(html|txt)$/.test(name)) files.push(full);
      }
    };
    walk("dist");
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(RETIRED);
    }
  });
});
