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

const DESIGN_PLACEHOLDER_URL = "https://www.figma.com/";

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
      href: "https://terracore-prototype.netlify.app/",
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
        href: "https://terracore-prototype.netlify.app/",
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
      href: DESIGN_PLACEHOLDER_URL,
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
        href: DESIGN_PLACEHOLDER_URL,
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
    dateModified: "2026-09-26",
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
    filters: ["full-stack", "ai", "pwa", "design"],
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
    designLink: {
      href: DESIGN_PLACEHOLDER_URL,
      text: "Ver diseño",
      ariaLabel: "Ver diseño de OKroot",
    },
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
      designLink: {
        href: DESIGN_PLACEHOLDER_URL,
        text: "View design",
        ariaLabel: "View OKroot design",
      },
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
    slug: "okroot-landing",
    quoteType: "landing",
    datePublished: "2026-06-18",
    dateModified: "2026-09-26",
    tag: "Live",
    tagColor: "green",
    image: "images/og-okroot.webp",
    imageAlt: "Landing de OKroot: scanner de etiquetas por IA para restricciones alimentarias",
    imageWidth: 1200,
    imageHeight: 630,
    stack: ["Astro", "Tailwind CSS", "Supabase", "SEO", "A11y", "GA4", "Performance"],
    filters: ["landing", "design"],
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
    designLink: {
      href: DESIGN_PLACEHOLDER_URL,
      text: "Ver diseño",
      ariaLabel: "Ver diseño de OKroot Landing",
    },
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
      designLink: {
        href: DESIGN_PLACEHOLDER_URL,
        text: "View design",
        ariaLabel: "View OKroot Landing design",
      },
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
      href: DESIGN_PLACEHOLDER_URL,
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
        href: DESIGN_PLACEHOLDER_URL,
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
      href: DESIGN_PLACEHOLDER_URL,
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
        href: DESIGN_PLACEHOLDER_URL,
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
