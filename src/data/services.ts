// The services catalog: copy in both languages for the thirteen services, the
// three groups they belong to (development, digital marketing, complementary),
// the general exclusions and the block for technical teams. Amounts never live
// here: every price is a `PriceId` resolved through `src/data/pricing.ts` in the
// visitor's currency.

import type { Lang } from "../i18n/ui.js";
import type { Currency } from "../utils/currency.js";
import {
  THRESHOLDS,
  TIME_SAVER_KIT_PARTS,
  formatMoney,
  savingsPercent,
  type PriceId,
  type ServiceId,
} from "./pricing.js";

export type Localized = Record<Lang, string>;
export type LocalizedList = Record<Lang, string[]>;

export const SERVICE_GROUP_IDS = ["development", "marketing", "complementary"] as const;

export type ServiceGroupId = (typeof SERVICE_GROUP_IDS)[number];

export interface ServiceGroup {
  id: ServiceGroupId;
  title: Localized;
}

export interface ServiceExample {
  /** Project slug; the page resolves the localized URL. */
  slug: string;
  /** Project part the link opens (`#app`, `#landing`), omitted for single-part projects. */
  part?: string;
  name: string;
  description: Localized;
}

export interface ServiceTier {
  priceId: PriceId;
  name: Localized;
  includes: LocalizedList;
}

export interface Service {
  id: ServiceId;
  group: ServiceGroupId;
  title: Localized;
  body: Localized;
  timeline: Localized;
  /** One price, or none when the service is sold in tiers or quoted per scope. */
  priceId?: PriceId;
  /** No published price: the price row reads "Cotización personalizada" (the launch strategy). */
  customQuote?: true;
  /** Plans with their own price and inclusions (the support plan). */
  tiers?: ServiceTier[];
  includes?: LocalizedList;
  excludes: LocalizedList;
  /**
   * Visible note. `{threshold}` and `{savings}` are filled in the visitor's
   * currency by the catalog component.
   */
  note?: Localized;
  /** Short badge next to the index ("Solo clientes de desarrollo", "Recomendado para empezar"). */
  badge?: Localized;
  examples?: ServiceExample[];
}

export const SERVICE_GROUPS: readonly ServiceGroup[] = [
  { id: "development", title: { es: "Desarrollo de software", en: "Software development" } },
  { id: "marketing", title: { es: "Marketing digital", en: "Digital marketing" } },
  { id: "complementary", title: { es: "Complementarios", en: "Complementary" } },
];

