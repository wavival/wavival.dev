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
    dateModified: "2026-10-02",
    tag: "Live",
    tagColor: "green",
    image: "images/og-terracore.webp",
    imageAlt:
      "Landing de TerraCore: propuesta de valor y planes para productores agropecuarios colombianos",
    imageWidth: 1200,
    imageHeight: 630,
    stack: [
      "Astro",
      "TypeScript",
      "Tailwind CSS",
      "Vercel Functions",
      "Supabase",
      "Brevo",
      "Playwright",
      "GA4",
      "SEO",
      "A11y",
    ],
    filters: ["landing", "design"],
    summary:
      "Landing estática de conversión para TerraCore, la PWA de gestión agropecuaria. Lleva al productor del dolor a la demo, muestra el producto, los planes con sus límites y la privacidad, y captura solicitudes de diagnóstico en una función serverless. Astro, Tailwind CSS y Supabase.",
    problem:
      "Una plataforma SaaS sin una landing de conversión pierde el tráfico antes de que el productor llegue a la app. Hay que explicarle qué cambia frente a Excel, cuadernos y WhatsApp, enseñarle el producto, decirle qué incluye cada plan y darle una forma simple de pedir una demo.",
    solution:
      "Landing en Astro que parte del dolor del productor, explica los módulos y cómo se conectan entre sí, enseña capturas reales del producto, responde la objeción de privacidad antes de hablar de planes y publica tres planes con sus límites. Todos los botones llevan a un solo formulario de diagnóstico, con WhatsApp como alternativa directa.",
    architecture: [
      "Astro 7 con salida estática, sin adaptador ni framework de interfaz: el JavaScript es vanilla, en un script por componente. Se despliega en Vercel y la rama de staging usa el preview.",
      "Atomic design con alias de importación por capa (átomos, moléculas, organismos y plantilla). Los tokens de color, tipografía y espacio viven en un solo archivo CSS y Tailwind los extiende. Inter, Poppins y JetBrains Mono van autoalojadas, sin pedir fuentes a terceros.",
      "Embudo de conversión en 13 secciones: Hero, Impacto, franja de confianza, Módulos, Producto, Beneficios, Seguridad, Planes, Preguntas y cierre. Métricas, casos de éxito y testimonios están construidos pero ocultos hasta tener datos reales.",
      "Los datos de cada sección son TypeScript tipado en un solo archivo (planes, impacto, beneficios y preguntas). Las preguntas alimentan el acordeón visible y el JSON-LD FAQPage desde la misma fuente.",
      "Tres planes: Semilla (1 sede, 5 usuarios), Profesional (hasta 5 sedes, 10 usuarios) y Enterprise (sedes y usuarios ilimitados). Cada botón de plan abre el formulario con el tamaño de operación ya elegido. Lo que se vende coincide con lo que el backend hace cumplir: topes de sedes y usuarios, rol Colaborador, Herramientas y exportación CSV desde Profesional, y pérdidas en Finanzas solo en Enterprise.",
      "Formulario de diagnóstico que envía JSON a una función de Vercel (api/lead.ts, sin dependencias de npm). Valida y normaliza los datos, guarda el lead en Supabase y avisa por correo con Brevo. Un correo repetido no crea otra fila y la notificación nunca bloquea el guardado.",
      "Antispam sin captcha: campo trampa y tiempo mínimo de llenado en el cliente, y la misma comprobación en el servidor. Solo guarda en producción; en staging valida y responde que el almacenamiento está desactivado.",
      "Analítica: GA4 opcional por variable de entorno, con eventos en cada CTA (Hero, planes, WhatsApp y formulario), más Vercel Web Analytics y Speed Insights. Botón flotante de WhatsApp en todas las páginas.",
      "SEO técnico: title, description, canonical, Open Graph y Twitter, sitemap, robots.txt y llms.txt. JSON-LD con Organization, WebSite, SoftwareApplication con sus ofertas y FAQPage.",
      "Seguridad en cabeceras desde vercel.json: CSP restrictiva, HSTS, X-Frame-Options DENY y Permissions-Policy.",
      "Calidad: Vitest para la lógica, Playwright para el flujo (landing, formulario, planes, FAQ y menú móvil) y Lighthouse en cada PR con accesibilidad como umbral que bloquea. Una prueba ata los límites de la landing a lo que el producto hace de verdad.",
    ],
    painPoints: [
      {
        title: "Planes poco claros",
        text: "Si no se ve qué incluye cada plan, el productor duda antes de empezar. Los límites y el alcance tienen que estar a la vista.",
      },
      {
        title: "El valor diferencial es invisible",
        text: "Que los módulos se hablan entre sí no es obvio. Sin demostrarlo antes de los planes, la landing pierde la conversión.",
      },
      {
        title: "Desconfianza en los datos",
        text: "El productor no quiere que sus costos y su producción salgan de la finca. Sin una sección de privacidad explícita, la confianza no se gana.",
      },
      {
        title: "Poca señal en el campo",
        text: "Si el producto funciona sin internet, la landing tiene que decirlo desde el primer pantallazo y sin letra pequeña.",
      },
    ],
    modules: [
      {
        name: "Hero con promesa y demo",
        text: "Titular 'Reemplaza Excel y WhatsApp', chip de que funciona sin internet, botón al diagnóstico y demo en video en un lightbox.",
      },
      {
        name: "Módulos contados desde el dolor",
        text: "Animales, insumos, herramientas (desde el plan Profesional), producción y salud animal, cada uno en un bento que empieza por el problema que resuelve y no por la función.",
      },
      {
        name: "Integración en cascada",
        text: "Flujo visual: vacuna aplicada, insumo descontado y fecha de vencimiento con alerta. Y stock mínimo, alerta al administrador. Es lo que el producto hace y demuestra el valor diferencial antes de los planes.",
      },
      {
        name: "Capturas reales del producto",
        text: "Pestañas de Dashboard, Animales, Insumos, Producción y Salud Animal con capturas de la app, rotación automática y botón de pausa.",
      },
      {
        name: "Privacidad y seguridad",
        text: "Cinco compromisos: cifrado en tránsito, roles y permisos, exportación CSV con aprobación de un administrador, sin minería de datos y respaldo nocturno.",
      },
      {
        name: "Planes y formulario",
        text: "Tres planes en un carrusel con límites y alcance, preguntas frecuentes y un formulario de diagnóstico gratuito con WhatsApp como alternativa.",
      },
    ],
    decisions: [
      {
        title: "Copy al dolor, no al producto",
        context:
          "El productor agropecuario no busca 'SaaS agroindustrial'. Busca dejar de usar Excel, cuadernos y grupos de WhatsApp.",
        tradeoff:
          "Un copy técnico no conecta con el campo. Un copy de dolor sí, pero exige conocer la operación real.",
        decision:
          "Hero sin una sola mención al stack: 'Reemplaza Excel y WhatsApp en tu operación agrícola' y 'No se trata de ganar más, sino de dejar de perder'. Una tabla de antes y después refuerza el contraste.",
      },
      {
        title: "Integración antes de los planes",
        context:
          "La diferencia de TerraCore frente a Excel es que los módulos se hablan entre sí. Eso no es obvio para el productor.",
        tradeoff:
          "Ir directo a los planes antes de demostrar el valor diferencial baja la conversión.",
        decision:
          "El bloque de integración ('Una acción. Todo el sistema al día.') va dentro de Módulos, antes de la sección de planes. El usuario entiende el valor antes de ver los planes.",
      },
      {
        title: "Confianza antes de los planes",
        context:
          "Los datos de producción y costos son sensibles para el productor, y la desconfianza bloquea la compra.",
        tradeoff:
          "Omitir la privacidad asume una confianza que en el agro hay que ganar de forma explícita. Ponerla antes de los planes alarga la página.",
        decision:
          "La sección de seguridad va justo antes de Planes, con compromisos concretos: sin minería de datos ni entrenamiento de IA y exportación CSV con aprobación de un administrador.",
      },
      {
        title: "Un solo embudo hacia el formulario",
        context:
          "Tres planes con tres destinos dispersan los leads y dificultan saber qué pidió cada visitante.",
        tradeoff:
          "Un destino único pierde la compra directa del plan. A cambio, cada solicitud llega completa y con contexto.",
        decision:
          "Los tres botones de plan llevan al mismo formulario y preseleccionan el tamaño de operación del plan. Primero un diagnóstico de 30 minutos y, si encaja, 14 días de prueba sin tarjeta.",
      },
      {
        title: "GA4 para iterar con datos reales",
        context:
          "Sin métricas de comportamiento, el diseño de la landing es intuición: no se sabe qué secciones se leen ni qué botón convierte.",
        tradeoff:
          "GA4 añade un script de terceros con implicaciones de privacidad, y hay que declararlo y poder apagarlo.",
        decision:
          "GA4 se activa solo si existe su variable de entorno y registra eventos en cada CTA (Hero, planes, WhatsApp y formulario). La política de privacidad lo declara junto con Vercel Web Analytics.",
      },
      {
        title: "Estática, con una sola función de servidor",
        context:
          "Una landing no necesita un backend propio, pero el formulario tiene que guardar leads sin exponer llaves.",
        tradeoff:
          "Una función serverless no corre bajo el servidor de desarrollo de Astro, y staging no tiene base de datos.",
        decision:
          "El sitio es estático y el formulario habla con una función de Vercel que usa la llave de servicio de Supabase solo en el servidor. Fuera de producción valida y no guarda.",
      },
      {
        title: "Sin prueba social inventada",
        context:
          "Una landing de un producto en validación está tentada a llenar métricas, casos y testimonios de relleno.",
        tradeoff:
          "Esas secciones aportan confianza, pero con datos falsos la restan. Dejarlas fuera hoy cuesta conversión.",
        decision:
          "Las tres secciones están construidas y ocultas hasta tener datos reales. Además, una prueba automática compara los límites de la landing con lo que hace el producto.",
      },
    ],
    design: [
      "El diseño parte de un prototipo navegable, accesible desde el botón Ver diseño.",
      "Verde profundo como color primario y ámbar como acento sobre neutros cálidos, en la misma familia visual que la PWA.",
      "Poppins para titulares, Inter para texto y JetBrains Mono para cifras y detalles. Las tres van autoalojadas.",
      "Secciones numeradas con un eyebrow editorial y un ritmo que alterna fondos claros y oscuros para separar cada paso del embudo.",
      "Módulos en bento con minivistas del producto (tablas y tarjetas de métricas) en vez de ilustraciones genéricas.",
      "Capturas reales en pestañas con rotación automática y pausa, y planes en un carrusel con flechas y pausa.",
      "Menú de hamburguesa bajo 1000 px, botón flotante de WhatsApp y skip link en todas las páginas.",
    ],
    results: [
      "Landing en producción, con el formulario de diagnóstico guardando solicitudes y avisando por correo.",
      "Tres planes publicados con límites claros por plan y condiciones de cancelación visibles.",
    ],
    learnings: [
      "Aprendí a diseñar, construir y desplegar una landing de conversión completa, desde la propuesta hasta el formulario que guarda leads, y a depurarla, probarla y medirla.",
      "Una landing para un nicho no tecnológico tiene que hablar el idioma del cliente: cada sección se redactó con vocabulario de la finca, no del software.",
      "Separar la demostración del valor de la sección de planes baja la barrera: el productor llega a los planes habiendo entendido ya qué diferencia a TerraCore de Excel.",
      "Un límite copiado a mano en varios sitios se desalinea. Los datos viven en un solo archivo y una prueba los compara con el producto.",
      "Es más barato dejar una sección de prueba social oculta hasta tener datos reales que retirar cifras inventadas.",
      "Un sitio estático puede tener formulario sin servidor propio, pero hay que decidir qué pasa en staging: validar sin guardar evita mezclar datos de prueba con leads reales.",
    ],
    roadmap: {
      now: ["Landing en producción captando solicitudes de diagnóstico."],
      next: ["Activar métricas, casos de éxito y testimonios cuando existan datos reales."],
      later: [],
    },
    caseStudy: true,
    schemaType: "WebSite",
    metaDescription:
      "Caso de estudio de TerraCore Landing: landing estática en Astro y Tailwind CSS con formulario en Supabase, SEO técnico y planes por tamaño de operación para el agro.",
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
      summary:
        "Static conversion landing for TerraCore, the farm-management PWA. It takes the producer from pain to demo, shows the product, the plans with their limits, and privacy, and captures diagnostic requests in a serverless function. Astro, Tailwind CSS, and Supabase.",
      imageAlt:
        "TerraCore landing: value proposition and plans for Colombian agricultural producers",
      problem:
        "A SaaS platform without a conversion landing loses traffic before the producer reaches the app. It has to explain what changes compared to Excel, notebooks, and WhatsApp, show the product, say what each plan includes, and offer a simple way to ask for a demo.",
      solution:
        "Astro landing that starts from the producer's pain, explains the modules and how they connect, shows real product screenshots, answers the privacy objection before talking about plans, and publishes three plans with their limits. Every button leads to a single diagnostic form, with WhatsApp as a direct alternative.",
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
        "TerraCore Landing case study: static Astro and Tailwind CSS landing with a Supabase-backed form, technical SEO, and plans by operation size for Colombian agriculture.",
      architecture: [
        "Astro 7 with static output, no adapter and no UI framework: JavaScript is vanilla, in one script per component. Deployed on Vercel, and the staging branch uses the preview.",
        "Atomic design with an import alias per layer (atoms, molecules, organisms, and template). Color, type, and spacing tokens live in a single CSS file and Tailwind extends them. Inter, Poppins, and JetBrains Mono are self-hosted, with no third-party font requests.",
        "Conversion funnel in 13 sections: Hero, Impact, trust strip, Modules, Product, Benefits, Security, Plans, FAQ, and closing. Metrics, case studies, and testimonials are built but hidden until real data exists.",
        "Each section's data is typed TypeScript in a single file (plans, impact, benefits, and FAQ). The FAQ feeds both the visible accordion and the FAQPage JSON-LD from the same source.",
        "Three plans: Seed (1 facility, 5 users), Professional (up to 5 facilities, 10 users), and Enterprise (unlimited facilities and users). Each plan button opens the form with the operation size already selected. What is sold matches what the backend enforces: facility and user caps, the Collaborator role, Tools and CSV export from Professional, and losses in Finance only on Enterprise.",
        "Diagnostic form that posts JSON to a Vercel function (api/lead.ts, no npm dependencies). It validates and normalizes the data, stores the lead in Supabase, and notifies by email through Brevo. A repeated email does not create another row and the notification never blocks the save.",
        "Anti-spam without a captcha: a honeypot field and a minimum fill time on the client, and the same check on the server. It only stores in production; on staging it validates and answers that storage is disabled.",
        "Analytics: GA4 optional through an environment variable, with events on every CTA (Hero, plans, WhatsApp, and form), plus Vercel Web Analytics and Speed Insights. Floating WhatsApp button on every page.",
        "Technical SEO: title, description, canonical, Open Graph and Twitter, sitemap, robots.txt, and llms.txt. JSON-LD with Organization, WebSite, SoftwareApplication with its offers, and FAQPage.",
        "Security through headers from vercel.json: a restrictive CSP, HSTS, X-Frame-Options DENY, and Permissions-Policy.",
        "Quality: Vitest for logic, Playwright for the flow (landing, form, plans, FAQ, and mobile menu), and Lighthouse on every PR with accessibility as a blocking threshold. A test ties the landing's limits to what the product actually does.",
      ],
      painPoints: [
        {
          title: "Unclear plans",
          text: "If what each plan includes is not visible, the producer hesitates before starting. Limits and scope have to be in plain sight.",
        },
        {
          title: "Differential value is invisible",
          text: "That the modules talk to each other is not obvious. Without demonstrating it before the plans, the landing loses the conversion.",
        },
        {
          title: "Distrust around data",
          text: "The producer does not want their costs and production data leaving the farm. Without an explicit privacy section, trust is never earned.",
        },
        {
          title: "Little signal in the field",
          text: "If the product works without internet, the landing has to say so from the first screen and without fine print.",
        },
      ],
      modules: [
        {
          name: "Hero with promise and demo",
          text: "'Replace Excel and WhatsApp' headline, a works-without-internet chip, a button to the diagnostic, and a demo video in a lightbox.",
        },
        {
          name: "Modules told from the pain",
          text: "Livestock, supplies, tools (from the Professional plan), production, and animal health, each in a bento that starts from the problem it solves and not from the feature.",
        },
        {
          name: "Cascade integration",
          text: "Visual flow: vaccine applied, supply deducted, and an expiry date with an alert. And minimum stock, alert to the administrator. It is what the product does and it demonstrates differential value before the plans.",
        },
        {
          name: "Real product screenshots",
          text: "Tabs for Dashboard, Livestock, Supplies, Production, and Animal Health with app screenshots, automatic rotation, and a pause button.",
        },
        {
          name: "Privacy and security",
          text: "Five commitments: encryption in transit, roles and permissions, CSV export with administrator approval, no data mining, and nightly backup.",
        },
        {
          name: "Plans and form",
          text: "Three plans in a carousel with limits and scope, frequently asked questions, and a free diagnostic form with WhatsApp as an alternative.",
        },
      ],
      decisions: [
        {
          title: "Copy focused on the pain, not the product",
          context:
            "The agricultural producer does not search for 'agro-industrial SaaS'. They search to stop using Excel, notebooks, and WhatsApp groups.",
          tradeoff:
            "Technical copy does not connect with the field. Pain-focused copy does, but requires knowing the real operation.",
          decision:
            "Hero with no mention of the stack: 'Replace Excel and WhatsApp in your farm operation' and 'It is not about earning more, it is about losing less'. A before and after table reinforces the contrast.",
        },
        {
          title: "Integration before the plans",
          context:
            "TerraCore's difference from Excel is that the modules talk to each other. That is not obvious to the producer.",
          tradeoff:
            "Going straight to the plans before demonstrating differential value lowers conversion.",
          decision:
            "The integration block ('One action. The whole system up to date.') sits inside Modules, before the plans section. The user understands the value before seeing the plans.",
        },
        {
          title: "Trust before the plans",
          context:
            "Production and cost data are sensitive to the producer, and distrust blocks the purchase.",
          tradeoff:
            "Omitting privacy assumes a trust that in agriculture must be earned explicitly. Placing it before the plans makes the page longer.",
          decision:
            "The security section sits right before Plans, with concrete commitments: no data mining or AI training and CSV export with administrator approval.",
        },
        {
          title: "A single funnel to the form",
          context:
            "Three plans with three destinations scatter the leads and make it hard to know what each visitor asked for.",
          tradeoff:
            "A single destination loses direct plan purchase. In return, every request arrives complete and with context.",
          decision:
            "The three plan buttons lead to the same form and preselect the plan's operation size. First a 30-minute diagnostic and, if it fits, a 14-day trial with no card.",
        },
        {
          title: "GA4 to iterate with real data",
          context:
            "Without behavioral metrics, landing design is intuition: you do not know which sections are read or which button converts.",
          tradeoff:
            "GA4 adds a third-party script with privacy implications, and it has to be declared and switchable off.",
          decision:
            "GA4 turns on only when its environment variable exists and records events on every CTA (Hero, plans, WhatsApp, and form). The privacy policy declares it alongside Vercel Web Analytics.",
        },
        {
          title: "Static, with a single server function",
          context:
            "A landing does not need its own backend, but the form has to store leads without exposing keys.",
          tradeoff:
            "A serverless function does not run under Astro's dev server, and staging has no database.",
          decision:
            "The site is static and the form talks to a Vercel function that uses Supabase's service key only on the server. Outside production it validates and does not store.",
        },
        {
          title: "No invented social proof",
          context:
            "A landing for a product under validation is tempted to fill in placeholder metrics, cases, and testimonials.",
          tradeoff:
            "Those sections add trust, but with fake data they take it away. Leaving them out today costs conversion.",
          decision:
            "The three sections are built and hidden until real data exists. In addition, an automated test compares the landing's limits with what the product does.",
        },
      ],
      design: [
        "The design starts from a clickable prototype, reachable from the View design button.",
        "Deep green as the primary color and amber as the accent over warm neutrals, in the same visual family as the PWA.",
        "Poppins for headlines, Inter for text, and JetBrains Mono for figures and details. All three are self-hosted.",
        "Numbered sections with an editorial eyebrow and a rhythm that alternates light and dark backgrounds to separate each funnel step.",
        "Modules in a bento with product mini-views (tables and metric cards) instead of generic illustrations.",
        "Real screenshots in tabs with automatic rotation and pause, and plans in a carousel with arrows and pause.",
        "Hamburger menu below 1000 px, a floating WhatsApp button, and a skip link on every page.",
      ],
      results: [
        "Landing in production, with the diagnostic form storing requests and notifying by email.",
        "Three plans published with clear limits per plan, and visible cancellation terms.",
      ],
      learnings: [
        "I learned to design, build, and deploy a complete conversion landing, from the proposal to the form that stores leads, and to debug it, test it, and measure it.",
        "A landing for a non-technical niche must speak the client's language: every section was written in farm vocabulary, not software vocabulary.",
        "Separating the value demonstration from the plans section lowers the barrier: the producer arrives at the plans having already understood what differentiates TerraCore from Excel.",
        "A limit copied by hand in several places drifts apart. The data lives in one file and a test compares it with the product.",
        "It is cheaper to keep a social proof section hidden until real data exists than to pull invented figures.",
        "A static site can have a form without its own server, but you have to decide what happens on staging: validating without storing avoids mixing test data with real leads.",
      ],
      roadmap: {
        now: ["Landing in production capturing diagnostic requests."],
        next: ["Activate metrics, case studies, and testimonials once real data exists."],
        later: [],
      },
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
    dateModified: "2026-10-02",
    tag: "Live",
    tagColor: "green",
    image: "images/og-nullbreach.webp",
    imageAlt: "NullBreach: análisis de código con IA basado en OWASP y chat de seguridad",
    imageWidth: 1200,
    imageHeight: 630,
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "NextAuth",
      "Prisma",
      "PostgreSQL",
      "OpenAI API",
      "Vercel",
    ],
    appCategory: "SecurityApplication",
    programmingLanguage: ["TypeScript", "SQL"],
    summary:
      "Asistente de seguridad de aplicaciones de código abierto. Una persona con cuenta pega un fragmento de código y recibe un análisis orientado a OWASP con severidad, impacto y remediación, o hace una pregunta de desarrollo seguro en un chat. Todo queda guardado por usuario. Una sola aplicación Next.js con Prisma Postgres, montada bajo wavival.dev/nullbreach.",
    filters: ["full-stack", "ai"],
    problem:
      "Un hallazgo de seguridad sirve poco si no dice qué tan grave es, qué impacto tiene y cómo se corrige. Y una duda puntual sobre un fragmento de código rara vez justifica montar y afinar un escáner de reglas.",
    solution:
      "Una aplicación con cuenta donde el usuario pega código (hasta 20.000 caracteres) y recibe un análisis orientado a OWASP con severidad, impacto y remediación, o pregunta en un chat de seguridad (hasta 4.000 caracteres). Las consultas y los análisis se guardan por usuario, y el código es abierto con licencia MIT.",
    architecture: [
      "Una sola aplicación Next.js (App Router, React y TypeScript) con tres áreas internas que son carpetas y no paquetes: la landing pública (features/landing), el frontend autenticado (app y components) y el backend (app/api, lib y prisma). El repositorio tiene un único despliegue.",
      "Montada bajo wavival.dev/nullbreach con Vercel Microfrontends: el portafolio es la aplicación por defecto y NullBreach es un proyecto hijo independiente. Next.js reescribe el prefijo público y toda navegación y llamada a la API pasa por una función única de rutas (appPath).",
      "Análisis y chat en el servidor: el cliente envía el texto a una ruta que exige sesión, valida que no esté vacío ni supere el límite (4.000 caracteres la pregunta, 20.000 el código, con 413 si lo supera) y solo entonces llama a la OpenAI Responses API. La clave de OpenAI y el modelo (variable de entorno) viven solo en el servidor y en un único módulo.",
      "La instrucción del modelo pide consejo práctico basado en OWASP; la de análisis pide explicar severidad, impacto y remediación. La respuesta es texto libre, se muestra como texto plano y no como HTML, y se guarda junto con la pregunta o el código enviado.",
      "Autenticación con NextAuth: credenciales (correo y clave con bcrypt, costo 12, de 8 a 128 caracteres) y Google OAuth opcional, con sesiones JWT en cookies HTTP-only. Una cuenta de Google se enlaza por correo normalizado.",
      "Recuperación de clave: se genera un token aleatorio, se guarda solo su hash SHA-256 con una hora de vigencia y un solo uso, y el enlace sale por Brevo. La respuesta no revela si el correo existe.",
      "Prisma ORM sobre Prisma Postgres con cuatro modelos: usuarios, historial de chat (pregunta, respuesta y modelo), análisis de código y tokens de recuperación. Borrar un usuario borra en cascada sus registros, y hay índices por usuario y fecha. El historial en pantalla muestra las diez últimas preguntas.",
      "Autorización en dos capas: un proxy rechaza con 401 las rutas privadas de chat, análisis e historial antes de ejecutarlas, y cada ruta vuelve a comprobar la sesión. Cabeceras contra framing, sniffing de tipo, fuga de referrer y permisos del navegador innecesarios.",
      "Documentación de la API en docs/api.md, con Swagger UI y un documento OpenAPI servidos por la propia aplicación, y un endpoint de salud que comprueba la base de datos sin llamar a OpenAI.",
      "Entrega con compuertas: ramas de trabajo hacia dev, stg y main, un solo camino y siempre por PR. GitHub Actions construye, aplica migraciones, despliega, comprueba la salud y corre Playwright contra el despliegue. Staging y producción usan bases Prisma Postgres y secretos separados, y los despliegues automáticos de Git están desactivados.",
      "CI en cada PR: lint, formato, tipos, validación de Prisma, pruebas con cobertura y build, además de commitlint, auditoría de dependencias de severidad alta y escaneo de secretos con gitleaks.",
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
      "Caso de estudio de NullBreach: app Next.js de código abierto con chat y análisis de código orientado a OWASP, NextAuth y Prisma Postgres.",
    painPoints: [
      {
        title: "Hallazgos sin remediación",
        text: "Una lista de patrones no basta si no explica la severidad, el impacto y cómo corregir el riesgo.",
      },
      {
        title: "Dudas que se pierden",
        text: "Una consulta de seguridad resuelta hoy se vuelve a necesitar mañana, y sin historial hay que repetirla.",
      },
      {
        title: "Una IA que se toma con criterio",
        text: "La respuesta de un modelo puede equivocarse. Hay que presentarla como asistencia de análisis, no como el resultado de un escáner determinista.",
      },
    ],
    modules: [
      {
        name: "Análisis de código",
        text: "Pega un fragmento y recibe hallazgos orientados a OWASP con severidad, impacto y remediación.",
      },
      {
        name: "Chat de seguridad",
        text: "Pregunta sobre vulnerabilidades, controles y desarrollo seguro, y recibe una respuesta práctica.",
      },
      {
        name: "Historial",
        text: "Las diez últimas preguntas del chat quedan a la vista, guardadas en tu cuenta.",
      },
      {
        name: "Cuenta",
        text: "Registro con correo y clave, ingreso con Google y recuperación de clave por correo.",
      },
      {
        name: "Landing bilingüe",
        text: "Página pública en español e inglés, indexable, con las rutas privadas fuera del índice.",
      },
      {
        name: "API documentada",
        text: "Referencia en docs/api.md, Swagger UI, documento OpenAPI y endpoint de salud.",
      },
    ],
    roadmap: {
      now: [
        "Aplicación en producción con chat de seguridad, análisis de código, cuentas y recuperación de clave.",
      ],
      next: [
        "Mostrar los análisis guardados y permitir borrar el historial y la cuenta.",
        "Límite de frecuencia en el chat y en el análisis, que llaman a un proveedor de pago.",
        "Verificar el correo de las cuentas con clave antes de que Google pueda enlazarse a ellas.",
      ],
      later: ["Mover la landing pública a Astro, pendiente de decisión."],
    },
    chainStepsTitle: "Del fragmento al hallazgo",
    chainSteps: [
      "El usuario pega un fragmento de código en el analizador.",
      "El proxy y la ruta comprueban la sesión, que el texto no esté vacío y que no supere 20.000 caracteres.",
      "El servidor llama a la OpenAI Responses API con instrucciones para analizar el código según OWASP y explicar severidad, impacto y remediación.",
      "La respuesta se guarda como análisis del usuario y se devuelve para mostrarla como texto.",
    ],
    decisions: [
      {
        title: "Una sola aplicación con tres áreas internas",
        context:
          "El producto necesita una landing pública, un frontend autenticado y un backend con base de datos y proveedor de IA.",
        tradeoff:
          "Separarlos en tres despliegues añade contratos y operación que un proyecto de una persona no necesita todavía. Con carpetas, los límites dependen de la disciplina y no del compilador.",
        decision:
          "Un solo despliegue Next.js con landing, frontend y backend en carpetas distintas, listo para extraerse a paquetes sin cambiar la ruta pública.",
      },
      {
        title: "Montada bajo wavival.dev con Microfrontends",
        context:
          "La app debe vivir en el mismo dominio del portafolio sin atar su ciclo de despliegue al de él.",
        tradeoff:
          "El prefijo /nullbreach obliga a mantener sincronizados microfrontends.json, los rewrites, el basePath de NextAuth y cada enlace y llamada a la API.",
        decision:
          "Vercel Microfrontends enruta /nullbreach al proyecto independiente, y una función única de rutas (appPath) construye todas las URLs del navegador.",
      },
      {
        title: "Un modelo de lenguaje como asistencia, en un solo módulo",
        context:
          "Revisar código a mano exige conocimiento de seguridad y tiempo para explicar impacto y corrección.",
        tradeoff:
          "La respuesta es texto libre y puede equivocarse: no es la salida de un escáner y no reemplaza una revisión experta.",
        decision:
          "Un único módulo de servidor llama a la OpenAI Responses API con instrucciones basadas en OWASP. La clave nunca llega al navegador y los límites de tamaño se aplican antes de la llamada y de guardar.",
      },
      {
        title: "NextAuth con credenciales y Google",
        context: "Cada persona debe ver solo su propio historial y sus propios análisis.",
        tradeoff:
          "Las sesiones JWT no guardan estado en el servidor, y enlazar Google por correo supone confiar en el correo verificado por Google.",
        decision:
          "Credenciales con bcrypt y Google OAuth opcional, con sesión JWT en cookie HTTP-only. Los datos se consultan siempre por el identificador del usuario de la sesión.",
      },
      {
        title: "Recuperación de clave con token de un solo uso",
        context:
          "Quien olvida la clave necesita recuperarla sin que la respuesta revele qué correos tienen cuenta.",
        tradeoff:
          "Depende de un proveedor de correo externo, y sin él configurado el enlace solo se imprime en desarrollo.",
        decision:
          "Token aleatorio de 32 bytes, solo su hash SHA-256 guardado, una hora de vigencia, un solo uso y la misma respuesta exista o no la cuenta.",
      },
      {
        title: "Autorización en dos capas",
        context:
          "Las rutas de chat y análisis llaman a un proveedor de pago y escriben en la base de datos.",
        tradeoff:
          "Comprobar la sesión dos veces duplica una línea en cada ruta, pero un cambio en el proxy no deja una ruta abierta.",
        decision:
          "Un proxy responde 401 a las rutas privadas antes de ejecutarlas y cada ruta repite la comprobación.",
      },
      {
        title: "Un solo camino de entrega, con compuertas",
        context:
          "Una aplicación con claves de IA y base de datos no debe llegar a producción sin pasar por staging.",
        tradeoff:
          "Los PR de promoción y las comprobaciones desplegadas agregan pasos, y las bases de staging y producción se mantienen por separado.",
        decision:
          "Ramas de trabajo hacia dev, stg y main siempre por PR. GitHub Actions construye, migra, despliega, comprueba la salud y corre Playwright. Los despliegues automáticos de Git están desactivados.",
      },
    ],
    design: [
      "Interfaz de terminal: paneles con comandos de prompt como $ nullbreach scan ./src y tipografía monoespaciada.",
      "Landing con un solo h1, encabezados ordenados, referencias de navegación, enlace para saltar al contenido y foco visible por teclado, con animaciones que respetan prefers-reduced-motion.",
      "Rutas en español e inglés con canónica y alternates por idioma. El sitemap lista solo las dos landings, y el robots y los metadatos dejan fuera la API, el ingreso y el área privada.",
      "Las respuestas del modelo se muestran como texto con saltos de línea y no como HTML, y los errores usan role alert con mensajes que no revelan detalles internos.",
    ],
    results: [
      "Chat y análisis de código con la OpenAI Responses API, con límites de 4.000 y 20.000 caracteres aplicados antes de llamar al modelo.",
      "Preguntas, respuestas y análisis guardados por usuario en Prisma Postgres, con el historial del chat visible en pantalla.",
      "Código abierto con licencia MIT, referencia de API con Swagger UI y OpenAPI, y un endpoint de salud.",
      "Entrega con staging y producción separados, migraciones aplicadas en el despliegue y pruebas E2E contra lo desplegado.",
    ],
    learnings: [
      "Un modelo de lenguaje que revisa código debe presentarse como asistencia de análisis y no como una verificación determinista.",
      "Autenticar y limitar el tamaño antes de llamar a un proveedor de pago protege el costo y la base de datos al mismo tiempo.",
      "Montar una app bajo el prefijo de otro dominio exige una sola función de rutas y varios archivos de configuración sincronizados.",
      "Con carpetas bien separadas, una sola aplicación puede tener landing, frontend y backend sin pagar el costo de tres despliegues.",
    ],
    en: {
      summary:
        "Open-source application security assistant. A signed-in user pastes a code snippet and gets an OWASP-oriented analysis with severity, impact and remediation, or asks a secure-development question in a chat. Everything is stored per user. A single Next.js application with Prisma Postgres, mounted under wavival.dev/nullbreach.",
      imageAlt: "NullBreach: OWASP-aligned AI code analysis and security chat",
      problem:
        "A security finding is of little use if it does not say how serious it is, what its impact is and how to fix it. And a quick question about a code snippet rarely justifies setting up and tuning a rule-based scanner.",
      solution:
        "An application with accounts where the user pastes code (up to 20,000 characters) and gets an OWASP-oriented analysis with severity, impact and remediation, or asks a security chat (up to 4,000 characters). Questions and analyses are stored per user, and the code is open source under the MIT license.",
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
        "NullBreach case study: open-source Next.js app with an OWASP-oriented code analyzer and security chat, NextAuth and Prisma Postgres.",
      architecture: [
        "A single Next.js application (App Router, React and TypeScript) with three internal areas that are folders, not packages: the public landing (features/landing), the authenticated frontend (app and components) and the backend (app/api, lib and prisma). The repository has one deployment.",
        "Mounted under wavival.dev/nullbreach with Vercel Microfrontends: the portfolio is the default application and NullBreach is an independent child project. Next.js rewrites the public prefix and every navigation and API call goes through a single route helper (appPath).",
        "Analysis and chat run on the server: the client sends the text to a route that requires a session, checks that it is not empty or over the limit (4,000 characters for a question, 20,000 for code, with a 413 above that) and only then calls the OpenAI Responses API. The OpenAI key and the model (an environment variable) live only on the server, in a single module.",
        "The model instruction asks for practical advice grounded in OWASP; the analysis one asks to explain severity, impact and remediation. The answer is free text, rendered as plain text and not as HTML, and stored with the question or code that was sent.",
        "Authentication with NextAuth: credentials (email and password with bcrypt, cost 12, 8 to 128 characters) and optional Google OAuth, with JWT sessions in HTTP-only cookies. A Google account is linked by normalized email.",
        "Password recovery: a random token is generated, only its SHA-256 hash is stored with a one-hour lifetime and a single use, and the link is sent through Brevo. The response does not reveal whether the email exists.",
        "Prisma ORM on Prisma Postgres with four models: users, chat history (question, answer and model), code analyses and recovery tokens. Deleting a user cascades to their records, and there are indexes by user and date. The on-screen history shows the last ten questions.",
        "Authorization in two layers: a proxy rejects the private chat, analysis and history routes with a 401 before they run, and each route checks the session again. Response headers restrict framing, type sniffing, referrer leakage and unneeded browser permissions.",
        "API documentation in docs/api.md, with a Swagger UI and an OpenAPI document served by the application itself, and a health endpoint that checks the database without calling OpenAI.",
        "Gated delivery: work branches to dev, stg and main, a single path and always through a PR. GitHub Actions builds, applies migrations, deploys, checks health and runs Playwright against the deployment. Staging and production use separate Prisma Postgres databases and secrets, and automatic Git deployments are turned off.",
        "CI on every PR: lint, formatting, types, Prisma validation, tests with coverage and build, plus commitlint, a high-severity dependency audit and a gitleaks secret scan.",
      ],
      painPoints: [
        {
          title: "Findings without remediation",
          text: "A list of patterns is not enough if it does not explain severity, impact and how to fix the risk.",
        },
        {
          title: "Questions that get lost",
          text: "A security question answered today is needed again tomorrow, and without history it has to be asked again.",
        },
        {
          title: "AI that needs judgment",
          text: "A model's answer can be wrong. It has to be presented as analysis assistance, not as the output of a deterministic scanner.",
        },
      ],
      modules: [
        {
          name: "Code analysis",
          text: "Paste a snippet and get OWASP-oriented findings with severity, impact and remediation.",
        },
        {
          name: "Security chat",
          text: "Ask about vulnerabilities, controls and secure development and get a practical answer.",
        },
        {
          name: "History",
          text: "The last ten chat questions stay in view, saved to your account.",
        },
        {
          name: "Account",
          text: "Sign-up with email and password, Google sign-in and password recovery by email.",
        },
        {
          name: "Bilingual landing",
          text: "Public page in Spanish and English, indexable, with the private routes kept out of the index.",
        },
        {
          name: "Documented API",
          text: "Reference in docs/api.md, Swagger UI, an OpenAPI document and a health endpoint.",
        },
      ],
      roadmap: {
        now: [
          "Application in production with a security chat, code analysis, accounts and password recovery.",
        ],
        next: [
          "Show stored analyses and let users delete their history and account.",
          "Rate limits on chat and analysis, which call a paid provider.",
          "Verify the email of password accounts before Google can link to them.",
        ],
        later: ["Move the public landing to Astro, pending a decision."],
      },
      chainStepsTitle: "From snippet to finding",
      chainSteps: [
        "The user pastes a code snippet into the analyzer.",
        "The proxy and the route check the session, that the text is not empty and that it is under 20,000 characters.",
        "The server calls the OpenAI Responses API with instructions to analyze the code against OWASP and explain severity, impact and remediation.",
        "The answer is stored as the user's analysis and returned to be shown as text.",
      ],
      decisions: [
        {
          title: "One application with three internal areas",
          context:
            "The product needs a public landing, an authenticated frontend and a backend with a database and an AI provider.",
          tradeoff:
            "Splitting them into three deployments adds contracts and operations a one-person project does not need yet. With folders, the boundaries depend on discipline and not on the compiler.",
          decision:
            "A single Next.js deployment with the landing, frontend and backend in separate folders, ready to be extracted into packages without changing the public path.",
        },
        {
          title: "Mounted under wavival.dev with Microfrontends",
          context:
            "The app has to live on the portfolio's domain without tying its deployment cycle to it.",
          tradeoff:
            "The /nullbreach prefix forces microfrontends.json, the rewrites, the NextAuth basePath and every link and API call to stay in sync.",
          decision:
            "Vercel Microfrontends routes /nullbreach to the independent project, and a single route helper (appPath) builds every browser URL.",
        },
        {
          title: "A language model as assistance, in one module",
          context:
            "Reviewing code by hand takes security knowledge and time to explain impact and fixes.",
          tradeoff:
            "The answer is free text and can be wrong: it is not scanner output and does not replace an expert review.",
          decision:
            "A single server module calls the OpenAI Responses API with OWASP-based instructions. The key never reaches the browser and size limits apply before the call and before storing.",
        },
        {
          title: "NextAuth with credentials and Google",
          context: "Each person should see only their own history and analyses.",
          tradeoff:
            "JWT sessions hold no state on the server, and linking Google by email means trusting the email Google verified.",
          decision:
            "Credentials with bcrypt and optional Google OAuth, with a JWT session in an HTTP-only cookie. Data is always queried by the session user's id.",
        },
        {
          title: "Password recovery with a single-use token",
          context:
            "Someone who forgets their password needs to recover it without the response revealing which emails have an account.",
          tradeoff:
            "It depends on an external email provider, and without it configured the link is only printed in development.",
          decision:
            "A random 32-byte token, only its SHA-256 hash stored, one hour of validity, a single use and the same response whether or not the account exists.",
        },
        {
          title: "Authorization in two layers",
          context: "The chat and analysis routes call a paid provider and write to the database.",
          tradeoff:
            "Checking the session twice repeats a line in every route, but a change in the proxy does not leave a route open.",
          decision:
            "A proxy answers 401 to the private routes before they run and each route repeats the check.",
        },
        {
          title: "A single gated delivery path",
          context:
            "An application with AI keys and a database should not reach production without passing through staging.",
          tradeoff:
            "Promotion PRs and deployed checks add steps, and the staging and production databases are kept apart.",
          decision:
            "Work branches to dev, stg and main, always through a PR. GitHub Actions builds, migrates, deploys, checks health and runs Playwright. Automatic Git deployments are off.",
        },
      ],
      design: [
        "Terminal interface: panels with prompt commands like $ nullbreach scan ./src and monospaced type.",
        "Landing with a single h1, ordered headings, navigation landmarks, a skip link and visible keyboard focus, with animations that respect prefers-reduced-motion.",
        "Spanish and English routes with a canonical URL and language alternates. The sitemap lists only the two landings, and robots and metadata keep the API, sign-in and private area out.",
        "Model answers are shown as text with line breaks, not as HTML, and errors use role alert with messages that do not reveal internal details.",
      ],
      results: [
        "Chat and code analysis through the OpenAI Responses API, with limits of 4,000 and 20,000 characters applied before the model is called.",
        "Questions, answers and analyses stored per user in Prisma Postgres, with the chat history visible on screen.",
        "Open source under the MIT license, an API reference with Swagger UI and OpenAPI, and a health endpoint.",
        "Delivery with separate staging and production, migrations applied at deploy time and E2E tests against what was deployed.",
      ],
      learnings: [
        "A language model that reviews code should be presented as analysis assistance, not as deterministic verification.",
        "Authenticating and limiting size before calling a paid provider protects cost and the database at the same time.",
        "Mounting an app under another domain's prefix takes a single route helper and several configuration files kept in sync.",
        "With well-separated folders, a single application can hold a landing, a frontend and a backend without paying for three deployments.",
      ],
    },
  },
  {
    title: "Lúmina W",
    slug: "lumina-w",
    quoteType: "landing",
    datePublished: "2026-06-16",
    dateModified: "2026-10-02",
    tag: "Live",
    tagColor: "green",
    image: "images/og-lumina-w.webp",
    imageAlt: "Landing de Lúmina W: hero con tagline de marca y llamado a la acción",
    imageWidth: 1200,
    imageHeight: 630,
    stack: [
      "Astro",
      "TypeScript",
      "Tailwind CSS",
      "Vercel Functions",
      "Supabase",
      "Brevo",
      "GA4",
      "SEO",
      "A11y",
    ],
    summary:
      "Sitio de Lúmina W, empresa de software de Medellín. Bilingüe (español e inglés), estático, con una landing de doce bloques que separa dos caminos (desarrollo a medida y producto propio en SaaS), una página de productos con TerraCore y OKroot, y un formulario de contacto que guarda cada solicitud en Supabase y avisa por correo. Astro, Tailwind CSS y una Función de Vercel.",
    filters: ["landing", "design"],
    problem:
      "Una empresa de software que vende dos cosas distintas, proyectos a medida y producto propio por suscripción, necesita explicarlas sin mezclarlas. Y necesita recibir solicitudes de contacto con datos suficientes para responder, sin montar un backend completo para una página de presentación.",
    solution:
      "Un sitio estático con dos caminos explícitos desde la primera pantalla, un proceso de cuatro fases para cada uno, una página de productos y un formulario que recoge lo necesario (necesidad, etapa y consentimiento) y lo guarda de forma segura. Está en español y en inglés, con SEO técnico y analítica solo con consentimiento.",
    architecture: [
      "Astro 6 con salida estática y Tailwind CSS 4. Doce componentes montan la landing en un orden fijo: portada, bifurcación entre los dos caminos, problema, agitación, cinta de frases, solución, proceso, manifiesto, por qué nosotros, producto, preguntas frecuentes y contacto. Cada sección tiene un ancla que coincide con la barra de navegación y el pie.",
      "Español por defecto en la raíz e inglés bajo /en, con las dos copias en diccionarios tipados: el diccionario en inglés exige las mismas claves que el español, así que una clave que falte rompe el build. Las páginas de productos y contacto tienen ruta traducida, y las legales conservan el mismo nombre.",
      "Formulario de contacto: el navegador manda un JSON a una Función de Vercel que valida los campos (nombre, empresa, correo, teléfono, necesidad, etapa y mensaje), exige el consentimiento y descarta en silencio lo que llegue por un campo trampa oculto. Los valores de necesidad y etapa son códigos fijos en inglés, así que una opción se guarda igual en los dos idiomas.",
      "La Función guarda cada solicitud en Supabase con la llave de servicio, que vive solo en el servidor, y completa la fecha de consentimiento, el origen y el agente de usuario por su cuenta. No guarda la IP. Si el correo ya existe, responde que todo salió bien sin crear otra fila, y avisa igual al buzón interno.",
      "El aviso interno sale por Brevo y es de mejor esfuerzo: si el correo falla, la solicitud ya quedó guardada. El almacenamiento solo corre en producción de Vercel, así que en las previsualizaciones el formulario responde 503 por diseño.",
      "La tabla de solicitudes es una sola, compartida con las landings de TerraCore y OKroot, con una columna de producto y una restricción de unicidad por producto y correo. Tiene seguridad por filas activada y sin permisos para los roles públicos: solo la Función puede escribir.",
      "SEO técnico: un grafo JSON-LD con ProfessionalService, WebSite y WebPage, más FAQPage en las preguntas frecuentes, canónica propia, hreflang entre es, en y x-default, sitemap con alternates y un robots.txt que permite de forma explícita a 21 rastreadores de IA, junto con un llms.txt.",
      "Analítica con consentimiento: Google Analytics 4 se carga solo si la persona acepta el aviso de cookies, y la decisión se guarda en el almacenamiento local, sin cookies propias. El aviso no bloquea la página y aparece tras desplazarse un poco.",
      "Rendimiento y entrega: imágenes en WebP con dimensiones explícitas, fuentes con swap, caché inmutable de un año para los recursos con hash y las imágenes, y cabeceras de seguridad (HSTS, anti-framing, anti-sniffing, referrer y permisos). El despliegue en Vercel es continuo desde main.",
      "Accesibilidad trabajada en el código: enlace para saltar al contenido, foco visible, etiquetas por campo con errores anunciados y mensaje de éxito con rol de estado, y respeto de prefers-reduced-motion. Un respaldo sin JavaScript deja visible el contenido que aparece al desplazarse.",
      "Calidad: formato y build en cada PR, con escaneo de secretos con gitleaks y el flujo dev, stg y main. No hay pruebas automáticas ni medición de Lighthouse guardada en el repositorio.",
    ],
    links: [{ href: "https://luminaw.co", text: "Ver sitio", ariaLabel: "Ver sitio de Lúmina W" }],
    designLink: {
      href: "https://luminaw-landing-prototype.netlify.app/",
      text: "Ver diseño",
      ariaLabel: "Ver diseño de Lúmina W",
    },
    caseStudy: true,
    schemaType: "WebSite",
    metaDescription:
      "Caso de estudio de Lúmina W: sitio bilingüe en Astro y Tailwind CSS con dos caminos de servicio, formulario sobre Supabase y SEO técnico.",
    painPoints: [
      {
        title: "Dos ofertas con compradores distintos",
        text: "El desarrollo a medida y un producto por suscripción tienen tiempos, presupuestos y preguntas diferentes. Mezclados sin estructura, confunden.",
      },
      {
        title: "Un contacto que cuesta",
        text: "Un formulario con un solo campo de mensaje obliga a responder con preguntas antes de poder cotizar. Uno demasiado largo espanta.",
      },
      {
        title: "Dos idiomas sin duplicar el trabajo",
        text: "Mantener una copia en inglés a mano deja cadenas viejas y claves olvidadas.",
      },
      {
        title: "Datos de contacto sin un backend propio",
        text: "Guardar solicitudes exige una base de datos y un punto de escritura seguro, y montar un servidor para una página de presentación es desproporcionado.",
      },
    ],
    modules: [
      {
        name: "Dos caminos",
        text: "Una bifurcación en la primera pantalla separa el producto propio en SaaS del desarrollo a medida, y cada uno tiene su propio proceso.",
      },
      {
        name: "Proceso por camino",
        text: "Cuatro fases para el desarrollo a medida y cuatro para el producto, con las reglas de trabajo de cada una.",
      },
      {
        name: "Productos",
        text: "TerraCore y OKroot en la landing y en una página propia, con su estado y su enlace.",
      },
      {
        name: "Preguntas frecuentes",
        text: "Diez preguntas con respuesta, también publicadas como datos estructurados.",
      },
      {
        name: "Formulario de contacto",
        text: "Recoge necesidad, etapa y consentimiento, guarda la solicitud y avisa por correo.",
      },
      {
        name: "Español e inglés",
        text: "Dos copias completas, con rutas traducidas, hreflang y un selector de idioma.",
      },
    ],
    decisions: [
      {
        title: "Dos caminos explícitos en vez de un solo servicio",
        context:
          "Lúmina W ofrece desarrollo a medida y un producto propio en SaaS, y quien compra cada uno llega con preguntas distintas.",
        tradeoff:
          "Una frase general de desarrollo de software convence menos, pero separar los caminos añade una decisión en la primera pantalla.",
        decision:
          "Una sección de bifurcación, una solución en dos servicios y un proceso con cuatro fases para cada camino, cada uno con su propio llamado a la acción.",
      },
      {
        title: "Productos propios como evidencia",
        context:
          "Quien evalúa a una empresa de software quiere ver producto funcionando, no solo promesas de desarrollo a medida.",
        tradeoff:
          "Dedicar espacio a los productos puede restar protagonismo al servicio, y su estado cambia con el tiempo.",
        decision:
          "TerraCore y OKroot aparecen en la landing y en una página de productos, con el estado y el enlace de cada uno definidos en el diccionario de textos.",
      },
      {
        title: "Función de Vercel con Supabase, y no un servidor propio",
        context:
          "El sitio necesita guardar solicitudes de contacto desde el primer día, y montar un backend para una landing es desproporcionado.",
        tradeoff:
          "Hay una pieza de servidor, aunque pequeña, que mantener, y el formulario no funciona en las previsualizaciones, donde no hay base de datos.",
        decision:
          "Una Función de Vercel valida, aplica la honeypot y el consentimiento, y escribe en Supabase con la llave de servicio en el servidor. El navegador nunca habla con Supabase.",
      },
      {
        title: "Una tabla de solicitudes compartida entre las landings",
        context:
          "Lúmina W, TerraCore y OKroot reciben solicitudes con casi los mismos datos, y tres bases sueltas habrían multiplicado el trabajo.",
        tradeoff:
          "Si alguien escribe dos veces con el mismo correo, la segunda no se guarda: el aviso interno la menciona, pero la tabla conserva solo la primera.",
        decision:
          "Una sola tabla con una columna de producto y unicidad por producto y correo, con el mismo esquema copiado en los tres repositorios.",
      },
      {
        title: "Diccionarios tipados para dos idiomas",
        context:
          "Cada texto nuevo debe existir en español e inglés, y una cadena olvidada se nota solo cuando alguien cambia de idioma.",
        tradeoff: "Obliga a traducir todo cambio al mismo tiempo, incluso uno pequeño.",
        decision:
          "El diccionario en inglés está tipado con el del español, así que una clave que falte rompe el build.",
      },
      {
        title: "Analítica solo con consentimiento",
        context:
          "El sitio mide visitas con Google Analytics 4, y esa medición requiere el permiso de quien visita.",
        tradeoff:
          "Sin la aceptación no hay datos de ese visitante, y el aviso aparece tras desplazarse para no tapar la primera pantalla.",
        decision:
          "El script de Analytics se inyecta solo después de aceptar y la decisión queda en el almacenamiento local, sin cookies propias.",
      },
    ],
    design: [
      "Sistema editorial y sobrio: bordes rectos (radios de 0, 2 y 4 píxeles), líneas de un píxel en lugar de sombras y una sola hoja de estilos con los tokens.",
      "Azul como color principal para enlaces, etiquetas y foco, y ámbar como acento solo de relleno. Cuando el ámbar es texto sobre fondo claro se usa una versión más oscura para mantener el contraste.",
      "Cabinet Grotesk para los títulos y Switzer para el texto, cargadas desde Fontshare con swap.",
      "Página clara con superficies oscuras fijas (contacto, pie, productos y la barra de navegación). No hay selector de tema.",
      "Los llamados a la acción llevan solo texto, sin flechas ni iconos, y la regla del proyecto es no usar guiones como conector en los textos.",
    ],
    results: [
      "Sitio de Lúmina W en producción en luminaw.co, en español e inglés, con los dos caminos de servicio diferenciados.",
      "Formulario de contacto que guarda cada solicitud con su necesidad, su etapa y su consentimiento en una tabla compartida, y avisa por correo.",
      "TerraCore y OKroot presentados en la landing y en una página propia.",
      "SEO técnico con datos estructurados, hreflang, sitemap, robots para rastreadores de IA y llms.txt.",
    ],
    learnings: [
      "Para una página de presentación, una Función pequeña frente a Supabase resuelve el contacto sin un backend que mantener, pero obliga a decidir qué pasa en las previsualizaciones, donde no hay base de datos.",
      "Pedir necesidad y etapa en el formulario, con valores fijos, hace que la primera respuesta ya pueda ser una propuesta y que los datos se comparen entre idiomas.",
      "Las promesas del texto deben ser algo que el código haga: decir que se recibe una confirmación por correo exige que la Función envíe ese correo.",
      "Un diccionario tipado convierte una traducción olvidada en un error de build en lugar de en una página a medias.",
    ],
    en: {
      imageAlt: "Lumina W landing: brand tagline and call to action",
      summary:
        "Website of Lumina W, a software company in Medellín. Bilingual (Spanish and English), static, with a twelve-block landing page that separates two paths (custom development and its own SaaS product), a products page with TerraCore and OKroot, and a contact form that stores each request in Supabase and notifies by email. Astro, Tailwind CSS and a Vercel Function.",
      problem:
        "A software company that sells two different things, custom projects and its own product by subscription, needs to explain them without mixing them up. And it needs to receive contact requests with enough data to answer, without building a full backend for a presentation page.",
      solution:
        "A static site with two explicit paths from the first screen, a four-phase process for each, a products page, and a form that collects what is needed (need, stage and consent) and stores it safely. It is in Spanish and English, with technical SEO and analytics only with consent.",
      links: [{ href: "https://luminaw.co", text: "Visit site", ariaLabel: "Visit Lumina W" }],
      designLink: {
        href: "https://luminaw-landing-prototype.netlify.app/",
        text: "View design",
        ariaLabel: "View Lumina W design",
      },
      metaDescription:
        "Lumina W case study: a bilingual site with Astro and Tailwind CSS, two service paths, a form on Vercel and Supabase, technical SEO and cookie consent.",
      architecture: [
        "Astro 6 with static output and Tailwind CSS 4. Twelve components assemble the landing in a fixed order: hero, a fork between the two paths, problem, agitation, a phrase ribbon, solution, process, manifesto, why us, product, FAQ and contact. Each section has an anchor that matches the navigation bar and the footer.",
        "Spanish by default at the root and English under /en, with both copies in typed dictionaries: the English dictionary requires the same keys as the Spanish one, so a missing key breaks the build. The products and contact pages have a translated route, and the legal pages keep the same name.",
        "Contact form: the browser sends JSON to a Vercel Function that validates the fields (name, company, email, phone, need, stage and message), requires consent and silently drops whatever arrives through a hidden trap field. The need and stage values are fixed English codes, so an option is stored the same way in both languages.",
        "The Function stores each request in Supabase with the service key, which lives only on the server, and fills in the consent date, the source and the user agent itself. It does not store the IP. If the email already exists, it answers that everything went fine without creating another row, and still notifies the internal inbox.",
        "The internal notice goes out through Brevo and is best effort: if the email fails, the request is already stored. Storage only runs in Vercel production, so on previews the form answers 503 by design.",
        "The requests table is a single one, shared with the TerraCore and OKroot landings, with a product column and a uniqueness constraint per product and email. It has row-level security on and no permissions for the public roles: only the Function can write.",
        "Technical SEO: a JSON-LD graph with ProfessionalService, WebSite and WebPage, plus FAQPage on the FAQ, a self canonical, hreflang between es, en and x-default, a sitemap with alternates and a robots.txt that explicitly allows 21 AI crawlers, together with an llms.txt.",
        "Analytics with consent: Google Analytics 4 loads only if the person accepts the cookie notice, and the decision is stored in local storage, with no first-party cookies. The notice does not block the page and appears after a little scrolling.",
        "Performance and delivery: WebP images with explicit dimensions, fonts with swap, a one-year immutable cache for hashed assets and images, and security headers (HSTS, anti-framing, anti-sniffing, referrer and permissions). Deployment on Vercel is continuous from main.",
        "Accessibility worked into the code: a skip link, visible focus, a label per field with announced errors and a success message with a status role, and respect for prefers-reduced-motion. A no-JavaScript fallback keeps the content that appears on scroll visible.",
        "Quality: formatting and build on every PR, with secret scanning through gitleaks and the dev, stg and main flow. There are no automated tests and no Lighthouse measurement stored in the repository.",
      ],
      painPoints: [
        {
          title: "Two offers with different buyers",
          text: "Custom development and a subscription product have different timelines, budgets and questions. Mixed without structure, they confuse.",
        },
        {
          title: "A contact that costs",
          text: "A form with a single message field forces a reply with questions before you can quote. One that is too long scares people off.",
        },
        {
          title: "Two languages without duplicating the work",
          text: "Maintaining an English copy by hand leaves stale strings and forgotten keys.",
        },
        {
          title: "Contact data without a backend of your own",
          text: "Storing requests needs a database and a safe write point, and standing up a server for a presentation page is out of proportion.",
        },
      ],
      modules: [
        {
          name: "Two paths",
          text: "A fork on the first screen separates the own SaaS product from custom development, and each has its own process.",
        },
        {
          name: "Process per path",
          text: "Four phases for custom development and four for the product, with the working rules of each.",
        },
        {
          name: "Products",
          text: "TerraCore and OKroot on the landing and on a page of their own, with their status and link.",
        },
        {
          name: "FAQ",
          text: "Ten questions with answers, also published as structured data.",
        },
        {
          name: "Contact form",
          text: "It collects need, stage and consent, stores the request and notifies by email.",
        },
        {
          name: "Spanish and English",
          text: "Two complete copies, with translated routes, hreflang and a language switch.",
        },
      ],
      decisions: [
        {
          title: "Two explicit paths instead of a single service",
          context:
            "Lumina W offers custom development and its own SaaS product, and whoever buys each one arrives with different questions.",
          tradeoff:
            "A general software-development line persuades less, but separating the paths adds a decision on the first screen.",
          decision:
            "A fork section, a solution in two services and a process with four phases for each path, each with its own call to action.",
        },
        {
          title: "Own products as evidence",
          context:
            "Someone evaluating a software company wants to see a product working, not only custom development promises.",
          tradeoff:
            "Giving space to the products can take attention from the service, and their status changes over time.",
          decision:
            "TerraCore and OKroot appear on the landing and on a products page, with each one's status and link defined in the text dictionary.",
        },
        {
          title: "A Vercel Function with Supabase, not a server of its own",
          context:
            "The site needs to store contact requests from day one, and building a backend for a landing is out of proportion.",
          tradeoff:
            "There is a small server piece to maintain, and the form does not work on previews, where there is no database.",
          decision:
            "A Vercel Function validates, applies the honeypot and the consent, and writes to Supabase with the service key on the server. The browser never talks to Supabase.",
        },
        {
          title: "One requests table shared across the landings",
          context:
            "Lumina W, TerraCore and OKroot receive requests with almost the same data, and three separate databases would have tripled the work.",
          tradeoff:
            "If someone writes twice with the same email, the second is not stored: the internal notice mentions it, but the table keeps only the first.",
          decision:
            "A single table with a product column and uniqueness per product and email, with the same schema copied into the three repositories.",
        },
        {
          title: "Typed dictionaries for two languages",
          context:
            "Every new text must exist in Spanish and English, and a forgotten string shows only when someone switches language.",
          tradeoff: "It forces translating every change at the same time, even a small one.",
          decision:
            "The English dictionary is typed with the Spanish one, so a missing key breaks the build.",
        },
        {
          title: "Analytics only with consent",
          context:
            "The site measures visits with Google Analytics 4, and that measurement requires the visitor's permission.",
          tradeoff:
            "Without acceptance there is no data for that visitor, and the notice appears after scrolling so it does not cover the first screen.",
          decision:
            "The Analytics script is injected only after accepting and the decision is kept in local storage, with no first-party cookies.",
        },
      ],
      design: [
        "An editorial, sober system: straight edges (radii of 0, 2 and 4 pixels), one-pixel lines instead of shadows and a single stylesheet with the tokens.",
        "Blue as the main color for links, tags and focus, and amber as a fill-only accent. When amber is text on a light background, a darker version is used to keep the contrast.",
        "Cabinet Grotesk for headings and Switzer for body text, loaded from Fontshare with swap.",
        "A light page with fixed dark surfaces (contact, footer, products and the navigation bar). There is no theme switch.",
        "Calls to action carry text only, with no arrows or icons, and the project rule is not to use dashes as a connector in texts.",
      ],
      results: [
        "Lumina W site in production at luminaw.co, in Spanish and English, with the two service paths differentiated.",
        "A contact form that stores each request with its need, its stage and its consent in a shared table, and notifies by email.",
        "TerraCore and OKroot presented on the landing and on a page of their own.",
        "Technical SEO with structured data, hreflang, a sitemap, robots for AI crawlers and llms.txt.",
      ],
      learnings: [
        "For a presentation page, a small Function in front of Supabase solves contact without a backend to maintain, but it forces a decision about what happens on previews, where there is no database.",
        "Asking for need and stage in the form, with fixed values, means the first reply can already be a proposal and the data compares across languages.",
        "The promises in the copy must be something the code does: saying a confirmation email is received requires the Function to send that email.",
        "A typed dictionary turns a forgotten translation into a build error instead of a half-translated page.",
      ],
    },
  },
  {
    title: "Blog Lúmina W",
    slug: "blog-lumina-w",
    quoteType: "web-app",
    datePublished: "2026-06-18",
    dateModified: "2026-10-02",
    tag: "Live",
    tagColor: "green",
    image: "images/og-blogw.webp",
    imageAlt:
      "Blog de Lúmina W: contenido técnico sobre desarrollo web, ciberseguridad y productos digitales",
    imageWidth: 1200,
    imageHeight: 630,
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "NextAuth",
      "Brevo",
      "Claude API",
      "Vercel",
    ],
    summary:
      "Plataforma de blog bilingüe (español e inglés) con comunidad: cuentas, comentarios, likes, guardados, perfiles y newsletter. Cualquier cuenta escribe un artículo y la administradora lo aprueba antes de publicarlo. Los artículos publicados se traducen con la API de Claude. Next.js, Prisma y PostgreSQL, desplegada en Vercel.",
    filters: ["full-stack"],
    problem:
      "El conocimiento técnico que sale de proyectos reales necesita un canal propio, con control sobre el contenido, los comentarios y las suscripciones, sin depender de una plataforma externa. El sitio anterior era estático, con un CMS de archivos, y no tenía cuentas ni comunidad.",
    solution:
      "Una aplicación Next.js con base de datos que reemplazó al sitio anterior. Publica artículos en español e inglés, deja que cualquier cuenta proponga uno y lo pone en una cola de aprobación, y suma comentarios con moderación, guardados, perfiles, seguimiento entre cuentas y newsletter por idioma.",
    architecture: [
      "Aplicación Next.js (App Router, React y TypeScript) con Prisma sobre PostgreSQL en Supabase, y Tailwind CSS para los estilos. Reemplazó a un sitio anterior en Astro con Decap CMS. El layout es dinámico a propósito: el build en CI no necesita base de datos.",
      "Los artículos viven de dos formas: archivos Markdown en el repositorio (seis hoy, tres por idioma) que un importador sube a la base en cada build de producción, y artículos escritos por cuentas dentro de la aplicación. El importador crea o actualiza por idioma y slug, y nunca toca autoría, likes, guardados ni comentarios.",
      "Flujo de publicación: un artículo pasa por borrador, pendiente, publicado o rechazado. Cualquier cuenta puede escribir y enviar a revisión, solo la administradora publica directo, y editar un artículo publicado desde una cuenta que no es la de ella lo devuelve a pendiente. El slug queda fijo al publicar.",
      "Bilingüe: español sin prefijo e inglés bajo /en, con rutas traducidas (articulos, categoria, cuenta) y un middleware que las reescribe a las rutas internas. Cada idioma es una fila de Post enlazada con el original, y likes, guardados y comentarios se anclan siempre al original.",
      "Traducción automática: al publicar un original, y solo si hay clave configurada, una tarea en segundo plano manda título, descripción, cuerpo y etiquetas a la API de Claude como datos, valida la respuesta y guarda la versión en el otro idioma. La administradora puede reintentarla desde el panel. Los artículos de archivo traen sus propias traducciones.",
      "Comunidad: comentarios con hilos de hasta 2000 caracteres, likes, guardados, perfiles públicos y seguimiento. La moderación de comentarios es un filtro local por reglas (términos bloqueados y tope de enlaces), sin llamar a ningún modelo: lo que coincide queda pendiente y la administradora lo aprueba o rechaza.",
      "Newsletter con Brevo: una lista por idioma, suscripción desde el sitio y envío de prueba o campaña desde el panel de administración, con el enlace de baja de Brevo. Las notificaciones de respuesta, seguimiento y guardado también salen por correo, además de dentro del blog.",
      "Cuentas con correo y clave verificados por correo, más Google, GitHub y LinkedIn cuando están configurados, e invitaciones que llegan con el correo ya verificado. Un proveedor externo solo se acepta si confirma el correo. Cuenta bloqueada 15 minutos tras 5 intentos fallidos, y suspensión y cierre de sesiones desde el panel.",
      "Los permisos se leen de la base de datos en cada petición y no del token de sesión. El administrador no es un rol en la base: es el correo definido en una variable de entorno, que además está protegido de suspensión y borrado.",
      "Seguridad por capas: limitador de frecuencia guardado en Postgres con una sola sentencia atómica por llamada (falla cerrado en credenciales y tokens), verificación de origen en las rutas que escriben, CSP con nonce por petición, cabeceras HSTS, anti-framing y anti-sniffing, y Markdown pasado por un sanitizador antes de renderizarse.",
      "Imágenes: el tipo se detecta por los primeros bytes del archivo y no por la cabecera, se rechaza SVG, y sharp las convierte a WebP con límite de lado según el uso (portada, cuerpo o avatar) antes de guardarlas en un bucket de Supabase Storage. La llave de servicio solo existe en un módulo del servidor.",
      "SEO y descubrimiento: sitemap dinámico con alternates por idioma, robots con un grupo aparte para crawlers de IA, llms.txt, feed RSS por idioma y JSON-LD (Organization, WebSite, BlogPosting, Blog, CollectionPage, ProfilePage y BreadcrumbList). La búsqueda usa coincidencia insensible a mayúsculas sobre título, descripción, cuerpo, autor y etiquetas.",
      "Analítica con consentimiento: GA4 se carga solo si la persona acepta y si hay un identificador configurado, y el enlace entre dominios cubre luminaw.co, terracoreapp.co y okroot.co.",
      "Calidad y entrega: 28 archivos de pruebas unitarias con vitest sobre lógica pura, lint y build en cada PR, escaneo de secretos con gitleaks y flujo dev, stg y main. En producción, el build de Vercel aplica las migraciones y corre el importador de artículos.",
      "Un generador de portadas arma las imágenes de 1200 por 630 en WebP, una por idioma, con un tope de 150 KB, a partir de una especificación JSON y un arte SVG.",
    ],
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
    caseStudy: true,
    schemaType: "WebSite",
    metaDescription:
      "Caso de estudio del Blog de Lúmina W: plataforma Next.js bilingüe con cuentas, moderación, newsletter y traducción de artículos con la API de Claude.",
    painPoints: [
      {
        title: "Una plataforma ajena decide por ti",
        text: "Publicar en una plataforma de terceros deja la audiencia, los comentarios y la suscripción en manos de otra empresa.",
      },
      {
        title: "Un sitio estático no tiene comunidad",
        text: "El sitio anterior publicaba bien, pero no tenía cuentas, comentarios ni una forma de que alguien más propusiera un artículo.",
      },
      {
        title: "Dos idiomas son doble trabajo",
        text: "Mantener cada artículo en español e inglés a mano duplica el esfuerzo de publicar.",
      },
      {
        title: "Abrir comentarios abre el riesgo",
        text: "Cualquier cuenta que escribe o comenta es una entrada para spam, enlaces dudosos y abuso de las rutas que envían correo.",
      },
    ],
    modules: [
      {
        name: "Artículos y aprobación",
        text: "Escribe en Markdown, envía a revisión y publica cuando la administradora aprueba, con motivo de devolución.",
      },
      {
        name: "Comunidad",
        text: "Comentarios con hilos, likes, guardados, perfiles públicos y seguimiento entre cuentas.",
      },
      {
        name: "Español e inglés",
        text: "Rutas, textos, correos y notificaciones en los dos idiomas, con traducción automática de los artículos.",
      },
      {
        name: "Newsletter",
        text: "Suscripción por idioma y envío de prueba o campaña desde el panel de administración.",
      },
      {
        name: "Panel de administración",
        text: "Cola de artículos y comentarios, destacados, invitaciones y gestión de usuarios: buscar, suspender, reactivar y eliminar.",
      },
      {
        name: "Búsqueda y descubrimiento",
        text: "Búsqueda con atajo de teclado, categorías, orden por popularidad, feed RSS, sitemap y llms.txt.",
      },
    ],
    chainStepsTitle: "Del borrador al lector en dos idiomas",
    chainSteps: [
      "Una cuenta escribe un artículo en Markdown y lo envía a revisión.",
      "La administradora lo aprueba, o lo devuelve con una nota que recibe como notificación.",
      "Al publicarse, una tarea en segundo plano manda el contenido a la API de Claude como datos y valida la traducción.",
      "La versión en el otro idioma se guarda enlazada al original y entra al sitemap con su alternate.",
      "Los likes, guardados y comentarios de cualquiera de las dos versiones se acumulan en el original.",
    ],
    decisions: [
      {
        title: "Una aplicación con base de datos en lugar de un sitio estático",
        context:
          "El blog necesitaba cuentas, comentarios, aprobación de artículos, suscripciones y dos idiomas.",
        tradeoff:
          "Una aplicación dinámica depende de una base de datos y exige más cuidado de seguridad que un sitio de archivos.",
        decision:
          "Next.js con Prisma y PostgreSQL, y un layout dinámico para que el build no necesite la base. Los artículos de archivo se siguen versionando en el repositorio y se importan al desplegar.",
      },
      {
        title: "Una fila por idioma, enlazada con el original",
        context:
          "Un artículo existe en dos idiomas con slugs distintos, pero la conversación a su alrededor es una sola.",
        tradeoff: "Cada consulta de interacciones tiene que resolver primero cuál es el original.",
        decision:
          "Cada versión es una fila de Post con una referencia al original. Likes, guardados y comentarios se anclan siempre al original.",
      },
      {
        title: "Claude para traducir, solo contenido ya publicado",
        context: "Traducir a mano cada artículo duplica el trabajo de publicar.",
        tradeoff:
          "Una traducción de un modelo puede equivocarse y depende de una clave externa, así que se activa solo si hay clave.",
        decision:
          "Una tarea en segundo plano manda solo el artículo ya publicado, como datos y no como instrucciones, valida la respuesta antes de guardarla, y la administradora puede reintentarla. Ningún dato de cuentas ni comentarios sale hacia la API.",
      },
      {
        title: "Moderación por reglas locales",
        context:
          "Los comentarios abiertos reciben spam y enlaces dudosos, y mandarlos a un modelo añade costo y envía texto de usuarios a un tercero.",
        tradeoff:
          "Un filtro por términos y por cantidad de enlaces es tosco: deja pasar lo que no coincide y retiene lo que sí aunque sea legítimo.",
        decision:
          "Un filtro local pone en pendiente los comentarios que coinciden y la administradora decide. Sus propios comentarios quedan exentos.",
      },
      {
        title: "Limitador de frecuencia en la propia base",
        context:
          "Cada ruta que escribe, envía correo o recibe credenciales necesita un tope, y no se quería sumar infraestructura nueva.",
        tradeoff:
          "Usa la base de datos de la aplicación en cada llamada y es una ventana fija, menos precisa que una cola dedicada.",
        decision:
          "Una tabla en Postgres con una sola sentencia atómica por llamada, sin infraestructura nueva. Falla cerrado en credenciales y tokens, y abierto en el resto.",
      },
      {
        title: "Permisos desde la base, no desde el token",
        context:
          "Un token de sesión guarda lo que era cierto al emitirse, pero una cuenta puede suspenderse o cambiar de clave después.",
        tradeoff: "Cada petición autenticada hace una lectura a la base de datos.",
        decision:
          "Una función lee el usuario de la base y descarta la sesión si la cuenta está suspendida o su versión de sesión cambió. El token nunca decide un permiso.",
      },
      {
        title: "Una sola administradora, definida por entorno",
        context:
          "Hace falta alguien que apruebe contenido, sin montar un sistema de roles para una persona.",
        tradeoff:
          "No hay roles delegables ni más de una administradora sin cambiar la configuración.",
        decision:
          "La administradora es el correo de una variable de entorno. Cada acción del panel comprueba esa condición en el servidor, y esa cuenta no se puede suspender ni borrar.",
      },
    ],
    design: [
      "Los estilos del prototipo diseñado aparte se portaron tal cual, y el tema vive en una sola hoja de estilos con Tailwind CSS 4 sin el reset base.",
      "Artículo con barra de progreso de lectura, tabla de contenidos y tarjeta para compartir, con el menú nativo del dispositivo como camino para Instagram.",
      "Portadas de 1200 por 630 por idioma, generadas desde una especificación y un arte SVG, con un tope de peso por imagen.",
      "Accesibilidad trabajada en el código: enlace para saltar al contenido, menús con teclado y un diálogo de confirmación con el foco atrapado. Los cambios de contraste que alterarían el diseño están pendientes de decisión.",
      "Selector de idioma que recuerda la elección en una cookie, y detección del idioma del navegador en la primera visita.",
    ],
    results: [
      "Plataforma en producción en blog.luminaw.co, con cuentas, publicación con aprobación, comentarios con moderación y newsletter.",
      "Seis artículos de archivo importados, tres en español y tres en inglés, y un flujo para publicar más desde la propia aplicación.",
      "Traducción automática de artículos publicados al otro idioma, con reintento manual desde el panel.",
      "Suite de 28 archivos de pruebas unitarias sobre lógica pura, con lint, build y escaneo de secretos en cada PR.",
    ],
    learnings: [
      "Abrir cuentas y comentarios cambia el tipo de proyecto: casi cada ruta nueva necesita un límite de frecuencia, una verificación de origen y una decisión sobre qué pasa si falla.",
      "Leer los permisos de la base en cada petición cuesta una consulta, pero evita que una suspensión o un cambio de clave llegue tarde.",
      "Anclar las interacciones al artículo original en vez de a cada idioma evita partir una conversación en dos.",
      "Un filtro local de moderación es predecible y barato, pero solo ordena la cola: la decisión sigue siendo de una persona.",
      "Con dos idiomas, cada texto nuevo es trabajo por duplicado en los diccionarios, y conviene que el tipo de uno obligue a completar el otro.",
    ],
    roadmap: {
      now: [
        "Blog bilingüe en producción con comunidad, aprobación de artículos, newsletter y traducción automática.",
        "Auditorías de seguridad, SEO y accesibilidad aplicadas al código.",
      ],
      next: [
        "Artículos relacionados por etiquetas.",
        "Eliminar la propia cuenta y cambiar el correo desde el perfil.",
        "Reportar un comentario.",
        "Alojar las fuentes en el propio sitio, monitoreo de errores y pruebas de extremo a extremo en CI.",
      ],
      later: [
        "Generación de borradores con la API de Claude y n8n, y programación automática de publicaciones.",
        "Compartir en redes desde n8n y panel de analítica.",
      ],
    },
    en: {
      imageAlt:
        "Lumina W blog: technical content on web development, cybersecurity, and digital products",
      summary:
        "Bilingual blog platform (Spanish and English) with community features: accounts, comments, likes, saves, profiles and a newsletter. Any account can write an article and the administrator approves it before it goes live. Published articles are translated with the Claude API. Next.js, Prisma and PostgreSQL, deployed on Vercel.",
      problem:
        "Technical knowledge that comes out of real projects needs its own channel, with control over the content, the comments and the subscriptions, without depending on an outside platform. The previous site was static, with a file-based CMS, and had no accounts or community.",
      solution:
        "A Next.js application with a database that replaced the previous site. It publishes articles in Spanish and English, lets any account propose one and puts it in an approval queue, and adds moderated comments, saves, profiles, following between accounts and a newsletter per language.",
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
        "Lumina W Blog case study: a bilingual Next.js platform with accounts, moderation, a newsletter and article translation with the Claude API.",
      architecture: [
        "Next.js application (App Router, React and TypeScript) with Prisma on PostgreSQL in Supabase, and Tailwind CSS for styling. It replaced a previous Astro site with Decap CMS. The layout is dynamic on purpose: the CI build does not need a database.",
        "Articles live in two ways: Markdown files in the repository (six today, three per language) that an importer loads into the database on every production build, and articles written by accounts inside the application. The importer creates or updates by language and slug, and never touches authorship, likes, saves or comments.",
        "Publishing flow: an article goes through draft, pending, published or rejected. Any account can write and submit for review, only the administrator publishes directly, and editing a published article from an account other than hers sends it back to pending. The slug is frozen once published.",
        "Bilingual: Spanish without a prefix and English under /en, with translated routes (articulos, categoria, cuenta) and a middleware that rewrites them to the internal routes. Each language is a Post row linked to the original, and likes, saves and comments are always anchored to the original.",
        "Automatic translation: when an original is published, and only if a key is configured, a background task sends the title, description, body and tags to the Claude API as data, validates the response and stores the version in the other language. The administrator can retry it from the panel. File-based articles ship with their own translations.",
        "Community: threaded comments of up to 2,000 characters, likes, saves, public profiles and following. Comment moderation is a local rule filter (blocked terms and a link cap) that calls no model: anything that matches is held as pending and the administrator approves or rejects it.",
        "Newsletter with Brevo: one list per language, sign-up from the site and a test or campaign send from the admin panel, with Brevo's unsubscribe link. Reply, follow and save notifications also go out by email, in addition to inside the blog.",
        "Accounts with email and password verified by email, plus Google, GitHub and LinkedIn when configured, and invitations that arrive with the email already verified. An external provider is accepted only if it confirms the email. An account is locked for 15 minutes after 5 failed attempts, and suspension and session invalidation are available from the panel.",
        "Permissions are read from the database on every request and not from the session token. The administrator is not a role in the database: it is the email set in an environment variable, which is also protected from suspension and deletion.",
        "Layered security: a rate limiter stored in Postgres with a single atomic statement per call (it fails closed on credentials and tokens), an origin check on the routes that write, a per-request CSP with a nonce, HSTS, anti-framing and anti-sniffing headers, and Markdown passed through a sanitizer before it renders.",
        "Images: the type is detected from the first bytes of the file and not from the header, SVG is rejected, and sharp converts them to WebP with a side limit by use (cover, body or avatar) before storing them in a Supabase Storage bucket. The service key exists only in one server module.",
        "SEO and discovery: a dynamic sitemap with language alternates, robots with a separate group for AI crawlers, llms.txt, an RSS feed per language and JSON-LD (Organization, WebSite, BlogPosting, Blog, CollectionPage, ProfilePage and BreadcrumbList). Search uses case-insensitive matching over title, description, body, author and tags.",
        "Analytics with consent: GA4 loads only if the person accepts and an identifier is configured, and the cross-domain link covers luminaw.co, terracoreapp.co and okroot.co.",
        "Quality and delivery: 28 unit test files with vitest over pure logic, lint and build on every PR, secret scanning with gitleaks and a dev, stg and main flow. In production, the Vercel build applies migrations and runs the article importer.",
        "A cover generator builds the 1200 by 630 WebP images, one per language, with a 150 KB cap, from a JSON spec and an SVG artwork.",
      ],
      painPoints: [
        {
          title: "An outside platform decides for you",
          text: "Publishing on a third-party platform leaves the audience, the comments and the subscription in someone else's hands.",
        },
        {
          title: "A static site has no community",
          text: "The previous site published fine, but had no accounts, no comments and no way for someone else to propose an article.",
        },
        {
          title: "Two languages are double the work",
          text: "Keeping every article in Spanish and English by hand doubles the effort of publishing.",
        },
        {
          title: "Open comments open the risk",
          text: "Every account that writes or comments is an entry point for spam, dubious links and abuse of the routes that send email.",
        },
      ],
      modules: [
        {
          name: "Articles and approval",
          text: "Write in Markdown, submit for review and publish when the administrator approves, with a note when it is sent back.",
        },
        {
          name: "Community",
          text: "Threaded comments, likes, saves, public profiles and following between accounts.",
        },
        {
          name: "Spanish and English",
          text: "Routes, texts, emails and notifications in both languages, with automatic translation of articles.",
        },
        {
          name: "Newsletter",
          text: "Sign-up per language and a test or campaign send from the admin panel.",
        },
        {
          name: "Admin panel",
          text: "Queue of articles and comments, featured posts, invitations and user management: search, suspend, reactivate and delete.",
        },
        {
          name: "Search and discovery",
          text: "Search with a keyboard shortcut, categories, popularity ordering, an RSS feed, a sitemap and llms.txt.",
        },
      ],
      chainStepsTitle: "From draft to reader in two languages",
      chainSteps: [
        "An account writes an article in Markdown and submits it for review.",
        "The administrator approves it, or sends it back with a note the author receives as a notification.",
        "Once published, a background task sends the content to the Claude API as data and validates the translation.",
        "The version in the other language is stored linked to the original and enters the sitemap with its alternate.",
        "Likes, saves and comments on either version accumulate on the original.",
      ],
      decisions: [
        {
          title: "An application with a database instead of a static site",
          context:
            "The blog needed accounts, comments, article approval, subscriptions and two languages.",
          tradeoff:
            "A dynamic application depends on a database and needs more security care than a site of files.",
          decision:
            "Next.js with Prisma and PostgreSQL, and a dynamic layout so the build does not need the database. File-based articles stay versioned in the repository and are imported on deploy.",
        },
        {
          title: "One row per language, linked to the original",
          context:
            "An article exists in two languages with different slugs, but the conversation around it is one.",
          tradeoff: "Every interactions query has to resolve which one is the original first.",
          decision:
            "Each version is a Post row with a reference to the original. Likes, saves and comments are always anchored to the original.",
        },
        {
          title: "Claude for translation, published content only",
          context: "Translating every article by hand doubles the work of publishing.",
          tradeoff:
            "A model translation can be wrong and depends on an outside key, so it is only active when a key exists.",
          decision:
            "A background task sends only the already published article, as data and not as instructions, validates the response before storing it, and the administrator can retry it. No account or comment data goes to the API.",
        },
        {
          title: "Moderation by local rules",
          context:
            "Open comments receive spam and dubious links, and sending them to a model adds cost and ships users' text to a third party.",
          tradeoff:
            "A filter by terms and link count is crude: it lets through what does not match and holds what does even if it is legitimate.",
          decision:
            "A local filter puts matching comments in pending and the administrator decides. Her own comments are exempt.",
        },
        {
          title: "A rate limiter in the application's own database",
          context:
            "Every route that writes, sends email or takes credentials needs a cap, and the goal was to avoid adding new infrastructure.",
          tradeoff:
            "It uses the application's database on every call and is a fixed window, less precise than a dedicated queue.",
          decision:
            "A Postgres table with a single atomic statement per call, with no new infrastructure. It fails closed on credentials and tokens, and open on the rest.",
        },
        {
          title: "Permissions from the database, not from the token",
          context:
            "A session token holds what was true when it was issued, but an account can be suspended or change its password later.",
          tradeoff: "Every authenticated request makes a database read.",
          decision:
            "A function reads the user from the database and discards the session if the account is suspended or its session version changed. The token never decides a permission.",
        },
        {
          title: "A single administrator, defined by environment",
          context:
            "Someone has to approve content, without building a roles system for one person.",
          tradeoff:
            "There are no delegable roles and no second administrator without changing the configuration.",
          decision:
            "The administrator is the email in an environment variable. Every panel action checks that condition on the server, and that account cannot be suspended or deleted.",
        },
      ],
      design: [
        "The styles of the separately designed prototype were ported as they were, and the theme lives in a single stylesheet with Tailwind CSS 4 without the base reset.",
        "Article with a reading progress bar, a table of contents and a share card, with the device's native menu as the route for Instagram.",
        "1200 by 630 covers per language, generated from a spec and an SVG artwork, with a weight cap per image.",
        "Accessibility worked into the code: a skip link, keyboard menus and a confirmation dialog with trapped focus. The contrast changes that would alter the design are pending a decision.",
        "A language switch that remembers the choice in a cookie, and detection of the browser language on the first visit.",
      ],
      results: [
        "A platform in production at blog.luminaw.co, with accounts, publishing with approval, moderated comments and a newsletter.",
        "Six file-based articles imported, three in Spanish and three in English, and a flow to publish more from the application itself.",
        "Automatic translation of published articles into the other language, with a manual retry from the panel.",
        "A suite of 28 unit test files over pure logic, with lint, build and secret scanning on every PR.",
      ],
      learnings: [
        "Opening accounts and comments changes the kind of project: almost every new route needs a rate limit, an origin check and a decision about what happens when it fails.",
        "Reading permissions from the database on every request costs a query, but keeps a suspension or a password change from arriving late.",
        "Anchoring interactions to the original article instead of to each language avoids splitting a conversation in two.",
        "A local moderation filter is predictable and cheap, but it only orders the queue: the decision is still a person's.",
        "With two languages, every new text is double work in the dictionaries, and it helps that the type of one forces completing the other.",
      ],
      roadmap: {
        now: [
          "Bilingual blog in production with community, article approval, a newsletter and automatic translation.",
          "Security, SEO and accessibility audits applied to the code.",
        ],
        next: [
          "Related articles by tags.",
          "Delete your own account and change your email from the profile.",
          "Report a comment.",
          "Self-hosted fonts, error monitoring and end-to-end tests in CI.",
        ],
        later: [
          "Draft generation with the Claude API and n8n, and automatic scheduling of posts.",
          "Sharing to social networks from n8n and an analytics panel.",
        ],
      },
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
    dateModified: "2026-10-02",
    tag: "Laboratorio",
    tagColor: "gray",
    image: "images/forgotten-portal.webp",
    imageAlt: "Forgotten Portal: laboratorio de pentesting (DockerLabs)",
    imageWidth: 1280,
    imageHeight: 853,
    stack: ["Nmap", "Gobuster", "Netcat", "Python", "MITRE ATT&CK", "PTES", "Linux", "DockerLabs"],
    filters: ["security"],
    summary:
      "Ejercicio de pentesting sobre una máquina de laboratorio de DockerLabs, hecho en un entorno controlado durante el acelerador de ciberseguridad de Nodo EAFIT. Metodología PTES, siete hallazgos con CVSS y clasificación CWE, mapeo a MITRE ATT&CK, un informe técnico, un informe ejecutivo y 28 capturas de evidencia.",
    problem:
      "Qué tan lejos llega alguien sin credenciales contra un servidor mal configurado, y cómo se le explica ese riesgo tanto a un equipo técnico como a quien decide el presupuesto.",
    solution:
      "Un ejercicio completo sobre una máquina virtual de DockerLabs, sin salir del alcance del laboratorio, documentado con la metodología PTES. Cada hallazgo lleva severidad, puntaje CVSS, evidencia y remediación, y el resultado se entrega en dos informes para dos públicos.",
    architecture: [
      "Alcance: un único contenedor Docker de DockerLabs (Ubuntu con Apache en el puerto 80 y OpenSSH en el 22), ejecutado el 23 de marzo de 2026. Nada fuera del contenedor entra en el alcance.",
      "Metodología PTES en seis fases: preparación, exploración, análisis, ataque, acceso profundo y documentación. La documentación corre en paralelo con el resto, con una captura por paso.",
      "Reconocimiento y enumeración con Nmap, Gobuster y la inspección del código fuente de la página, sin credenciales.",
      "Siete hallazgos, ordenados por severidad: tres críticos, dos altos y dos medios, cada uno con vector y puntaje CVSS v3.1, componente afectado, probabilidad e impacto.",
      "Clasificación CWE en el writeup, mapeo de las acciones a técnicas de MITRE ATT&CK y matriz de riesgo con el esquema de probabilidad por impacto de ISO/IEC 27005.",
      "Dos entregables: un informe técnico de 18 páginas para el equipo de seguridad y un informe ejecutivo de 14 páginas con riesgo de negocio, exposición financiera y hoja de ruta de remediación priorizada.",
      "Evidencia reproducible: 28 capturas anotadas en el repositorio, ligadas a cada paso del writeup. El material está bajo licencia MIT.",
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
      "Caso de estudio de Forgotten Portal: pentesting en laboratorio DockerLabs con PTES, siete hallazgos con CVSS y CWE, MITRE ATT&CK e informes técnico y ejecutivo.",
    painPoints: [
      {
        title: "Información de más en el código público",
        text: "Un comentario olvidado en el HTML dejaba ver un usuario del sistema y una ruta no publicada. Todo lo que el servidor envía al navegador es superficie de ataque.",
      },
      {
        title: "Una carga de archivos sin control real",
        text: "El formulario aceptaba tipos ejecutables y los guardaba dentro de la raíz web. Validar solo la extensión no basta.",
      },
      {
        title: "Secretos donde no deben estar",
        text: "Credenciales codificadas en un registro, una clave SSH repetida en todas las cuentas y su contraseña escrita en un documento interno. Codificar no es proteger.",
      },
      {
        title: "Permisos de administración demasiado amplios",
        text: "Una cuenta podía ejecutar como administrador una utilidad común sin contraseña. Un permiso de sudo sobre un binario que ejecuta comandos equivale a un acceso total.",
      },
    ],
    modules: [
      {
        name: "Writeup paso a paso",
        text: "Recorrido técnico en español con una captura por paso, publicado en el blog y en el repositorio.",
      },
      {
        name: "Informe técnico",
        text: "Siete hallazgos con CVSS, componente afectado, evidencia, remediación, mapeo a MITRE ATT&CK y matriz de riesgo.",
      },
      {
        name: "Informe ejecutivo",
        text: "El mismo trabajo traducido a riesgo de negocio, costo estimado de remediar frente al de una brecha y orden de prioridades.",
      },
      {
        name: "Mapeo MITRE ATT&CK",
        text: "Tácticas y técnicas ligadas a cada acción del ejercicio, en un archivo aparte.",
      },
      {
        name: "Evidencia",
        text: "28 capturas anotadas que cubren el ejercicio de principio a fin.",
      },
    ],
    chainStepsTitle: "Cómo se encadenan los hallazgos",
    chainSteps: [
      "Información interna en el código fuente público (medio).",
      "Carga de archivos sin restricción real, con ejecución de código en el servidor (crítico).",
      "Directorio de cargas visible para cualquiera (medio).",
      "Credenciales en un registro legible por el servicio web (alto).",
      "Una misma clave SSH en todas las cuentas (crítico) y su contraseña en un documento interno (alto).",
      "Permiso de sudo sin contraseña sobre un binario que ejecuta comandos (crítico).",
    ],
    decisions: [
      {
        title: "PTES como estructura",
        context:
          "Un ejercicio sin método se vuelve una lista de trucos y no se puede repetir ni comparar.",
        tradeoff:
          "Seguir seis fases exige documentar aunque el ejercicio sea de laboratorio y de una sola máquina.",
        decision: "PTES en seis fases, con la documentación en paralelo y una captura por paso.",
      },
      {
        title: "Dos informes para dos públicos",
        context:
          "Un equipo técnico necesita el detalle de cada hallazgo y quien decide necesita saber qué hacer primero y cuánto cuesta.",
        tradeoff:
          "Mantener dos documentos duplica la revisión, y cualquier cambio en un hallazgo debe reflejarse en ambos.",
        decision:
          "Un informe técnico con CVSS, evidencia y remediación, y uno ejecutivo con riesgo de negocio, costos y prioridades.",
      },
      {
        title: "Cada hallazgo con severidad y remediación",
        context: "Una lista de debilidades sin prioridad ni solución no ayuda a corregir nada.",
        tradeoff:
          "Puntuar con CVSS y probabilidad por impacto añade criterio propio que otra persona podría ver distinto.",
        decision:
          "Cada hallazgo lleva CVSS v3.1, probabilidad e impacto, clasificación CWE y una remediación concreta.",
      },
      {
        title: "Un entorno controlado y sin datos reales",
        context: "Practicar técnicas ofensivas solo es válido dentro de un alcance autorizado.",
        tradeoff:
          "Una máquina de laboratorio no tiene usuarios ni tráfico reales, así que el impacto de negocio del informe ejecutivo es estimado.",
        decision:
          "Un único contenedor de DockerLabs como alcance, con las cifras de impacto tomadas de una fuente publicada (IBM Cost of a Data Breach 2024).",
      },
    ],
    results: [
      "Siete hallazgos documentados, con tres críticos, dos altos y dos medios, cada uno con CVSS, evidencia y remediación.",
      "Un informe técnico de 18 páginas y uno ejecutivo de 14, con matriz de riesgo, mapeo a MITRE ATT&CK y hoja de ruta de remediación.",
      "28 capturas de evidencia ligadas al writeup, publicadas con licencia MIT junto al repositorio.",
    ],
    learnings: [
      "Ningún hallazgo del ejercicio dependía de una vulnerabilidad desconocida: eran errores de configuración y hábitos de trabajo que se repiten en entornos reales.",
      "Un solo error rara vez basta; el daño sale de encadenar varios hallazgos pequeños, así que corregir el eslabón más barato ya corta la cadena.",
      "El mismo hallazgo se explica distinto según quién lo lee: el detalle técnico y el riesgo de negocio son dos documentos, no uno.",
      "Los documentos deben coincidir entre sí: el writeup, el informe técnico y el ejecutivo tenían que contar los mismos siete hallazgos.",
    ],
    en: {
      imageAlt: "Forgotten Portal: pentesting lab (DockerLabs)",
      tag: "Lab",
      summary:
        "Pentesting exercise on a DockerLabs lab machine, done in a controlled environment during the Nodo EAFIT cybersecurity accelerator. PTES methodology, seven findings with CVSS and CWE classification, MITRE ATT&CK mapping, a technical report, an executive report and 28 evidence screenshots.",
      problem:
        "How far someone without credentials can get against a misconfigured server, and how to explain that risk both to a technical team and to whoever decides the budget.",
      solution:
        "A complete exercise on a DockerLabs virtual machine, within the lab scope, documented with the PTES methodology. Each finding carries a severity, a CVSS score, evidence and remediation, and the result is delivered as two reports for two audiences.",
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
        "Forgotten Portal case study: DockerLabs pentesting lab with PTES, seven findings with CVSS and CWE, MITRE ATT&CK, and technical and executive reports.",
      architecture: [
        "Scope: a single DockerLabs Docker container (Ubuntu with Apache on port 80 and OpenSSH on 22), run on March 23, 2026. Nothing outside the container is in scope.",
        "PTES methodology in six phases: preparation, exploration, analysis, attack, deep access and documentation. Documentation runs in parallel with the rest, with one screenshot per step.",
        "Reconnaissance and enumeration with Nmap, Gobuster and an inspection of the page source, without credentials.",
        "Seven findings, ordered by severity: three critical, two high and two medium, each with a CVSS v3.1 vector and score, affected component, likelihood and impact.",
        "CWE classification in the writeup, a mapping of the actions to MITRE ATT&CK techniques and a risk matrix using the likelihood-by-impact scheme of ISO/IEC 27005.",
        "Two deliverables: an 18-page technical report for the security team and a 14-page executive report with business risk, financial exposure and a prioritized remediation roadmap.",
        "Reproducible evidence: 28 annotated screenshots in the repository, tied to each step of the writeup. The material is released under the MIT license.",
      ],
      painPoints: [
        {
          title: "Too much information in public code",
          text: "A forgotten comment in the HTML exposed a system user and an unpublished path. Everything the server sends to the browser is attack surface.",
        },
        {
          title: "A file upload with no real control",
          text: "The form accepted executable types and stored them inside the web root. Validating only the extension is not enough.",
        },
        {
          title: "Secrets where they should not be",
          text: "Credentials encoded in a log, an SSH key repeated across all accounts and its passphrase written in an internal document. Encoding is not protecting.",
        },
        {
          title: "Administration permissions that are too broad",
          text: "One account could run a common utility as administrator without a password. A sudo permission on a binary that runs commands is the same as full access.",
        },
      ],
      modules: [
        {
          name: "Step-by-step writeup",
          text: "A technical walkthrough in Spanish with one screenshot per step, published on the blog and in the repository.",
        },
        {
          name: "Technical report",
          text: "Seven findings with CVSS, affected component, evidence, remediation, MITRE ATT&CK mapping and a risk matrix.",
        },
        {
          name: "Executive report",
          text: "The same work translated into business risk, the estimated cost of fixing versus a breach, and an order of priorities.",
        },
        {
          name: "MITRE ATT&CK mapping",
          text: "Tactics and techniques tied to each action of the exercise, in a separate file.",
        },
        {
          name: "Evidence",
          text: "28 annotated screenshots covering the exercise from start to finish.",
        },
      ],
      chainStepsTitle: "How the findings chain together",
      chainSteps: [
        "Internal information in the public source code (medium).",
        "A file upload with no real restriction, allowing code execution on the server (critical).",
        "An upload directory visible to anyone (medium).",
        "Credentials in a log readable by the web service (high).",
        "The same SSH key on every account (critical) and its passphrase in an internal document (high).",
        "A passwordless sudo permission on a binary that runs commands (critical).",
      ],
      decisions: [
        {
          title: "PTES as the structure",
          context:
            "An exercise without a method becomes a list of tricks and cannot be repeated or compared.",
          tradeoff:
            "Following six phases means documenting even when the exercise is a single lab machine.",
          decision:
            "PTES in six phases, with documentation in parallel and one screenshot per step.",
        },
        {
          title: "Two reports for two audiences",
          context:
            "A technical team needs the detail of each finding, and a decision maker needs to know what to do first and what it costs.",
          tradeoff:
            "Keeping two documents doubles the review, and any change to a finding has to appear in both.",
          decision:
            "A technical report with CVSS, evidence and remediation, and an executive one with business risk, costs and priorities.",
        },
        {
          title: "Every finding with a severity and a remediation",
          context: "A list of weaknesses with no priority or fix does not help correct anything.",
          tradeoff:
            "Scoring with CVSS and likelihood by impact adds judgment that someone else could see differently.",
          decision:
            "Each finding carries CVSS v3.1, likelihood and impact, a CWE classification and a concrete remediation.",
        },
        {
          title: "A controlled environment with no real data",
          context: "Practicing offensive techniques is only valid inside an authorized scope.",
          tradeoff:
            "A lab machine has no real users or traffic, so the business impact in the executive report is estimated.",
          decision:
            "A single DockerLabs container as the scope, with the impact figures taken from a published source (IBM Cost of a Data Breach 2024).",
        },
      ],
      results: [
        "Seven documented findings, three critical, two high and two medium, each with CVSS, evidence and remediation.",
        "An 18-page technical report and a 14-page executive one, with a risk matrix, MITRE ATT&CK mapping and a remediation roadmap.",
        "28 evidence screenshots tied to the writeup, published under the MIT license alongside the repository.",
      ],
      learnings: [
        "No finding in the exercise depended on an unknown vulnerability: they were configuration mistakes and work habits that repeat in real environments.",
        "A single mistake is rarely enough; the damage comes from chaining several small findings, so fixing the cheapest link already breaks the chain.",
        "The same finding reads differently depending on who reads it: the technical detail and the business risk are two documents, not one.",
        "The documents have to agree with each other: the writeup, the technical report and the executive report had to tell the same seven findings.",
      ],
    },
  },
];

export const caseStudies = projects.filter((p) => p.caseStudy);
