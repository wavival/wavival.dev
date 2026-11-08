// Closed lists of the quote form, shared by the pages, the form script and
// `api/quote.ts`. The services are the eleven ids of `src/data/pricing.ts`
// (the support plan is one option) plus the backend block for technical teams.
// Free of Astro imports so the Vercel Function can bundle it.

import type { Lang } from "../i18n/ui";
import { SERVICE_IDS, type ServiceId } from "./pricing";
import { SERVICES, TECHNICAL_TEAMS_SERVICE } from "./services";

export const TECHNICAL_QUOTE_SERVICE_ID = "rest-apis-backend";

export const QUOTE_SERVICE_IDS = [...SERVICE_IDS, TECHNICAL_QUOTE_SERVICE_ID] as const;

export type QuoteServiceId = ServiceId | typeof TECHNICAL_QUOTE_SERVICE_ID;

/** Ids of the previous form, still reachable from old links and bookmarks. */
export const LEGACY_QUOTE_SERVICE_IDS: Readonly<Record<string, QuoteServiceId>> = {
  "custom-web-applications": "custom-web-app-mvp",
  "ai-integrations": "ai-integration",
  "security-appsec": "basic-security-review",
};

export const isQuoteServiceId = (value: string): value is QuoteServiceId =>
  (QUOTE_SERVICE_IDS as readonly string[]).includes(value);

/** Current id for a submitted value, or `null` when it is not a known service. */
export const normalizeQuoteService = (value: string): QuoteServiceId | null => {
  const mapped = LEGACY_QUOTE_SERVICE_IDS[value] ?? value;
  return isQuoteServiceId(mapped) ? mapped : null;
};

/** The catalog title of a service, the same text `/servicios` shows. */
export const quoteServiceLabel = (id: QuoteServiceId, lang: Lang): string =>
  id === TECHNICAL_QUOTE_SERVICE_ID
    ? TECHNICAL_TEAMS_SERVICE.title[lang]
    : SERVICES.find((service) => service.id === id)!.title[lang];

export const quoteServiceOptions = (lang: Lang) =>
  QUOTE_SERVICE_IDS.map((id) => ({ id, label: quoteServiceLabel(id, lang) }));

export const HOW_FOUND_IDS = [
  "tiktok",
  "instagram",
  "linkedin",
  "google",
  "referral",
  "other",
] as const;
export type HowFoundId = (typeof HOW_FOUND_IDS)[number];

export const PREFERRED_CHANNEL_IDS = ["whatsapp", "email"] as const;
export type PreferredChannelId = (typeof PREFERRED_CHANNEL_IDS)[number];

export const TIMELINE_IDS = ["this-month", "one-to-three-months", "no-date"] as const;
export type TimelineId = (typeof TIMELINE_IDS)[number];

const optionLabels = {
  howFound: {
    tiktok: { es: "TikTok", en: "TikTok" },
    instagram: { es: "Instagram", en: "Instagram" },
    linkedin: { es: "LinkedIn", en: "LinkedIn" },
    google: { es: "Google", en: "Google" },
    referral: { es: "Recomendación", en: "Referral" },
    other: { es: "Otro", en: "Other" },
  },
  preferredChannel: {
    whatsapp: { es: "WhatsApp", en: "WhatsApp" },
    email: { es: "Correo", en: "Email" },
  },
  timeline: {
    "this-month": { es: "Este mes", en: "This month" },
    "one-to-three-months": { es: "En 1 a 3 meses", en: "In 1 to 3 months" },
    "no-date": { es: "Sin fecha definida", en: "No date yet" },
  },
} satisfies {
  howFound: Record<HowFoundId, Record<Lang, string>>;
  preferredChannel: Record<PreferredChannelId, Record<Lang, string>>;
  timeline: Record<TimelineId, Record<Lang, string>>;
};

export const howFoundLabel = (id: HowFoundId, lang: Lang) => optionLabels.howFound[id][lang];
export const preferredChannelLabel = (id: PreferredChannelId, lang: Lang) =>
  optionLabels.preferredChannel[id][lang];
export const timelineLabel = (id: TimelineId, lang: Lang) => optionLabels.timeline[id][lang];

export const howFoundOptions = (lang: Lang) =>
  HOW_FOUND_IDS.map((id) => ({ id, label: optionLabels.howFound[id][lang] }));

export const preferredChannelOptions = (lang: Lang) =>
  PREFERRED_CHANNEL_IDS.map((id) => ({ id, label: optionLabels.preferredChannel[id][lang] }));

export const timelineOptions = (lang: Lang) =>
  TIMELINE_IDS.map((id) => ({ id, label: optionLabels.timeline[id][lang] }));

/** Public paths the form lives on; the `source` a submission reports must start with one. */
export const QUOTE_SOURCE_PREFIXES = ["/cotizar", "/en/quote", "/cop/cotizar", "/cop/en/quote"];

export const isQuoteSource = (value: string): boolean =>
  QUOTE_SOURCE_PREFIXES.some(
    (prefix) =>
      value === prefix ||
      value.startsWith(`${prefix}/`) ||
      value.startsWith(`${prefix}?`) ||
      value.startsWith(`${prefix}#`)
  );

/**
 * Services preselected for projects no catalog `examples` entry names: company
 * sites quote as a business website and the security writeup as a review.
 */
export const ASSIGNED_QUOTE_SERVICES: Record<string, QuoteServiceId[]> = {
  "lumina-w": ["business-website"],
  "wavival-dev": ["business-website"],
  "forgotten-portal": ["basic-security-review"],
};

/**
 * Services a project is an example of in the catalog (`examples` of
 * `src/data/services.ts` and of the technical-teams block), or its explicit
 * assignment when no service lists it. Empty for anything else.
 */
export const quoteServicesForProject = (slug: string): QuoteServiceId[] => {
  const fromCatalog: QuoteServiceId[] = [
    ...SERVICES.filter((service) => service.examples?.some((example) => example.slug === slug)).map(
      (service) => service.id
    ),
    ...(TECHNICAL_TEAMS_SERVICE.examples.some((example) => example.slug === slug)
      ? [TECHNICAL_QUOTE_SERVICE_ID as QuoteServiceId]
      : []),
  ];
  return fromCatalog.length > 0 ? fromCatalog : (ASSIGNED_QUOTE_SERVICES[slug] ?? []);
};

/** Quote page link with one `service` parameter per related service. */
export const quoteHrefForProject = (quoteRoute: string, slug: string): string => {
  const query = quoteServicesForProject(slug)
    .map((id) => `service=${id}`)
    .join("&");
  return query ? `${quoteRoute}?${query}` : quoteRoute;
};