export const SERVICES: readonly Service[] = [
  {
    id: "landing-page",
    group: "development",
    title: { es: "Landing page de conversión", en: "Conversion landing page" },
    body: {
      es: "Una página a medida que convierte visitas en contactos, con medición desde el primer día.",
      en: "A custom page that turns visits into leads, measured from day one.",
    },
    timeline: { es: "2 semanas", en: "2 weeks" },
    priceId: "landing-page",
    includes: {
      es: [
        "Diseño a medida de una página con hasta 6 secciones, responsive",
        "Ajuste de textos con el cliente",
        "Formulario o botón de WhatsApp",
        "SEO técnico, Google Analytics y píxel de Meta",
        "Despliegue",
        "2 rondas de ajustes y 30 días de garantía",
      ],
      en: [
        "Custom design of one page with up to 6 sections, responsive",
        "Copy adjustments with the client",
        "Form or WhatsApp button",
        "Technical SEO, Google Analytics and Meta pixel",
        "Deployment",
        "2 rounds of revisions and a 30-day warranty",
      ],
    },
    excludes: {
      es: ["Más páginas", "Blog", "Pagos en línea"],
      en: ["More pages", "Blog", "Online payments"],
    },
    examples: [
      {
        slug: "terracore",
        part: "landing",
        name: "TerraCore",
        description: {
          es: "landing estática que lleva del problema a la demo",
          en: "static landing that takes the visitor from the pain to the demo",
        },
      },
      {
        slug: "okroot",
        part: "landing",
        name: "OKroot",
        description: {
          es: "landing con lista de espera de early access",
          en: "landing with an early-access waitlist",
        },
      },
    ],
  },
  {
    id: "business-website",
    group: "development",
    title: { es: "Sitio web para negocio", en: "Business website" },
    body: {
      es: "Hasta 6 páginas que presentan el negocio, cargan rápido y reciben contactos.",
      en: "Up to 6 pages that present the business, load fast and receive leads.",
    },
    timeline: { es: "4 semanas", en: "4 weeks" },
    priceId: "business-website",
    includes: {
      es: [
        "Hasta 6 páginas",
        "SEO técnico y Core Web Vitals",
        "Formularios y WhatsApp",
        "Analítica",
        "1 hora de capacitación",
        "2 rondas de ajustes y 30 días de garantía",
      ],
      en: [
        "Up to 6 pages",
        "Technical SEO and Core Web Vitals",
        "Forms and WhatsApp",
        "Analytics",
        "1 hour of training",
        "2 rounds of revisions and a 30-day warranty",
      ],
    },
    excludes: {
      es: ["Tienda online", "Pasarela de pagos", "Varios idiomas"],
      en: ["Online store", "Payment gateway", "Multiple languages"],
    },
  },
  {
    id: "n8n-automation",
    group: "development",
    title: { es: "Automatización con n8n", en: "Automation with n8n" },
    body: {
      es: "Un flujo que conecta las herramientas que ya usas y te quita trabajo repetitivo.",
      en: "One workflow that connects the tools you already use and removes repetitive work.",
    },
    timeline: { es: "1 semana", en: "1 week" },
    priceId: "n8n-automation",
    includes: {
      es: [
        "Diagnóstico del proceso",
        "Un flujo con hasta 3 herramientas conectadas (por ejemplo WhatsApp, Gmail, Sheets o un CRM)",
        "Manejo de errores con alertas",
        "Documentación corta",
        "30 días de garantía",
      ],
      en: [
        "Process diagnosis",
        "One workflow with up to 3 connected tools (for example WhatsApp, Gmail, Sheets or a CRM)",
        "Error handling with alerts",
        "Short documentation",
        "30-day warranty",
      ],
    },
    excludes: {
      es: ["Servidor o plan de n8n", "Cambios del proceso después de la entrega"],
      en: ["n8n server or plan", "Process changes after delivery"],
    },
  },
  {
    id: "ai-chatbot",
    group: "development",
    title: { es: "Chatbot con IA", en: "AI chatbot" },
    body: {
      es: "Un asistente que responde con la información de tu negocio y pasa el caso a una persona cuando hace falta.",
      en: "An assistant that answers with your business information and hands over to a person when needed.",
    },
    timeline: { es: "2 a 3 semanas", en: "2 to 3 weeks" },
    priceId: "ai-chatbot",
    includes: {
      es: [
        "Un canal: web o WhatsApp",
        "Base de conocimiento con la información del negocio",
        "Captura de datos del cliente",
        "Paso a una persona",
        "Registro de conversaciones",
        "Pruebas y 30 días de garantía",
      ],
      en: [
        "One channel: web or WhatsApp",
        "Knowledge base with the business information",
        "Customer data capture",
        "Handover to a person",
        "Conversation log",
        "Testing and a 30-day warranty",
      ],
    },
    excludes: {
      es: [
        "Canales adicionales",
        "Número de WhatsApp",
        "Operación mensual: para eso se recomienda el plan de soporte",
      ],
      en: [
        "Additional channels",
        "WhatsApp number",
        "Ongoing monthly operation (the support plan is recommended)",
      ],
    },
  },
  {
    id: "custom-web-app-mvp",
    group: "development",
    title: { es: "App web o PWA a medida (MVP)", en: "Custom web app or PWA (MVP)" },
    body: {
      es: "Producto completo de extremo a extremo, en producción. Para emprendedores que necesitan algo real, no un demo.",
      en: "A complete product end to end, in production. For entrepreneurs who need something real, not a demo.",
    },
    timeline: { es: "6 a 10 semanas", en: "6 to 10 weeks" },
    priceId: "custom-web-app-mvp",
    includes: {
      es: [
        "Definición del alcance",
        "Diseño UX/UI",
        "Backend y frontend",
        "Autenticación y roles",
        "Panel administrativo básico",
        "Seguridad base según OWASP",
        "Despliegue y documentación",
        "30 días de garantía",
      ],
      en: [
        "Scope definition",
        "UX/UI design",
        "Backend and frontend",
        "Authentication and roles",
        "Basic admin panel",
        "Baseline security following OWASP",
        "Deployment and documentation",
        "30-day warranty",
      ],
    },
    excludes: {
      es: [
        "Apps nativas en tiendas",
        "Integraciones fuera del alcance acordado",
        "Soporte posterior",
      ],
      en: [
        "Native apps for the app stores",
        "Integrations outside the agreed scope",
        "Support after delivery",
      ],
    },
    note: {
      es: "Si el proyecto supera {threshold} o necesita equipo, pasa a Lúmina\u00a0W.",
      en: "If the project exceeds {threshold} or needs a team, it moves to Lúmina\u00a0W.",
    },
    examples: [
      {
        slug: "terracore",
        part: "app",
        name: "TerraCore",
        description: {
          es: "plataforma agropecuaria multitenancy",
          en: "multi-tenant agri-industrial platform",
        },
      },
      {
        slug: "okroot",
        part: "app",
        name: "OKroot",
        description: {
          es: "PWA de salud alimentaria offline-first",
          en: "offline-first food health PWA",
        },
      },
    ],
  },
  {
    id: "ai-integration",
    group: "development",
    title: {
      es: "Integración de IA en un sistema existente",
      en: "AI integration in an existing system",
    },
    body: {
      es: "IA donde aporta valor dentro de lo que ya tienes: un caso de uso, con los costos bajo control.",
      en: "AI where it adds value inside what you already have: one use case, with costs under control.",
    },
    timeline: { es: "2 a 3 semanas", en: "2 to 3 weeks" },
    priceId: "ai-integration",
    includes: {
      es: [
        "Análisis del sistema",
        "Un caso de uso",
        "Integración por API",
        "Prompts y validaciones",
        "Control de costos de uso",
        "Pruebas y 30 días de garantía",
      ],
      en: [
        "System analysis",
        "One use case",
        "API integration",
        "Prompts and validations",
        "Usage cost control",
        "Testing and a 30-day warranty",
      ],
    },
    excludes: {
      es: ["Refactorizar el sistema existente", "Otros casos de uso"],
      en: ["Refactoring the existing system", "Other use cases"],
    },
    examples: [
      {
        slug: "okroot",
        part: "app",
        name: "OKroot",
        description: {
          es: "scanner de etiquetas con Claude API",
          en: "label scanner with Claude API",
        },
      },
      {
        slug: "nullbreach",
        part: "app",
        name: "NullBreach",
        description: {
          es: "análisis OWASP y chat de seguridad con historial por usuario",
          en: "OWASP analysis and security chat with per-user history",
        },
      },
    ],
  },
  {
    id: "digital-offer-strategy",
    group: "marketing",
    title: { es: "Estrategia de oferta digital", en: "Digital offer strategy" },
    body: {
      es: "De tu conocimiento a una propuesta educativa clara y atractiva.",
      en: "From your knowledge to a clear and compelling educational offer.",
    },
    timeline: { es: "2 a 3 semanas", en: "2 to 3 weeks" },
    priceId: "digital-offer-strategy",
    badge: { es: "Recomendado para empezar", en: "Recommended to start" },
    includes: {
      es: [
        "Diagnóstico del creador, su audiencia y su posicionamiento",
        "Investigación de necesidades, deseos y objeciones del público",
        "Definición del cliente ideal y la transformación propuesta",
        "Diseño de la oferta: formato, contenidos, entregables y propuesta de valor",
        "Recomendaciones de precio, bonos y diferenciación",
        "Documento estratégico y sesión de presentación",
      ],
      en: [
        "Diagnosis of the creator, their audience and their positioning",
        "Research into the audience's needs, desires and objections",
        "Definition of the ideal client and the promised transformation",
        "Offer design: format, content, deliverables and value proposition",
        "Pricing, bonus and differentiation recommendations",
        "Strategy document and presentation session",
      ],
    },
    excludes: {
      es: ["Producción del curso", "Campañas publicitarias", "Ejecución de un lanzamiento"],
      en: ["Course production", "Ad campaigns", "Running a launch"],
    },
  },
  {
    id: "digital-launch-strategy",
    group: "marketing",
    title: {
      es: "Estrategia y acompañamiento de lanzamientos digitales",
      en: "Digital launch strategy and support",
    },
    body: {
      es: "Diseñamos el camino para presentar y comercializar tu producto educativo.",
      en: "We design the path to present and sell your educational product.",
    },
    timeline: {
      es: "3 a 5 semanas para la planificación, según complejidad",
      en: "3 to 5 weeks for planning, depending on complexity",
    },
    customQuote: true,
    includes: {
      es: [
        "Diagnóstico de la oferta y su audiencia",
        "Definición de objetivos e indicadores del lanzamiento",
        "Diseño del recorrido del cliente y del embudo de conversión",
        "Narrativa central, mensajes clave y tratamiento de objeciones",
        "Plan de contenido para precalentamiento, lanzamiento y cierre",
        "Estructura estratégica de webinar, clase gratuita o evento de venta, cuando corresponda",
        "Calendario de ejecución y plan de seguimiento",
        "Recomendaciones de automatización y herramientas digitales",
      ],
      en: [
        "Diagnosis of the offer and its audience",
        "Launch goals and indicators",
        "Customer journey and conversion funnel design",
        "Core narrative, key messages and objection handling",
        "Content plan for the warm-up, the launch and the close",
        "Strategic structure of a webinar, free class or sales event, when it applies",
        "Execution calendar and follow-up plan",
        "Automation and digital tools recommendations",
      ],
    },
    excludes: {
      es: [
        "Pauta publicitaria",
        "Producción audiovisual",
        "Community management",
        "Implementación técnica completa",
      ],
      en: [
        "Paid ads",
        "Audiovisual production",
        "Community management",
        "Full technical implementation",
      ],
    },
    note: {
      es: "Incluye la planificación estratégica y, si se acuerda, acompañamiento durante la ejecución del mismo lanzamiento. El alcance y el precio se definen en la cotización.",
      en: "It includes the strategic planning and, if agreed, support during the execution of the launch itself. Scope and price are set in the quote.",
    },
  },
  {
    id: "digital-presence-kit",
    group: "marketing",
    title: { es: "Kit Presencia Digital", en: "Digital Presence Kit" },
    body: {
      es: "La landing más lo mínimo para que te encuentren en Google y en redes.",
      en: "The landing page plus the essentials to get found on Google and social media.",
    },
    timeline: { es: "2 a 3 semanas", en: "2 to 3 weeks" },
    priceId: "digital-presence-kit",
    includes: {
      es: [
        "La landing page de conversión (servicio 1)",
        "Perfil de Google Business",
        "SEO local básico",
        "Optimización de la bio y los destacados de Instagram y Facebook",
        "Guía de publicación de una página",
      ],
      en: [
        "The conversion landing page (service 1)",
        "Google Business profile",
        "Basic local SEO",
        "Instagram and Facebook bio and highlights optimization",
        "One-page publishing guide",
      ],
    },
    excludes: {
      es: ["Manejo de redes", "Creación de contenido", "Pauta"],
      en: ["Social media management", "Content creation", "Paid ads"],
    },
  },
  {
    id: "time-saver-kit",
    group: "marketing",
    title: { es: "Kit Ahorra Tiempo", en: "Time Saver Kit" },
    body: {
      es: "Landing, automatizaciones y chatbot en un solo paquete, alrededor de {savings}% más barato que contratar cada servicio por separado.",
      en: "Landing page, automations and chatbot in one package, about {savings}% cheaper than hiring each service separately.",
    },
    timeline: { es: "4 semanas", en: "4 weeks" },
    priceId: "time-saver-kit",
    includes: {
      es: [
        "Landing page de conversión",
        "2 automatizaciones con n8n",
        "Chatbot con IA (servicio 4)",
        "Primer mes del plan de soporte Plus",
      ],
      en: [
        "Conversion landing page",
        "2 automations with n8n",
        "AI chatbot (service 4)",
        "First month of the Plus support plan",
      ],
    },
    excludes: {
      es: ["Lo mismo que cada servicio por separado"],
      en: ["The same exclusions as each individual service"],
    },
  },
  {
    id: "monthly-seo",
    group: "marketing",
    title: { es: "Posicionamiento mensual", en: "Monthly SEO" },
    body: {
      es: "Para que el sitio que construimos siga ganando visibilidad mes a mes.",
      en: "So the site we build keeps gaining visibility month after month.",
    },
    timeline: { es: "Mensual", en: "Monthly" },
    priceId: "monthly-seo",
    badge: { es: "Solo clientes de desarrollo", en: "Development clients only" },
    includes: {
      es: [
        "SEO on-page mensual",
        "Un artículo de blog",
        "Actualización del perfil de Google Business",
        "Informe de resultados",
      ],
      en: [
        "Monthly on-page SEO",
        "One blog article",
        "Google Business profile update",
        "Results report",
      ],
    },
    excludes: {
      es: ["Manejo diario de redes", "Pauta", "Producción audiovisual"],
      en: ["Daily social media management", "Paid ads", "Audiovisual production"],
    },
  },
  {
    id: "basic-security-review",
    group: "complementary",
    title: { es: "Revisión de seguridad básica", en: "Basic security review" },
    body: {
      es: "Reviso una app pequeña con criterio OWASP Top 10 y te explico los hallazgos en orden de prioridad.",
      en: "I review a small app against the OWASP Top 10 and walk you through the findings by priority.",
    },
    timeline: { es: "1 semana", en: "1 week" },
    priceId: "basic-security-review",
    includes: {
      es: [
        "Revisión según OWASP Top 10 de una app pequeña: autenticación, manejo de secretos, cabeceras, dependencias y validación de datos",
        "Informe con hallazgos priorizados",
        "Sesión para explicarlo",
      ],
      en: [
        "OWASP Top 10 review of a small app: authentication, secrets handling, headers, dependencies and data validation",
        "Report with prioritized findings",
        "A session to walk through it",
      ],
    },
    excludes: {
      es: [
        "Pentest certificado",
        "Corregir los hallazgos (se cotiza aparte)",
        "Certificación de cumplimiento",
      ],
      en: [
        "Certified pentest",
        "Fixing the findings (quoted separately)",
        "Compliance certification",
      ],
    },
  },
  {
    id: "monthly-support",
    group: "complementary",
    title: { es: "Plan de soporte mensual", en: "Monthly support plan" },
    body: {
      es: "Para que lo que construimos siga funcionando: monitoreo, actualizaciones y horas de cambios cada mes.",
      en: "So that what we build keeps working: monitoring, updates and change hours every month.",
    },
    timeline: { es: "Mensual", en: "Monthly" },
    tiers: [
      {
        priceId: "monthly-support-basic",
        name: { es: "Básico", en: "Basic" },
        includes: {
          es: ["Monitoreo", "Actualizaciones", "Copias de seguridad", "1 hora de cambios"],
          en: ["Monitoring", "Updates", "Backups", "1 hour of changes"],
        },
      },
      {
        priceId: "monthly-support-plus",
        name: { es: "Plus", en: "Plus" },
        includes: {
          es: [
            "Todo lo del Básico",
            "3 horas de cambios",
            "Monitoreo de automatizaciones y chatbot",
            "Informe mensual",
            "Respuesta en 1 día hábil",
          ],
          en: [
            "Everything in Basic",
            "3 hours of changes",
            "Monitoring of automations and chatbot",
            "Monthly report",
            "Response within 1 business day",
          ],
        },
      },
    ],
    excludes: {
      es: ["Funcionalidades nuevas", "Las horas no usadas no se acumulan"],
      en: ["New features", "Unused hours do not accumulate"],
    },
  },
];

