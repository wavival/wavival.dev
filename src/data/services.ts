// The services catalog of the 2026 plan: copy in both languages for the eleven
// services, the three groups they belong to, the general exclusions and the
// block for technical teams. Amounts never live here: every price is a
// `PriceId` resolved through `src/data/pricing.ts` in the visitor's currency.

import type { Lang } from "../i18n/ui";
import type { Currency } from "../utils/currency";
import {
  THRESHOLDS,
  TIME_SAVER_KIT_PARTS,
  formatMoney,
  savingsPercent,
  type PriceId,
  type ServiceId,
} from "./pricing";

export type Localized = Record<Lang, string>;
export type LocalizedList = Record<Lang, string[]>;

export const SERVICE_GROUP_IDS = ["development", "complementary", "marketing"] as const;

export type ServiceGroupId = (typeof SERVICE_GROUP_IDS)[number];

export interface ServiceGroup {
  id: ServiceGroupId;
  title: Localized;
  /** Shown under the group title. The marketing group states how marketing is sold. */
  note?: Localized;
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
  /** One price, or none when the service is sold in tiers. */
  priceId?: PriceId;
  /** Plans with their own price and inclusions (the support plan). */
  tiers?: ServiceTier[];
  includes?: LocalizedList;
  excludes: LocalizedList;
  /**
   * Visible note. `{threshold}` and `{savings}` are filled in the visitor's
   * currency by the catalog component.
   */
  note?: Localized;
  /** Short badge next to the index (sold only to development clients). */
  badge?: Localized;
  examples?: ServiceExample[];
}

export const SERVICE_GROUPS: readonly ServiceGroup[] = [
  { id: "development", title: { es: "Desarrollo", en: "Development" } },
  { id: "complementary", title: { es: "Complementarios", en: "Complementary" } },
  {
    id: "marketing",
    title: { es: "Paquetes con marketing", en: "Packages with marketing" },
    note: {
      es: "El marketing solo se vende dentro de un paquete o a clientes de desarrollo. Va incluido para que lo que construimos también traiga clientes.",
      en: "Marketing is sold only inside a package or to development clients. It is included so that what we build also brings in customers.",
    },
  },
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
        "2 rounds of adjustments and 30 days of warranty",
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
        "2 rounds of adjustments and 30 days of warranty",
      ],
    },
    excludes: {
      es: ["Tienda online", "Pasarela de pagos", "Varios idiomas"],
      en: ["Online store", "Payment gateway", "Several languages"],
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
        "30 days of warranty",
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
        "Testing and 30 days of warranty",
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
        "Monthly operation: the support plan is recommended for it",
      ],
    },
  },
  {
    id: "custom-web-app-mvp",
    group: "development",
    title: { es: "App web o PWA a medida (MVP)", en: "Custom web app or PWA (MVP)" },
    body: {
      es: "Producto completo de extremo a extremo, en producción. Para fundadores que necesitan algo real, no un demo.",
      en: "A complete product end to end, in production. For founders who need something real, not a demo.",
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
        "30 days of warranty",
      ],
    },
    excludes: {
      es: [
        "Apps nativas en tiendas",
        "Integraciones fuera del alcance acordado",
        "Soporte posterior",
      ],
      en: [
        "Native apps in the stores",
        "Integrations outside the agreed scope",
        "Support after delivery",
      ],
    },
    note: {
      es: "Si el proyecto supera {threshold} o necesita equipo, pasa a Lúmina W.",
      en: "If the project exceeds {threshold} or needs a team, it moves to Lúmina W.",
    },
    examples: [
      {
        slug: "terracore",
        part: "app",
        name: "TerraCore",
        description: {
          es: "plataforma agropecuaria multitenancy",
          en: "multi-tenancy agri-industrial platform",
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
        "Testing and 30 days of warranty",
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
  {
    id: "digital-presence-kit",
    group: "marketing",
    title: { es: "Kit Presencia Digital", en: "Digital Presence Kit" },
    body: {
      es: "La landing más lo mínimo para que te encuentren en Google y en redes.",
      en: "The landing page plus the minimum to be found on Google and social networks.",
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
      en: ["The same as each service on its own"],
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
    "Usage of AI APIs, WhatsApp Business API and n8n cloud",
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
    technicalQuote: "Cotizar",
  },
  en: {
    catalog: "Catalog",
    price: "Price",
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
    technicalTitle: "Backend reinforcement for your team",
    technicalIntro:
      "Outside the catalog and without a fixed price: quoted per scope, as full development or as reinforcement inside your team.",
    technicalQuote: "Request a quote",
  },
} satisfies Record<Lang, Record<string, string>>;

export type ServiceLabels = (typeof SERVICE_LABELS)[Lang];
