import { test, expect } from "@playwright/test";
import {
  BUDGET_RANGES,
  BUDGET_RANGE_IDS,
  PAYMENT_SCHEDULES,
  PRICES,
  PRICE_IDS,
  SERVICE_IDS,
  THRESHOLDS,
  budgetRangeLabel,
  budgetRangeOptions,
  formatAmount,
  formatPrice,
  paymentScheduleFor,
  priceById,
  priceRangeLd,
  pricesForService,
} from "../src/data/pricing";

// `src/data/pricing.ts` is the only place a price lives. These cases lock the
// published amounts, the ids the quote form and the database will use, and the
// formatting rule (currency code first, thousands separator by page language).

test.describe("pricing catalog", () => {
  test("every price id has one entry and every entry belongs to a known service", () => {
    expect(PRICES.map((price) => price.id).sort()).toEqual([...PRICE_IDS].sort());
    for (const price of PRICES) {
      expect(SERVICE_IDS, price.id).toContain(price.service);
    }
    expect(SERVICE_IDS).toHaveLength(11);
    expect(pricesForService("monthly-support").map((price) => price.id)).toEqual([
      "monthly-support-basic",
      "monthly-support-plus",
    ]);
    for (const service of SERVICE_IDS) {
      expect(pricesForService(service).length, service).toBeGreaterThan(0);
    }
  });

  test("the plan amounts", () => {
    const amounts = Object.fromEntries(PRICES.map((p) => [p.id, [p.amount.COP, p.amount.USD]]));
    expect(amounts).toEqual({
      "landing-page": [2_200_000, 750],
      "business-website": [5_500_000, 1_800],
      "n8n-automation": [1_600_000, 550],
      "ai-chatbot": [4_500_000, 1_500],
      "custom-web-app-mvp": [16_000_000, 5_500],
      "ai-integration": [4_000_000, 1_300],
      "basic-security-review": [2_000_000, 650],
      "monthly-support-basic": [280_000, 90],
      "monthly-support-plus": [650_000, 200],
      "digital-presence-kit": [2_900_000, 950],
      "time-saver-kit": [7_500_000, 2_500],
      "monthly-seo": [1_200_000, 400],
    });
  });

  test("only the MVP is a starting price, three plans are monthly, one is per workflow", () => {
    expect(PRICES.filter((p) => p.from).map((p) => p.id)).toEqual(["custom-web-app-mvp"]);
    expect(PRICES.filter((p) => p.monthly).map((p) => p.id)).toEqual([
      "monthly-support-basic",
      "monthly-support-plus",
      "monthly-seo",
    ]);
    expect(PRICES.filter((p) => p.unit).map((p) => p.id)).toEqual(["n8n-automation"]);
    expect(priceById("monthly-seo").developmentClientsOnly).toBe(true);
    expect(PRICES.filter((p) => p.developmentClientsOnly)).toHaveLength(1);
  });

  test("thresholds: referral to Lúmina W and the payment split", () => {
    expect(THRESHOLDS.luminawReferral).toEqual({ COP: 40_000_000, USD: 12_000 });
    expect(THRESHOLDS.splitPayments).toEqual({ COP: 7_000_000, USD: 2_500 });
    expect(paymentScheduleFor(7_000_000, "COP")).toEqual(PAYMENT_SCHEDULES.standard);
    expect(paymentScheduleFor(7_000_001, "COP")).toEqual(PAYMENT_SCHEDULES.large);
    expect(paymentScheduleFor(2_500, "USD")).toEqual([50, 50]);
    expect(paymentScheduleFor(2_501, "USD")).toEqual([40, 30, 30]);
  });

  test("budget ranges are contiguous, end at the referral threshold and keep the two extra options", () => {
    expect(BUDGET_RANGES.map((range) => range.id)).toEqual([...BUDGET_RANGE_IDS]);
    const priced = BUDGET_RANGES.filter((range) => range.bounds);
    for (const currency of ["COP", "USD"] as const) {
      for (let i = 1; i < priced.length; i++) {
        expect(priced[i].bounds![currency].min).toBe(priced[i - 1].bounds![currency].max);
      }
      expect(priced.at(-1)!.bounds![currency]).toEqual({
        min: THRESHOLDS.luminawReferral[currency],
        max: null,
      });
    }
    expect(priced[0].bounds).toEqual({
      COP: { min: 1_600_000, max: 3_000_000 },
      USD: { min: 550, max: 1_000 },
    });
    expect(BUDGET_RANGES.filter((range) => !range.bounds).map((range) => range.id)).toEqual([
      "monthly-plan-only",
      "undecided",
    ]);
  });
});