export const servicesInGroup = (group: ServiceGroupId): Service[] =>
  SERVICES.filter((service) => service.group === group);

export const serviceById = (id: ServiceId): Service =>
  SERVICES.find((service) => service.id === id)!;

/**
 * Fills the `{threshold}` and `{savings}` tokens of a copy string with the
 * Lúmina W referral threshold and the Time Saver Kit saving, in one currency.
 */
export const fillServiceText = (text: string, currency: Currency, lang: Lang): string =>
  text
    .replace("{threshold}", formatMoney(THRESHOLDS.luminawReferral[currency], currency, lang))
    .replace("{savings}", String(savingsPercent("time-saver-kit", TIME_SAVER_KIT_PARTS, currency)));

/** What no service includes. */
export const GENERAL_EXCLUSIONS: LocalizedList = {
  es: [
    "Dominio, hosting y licencias de herramientas",
    "Consumo de APIs de IA, WhatsApp Business API y n8n cloud",
    "Pauta publicitaria, fotografía, video, logo e identidad de marca",
    "Redacción extensa de contenidos",
    "Cambios de alcance después de aprobada la propuesta: se cotizan aparte",
  ],
  en: [
    "Domain, hosting and tool licenses",
    "AI API usage, WhatsApp Business API and n8n cloud",
    "Advertising, photography, video, logo and brand identity",
    "Long-form copywriting",
    "Scope changes after the proposal is approved: quoted separately",
  ],
};

