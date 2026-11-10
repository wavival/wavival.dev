import { test, expect, type Locator } from "@playwright/test";
import { SOCIAL_PROFILES } from "../src/data/social";
import { sectionIndices, usesSectionIndices } from "../src/utils/sections";

const PAGES = {
  es: {
    path: "/herramientas/",
    eyebrow: "Redes",
    title: "Construyo en público",
    description:
      "Muestro en Instagram y TikTok cómo construyo software seguro, automatizaciones con IA y lo que voy aprendiendo.",
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
    cards: {
      instagram: {
        name: "Instagram",
        text: "Reels and posts that go behind the scenes of each project and what I learn along the way.",
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
async function columns(section: Locator) {
  const label = section.locator("[data-sticky-section-label]");
  const content = section.locator("[data-sticky-section-content]");
  return {
    label: (await label.boundingBox())!,
    content: (await content.boundingBox())!,
    position: await label.evaluate((el) => getComputedStyle(el).position),
  };
}

test.describe("section numbering of the tools pages (usesSectionIndices)", () => {
  test("numbers the listed sections in order without gaps", () => {
    expect(sectionIndices(["a", "b", "c"])).toEqual({ a: "01", b: "02", c: "03" });
    expect(sectionIndices([])).toEqual({});
  });

  test("Social is 04 and GitHub 05 when the GitHub section renders", () => {
    expect(usesSectionIndices(true)).toEqual({
      stack: "01",
      hardware: "02",
      software: "03",
      social: "04",
      github: "05",
    });
  });

  test("the page ends at Social 04 when the GitHub section does not render", () => {
    const indices = usesSectionIndices(false);
    expect(indices).toEqual({ stack: "01", hardware: "02", software: "03", social: "04" });
    expect(indices.github).toBeUndefined();
  });
});

for (const copy of Object.values(PAGES) as (typeof PAGES)["es"][]) {
  test.describe(`${copy.path} social section`, () => {
    test("renders section 04 after Software and before GitHub with its label copy", async ({
      page,
    }) => {
      await page.goto(copy.path);
      const section = page.locator("section#social");
      await expect(section).toHaveCount(1);
      const label = section.locator("[data-sticky-section-label]");
      await expect(label.locator(".index")).toHaveText("04");
      await expect(label.locator(".eyebrow")).toHaveText(copy.eyebrow);
      await expect(label.getByRole("heading", { level: 2 })).toHaveText(copy.title);
      await expect(label.locator("p")).toHaveText(copy.description);
      // The profiles are linked from the cards only.
      await expect(label.getByRole("link")).toHaveCount(0);

      // The GitHub block only renders when the build-time fetch succeeded, so the
      // numbering must follow the sections actually on the page.
      const indices = await page.locator("main .index").allTextContents();
      const withGithub = (await page.locator("#repos").count()) === 1;
      expect(indices).toEqual(Object.values(usesSectionIndices(withGithub)));
      if (withGithub) {
        await expect(page.locator("#repos .index")).toHaveText("05");
        expect(
          await section.evaluate((el) => {
            const github = document.querySelector("#repos")!;
            return Boolean(el.compareDocumentPosition(github) & Node.DOCUMENT_POSITION_FOLLOWING);
          })
        ).toBe(true);
      }
    });

    test("two profile cards link Instagram and TikTok without counts", async ({ page }) => {
      await page.goto(copy.path);
      const cards = page.locator("#social a[data-social-profile]");
      await expect(cards).toHaveCount(2);
      await expect(page.locator("#social a")).toHaveCount(2);
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

    test("only Instagram is featured; TikTok uses the repo card design", async ({ page }) => {
      await page.goto(copy.path);
      const instagram = page.locator('#social a[data-social-profile="instagram"]');
      const tiktok = page.locator('#social a[data-social-profile="tiktok"]');
      await expect(instagram).toHaveAttribute("data-variant", "featured");
      await expect(instagram).toHaveClass(/border-t-blue/);
      await expect(instagram).toHaveClass(/bg-surface/);
      await expect(tiktok).toHaveAttribute("data-variant", "repo");
      await expect(tiktok).not.toHaveClass(/border-t-blue/);
      await expect(tiktok).not.toHaveClass(/bg-surface/);
      await expect(tiktok).toHaveClass(/\bp-5\b/);
      await expect(page.locator("#social .border-t-blue")).toHaveCount(1);

      // Same border, padding and type size as a GitHub repo card when that block rendered.
      const repo = page.locator("#repos .border-t-blue a[href*='github.com/']").first();
      if ((await repo.count()) === 1) {
        const style = (el: Element) => {
          const s = getComputedStyle(el);
          return [s.borderTopWidth, s.borderTopColor, s.padding, s.fontSize];
        };
        expect(await tiktok.evaluate(style)).toEqual(await repo.evaluate(style));
      }
    });

    test("the label column matches the other sections on desktop and stacks on mobile", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(copy.path);
      const social = await columns(page.locator("#social"));
      const software = await columns(page.locator("main section.rule-section").nth(2));
      expect(social.position).toBe(software.position);
      expect(social.label.width).toBeCloseTo(260, 0);
      expect(social.label.x).toBeCloseTo(software.label.x, 0);
      expect(social.content.x).toBeGreaterThan(social.label.x + social.label.width);
      if ((await page.locator("#repos").count()) === 1) {
        const github = (await page.locator("#repos > div").first().boundingBox())!;
        expect(social.label.width).toBeCloseTo(github.width, 0);
        expect(social.label.x).toBeCloseTo(github.x, 0);
      }

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(copy.path);
      const mobile = await columns(page.locator("#social"));
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