test.describe("price formatting", () => {
  test("currency code first, thousands separator by page language", () => {
    expect(formatAmount(2_200_000, "es")).toBe("2.200.000");
    expect(formatAmount(2_200_000, "en")).toBe("2,200,000");
    expect(formatAmount(750, "es")).toBe("750");
    expect(formatPrice("landing-page", "COP", "es")).toBe("COP 2.200.000");
    expect(formatPrice("landing-page", "COP", "en")).toBe("COP 2,200,000");
    expect(formatPrice("landing-page", "USD", "es")).toBe("USD 750");
    expect(formatPrice("business-website", "USD", "en")).toBe("USD 1,800");
    expect(formatPrice("business-website", "USD", "es")).toBe("USD 1.800");
  });

  test("'desde' only on the MVP, 'al mes' on monthly plans, 'por flujo' on n8n", () => {
    expect(formatPrice("custom-web-app-mvp", "COP", "es")).toBe("desde COP 16.000.000");
    expect(formatPrice("custom-web-app-mvp", "USD", "en")).toBe("from USD 5,500");
    expect(formatPrice("monthly-support-basic", "COP", "es")).toBe("COP 280.000 al mes");
    expect(formatPrice("monthly-support-plus", "USD", "en")).toBe("USD 200 per month");
    expect(formatPrice("monthly-seo", "COP", "es")).toBe("COP 1.200.000 al mes");
    expect(formatPrice("n8n-automation", "COP", "es")).toBe("COP 1.600.000 por flujo");
    expect(formatPrice("n8n-automation", "USD", "en")).toBe("USD 550 per workflow");
  });

  test("budget range labels in both currencies and languages", () => {
    expect(budgetRangeLabel("entry", "COP", "es")).toBe("COP 1.600.000 a COP 3.000.000");
    expect(budgetRangeLabel("medium", "COP", "es")).toBe("COP 6.000.000 a COP 16.000.000");
    expect(budgetRangeLabel("above-cap", "COP", "es")).toBe("Más de COP 40.000.000");
    expect(budgetRangeLabel("entry", "USD", "en")).toBe("USD 550 to USD 1,000");
    expect(budgetRangeLabel("large", "USD", "en")).toBe("USD 5,500 to USD 12,000");
    expect(budgetRangeLabel("above-cap", "USD", "en")).toBe("More than USD 12,000");
    expect(budgetRangeLabel("monthly-plan-only", "USD", "es")).toBe("Solo plan mensual");
    expect(budgetRangeLabel("undecided", "COP", "en")).toBe("Not defined yet");
    expect(budgetRangeOptions("USD", "en").map((option) => option.id)).toEqual([
      ...BUDGET_RANGE_IDS,
    ]);
  });

  test("the structured-data price range is fixed text with both lists", () => {
    expect(priceRangeLd("es")).toBe(
      "COP 280.000 a COP 16.000.000 en Colombia; USD 90 a USD 5.500 fuera de Colombia"
    );
    expect(priceRangeLd("en")).toBe(
      "USD 90 to USD 5,500 outside Colombia; COP 280,000 to COP 16,000,000 in Colombia"
    );
  });
});