/** Backend work for technical teams: outside the catalog, no fixed price, quoted per scope. */
export const TECHNICAL_TEAMS_SERVICE = {
  title: { es: "APIs REST y backend", en: "REST APIs and backend" },
  body: {
    es: "Diseño e implemento APIs limpias, autenticadas y documentadas. Modelado relacional, control de acceso por rol, multitenancy y lógica de negocio compleja que aguanta el crecimiento.",
    en: "I design and build clean, authenticated, and documented APIs. Relational modeling, role-based access control, multitenancy, and complex business logic that holds up as you grow.",
  },
  tools: ["Django REST Framework", "JWT", "PostgreSQL", "Multitenancy"],
  timeline: { es: "3 a 6 semanas", en: "3 to 6 weeks" },
  examples: [
    {
      slug: "nullbreach",
      part: "app",
      name: "NullBreach",
      description: {
        es: "aplicación de análisis OWASP con Next.js",
        en: "Next.js OWASP analysis application",
      },
    },
  ] satisfies ServiceExample[],
} as const;

export const SERVICE_LABELS = {
  es: {
    catalog: "Catálogo",
    price: "Precio",
    customQuote: "Cotización personalizada",
    duration: "Plazo",
    includes: "Incluye",
    excludes: "No incluye",
    note: "Nota",
    tools: "Herramientas",
    examples: "Ejemplos",
    quote: "Cotizar este servicio",
    exclusionsLabel: "Exclusiones generales",
    exclusionsTitle: "Lo que ningún servicio incluye",
    technicalLabel: "Para equipos técnicos",
    technicalTitle: "Refuerzo backend para tu equipo",
    technicalIntro:
      "Fuera del catálogo y sin precio fijo: se cotiza según el alcance, como desarrollo completo o como refuerzo dentro de tu equipo.",
    technicalQuote: "Cotizar este servicio",
  },
  en: {
    catalog: "Catalog",
    price: "Price",
    customQuote: "Custom quote",
    duration: "Timeline",
    includes: "Includes",
    excludes: "Not included",
    note: "Note",
    tools: "Tools",
    examples: "Examples",
    quote: "Request a quote",
    exclusionsLabel: "General exclusions",
    exclusionsTitle: "What no service includes",
    technicalLabel: "For technical teams",
    technicalTitle: "Backend support for your team",
    technicalIntro:
      "Outside the catalog and without a fixed price: quoted per scope, as full development or as embedded support within your team.",
    technicalQuote: "Request a quote",
  },
} satisfies Record<Lang, Record<string, string>>;

export type ServiceLabels = (typeof SERVICE_LABELS)[Lang];
