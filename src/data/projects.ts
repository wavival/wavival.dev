export interface ProjectLink {
  href: string;
  text: string;
  ariaLabel: string;
  /** Optional Umami event name for click tracking (e.g. "ver-app-terracore"). */
  event?: string;
}

export interface ProjectEn {
  imageAlt?: string;
  tag?: string;
  problem: string;
  solution: string;
  /** Short TL;DR shown above the numbered sections. Falls back to the first sentence of `solution`. */
  summary?: string;
  links: ProjectLink[];
  metaDescription?: string;
  architecture?: string[];
  decisions?: { title: string; context: string; tradeoff: string; decision: string }[];
  results?: string[];
  learnings?: string[];
  painPoints?: { title: string; text: string }[];
  modules?: { name: string; text: string }[];
  chainSteps?: string[];
  chainStepsTitle?: string;
}

export interface Project {
  title: string;
  slug: string;
  tag: string;
  tagColor: "green" | "blue" | "orange" | "gray";
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  stack: string[];
  /** Filter tags: full-stack, ia, pwa, landing, diseno */
  filters?: string[];
  problem: string;
  solution: string;
  /** Short TL;DR shown above the numbered sections on the case study. Falls back to the first sentence of `solution`. */
  summary?: string;
  architecture?: string[];
  links: ProjectLink[];
  /** When true, this project gets its own /projects/<slug> case-study page. */
  caseStudy?: boolean;
  /** Points to an existing case-study slug instead of generating a new page. */
  linkedCaseStudy?: string;
  /** Meta description for the case-study page (150-160 chars). */
  metaDescription?: string;
  /** Outcomes. Only real, verifiable outcomes; never fabricate metrics. */
  results?: string[];
  /** What the build taught. */
  learnings?: string[];
  /** Pain-point cards shown below the problem statement. */
  painPoints?: { title: string; text: string }[];
  /** Feature/module cards shown after the architecture list. */
  modules?: { name: string; text: string }[];
  /** Cascade example steps shown in a callout block after modules. */
  chainSteps?: string[];
  /** Heading for the chainSteps callout. */
  chainStepsTitle?: string;
  /** Architecture decisions rendered as structured cards (context / trade-off / decision). */
  decisions?: { title: string; context: string; tradeoff: string; decision: string }[];
  /** Key metric stat cards shown above the results list. */
  metrics?: { metric: string; label: string; note: string }[];
  /** Schema.org type for the case-study page JSON-LD. */
  schemaType?: "SoftwareApplication" | "WebSite" | "CreativeWork";
  /** schema.org applicationCategory (SoftwareApplication only). */
  appCategory?: string;
  /** Real programming languages (SoftwareApplication only). Frameworks/tools stay in `stack` (mapped to softwareRequirements). */
  programmingLanguage?: string[];
  /** ISO 8601 (YYYY-MM-DD) first-publish date for the case-study JSON-LD. Falls back to the build date. */
  datePublished?: string;
  /** ISO 8601 (YYYY-MM-DD) last substantive content update. Falls back to datePublished, then build date. */
  dateModified?: string;
  en?: ProjectEn;
}

