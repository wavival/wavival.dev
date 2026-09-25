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
}

export const stack: StackCategory[] = [
  {
    category: "Backend",
    description: "La columna vertebral de cada producto.",
    descriptionEn: "The backbone of every product.",
    tools: ["Python", "Django", "Django REST Framework", "PostgreSQL", "JWT"],
    why: "Django + DRF me dan velocidad sin sacrificar estructura: ORM maduro, admin de fábrica y un ecosistema que cubre auth, permisos y migraciones. PostgreSQL para modelado relacional serio; JWT para autenticación desacoplada entre API y frontend.",
    whyEn:
      "Django + DRF give me speed without sacrificing structure: mature ORM, built-in admin, and an ecosystem that covers auth, permissions, and migrations. PostgreSQL for serious relational modeling; JWT for decoupled auth between API and frontend.",
  },
  {
    category: "Frontend",
    description: "Interfaces que completan el producto.",
    descriptionEn: "Interfaces that complete the product.",
    tools: ["Next.js", "React", "TypeScript", "Astro", "Tailwind CSS", "JavaScript"],
    why: "Next.js para aplicaciones web completas, React + TypeScript para interfaces con estado y lógica de cliente, y Astro cuando lo que manda es rendimiento y contenido estático. Tailwind para mantener consistencia visual.",
    whyEn:
      "Next.js for complete web applications, React + TypeScript for stateful interfaces, and Astro when performance and static content take priority. Tailwind helps maintain visual consistency.",
  },
  {
    category: "Design & UX",
    description: "Productos que se ven bien y cualquiera puede usar.",
    descriptionEn: "Products that look good and anyone can use.",
    tools: ["UX/UI", "Figma", "Accesibilidad (a11y)", "SEO técnico", "Web Performance"],
    toolsEn: ["UX/UI", "Figma", "Accessibility (a11y)", "Technical SEO", "Web Performance"],
    why: "Diseño en Figma antes de escribir código. Accesibilidad y SEO técnico no son extras: son parte de que el producto funcione para personas y para buscadores. El rendimiento es una feature.",
    whyEn:
      "I design in Figma before writing code. Accessibility and technical SEO are not extras: they are part of making the product work for people and for search engines. Performance is a feature.",
  },
  {
    category: "Product Engineering",
    description: "Arquitectura que escala desde el primer commit.",
    descriptionEn: "Architecture that scales from the first commit.",
    tools: [
      "Arquitectura de software",
      "PWAs",
      "Offline-first",
      "APIs REST",
      "Multitenancy",
      "Modelado relacional",
    ],
    toolsEn: [
      "Software architecture",
      "PWAs",
      "Offline-first",
      "REST APIs",
      "Multitenancy",
      "Relational modeling",
    ],
    why: "Decido la arquitectura pensando en el segundo año, no solo en el MVP. Multitenancy, offline-first y APIs limpias son decisiones que se pagan caras si se dejan para después.",
    whyEn:
      "I decide architecture thinking about year two, not just the MVP. Multitenancy, offline-first, and clean APIs are decisions that cost dearly if left for later.",
  },
  {
    category: "Security",
    description: "Mentalidad ofensiva para escribir código defensivo.",
    descriptionEn: "Offensive mindset to write defensive code.",
    tools: ["OWASP", "MITRE ATT&CK", "PTES", "Linux", "AppSec"],
    why: "Hago pentesting para entender cómo se rompe un sistema y escribir código que no se rompa así. OWASP Top 10 como checklist mínimo; seguridad desde el diseño, no parcheada al final.",
    whyEn:
      "I do pentesting to understand how a system breaks and write code that does not break that way. OWASP Top 10 as a minimum checklist; security by design, not patched at the end.",
  },
  {
    category: "AI Integrations",
    description: "IA como copiloto real, no como atajo.",
    descriptionEn: "AI as a real co-pilot, not a shortcut.",
    tools: ["OpenAI", "OpenClaw", "Claude API", "LLM Workflows", "Prompt Engineering", "n8n"],
    why: "Integro OpenAI, OpenClaw y Claude API donde aportan valor real, como análisis y asistencia con contexto. n8n para automatizar flujos. La IA acelera; no reemplaza el criterio de ingeniería.",
    whyEn:
      "I integrate OpenAI, OpenClaw, and Claude API where they add real value, such as analysis and context-aware assistance. n8n handles workflow automation. AI accelerates; it does not replace engineering judgment.",
  },
];
