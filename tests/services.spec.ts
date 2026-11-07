import { test, expect, type Page } from "@playwright/test";
import {
  PRICES,
  SERVICE_IDS,
  THRESHOLDS,
  TIME_SAVER_KIT_PARTS,
  formatMoney,
  formatPrice,
  priceById,
  savingsPercent,
} from "../src/data/pricing";
import {
  GENERAL_EXCLUSIONS,
  SERVICES,
  SERVICE_GROUPS,
  TECHNICAL_TEAMS_SERVICE,
} from "../src/data/services";
import type { Lang } from "../src/i18n/ui";
import { COP_VARIANT_PREFIX, PRICED_ROUTES, type Currency } from "../src/utils/currency";

// The services catalog of the 2026 plan: eleven services in three groups, each
// with its price (from `src/data/pricing.ts`, in the currency of the page
// variant), timeline, inclusions and exclusions, plus the general exclusions
// and the block for technical teams. Checked in both languages and currencies.

const PAGES: { lang: Lang; path: string; quote: string }[] = [
  { lang: "es", path: "/servicios", quote: "/cotizar" },
  { lang: "en", path: "/en/services", quote: "/en/quote" },
];

/** The two builds of each page: the USD page at its public path and the COP variant. */
const VARIANTS: { currency: Currency; prefix: string }[] = [
  { currency: "USD", prefix: "" },
  { currency: "COP", prefix: COP_VARIANT_PREFIX },
];

const words = {
  from: { es: "desde", en: "from" },
  perMonth: { es: "al mes", en: "per month" },
} as const;

/** Every text node of the page, visible or not, without scripts and styles. */
const pageText = (page: Page) =>
  page.evaluate(() => {
    const clone = document.body.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("script, style, noscript").forEach((node) => node.remove());
    return clone.textContent ?? "";
  });

const serviceLd = async (page: Page) => {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? ""));
  const parsed = scripts.map((text) => JSON.parse(text));
  return parsed.find((item) => item["@type"] === "Service");
};

