import type { Project, ProjectLink } from "@/data/projects";
import { siteRoutes } from "@/i18n/utils";
import type { Lang } from "@/i18n/utils";

export interface ProjectAction {
  href: string;
  text: string;
  ariaLabel: string;
  external: boolean;
  event?: string;
}

export interface ProjectView {
  slug: string;
  title: string;
  tag: string;
  tone: Project["tagColor"];
  overline?: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  problem: string;
  solution: string;
  summary: string;
  stack: string[];
  filters: string[];
  caseHref?: string;
  actions: ProjectAction[];
}

const SITE_LINK_TEXT = ["Ver sitio", "Visit site", "Ver app", "View app"];

const firstSentence = (text: string) => {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
};

/** Localized, presentation-ready view of a project. Content is untouched; only picks ES/EN fields. */
export function projectView(p: Project, lang: Lang, base: string = "/"): ProjectView {
  const isEn = lang === "en";
  const en = isEn ? p.en : undefined;
  const r = siteRoutes(lang, base);
  const solution = en?.solution ?? p.solution;
  const links: ProjectLink[] = en?.links ?? p.links;
  const caseSlug = p.linkedCaseStudy ?? (p.caseStudy ? p.slug : undefined);

  const siteLink = links.find((l) => SITE_LINK_TEXT.includes(l.text));
  const ordered = siteLink ? [siteLink, ...links.filter((l) => l !== siteLink)] : links;

  const actions: ProjectAction[] = [
    ...(caseSlug
      ? [
          {
            href: r.project(caseSlug),
            text: isEn ? "Case study" : "Caso de estudio",
            ariaLabel: isEn
              ? `Read the ${p.title} case study`
              : `Leer el caso de estudio de ${p.title}`,
            external: false,
          },
        ]
      : []),
    ...ordered.map((l) => ({
      href: l.href,
      text: l.text,
      ariaLabel: l.ariaLabel,
      external: true,
      event: l.event,
    })),
  ];

  const overline =
    p.slug === "terracore"
      ? isEn
        ? "Featured project"
        : "Proyecto destacado"
      : p.slug === "nullbreach"
        ? isEn
          ? "AI · Security"
          : "IA · Seguridad"
        : undefined;

  return {
    slug: p.slug,
    title: p.title,
    tag: en?.tag ?? p.tag,
    tone: p.tagColor,
    overline,
    image: p.image
      ? {
          src: `${base}${p.image}`,
          alt: en?.imageAlt ?? p.imageAlt ?? "",
          width: p.imageWidth,
          height: p.imageHeight,
        }
      : undefined,
    problem: en?.problem ?? p.problem,
    solution,
    summary: en?.summary ?? p.summary ?? firstSentence(solution),
    stack: p.stack,
    filters: p.filters ?? [],
    caseHref: caseSlug ? r.project(caseSlug) : undefined,
    actions,
  };
}
