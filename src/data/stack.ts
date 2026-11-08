export interface StackCategory {
  category: string;
  description: string;
  descriptionEn?: string;
  tools: string[];
  /** English chip labels; only set for categories with translatable (non-proper-noun) tools. Falls back to `tools`. */
  toolsEn?: string[];
  /** Longer rationale shown on the /uses page. */
  why?: string;
  whyEn?: string;
  /** The three axes of the positioning, highlighted on the home stack grid. */
  featured?: boolean;
}

const backend: StackCategory = {
  category: "Backend",
  featured: true,
  description: "La columna vertebral de cada producto.",
  descriptionEn: "The backbone of every product.",
  tools: [
    "Python",
    "Django",
    "Django REST Framework",
    "PostgreSQL",
    "JWT",
    "Arquitectura de software",
    "PWAs",
    "Offline-first",
    "APIs REST",
    "Multitenancy",
    "Modelado relacional",
  ],
  toolsEn: [
    "Python",
    "Django",
    "Django REST Framework",
    "PostgreSQL",
    "JWT",
    "Software architecture",
    "PWAs",
    "Offline-first",
    "REST APIs",
    "Multitenancy",
    "Relational modeling",
  ],
  why: "Django + DRF me dan velocidad sin sacrificar estructura: ORM maduro, admin de fábrica y un ecosistema que cubre auth, permisos y migraciones. PostgreSQL para modelado relacional serio; JWT para autenticación desacoplada entre API y frontend. Decido la arquitectura pensando en el segundo año, no solo en el MVP: multitenancy, offline-first y APIs limpias son decisiones que se pagan caras si se dejan para después.",
  whyEn:
    "Django + DRF give me speed without sacrificing structure: mature ORM, built-in admin, and an ecosystem that covers auth, permissions, and migrations. PostgreSQL for serious relational modeling; JWT for decoupled auth between API and frontend. I decide architecture thinking about year two, not just the MVP: multitenancy, offline-first, and clean APIs are decisions that cost dearly if left for later.",
};

const frontend: StackCategory = {
  category: "Frontend",
  description: "Interfaces que completan el producto.",
  descriptionEn: "Interfaces that complete the product.",
  tools: ["Next.js", "React", "TypeScript", "Astro", "Tailwind CSS", "JavaScript"],
  why: "Next.js para aplicaciones web completas, React + TypeScript para interfaces con estado y lógica de cliente, y Astro cuando lo que manda es rendimiento y contenido estático. Tailwind para mantener consistencia visual.",
  whyEn:
    "Next.js for complete web applications, React + TypeScript for stateful interfaces, and Astro when performance and static content take priority. Tailwind helps maintain visual consistency.",
};

const designAndUx: StackCategory = {
  category: "Design & UX",
  description: "Productos que se ven bien y cualquiera puede usar.",
  descriptionEn: "Products that look good and anyone can use.",
  tools: ["UX/UI", "Figma", "Accesibilidad (a11y)", "SEO técnico", "Web Performance"],
  toolsEn: ["UX/UI", "Figma", "Accessibility (a11y)", "Technical SEO", "Web Performance"],
  why: "Diseño en Figma antes de escribir código. Accesibilidad y SEO técnico no son extras: son parte de que el producto funcione para personas y para buscadores. El rendimiento es una feature.",
  whyEn:
    "I design in Figma before writing code. Accessibility and technical SEO are not extras: they are part of making the product work for people and for search engines. Performance is a feature.",
};

const security: StackCategory = {
  category: "Security",
  description: "Seguridad desde el diseño en cada línea de código.",
  descriptionEn: "Security by design in every line of code.",
  tools: ["OWASP", "MITRE ATT&CK", "PTES", "Linux", "AppSec"],
  why: "Reviso cada sistema con criterios de OWASP para encontrar sus fallas antes que alguien más y escribir código que no se rompa así. OWASP Top 10 como checklist mínimo; seguridad desde el diseño, no parcheada al final.",
  whyEn:
    "I review every system against OWASP criteria to find its flaws before someone else does and write code that does not break that way. OWASP Top 10 as a minimum checklist; security by design, not patched at the end.",
};

const aiIntegrations: StackCategory = {
  category: "AI Integrations",
  featured: true,
  description: "IA como copiloto real, no como atajo.",
  descriptionEn: "AI as a real co-pilot, not a shortcut.",
  tools: ["OpenAI", "OpenClaw", "Claude API", "LLM Workflows", "Prompt Engineering", "n8n"],
  why: "Integro OpenAI, OpenClaw y Claude API donde aportan valor real, como análisis y asistencia con contexto. n8n para automatizar flujos. La IA acelera; no reemplaza el criterio de ingeniería.",
  whyEn:
    "I integrate OpenAI, OpenClaw, and Claude API where they add real value, such as analysis and context-aware assistance. n8n handles workflow automation. AI accelerates; it does not replace engineering judgment.",
};

const marketingAndContent: StackCategory = {
  category: "Marketing & Content",
  featured: true,
  description: "Contenido y presencia digital que traen clientes.",
  descriptionEn: "Content and digital presence that bring in customers.",
  tools: [
    "Marketing digital",
    "Creación de contenido",
    "TikTok",
    "Instagram",
    "CapCut",
    "Canva",
    "ElevenLabs",
    "Higgsfield",
  ],
  toolsEn: [
    "Digital marketing",
    "Content creation",
    "TikTok",
    "Instagram",
    "CapCut",
    "Canva",
    "ElevenLabs",
    "Higgsfield",
  ],
  why: "Formación en marketing y redes sociales en Platzi y práctica como creadora de contenido en TikTok e Instagram. Canva y CapCut para piezas y video, ElevenLabs e Higgsfield para audio y video con IA: el mismo contenido con el que muestro en público cómo construyo.",
  whyEn:
    "Marketing and social media training at Platzi and hands-on practice as a content creator on TikTok and Instagram. Canva and CapCut for pieces and video, ElevenLabs and Higgsfield for AI audio and video: the same content I use to show in public how I build.",
};

const frontendAndUx: StackCategory = {
  category: "Frontend & UX",
  description: "Interfaces que se ven bien y cualquiera puede usar.",
  descriptionEn: "Interfaces that look good and anyone can use.",
  tools: [...frontend.tools, ...designAndUx.tools],
  toolsEn: [...frontend.tools, ...(designAndUx.toolsEn ?? designAndUx.tools)],
  why: `${frontend.why} ${designAndUx.why}`,
  whyEn: `${frontend.whyEn} ${designAndUx.whyEn}`,
};

/** Six home cards, ordered for the three-column zigzag layout. */
export const stack: StackCategory[] = [
  backend,
  frontend,
  designAndUx,
  aiIntegrations,
  marketingAndContent,
  security,
];

/** The existing grouped view rendered on the uses pages. */
export const usesStack: StackCategory[] = [
  backend,
  frontendAndUx,
  security,
  aiIntegrations,
  marketingAndContent,
];
