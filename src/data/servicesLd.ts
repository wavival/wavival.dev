// Structured data of the services page. It is the same for every visitor, so
// each price appears twice: one Offer in COP for Colombia and one in USD for
// everyone else, with the region each one applies to.

import type { Lang } from "../i18n/ui";
import { CURRENCIES, type Currency } from "../utils/currency";
import { priceById, priceRangeLd, type Price } from "./pricing";
import { SERVICES, fillServiceText, type Service } from "./services";

const COLOMBIA = { "@type": "Country", name: "Colombia", identifier: "CO" } as const;

const words = {
  catalog: { es: "Servicios de wavival", en: "wavival services" },
  policy: {
    es: "Precios fijos por servicio. Se cobra según la ubicación del visitante: en COP a visitantes en Colombia y en USD al resto. Las dos listas son independientes, sin tasa de cambio.",
    en: "Fixed prices per service. Charged by the visitor's location: in COP for visitors in Colombia and in USD for everyone else. The two lists are independent, with no exchange rate.",
  },
  from: { es: "Precio desde", en: "Starting price" },
  workflow: { es: "flujo", en: "workflow" },
} satisfies Record<string, Record<Lang, string>>;

const priceSpecification = (price: Price, currency: Currency, lang: Lang) => {
  const amount = price.amount[currency];
  if (price.from) {
    return {
      "@type": "PriceSpecification",
      minPrice: amount,
      priceCurrency: currency,
      description: words.from[lang],
    };
  }
  const spec: Record<string, unknown> = {
    "@type": "UnitPriceSpecification",
    price: amount,
    priceCurrency: currency,
  };
  if (price.monthly) spec.unitCode = "MON";
  if (price.unit === "workflow")
    spec.referenceQuantity = {
      "@type": "QuantitativeValue",
      value: 1,
      unitText: words.workflow[lang],
    };
  return spec;
};

const offer = (service: Service, price: Price, name: string, currency: Currency, lang: Lang) => {
  const description = [service.body[lang], service.note?.[lang]]
    .filter((text): text is string => Boolean(text))
    .map((text) => fillServiceText(text, currency, lang))
    .join(" ");
  const region = currency === "COP" ? { eligibleRegion: COLOMBIA } : { ineligibleRegion: COLOMBIA };
  return {
    "@type": "Offer",
    name,
    itemOffered: { "@type": "Service", name: service.title[lang], description },
    priceCurrency: currency,
    priceSpecification: priceSpecification(price, currency, lang),
    ...region,
  };
};

/** One Offer per price and currency, in catalog order. */
export function serviceOffersLd(lang: Lang) {
  return SERVICES.flatMap((service) => {
    const entries = service.tiers
      ? service.tiers.map((tier) => ({
          price: priceById(tier.priceId),
          name: `${service.title[lang]}: ${tier.name[lang]}`,
        }))
      : [{ price: priceById(service.priceId!), name: service.title[lang] }];
    return entries.flatMap(({ price, name }) =>
      CURRENCIES.map((currency) => offer(service, price, name, currency, lang))
    );
  });
}

interface ServiceLdInput {
  lang: Lang;
  site: string;
  /** Public URL of the page, with trailing slash. */
  url: string;
  name: string;
  description: string;
}

export function servicesLd({ lang, site, url, name, description }: ServiceLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    provider: { "@id": `${site}/#person` },
    areaServed: "Worldwide",
    serviceType: SERVICES.map((service) => service.title[lang]),
    priceRange: priceRangeLd(lang),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: words.catalog[lang],
      description: words.policy[lang],
      itemListElement: serviceOffersLd(lang),
    },
  };
}
