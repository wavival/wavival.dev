// Single source of every price the site publishes (plan "wavival: avatar,
// servicios y precios 2026"). Pages and the quote function read from here;
// no amount lives anywhere else. The COP and USD lists are independent: there
// is no exchange rate, and both are reviewed every January.

import type { Lang } from "../i18n/ui";
import type { Currency } from "../utils/currency";

export type Money = Record<Currency, number>;

export const SERVICE_IDS = [
  "landing-page",
  "business-website",
  "n8n-automation",
  "ai-chatbot",
  "custom-web-app-mvp",
  "ai-integration",
  "basic-security-review",
  "monthly-support",
  "digital-presence-kit",
  "time-saver-kit",
  "monthly-seo",
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

export const PRICE_IDS = [
  "landing-page",
  "business-website",
  "n8n-automation",
  "ai-chatbot",
  "custom-web-app-mvp",
  "ai-integration",
  "basic-security-review",
  "monthly-support-basic",
  "monthly-support-plus",
  "digital-presence-kit",
  "time-saver-kit",
  "monthly-seo",
] as const;

export type PriceId = (typeof PRICE_IDS)[number];

export interface Price {
  id: PriceId;
  service: ServiceId;
  amount: Money;
  /** The amount is a starting point ("desde"). Only the MVP. */
  from?: true;
  /** Recurring monthly plan. */
  monthly?: true;
  /** Billed per unit. */
  unit?: "workflow";
  /** Sold only to clients who also hire development. */
  developmentClientsOnly?: true;
}

export const PRICES: readonly Price[] = [
  { id: "landing-page", service: "landing-page", amount: { COP: 2_200_000, USD: 750 } },
  { id: "business-website", service: "business-website", amount: { COP: 5_500_000, USD: 1_800 } },
  {
    id: "n8n-automation",
    service: "n8n-automation",
    amount: { COP: 1_600_000, USD: 550 },
    unit: "workflow",
  },
  { id: "ai-chatbot", service: "ai-chatbot", amount: { COP: 4_500_000, USD: 1_500 } },
  {
    id: "custom-web-app-mvp",
    service: "custom-web-app-mvp",
    amount: { COP: 16_000_000, USD: 5_500 },
    from: true,
  },
  { id: "ai-integration", service: "ai-integration", amount: { COP: 4_000_000, USD: 1_300 } },
  {
    id: "basic-security-review",
    service: "basic-security-review",
    amount: { COP: 2_000_000, USD: 650 },
  },
  {
    id: "monthly-support-basic",
    service: "monthly-support",
    amount: { COP: 280_000, USD: 90 },
    monthly: true,
  },
  {
    id: "monthly-support-plus",
    service: "monthly-support",
    amount: { COP: 650_000, USD: 200 },
    monthly: true,
  },
  {
    id: "digital-presence-kit",
    service: "digital-presence-kit",
    amount: { COP: 2_900_000, USD: 950 },
  },
  { id: "time-saver-kit", service: "time-saver-kit", amount: { COP: 7_500_000, USD: 2_500 } },
  {
    id: "monthly-seo",
    service: "monthly-seo",
    amount: { COP: 1_200_000, USD: 400 },
    monthly: true,
    developmentClientsOnly: true,
  },
];

const priceIndex: Record<PriceId, Price> = Object.fromEntries(
  PRICES.map((price) => [price.id, price])
) as Record<PriceId, Price>;

export const priceById = (id: PriceId): Price => priceIndex[id];

export const pricesForService = (service: ServiceId): Price[] =>
  PRICES.filter((price) => price.service === service);

/** What the Time Saver Kit bundles, one entry per unit (two n8n workflows). */
export const TIME_SAVER_KIT_PARTS: readonly PriceId[] = [
  "landing-page",
  "n8n-automation",
  "n8n-automation",
  "ai-chatbot",
  "monthly-support-plus",
];

/** Rounded percentage a bundle saves against its parts bought one by one, in a given currency. */
export function savingsPercent(
  bundle: PriceId,
  parts: readonly PriceId[],
  currency: Currency
): number {
  const separate = parts.reduce((sum, id) => sum + priceById(id).amount[currency], 0);
  return Math.round((1 - priceById(bundle).amount[currency] / separate) * 100);
}

export const THRESHOLDS = {
  /** Above this amount the project is referred to Lúmina W. */
  luminawReferral: { COP: 40_000_000, USD: 12_000 },
  /** Above this amount payments split 40/30/30; at or below, 50/50. */
  splitPayments: { COP: 7_000_000, USD: 2_500 },
} satisfies Record<string, Money>;

export const PAYMENT_SCHEDULES = {
  standard: [50, 50],
  large: [40, 30, 30],
} as const;

export type PaymentSchedule = (typeof PAYMENT_SCHEDULES)[keyof typeof PAYMENT_SCHEDULES];

export const paymentScheduleFor = (amount: number, currency: Currency): PaymentSchedule =>
  amount > THRESHOLDS.splitPayments[currency]
    ? PAYMENT_SCHEDULES.large
    : PAYMENT_SCHEDULES.standard;

export const BUDGET_RANGE_IDS = [
  "entry",
  "small",
  "medium",
  "large",
  "above-cap",
  "monthly-plan-only",
  "undecided",
] as const;

export type BudgetRangeId = (typeof BUDGET_RANGE_IDS)[number];

/** Lower and upper bound of a range; `max` is null for the open-ended one. */
export interface BudgetBounds {
  min: number;
  max: number | null;
}

export interface BudgetRange {
  id: BudgetRangeId;
  /** Absent on the two options that are not an amount. */
  bounds?: Record<Currency, BudgetBounds>;
}

export const BUDGET_RANGES: readonly BudgetRange[] = [
  {
    id: "entry",
    bounds: { COP: { min: 1_600_000, max: 3_000_000 }, USD: { min: 550, max: 1_000 } },
  },
  {
    id: "small",
    bounds: { COP: { min: 3_000_000, max: 6_000_000 }, USD: { min: 1_000, max: 2_000 } },
  },
  {
    id: "medium",
    bounds: { COP: { min: 6_000_000, max: 16_000_000 }, USD: { min: 2_000, max: 5_500 } },
  },
  {
    id: "large",
    bounds: { COP: { min: 16_000_000, max: 40_000_000 }, USD: { min: 5_500, max: 12_000 } },
  },
  {
    id: "above-cap",
    bounds: { COP: { min: 40_000_000, max: null }, USD: { min: 12_000, max: null } },
  },
  { id: "monthly-plan-only" },
  { id: "undecided" },
];

const words = {
  from: { es: "desde", en: "from" },
  perMonth: { es: "al mes", en: "per month" },
  perWorkflow: { es: "por flujo", en: "per workflow" },
  to: { es: "a", en: "to" },
  moreThan: { es: "Más de", en: "More than" },
  monthlyPlanOnly: { es: "Solo plan mensual", en: "Monthly plan only" },
  undecided: { es: "Aún no lo tengo definido", en: "Not defined yet" },
  inColombia: { es: "en Colombia", en: "in Colombia" },
  outsideColombia: { es: "fuera de Colombia", en: "outside Colombia" },
} satisfies Record<string, Record<Lang, string>>;

/** Thousands separator follows the page language: 2.200.000 in Spanish, 2,200,000 in English. */
export const formatAmount = (value: number, lang: Lang): string =>
  String(value).replace(/\B(?=(\d{3})+(?!\d))/g, lang === "en" ? "," : ".");

/** Currency code first: "COP 2.200.000", "USD 750". */
export const formatMoney = (value: number, currency: Currency, lang: Lang): string =>
  `${currency} ${formatAmount(value, lang)}`;

/** The published form of a price: "desde COP 16.000.000", "USD 90 per month", "COP 1.600.000 por flujo". */
export function formatPrice(id: PriceId, currency: Currency, lang: Lang): string {
  const price = priceById(id);
  const parts = [formatMoney(price.amount[currency], currency, lang)];
  if (price.from) parts.unshift(words.from[lang]);
  if (price.monthly) parts.push(words.perMonth[lang]);
  if (price.unit === "workflow") parts.push(words.perWorkflow[lang]);
  return parts.join(" ");
}

export function budgetRangeLabel(id: BudgetRangeId, currency: Currency, lang: Lang): string {
  if (id === "monthly-plan-only") return words.monthlyPlanOnly[lang];
  if (id === "undecided") return words.undecided[lang];
  const range = BUDGET_RANGES.find((item) => item.id === id);
  const bounds = range?.bounds?.[currency];
  if (!bounds) return id;
  if (bounds.max === null)
    return `${words.moreThan[lang]} ${formatMoney(bounds.min, currency, lang)}`;
  return `${formatMoney(bounds.min, currency, lang)} ${words.to[lang]} ${formatMoney(bounds.max, currency, lang)}`;
}

export const budgetRangeOptions = (currency: Currency, lang: Lang) =>
  BUDGET_RANGES.map(({ id }) => ({ id, label: budgetRangeLabel(id, currency, lang) }));

const amounts = (currency: Currency) => PRICES.map((price) => price.amount[currency]);

/**
 * Fixed text for the `priceRange` of the services JSON-LD. Structured data does
 * not change per visitor, so it carries both lists and says which one applies.
 */
export function priceRangeLd(lang: Lang): string {
  const span = (currency: Currency) =>
    `${formatMoney(Math.min(...amounts(currency)), currency, lang)} ${words.to[lang]} ${formatMoney(Math.max(...amounts(currency)), currency, lang)}`;
  const cop = `${span("COP")} ${words.inColombia[lang]}`;
  const usd = `${span("USD")} ${words.outsideColombia[lang]}`;
  return lang === "en" ? `${usd}; ${cop}` : `${cop}; ${usd}`;
}
