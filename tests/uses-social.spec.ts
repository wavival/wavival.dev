import { test, expect, type Page } from "@playwright/test";
import { SOCIAL_PROFILES } from "../src/data/social";
import { sectionIndices, usesSectionIndices } from "../src/utils/sections";

const PAGES = {
  es: {
    path: "/herramientas/",
    eyebrow: "Redes",
    title: "Construyo en público",
    description:
      "Muestro en Instagram y TikTok cómo construyo software seguro, automatizaciones con IA y lo que voy aprendiendo.",
    link: "Ver perfiles",
    linkLabel: "Ver perfiles de Instagram y TikTok de Valentina Ramírez",
    cards: {
      instagram: {
        name: "Instagram",
        text: "Reels y publicaciones con el detrás de cámaras de cada proyecto y lo que aprendo en el camino.",
      },
      tiktok: {
        name: "TikTok",
        text: "Videos cortos donde explico cómo construyo software seguro y automatizaciones con IA.",
      },
    },
    counts: /\d+\s*(seguidores|publicaciones|videos)/i,
  },
  en: {
    path: "/en/uses/",
    eyebrow: "Social",
    title: "I build in public",
    description:
      "On Instagram and TikTok I show how I build secure software and AI automations, and what I keep learning along the way.",
    link: "See profiles",
    linkLabel: "See profiles of Valentina Ramírez on Instagram and TikTok",
    cards: {
      instagram: {
        name: "Instagram",
        text: "Reels and posts with the behind the scenes of each project and what I learn along the way.",
      },
      tiktok: {
        name: "TikTok",
        text: "Short videos where I explain how I build secure software and AI automations.",
      },
    },
    counts: /\d+\s*(followers|posts|videos)/i,
  },
} as const;

const NETWORKS = ["instagram", "tiktok"] as const;

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Bounding boxes of the label and content columns of a two-column section. */
async function columns(page: Page, section: string) {
  const label = page.locator(`${section} [data-sticky-section-label]`);
  const content = page.locator(`${section} [data-sticky-section-content]`);
  return {
    label: (await label.boundingBox())!,
    content: (await content.boundingBox())!,
    position: await label.evaluate((el) => getComputedStyle(el).position),
  };
}

test.describe("section numbering of the tools pages (usesSectionIndices)", () => {
  test("numbers the rendered sections in order without gaps", () => {
    expect(sectionIndices(["a", "b", "c"])).toEqual({ a: "01", b: "02", c: "03" });
    expect(sectionIndices([])).toEqual({});
  });

  test("Social is 05 after the GitHub section", () => {
    expect(usesSectionIndices(true)).toEqual({
      stack: "01",
      hardware: "02",
      software: "03",
      github: "04",
      social: "05",
    });
  });

  test("Social is 04 when the GitHub section does not render", () => {
    const indices = usesSectionIndices(false);
    expect(indices).toEqual({ stack: "01", hardware: "02", software: "03", social: "04" });
    expect(indices.github).toBeUndefined();
  });
});

for (const copy of Object.values(PAGES) as (typeof PAGES)["es"][]) {
  test.describe(`${copy.path} social section`, () => {
    test("renders the last numbered section with its label copy", async ({ page }) => {
      await page.goto(copy.path);
      const section = page.locator("section#social");
      await expect(section).toHaveCount(1);
      const label = section.locator("[data-sticky-section-label]");
      await expect(label.locator(".eyebrow")).toHaveText(copy.eyebrow);
      await expect(label.getByRole("heading", { level: 2 })).toHaveText(copy.title);
      await expect(label.locator("p")).toHaveText(copy.description);

      // The GitHub block only renders when the build-time fetch succeeded, so the
      // numbering must follow the sections actually on the page.
      const indices = await page.locator("main .index").allTextContents();
      const withGithub = (await page.locator("#repos").count()) === 1;
      const expected = Object.values(usesSectionIndices(withGithub));
      expect(indices).toEqual(expected);
      await expect(label.locator(".index")).toHaveText(withGithub ? "05" : "04");
      if (withGithub) {
        await expect(page.locator("#repos .index")).toHaveText("04");
        expect(
          await section.evaluate((el) => {
            const github = document.querySelector("#repos")!;
            return Boolean(github.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
          })
        ).toBe(true);
      }
    });

    test("the label link opens the first profile in a new tab", async ({ page }) => {
      await page.goto(copy.path);
      const link = page.locator("#social [data-sticky-section-label]").getByRole("link");
      await expect(link).toHaveCount(1);
      await expect(link).toHaveText(copy.link);
      await expect(link).toHaveClass(/action-link/);
      await expect(link).toHaveAttribute("aria-label", copy.linkLabel);
      await expect(link).toHaveAttribute("href", SOCIAL_PROFILES.instagram.href);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    test("two profile cards link Instagram and TikTok without counts", async ({ page }) => {
      await page.goto(copy.path);
      const cards = page.locator("#social a[data-social-profile]");
      await expect(cards).toHaveCount(2);
      for (const [i, network] of NETWORKS.entries()) {
        const card = cards.nth(i);
        const expected = copy.cards[network];
        const handle = SOCIAL_PROFILES[network].handle!;
        await expect(card).toHaveAttribute("data-social-profile", network);
        await expect(card).toHaveAttribute("href", SOCIAL_PROFILES[network].href);
        await expect(card).toHaveAttribute("target", "_blank");
        await expect(card).toHaveAttribute("rel", "noopener noreferrer");
        // Like RepoCard: no aria-label, the accessible name is the visible content.
        await expect(card).not.toHaveAttribute("aria-label", /.*/);
        await expect(card).toHaveAccessibleName(
          new RegExp(
            `^${expected.name}\\s+${escapeRegExp(handle)}\\s+${escapeRegExp(expected.text)}$`
          )
        );
        await expect(card.locator(".badge")).toHaveText(expected.name);
        await expect(card).toContainText(handle);
        await expect(card).toContainText(expected.text);
        const icon = card.locator(".mask-icon");
        await expect(icon).toHaveCount(1);
        await expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(await icon.evaluate((el) => el.style.getPropertyValue("--icon"))).toContain(
          `/icons/ui/${network}.svg`
        );
      }
      await expect(page.locator("#social")).not.toContainText(copy.counts);
      await expect(page.locator("#social iframe, #social script")).toHaveCount(0);
    });

    test("the label column behaves like the GitHub one on desktop and mobile", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(copy.path);
      const desktop = await columns(page, "#social");
      expect(desktop.position).toBe("static");
      expect(desktop.label.width).toBeCloseTo(260, 0);
      expect(desktop.content.x).toBeGreaterThan(desktop.label.x + desktop.label.width);
      if ((await page.locator("#repos").count()) === 1) {
        const github = (await page.locator("#repos > div").first().boundingBox())!;
        expect(desktop.label.width).toBeCloseTo(github.width, 0);
        expect(desktop.label.x).toBeCloseTo(github.x, 0);
      }

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(copy.path);
      const mobile = await columns(page, "#social");
      const section = (await page.locator("#social").boundingBox())!;
      expect(mobile.position).toBe("static");
      expect(mobile.label.width).toBeCloseTo(section.width, 0);
      expect(mobile.content.y).toBeGreaterThanOrEqual(mobile.label.y + mobile.label.height);
      const cards = page.locator("#social a[data-social-profile]");
      const first = (await cards.nth(0).boundingBox())!;
      const second = (await cards.nth(1).boundingBox())!;
      expect(second.y).toBeGreaterThanOrEqual(first.y + first.height);
    });
  });
}
