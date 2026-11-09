// Frequently asked questions of /servicios and /en/services (and their /cop/ variants).
// One source for both languages: the visible list and the FAQPage structured data read
// the same entries. Answers only state what the site already says elsewhere; the
// monthly support answer is built from the tiers of `src/data/services.ts`.

import type { Lang } from "../i18n/ui";
import { serviceById } from "./services";

export interface FaqEntry {
  id: string;
  question: Record<Lang, string>;
  answer: Record<Lang, string>;
}

const lowerFirst = (text: string) => text.charAt(0).toLocaleLowerCase() + text.slice(1);

const listOf = (items: readonly string[], lang: Lang) => {
  const and = lang === "es" ? " y " : " and ";
  const words = items.map(lowerFirst);
  return words.length > 1
    ? `${words.slice(0, -1).join(", ")}${and}${words.at(-1)}`
    : words.join("");
};

const supportAnswer = (lang: Lang): string => {
  const support = serviceById("monthly-support");
  const [basic, plus] = support.tiers ?? [];
  const excludes = support.excludes?.[lang] ?? [];
  // The first exclusion is a feature; the others are rules written as sentences.
  const [feature = "", ...rest] = excludes;
  if (!basic?.includes || !plus?.includes) return "";
  return lang === "es"
    ? `Hay dos planes. ${basic.name.es}: ${listOf(basic.includes.es, "es")}. ${plus.name.es}: ${listOf(plus.includes.es, "es")}. No incluye ${lowerFirst(feature)}. ${rest.join(". ")}.`
    : `There are two plans. ${basic.name.en}: ${listOf(basic.includes.en, "en")}. ${plus.name.en}: ${listOf(plus.includes.en, "en")}. Not included: ${lowerFirst(feature)}. ${rest.join(". ")}.`;
};

export const SERVICES_FAQ: readonly FaqEntry[] = [
  {
    id: "quote",
    question: { es: "¿Cómo cotizo un proyecto?", en: "How do I get a quote?" },
    answer: {
      es: 'Pulsa "Cotizar este servicio" en el servicio que te interesa o llena el formulario de cotización con tu proyecto. Te respondo en un máximo de 24 horas.',
      en: 'Press "Request a quote" on the service you are interested in or fill in the quote form with your project. I reply within 24 hours at most.',
    },
  },
  {
    id: "contact",
    question: { es: "¿Por qué canales puedo escribirte?", en: "How can I reach you?" },
    answer: {
      es: "Por WhatsApp, agendando una llamada de descubrimiento de 30 minutos en Calendly o con el formulario de cotización.",
      en: "On WhatsApp, by booking a 30-minute discovery call on Calendly or through the quote form.",
    },
  },
  {
    id: "currency",
    question: { es: "¿En qué moneda veo los precios?", en: "Which currency are the prices in?" },
    answer: {
      es: "Los precios se muestran en la moneda que corresponde a tu ubicación.",
      en: "Prices are shown in the currency that corresponds to your location.",
    },
  },
  {
    id: "payment",
    question: { es: "¿Qué medios de pago aceptas?", en: "Which payment methods do you accept?" },
    answer: {
      es: "Bancolombia, Global66 y Bold.",
      en: "Bancolombia, Global66 and Bold.",
    },
  },
  {
    id: "includes",
    question: { es: "¿Qué incluye cada servicio?", en: "What does each service include?" },
    answer: {
      es: "Cada servicio de esta página muestra su precio, su plazo, lo que incluye y lo que no incluye. Están agrupados en desarrollo, complementarios y paquetes con marketing.",
      en: "Every service on this page shows its price, its timeline, what it includes and what it does not. They are grouped into development, complementary and packages with marketing.",
    },
  },
  {
    id: "support",
    question: { es: "¿Cómo funciona el soporte mensual?", en: "How does monthly support work?" },
    answer: { es: supportAnswer("es"), en: supportAnswer("en") },
  },
  {
    id: "marketing",
    question: {
      es: "¿Puedo contratar solo el posicionamiento mensual?",
      en: "Can I hire monthly SEO on its own?",
    },
    answer: {
      es: "El marketing solo se vende dentro de un paquete o a clientes de desarrollo. El posicionamiento mensual es para clientes que ya hicieron un proyecto de desarrollo.",
      en: "Marketing is sold only inside a package or to development clients. Monthly SEO is for clients who already did a development project.",
    },
  },
  {
    id: "design",
    question: { es: "¿Manejas el diseño?", en: "Do you handle design?" },
    answer: {
      es: "Sí, soy diseñadora UX/UI y puedo trabajarlo sin problema. Si llegas con referencias o una dirección visual clara, mejor. Si necesitas el proceso de diseño completo desde cero, lo incluimos en la propuesta.",
      en: "Yes, I am a UX/UI designer and can work on it without issues. If you come with references or a clear visual direction, even better. If you need the full design process from scratch, we include it in the proposal.",
    },
  },
  {
    id: "start",
    question: { es: "¿Qué necesito para empezar?", en: "What do I need to get started?" },
    answer: {
      es: "Tener claro el problema y a quién va dirigido el producto. No necesitas llegar con un PRD (documento de requerimientos de producto: el listado detallado de funciones, flujos y reglas de negocio que define qué debe hacer el software). Eso lo construimos juntos en la propuesta.",
      en: "To be clear on the problem and who the product is for. You do not need to arrive with a PRD (product requirements document: the detailed list of features, flows, and business rules that defines what the software should do). We build that together in the proposal.",
    },
  },
  {
    id: "teams",
    question: {
      es: "¿Trabajas con equipos o solo con founders?",
      en: "Do you work with teams or only founders?",
    },
    answer: {
      es: "Con ambos. Puedo llevar el desarrollo completo como dev única o integrarme a un equipo existente como refuerzo backend, API o seguridad.",
      en: "Both. I can lead the full development as sole dev or join an existing team as backend, API, or security support.",
    },
  },
];

/** The questions and answers of one language, in page order. */
export const servicesFaq = (lang: Lang) =>
  SERVICES_FAQ.map((entry) => ({ id: entry.id, q: entry.question[lang], a: entry.answer[lang] }));

/** FAQPage structured data with exactly the visible questions and answers. */
export const servicesFaqLd = (lang: Lang) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: lang,
  mainEntity: servicesFaq(lang).map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
});