export const projects: Project[] = [
  {
    title: "TerraCore PWA",
    slug: "terracore",
    datePublished: "2026-06-16",
    dateModified: "2026-06-16",
    tag: "Live",
    tagColor: "green",
    image: "images/og-terracore.webp",
    imageAlt:
      "Dashboard de TerraCore: métricas en tiempo real, gráficas de producción y distribución de ganado",
    imageWidth: 1200,
    imageHeight: 630,
    stack: ["Django", "DRF", "PostgreSQL", "JWT", "React", "TypeScript", "Tailwind CSS"],
    appCategory: "BusinessApplication",
    programmingLanguage: ["Python", "TypeScript", "SQL"],
    summary:
      "PWA multitenancy para fincas medianas en Colombia. Centraliza animales, inventario, producción, salud y costos en una plataforma offline-first; redujo el tiempo administrativo 42% en fincas piloto. Django, DRF, PostgreSQL, React.",
    filters: ["full-stack", "pwa"],
    problem:
      "Los productores agropecuarios en Colombia no contaban con software diseñado para ellos: los ERPs existentes eran demasiado complejos, y Excel con login no alcanzaba para gestionar animales, sanidad y producción al mismo tiempo. La operación terminaba repartida entre cuadernos, hojas de cálculo y grupos de WhatsApp.",
    solution:
      "TerraCore centraliza en una sola pantalla todo lo que una finca mediana necesita gestionar: animales, inventario, producción, salud animal, costos y finanzas. Reemplaza Excel, cuadernos y WhatsApp como herramientas operativas. Construida desde el campo con productores reales de Urabá, atiende bovino, porcino, equino, ovino, caprino, avícola y cultivos asociados (plátano, cacao, maíz) en Colombia.",
    architecture: [
      "Arquitectura multitenancy: cada organización opera en su propio espacio de datos aislado sobre una sola instancia del backend.",
      "API REST con Django REST Framework, autenticación JWT y control de acceso por tres roles con permisos diferenciados: Administrador, Operario y Colaborador.",
      "PWA instalable desde el navegador en Android e iOS sin pasar por App Store: Service Worker persiste registros sin señal y sincroniza en batch al recuperar la red.",
      "Seis módulos integrados: Dashboard con KPIs en tiempo real, animales (ID, raza, peso, salud, ubicación), insumos con alertas de stock mínimo, costos operativos por lote, producción por lotes y salud animal con vacunas e historial sanitario.",
      "Importación desde CSV para un onboarding sin fricción y exportación CSV en cualquier momento: portabilidad total de los datos del productor, sin lock-in.",
      "Modelado relacional en PostgreSQL: organizaciones, usuarios, animales, lotes, insumos y registros de producción.",
      "Frontend en React + TypeScript consumiendo la API propia; diseño responsivo con Tailwind CSS.",
      "TLS en todos los endpoints; cumplimiento Ley 1581 de Habeas Data sin minería de datos para terceros ni entrenamiento de modelos con datos del usuario.",
    ],
    links: [
      {
        href: "https://app.terracoreapp.co",
        text: "Ver app",
        ariaLabel: "Ver app de TerraCore",
        event: "ver-app-terracore",
      },
    ],
    caseStudy: true,
    schemaType: "SoftwareApplication",
    metaDescription:
      "Caso de estudio de TerraCore: SaaS de gestión agroindustrial para fincas medianas en Colombia. Django, DRF, PostgreSQL y React. PWA offline-first, multitenancy.",
    results: [
      "Reducción de -42% en tiempo de tareas administrativas medida en fincas piloto.",
      "Operación agropecuaria completa centralizada en una plataforma, reemplazando el flujo en Excel, cuadernos y WhatsApp.",
    ],
    learnings: [
      "El aislamiento de datos multitenant condiciona cada decisión de modelado: definir el límite de tenant temprano evita reescrituras.",
    ],
    painPoints: [
      {
        title: "Sin trazabilidad",
        text: "¿Cuándo se vacunó ese animal? Nadie lo sabe con certeza.",
      },
      { title: "Stock invisible", text: "El concentrado se acaba y nadie lo vio venir." },
      {
        title: "Sin señal, sin datos",
        text: "En el corral no hay internet. El registro queda para después, y después nunca llega.",
      },
    ],
    modules: [
      {
        name: "Dashboard",
        text: "KPIs en tiempo real: animales activos, producción mensual, insumos, alertas e ingresos estimados.",
      },
      {
        name: "Animales",
        text: "Registro completo: ID, raza, peso, estado de salud y ubicación por potrero.",
      },
      {
        name: "Insumos",
        text: "Alimentos, medicamentos y suministros con alertas de stock mínimo y proveedor.",
      },
      {
        name: "Costos",
        text: "Registro de costos operativos por lote: insumos, mano de obra y gastos asociados a la producción.",
      },
      {
        name: "Producción",
        text: "Lotes de leche, huevos y cultivos con trazabilidad de insumos y horas.",
      },
      {
        name: "Salud Animal",
        text: "Vacunas, alertas de refuerzo e historial sanitario por animal.",
      },
    ],
    chainStepsTitle: "Si registras una vacuna, pasan tres cosas solas.",
    chainSteps: [
      'Vacuna aplicada (ej. Triple Bovina a "La Canela")',
      "Insumo descontado automáticamente (-1 dosis del stock)",
      "Próximo refuerzo agendado (en 14 días)",
      "Estado de salud del animal actualizado",
    ],
    decisions: [
      {
        title: "Offline-first con PWA",
        context: "En potreros y corrales la señal es intermitente o inexistente.",
        tradeoff:
          "Una web app tradicional fallaría. Una app nativa requeriría publicación en stores y más mantenimiento.",
        decision:
          "PWA con Service Worker que persiste registros localmente y sincroniza en batch cuando vuelve la red. Se instala desde el navegador en Android e iOS sin pasar por App Store.",
      },
      {
        title: "Módulos acoplados con eventos internos",
        context:
          "Cada acción del campo tiene consecuencias en otros registros (vacuna, insumo, salud, agenda).",
        tradeoff:
          "Módulos aislados son más fáciles de mantener pero obligan al usuario a actualizar cada sección manualmente.",
        decision:
          "Arquitectura de eventos internos: una acción dispara actualizaciones en cascada en todos los módulos relacionados.",
      },
      {
        title: "Multirol sin complejidad para el usuario",
        context:
          "Una finca tiene administradores, operarios de campo y colaboradores con necesidades de información distintas.",
        tradeoff:
          "Un solo rol lo ve todo (riesgo de exposición y sobrecarga); demasiados roles complican la gestión.",
        decision:
          "Tres roles con permisos diferenciados: Administrador, Operario y Colaborador. Cada usuario ve solo lo que necesita según su flujo de trabajo.",
      },
      {
        title: "Cumplimiento Ley 1581 de 2012 desde el diseño",
        context:
          "Los datos de producción y sanidad animal son sensibles para el productor. La confianza es bloqueante.",
        tradeoff:
          "Almacenar más datos mejora el producto pero aumenta la responsabilidad legal y la desconfianza.",
        decision:
          "Sin minería de datos para terceros, sin entrenamiento de modelos con datos del usuario. TLS en todos los endpoints.",
      },
      {
        title: "Portabilidad de datos garantizada",
        context:
          "Los productores desconfían de plataformas que retienen sus datos o dificultan la salida.",
        tradeoff:
          "El lock-in de datos puede retener usuarios a corto plazo pero destruye la confianza y frena la adopción inicial.",
        decision:
          "Importación y exportación CSV en cualquier momento y sin restricciones. Los datos del productor son del productor.",
      },
    ],
    metrics: [
      { metric: "-42%", label: "tiempo administrativo", note: "fincas piloto" },
      { metric: "1 semana", label: "tiempo de onboarding", note: "sin consultores" },
      { metric: "6 módulos", label: "integrados", note: "en una sola plataforma" },
    ],
    en: {
      summary:
        "Multitenancy PWA for mid-sized farms in Colombia. Centralizes livestock, inventory, production, health, and costs in one offline-first platform; cut administrative time by 42% in pilot farms. Django, DRF, PostgreSQL, React.",
      imageAlt:
        "TerraCore dashboard: real-time metrics, production charts, and livestock distribution",
      problem:
        "Agricultural producers in Colombia had no software designed for them: existing ERPs were too complex, and an Excel sheet with login was not enough to manage livestock, animal health, and production simultaneously. Operations were scattered across notebooks, spreadsheets, and WhatsApp groups.",
      solution:
        "TerraCore centralizes on a single screen everything a mid-sized farm needs to manage: livestock, inventory, production, animal health, costs, and finances. It replaces Excel, notebooks, and WhatsApp as operational tools. Built from the field with real producers in Urabá, it covers cattle, swine, equine, ovine, caprine, poultry, and associated crops (plantain, cacao, corn) in Colombia.",
      links: [
        {
          href: "https://app.terracoreapp.co",
          text: "View app",
          ariaLabel: "View TerraCore app",
          event: "ver-app-terracore",
        },
      ],
      metaDescription:
        "TerraCore case study: agro-industrial SaaS for mid-sized farms in Colombia. Django, DRF, PostgreSQL, React. Offline-first PWA with multitenancy.",
      architecture: [
        "Multitenancy architecture: each organization operates in its own isolated data space on a single backend instance.",
        "REST API with Django REST Framework, JWT authentication, and role-based access control across three roles: Administrator, Operator, and Collaborator.",
        "Installable PWA from the browser on Android and iOS without going through the App Store: Service Worker persists records without signal and syncs in batch when connectivity is restored.",
        "Six integrated modules: Dashboard with real-time KPIs, livestock (ID, breed, weight, health, location), supplies with minimum stock alerts, operating costs per batch, batch production, and animal health with vaccines and health history.",
        "CSV import for frictionless onboarding and CSV export at any time: full data portability for the producer, no lock-in.",
        "Relational modeling in PostgreSQL: organizations, users, animals, batches, supplies, and production records.",
        "Frontend in React + TypeScript consuming the own API; responsive design with Tailwind CSS.",
        "TLS on all endpoints; Ley 1581 Habeas Data compliance with no data mining for third parties and no model training with user data.",
      ],
      painPoints: [
        {
          title: "No traceability",
          text: "When was that animal vaccinated? Nobody knows for certain.",
        },
        { title: "Invisible stock", text: "The feed runs out and nobody saw it coming." },
        {
          title: "No signal, no data",
          text: "There is no internet in the paddock. The record is left for later, and later never comes.",
        },
      ],
      modules: [
        {
          name: "Dashboard",
          text: "Real-time KPIs: active animals, monthly production, supplies, alerts, and estimated revenue.",
        },
        {
          name: "Livestock",
          text: "Complete record: ID, breed, weight, health status, and location by paddock.",
        },
        {
          name: "Supplies",
          text: "Feed, medications, and supplies with minimum stock alerts and supplier info.",
        },
        {
          name: "Costs",
          text: "Operating cost records per batch: supplies, labor, and expenses associated with production.",
        },
        {
          name: "Production",
          text: "Milk, egg, and crop batches with supply and hours traceability.",
        },
        {
          name: "Animal Health",
          text: "Vaccines, booster alerts, and health history per animal.",
        },
      ],
      chainStepsTitle: "If you log a vaccine, three things happen automatically.",
      chainSteps: [
        "Vaccine applied (e.g. Triple Bovina on 'La Canela')",
        "Supply automatically deducted (-1 dose from stock)",
        "Next booster scheduled (in 14 days)",
        "Animal health status updated",
      ],
      decisions: [
        {
          title: "Offline-first with PWA",
          context: "In paddocks and pens the signal is intermittent or nonexistent.",
          tradeoff:
            "A traditional web app would fail. A native app would require store publishing and more maintenance.",
          decision:
            "PWA with Service Worker that persists records locally and syncs in batch when connectivity returns. Installs from the browser on Android and iOS without going through the App Store.",
        },
        {
          title: "Coupled modules with internal events",
          context:
            "Every field action has consequences on other records (vaccine, supply, health, schedule).",
          tradeoff:
            "Isolated modules are easier to maintain but force the user to update each section manually.",
          decision:
            "Internal event architecture: one action triggers cascade updates across all related modules.",
        },
        {
          title: "Multi-role without complexity for the user",
          context:
            "A farm has administrators, field operators, and collaborators with different information needs.",
          tradeoff:
            "A single role sees everything (exposure risk and overload); too many roles complicate management.",
          decision:
            "Three roles with differentiated permissions: Administrator, Operator, and Collaborator. Each user sees only what they need based on their workflow.",
        },
        {
          title: "Ley 1581 de 2012 compliance by design",
          context:
            "Production and animal health data are sensitive to the producer. Trust is a blocker.",
          tradeoff:
            "Storing more data improves the product but increases legal liability and distrust.",
          decision:
            "No data mining for third parties, no model training with user data. TLS on all endpoints.",
        },
        {
          title: "Guaranteed data portability",
          context: "Producers distrust platforms that retain their data or make exit difficult.",
          tradeoff:
            "Data lock-in can retain users in the short term but destroys trust and slows initial adoption.",
          decision:
            "CSV import and export at any time with no restrictions. The producer's data belongs to the producer.",
        },
      ],
      results: [
        "-42% reduction in administrative task time measured in pilot farms.",
        "Complete agricultural operation centralized on one platform, replacing the workflow in Excel, notebooks, and WhatsApp.",
      ],
      learnings: [
        "Multitenant data isolation conditions every modeling decision: defining the tenant boundary early avoids rewrites.",
      ],
    },
  },
  {
    title: "TerraCore Landing",
    slug: "terracore-landing",
    datePublished: "2026-06-18",
    dateModified: "2026-06-18",
    tag: "Live",
    tagColor: "green",
    image: "images/og-terracore.webp",
    imageAlt:
      "Landing de TerraCore: propuesta de valor y planes para productores agropecuarios colombianos",
    imageWidth: 1200,
    imageHeight: 630,
    stack: ["Astro", "Tailwind CSS", "Supabase", "SEO", "A11y", "GA4", "Performance"],
    filters: ["landing", "diseno"],
    problem:
      "Una plataforma SaaS sin una landing de conversión pierde el tráfico orgánico antes de que el productor llegue a la app: hay que presentar el producto, los módulos y los planes en una sola pantalla.",
    solution:
      "Landing que comunica la propuesta de valor de TerraCore a productores agropecuarios colombianos, muestra los módulos del SaaS, el flujo de integración en cascada y los tres planes de precios, y dirige al registro de la plataforma.",
    architecture: [
      "Astro con output estático: componentes por sección, build optimizado y deploy continuo en Vercel.",
      "Flujo de conversión vertical en 8 secciones: Hero, propuesta de valor, 6 módulos, integración en cascada, UX para el campo, beneficios, precios y FAQ.",
      "Tres planes con precio explícito en COP: Semilla ($2.5M/mes, 1 sede, 5 usuarios), Profesional ($5M/mes, 3 sedes, 15 usuarios) y Enterprise (desde $10M/mes, ilimitado).",
      "Sección de privacidad y seguridad dedicada: Ley 1581 de 2012, TLS en endpoints, sin minería de datos y exportación CSV garantizada.",
      "Formulario de demo conectado a Supabase (Postgres gestionado), sin servidor propio que construir ni mantener; CTAs adicionales a canal de WhatsApp directo.",
      "Google Analytics (GA4) para tracking de comportamiento: sesiones, scroll depth por sección, clics en CTAs y origen del tráfico.",
      "SEO técnico completo: title, meta-description, og:*, twitter:*, canonical y schema markup.",
      "Accesibilidad (a11y): jerarquía de encabezados, aria-labels y contraste WCAG AA.",
      "Performance: output estático, imágenes WebP y caché inmutable en Vercel.",
      "Tailwind CSS con modo claro/oscuro.",
    ],
    painPoints: [
      {
        title: "Sin precio visible",
        text: "El sector agropecuario desconfía de software sin precio. 'Contáctanos para cotizar' genera fricción antes de empezar.",
      },
      {
        title: "El valor diferencial es invisible",
        text: "Que los módulos se hablan entre sí no es obvio. Sin demostrarlo antes de los precios, la landing pierde la conversión.",
      },
      {
        title: "Desconfianza en los datos",
        text: "El productor no quiere que sus costos y producción salgan de la finca. Sin una sección de privacidad explícita, la confianza no se gana.",
      },
    ],
    modules: [
      {
        name: "Seis módulos",
        text: "Dashboard, Animales, Insumos, Herramientas, Producción y Salud Animal. Cada uno con campos reales del flujo de la finca.",
      },
      {
        name: "Integración en cascada",
        text: "Flujo visual: vacuna aplicada, insumo descontado, refuerzo agendado, estado actualizado. Demuestra el valor diferencial antes de los precios.",
      },
      {
        name: "UX para el campo",
        text: "Sidebar con contexto siempre claro, tablas con filas altas y números tabulares, alertas críticas sobre notificaciones genéricas.",
      },
      {
        name: "Seguridad y privacidad",
        text: "Sección dedicada: Ley 1581, TLS, roles y permisos, exportación CSV en 48h y garantía de no minería de datos.",
      },
    ],
    decisions: [
      {
        title: "Copy al dolor, no al producto",
        context:
          "El productor agropecuario no busca 'SaaS agroindustrial'. Busca dejar de usar Excel y cuadernos.",
        tradeoff:
          "Un copy técnico no conecta con el campo. Un copy de dolor sí, pero requiere conocer la operación real.",
        decision:
          "Hero sin una sola mención al stack. 'Sin Excel. Sin cuadernos. Sin WhatsApp.' + beneficio de la primera semana como promesa concreta.",
      },
      {
        title: "Integración antes de precios",
        context:
          "La diferencia de TerraCore frente a Excel es que los módulos se hablan entre sí. Eso no es obvio para el productor.",
        tradeoff:
          "Ir directo a precios antes de demostrar el valor diferencial baja la conversión.",
        decision:
          "Sección de flujo en cascada ('Si registras una vacuna...') antes de la tabla de precios. El usuario entiende el valor antes de ver el costo.",
      },
      {
        title: "Google Analytics para iterar con datos reales",
        context:
          "Sin métricas de comportamiento, el diseño de la landing es intuición: no se sabe qué secciones leen, dónde abandonan ni qué CTA convierte.",
        tradeoff:
          "GA añade un script de terceros con implicaciones de privacidad que hay que declarar en la política de cookies y el banner de consentimiento.",
        decision:
          "Google Analytics con consentimiento explícito de cookies. Permite rastrear sesiones, scroll depth por sección, clics en CTAs y origen del tráfico para iterar el diseño con datos reales.",
      },
      {
        title: "Sección de privacidad dedicada",
        context:
          "Los datos de producción y costos son sensibles para el productor. La confianza es bloqueante.",
        tradeoff:
          "Omitirla asume confianza. En el sector agro, la confianza hay que ganársela explícitamente.",
        decision:
          "Sección completa con Ley 1581, TLS, roles, exportación CSV y garantía de no minería de datos ni entrenamiento de IA.",
      },
    ],
    results: [
      "Flujo de conversión completo en 8 secciones: desde el dolor del productor hasta CTA de demo.",
      "Tres planes publicados con precio en COP, features explícitas por plan y condiciones claras de IVA y cancelación.",
      "Métrica central comunicada: -42% en tiempo administrativo medido en fincas piloto.",
    ],
    learnings: [
      "Una landing SaaS para un nicho no tecnológico necesita hablar el idioma del cliente: cada sección se redactó con vocabulario del campo, no del software.",
      "Separar la demostración del valor (integración en cascada) de la sección de precios reduce la barrera cognitiva: el productor llega a los planes habiendo entendido ya qué diferencia a TerraCore de Excel.",
    ],
    caseStudy: true,
    schemaType: "WebSite",
    metaDescription:
      "Caso de estudio de TerraCore Landing: landing de conversión en Astro y Tailwind CSS para productores agropecuarios colombianos. Propuesta de valor y CRO.",
    links: [
      {
        href: "https://terracoreapp.co",
        text: "Ver sitio",
        ariaLabel: "Ver landing de TerraCore",
      },
    ],
    en: {
      imageAlt:
        "TerraCore landing: value proposition and plans for Colombian agricultural producers",
      problem:
        "A SaaS platform without a conversion landing loses organic traffic before the producer even reaches the app: it needs to present the product, modules, and plans on a single screen.",
      solution:
        "Landing that communicates TerraCore's value proposition to Colombian agricultural producers, shows the SaaS modules, the cascade integration flow, and the three pricing plans, and directs to platform registration.",
      links: [
        {
          href: "https://terracoreapp.co",
          text: "Visit site",
          ariaLabel: "Visit TerraCore landing",
        },
      ],
      metaDescription:
        "TerraCore Landing case study: conversion landing in Astro and Tailwind CSS for Colombian agricultural producers. Value proposition and CRO.",
      architecture: [
        "Astro with static output: section components, optimized build, and continuous deployment to Vercel.",
        "Vertical conversion flow in 8 sections: Hero, value proposition, 6 modules, cascade integration, field UX, benefits, pricing, and FAQ.",
        "Three plans with explicit pricing in COP: Seed ($2.5M/mo, 1 location, 5 users), Professional ($5M/mo, 3 locations, 15 users), and Enterprise (from $10M/mo, unlimited).",
        "Dedicated privacy and security section: Ley 1581 de 2012, TLS on endpoints, no data mining, and guaranteed CSV export.",
        "Demo form connected to Supabase (managed Postgres), no own server to build or maintain; additional CTAs to a direct WhatsApp channel.",
        "Google Analytics (GA4) for behavior tracking: sessions, scroll depth per section, CTA clicks, and traffic source.",
        "Full technical SEO: title, meta-description, og:*, twitter:*, canonical, and schema markup.",
        "Accessibility (a11y): heading hierarchy, aria-labels, and WCAG AA contrast.",
        "Performance: static output, WebP images, and immutable cache on Vercel.",
        "Tailwind CSS with light/dark mode.",
      ],
      painPoints: [
        {
          title: "No visible pricing",
          text: "The agricultural sector distrusts software without pricing. 'Contact us for a quote' creates friction before you even start.",
        },
        {
          title: "Differential value is invisible",
          text: "That the modules talk to each other is not obvious. Without demonstrating it before pricing, the landing loses the conversion.",
        },
        {
          title: "Distrust around data",
          text: "The producer does not want their costs and production data leaving the farm. Without an explicit privacy section, trust is never earned.",
        },
      ],
      modules: [
        {
          name: "Six modules",
          text: "Dashboard, Livestock, Supplies, Tools, Production, and Animal Health. Each with real fields from the farm workflow.",
        },
        {
          name: "Cascade integration",
          text: "Visual flow: vaccine applied, supply deducted, booster scheduled, status updated. Demonstrates differential value before pricing.",
        },
        {
          name: "Field UX",
          text: "Sidebar with always-clear context, tables with large rows and tabular numbers, critical alerts above generic notifications.",
        },
        {
          name: "Security and privacy",
          text: "Dedicated section: Ley 1581, TLS, roles and permissions, CSV export in 48h, and guarantee of no data mining or AI training.",
        },
      ],
      decisions: [
        {
          title: "Copy focused on the pain, not the product",
          context:
            "The agricultural producer does not search for 'agro-industrial SaaS'. They search to stop using Excel and notebooks.",
          tradeoff:
            "Technical copy does not connect with the field. Pain-focused copy does, but requires knowing the real operation.",
          decision:
            "Hero with no mention of the stack. 'No Excel. No notebooks. No WhatsApp.' plus a first-week benefit as a concrete promise.",
        },
        {
          title: "Integration before pricing",
          context:
            "TerraCore's difference from Excel is that the modules talk to each other. That is not obvious to the producer.",
          tradeoff:
            "Going straight to pricing before demonstrating differential value lowers conversion.",
          decision:
            "Cascade flow section ('If you log a vaccine...') before the pricing table. The user understands the value before seeing the cost.",
        },
        {
          title: "Google Analytics to iterate with real data",
          context:
            "Without behavioral metrics, landing design is intuition: you do not know which sections are read, where users drop off, or which CTA converts.",
          tradeoff:
            "GA adds a third-party script with privacy implications that must be declared in the cookie policy and consent banner.",
          decision:
            "Google Analytics with explicit cookie consent. Allows tracking sessions, scroll depth per section, CTA clicks, and traffic source to iterate the design with real data.",
        },
        {
          title: "Dedicated privacy section",
          context: "Production and cost data are sensitive to the producer. Trust is a blocker.",
          tradeoff:
            "Omitting it assumes trust. In the agricultural sector, trust must be earned explicitly.",
          decision:
            "Complete section with Ley 1581, TLS, roles, CSV export, and guarantee of no data mining or AI training.",
        },
      ],
      results: [
        "Complete conversion flow in 8 sections: from producer pain to demo CTA.",
        "Three plans published with COP pricing, explicit features per plan, and clear VAT and cancellation terms.",
        "Central metric communicated: -42% in administrative time measured in pilot farms.",
      ],
      learnings: [
        "A SaaS landing for a non-technical niche must speak the client's language: every section was written in field vocabulary, not software vocabulary.",
        "Separating the value demonstration (cascade integration) from the pricing section reduces cognitive load: the producer arrives at the plans having already understood what differentiates TerraCore from Excel.",
      ],
    },
  },
  {
    title: "OKroot PWA",
    slug: "root",
    datePublished: "2026-06-16",
    dateModified: "2026-06-16",
    tag: "Live",
    tagColor: "green",
    image: "images/og-okroot.webp",
    imageAlt: "OKroot: PWA con scanner de etiquetas por IA y perfil de restricciones alimentarias",
    imageWidth: 1200,
    imageHeight: 630,
    stack: ["Django", "DRF", "PostgreSQL", "React", "TypeScript", "Claude API", "PWA"],
    appCategory: "HealthApplication",
    programmingLanguage: ["Python", "TypeScript", "SQL"],
    summary:
      "PWA offline-first que escanea etiquetas de alimentos con IA (Claude API) y dice al instante si puedes comer un producto según tus restricciones (celíaco, diabético, intolerante a la lactosa). Django, DRF, PostgreSQL, React.",
    filters: ["full-stack", "ia", "pwa"],
    problem:
      "Comer con celiaquía, diabetes o intolerancia a la lactosa implica leer cada etiqueta, descifrar ingredientes escondidos bajo otros nombres y buscar recetas que cumplan varias restricciones a la vez, todo de forma manual y dispersa.",
    solution:
      "El usuario fotografía un producto y en segundos sabe si puede comerlo con sus restricciones activas (celiaquía, diabetes, intolerancia a la lactosa), combinables entre sí. OKroot va más allá del scanner: recetas curadas con filtrado estricto y diario alimentario offline para quien ya sabe qué no puede comer y quiere saber qué sí.",
    architecture: [
      "PWA offline-first con Service Workers: el diario de consumo funciona sin conexión y sincroniza al recuperarla.",
      "Scanner de etiquetas por IA: el usuario fotografía un producto y Claude API analiza los ingredientes contra su perfil de restricciones activo.",
      "Perfil de salud persistente que condiciona todas las respuestas del modelo (celiaquía, diabetes tipo 2, intolerancia a la lactosa, combinables).",
      "Sistema de recetas curadas con filtrado estricto por múltiples condiciones simultáneas.",
      "Backend en Django REST Framework + PostgreSQL; frontend en React + TypeScript.",
    ],
    links: [
      {
        href: "https://app.okroot.co/",
        text: "Ver app",
        ariaLabel: "Ver app de OKroot",
        event: "ver-app-root",
      },
    ],
    caseStudy: true,
    schemaType: "SoftwareApplication",
    metaDescription:
      "Caso de estudio de OKroot: PWA offline-first con scanner de etiquetas por IA (Claude API) para celíacos, diabéticos e intolerantes a la lactosa.",
    results: [
      "Scanner de etiquetas funcional: el usuario fotografía un producto y Claude API analiza los ingredientes contra su perfil de restricciones activo, incluso cuando varias condiciones aplican a la vez.",
      "Diario de consumo operativo sin conexión gracias al diseño offline-first; los registros se persisten en local y sincronizan al recuperar la red.",
      "Núcleo completo en producción: perfil de salud persistente, scanner por IA y recetas con filtrado estricto sobre Django REST Framework, PostgreSQL y React.",
    ],
    learnings: [
      "Offline-first no es una capa que se añade al final: condiciona el modelo de sincronización desde el primer endpoint y obliga a resolver conflictos de datos en vez de asumir una única fuente de verdad.",
      "Para que las respuestas del modelo sean fiables, el perfil de salud no puede ir solo en el prompt: tratar las restricciones como estado persistente y verificable, y no como contexto que se pierde entre peticiones, es lo que evita falsos seguros al combinar celiaquía, diabetes e intolerancia a la lactosa.",
    ],
    painPoints: [
      {
        title: "Cada etiqueta, a mano",
        text: "Comprar o comer fuera implica leer el reverso de cada producto, una y otra vez.",
      },
      {
        title: "Ingredientes con disfraz",
        text: "La lactosa, el gluten o el azúcar aparecen bajo nombres técnicos que pocos reconocen.",
      },
      {
        title: "Restricciones que se acumulan",
        text: "Las soluciones existentes validan una condición a la vez, dispersas y sin funcionar sin conexión.",
      },
    ],
    modules: [
      {
        name: "Scanner de etiquetas",
        text: "Fotografía un producto y la IA analiza los ingredientes contra el perfil activo del usuario, incluyendo ingredientes ocultos bajo nombres técnicos.",
      },
      {
        name: "Recetas curadas",
        text: "Catálogo filtrado por restricciones múltiples: una receta se valida contra celiaquía, diabetes e intolerancia a la lactosa al mismo tiempo.",
      },
      {
        name: "Diario alimentario",
        text: "Registro de consumo con soporte offline completo. Los registros se persisten localmente y sincronizan al recuperar la red.",
      },
    ],
    chainStepsTitle: "Una foto, una respuesta. Esto pasa por debajo.",
    chainSteps: [
      "Fotografías la etiqueta de un producto",
      "Claude API lee los ingredientes, incluidos los nombres técnicos que esconden lactosa, gluten o azúcar",
      "El análisis se cruza contra todas tus restricciones activas a la vez",
      "Respuesta en segundos: puedes comerlo, o el ingrediente exacto que lo descarta",
    ],
    decisions: [
      {
        title: "Nicho médico real, no wellness genérico",
        context:
          "Existen muchas apps de comer sano. Las personas con celiaquía, diabetes o intolerancia tienen necesidades concretas y consecuencias reales si se equivocan.",
        tradeoff:
          "Un producto más amplio alcanza más usuarios pero diluye la propuesta y baja el estándar de validación.",
        decision:
          "OKroot está diseñada para quien tiene una condición médica diagnosticada. Eso define el catálogo, los criterios del scanner y cómo se presentan los resultados.",
      },
      {
        title: "Restricciones compuestas: lógica AND, no OR",
        context:
          "Un usuario puede tener celiaquía, diabetes e intolerancia a la lactosa al mismo tiempo. La mayoría de apps aplican restricciones en silo.",
        tradeoff:
          "Validar una restricción es simple. Validar tres simultáneamente con ingredientes ocultos bajo nombres técnicos exige un modelo de perfil persistente y prompts específicos.",
        decision:
          "El perfil de salud es estado persistente, no contexto de sesión. Cada análisis del scanner valida contra todas las restricciones activas al mismo tiempo.",
      },
      {
        title: "Claude API vs lista hardcodeada de ingredientes",
        context:
          "Un ingrediente prohibido aparece bajo decenas de nombres: la lactosa como suero, caseína o lactosuero; el gluten como malta, sémola o espelta. Una lista fija envejece y nunca cubre todos los casos.",
        tradeoff:
          "Una lista hardcodeada es predecible y barata, pero exige mantenimiento constante y falla ante nombres nuevos o redacciones ambiguas.",
        decision:
          "El análisis lo hace Claude API contra el perfil de restricciones activo: generaliza a nombres alternativos y redacciones que una lista fija no anticipa, y explica el ingrediente concreto por el que un producto se descarta.",
      },
      {
        title: "PWA offline-first para el diario alimentario",
        context: "El registro de consumo ocurre en el momento, no siempre con buena señal.",
        tradeoff:
          "Una app web tradicional falla sin conexión. Una app nativa requiere publicación en stores y más mantenimiento.",
        decision:
          "Service Worker que persiste el diario en IndexedDB y sincroniza en batch al recuperar la red, resolviendo conflictos contra el backend. Se instala desde el navegador sin pasar por App Store.",
      },
    ],
    en: {
      summary:
        "Offline-first PWA that scans food labels with AI (Claude API) and instantly tells you whether you can eat a product based on your active restrictions (celiac, diabetes, lactose intolerance). Django, DRF, PostgreSQL, React.",
      imageAlt: "OKroot: PWA with AI food-label scanner and dietary restriction profile",
      problem:
        "Eating with celiac disease, diabetes, or lactose intolerance means reading every label, deciphering hidden ingredients listed under other names, and finding recipes that comply with multiple restrictions at the same time, all manually and scattered across sources.",
      solution:
        "The user photographs a product and within seconds knows whether they can eat it given their active restrictions (celiac disease, diabetes, lactose intolerance), combinable with each other. OKroot goes beyond the scanner: curated recipes with strict filtering and an offline food diary for those who already know what they cannot eat and want to know what they can.",
      links: [
        {
          href: "https://app.okroot.co/",
          text: "Visit app",
          ariaLabel: "Visit OKroot app",
          event: "ver-app-root",
        },
      ],
      metaDescription:
        "OKroot case study: offline-first PWA with AI food label scanner (Claude API) for celiac, diabetic, and lactose-intolerant users. Architecture and decisions.",
      architecture: [
        "Offline-first PWA with Service Workers: the food diary works without connection and syncs when connectivity is restored.",
        "AI food label scanner: the user photographs a product and Claude API analyzes the ingredients against their active restriction profile.",
        "Persistent health profile that conditions all model responses (celiac disease, type 2 diabetes, lactose intolerance, combinable).",
        "Curated recipe system with strict filtering by multiple simultaneous conditions.",
        "Backend in Django REST Framework + PostgreSQL; frontend in React + TypeScript.",
      ],
      painPoints: [
        {
          title: "Every label, by hand",
          text: "Shopping or eating out means reading the back of every product, over and over.",
        },
        {
          title: "Ingredients in disguise",
          text: "Lactose, gluten, or sugar show up under technical names few people recognize.",
        },
        {
          title: "Restrictions that stack",
          text: "Existing tools validate one condition at a time, scattered and useless offline.",
        },
      ],
      modules: [
        {
          name: "Label scanner",
          text: "Photograph a product and the AI analyzes the ingredients against the user's active profile, including hidden ingredients listed under technical names.",
        },
        {
          name: "Curated recipes",
          text: "Catalog filtered by multiple restrictions: a recipe is validated against celiac disease, diabetes, and lactose intolerance simultaneously.",
        },
        {
          name: "Food diary",
          text: "Consumption log with full offline support. Records are persisted locally and sync when connectivity is restored.",
        },
      ],
      chainStepsTitle: "One photo, one answer. Here is what happens underneath.",
      chainSteps: [
        "You photograph a product's label",
        "Claude API reads the ingredients, including the technical names that hide lactose, gluten, or sugar",
        "The analysis is cross-checked against all your active restrictions at once",
        "Answer in seconds: you can eat it, or the exact ingredient that rules it out",
      ],
      decisions: [
        {
          title: "Real medical niche, not generic wellness",
          context:
            "Many eat-healthy apps exist. People with celiac disease, diabetes, or intolerance have specific needs and real consequences if they make mistakes.",
          tradeoff:
            "A broader product reaches more users but dilutes the proposition and lowers the validation standard.",
          decision:
            "OKroot is designed for people with a diagnosed medical condition. That defines the catalog, scanner criteria, and how results are presented.",
        },
        {
          title: "Compound restrictions: AND logic, not OR",
          context:
            "A user can have celiac disease, diabetes, and lactose intolerance simultaneously. Most apps apply restrictions in silos.",
          tradeoff:
            "Validating one restriction is simple. Validating three simultaneously with hidden ingredients under technical names requires a persistent profile model and specific prompts.",
          decision:
            "The health profile is persistent state, not session context. Each scanner analysis validates against all active restrictions at the same time.",
        },
        {
          title: "Claude API vs a hardcoded ingredient list",
          context:
            "A restricted ingredient shows up under dozens of names: lactose as whey, casein, or milk solids; gluten as malt, semolina, or spelt. A fixed list ages and never covers every case.",
          tradeoff:
            "A hardcoded list is predictable and cheap, but needs constant maintenance and breaks on new names or ambiguous wording.",
          decision:
            "Claude API runs the analysis against the active restriction profile: it generalizes to alternative names and phrasings a fixed list cannot anticipate, and explains the specific ingredient that rules a product out.",
        },
        {
          title: "Offline-first PWA for the food diary",
          context: "Consumption logging happens in the moment, not always with a good signal.",
          tradeoff:
            "A traditional web app fails without connection. A native app requires store publishing and more maintenance.",
          decision:
            "Service Worker that persists the diary in IndexedDB and syncs in batch when connectivity returns, resolving conflicts against the backend. Installs from the browser without going through the App Store.",
        },
      ],
      results: [
        "Functional label scanner: the user photographs a product and Claude API analyzes the ingredients against their active restriction profile, even when multiple conditions apply simultaneously.",
        "Operational offline food diary thanks to offline-first design; records are persisted locally and sync when connectivity is restored.",
        "Complete core in production: persistent health profile, AI scanner, and recipes with strict filtering on Django REST Framework, PostgreSQL, and React.",
      ],
      learnings: [
        "Offline-first is not a layer added at the end: it conditions the sync model from the first endpoint and forces resolving data conflicts instead of assuming a single source of truth.",
        "For the model's responses to be reliable, the health profile cannot go only in the prompt: treating restrictions as persistent verifiable state, not context that is lost between requests, is what prevents false negatives when combining celiac disease, diabetes, and lactose intolerance.",
      ],
    },
  },
  {
    title: "OKroot Landing",
    slug: "root-landing",
    datePublished: "2026-06-18",
    dateModified: "2026-06-18",
    tag: "Live",
    tagColor: "green",
    image: "images/og-okroot.webp",
    imageAlt: "Landing de OKroot: scanner de etiquetas por IA para restricciones alimentarias",
    imageWidth: 1200,
    imageHeight: 630,
    stack: ["Astro", "Tailwind CSS", "Supabase", "SEO", "A11y", "GA4", "Performance"],
    filters: ["landing", "diseno"],
    problem:
      "Una app con múltiples restricciones dietéticas necesita comunicar con precisión a quién está dirigida y qué hace antes de que el usuario la instale o la pruebe.",
    solution:
      "Landing de OKroot que explica el scanner de etiquetas por IA, las restricciones activas compatibles (celiaquía, diabetes, intolerancia a la lactosa) y el acceso a la PWA.",
    architecture: [
      "Astro con output estático: componentes por sección y deploy continuo en Vercel.",
      "Tailwind CSS para diseño responsivo.",
      "SEO técnico: title, meta-description, Open Graph, Twitter Card, canonical y schema markup.",
      "Accesibilidad (a11y): jerarquía de encabezados, aria-labels y contraste WCAG AA.",
      "Performance: output estático, imágenes WebP y caché inmutable en Vercel.",
      "Analíticas de Google (GA4): seguimiento de visitas y comportamiento del usuario.",
      "Formulario de contacto conectado a Supabase (Postgres gestionado): captura de interesados en una base de datos propia, sin servidor propio que mantener.",
    ],
    results: [
      "Landing publicada en producción con las secciones principales del scanner de etiquetas por IA, las restricciones alimentarias activas y el acceso directo a la PWA.",
      "SEO técnico, accesibilidad WCAG AA y analíticas GA4 configuradas desde el lanzamiento.",
    ],
    learnings: [
      "Comunicar tres restricciones alimentarias distintas en un solo CTA sin perder claridad exige priorizar la acción sobre la lista de condiciones: 'fotografía el producto' convierte más que enumerar las restricciones.",
    ],
    caseStudy: true,
    schemaType: "WebSite",
    metaDescription:
      "Caso de estudio de OKroot Landing: landing en Astro y Tailwind CSS que comunica el scanner de etiquetas por IA y las restricciones alimentarias compatibles.",
    links: [
      {
        href: "https://okroot.co/",
        text: "Ver sitio",
        ariaLabel: "Ver landing de OKroot",
      },
    ],
    en: {
      imageAlt: "OKroot landing: AI food label scanner for dietary restrictions",
      problem:
        "A multi-restriction diet app needs to communicate with precision who it is for and what it does before the user installs or tries it.",
      solution:
        "OKroot landing that explains the AI label scanner, the compatible active restrictions (celiac disease, diabetes, lactose intolerance), and access to the PWA.",
      links: [
        {
          href: "https://okroot.co/",
          text: "Visit site",
          ariaLabel: "Visit OKroot landing",
        },
      ],
      metaDescription:
        "OKroot Landing case study: landing in Astro and Tailwind CSS that communicates the AI label scanner and compatible dietary restrictions.",
      architecture: [
        "Astro with static output: section components and continuous deployment to Vercel.",
        "Tailwind CSS for responsive design.",
        "Technical SEO: title, meta-description, Open Graph, Twitter Card, canonical, and schema markup.",
        "Accessibility (a11y): heading hierarchy, aria-labels, and WCAG AA contrast.",
        "Performance: static output, WebP images, and immutable cache on Vercel.",
        "Google Analytics (GA4): visit tracking and user behavior.",
        "Contact form connected to Supabase (managed Postgres): captures interested users in an owned database, with no own server to maintain.",
      ],
      results: [
        "Landing published in production with the main sections of the AI label scanner, the active dietary restrictions, and direct access to the PWA.",
        "Technical SEO, WCAG AA accessibility, and GA4 analytics configured from launch.",
      ],
      learnings: [
        "Communicating three distinct dietary restrictions in a single CTA without losing clarity requires prioritizing the action over the conditions list: 'photograph the product' converts better than listing the restrictions.",
      ],
    },
  },
  {
    title: "NullBreach",
    slug: "nullbreach",
    datePublished: "2026-06-16",
    dateModified: "2026-06-16",
    tag: "Live",
    tagColor: "green",
    image: "images/og-nullbreach.webp",
    imageAlt:
      "NullBreach: análisis estático de código contra OWASP Top 10 y chat de seguridad con IA",
    imageWidth: 1200,
    imageHeight: 630,
    stack: ["Django", "DRF", "PostgreSQL", "JWT", "Claude API", "React", "TypeScript", "Astro"],
    appCategory: "SecurityApplication",
    programmingLanguage: ["Python", "TypeScript", "SQL"],
    summary:
      "App full stack: pegas un fragmento de código y recibes un diagnóstico OWASP Top 10 inmediato, con chat de IA de contexto persistente (Claude API). Django, DRF, PostgreSQL, React, Astro.",
    filters: ["full-stack", "ia"],
    problem:
      "Revisar código con criterio OWASP o resolver una duda puntual de ciberseguridad implica saltar entre scanners pesados, documentación dispersa y foros desactualizados.",
    solution:
      "El desarrollador pega un fragmento de código y recibe un diagnóstico inmediato contra OWASP Top 10. Puede seguir preguntando en un chat de IA que recuerda el hilo, sin repetir contexto, sin saltar entre herramientas.",
    architecture: [
      "Motor de análisis estático de fragmentos de código: detecta SQL injection, XSS, hardcoded secrets, manejo inseguro de errores y otras vulnerabilidades del OWASP Top 10.",
      "Chat de IA integrado via Claude API con contexto persistente de conversación e historial por usuario almacenado en base de datos.",
      "Autenticación JWT con endpoints protegidos; respuestas paginadas.",
      "Arquitectura desacoplada: backend en Django REST Framework + PostgreSQL, frontend en Astro + React + TypeScript.",
    ],
    links: [
      {
        href: "https://wavival.dev/nullbreach/",
        text: "Ver sitio",
        ariaLabel: "Ver sitio de NullBreach",
        event: "ver-app-nullbreach",
      },
      {
        href: "https://github.com/wavival/nullbreach-api",
        text: "Ver repositorio",
        ariaLabel: "Ver repositorio de NullBreach",
      },
    ],
    caseStudy: true,
    schemaType: "SoftwareApplication",
    metaDescription:
      "Caso de estudio de NullBreach: app fullstack con análisis estático OWASP Top 10 y chat de IA (Claude API) con contexto persistente. Django, DRF, React y Astro.",
    results: [
      "Análisis estático en producción que detecta vulnerabilidades del OWASP Top 10 (SQL injection, XSS, hardcoded secrets y manejo inseguro de errores, entre otras) sobre fragmentos de código pegados por el usuario.",
      "Chat de seguridad con contexto e historial persistente por usuario: la conversación retiene el hilo entre mensajes en lugar de empezar de cero en cada consulta.",
      "Acceso protegido con autenticación JWT y respuestas paginadas, sobre un backend Django REST Framework + PostgreSQL desacoplado de un frontend en Astro + React.",
    ],
    learnings: [
      "Combinar análisis estático determinista con un LLM exige separar lo que el motor afirma con certeza de lo que el modelo sugiere: presentarlos como una sola respuesta erosiona la confianza en un producto de seguridad.",
      "Desacoplar el backend de Django del frontend en Astro impuso un contrato de API explícito desde el inicio; esa frontera obligó a pensar paginación, autenticación JWT y persistencia del historial como parte del diseño, no como añadidos posteriores.",
      "El prompt engineering para seguridad no es pedir 'busca vulnerabilidades': exige fijar el marco (OWASP Top 10), el formato de salida (categoría, severidad, recomendación) y el rol del modelo, para que el diagnóstico sea estructurado y comparable entre análisis.",
    ],
    painPoints: [
      {
        title: "Scanners con curva alta",
        text: "Semgrep o SonarQube resuelven mucho, pero montar y afinar las reglas cuesta un tiempo que una duda puntual no justifica.",
      },
      {
        title: "Respuestas dispersas",
        text: "La guía vive repartida entre documentación densa y foros que envejecen mal.",
      },
      {
        title: "Sin memoria del análisis",
        text: "Las herramientas no conversan: cada pregunta nueva obliga a re-explicar el código.",
      },
    ],
    modules: [
      {
        name: "Análisis OWASP",
        text: "Pega un fragmento y recibe un diagnóstico contra el OWASP Top 10 en el momento.",
      },
      {
        name: "Chat con memoria",
        text: "Pregunta de seguimiento sin repetir el código: el chat retiene el hilo del análisis.",
      },
      {
        name: "Diagnóstico estructurado",
        text: "Cada hallazgo trae categoría OWASP, severidad y recomendación de corrección.",
      },
      {
        name: "API pública",
        text: "El backend está abierto en github.com/wavival/nullbreach-api.",
      },
    ],
    decisions: [
      {
        title: "Claude API vs análisis estático tradicional",
        context:
          "Los SAST tradicionales (Semgrep, SonarQube) detectan patrones, pero no explican el porqué ni razonan sobre código fuera de sus reglas.",
        tradeoff:
          "Un motor de reglas es determinista y rápido, pero rígido: no generaliza a código nuevo ni da una explicación accionable.",
        decision:
          "Claude API aporta razonamiento estructurado sobre el fragmento: clasifica contra OWASP Top 10, explica la causa y propone la corrección. El análisis determinista se mantiene para lo que se afirma con certeza; el modelo aporta el razonamiento, etiquetado como tal.",
      },
      {
        title: "Contexto de chat persistente",
        context:
          "Una consulta de seguridad tiene contexto: el dev no repite el fragmento ni el fondo en cada mensaje.",
        tradeoff:
          "Un chat sin estado es más simple, pero obliga a repetir contexto y rompe el hilo del análisis.",
        decision:
          "Historial de conversación en base de datos, enviado como contexto en cada petición. El modelo recuerda el hilo sin que el usuario lo repita.",
      },
      {
        title: "JWT para aislar sesiones de análisis",
        context:
          "Cada usuario analiza código potencialmente sensible; sus sesiones y su historial no pueden mezclarse.",
        tradeoff:
          "Las sesiones por cookie son cómodas, pero acoplan un frontend y un backend desacoplados y complican el aislamiento entre usuarios.",
        decision:
          "Autenticación JWT con endpoints protegidos: cada análisis e historial queda aislado por usuario, encaja con el backend desacoplado y no asume estado de sesión compartido.",
      },
      {
        title: "Astro para el frontend",
        context:
          "El frontend de NullBreach es mayormente contenido y formularios de análisis, no una SPA pesada.",
        tradeoff:
          "Una SPA pura penaliza el arranque y el SEO con JavaScript que la mayoría de la página no necesita.",
        decision:
          "Astro con output estático e islas de React solo donde hay interactividad (análisis, chat): mejor rendimiento y SEO sin renunciar a React donde aporta.",
      },
      {
        title: "Django + DRF como backbone",
        context:
          "NullBreach comparte stack con TerraCore y Root: Django REST Framework + PostgreSQL.",
        tradeoff:
          "Elegir un stack distinto por proyecto puede optimizar casos puntuales, pero fragmenta el conocimiento y ralentiza el mantenimiento.",
        decision:
          "Mismo backbone Django + DRF en todos los proyectos: patrones coherentes (serializers, auth JWT, paginación) que aceleran construir y mantener cada uno.",
      },
    ],
    en: {
      summary:
        "Full stack app: paste a code snippet and get an immediate OWASP Top 10 diagnosis, with a persistent-context AI chat (Claude API). Django, DRF, PostgreSQL, React, Astro.",
      imageAlt: "NullBreach: static code analysis against OWASP Top 10 and AI security chat",
      problem:
        "Reviewing code with OWASP criteria or resolving a specific cybersecurity question means jumping between heavy scanners, scattered documentation, and outdated forums.",
      solution:
        "The developer pastes a code snippet and gets an immediate diagnosis against OWASP Top 10. They can keep asking in an AI chat that remembers the thread, without repeating context or switching between tools.",
      links: [
        {
          href: "https://wavival.dev/nullbreach/",
          text: "Visit site",
          ariaLabel: "Visit NullBreach",
          event: "ver-app-nullbreach",
        },
        {
          href: "https://github.com/wavival/nullbreach-api",
          text: "View repo",
          ariaLabel: "View NullBreach repository",
        },
      ],
      metaDescription:
        "NullBreach case study: fullstack app with static OWASP Top 10 analysis and AI chat (Claude API) with persistent context. Django, DRF, React, and Astro.",
      architecture: [
        "Static code fragment analysis engine: detects SQL injection, XSS, hardcoded secrets, insecure error handling, and other OWASP Top 10 vulnerabilities.",
        "Integrated AI chat via Claude API with persistent conversation context and per-user history stored in the database.",
        "JWT authentication with protected endpoints; paginated responses.",
        "Decoupled architecture: backend in Django REST Framework + PostgreSQL, frontend in Astro + React + TypeScript.",
      ],
      painPoints: [
        {
          title: "Scanners with a steep curve",
          text: "Semgrep or SonarQube solve a lot, but setting up and tuning the rules costs time a quick question does not justify.",
        },
        {
          title: "Scattered answers",
          text: "Guidance is spread across dense documentation and forums that age badly.",
        },
        {
          title: "No memory of the analysis",
          text: "The tools do not converse: every new question forces re-explaining the code.",
        },
      ],
      modules: [
        {
          name: "OWASP analysis",
          text: "Paste a snippet and get a diagnosis against the OWASP Top 10 on the spot.",
        },
        {
          name: "Chat with memory",
          text: "Ask follow-ups without repeating the code: the chat retains the analysis thread.",
        },
        {
          name: "Structured diagnosis",
          text: "Each finding carries an OWASP category, severity, and a remediation recommendation.",
        },
        {
          name: "Public API",
          text: "The backend is open at github.com/wavival/nullbreach-api.",
        },
      ],
      decisions: [
        {
          title: "Claude API vs traditional static analysis",
          context:
            "Traditional SAST tools (Semgrep, SonarQube) match patterns but do not explain the why or reason about code outside their rules.",
          tradeoff:
            "A rule engine is deterministic and fast but rigid: it does not generalize to new code or give an actionable explanation.",
          decision:
            "Claude API brings structured reasoning over the snippet: it classifies against OWASP Top 10, explains the cause, and proposes the fix. Deterministic analysis stays for what it asserts with certainty; the model adds the reasoning, labeled as such.",
        },
        {
          title: "Persistent chat context",
          context:
            "Security questions have context: a developer does not repeat the full background on every message.",
          tradeoff:
            "Stateless chat is simpler but forces the user to repeat context and breaks the analysis thread.",
          decision:
            "Conversation history stored in the database and sent as context on each request. The model remembers the thread without the user repeating it.",
        },
        {
          title: "JWT to isolate analysis sessions",
          context:
            "Each user analyzes potentially sensitive code; their sessions and history cannot mix.",
          tradeoff:
            "Cookie sessions are convenient but couple the decoupled frontend and backend and complicate per-user isolation.",
          decision:
            "JWT authentication with protected endpoints: each analysis and history is isolated per user, fits the decoupled backend, and assumes no shared session state.",
        },
        {
          title: "Astro for the frontend",
          context: "NullBreach's frontend is mostly content and analysis forms, not a heavy SPA.",
          tradeoff:
            "A pure SPA penalizes startup and SEO with JavaScript most of the page does not need.",
          decision:
            "Astro with static output and React islands only where there is interactivity (analysis, chat): better performance and SEO without giving up React where it adds value.",
        },
        {
          title: "Django + DRF as the backbone",
          context:
            "NullBreach shares its stack with TerraCore and Root: Django REST Framework + PostgreSQL.",
          tradeoff:
            "Choosing a different stack per project can optimize specific cases but fragments knowledge and slows maintenance.",
          decision:
            "Same Django + DRF backbone across all projects: consistent patterns (serializers, JWT auth, pagination) that speed up building and maintaining each one.",
        },
      ],
      results: [
        "Static analysis in production that detects OWASP Top 10 vulnerabilities (SQL injection, XSS, hardcoded secrets, and insecure error handling, among others) on code snippets pasted by the user.",
        "Security chat with persistent context and history per user: the conversation retains the thread between messages instead of starting from scratch on each query.",
        "Protected access with JWT authentication and paginated responses, on a Django REST Framework + PostgreSQL backend decoupled from an Astro + React frontend.",
      ],
      learnings: [
        "Combining deterministic static analysis with an LLM requires separating what the engine asserts with certainty from what the model suggests: presenting them as a single response erodes trust in a security product.",
        "Decoupling the Django backend from the Astro frontend imposed an explicit API contract from the start; that boundary forced thinking about pagination, JWT authentication, and history persistence as part of the design, not as later additions.",
        "Prompt engineering for security is not asking 'find vulnerabilities': it requires fixing the framework (OWASP Top 10), the output format (category, severity, recommendation), and the model's role, so the diagnosis is structured and comparable across analyses.",
      ],
    },
  },
  {
    title: "Lúmina W",
    slug: "lumina-w",
    datePublished: "2026-06-16",
    dateModified: "2026-06-16",
    tag: "Live",
    tagColor: "green",
    image: "images/lumina-w.webp",
    imageAlt: "Landing de Lúmina W: hero con tagline de marca y llamado a la acción",
    imageWidth: 1280,
    imageHeight: 853,
    stack: ["Astro", "Tailwind CSS", "Supabase", "SEO", "A11y", "GA4", "Performance"],
    filters: ["landing", "diseno"],
    problem:
      "Toda empresa necesita una presencia digital que comunique con claridad quién es y qué hace.",
    solution:
      "Diseñé e implementé la landing completa de Lúmina W: arquitectura con Astro, estilos con Tailwind CSS, formulario de contacto sobre Supabase, SEO técnico completo y deploy continuo.",
    architecture: [
      "Astro con output estático: componentes por sección, build optimizado y deploy continuo en Vercel.",
      "SEO técnico completo: title, meta-description, og:*, twitter:*, canonical y schema markup.",
      "Accesibilidad (a11y): jerarquía de encabezados, aria-labels y contraste WCAG AA.",
      "Performance: output estático, imágenes WebP y caché inmutable en Vercel.",
      "Analíticas de Google (GA4): seguimiento de visitas, scroll depth y comportamiento del usuario.",
      "Formulario de contacto sobre Supabase (Postgres gestionado): nombre, empresa, correo y mensaje persistidos en una base de datos propia, sin servidor que mantener.",
      "Diseño responsivo con Tailwind CSS y modo claro/oscuro.",
      "Estructura de dos tracks de negocio: desarrollo a medida y SaaS en alquiler (TerraCore), cada uno con su propio flujo de fases.",
    ],
    painPoints: [
      {
        title: "Sin presencia digital",
        text: "Sin landing, Lúmina W no tenía dónde enviar prospectos, comunicar la propuesta ni cerrar una conversación comercial.",
      },
      {
        title: "Dos servicios difíciles de comunicar juntos",
        text: "Desarrollo a medida y SaaS tienen compradores distintos. Mezclarlos sin estructura confunde en vez de convertir.",
      },
    ],
    decisions: [
      {
        title: "Dos tracks explícitos en vez de un solo servicio",
        context:
          "Lúmina W ofrece desarrollo a medida y SaaS. Los compradores de cada track tienen necesidades, tiempos y presupuestos distintos.",
        tradeoff:
          "Una landing genérica de 'hacemos software' no convierte. Separar los tracks añade complejidad visual pero clarifica la propuesta.",
        decision:
          "Sección de servicios con dos columnas claras: desarrollo a medida (proceso en 4 fases) y SaaS en alquiler (TerraCore). Cada track tiene su propio CTA.",
      },
      {
        title: "TerraCore como prueba de capacidad",
        context:
          "Un cliente potencial necesita ver producto real, no solo promesas de desarrollo a medida.",
        tradeoff:
          "Dedicar espacio a TerraCore en la landing de la agencia puede distraer. No hacerlo deja el argumento de capacidad sin evidencia.",
        decision:
          "Sección dedicada a TerraCore con módulos, características y CTA. Funciona como caso de uso propio que prueba que Lúmina W construye lo que predica.",
      },
      {
        title: "Formulario sobre Supabase, sin servidor propio",
        context:
          "Una landing de agencia necesita capturar leads desde el primer día sin infraestructura propia de backend.",
        tradeoff:
          "Construir y hostear un backend de contacto propio toma tiempo y es sobredimensionado para una landing. Supabase aporta Postgres gestionado y API instantánea, asi que los leads quedan en una base de datos propia y consultable sin montar servidor.",
        decision:
          "Supabase para el formulario de contacto: Postgres gestionado con API instantánea, sin servidor que mantener y con los leads guardados en una base de datos propia y consultable.",
      },
    ],
    results: [
      "Landing completa de Lúmina W en producción con dos tracks de servicio diferenciados y formulario de contacto funcional.",
      "TerraCore visible como producto propio dentro de la landing, funcionando como prueba de capacidad de la agencia.",
      "Formulario de contacto activo sobre Supabase: captura nombre, empresa, correo y mensaje en Postgres gestionado, sin servidor propio que mantener.",
    ],
    learnings: [
      "Comunicar dos servicios distintos (desarrollo a medida y SaaS) en una sola landing exige estructura clara: sin separar los tracks por comprador, la propuesta se diluye.",
      "Supabase da una base de datos propia y consultable sin montar servidor: para una agencia en arranque, esa decisión redujo el tiempo de lanzamiento y dejó los leads bajo control propio.",
    ],
    caseStudy: true,
    schemaType: "WebSite",
    metaDescription:
      "Caso de estudio de Lúmina W: landing completa con Astro, Tailwind CSS y Supabase. SEO técnico, formulario de contacto y deploy continuo en Vercel.",
    links: [{ href: "https://luminaw.co", text: "Ver sitio", ariaLabel: "Ver sitio de Lúmina W" }],
    en: {
      imageAlt: "Lumina W landing: brand tagline and call to action",
      problem:
        "Every company needs a digital presence that clearly communicates who they are and what they do.",
      solution:
        "I designed and implemented the complete Lumina W landing: Astro architecture, Tailwind CSS styling, Supabase-backed contact form, full technical SEO, and continuous deployment.",
      links: [{ href: "https://luminaw.co", text: "Visit site", ariaLabel: "Visit Lumina W" }],
      metaDescription:
        "Lumina W case study: complete landing with Astro, Tailwind CSS, and Supabase. Technical SEO, contact form, and continuous deployment to Vercel.",
      architecture: [
        "Astro with static output: section components, optimized build, and continuous deployment to Vercel.",
        "Full technical SEO: title, meta-description, og:*, twitter:*, canonical, and schema markup.",
        "Accessibility (a11y): heading hierarchy, aria-labels, and WCAG AA contrast.",
        "Performance: static output, WebP images, and immutable cache on Vercel.",
        "Google Analytics (GA4): session tracking, scroll depth, and user behavior.",
        "Contact form on Supabase (managed Postgres): name, company, email, and message persisted in an owned database, with no server to maintain.",
        "Responsive design with Tailwind CSS and light/dark mode.",
        "Two-track business structure: custom development and SaaS rental (TerraCore), each with its own phase flow.",
      ],
      painPoints: [
        {
          title: "No digital presence",
          text: "Without a landing, Lumina W had nowhere to send prospects, communicate the proposition, or close a commercial conversation.",
        },
        {
          title: "Two services hard to communicate together",
          text: "Custom development and SaaS have different buyers. Mixing them without structure confuses instead of converting.",
        },
      ],
      decisions: [
        {
          title: "Two explicit tracks instead of one service",
          context:
            "Lumina W offers custom development and SaaS. Buyers for each track have different needs, timelines, and budgets.",
          tradeoff:
            "A generic 'we make software' landing does not convert. Separating the tracks adds visual complexity but clarifies the proposition.",
          decision:
            "Services section with two clear columns: custom development (4-phase process) and SaaS rental (TerraCore). Each track has its own CTA.",
        },
        {
          title: "TerraCore as proof of capability",
          context:
            "A potential client needs to see a real product, not just custom development promises.",
          tradeoff:
            "Dedicating space to TerraCore on the agency landing may distract. Not doing it leaves the capability argument without evidence.",
          decision:
            "Section dedicated to TerraCore with modules, features, and CTA. It works as a proprietary case that proves Lumina W builds what it preaches.",
        },
        {
          title: "Contact form on Supabase, no own server",
          context:
            "An agency landing needs to capture leads from day one without own backend infrastructure.",
          tradeoff:
            "Building and hosting an own contact backend takes time and is oversized for a landing. Supabase provides managed Postgres and an instant API, so leads land in an owned, queryable database with no server to run.",
          decision:
            "Supabase for the contact form: managed Postgres with an instant API, no server to maintain, and leads stored in an owned, queryable database.",
        },
      ],
      results: [
        "Complete Lumina W landing in production with two differentiated service tracks and functional contact form.",
        "TerraCore visible as a proprietary product within the landing, functioning as proof of agency capability.",
        "Active contact form on Supabase: captures name, company, email, and message in managed Postgres, with no own server to maintain.",
      ],
      learnings: [
        "Communicating two distinct services (custom development and SaaS) on a single landing requires clear structure: without separating tracks by buyer, the proposition is diluted.",
        "Supabase gives an owned, queryable database without standing up a server: for a starting agency, that decision reduced launch time and kept the leads under own control.",
      ],
    },
  },
  {
    title: "Blog Lúmina W",
    slug: "blog-lumina-w",
    datePublished: "2026-06-18",
    dateModified: "2026-06-18",
    tag: "Live",
    tagColor: "green",
    image: "images/lumina-w.webp",
    imageAlt:
      "Blog de Lúmina W: contenido técnico sobre desarrollo web, ciberseguridad y productos digitales",
    imageWidth: 1280,
    imageHeight: 853,
    stack: ["Astro", "Tailwind CSS", "SEO", "A11y", "GA4", "Performance"],
    filters: ["landing"],
    problem:
      "El conocimiento técnico generado en proyectos reales necesita un canal propio para llegar a la comunidad sin depender de plataformas externas.",
    solution:
      "Blog de Lúmina W con contenido técnico sobre desarrollo web, ciberseguridad y productos digitales, publicado en blog.luminaw.co. 'Escribimos sobre lo que construimos, lo que rompemos y lo que descubrimos. Sin filtro corporativo.'",
    architecture: [
      "Astro con output estático: build optimizado, rutas por artículo y deploy continuo en Vercel.",
      "Tailwind CSS para diseño responsivo.",
      "Contenido organizado por categorías: SaaS y producto, seguridad, desarrollo web.",
      "Sin CMS externo: artículos en Markdown/MDX dentro del repositorio.",
      "SEO técnico por artículo: title, meta-description, Open Graph, canonical y schema markup.",
      "Accesibilidad (a11y): jerarquía de encabezados, aria-labels y contraste WCAG AA.",
      "Performance: output estático, tiempos de carga optimizados y caché inmutable en Vercel.",
      "Analíticas de Google (GA4): seguimiento de visitas y artículos más leídos.",
    ],
    results: [
      "Blog en producción con contenido técnico sobre desarrollo web, ciberseguridad y productos digitales.",
      "SEO técnico, accesibilidad WCAG AA y analíticas GA4 configuradas por artículo desde el lanzamiento.",
    ],
    learnings: [
      "Publicar sin CMS externo (artículos en Markdown dentro del repositorio) mantiene el control editorial completo y elimina dependencias externas, pero exige establecer una convención de estructura de archivos y metadatos desde el primer artículo.",
    ],
    caseStudy: true,
    schemaType: "WebSite",
    metaDescription:
      "Caso de estudio del Blog de Lúmina W: blog estático con Astro y Tailwind CSS para contenido técnico sobre desarrollo web, ciberseguridad y productos.",
    links: [
      {
        href: "https://blog.luminaw.co",
        text: "Ver sitio",
        ariaLabel: "Ver blog de Lúmina W",
      },
    ],
    en: {
      imageAlt:
        "Lumina W blog: technical content on web development, cybersecurity, and digital products",
      problem:
        "Technical knowledge generated in real projects needs its own channel to reach the community without depending on external platforms.",
      solution:
        "Lumina W blog with technical content on web development, cybersecurity, and digital products, published at blog.luminaw.co. 'We write about what we build, what we break, and what we discover. No corporate filter.'",
      links: [
        {
          href: "https://blog.luminaw.co",
          text: "Visit site",
          ariaLabel: "Visit Lumina W blog",
        },
      ],
      metaDescription:
        "Lumina W Blog case study: static blog with Astro and Tailwind CSS for technical content on web development, cybersecurity, and products.",
      architecture: [
        "Astro with static output: optimized build, per-article routes, and continuous deployment to Vercel.",
        "Tailwind CSS for responsive design.",
        "Content organized by categories: SaaS and product, security, web development.",
        "No external CMS: articles in Markdown/MDX within the repository.",
        "Technical SEO per article: title, meta-description, Open Graph, canonical, and schema markup.",
        "Accessibility (a11y): heading hierarchy, aria-labels, and WCAG AA contrast.",
        "Performance: static output, optimized load times, and immutable cache on Vercel.",
        "Google Analytics (GA4): visit tracking and most-read articles.",
      ],
      results: [
        "Blog in production with technical content on web development, cybersecurity, and digital products.",
        "Technical SEO, WCAG AA accessibility, and GA4 analytics configured per article from launch.",
      ],
      learnings: [
        "Publishing without an external CMS (articles in Markdown within the repository) maintains full editorial control and eliminates external dependencies, but requires establishing a file structure and metadata convention from the first article.",
      ],
    },
  },
  {
    title: "Forgotten Portal",
    slug: "forgotten-portal",
    datePublished: "2026-06-16",
    dateModified: "2026-06-16",
    tag: "Laboratorio",
    tagColor: "gray",
    image: "images/forgotten-portal.webp",
    imageAlt: "Forgotten Portal: laboratorio de pentesting (DockerLabs)",
    imageWidth: 1280,
    imageHeight: 853,
    stack: ["Nmap", "Gobuster", "Netcat", "Python", "MITRE ATT&CK", "PTES", "Linux", "DockerLabs"],
    filters: [],
    problem:
      "¿Qué tan vulnerable es un sistema mal configurado ante un atacante con acceso inicial mínimo?",
    solution:
      "Ejercicio completo de pentesting ofensivo sobre máquina virtual en DockerLabs, documentado con metodología PTES y TTPs mapeados a MITRE ATT&CK.",
    architecture: [
      "Reconocimiento con Nmap (puertos, servicios, versiones) y Gobuster (directorios expuestos).",
      "Explotación de upload PHP sin validación (CWE-434) para ejecutar código remoto.",
      "Reverse shell con Netcat y escalada de privilegios a root.",
      "Vulnerabilidades clasificadas: CWE-615, CWE-434, CWE-312, CWE-321, CWE-269.",
      "Writeup completo publicado con metodología PTES y TTPs de MITRE ATT&CK.",
    ],
    links: [
      {
        href: "https://blog.luminaw.co/forgotten-portal-pentesting-dockerlabs/",
        text: "Ver writeup",
        ariaLabel: "Ver writeup de Forgotten Portal",
      },
      {
        href: "https://github.com/wavival/forgotten-portal-writeup",
        text: "Ver repositorio",
        ariaLabel: "Ver repositorio de Forgotten Portal",
      },
    ],
    caseStudy: true,
    schemaType: "CreativeWork",
    metaDescription:
      "Caso de estudio de Forgotten Portal: pentesting ofensivo sobre DockerLabs con metodología PTES, vulnerabilidades CWE y TTPs mapeados a MITRE ATT&CK.",
    en: {
      imageAlt: "Forgotten Portal: pentesting lab (DockerLabs)",
      tag: "Lab",
      problem:
        "How vulnerable is a misconfigured system to an attacker with minimal initial access?",
      solution:
        "Complete offensive pentesting exercise on a virtual machine in DockerLabs, documented with PTES methodology and TTPs mapped to MITRE ATT&CK.",
      links: [
        {
          href: "https://blog.luminaw.co/forgotten-portal-pentesting-dockerlabs/",
          text: "View writeup",
          ariaLabel: "View Forgotten Portal writeup",
        },
        {
          href: "https://github.com/wavival/forgotten-portal-writeup",
          text: "View repo",
          ariaLabel: "View Forgotten Portal repository",
        },
      ],
      metaDescription:
        "Forgotten Portal case study: offensive pentesting on DockerLabs with PTES methodology, classified CWE vulnerabilities, and TTPs mapped to MITRE ATT&CK.",
      architecture: [
        "Reconnaissance with Nmap (ports, services, versions) and Gobuster (exposed directories).",
        "Exploitation of PHP upload without validation (CWE-434) to execute remote code.",
        "Reverse shell with Netcat and privilege escalation to root.",
        "Vulnerabilities classified: CWE-615, CWE-434, CWE-312, CWE-321, CWE-269.",
        "Complete writeup published with PTES methodology and MITRE ATT&CK TTPs.",
      ],
      painPoints: [
        {
          title: "Credentials in the HTML",
          text: "The username and hidden portal path were visible in the page source code comments.",
        },
        {
          title: "Upload without real validation",
          text: "The server accepted PHP files without verifying the real type: any web shell passed disguised as a legitimate document.",
        },
        {
          title: "Shared SSH key",
          text: "The same id_rsa was distributed across multiple system accounts, turning one access into an immediate lateral pivot.",
        },
      ],
      chainStepsTitle: "Attack chain: 7 phases, none depend on a zero-day.",
      chainSteps: [
        "Reconnaissance: Nmap detects Apache 2.4.58 on port 80",
        "Discovery: HTML comment exposes user 'Bob' and path /m4ch1n3_upload.html",
        "Initial access: PHP web shell uploaded to /uploads via form with no validation",
        "Remote shell: Bash payload over Netcat establishes interactive reverse shell",
        "Horizontal escalation: Base64 credential in access_log decoded (alice:s3cr3tp@ssw0rd^487)",
        "Lateral pivot: shared id_rsa allows moving to bob's account",
        "Okroot: sudo tar without password exploited via GTFOBins, full system access",
      ],
      results: [
        "Full machine compromise in 7 phases without using zero-day exploits: all vectors are configuration errors and human mistakes reproducible in real environments.",
        "Five vulnerabilities identified and classified with CWE: information exposed in comments (CWE-615), unrestricted upload (CWE-434), credentials in logs (CWE-312), reused SSH key (CWE-321), and excessive sudo (CWE-269).",
        "User flag captured and root access confirmed. Complete writeup documented with PTES methodology and TTPs mapped to MITRE ATT&CK.",
      ],
      learnings: [
        "Security does not end at server code: an HTML comment with a username and a hidden path is enough to launch a full attack. Everything the server sends to the browser is an attack surface.",
        "Validating a file extension is not the same as validating its real type: a PHP web shell with an allowed extension executes arbitrary code on the server. Validation happens at the server-verified MIME type and by preventing the upload directory from executing code.",
      ],
    },
    painPoints: [
      {
        title: "Credenciales en el HTML",
        text: "El nombre de usuario y la ruta del portal oculto estaban visibles en los comentarios del codigo fuente de la pagina.",
      },
      {
        title: "Upload sin validacion real",
        text: "El servidor aceptaba archivos PHP sin verificar el tipo real: cualquier web shell pasaba disfrazado de documento legitimo.",
      },
      {
        title: "Clave SSH compartida",
        text: "La misma id_rsa estaba distribuida en varias cuentas del sistema, convirtiendo un acceso en pivote lateral inmediato.",
      },
    ],
    chainStepsTitle: "Cadena de ataque: 7 fases, ninguna depende de un zero-day.",
    chainSteps: [
      "Reconocimiento: Nmap detecta Apache 2.4.58 en el puerto 80",
      "Descubrimiento: comentario HTML expone usuario 'Bob' y ruta /m4ch1n3_upload.html",
      "Acceso inicial: web shell PHP subida a /uploads via formulario sin validacion",
      "Shell remota: payload Bash sobre Netcat establece reverse shell interactiva",
      "Escalada horizontal: credencial Base64 en access_log decodificada (alice:s3cr3tp@ssw0rd^487)",
      "Pivote lateral: id_rsa compartida permite moverse a la cuenta de bob",
      "Okroot: sudo tar sin contrasena explotado via GTFOBins, acceso total al sistema",
    ],
    results: [
      "Compromiso total de la maquina en 7 fases sin usar exploits de dia cero: todos los vectores son errores de configuracion y errores humanos reproducibles en entornos reales.",
      "Cinco vulnerabilidades identificadas y clasificadas con CWE: informacion expuesta en comentarios (CWE-615), upload sin restricciones (CWE-434), credenciales en logs (CWE-312), clave SSH reutilizada (CWE-321) y sudo excesivo (CWE-269).",
      "User flag capturada y acceso root confirmado. Writeup completo documentado con metodologia PTES y TTPs mapeados a MITRE ATT&CK.",
    ],
    learnings: [
      "La seguridad no termina en el codigo del servidor: un comentario HTML con un nombre de usuario y una ruta oculta basta para iniciar un ataque completo. Todo lo que el servidor envia al navegador es superficie de ataque.",
      "Validar la extension de un archivo no es lo mismo que validar su tipo real: un web shell PHP con extension permitida ejecuta codigo arbitrario en el servidor. La validacion ocurre en el MIME type verificado en servidor y en evitar que el directorio de subida ejecute codigo.",
    ],
  },
];

export const caseStudies = projects.filter((p) => p.caseStudy);