test.describe("services catalog", () => {
  test("the catalog data covers every service id once, in the order of the pricing source", () => {
    expect(SERVICES.map((service) => service.id)).toEqual([...SERVICE_IDS]);
    expect(SERVICE_GROUPS.map((group) => group.id)).toEqual([
      "development",
      "complementary",
      "marketing",
    ]);
    for (const service of SERVICES) {
      const priceIds = service.tiers
        ? service.tiers.map((tier) => tier.priceId)
        : [service.priceId];
      expect(priceIds, service.id).toEqual(
        PRICES.filter((price) => price.service === service.id).map((price) => price.id)
      );
    }
  });

  test("the Time Saver Kit saving is computed from the pricing source", () => {
    expect(TIME_SAVER_KIT_PARTS).toEqual([
      "landing-page",
      "n8n-automation",
      "n8n-automation",
      "ai-chatbot",
      "monthly-support-plus",
    ]);
    expect(savingsPercent("time-saver-kit", TIME_SAVER_KIT_PARTS, "COP")).toBe(29);
    expect(savingsPercent("time-saver-kit", TIME_SAVER_KIT_PARTS, "USD")).toBe(30);
  });

  for (const { lang, path, quote } of PAGES) {
    for (const { currency, prefix } of VARIANTS) {
      const url = `${prefix}${path}`;

      test(`${url}: the eleven services show name, price in ${currency}, timeline, inclusions and exclusions`, async ({
        page,
      }) => {
        await page.goto(url);
        const articles = page.locator("[data-service]");
        await expect(articles).toHaveCount(SERVICES.length);
        expect(await articles.evaluateAll((els) => els.map((el) => el.dataset.service))).toEqual([
          ...SERVICE_IDS,
        ]);

        for (const service of SERVICES) {
          const article = page.locator(`[data-service="${service.id}"]`);
          await expect(article.getByRole("heading", { level: 3 })).toHaveText(service.title[lang]);
          await expect(article.getByText(service.timeline[lang], { exact: true })).toBeVisible();

          const prices = article.locator("[data-price]");
          const expected = service.tiers
            ? service.tiers.map((tier) => tier.priceId)
            : [service.priceId!];
          await expect(prices).toHaveCount(expected.length);
          for (const [i, id] of expected.entries()) {
            await expect(prices.nth(i)).toHaveAttribute("data-currency", currency);
            await expect(prices.nth(i)).toHaveText(formatPrice(id, currency, lang));
          }

          const includes = service.tiers
            ? service.tiers.flatMap((tier) => tier.includes[lang])
            : service.includes![lang];
          for (const item of includes) {
            await expect(article.getByText(item, { exact: true })).toBeVisible();
          }
          await expect(article.locator("[data-excludes] li")).toHaveText(service.excludes[lang]);

          await expect(
            article.getByRole("link", { name: /Cotizar este servicio|Request a quote/ })
          ).toHaveAttribute("href", `${quote}?service=${service.id}`);
        }
      });

      test(`${url}: "${words.from[lang]}" only on the MVP and "${words.perMonth[lang]}" only on the monthly plans`, async ({
        page,
      }) => {
        await page.goto(url);
        const prices = await page
          .locator("[data-service] [data-price]")
          .evaluateAll((els) =>
            els.map((el) => [el.dataset.price ?? "", el.textContent ?? ""] as const)
          );
        const from = prices.filter(([, text]) => text.startsWith(`${words.from[lang]} `));
        expect(from.map(([id]) => id)).toEqual(["custom-web-app-mvp"]);
        const monthly = prices.filter(([, text]) => text.endsWith(` ${words.perMonth[lang]}`));
        expect(monthly.map(([id]) => id)).toEqual([
          "monthly-support-basic",
          "monthly-support-plus",
          "monthly-seo",
        ]);
        const text = await pageText(page);
        expect(text.match(new RegExp(`\\b${words.from[lang]} (COP|USD)`, "g"))).toHaveLength(1);
      });

      test(`${url}: the MVP note and the kit saving use the ${currency} figures`, async ({
        page,
      }) => {
        await page.goto(url);
        const mvp = page.locator('[data-service="custom-web-app-mvp"]');
        await expect(mvp).toContainText(
          formatMoney(THRESHOLDS.luminawReferral[currency], currency, lang)
        );
        await expect(mvp).toContainText("Lúmina W");
        const kit = page.locator('[data-service="time-saver-kit"]');
        await expect(kit).toContainText(
          `${savingsPercent("time-saver-kit", TIME_SAVER_KIT_PARTS, currency)}%`
        );
      });

      test(`${url}: the general exclusions and the block for technical teams, without a price`, async ({
        page,
      }) => {
        await page.goto(url);
        await expect(page.locator("[data-service-exclusions] li")).toHaveText(
          GENERAL_EXCLUSIONS[lang]
        );
        const technical = page.locator("[data-service-technical]");
        await expect(technical.getByRole("heading", { level: 3 })).toHaveText(
          TECHNICAL_TEAMS_SERVICE.title[lang]
        );
        await expect(technical.locator("[data-price]")).toHaveCount(0);
        await expect(technical.locator("article a[href]").last()).toHaveAttribute("href", quote);
        expect(await technical.textContent()).not.toMatch(/\b(COP|USD)\b/);
      });
    }

    test(`${path}: the structured data lists every price in COP for Colombia and in USD elsewhere`, async ({
      page,
    }) => {
      await page.goto(path);
      const ld = await serviceLd(page);
      expect(ld).toBeDefined();
      expect(ld.serviceType).toEqual(SERVICES.map((service) => service.title[lang]));
      interface Offer {
        name: string;
        priceCurrency: Currency;
        priceSpecification: { price?: number; minPrice?: number; unitCode?: string };
        eligibleRegion?: { identifier: string };
        ineligibleRegion?: { identifier: string };
      }
      const offers = ld.hasOfferCatalog.itemListElement as Offer[];
      expect(offers).toHaveLength(PRICES.length * 2);
      expect(ld.hasOfferCatalog.description).toMatch(/Colombia/);

      const amount = (offer: Offer) =>
        offer.priceSpecification.price ?? offer.priceSpecification.minPrice;
      const cop = offers.filter((offer) => offer.priceCurrency === "COP");
      const usd = offers.filter((offer) => offer.priceCurrency === "USD");
      expect(cop).toHaveLength(PRICES.length);
      expect(usd).toHaveLength(PRICES.length);
      for (const offer of cop) expect(offer.eligibleRegion?.identifier).toBe("CO");
      for (const offer of usd) expect(offer.ineligibleRegion?.identifier).toBe("CO");
      expect(cop.map(amount)).toEqual(PRICES.map((price) => price.amount.COP));
      expect(usd.map(amount)).toEqual(PRICES.map((price) => price.amount.USD));

      const mvp = offers.filter((offer) => /MVP/.test(offer.name));
      expect(mvp.map((offer) => offer.priceSpecification.minPrice)).toEqual([
        priceById("custom-web-app-mvp").amount.COP,
        priceById("custom-web-app-mvp").amount.USD,
      ]);
      const monthly = offers.filter((offer) => offer.priceSpecification.unitCode === "MON");
      expect(monthly).toHaveLength(6);
    });
  }

  test("the services pages and their variants are the only priced pages", () => {
    expect(PRICED_ROUTES).toEqual(expect.arrayContaining(PAGES.map((item) => item.path)));
  });
});

test.describe("retired claims", () => {
  test("no page mentions the pentester mindset or an hourly rate", async ({ page, request }) => {
    const sitemap = await (await request.get("/sitemap-0.xml")).text();
    const paths = [...sitemap.matchAll(/<loc>https:\/\/www\.wavival\.dev([^<]*)<\/loc>/g)].map(
      (match) => match[1]
    );
    expect(paths.length).toBeGreaterThan(10);
    const all = [...paths, ...PRICED_ROUTES.map((route) => `${COP_VARIANT_PREFIX}${route}`)];
    for (const path of all) {
      await page.goto(path);
      const text = await pageText(page);
      expect(text, path).not.toMatch(/mentalidad de pentester|pentester mindset/i);
      expect(text, path).not.toMatch(/por hora|per hour|hourly|\/hora\b|\/h\b/i);
    }
  });
});
