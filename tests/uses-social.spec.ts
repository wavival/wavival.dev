import { test, expect, type Page } from "@playwright/test";
import { SOCIAL_PROFILES } from "../src/data/social";

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
        label:
          "Instagram @wavival_dev. Reels y publicaciones con el detrás de cámaras de cada proyecto y lo que aprendo en el camino. (Instagram de Valentina Ramírez)",
        text: "Reels y publicaciones con el detrás de cámaras de cada proyecto y lo que aprendo en el camino.",
      },
      tiktok: {
        name: "TikTok",
        label:
          "TikTok @wavival_dev. Videos cortos donde explico cómo construyo software seguro y automatizaciones con IA. (TikTok de Valentina Ramírez)",
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
        label:
          "Instagram @wavival_dev. Reels and posts with the behind the scenes of each project and what I learn along the way. (Valentina Ramírez on Instagram)",
        text: "Reels and posts with the behind the scenes of each project and what I learn along the way.",
      },
      tiktok: {
        name: "TikTok",
        label:
          "TikTok @wavival_dev. Short videos where I explain how I build secure software and AI automations. (Valentina Ramírez on TikTok)",
        text: "Short videos where I explain how I build secure software and AI automations.",
      },
    },
    counts: /\d+\s*(followers|posts|videos)/i,
  },
} as const;

const NETWORKS = ["instagram", "tiktok"] as const;

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

for (const copy of Object.values(PAGES) as (typeof PAGES)["es"][]) {
  test.describe(`${copy.path} social section`, () => {
    test("renders section 05 after the GitHub section with its label copy", async ({ page }) => {
      await page.goto(copy.path);
      const section = page.locator("section#social");
      await expect(section).toHaveCount(1);
      const label = section.locator("[data-sticky-section-label]");
      await expect(label.locator(".index")).toHaveText("05");
      await expect(label.locator(".eyebrow")).toHaveText(copy.eyebrow);
      await expect(label.getByRole("heading", { level: 2 })).toHaveText(copy.title);
      await expect(label.locator("p")).toHaveText(copy.description);

      const indices = await page.locator("main .index").allTextContents();
      expect(indices.at(-1)).toBe("05");
      const repos = page.locator("#repos");
      if ((await repos.count()) === 1) {
        expect(indices.at(-2)).toBe("04");
        expect(
          await section.evaluate((el) => {
            const github = document.querySelector("#repos")!;
            return Boolean(github.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
          })
        ).toBe(true);
      } else {
        // The GitHub block only renders when the build-time fetch succeeded.
        expect(indices.at(-2)).toBe("03");
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
        await expect(card).toHaveAttribute("data-social-profile", network);
        await expect(card).toHaveAttribute("href", SOCIAL_PROFILES[network].href);
        await expect(card).toHaveAttribute("target", "_blank");
        await expect(card).toHaveAttribute("rel", "noopener noreferrer");
        await expect(card).toHaveAttribute("aria-label", expected.label);
        await expect(card.locator(".badge")).toHaveText(expected.name);
        await expect(card).toContainText(SOCIAL_PROFILES[network].handle!);
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
