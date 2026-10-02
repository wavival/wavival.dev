import type { QuoteProjectType } from "@/data/quoteTypes";

export interface ProjectLink {
  href: string;
  text: string;
  ariaLabel: string;
  /** Optional Umami event name for click tracking (e.g. "ver-app-terracore"). */
  event?: string;
}

export interface ProjectChain {
  title: string;
  steps: string[];
}

export interface ProjectRoadmap {
  now: string[];
  next: string[];
  later: string[];
  out?: string[];
}

export interface ProjectEn {
  imageAlt?: string;
  tag?: string;
  problem: string;
  solution: string;
  /** Short TL;DR shown above the numbered sections. Falls back to the first sentence of `solution`. */
  summary?: string;
  links: ProjectLink[];
  designLink?: ProjectLink;
  designSystemLink?: ProjectLink;
  metaDescription?: string;
  architecture?: string[];
  decisions?: { title: string; context: string; tradeoff: string; decision: string }[];
  results?: string[];
  learnings?: string[];
  painPoints?: { title: string; text: string }[];
  modules?: { name: string; text: string }[];
  chainSteps?: string[];
  chainStepsTitle?: string;
  chains?: ProjectChain[];
  design?: string[];
  roadmap?: ProjectRoadmap;
}

export interface Project {
  title: string;
  slug: string;
  /** Project type preselected in the quote form when coming from this case study. */
  quoteType: QuoteProjectType;
  tag: string;
  tagColor: "green" | "blue" | "orange" | "gray";
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  stack: string[];
  /** Filter tags: full-stack, ai, pwa, landing, design, security */
  filters?: string[];
  problem: string;
  solution: string;
  /** Short TL;DR shown above the numbered sections on the case study. Falls back to the first sentence of `solution`. */
  summary?: string;
  architecture?: string[];
  links: ProjectLink[];
  /** Design prototype link shown only inside the case study. */
  designLink?: ProjectLink;
  /** Design system link shown only inside the case study. */
  designSystemLink?: ProjectLink;
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
  /** Several cascade examples; takes precedence over chainSteps when set. */
  chains?: ProjectChain[];
  /** Design notes shown in their own case-study section. */
  design?: string[];
  /** Product roadmap shown as the last case-study section. */
  roadmap?: ProjectRoadmap;
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
    quoteType: "web-app",
    datePublished: "2026-06-16",
    dateModified: "2026-10-02",
    tag: "Live",
    tagColor: "green",
    image: "images/og-terracore.webp",
    imageAlt:
      "Dashboard de TerraCore: métricas en tiempo real, gráficas de producción y distribución de ganado",
    imageWidth: 1200,
    imageHeight: 630,
    stack: [
      "Django",
      "DRF",
      "PostgreSQL",
      "Celery",
      "Redis",
      "JWT",
      "React",
      "TypeScript",
      "Dexie",
      "Tailwind CSS",
    ],
    appCategory: "BusinessApplication",
    programmingLanguage: ["Python", "TypeScript", "SQL"],
    summary:
      "PWA multiusuario y offline-first para fincas colombianas. Registra animales, cultivos, insumos, producción, salud animal y finanzas en un solo sistema donde cada acción en un módulo actualiza los demás. Django, DRF, PostgreSQL, React y Dexie.",
    filters: ["full-stack", "pwa", "design"],
    problem:
      "Los productores agropecuarios en Colombia no contaban con software diseñado para ellos: los ERPs existentes eran demasiado complejos, y Excel con login no alcanzaba para gestionar animales, sanidad y producción al mismo tiempo. La operación terminaba repartida entre cuadernos, hojas de cálculo y grupos de WhatsApp.",
    solution:
      "TerraCore centraliza en una sola plataforma lo que una finca mediana necesita gestionar: animales, cultivos, insumos, producción, salud animal y finanzas. Los módulos están conectados entre sí, así que una acción en el campo actualiza los demás registros, y todo funciona sin señal. Lo usa un equipo completo, con roles y permisos por sede. Reemplaza Excel, cuadernos y WhatsApp como herramientas operativas y atiende bovino, porcino, equino, ovino, caprino, avícola y cultivos asociados (plátano, cacao, maíz) en Colombia.",
    architecture: [
      "Backend en Django 6 y DRF sobre PostgreSQL 16. Celery con Redis ejecuta las tareas programadas (cobros y alertas). Autenticación JWT: access de 24 horas y refresh de 180 días con rotación.",
      "Multitenancy estricta: el tenant sale del JWT, nunca del body ni de la URL, y todo queryset se filtra por tenant antes de responder.",
      "Lógica de negocio en servicios con transacciones y bloqueo de filas. Cada endpoint valida rol, plan y sede, y los errores siguen un contrato uniforme.",
      "Frontend en React 19, TypeScript, Vite y Tailwind 4, con una carpeta por módulo y un hook de estado por módulo.",
      "PWA instalable en Android e iOS sin pasar por tiendas. El Service Worker cachea la app y las lecturas; los datos viven en una base local (IndexedDB con Dexie) y cada escritura entra a una cola de salida (outbox).",
      "Sincronización con un endpoint que cubre diez modelos: push en orden de dependencias, pull paginado por cursor y versión por registro. El servidor responde aceptado, conflicto o rechazo con motivo, y revalida igual que la API REST.",
      "Offline más allá de los registros: una cola de acciones diferidas (invitar usuarios, cambiar roles) y lecturas guardadas para abrir cada pantalla sin red. Solo pagar con tarjeta exige conexión.",
      "Importación CSV para el onboarding y exportación CSV con aprobación de un administrador.",
      "Seguridad: documentación de la API restringida a staff y una ronda de hardening sobre sincronización, exportaciones, facturación y alcance por sede.",
      "Infraestructura en Docker y Nginx sobre VPS, con staging aislado y flujo dev, stg y main. La imagen se publica en GHCR con escaneo Trivy y se despliega por digest. Más de 1.000 pruebas automatizadas en cada repositorio.",
    ],
    links: [
      {
        href: "https://app.terracoreapp.co",
        text: "Ver app",
        ariaLabel: "Ver app de TerraCore",
        event: "ver-app-terracore",
      },
    ],
    designLink: {
      href: "https://terracore-pwa-prototype.netlify.app/",
      text: "Ver diseño",
      ariaLabel: "Ver diseño de TerraCore",
    },
    caseStudy: true,
    schemaType: "SoftwareApplication",
    metaDescription:
      "Caso de estudio de TerraCore: PWA multiusuario y offline-first para fincas colombianas. Django, DRF, PostgreSQL y React. Módulos conectados y en producción.",
    design: [
      "El producto nace de un diseño propio en Claude Design, con un prototipo navegable (botón Ver diseño).",
      "Verde profundo como color primario y ámbar como acento sobre neutros cálidos. Inter para texto y Poppins para títulos.",
      "Atomic design con tokens CSS compartidos con la landing: átomos, moléculas y organismos de layout.",
      "Navegación responsive: panel lateral desde 1024 px y barra inferior con hoja Más en móvil. Ambas salen de la misma fuente y una prueba falla si se desalinean.",
      "El estado offline siempre es visible: banner, contador de pendientes, marca Pendiente en cada fila y bandeja de rechazos.",
      "Con una sede activa, una etiqueta de alcance dice siempre si la pantalla muestra esa sede o todas.",
      "Formularios pensados para Colombia: teléfono con indicativo y banderas en SVG, y documento CC o CE. URLs en español y tour guiado en el primer uso.",
    ],
    results: [
      "Producto funcional en producción.",
      "En validación con clientes en Antioquia, Colombia.",
    ],
    learnings: [
      "Aprendí a diseñar, desarrollar y construir un producto completo desde cero (fullstack), con despliegue, y a depurarlo, probarlo y corregirlo.",
      "Definir el límite del tenant temprano evita reescrituras: el aislamiento de datos condiciona cada decisión de modelado.",
      "Offline-first cambia el modelo de datos: UUID generado en el cliente, versión por registro y borrado suave en cada modelo sincronizable.",
      "El sync no puede saltarse validaciones: se corrigió para validar igual que la API REST (roles, plan y sede).",
      "El stock offline se sincroniza como diferencia y no como valor absoluto, para no pisar movimientos hechos desde otro dispositivo.",
      "Conectar módulos obliga a decidir quién es dueño de cada dato: la sede de una vacuna es la de su animal.",
    ],
    roadmap: {
      now: ["Producto en producción y venta activa."],
      next: [
        "Eliminar el subsistema viejo de vacunación.",
        "Llevar el histórico de Finanzas a nivel de sede.",
      ],
      later: [
        "Mano de obra y costos fijos y variables (hoy en cero).",
        "Reportes a medida, API de integraciones y base DIAN y NIIF.",
      ],
      out: [
        "Forecasting financiero, facturación electrónica completa, multimoneda y reportes PDF automáticos.",
      ],
    },
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
      {
        title: "Datos desconectados",
        text: "El cuaderno dice que se vacunó, pero no cuánto insumo gastó ni cuánto costó.",
      },
    ],
    modules: [
      {
        name: "Panel",
        text: "Métricas calculadas desde el dispositivo: vacunas vencidas y próximas, stock bajo y actividad pendiente.",
      },
      {
        name: "Animales",
        text: "Código único, estado de salud, sede y detalle con historial de vacunación.",
      },
      {
        name: "Cultivos",
        text: "Tipo, estado, área y fecha de siembra, con búsqueda y filtros.",
      },
      {
        name: "Insumos",
        text: "Stock, mínimo, costo unitario e historial de movimientos con su razón.",
      },
      {
        name: "Herramientas",
        text: "Equipo, costo de compra y mantenimiento.",
      },
      {
        name: "Producción",
        text: "Lotes con insumos usados, precio de venta y margen.",
      },
      {
        name: "Salud animal",
        text: "Vacunas con insumo aplicado, costo y fecha de refuerzo.",
      },
      {
        name: "Finanzas",
        text: "Resumen, histórico, rentabilidad por lote, proveedores, compras y pérdidas, según el plan.",
      },
      {
        name: "Sedes y permisos",
        text: "Cada usuario ve solo las sedes que le corresponden.",
      },
      {
        name: "Usuarios y roles",
        text: "Administrador, Operario y Colaborador (solo lectura, según el plan), con invitaciones y topes por plan.",
      },
      {
        name: "Suscripción",
        text: "Plan, pago, historial y cancelación.",
      },
      {
        name: "Actividad",
        text: "Notificaciones por módulo y bandeja de rechazos de sincronización.",
      },
    ],
    chains: [
      {
        title: "Registras una vacuna y pasa esto solo",
        steps: [
          "Vacuna aplicada a un animal, con insumo, cantidad, costo y fecha de refuerzo.",
          "El insumo se descuenta en la misma transacción. Si no hay stock, el registro tampoco se crea.",
          'El historial de Insumos deja un movimiento "Vacuna registrada".',
          "El detalle del animal muestra la vacuna en su historial.",
          "El Panel cuenta las vacunas vencidas o próximas a vencer (30 días).",
          "El costo del tratamiento suma al gasto en salud del P&L del período.",
          "Si el stock cae bajo el mínimo, se alerta al equipo.",
          "Si el registro se borra, el insumo vuelve al stock.",
        ],
      },
      {
        title: "Registras un lote de producción",
        steps: [
          "Cada insumo usado se descuenta, validando el stock agrupado por insumo (todo o nada).",
          'El lote deja el movimiento "Producción registrada".',
          "Se calcula el costo del lote (cantidad por costo unitario) contra su ingreso (cantidad por precio de venta).",
          "Si el costo supera el ingreso, se alerta al administrador.",
          "El ingreso entra al P&L del período.",
        ],
      },
      {
        title: "Cambias la sede activa",
        steps: [
          "Todas las pantallas se recortan a esa sede.",
          "Una etiqueta de alcance indica si ves una sede o todas.",
          "La vacuna hereda la sede de su animal.",
        ],
      },
      {
        title: "Todo esto sin señal",
        steps: [
          "El mismo flujo se guarda en el dispositivo.",
          "Al volver la red se aplica en el servidor con las mismas reglas: stock, roles, plan y sede.",
        ],
      },
    ],
    decisions: [
      {
        title: "Offline-first con PWA",
        context:
          "En corrales y potreros la señal es intermitente o inexistente, y el registro queda para después.",
        tradeoff:
          "Una web tradicional falla sin red. Una app nativa exige tiendas y doble mantenimiento.",
        decision:
          "PWA instalable con base local en IndexedDB (Dexie). Cada escritura va a una cola y se sincroniza al volver la red. El Service Worker cachea la app y las lecturas.",
      },
      {
        title: "Módulos integrados con reglas en el servidor",
        context: "Una acción de campo toca varios registros: vacuna, insumo, animal y costo.",
        tradeoff:
          "Módulos aislados son simples, pero obligan a registrar lo mismo varias veces. Conectarlos obliga a decidir quién es dueño de cada dato.",
        decision:
          "La lógica vive en servicios con transacciones y bloqueo de filas. El animal es dueño de la sede de sus vacunas y los módulos se importan en una sola dirección.",
      },
      {
        title: "Multiusuario con roles y sedes",
        context:
          "Una finca la opera un equipo de 2 a 10 personas con funciones distintas, en una o varias sedes.",
        tradeoff: "Un solo rol expone todo. Demasiados roles se vuelven inmanejables.",
        decision:
          "Tres roles, permisos por sede, topes de usuarios y sedes por plan e invitaciones con clave temporal.",
      },
      {
        title: "Multitenancy estricta",
        context:
          "Varias empresas comparten una sola instancia y los datos de una nunca deben llegar a otra.",
        tradeoff: "Instancias separadas aíslan mejor pero multiplican la operación y el costo.",
        decision:
          "El tenant sale del JWT y nunca del body ni de la URL. Todo queryset se filtra por tenant antes de responder.",
      },
      {
        title: "Sincronización sin pisar datos",
        context:
          "Dos dispositivos pueden editar el mismo registro o mover el mismo stock sin conexión.",
        tradeoff:
          "Última escritura gana es simple pero pierde datos. Resolver conflictos exige versionado y más código.",
        decision:
          "Cada registro lleva versión y el servidor responde aceptado, conflicto o rechazo con motivo. El stock offline viaja como diferencia, no como valor absoluto.",
      },
      {
        title: "Portabilidad de datos",
        context:
          "Los productores desconfían de plataformas que retienen sus datos o dificultan la salida.",
        tradeoff: "Exportar sin control facilita fugas. Bloquear la salida destruye la confianza.",
        decision:
          "Importación y exportación CSV disponibles, y la exportación pasa por la aprobación de un administrador.",
      },
    ],
    en: {
      summary:
        "Multi-user, offline-first PWA for farms in Colombia. It records livestock, crops, supplies, production, animal health, and finances in one system where every action in one module updates the others. Django, DRF, PostgreSQL, React, and Dexie.",
      imageAlt:
        "TerraCore dashboard: real-time metrics, production charts, and livestock distribution",
      problem:
        "Agricultural producers in Colombia had no software designed for them: existing ERPs were too complex, and an Excel sheet with login was not enough to manage livestock, animal health, and production simultaneously. Operations were scattered across notebooks, spreadsheets, and WhatsApp groups.",
      solution:
        "TerraCore centralizes on a single platform what a mid-sized farm needs to manage: livestock, crops, supplies, production, animal health, and finances. The modules are connected, so an action in the field updates the other records, and everything works without signal. A whole team uses it, with roles and per-facility permissions. It replaces Excel, notebooks, and WhatsApp as operational tools and covers cattle, swine, equine, ovine, caprine, poultry, and associated crops (plantain, cacao, corn) in Colombia.",
      links: [
        {
          href: "https://app.terracoreapp.co",
          text: "View app",
          ariaLabel: "View TerraCore app",
          event: "ver-app-terracore",
        },
      ],
      designLink: {
        href: "https://terracore-pwa-prototype.netlify.app/",
        text: "View design",
        ariaLabel: "View TerraCore design",
      },
      metaDescription:
        "TerraCore case study: multi-user, offline-first PWA for farms in Colombia. Django, DRF, PostgreSQL, and React. Connected modules and live in production.",
      architecture: [
        "Backend in Django 6 and DRF on PostgreSQL 16. Celery with Redis runs the scheduled tasks (billing and alerts). JWT authentication: 24-hour access token and 180-day refresh token with rotation.",
        "Strict multitenancy: the tenant comes from the JWT, never from the body or the URL, and every queryset is filtered by tenant before responding.",
        "Business logic in services with transactions and row locking. Every endpoint validates role, plan, and facility, and errors follow a uniform contract.",
        "Frontend in React 19, TypeScript, Vite, and Tailwind 4, with one folder and one state hook per module.",
        "Installable PWA on Android and iOS without app stores. The Service Worker caches the app and reads; data lives in a local database (IndexedDB with Dexie) and every write enters an outbox queue.",
        "Sync through one endpoint covering ten models: push in dependency order, cursor-paginated pull, and a version per record. The server answers accepted, conflict, or rejected with a reason, and revalidates like the REST API.",
        "Offline beyond records: a queue of deferred actions (inviting users, changing roles) and saved reads so every screen opens without network. Only card payment needs a connection.",
        "CSV import for onboarding and CSV export with administrator approval.",
        "Security: API documentation restricted to staff and a hardening round over sync, exports, billing, and facility scope.",
        "Infrastructure on Docker and Nginx over a VPS, with isolated staging and a dev, stg, and main flow. The image is published to GHCR with Trivy scanning and deployed by digest. More than 1,000 automated tests in each repository.",
      ],
      design: [
        "The product starts from its own design in Claude Design, with a clickable prototype (View design button).",
        "Deep green as the primary color and amber as the accent over warm neutrals. Inter for text and Poppins for headings.",
        "Atomic design with CSS tokens shared with the landing: atoms, molecules, and layout organisms.",
        "Responsive navigation: a side panel from 1024 px and a bottom bar with a More sheet on mobile. Both come from the same source and a test fails if they drift apart.",
        "Offline state is always visible: banner, pending counter, a Pending mark on every row, and a rejections tray.",
        "With an active facility, a scope badge always says whether the screen shows that facility or all of them.",
        "Forms built for Colombia: phone with dial code and SVG flags, and CC or CE identity document. Spanish URLs and a guided tour on first use.",
      ],
      results: [
        "Functional product in production.",
        "Under validation with clients in Antioquia, Colombia.",
      ],
      learnings: [
        "I learned to design, develop, and build a complete product from scratch (fullstack), with deployment, and to debug it, test it, and fix it.",
        "Defining the tenant boundary early avoids rewrites: data isolation conditions every modeling decision.",
        "Offline-first changes the data model: client-generated UUIDs, a version per record, and soft delete on every syncable model.",
        "Sync cannot skip validations: it was fixed to validate like the REST API (roles, plan, and facility).",
        "Offline stock syncs as a difference and not as an absolute value, so it does not overwrite movements made from another device.",
        "Connecting modules forces you to decide who owns each piece of data: a vaccine's facility is its animal's facility.",
      ],
      roadmap: {
        now: ["Product in production and in active sales."],
        next: [
          "Remove the old vaccination subsystem.",
          "Bring the Finance history down to the facility level.",
        ],
        later: [
          "Labor and fixed and variable costs (currently zero).",
          "Custom reports, an integrations API, and a DIAN and NIIF base.",
        ],
        out: [
          "Financial forecasting, full electronic invoicing, multi-currency, and automatic PDF reports.",
        ],
      },
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
        {
          title: "Disconnected data",
          text: "The notebook says it was vaccinated, but not how much supply it used or what it cost.",
        },
      ],
      modules: [
        {
          name: "Dashboard",
          text: "Metrics computed on the device: expired and upcoming vaccines, low stock, and pending activity.",
        },
        {
          name: "Livestock",
          text: "Unique code, health status, facility, and a detail view with vaccination history.",
        },
        {
          name: "Crops",
          text: "Type, status, area, and planting date, with search and filters.",
        },
        {
          name: "Supplies",
          text: "Stock, minimum, unit cost, and a movement history with its reason.",
        },
        {
          name: "Tools",
          text: "Equipment, purchase cost, and maintenance.",
        },
        {
          name: "Production",
          text: "Batches with supplies used, sale price, and margin.",
        },
        {
          name: "Animal health",
          text: "Vaccines with the supply applied, cost, and booster date.",
        },
        {
          name: "Finance",
          text: "Summary, history, profitability per batch, suppliers, purchases, and losses, depending on the plan.",
        },
        {
          name: "Facilities and permissions",
          text: "Each user sees only the facilities that apply to them.",
        },
        {
          name: "Users and roles",
          text: "Administrator, Operator, and Collaborator (read-only, depending on the plan), with invitations and plan limits.",
        },
        {
          name: "Subscription",
          text: "Plan, payment, history, and cancellation.",
        },
        {
          name: "Activity",
          text: "Notifications per module and a sync rejections tray.",
        },
      ],
      chains: [
        {
          title: "You log a vaccine and this happens on its own",
          steps: [
            "Vaccine applied to an animal, with supply, quantity, cost, and booster date.",
            "The supply is deducted in the same transaction. If there is no stock, the record is not created either.",
            'The Supplies history gets a "Vaccine logged" movement.',
            "The animal's detail view shows the vaccine in its history.",
            "The Dashboard counts expired or soon-to-expire vaccines (30 days).",
            "The treatment cost adds to the health expense of the period P&L.",
            "If stock drops below the minimum, the team is alerted.",
            "If the record is deleted, the supply returns to stock.",
          ],
        },
        {
          title: "You log a production batch",
          steps: [
            "Each supply used is deducted, validating stock grouped per supply (all or nothing).",
            'The batch leaves a "Production logged" movement.',
            "The batch cost (quantity times unit cost) is computed against its revenue (quantity times sale price).",
            "If the cost exceeds revenue, the administrator is alerted.",
            "The revenue enters the period P&L.",
          ],
        },
        {
          title: "You change the active facility",
          steps: [
            "Every screen is scoped to that facility.",
            "A scope badge shows whether you are seeing one facility or all.",
            "A vaccine inherits its animal's facility.",
          ],
        },
        {
          title: "All of this without signal",
          steps: [
            "The same flow is saved on the device.",
            "When the network returns it is applied on the server with the same rules: stock, roles, plan, and facility.",
          ],
        },
      ],
      decisions: [
        {
          title: "Offline-first with PWA",
          context:
            "In pens and paddocks the signal is intermittent or nonexistent, and the record is left for later.",
          tradeoff:
            "A traditional web app fails without network. A native app requires stores and double maintenance.",
          decision:
            "Installable PWA with a local IndexedDB database (Dexie). Every write goes to a queue and syncs when the network returns. The Service Worker caches the app and reads.",
        },
        {
          title: "Integrated modules with server-side rules",
          context: "A field action touches several records: vaccine, supply, animal, and cost.",
          tradeoff:
            "Isolated modules are simple, but force you to log the same thing several times. Connecting them forces you to decide who owns each piece of data.",
          decision:
            "Logic lives in services with transactions and row locking. The animal owns the facility of its vaccines and modules import in one direction only.",
        },
        {
          title: "Multi-user with roles and facilities",
          context:
            "A farm is run by a team of 2 to 10 people with different duties, in one or several facilities.",
          tradeoff: "A single role exposes everything. Too many roles become unmanageable.",
          decision:
            "Three roles, per-facility permissions, user and facility limits per plan, and invitations with a temporary password.",
        },
        {
          title: "Strict multitenancy",
          context:
            "Several companies share one instance and one company's data must never reach another.",
          tradeoff: "Separate instances isolate better but multiply operations and cost.",
          decision:
            "The tenant comes from the JWT and never from the body or the URL. Every queryset is filtered by tenant before responding.",
        },
        {
          title: "Sync without overwriting data",
          context: "Two devices can edit the same record or move the same stock while offline.",
          tradeoff:
            "Last write wins is simple but loses data. Resolving conflicts requires versioning and more code.",
          decision:
            "Every record carries a version and the server answers accepted, conflict, or rejected with a reason. Offline stock travels as a difference, not an absolute value.",
        },
        {
          title: "Data portability",
          context: "Producers distrust platforms that retain their data or make exit difficult.",
          tradeoff: "Unchecked export makes leaks easier. Blocking exit destroys trust.",
          decision:
            "CSV import and export available, and export goes through administrator approval.",
        },
      ],
    },
  },
  {
    title: "TerraCore Landing",
    slug: "terracore-landing",
    quoteType: "landing",
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
    filters: ["landing", "design"],
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
    designLink: {
      href: "https://terracore-landing-prototype.netlify.app/",
      text: "Ver diseño",
      ariaLabel: "Ver diseño de TerraCore Landing",
    },
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
      designLink: {
        href: "https://terracore-landing-prototype.netlify.app/",
        text: "View design",
        ariaLabel: "View TerraCore Landing design",
      },
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
      ],
      learnings: [
        "A SaaS landing for a non-technical niche must speak the client's language: every section was written in field vocabulary, not software vocabulary.",
        "Separating the value demonstration (cascade integration) from the pricing section reduces cognitive load: the producer arrives at the plans having already understood what differentiates TerraCore from Excel.",
      ],
    },
  },
  {
    title: "OKroot PWA",
    slug: "okroot",
    quoteType: "web-app",
    datePublished: "2026-06-16",
    dateModified: "2026-10-02",
    tag: "Live",
    tagColor: "green",
    image: "images/og-okroot.webp",
    imageAlt: "OKroot: PWA con scanner de etiquetas por IA y perfil de restricciones alimentarias",
    imageWidth: 1200,
    imageHeight: 630,
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Dexie",
      "Django",
      "DRF",
      "PostgreSQL",
      "Claude API",
      "PWA",
    ],
    appCategory: "HealthApplication",
    programmingLanguage: ["Python", "TypeScript", "SQL"],
    summary:
      "PWA para quien tiene celiaquía, diabetes o intolerancia a la lactosa, solas o combinadas. El usuario fotografía la etiqueta de un producto y una IA (Claude API) responde en segundos si puede comerlo según su perfil. Suma diario con macros, recetas, insights y mercado semanal. React, Django, DRF y PostgreSQL.",
    filters: ["full-stack", "ai", "pwa", "design"],
    problem:
      "Comer con celiaquía, diabetes o intolerancia a la lactosa implica leer cada etiqueta, descifrar ingredientes escondidos bajo otros nombres y cruzar varias restricciones a la vez, todo a mano. Las apps que existen suelen validar una condición y dependen de una base de datos fija de productos.",
    solution:
      "El usuario fotografía la etiqueta y recibe un veredicto con la razón concreta, calculado contra todas sus condiciones activas y contra los ingredientes que él mismo marcó como prohibidos. Alrededor del scanner hay un diario con macros y bitácora de salud, 50 recetas curadas, insights semanales y un mercado semanal. Se instala desde el navegador y guarda sin conexión lo que el usuario registra.",
    architecture: [
      "Frontend en React 18 y TypeScript estricto, con Vite, Tailwind CSS 4, React Router y rutas por feature cargadas bajo demanda. Zustand guarda la sesión, TanStack Query maneja los datos del servidor, y react-hook-form con zod valida los formularios. Una capa de fetch propia, sin Axios.",
      "Backend en Django 5.1 y Django REST Framework sobre PostgreSQL, organizado en ocho apps (usuarios, scanner, diario, recetas, insights, mercado, pagos y sync). La lógica vive en services y las vistas solo orquestan. Todas las respuestas usan el mismo envoltorio de datos y de error.",
      "Scanner en el servidor: el cliente valida tipo, tamaño (5 MB) y resolución mínima, y envía la imagen en base64. El servidor la valida otra vez (firma del archivo incluida), llama a Claude con un prompt que conoce las condiciones del usuario y sus ingredientes a evitar, y parsea una respuesta por líneas a un veredicto, riesgo de trazas, ingredientes problemáticos y macros.",
      "La imagen no se guarda: va al modelo y se descarta. Si la etiqueta es ilegible, el servidor reemplaza el texto del modelo por una indicación concreta (borrosa, poca luz, reflejo, texto cortado, sin lista de ingredientes) en lugar de adivinar.",
      "Perfil de salud como estado persistente: tres condiciones combinables, objetivo, datos físicos con cálculo de gasto calórico (Mifflin-St Jeor) e ingredientes a evitar. Un ingrediente marcado por el usuario fuerza el veredicto de rechazo en código, sin depender de que el modelo lo recuerde.",
      "Diario con comidas y macros, resumen semanal y bitácora de salud (energía, piel y glucosa). Insights con alertas, racha, vaso de agua y una estimación glucémica simple para diabéticos. Mercado semanal armado desde las recetas favoritas y lo registrado en el diario.",
      "Offline: el service worker (Workbox) precachea la app y las consultas a la API usan primero la red con respaldo en caché. Los escaneos, las comidas y los cambios de la lista de compras sin conexión quedan en una cola de IndexedDB (Dexie) y se envían por lotes a un endpoint de sync cuando vuelve la red.",
      "Sync con idempotencia: cada operación lleva una clave UUID generada en el cliente y el servidor devuelve la entidad existente si la reconoce, así un reintento nunca duplica. El lote es de hasta 100 operaciones en orden, con reintentos espaciados y el servidor como fuente de verdad.",
      "Cuota de escaneos reservada de forma atómica en la base antes de llamar al modelo y devuelta si la llamada falla, para que peticiones simultáneas no superen el tope. Suscripciones con checkout alojado de Stripe y MercadoPago y webhooks con firma verificada e idempotentes.",
      "Seguridad: JWT de acceso corto con refresh rotativo y lista negra, login con Google verificado en el servidor, bloqueo por intentos fallidos, límites de tasa en Nginx y en DRF, y cabeceras HSTS y CSP.",
      "Calidad y entrega: ruff, comprobación de migraciones, más de 500 pruebas de backend y más de 250 de frontend, escaneo de secretos y de vulnerabilidades críticas en la imagen. Las imágenes se publican en GHCR y el VPS despliega por digest inmutable, con Nginx por delante.",
    ],
    links: [
      {
        href: "https://app.okroot.co/",
        text: "Ver app",
        ariaLabel: "Ver app de OKroot",
        event: "ver-app-root",
      },
    ],
    designLink: {
      href: "https://okroot-pwa-prototype.netlify.app/",
      text: "Ver diseño",
      ariaLabel: "Ver diseño de OKroot",
    },
    caseStudy: true,
    schemaType: "SoftwareApplication",
    metaDescription:
      "Caso de estudio de OKroot: PWA con scanner de etiquetas por IA (Claude API) para celiaquía, diabetes e intolerancia a la lactosa, con cola de sync offline.",
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
        text: "Las soluciones existentes validan una condición a la vez y dependen de una lista fija de productos.",
      },
    ],
    modules: [
      {
        name: "Scanner de etiquetas",
        text: "Foto de la etiqueta y veredicto en cuatro niveles: apto, cuidado, no apto y sin datos. Muestra el ingrediente que lo decide, el riesgo de contaminación cruzada, una fila por condición activa y los macros leídos de la tabla nutricional.",
      },
      {
        name: "Perfil e ingredientes a evitar",
        text: "Onboarding en cuatro pasos con las condiciones (combinables), el objetivo, los datos físicos y los ingredientes que el usuario no quiere ver. Se edita después desde el perfil.",
      },
      {
        name: "Diario y bitácora de salud",
        text: "Comidas por momento del día con calorías y macros, resumen semanal y registro diario de energía, piel y glucosa. Registrar comidas funciona sin conexión.",
      },
      {
        name: "Recetas",
        text: "50 recetas curadas, todas sin gluten, sin lactosa y sin azúcar. Se filtran por momento, tiempo, dificultad y favoritas, y las que contienen un ingrediente a evitar quedan fuera. Se pueden agregar al diario.",
      },
      {
        name: "Insights y mercado semanal",
        text: "Resumen semanal con alertas, racha de registro y vasos de agua. Un mercado semanal se arma con los ingredientes de las recetas favoritas y lo que se registró en el diario.",
      },
    ],
    chainStepsTitle: "Una foto, una respuesta. Esto pasa por debajo.",
    chainSteps: [
      "La app valida la foto: tipo, tamaño y resolución mínima",
      "El servidor la revisa de nuevo y reserva un escaneo de la cuota antes de llamar al modelo",
      "Claude lee los ingredientes con tus condiciones y tus ingredientes a evitar en el prompt",
      "El servidor parsea la respuesta, aplica tus ingredientes prohibidos como regla dura y guarda el resultado",
      "Respuesta en pantalla: puedes comerlo, o el ingrediente exacto que lo descarta",
    ],
    decisions: [
      {
        title: "Nicho médico real, no wellness genérico",
        context:
          "Existen muchas apps de comer sano. Las personas con celiaquía, diabetes o intolerancia tienen necesidades concretas y consecuencias reales si se equivocan.",
        tradeoff:
          "Un producto más amplio alcanza más usuarios pero diluye la propuesta y baja el estándar de validación.",
        decision:
          "OKroot está pensada para quien ya tiene la condición. Eso define el prompt, los veredictos y la regla de que una duda se muestra como duda, nunca como un apto.",
      },
      {
        title: "Condiciones combinables como estado, no como contexto",
        context:
          "Un usuario puede tener las tres condiciones a la vez, y repetirlas en cada petición es una fuente de olvidos y de respuestas inconsistentes.",
        tradeoff:
          "Validar una restricción es simple. Validar tres a la vez exige modelar el perfil y construir el prompt desde él.",
        decision:
          "Las condiciones y los ingredientes a evitar viven en la base de datos. Cada escaneo arma su prompt desde ese perfil y valida contra todas las condiciones activas.",
      },
      {
        title: "Claude API en vez de una lista de ingredientes",
        context:
          "Un ingrediente prohibido aparece bajo decenas de nombres: la lactosa como suero, caseína o lactosuero; el gluten como malta, sémola o espelta. Una lista fija envejece y no cubre todos los casos.",
        tradeoff:
          "Una lista es predecible y barata, pero exige mantenimiento y falla ante nombres nuevos. El modelo generaliza, pero puede equivocarse y cuesta por llamada.",
        decision:
          "El modelo analiza la etiqueta real con una lista de nombres técnicos en el prompt. Lo crítico no se le delega: el ingrediente que el usuario prohibió fuerza el rechazo en código, y una imagen ilegible recibe una indicación fija, no una conjetura.",
      },
      {
        title: "Una respuesta por líneas, parseada con reglas",
        context:
          "El resultado alimenta una pantalla con veredicto, condiciones, ingredientes y macros, y no puede romperse si el modelo cambia de redacción.",
        tradeoff:
          "Un formato por líneas con expresiones regulares es más frágil que un esquema estricto, pero es simple y fácil de probar.",
        decision:
          "El servidor parsea cada campo por separado: un veredicto que no entiende queda como sin datos y un macro que no puede leer se descarta en lugar de inventarse.",
      },
      {
        title: "La cuota se reserva antes de llamar al modelo",
        context:
          "Cada escaneo cuesta dinero, y dos peticiones simultáneas pueden pasar una comprobación hecha antes de que la otra descuente.",
        tradeoff:
          "Reservar antes obliga a devolver el escaneo si la llamada falla, y un reembolso mal hecho deja al usuario sin escaneos.",
        decision:
          "La reserva bloquea la fila de suscripción dentro de una transacción. Si la llamada al modelo falla, el escaneo se devuelve y el usuario recibe un resultado sin datos en lugar de un cobro perdido.",
      },
      {
        title: "PWA con escritura offline, no una app nativa",
        context:
          "El registro de comidas ocurre en el momento, no siempre con buena señal, y el scanner necesita un servidor porque la IA no corre en el dispositivo.",
        tradeoff:
          "Una web tradicional falla sin conexión. Una app nativa exige publicar en stores y mantener dos bases de código.",
        decision:
          "Service worker que precachea la app y una cola de IndexedDB para los escaneos, las comidas y la lista de compras. Un escaneo sin red se procesa cuando vuelve la señal, no al instante. Se instala desde el navegador.",
      },
      {
        title: "Sync por lotes con idempotencia, sin fusionar en el cliente",
        context:
          "Una cola offline que reintenta puede enviar la misma operación dos veces, y fusionar cambios en el cliente multiplica los casos raros.",
        tradeoff:
          "Sin fusión en el cliente, el servidor tiene la última palabra. A cambio, el modelo es simple y los reintentos son seguros.",
        decision:
          "Cada operación lleva una clave UUID y el servidor devuelve la entidad ya creada si la reconoce. Un fallo de una operación no frena el lote, y el cliente reintenta con esperas crecientes.",
      },
    ],
    design: [
      "El diseño parte de un prototipo navegable, accesible desde el botón Ver diseño.",
      "Sistema de diseño propio, versión 2.0, con tokens en un solo archivo CSS. Violeta como color primario sobre neutros cálidos y colores propios para los veredictos apto, cuidado y no apto.",
      "Bricolage Grotesque para titulares y Plus Jakarta Sans para texto, ambas autoalojadas. Íconos de Lucide con trazo uniforme.",
      "El veredicto no depende solo del color: lleva una marca (visto, exclamación o equis) y una palabra grande, y se anuncia a lectores de pantalla con regiones en vivo.",
      "Pensada para el teléfono: la interfaz vive dentro de un marco móvil con barra de navegación inferior de cuatro pestañas más una quinta de plan o de mercado.",
      "Animación reducida a nada cuando el usuario lo pide, objetivos táctiles de 44 px en varios controles y anillos de foco visibles.",
      "Todo el texto está en español de Colombia y en tuteo. Hoy la interfaz es solo clara, sin modo oscuro.",
    ],
    results: [
      "Scanner en producción: foto de la etiqueta, veredicto con la razón concreta y soporte para las tres condiciones a la vez.",
      "Núcleo completo en producción: perfil, scanner, diario con bitácora de salud, recetas, insights y mercado semanal sobre Django, PostgreSQL y React.",
      "Cola de sync offline operativa para escaneos, comidas y lista de compras, con envío por lotes idempotente cuando vuelve la red.",
    ],
    learnings: [
      "Un modelo de lenguaje decide bien lo ambiguo, pero lo crítico se asegura en código: el ingrediente que el usuario prohibió se aplica como regla dura, y una imagen ilegible recibe una respuesta fija en vez de una conjetura.",
      "El perfil de salud tiene que ser estado persistente y no contexto de la conversación. Así cada petición lo reconstruye igual y no se pierde entre llamadas.",
      "Reservar la cuota antes de llamar al modelo y devolverla si falla evita tanto el sobreuso concurrente como el cobro de un escaneo que no llegó.",
      "Offline no es una capa que se añade al final: condiciona el modelo de sync desde el primer endpoint. Con claves de idempotencia por operación, los reintentos son seguros sin lógica de fusión en el cliente.",
      "Decir con precisión qué funciona sin conexión importa. El scanner necesita servidor, así que un escaneo sin red se encola y se procesa al volver la señal.",
      "El texto del producto, la documentación y el código se desalinean con facilidad: contar pruebas, versiones y alcance a mano deja cifras viejas.",
    ],
    roadmap: {
      now: [
        "PWA en producción en early access, con scanner, diario, recetas, insights, mercado semanal y suscripciones.",
      ],
      next: [
        "Leer el diario y las recetas desde el almacenamiento local sin conexión: hoy solo el historial de escaneos se lee de la caché.",
      ],
      later: [
        "Buscador de recetas según lo que hay en la nevera, planificado y aún sin implementar.",
      ],
    },
    en: {
      summary:
        "PWA for people with celiac disease, diabetes or lactose intolerance, alone or combined. The user photographs a product label and an AI (Claude API) answers in seconds whether they can eat it for their profile. It adds a food diary with macros, recipes, insights and a weekly market. React, Django, DRF and PostgreSQL.",
      imageAlt: "OKroot: PWA with AI food-label scanner and dietary restriction profile",
      problem:
        "Eating with celiac disease, diabetes or lactose intolerance means reading every label, deciphering ingredients hidden under other names and cross-checking several restrictions at once, all by hand. Existing apps usually validate one condition and rely on a fixed product database.",
      solution:
        "The user photographs the label and gets a verdict with the specific reason, computed against all their active conditions and against the ingredients they marked as forbidden. Around the scanner there is a diary with macros and a health log, 50 curated recipes, weekly insights and a weekly market. It installs from the browser and keeps what the user logs without a connection.",
      links: [
        {
          href: "https://app.okroot.co/",
          text: "Visit app",
          ariaLabel: "Visit OKroot app",
          event: "ver-app-root",
        },
      ],
      designLink: {
        href: "https://okroot-pwa-prototype.netlify.app/",
        text: "View design",
        ariaLabel: "View OKroot design",
      },
      metaDescription:
        "OKroot case study: PWA with an AI food label scanner (Claude API) for celiac disease, diabetes and lactose intolerance, with an offline sync queue.",
      architecture: [
        "Frontend in React 18 and strict TypeScript, with Vite, Tailwind CSS 4, React Router and per-feature routes loaded on demand. Zustand holds the session, TanStack Query handles server data, and react-hook-form with zod validates forms. A custom fetch layer, no Axios.",
        "Backend in Django 5.1 and Django REST Framework on PostgreSQL, organized in eight apps (users, scanner, diary, recipes, insights, market, payments and sync). Logic lives in services and views only orchestrate. Every response uses the same data and error envelope.",
        "Scanner on the server: the client validates type, size (5 MB) and minimum resolution, and sends the image as base64. The server validates it again (file signature included), calls Claude with a prompt that knows the user's conditions and ingredients to avoid, and parses a line-based answer into a verdict, trace risk, problem ingredients and macros.",
        "The image is not stored: it goes to the model and is discarded. If the label is unreadable, the server replaces the model's text with a concrete hint (blurry, low light, glare, cropped text, no ingredient list) instead of guessing.",
        "Health profile as persistent state: three combinable conditions, goal, physical data with an energy expenditure calculation (Mifflin-St Jeor) and ingredients to avoid. An ingredient the user flagged forces the reject verdict in code, without relying on the model remembering it.",
        "Diary with meals and macros, weekly summary and a health log (energy, skin and glucose). Insights with alerts, streak, water glasses and a simple glycemic estimate for diabetics. A weekly market built from favorite recipes and what was logged in the diary.",
        "Offline: the service worker (Workbox) precaches the app and API reads go network-first with a cache fallback. Scans, meals and shopping list changes made without a connection are kept in an IndexedDB queue (Dexie) and sent in batches to a sync endpoint when the network returns.",
        "Idempotent sync: each operation carries a client-generated UUID key and the server returns the existing entity if it recognizes it, so a retry never duplicates. A batch holds up to 100 operations in order, with spaced retries and the server as the source of truth.",
        "Scan quota reserved atomically in the database before calling the model and returned if the call fails, so simultaneous requests cannot exceed the cap. Subscriptions with hosted Stripe and MercadoPago checkout and signature-verified, idempotent webhooks.",
        "Security: short-lived JWT access with rotating, blacklisted refresh, server-verified Google login, lockout on failed attempts, rate limits in Nginx and DRF, and HSTS and CSP headers.",
        "Quality and delivery: ruff, migration checks, more than 500 backend tests and more than 250 frontend tests, secret scanning and scanning for critical image vulnerabilities. Images are published to GHCR and the VPS deploys by immutable digest, with Nginx in front.",
      ],
      painPoints: [
        {
          title: "Every label, by hand",
          text: "Shopping or eating out means reading the back of every product, over and over.",
        },
        {
          title: "Ingredients in disguise",
          text: "Lactose, gluten or sugar show up under technical names few people recognize.",
        },
        {
          title: "Restrictions that stack",
          text: "Existing tools validate one condition at a time and rely on a fixed product list.",
        },
      ],
      modules: [
        {
          name: "Label scanner",
          text: "Photo of the label and a verdict on four levels: suitable, caution, not suitable and no data. It shows the deciding ingredient, the cross-contamination risk, one row per active condition and the macros read from the nutrition table.",
        },
        {
          name: "Profile and ingredients to avoid",
          text: "Four-step onboarding with the conditions (combinable), the goal, physical data and the ingredients the user never wants to see. It is edited later from the profile.",
        },
        {
          name: "Diary and health log",
          text: "Meals by time of day with calories and macros, a weekly summary and a daily log of energy, skin and glucose. Logging meals works without a connection.",
        },
        {
          name: "Recipes",
          text: "50 curated recipes, all gluten-free, lactose-free and sugar-free. They filter by meal, time, difficulty and favorites, and any that contain an ingredient to avoid are left out. They can be added to the diary.",
        },
        {
          name: "Insights and weekly market",
          text: "A weekly summary with alerts, logging streak and water glasses. A weekly market is built from the ingredients of favorite recipes and what was logged in the diary.",
        },
      ],
      chainStepsTitle: "One photo, one answer. Here is what happens underneath.",
      chainSteps: [
        "The app validates the photo: type, size and minimum resolution",
        "The server checks it again and reserves one scan from the quota before calling the model",
        "Claude reads the ingredients with your conditions and your ingredients to avoid in the prompt",
        "The server parses the answer, applies your forbidden ingredients as a hard rule and stores the result",
        "Answer on screen: you can eat it, or the exact ingredient that rules it out",
      ],
      decisions: [
        {
          title: "Real medical niche, not generic wellness",
          context:
            "Many eat-healthy apps exist. People with celiac disease, diabetes or intolerance have specific needs and real consequences if they make mistakes.",
          tradeoff:
            "A broader product reaches more users but dilutes the proposition and lowers the validation standard.",
          decision:
            "OKroot is built for people who already have the condition. That defines the prompt, the verdicts and the rule that a doubt is shown as a doubt, never as a suitable.",
        },
        {
          title: "Combinable conditions as state, not context",
          context:
            "A user can have all three conditions at once, and repeating them in every request is a source of omissions and inconsistent answers.",
          tradeoff:
            "Validating one restriction is simple. Validating three at once requires modeling the profile and building the prompt from it.",
          decision:
            "The conditions and ingredients to avoid live in the database. Each scan builds its prompt from that profile and validates against all active conditions.",
        },
        {
          title: "Claude API instead of an ingredient list",
          context:
            "A restricted ingredient shows up under dozens of names: lactose as whey, casein or milk solids; gluten as malt, semolina or spelt. A fixed list ages and does not cover every case.",
          tradeoff:
            "A list is predictable and cheap, but needs maintenance and breaks on new names. The model generalizes, but it can be wrong and costs per call.",
          decision:
            "The model analyzes the real label with a list of technical names in the prompt. Anything critical is not delegated: the ingredient the user forbade forces the reject in code, and an unreadable image gets a fixed hint, not a guess.",
        },
        {
          title: "A line-based answer, parsed with rules",
          context:
            "The result feeds a screen with verdict, conditions, ingredients and macros, and it cannot break if the model changes its wording.",
          tradeoff:
            "A line format with regular expressions is more fragile than a strict schema, but it is simple and easy to test.",
          decision:
            "The server parses each field separately: a verdict it does not understand becomes no data and a macro it cannot read is dropped instead of being invented.",
        },
        {
          title: "The quota is reserved before calling the model",
          context:
            "Every scan costs money, and two simultaneous requests can pass a check made before the other one deducts.",
          tradeoff:
            "Reserving first forces you to return the scan if the call fails, and a bad refund leaves the user without scans.",
          decision:
            "The reservation locks the subscription row inside a transaction. If the model call fails, the scan is returned and the user gets a no-data result instead of a lost charge.",
        },
        {
          title: "PWA with offline writes, not a native app",
          context:
            "Meal logging happens in the moment, not always with a good signal, and the scanner needs a server because the AI does not run on the device.",
          tradeoff:
            "A traditional web app fails without a connection. A native app requires store publishing and two codebases.",
          decision:
            "A service worker that precaches the app and an IndexedDB queue for scans, meals and the shopping list. A scan made offline is processed when the signal returns, not instantly. It installs from the browser.",
        },
        {
          title: "Batch sync with idempotency, no merging on the client",
          context:
            "An offline queue that retries can send the same operation twice, and merging changes on the client multiplies the edge cases.",
          tradeoff:
            "Without client-side merging, the server has the last word. In exchange, the model is simple and retries are safe.",
          decision:
            "Each operation carries a UUID key and the server returns the already created entity if it recognizes it. One failed operation does not stop the batch, and the client retries with growing delays.",
        },
      ],
      design: [
        "The design starts from a navigable prototype, reachable from the View design button.",
        "A custom design system, version 2.0, with tokens in a single CSS file. Violet as the primary color on warm neutrals and dedicated colors for the suitable, caution and not suitable verdicts.",
        "Bricolage Grotesque for headings and Plus Jakarta Sans for body text, both self-hosted. Lucide icons with a uniform stroke.",
        "The verdict does not rely on color alone: it carries a mark (check, exclamation or cross) and a large word, and it is announced to screen readers with live regions.",
        "Built for the phone: the interface lives inside a mobile frame with a four-tab bottom navigation plus a fifth tab for plan or market.",
        "Animation is reduced to nothing when the user asks for it, touch targets are 44 px on several controls and focus rings are visible.",
        "All text is in Colombian Spanish and in the informal register. Today the interface is light only, with no dark mode.",
      ],
      results: [
        "Scanner in production: label photo, verdict with the specific reason and support for all three conditions at once.",
        "Complete core in production: profile, scanner, diary with health log, recipes, insights and weekly market on Django, PostgreSQL and React.",
        "Offline sync queue running for scans, meals and the shopping list, with idempotent batch delivery when the network returns.",
      ],
      learnings: [
        "A language model handles the ambiguous well, but the critical part is secured in code: the ingredient the user forbade is applied as a hard rule, and an unreadable image gets a fixed answer instead of a guess.",
        "The health profile has to be persistent state and not conversation context. That way each request rebuilds it the same way and nothing is lost between calls.",
        "Reserving the quota before calling the model and returning it on failure avoids both concurrent overuse and charging for a scan that never arrived.",
        "Offline is not a layer added at the end: it conditions the sync model from the first endpoint. With per-operation idempotency keys, retries are safe without client-side merge logic.",
        "Being precise about what works offline matters. The scanner needs a server, so a scan without a network is queued and processed when the signal returns.",
        "Product copy, documentation and code drift apart easily: counting tests, versions and scope by hand leaves stale numbers behind.",
      ],
      roadmap: {
        now: [
          "PWA in production in early access, with scanner, diary, recipes, insights, weekly market and subscriptions.",
        ],
        next: [
          "Read the diary and recipes from local storage without a connection: today only the scan history is read from the cache.",
        ],
        later: ["Recipe finder based on what is in the fridge, planned and not yet implemented."],
      },
    },
  },
  {
    title: "OKroot Landing",
    slug: "okroot-landing",
    quoteType: "landing",
    datePublished: "2026-06-18",
    dateModified: "2026-10-02",
    tag: "Live",
    tagColor: "green",
    image: "images/og-okroot.webp",
    imageAlt: "Landing de OKroot: scanner de etiquetas por IA para restricciones alimentarias",
    imageWidth: 1200,
    imageHeight: 630,
    stack: [
      "Astro",
      "TypeScript",
      "Tailwind CSS",
      "Vercel Functions",
      "Supabase",
      "GA4",
      "SEO",
      "A11y",
    ],
    filters: ["landing", "design"],
    summary:
      "Landing estática de OKroot que lleva a quien tiene celiaquía, diabetes o intolerancia a la lactosa desde el dolor de leer etiquetas hasta una lista de espera para el acceso anticipado. Suma un recetario con 16 recetas y páginas legales. Astro, Tailwind CSS y Supabase.",
    problem:
      "Una app con varias restricciones dietéticas tiene que decir con precisión a quién sirve y qué hace antes de que alguien se anote. Y como trata temas de salud, no puede prometer lo que no es: ni afirmaciones médicas ni nombres de tecnología que no ayudan al usuario.",
    solution:
      "Landing en Astro que parte del dolor cotidiano, muestra cómo funciona el scanner en tres pasos, compara con las apps que existen y presenta a la fundadora como primera usuaria. Todos los botones llevan a una lista de espera con consentimiento explícito, sin pedir datos de salud, y la analítica solo se carga si el visitante la acepta.",
    architecture: [
      "Astro 5 con salida estática y Tailwind CSS 4 con la configuración en CSS. Sin adaptador ni framework de interfaz: el JavaScript es vanilla, un script por componente. Los íconos de Lucide se incrustan al compilar como SVG, sin JavaScript en el navegador.",
      "Una página de aterrizaje de nueve secciones en orden fijo: Hero, Dolor, Cómo funciona, Comparación, Funciones, Casos de éxito, Precios, Lista de espera y Preguntas. Además hay páginas de Sobre mí, Contacto y Preguntas, y las cuatro legales (privacidad, términos, habeas data y cookies).",
      "Recetario como colección de contenido: cada receta es un archivo Markdown validado en el build con un esquema de zod. Una receta que no lo cumple rompe la compilación y no llega a producción. El índice y una página por receta se generan en estático, con JSON-LD de receta y migas de pan.",
      "Los datos de la sección de precios y el cupo de acceso anticipado viven en un solo archivo de constantes, y el contador de cupos admite solo un número real: con cero, la línea de escasez desaparece.",
      "Lista de espera con nombre, correo y casilla de consentimiento obligatoria, más un campo trampa oculto. Envía JSON a una función de Vercel que valida y normaliza, y guarda en una tabla compartida de Supabase con la llave de servicio solo en el servidor. El navegador nunca habla con Supabase.",
      "La función guarda únicamente nombre, correo, producto, fecha de consentimiento y la ruta de la página. No recibe ni guarda datos de salud ni la IP, y descarta cualquier campo extra. Un correo repetido responde 'ya estás dentro' sin crear otra fila, y solo guarda en producción: en preview valida y avisa que el almacenamiento está desactivado.",
      "Analítica: GA4 con consentimiento. No se carga nunca por defecto; un banner de cookies guarda la preferencia y, solo si el visitante acepta, inyecta gtag.js con el ID de una variable de entorno. Si la variable no existe, no se hace ninguna petición. Un page_view manual cubre la navegación con transiciones.",
      "Navegación con View Transitions como mejora progresiva: cada ruta sigue siendo un HTML real, y los scripts se vuelven a ejecutar en cada carga de página.",
      "SEO técnico: title, description, canonical, Open Graph y Twitter, mapa del sitio automático y JSON-LD con Organization, WebSite, SoftwareApplication y FAQPage. Las preguntas frecuentes alimentan el acordeón y el esquema desde la misma fuente.",
      "Seguridad desde vercel.json: CSP estricta con script-src 'self' y solo los orígenes de Google Analytics, HSTS, X-Frame-Options DENY, Permissions-Policy sin cámara ni micrófono y caché inmutable en los archivos con hash.",
      "Calidad: la verificación es astro check (TypeScript y plantillas) más el build, que valida además el esquema de las recetas. CI corre ambos en cada pull request, con un audit de dependencias que informa pero no bloquea. No hay pruebas automatizadas de interfaz.",
    ],
    painPoints: [
      {
        title: "Leer cada etiqueta, una por una",
        text: "El súper se vuelve una revisión de ingredientes, y 'almidón modificado' a las 8 de la noche no ayuda a nadie.",
      },
      {
        title: "Cruzar varias condiciones en la misma comida",
        text: "Celiaquía y diabetes a la vez, más la lactosa, y cada app resuelve una sola.",
      },
      {
        title: "Recetas que parecían seguras",
        text: "Descartar a posteriori lo que no lo era, y contar a mano los carbohidratos de cada plato.",
      },
      {
        title: "Una promesa de salud que no se puede sostener",
        text: "En un tema médico, un claim de más resta confianza y expone. Hay que decir qué hace la herramienta y qué no.",
      },
    ],
    modules: [
      {
        name: "Hero con una promesa concreta",
        text: "Titular 'Fotografía la etiqueta. Sabe en segundos si puedes comerla', las tres condiciones nombradas, un botón a la lista de espera y un mock del scanner animado.",
      },
      {
        name: "Dolor, en seis escenas",
        text: "Carrusel con las seis molestias cotidianas: swipe horizontal en móvil y desplazamiento anclado en escritorio.",
      },
      {
        name: "Cómo funciona y comparación",
        text: "Tres pasos (fotografía, análisis con IA y respuesta con la razón) y una tabla frente a otras apps: restricciones juntas, etiqueta real y alcance más allá del scanner.",
      },
      {
        name: "Funciones y fundadora",
        text: "Perfil persistente, recetas curadas y diario con soporte sin conexión, y una sección que presenta a la creadora como primera usuaria, con enlaces a su portafolio y redes.",
      },
      {
        name: "Lista de espera y preguntas",
        text: "Formulario con consentimiento explícito y nueve preguntas frecuentes que responden con límites claros: no es un reemplazo del médico y hoy solo lee etiquetas de ingredientes.",
      },
      {
        name: "Recetario",
        text: "16 recetas sin gluten con tiempos, ingredientes y notas. Los beneficios solo se publican si citan una fuente verificable.",
      },
    ],
    decisions: [
      {
        title: "Acción antes que lista de condiciones",
        context:
          "Hay tres condiciones y un solo botón. Enumerarlas todas en el primer pantallazo diluye la acción.",
        tradeoff: "Nombrar las condiciones da claridad. Ponerlas en un botón lo satura.",
        decision:
          "El titular promete la acción ('fotografía la etiqueta') y nombra las tres condiciones una sola vez, debajo. Todos los botones llevan al mismo destino: la lista de espera.",
      },
      {
        title: "Copy sin stack ni claims médicos",
        context:
          "El usuario no necesita saber con qué se construyó, y en salud, palabras como diagnóstico o tratamiento prometen lo que la herramienta no es.",
        tradeoff:
          "Omitir el stack quita credibilidad técnica. Omitir los claims médicos limita el discurso.",
        decision:
          "El texto describe el beneficio y nunca la tecnología. Las respuestas aclaran que es una ayuda para decidir y no reemplaza al médico, y las recetas solo publican beneficios con fuente.",
      },
      {
        title: "Una fundadora que es la primera usuaria",
        context:
          "Un producto de salud sin prueba social pierde confianza, pero inventar casos la destruye.",
        tradeoff: "Un solo caso es poca evidencia. Uno real pesa más que varios de relleno.",
        decision:
          "La sección de casos de éxito cuenta la historia real de la creadora y deja un carrusel listo para sumar casos cuando existan, sin inventarlos.",
      },
      {
        title: "Consentimiento antes de la analítica",
        context:
          "La landing habla de salud, y cargar un script de seguimiento por defecto contradice lo que promete.",
        tradeoff:
          "GA4 detrás de un banner pierde parte de las visitas, pero la política de cookies puede ser cierta.",
        decision:
          "GA4 solo se carga si el visitante acepta, y se apaga si no hay ID. El banner aclara que no se recopilan datos del perfil de salud.",
      },
      {
        title: "La lista de espera no pide datos de salud",
        context:
          "Preguntar la condición al anotarse daría datos útiles, pero convertiría una lista de contactos en datos sensibles.",
        tradeoff:
          "Sin la condición no se puede segmentar. A cambio, no hay datos de salud que proteger.",
        decision:
          "El formulario pide nombre y correo, y la función guarda solo columnas de una lista blanca. Cualquier campo extra se descarta en el servidor.",
      },
      {
        title: "Estática, con una sola función de servidor",
        context:
          "Una landing no necesita un backend propio, pero el formulario tiene que guardar sin exponer llaves.",
        tradeoff:
          "La función de Vercel no corre bajo el servidor de desarrollo de Astro, y el preview no tiene base de datos.",
        decision:
          "El sitio es estático y el formulario habla con una función que usa la llave de servicio solo en el servidor. Fuera de producción valida y no guarda.",
      },
      {
        title: "Una tabla de contactos compartida",
        context:
          "Cada producto de Lúmina W tiene su lista de espera, y mantener una base por producto multiplica el trabajo.",
        tradeoff:
          "Una tabla compartida exige que cada función ponga su propio producto y que el script de la tabla sea idéntico en todos los repositorios.",
        decision:
          "Las listas de espera comparten una tabla con la clave única de producto y correo. La función fija el producto en el servidor y nunca lo lee de la petición.",
      },
    ],
    design: [
      "El diseño parte de un prototipo navegable, accesible desde el botón Ver diseño.",
      "Violeta como color primario sobre fondos crema, en la misma familia visual que la app, con un hero en tarjeta de gradiente suave.",
      "Fuentes autoalojadas y servidas desde el propio sitio, sin pedir nada a terceros.",
      "Secciones con un eyebrow editorial, animaciones de aparición con IntersectionObserver y CSS puro, sin una librería de animación.",
      "Iconografía en SVG incrustado: nunca flechas de texto en los botones ni rayas largas en el copy.",
      "Un scanner animado en el hero que muestra el escaneo y el veredicto sin cargar el producto real.",
      "Todo el contenido está en español y las rutas también (preguntas, contacto, sobre-mi, recetas).",
    ],
    results: [
      "Landing en producción con la lista de espera guardando solicitudes, recetario y páginas legales.",
      "Analítica con consentimiento y SEO técnico con datos estructurados desde el lanzamiento.",
    ],
    learnings: [
      "Comunicar tres restricciones en un solo llamado exige priorizar la acción sobre la lista de condiciones: fotografiar la etiqueta se entiende más rápido que enumerar lo que se tiene.",
      "En un tema de salud, lo que no se promete vale tanto como lo que sí. Sin claims médicos, sin stack y sin casos inventados, cada frase se puede defender.",
      "Una analítica que espera el consentimiento y un formulario que no pide datos de salud son decisiones de producto, no solo de cumplimiento.",
      "Un esquema que valida el contenido en el build evita que una receta rota llegue a producción, aunque no haya pruebas automatizadas de interfaz.",
      "Las cifras de precios, cupos y límites se desalinean cuando se copian en varias páginas: conviene una sola fuente y revisar el texto contra el producto.",
    ],
    roadmap: {
      now: ["Landing en producción captando la lista de espera del acceso anticipado."],
      next: ["Sumar más casos de éxito: hoy la landing cuenta solo el de la fundadora."],
      later: [
        "Más idiomas y mercados, y más condiciones y combinaciones, según las preguntas frecuentes.",
      ],
    },
    caseStudy: true,
    schemaType: "WebSite",
    metaDescription:
      "Caso de estudio de OKroot Landing: landing estática en Astro y Tailwind CSS con lista de espera en Supabase, analítica con consentimiento y recetario.",
    links: [
      {
        href: "https://okroot.co/",
        text: "Ver sitio",
        ariaLabel: "Ver landing de OKroot",
      },
    ],
    designLink: {
      href: "https://okroot-landing-prototype.netlify.app/",
      text: "Ver diseño",
      ariaLabel: "Ver diseño de OKroot Landing",
    },
    en: {
      summary:
        "OKroot static landing that takes people with celiac disease, diabetes or lactose intolerance from the pain of reading labels to a waitlist for early access. It adds a recipe collection with 16 recipes and legal pages. Astro, Tailwind CSS and Supabase.",
      imageAlt: "OKroot landing: AI food label scanner for dietary restrictions",
      problem:
        "An app with several dietary restrictions has to say precisely who it serves and what it does before anyone signs up. And because it deals with health, it cannot promise what it is not: no medical claims and no technology names that do not help the user.",
      solution:
        "An Astro landing that starts from everyday pain, shows how the scanner works in three steps, compares against existing apps and presents the founder as the first user. Every button leads to a waitlist with explicit consent, without asking for health data, and analytics only load if the visitor accepts them.",
      links: [
        {
          href: "https://okroot.co/",
          text: "Visit site",
          ariaLabel: "Visit OKroot landing",
        },
      ],
      designLink: {
        href: "https://okroot-landing-prototype.netlify.app/",
        text: "View design",
        ariaLabel: "View OKroot Landing design",
      },
      metaDescription:
        "OKroot Landing case study: static landing in Astro and Tailwind CSS with a Supabase waitlist, consent-gated analytics and a recipe collection.",
      architecture: [
        "Astro 5 with static output and Tailwind CSS 4 configured in CSS. No adapter and no UI framework: JavaScript is vanilla, one script per component. Lucide icons are inlined at build time as SVG, with no JavaScript in the browser.",
        "A landing page of nine sections in a fixed order: Hero, Pain, How it works, Comparison, Features, Success stories, Pricing, Waitlist and FAQ. There are also About, Contact and FAQ pages, and the four legal ones (privacy, terms, habeas data and cookies).",
        "A recipe collection as a content collection: each recipe is a Markdown file validated at build time with a zod schema. A recipe that does not comply breaks the build and never reaches production. The index and one page per recipe are generated statically, with recipe JSON-LD and breadcrumbs.",
        "The pricing section data and the early access spots live in a single constants file, and the spots counter accepts only a real number: at zero, the scarcity line disappears.",
        "A waitlist with name, email and a required consent checkbox, plus a hidden honeypot field. It sends JSON to a Vercel function that validates and normalizes, and stores in a shared Supabase table with the service key only on the server. The browser never talks to Supabase.",
        "The function stores only name, email, product, consent date and the page path. It neither receives nor stores health data or the IP, and drops any extra field. A repeated email answers 'you are already in' without creating another row, and it only stores in production: in preview it validates and reports that storage is disabled.",
        "Analytics: GA4 with consent. It never loads by default; a cookie banner stores the preference and, only if the visitor accepts, injects gtag.js with the ID from an environment variable. If the variable is missing, no request is made. A manual page_view covers navigation with transitions.",
        "Navigation with View Transitions as progressive enhancement: each route is still a real HTML file, and scripts re-run on every page load.",
        "Technical SEO: title, description, canonical, Open Graph and Twitter, automatic sitemap and JSON-LD with Organization, WebSite, SoftwareApplication and FAQPage. The FAQ feeds the accordion and the schema from the same source.",
        "Security from vercel.json: strict CSP with script-src 'self' and only the Google Analytics origins, HSTS, X-Frame-Options DENY, a Permissions-Policy without camera or microphone and immutable caching on hashed files.",
        "Quality: verification is astro check (TypeScript and templates) plus the build, which also validates the recipe schema. CI runs both on every pull request, with a dependency audit that reports but does not block. There are no automated UI tests.",
      ],
      painPoints: [
        {
          title: "Reading every label, one by one",
          text: "The supermarket becomes an ingredient review, and 'modified starch' at 8 pm helps nobody.",
        },
        {
          title: "Crossing several conditions in the same meal",
          text: "Celiac disease and diabetes at once, plus lactose, and each app solves only one.",
        },
        {
          title: "Recipes that looked safe",
          text: "Discarding after the fact what was not safe, and counting the carbohydrates of every dish by hand.",
        },
        {
          title: "A health promise that cannot be sustained",
          text: "On a medical topic, one claim too many costs trust and exposes you. You have to say what the tool does and what it does not.",
        },
      ],
      modules: [
        {
          name: "Hero with a concrete promise",
          text: "Headline 'Photograph the label. Know in seconds if you can eat it', the three conditions named, a button to the waitlist and an animated scanner mock.",
        },
        {
          name: "Pain, in six scenes",
          text: "A carousel with the six everyday annoyances: horizontal swipe on mobile and pinned scrolling on desktop.",
        },
        {
          name: "How it works and comparison",
          text: "Three steps (photograph, AI analysis and an answer with the reason) and a table against other apps: restrictions together, the real label and scope beyond the scanner.",
        },
        {
          name: "Features and founder",
          text: "Persistent profile, curated recipes and a diary with offline support, and a section presenting the creator as the first user, with links to her portfolio and social profiles.",
        },
        {
          name: "Waitlist and FAQ",
          text: "A form with explicit consent and nine frequently asked questions that answer with clear limits: it is not a replacement for the doctor and today it only reads ingredient labels.",
        },
        {
          name: "Recipe collection",
          text: "16 gluten-free recipes with times, ingredients and notes. Benefits are only published if they cite a verifiable source.",
        },
      ],
      decisions: [
        {
          title: "Action before the list of conditions",
          context:
            "There are three conditions and a single button. Listing them all on the first screen dilutes the action.",
          tradeoff: "Naming the conditions gives clarity. Putting them in a button overloads it.",
          decision:
            "The headline promises the action ('photograph the label') and names the three conditions once, below. Every button leads to the same destination: the waitlist.",
        },
        {
          title: "Copy without stack or medical claims",
          context:
            "The user does not need to know what it was built with, and in health, words like diagnosis or treatment promise what the tool is not.",
          tradeoff:
            "Leaving out the stack removes technical credibility. Leaving out medical claims limits the pitch.",
          decision:
            "The text describes the benefit and never the technology. The answers clarify that it is an aid for deciding and does not replace the doctor, and recipes only publish benefits with a source.",
        },
        {
          title: "A founder who is the first user",
          context:
            "A health product without social proof loses trust, but inventing cases destroys it.",
          tradeoff:
            "A single case is little evidence. A real one weighs more than several filler ones.",
          decision:
            "The success stories section tells the creator's real story and leaves a carousel ready to add cases when they exist, without inventing them.",
        },
        {
          title: "Consent before analytics",
          context:
            "The landing talks about health, and loading a tracking script by default contradicts what it promises.",
          tradeoff: "GA4 behind a banner loses some visits, but the cookie policy can be true.",
          decision:
            "GA4 only loads if the visitor accepts, and it turns off if there is no ID. The banner clarifies that no health profile data is collected.",
        },
        {
          title: "The waitlist does not ask for health data",
          context:
            "Asking for the condition when signing up would give useful data, but would turn a contact list into sensitive data.",
          tradeoff:
            "Without the condition you cannot segment. In exchange, there is no health data to protect.",
          decision:
            "The form asks for name and email, and the function stores only allow-listed columns. Any extra field is dropped on the server.",
        },
        {
          title: "Static, with a single server function",
          context:
            "A landing does not need its own backend, but the form has to store without exposing keys.",
          tradeoff:
            "The Vercel function does not run under Astro's dev server, and preview has no database.",
          decision:
            "The site is static and the form talks to a function that uses the service key only on the server. Outside production it validates and does not store.",
        },
        {
          title: "A shared contacts table",
          context:
            "Each Lúmina W product has its own waitlist, and keeping one database per product multiplies the work.",
          tradeoff:
            "A shared table requires each function to set its own product and the table script to be identical across repositories.",
          decision:
            "The waitlists share a table with a unique key on product and email. The function sets the product on the server and never reads it from the request.",
        },
      ],
      design: [
        "The design starts from a navigable prototype, reachable from the View design button.",
        "Violet as the primary color on cream backgrounds, in the same visual family as the app, with a hero in a soft gradient card.",
        "Fonts are self-hosted and served from the site itself, requesting nothing from third parties.",
        "Sections with an editorial eyebrow, reveal animations with IntersectionObserver and pure CSS, without an animation library.",
        "Iconography as inlined SVG: never text arrows in buttons nor long dashes in the copy.",
        "An animated scanner in the hero that shows the scan and the verdict without loading the real product.",
        "All content is in Spanish and so are the routes (preguntas, contacto, sobre-mi, recetas).",
      ],
      results: [
        "Landing in production with the waitlist storing requests, a recipe collection and legal pages.",
        "Consent-gated analytics and technical SEO with structured data from launch.",
      ],
      learnings: [
        "Communicating three restrictions in a single call requires prioritizing the action over the list of conditions: photographing the label is understood faster than listing what you have.",
        "On a health topic, what you do not promise is worth as much as what you do. With no medical claims, no stack and no invented cases, every sentence can be defended.",
        "Analytics that wait for consent and a form that does not ask for health data are product decisions, not only compliance ones.",
        "A schema that validates content at build time prevents a broken recipe from reaching production, even without automated UI tests.",
        "Pricing, spots and limits drift apart when copied across several pages: one source is better, and the text should be checked against the product.",
      ],
      roadmap: {
        now: ["Landing in production collecting the early access waitlist."],
        next: ["Add more success stories: today the landing tells only the founder's."],
        later: [
          "More languages and markets, and more conditions and combinations, according to the FAQ.",
        ],
      },
    },
  },
  {
    title: "NullBreach",
    slug: "nullbreach",
    quoteType: "security",
    datePublished: "2026-06-16",
    dateModified: "2026-09-25",
    tag: "Live",
    tagColor: "green",
    image: "images/og-nullbreach.webp",
    imageAlt: "NullBreach: análisis de código con IA basado en OWASP y chat de seguridad",
    imageWidth: 1200,
    imageHeight: 630,
    stack: [
      "Next.js",
      "TypeScript",
      "NextAuth",
      "Prisma",
      "PostgreSQL",
      "OpenAI API",
      "Astro (landing)",
    ],
    appCategory: "SecurityApplication",
    programmingLanguage: ["TypeScript", "SQL"],
    summary:
      "Aplicación de seguridad con Next.js, análisis de código alineado con OWASP y chat con OpenAI. Prisma Postgres guarda usuarios, consultas y análisis. Landing en Astro.",
    filters: ["full-stack", "ai"],
    problem:
      "Revisar código con criterio OWASP o resolver una duda puntual de ciberseguridad implica saltar entre scanners pesados, documentación dispersa y foros desactualizados.",
    solution:
      "Aplicación autenticada para analizar fragmentos de código con guía OWASP y consultar al asistente de seguridad. Las preguntas, respuestas y análisis quedan guardados por usuario.",
    architecture: [
      "OpenAI Responses API analiza fragmentos de código en busca de vulnerabilidades alineadas con OWASP y explica severidad, impacto y remediación.",
      "Aplicación Next.js App Router que reúne interfaz, autenticación, rutas API e integración con OpenAI.",
      "Chat de seguridad con OpenAI; las preguntas y respuestas se guardan en el historial de cada usuario.",
      "Prisma ORM y Prisma Postgres para usuarios, historial de chat y análisis de código.",
      "NextAuth Credentials con sesiones JWT en cookies HTTP-only.",
      "La landing de NullBreach continúa en Astro; la aplicación principal se despliega como proyecto Next.js independiente.",
    ],
    links: [
      {
        href: "https://www.wavival.dev/nullbreach/",
        text: "Ver app",
        ariaLabel: "Ver app de NullBreach",
        event: "ver-app-nullbreach",
      },
      {
        href: "https://github.com/wavival/nullbreach",
        text: "Ver repositorio",
        ariaLabel: "Ver repositorio de NullBreach",
      },
    ],
    caseStudy: true,
    schemaType: "SoftwareApplication",
    metaDescription:
      "Caso de estudio de NullBreach: aplicación Next.js de seguridad con OpenAI y Prisma Postgres, más una landing en Astro.",
    results: [
      "Análisis con OpenAI Responses API que entrega hallazgos de seguridad alineados con OWASP, con severidad, impacto y recomendaciones de remediación.",
      "Historial de chat por usuario persistido en Prisma Postgres junto con los análisis de código.",
      "Aplicación Next.js con autenticación NextAuth, sesiones JWT y datos persistidos con Prisma Postgres.",
    ],
    learnings: [
      "Usar un modelo de lenguaje para revisar código exige presentar sus hallazgos como asistencia de análisis y no como una verificación determinista.",
      "Concentrar la interfaz, autenticación y rutas API en una aplicación Next.js simplifica el despliegue y mantiene una sola frontera de aplicación.",
      "El análisis de seguridad con un modelo requiere instrucciones claras sobre el marco OWASP, la severidad, el impacto y las recomendaciones que debe incluir.",
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
        title: "Hallazgos sin guía accionable",
        text: "Una lista de patrones no basta si no explica la severidad, el impacto y cómo remediarlos.",
      },
    ],
    modules: [
      {
        name: "Análisis de código",
        text: "Envía un fragmento a OpenAI para recibir hallazgos alineados con OWASP, su impacto y recomendaciones.",
      },
      {
        name: "Historial del chat",
        text: "Consulta preguntas y respuestas anteriores guardadas en tu cuenta.",
      },
      {
        name: "Recomendaciones de remediación",
        text: "El análisis explica la severidad e impacto y sugiere cómo corregir los riesgos identificados.",
      },
      {
        name: "Código abierto",
        text: "El código de la aplicación está abierto en github.com/wavival/nullbreach.",
      },
    ],
    decisions: [
      {
        title: "OpenAI para análisis orientado a OWASP",
        context:
          "Una revisión manual de código requiere conocimientos de seguridad y tiempo para explicar el impacto y las correcciones.",
        tradeoff:
          "Las respuestas de un modelo pueden equivocarse y no deben presentarse como resultados deterministas de un escáner.",
        decision:
          "OpenAI Responses API recibe el código con instrucciones de análisis alineadas con OWASP y explica severidad, impacto y remediación.",
      },
      {
        title: "Historial de chat por usuario",
        context: "Las consultas y respuestas deben quedar asociadas a la cuenta que las realizó.",
        tradeoff: "Sin persistencia, el usuario perdería el registro de sus consultas anteriores.",
        decision:
          "NextAuth Credentials con sesiones JWT y Prisma Postgres para guardar usuarios, conversaciones y análisis.",
      },
      {
        title: "NextAuth para sesiones por usuario",
        context:
          "Las sesiones necesitan asociar de forma segura el historial de cada persona con su cuenta.",
        tradeoff:
          "Las sesiones deben proteger el acceso y mantener separado el historial de cada cuenta.",
        decision:
          "NextAuth Credentials usa sesiones JWT en cookies HTTP-only para proteger el acceso a la aplicación.",
      },
      {
        title: "Next.js para la aplicación",
        context:
          "La aplicación requiere interfaz autenticada, chat, análisis de código y rutas API.",
        tradeoff: "Separar frontend y backend añade despliegues y contratos entre servicios.",
        decision:
          "Next.js App Router reúne interfaz, autenticación y rutas API; Astro sigue reservado para la landing.",
      },
      {
        title: "Prisma Postgres como persistencia",
        context: "Usuarios, chats y análisis necesitan persistencia relacional gestionada.",
        tradeoff:
          "Mantener el acceso a datos separado de las rutas de interfaz facilita el modelado y las migraciones.",
        decision:
          "Prisma ORM sobre Prisma Postgres modela y persiste usuarios, historial de chat y análisis de código.",
      },
    ],
    en: {
      summary:
        "Next.js security application with OWASP-aligned code analysis, OpenAI chat, and persistent data in Prisma Postgres. Marketing landing in Astro.",
      imageAlt: "NullBreach: OWASP-aligned AI code analysis and security chat",
      problem:
        "Reviewing code with OWASP criteria or resolving a specific cybersecurity question means jumping between heavy scanners, scattered documentation, and outdated forums.",
      solution:
        "An authenticated application for analyzing code snippets with OWASP-aligned guidance and asking the security assistant. Questions, answers, and analyses are stored per user.",
      links: [
        {
          href: "https://www.wavival.dev/nullbreach/",
          text: "View app",
          ariaLabel: "View NullBreach app",
          event: "ver-app-nullbreach",
        },
        {
          href: "https://github.com/wavival/nullbreach",
          text: "View repo",
          ariaLabel: "View NullBreach repository",
        },
      ],
      metaDescription:
        "NullBreach case study: Next.js security application with OpenAI and Prisma Postgres, plus an Astro landing page.",
      architecture: [
        "OpenAI Responses API analyzes code snippets for OWASP-aligned vulnerabilities, severity, impact, and remediation.",
        "Next.js App Router application combining the interface, authentication, API route handlers, and OpenAI integration.",
        "OpenAI security chat; questions and answers are stored in each user's history.",
        "Prisma ORM and Prisma Postgres for users, chat history, and code analyses.",
        "NextAuth Credentials with JWT sessions in HTTP-only cookies.",
        "The NullBreach landing remains in Astro; the main application deploys as an independent Next.js project.",
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
          title: "Findings without guidance",
          text: "A list of patterns is not enough if it does not explain severity, impact, and remediation.",
        },
      ],
      modules: [
        {
          name: "OWASP analysis",
          text: "Submit a snippet to OpenAI for OWASP-aligned findings, impact, and remediation guidance.",
        },
        {
          name: "Security chat history",
          text: "Ask security questions and review the questions and answers saved to your account.",
        },
        {
          name: "Remediation guidance",
          text: "The analysis explains severity and impact and suggests how to fix identified risks.",
        },
        {
          name: "Open source",
          text: "The application source is open at github.com/wavival/nullbreach.",
        },
      ],
      decisions: [
        {
          title: "OpenAI for OWASP-aligned analysis",
          context:
            "Manual code review requires security knowledge and time to explain impact and remediation.",
          tradeoff:
            "Model responses can be wrong and should not be presented as deterministic scanner results.",
          decision:
            "OpenAI Responses API receives code with OWASP-aligned analysis instructions and explains severity, impact, and remediation.",
        },
        {
          title: "Per-user chat history",
          context:
            "Questions and answers need to be associated with the account that submitted them.",
          tradeoff: "Without persistence, users would lose the record of their previous questions.",
          decision:
            "NextAuth Credentials with JWT sessions and Prisma Postgres to store users, conversations, and analyses.",
        },
        {
          title: "NextAuth for per-user sessions",
          context: "Sessions need to associate each person's history with their account securely.",
          tradeoff: "Sessions must protect access and keep each account's history separate.",
          decision:
            "NextAuth Credentials uses JWT sessions in HTTP-only cookies to protect access to the application.",
        },
        {
          title: "Next.js for the application",
          context:
            "The application needs an authenticated interface, chat, code analysis, and API routes.",
          tradeoff: "Separating frontend and backend adds deployments and service contracts.",
          decision:
            "Next.js App Router combines the interface, authentication, and API routes; Astro remains for the landing page.",
        },
        {
          title: "Prisma Postgres for persistence",
          context: "Users, chats, and analyses need managed relational persistence.",
          tradeoff:
            "Keeping data access separate from interface routes helps manage the data model and migrations.",
          decision:
            "Prisma ORM on Prisma Postgres models and persists users, chat history, and code analyses.",
        },
      ],
      results: [
        "OpenAI Responses API analyzes code snippets for OWASP-aligned findings, severity, impact, and remediation guidance.",
        "Chat questions and answers are stored in Prisma Postgres as user-specific history.",
        "NextAuth credentials authentication with JWT sessions and Prisma Postgres persistence in a single Next.js application.",
      ],
      learnings: [
        "Using a language model to review code means presenting its findings as analysis assistance rather than deterministic verification.",
        "Combining the interface, authentication, and API route handlers in Next.js keeps the application boundary and deployment straightforward.",
        "Security analysis with a language model requires clear instructions about the OWASP framework, severity, impact, and the recommendations it should include.",
      ],
    },
  },
  {
    title: "Lúmina W",
    slug: "lumina-w",
    quoteType: "landing",
    datePublished: "2026-06-16",
    dateModified: "2026-06-16",
    tag: "Live",
    tagColor: "green",
    image: "images/og-lumina-w.webp",
    imageAlt: "Landing de Lúmina W: hero con tagline de marca y llamado a la acción",
    imageWidth: 1200,
    imageHeight: 630,
    stack: ["Astro", "Tailwind CSS", "Supabase", "SEO", "A11y", "GA4", "Performance"],
    filters: ["landing", "design"],
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
    designLink: {
      href: "https://luminaw-landing-prototype.netlify.app/",
      text: "Ver diseño",
      ariaLabel: "Ver diseño de Lúmina W",
    },
    en: {
      imageAlt: "Lumina W landing: brand tagline and call to action",
      problem:
        "Every company needs a digital presence that clearly communicates who they are and what they do.",
      solution:
        "I designed and implemented the complete Lumina W landing: Astro architecture, Tailwind CSS styling, Supabase-backed contact form, full technical SEO, and continuous deployment.",
      links: [{ href: "https://luminaw.co", text: "Visit site", ariaLabel: "Visit Lumina W" }],
      designLink: {
        href: "https://luminaw-landing-prototype.netlify.app/",
        text: "View design",
        ariaLabel: "View Lumina W design",
      },
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
    quoteType: "web-app",
    datePublished: "2026-06-18",
    dateModified: "2026-09-25",
    tag: "Live",
    tagColor: "green",
    image: "images/og-blogw.webp",
    imageAlt:
      "Blog de Lúmina W: contenido técnico sobre desarrollo web, ciberseguridad y productos digitales",
    imageWidth: 1200,
    imageHeight: 630,
    stack: ["Next.js", "PWA"],
    filters: ["full-stack", "ai", "pwa", "design"],
    problem:
      "El conocimiento técnico generado en proyectos reales necesita un canal propio para llegar a la comunidad sin depender de plataformas externas.",
    solution:
      "Blog PWA de Lúmina W, migrado a Next.js, con contenido técnico sobre desarrollo web, ciberseguridad y productos digitales en blog.luminaw.co.",
    architecture: ["Aplicación del blog desarrollada con Next.js y presentada como PWA."],
    results: [
      "Blog en producción con contenido técnico sobre desarrollo web, ciberseguridad y productos digitales.",
    ],
    caseStudy: true,
    schemaType: "WebSite",
    metaDescription:
      "Caso de estudio del Blog de Lúmina W: PWA desarrollada con Next.js para publicar contenido técnico sobre desarrollo web, ciberseguridad y productos.",
    links: [
      {
        href: "https://blog.luminaw.co",
        text: "Ver sitio",
        ariaLabel: "Ver blog de Lúmina W",
      },
    ],
    designLink: {
      href: "https://blog-w-prototype.netlify.app/",
      text: "Ver diseño",
      ariaLabel: "Ver diseño de Blog Lúmina W",
    },
    en: {
      imageAlt:
        "Lumina W blog: technical content on web development, cybersecurity, and digital products",
      problem:
        "Technical knowledge generated in real projects needs its own channel to reach the community without depending on external platforms.",
      solution:
        "Lumina W's Next.js blog PWA publishes technical content on web development, cybersecurity, and digital products at blog.luminaw.co.",
      links: [
        {
          href: "https://blog.luminaw.co",
          text: "Visit site",
          ariaLabel: "Visit Lumina W blog",
        },
      ],
      designLink: {
        href: "https://blog-w-prototype.netlify.app/",
        text: "View design",
        ariaLabel: "View Lumina W Blog design",
      },
      metaDescription:
        "Lumina W Blog case study: a Next.js PWA for technical content on web development, cybersecurity, and products.",
      architecture: ["Blog application developed with Next.js and presented as a PWA."],
      results: [
        "Blog in production with technical content on web development, cybersecurity, and digital products.",
      ],
    },
  },
  {
    title: "wavival.dev",
    slug: "wavival-dev",
    quoteType: "design",
    datePublished: "2026-10-01",
    dateModified: "2026-10-02",
    tag: "Live",
    tagColor: "green",
    image: "images/og-wavival-dev.webp",
    imageAlt:
      "Página de herramientas de wavival.dev en tema oscuro: encabezado, título editorial en Raleway, regla de 1px e índice numerado",
    imageWidth: 1200,
    imageHeight: 630,
    stack: ["Astro", "TypeScript", "Tailwind CSS", "Vercel", "Playwright"],
    filters: ["design"],
    summary:
      "Este portfolio como caso de diseño: el sistema @wavival | Design System v4, editorial y estático, con reglas en lugar de cajas, una sola señal azul y contraste AA en ambos temas. Bilingüe, sobre Astro y Tailwind, diseñado en Claude Design.",
    problem:
      "Un portafolio de desarrolladora suele terminar como plantilla: tarjetas con sombra, acentos de color que no pasan contraste, animación que compite con el contenido y un diseño que en el código ya no se parece al prototipo. Necesitaba un sitio que fuera en sí mismo la prueba de mi criterio técnico y de diseño: rápido, accesible, bilingüe y con una identidad reconocible.",
    solution:
      "wavival.dev es mi portafolio y también un caso de diseño. El sistema se llama @wavival | Design System v4: la página se lee como un índice editorial, con reglas de 1px en lugar de cajas, titulares grandes en Raleway 800, índices numerados y una sola señal azul sobre un campo tranquilo. Nació en Claude Design como prototipo y sistema de diseño, y se llevó al código con paridad de tokens. Es bilingüe (español en la raíz, inglés bajo /en), estático y oscuro por defecto.",
    painPoints: [
      {
        title: "Plantilla genérica",
        text: "Tarjetas con sombra y radios por todas partes: se ve como cualquier otro portafolio.",
      },
      {
        title: "Contraste frágil",
        text: "El azul de acento anterior solo llegaba a 3,24:1 con texto blanco, por debajo de AA.",
      },
      {
        title: "Decoración sobre contenido",
        text: "Animación al hacer scroll e iconos en cada enlace compiten con lo que importa.",
      },
      {
        title: "Prototipo y código distintos",
        text: "El diseño dice una cosa y el sitio publicado otra, porque nada obliga a mantenerlos iguales.",
      },
    ],
    architecture: [
      "Astro 7 con salida estática y TypeScript. Tailwind 3 mapeado a tokens CSS, y scripts de cliente en TypeScript vanilla solo para el tema, el menú móvil y los filtros de proyectos.",
      "Estructura atómica (átomos, moléculas, organismos y una plantilla única). Los organismos reciben el idioma y las rutas localizadas salen de una sola función.",
      "i18n propio: español en la raíz e inglés bajo /en, con el mapa de slugs como única fuente de verdad para el selector de idioma, el sitemap y los hreflang.",
      "Contenido tipado (proyectos y stack) con campos paralelos para inglés. Todos los casos de estudio se generan desde un solo arreglo.",
      "SEO y descubrimiento: JSON-LD con Person, Organization y WebSite, OpenGraph por proyecto, sitemap con alternates recíprocos y llms.txt para asistentes de IA.",
      "Rendimiento: fuentes autohospedadas en subconjunto latino, precarga de la imagen LCP solo donde se usa y View Transitions entre rutas. Core Web Vitals se reportan a Umami cuando hay configuración.",
      "Seguridad de cabeceras: CSP por hashes, sin unsafe-inline en scripts, con una guardia en CI que recalcula los hashes de cada script inline.",
      "Despliegue en Vercel con microfrontends (el portafolio y NullBreach comparten dominio) y una única función serverless para el formulario de cotización, que envía por Brevo.",
      "Flujo dev, stg y main con commitlint, pruebas E2E con Playwright, Lighthouse CI y verificación de enlaces como puertas de calidad.",
    ],
    links: [],
    designLink: {
      href: "https://wavival-prototype.netlify.app/",
      text: "Ver diseño",
      ariaLabel: "Ver diseño de wavival.dev",
    },
    designSystemLink: {
      href: "https://claude.ai/design/p/340457ab-7efe-4c7e-b9bf-6cda2abd21bd?via=share",
      text: "Ver sistema de diseño",
      ariaLabel: "Ver sistema de diseño de wavival.dev",
    },
    caseStudy: true,
    schemaType: "WebSite",
    metaDescription:
      "Caso de estudio de wavival.dev: el portfolio como diseño. @wavival | Design System v4, editorial y estático, bilingüe, con contraste AA. Astro y Tailwind.",
    design: [
      "Sistema @wavival | Design System v4: la página se lee como un índice editorial, con una señal azul sobre un campo tranquilo.",
      "Diseñado en Claude Design, con un prototipo navegable y un sistema de diseño propio. El sitio replica el prototipo token a token.",
      "Reglas, no cajas: la estructura sale de líneas de 1px. No hay sombras, las superficies tienen radio 0 y los controles 2px.",
      "Una sola señal azul con roles separados: un azul para texto, íconos y foco; otro para rellenos y texto grande; otro para los índices; y otro para el botón primario. Cada uno pasa contraste en su uso.",
      "Escala editorial: Raleway 800 en tamaños fluidos con interlineado de 0,9 a 1 en titulares y tracking negativo; Poppins para el cuerpo. Ambas autohospedadas.",
      "Índices numerados (01, 02) como guía de lectura, y cada sección abre con una regla de 1px.",
      "Una columna al ancho completo del contenedor (1280px), con el ritmo vertical definido por tokens de espacio.",
      "Íconos solo donde funcionan: en los botones de solo ícono y en el botón primario. Los enlaces y botones de texto no llevan flechas.",
      'El estado se dice con texto: el acordeón es un details nativo que muestra "Ver" y "Cerrar" en lugar de un chevron.',
      "Oscuro por defecto y alternable. Un script previo al primer pintado aplica el tema sin parpadeo, el tema va por clase y no por media query, y el color del navegador se sincroniza.",
      "La accesibilidad como restricción de diseño: foco visible de 2px, contraste AA calculado por token en ambos temas, objetivos táctiles de 44px, menú móvil con foco atrapado y respeto de prefers-reduced-motion.",
      "Movimiento mínimo y funcional: sin animación al hacer scroll, solo transiciones cortas, View Transitions entre rutas y un acordeón de 220ms.",
      "El sistema está documentado: tokens, clases de componente y catálogo viven en DESIGN.md y COMPONENTS.md.",
    ],
    decisions: [
      {
        title: "Reglas en lugar de cajas",
        context:
          "Las tarjetas con sombra y radio son el patrón por defecto de casi cualquier portafolio.",
        tradeoff:
          "Sin sombras ni radios, la jerarquía depende de la tipografía y el espacio, y exige más cuidado.",
        decision:
          "Estructura con líneas de 1px, superficies con radio 0 y listas dibujadas con bordes. La jerarquía la llevan la escala y los índices.",
      },
      {
        title: "Una señal azul, cuatro roles",
        context:
          "El acento anterior solo alcanzaba 3,24:1 con texto blanco y un mismo azul no pasa contraste en texto pequeño y en rellenos a la vez.",
        tradeoff:
          "Cuatro tokens de azul son más para mantener que uno, pero un solo azul obliga a ceder contraste o presencia.",
        decision:
          "Un azul por rol (texto y foco, rellenos y texto grande, índices, botón primario). El relleno del botón es igual en ambos temas para que el texto blanco se mantenga sobre 4,5:1.",
      },
      {
        title: "Escala editorial con tipografía autohospedada",
        context:
          "La identidad del sitio depende de titulares grandes y compactos, y de que carguen sin saltos.",
        tradeoff:
          "Autohospedar exige generar los subconjuntos y precargar; una fuente de terceros es más simple pero añade una petición y un punto de falla.",
        decision:
          "Raleway variable (600 a 800) y Poppins estática en subconjunto latino y woff2, con font-display swap y precarga solo de los pesos críticos.",
      },
      {
        title: "Estático y sin animación de scroll",
        context:
          "Una animación que oculta contenido hasta que aparece compite con la lectura y con el rendimiento.",
        tradeoff:
          "Un sitio estático se siente menos espectacular, pero el diseño se apoya en la tipografía y el ritmo.",
        decision:
          "Sin scroll reveal ni librería de animación. Acordeón nativo con el estado en texto y solo transiciones cortas, todas desactivadas con prefers-reduced-motion.",
      },
      {
        title: "Oscuro por defecto, por clase",
        context:
          "Seguir la preferencia del sistema deja el diseño en manos del dispositivo, y cambiar el tema tras el primer pintado produce un parpadeo.",
        tradeoff:
          "Fijar el oscuro como inicio ignora la preferencia del sistema, y un script inline obliga a mantener el CSP por hashes.",
        decision:
          "Un script síncrono al inicio del head aplica la clase dark antes de cargar los estilos, salvo que el usuario haya guardado el tema claro. El CSP incluye el hash de ese script.",
      },
      {
        title: "Español en la raíz, inglés bajo /en",
        context:
          "El sitio atiende a clientes en español y en inglés, y cada página necesita su equivalente.",
        tradeoff:
          "Slugs traducidos mejoran el SEO local pero obligan a mantener el mapeo entre idiomas.",
        decision:
          "Slugs en español en la raíz y en inglés bajo /en, con un único mapa que alimenta el selector de idioma, el sitemap y los hreflang.",
      },
    ],
    results: [
      "Sitio bilingüe en producción en www.wavival.dev, con 34 páginas estáticas entre español e inglés.",
      "Diseño implementado con paridad respecto al prototipo de Claude Design.",
      "Puertas de calidad en cada cambio: pruebas E2E con Playwright, Lighthouse CI (accesibilidad y SEO con mínimo 0,9), verificación de enlaces rotos, de hashes CSP y de clases CSS.",
    ],
    learnings: [
      "Un sistema de diseño solo vale si se traduce a tokens: cada color y tamaño vive como variable CSS y los componentes no llevan valores sueltos.",
      "El contraste se decide en el token: el acento anterior (3,24:1) obligó a separar un azul por rol.",
      "Tailwind purga las clases construidas por fragmentos (btn-${variant}). Los componentes deben usar nombres de clase completos.",
      "Un backdrop-filter convierte al elemento en contenedor de sus hijos fixed: el menú móvil tuvo que ser hermano del header y no hijo.",
      "Un componente con el mismo nombre que una utilidad de Tailwind arrastra sus estilos donde se use la utilidad: .text-link pasó a llamarse .action-link.",
    ],
    en: {
      summary:
        "This portfolio as a design case: the @wavival | Design System v4, editorial and static, with rules instead of boxes, a single blue signal, and AA contrast in both themes. Bilingual, built on Astro and Tailwind, designed in Claude Design.",
      imageAlt:
        "wavival.dev tools page in dark theme: header, editorial Raleway title, a 1px rule, and a numbered index",
      problem:
        "A developer portfolio often ends up as a template: shadow cards, accent colors that fail contrast, animation that competes with the content, and a design that in code no longer looks like the prototype. I needed a site that was itself proof of my technical and design judgment: fast, accessible, bilingual, and with a recognizable identity.",
      solution:
        "wavival.dev is my portfolio and also a design case. The system is called @wavival | Design System v4: the page reads like an editorial index, with 1px rules instead of boxes, large Raleway 800 headlines, numbered indexes, and a single blue signal on a quiet field. It started in Claude Design as a prototype and design system, and was brought to code with token parity. It is bilingual (Spanish at the root, English under /en), static, and dark by default.",
      links: [],
      designLink: {
        href: "https://wavival-prototype.netlify.app/",
        text: "View design",
        ariaLabel: "View wavival.dev design",
      },
      designSystemLink: {
        href: "https://claude.ai/design/p/340457ab-7efe-4c7e-b9bf-6cda2abd21bd?via=share",
        text: "View design system",
        ariaLabel: "View wavival.dev design system",
      },
      metaDescription:
        "wavival.dev case study: the portfolio as design. @wavival | Design System v4, editorial, static, bilingual, AA contrast. Built with Astro and Tailwind.",
      painPoints: [
        {
          title: "Generic template",
          text: "Shadow cards and radii everywhere: it looks like any other portfolio.",
        },
        {
          title: "Fragile contrast",
          text: "The previous accent blue only reached 3.24:1 with white text, below AA.",
        },
        {
          title: "Decoration over content",
          text: "Scroll animation and icons on every link compete with what matters.",
        },
        {
          title: "Prototype and code drift apart",
          text: "The design says one thing and the published site another, because nothing forces them to stay equal.",
        },
      ],
      architecture: [
        "Astro 7 with static output and TypeScript. Tailwind 3 mapped to CSS tokens, and client scripts in vanilla TypeScript only for the theme, the mobile menu, and the project filters.",
        "Atomic structure (atoms, molecules, organisms, and a single template). Organisms receive the language and localized routes come from a single function.",
        "Own i18n: Spanish at the root and English under /en, with the slug map as the single source of truth for the language toggle, the sitemap, and hreflang.",
        "Typed content (projects and stack) with parallel English fields. Every case study is generated from a single array.",
        "SEO and discovery: JSON-LD with Person, Organization, and WebSite, per-project OpenGraph, a sitemap with reciprocal alternates, and llms.txt for AI assistants.",
        "Performance: self-hosted fonts in a Latin subset, LCP image preload only where it is used, and View Transitions between routes. Core Web Vitals are reported to Umami when configured.",
        "Header security: hash-based CSP, no unsafe-inline on scripts, with a CI guard that recomputes the hash of every inline script.",
        "Deployment on Vercel with microfrontends (the portfolio and NullBreach share a domain) and a single serverless function for the quote form, which sends through Brevo.",
        "A dev, stg, and main flow with commitlint, Playwright E2E tests, Lighthouse CI, and link checking as quality gates.",
      ],
      design: [
        "@wavival | Design System v4: the page reads like an editorial index, with one blue signal on a quiet field.",
        "Designed in Claude Design, with a clickable prototype and its own design system. The site replicates the prototype token by token.",
        "Rules, not boxes: structure comes from 1px lines. There are no shadows, surfaces have radius 0, and controls have 2px.",
        "A single blue signal with separate roles: one blue for text, icons, and focus; another for fills and large text; another for the indexes; and another for the primary button. Each one passes contrast in its use.",
        "Editorial scale: Raleway 800 in fluid sizes with 0.9 to 1 line height on headlines and negative tracking; Poppins for body. Both self-hosted.",
        "Numbered indexes (01, 02) as a reading guide, and every section opens with a 1px rule.",
        "A single column at the full container width (1280px), with vertical rhythm defined by spacing tokens.",
        "Icons only where they work: on icon-only buttons and on the primary button. Text links and buttons carry no arrows.",
        'State is told with text: the accordion is a native details element that shows "View" and "Close" instead of a chevron.',
        "Dark by default and toggleable. A script before first paint applies the theme without flicker, the theme is class-based and not a media query, and the browser color stays in sync.",
        "Accessibility as a design constraint: 2px visible focus, AA contrast computed per token in both themes, 44px touch targets, a mobile menu with trapped focus, and respect for prefers-reduced-motion.",
        "Minimal, functional motion: no scroll animation, only short transitions, View Transitions between routes, and a 220ms accordion.",
        "The system is documented: tokens, component classes, and the catalog live in DESIGN.md and COMPONENTS.md.",
      ],
      decisions: [
        {
          title: "Rules instead of boxes",
          context: "Shadow and radius cards are the default pattern of almost any portfolio.",
          tradeoff:
            "Without shadows or radii, hierarchy depends on typography and space, and demands more care.",
          decision:
            "Structure with 1px lines, radius-0 surfaces, and lists drawn with borders. Hierarchy comes from the scale and the indexes.",
        },
        {
          title: "One blue signal, four roles",
          context:
            "The previous accent only reached 3.24:1 with white text, and a single blue cannot pass contrast for small text and for fills at once.",
          tradeoff:
            "Four blue tokens are more to maintain than one, but a single blue forces you to give up contrast or presence.",
          decision:
            "One blue per role (text and focus, fills and large text, indexes, primary button). The button fill is the same in both themes so white text stays above 4.5:1.",
        },
        {
          title: "Editorial scale with self-hosted type",
          context:
            "The site identity depends on large, tight headlines that load without layout jumps.",
          tradeoff:
            "Self-hosting requires generating the subsets and preloading; a third-party font is simpler but adds a request and a point of failure.",
          decision:
            "Variable Raleway (600 to 800) and static Poppins in Latin subset and woff2, with font-display swap and preload only for the critical weights.",
        },
        {
          title: "Static, with no scroll animation",
          context:
            "An animation that hides content until it appears competes with reading and with performance.",
          tradeoff:
            "A static site feels less spectacular, but the design leans on typography and rhythm.",
          decision:
            "No scroll reveal and no animation library. A native accordion with state in text and only short transitions, all disabled with prefers-reduced-motion.",
        },
        {
          title: "Dark by default, by class",
          context:
            "Following the system preference leaves the design to the device, and switching theme after first paint causes a flicker.",
          tradeoff:
            "Fixing dark as the start ignores the system preference, and an inline script forces the CSP to stay hash-based.",
          decision:
            "A synchronous script at the top of the head applies the dark class before styles load, unless the user saved the light theme. The CSP includes that script's hash.",
        },
        {
          title: "Spanish at the root, English under /en",
          context:
            "The site serves clients in Spanish and English, and each page needs its equivalent.",
          tradeoff:
            "Translated slugs improve local SEO but require maintaining the mapping between languages.",
          decision:
            "Spanish slugs at the root and English slugs under /en, with a single map feeding the language toggle, the sitemap, and hreflang.",
        },
      ],
      results: [
        "Bilingual site in production at www.wavival.dev, with 34 static pages across Spanish and English.",
        "Design implemented with parity to the Claude Design prototype.",
        "Quality gates on every change: Playwright E2E tests, Lighthouse CI (accessibility and SEO with a 0.9 minimum), and checks for broken links, CSP hashes, and CSS classes.",
      ],
      learnings: [
        "A design system is only worth something if it becomes tokens: every color and size lives as a CSS variable and components carry no loose values.",
        "Contrast is decided in the token: the previous accent (3.24:1) forced separating one blue per role.",
        "Tailwind purges classes built from fragments (btn-${variant}). Components must use complete class names.",
        "A backdrop-filter makes the element the container of its fixed children: the mobile menu had to be a sibling of the header and not a child.",
        "A component named like a Tailwind utility inherits its styles wherever the utility is used: .text-link became .action-link.",
      ],
    },
  },
  {
    title: "Forgotten Portal",
    slug: "forgotten-portal",
    quoteType: "security",
    datePublished: "2026-06-16",
    dateModified: "2026-06-16",
    tag: "Laboratorio",
    tagColor: "gray",
    image: "images/forgotten-portal.webp",
    imageAlt: "Forgotten Portal: laboratorio de pentesting (DockerLabs)",
    imageWidth: 1280,
    imageHeight: 853,
    stack: ["Nmap", "Gobuster", "Netcat", "Python", "MITRE ATT&CK", "PTES", "Linux", "DockerLabs"],
    filters: ["security"],
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
