import {
  isRichPart,
  projectFilters,
  projectStack,
  type PartKind,
  type Project,
  type ProjectLink,
  type ProjectPart,
  type ProjectPartEn,
} from "@/data/projects";
import { siteRoutes } from "@/i18n/utils";
import type { Lang } from "@/i18n/utils";

export interface ProjectAction {
  href: string;
  text: string;
  ariaLabel: string;
  external: boolean;
  event?: string;
}

/** A part resolved for one language: every field already picks its English override. */
export type LocalizedPart = Omit<ProjectPart, "en" | "links"> & {
  links: ProjectLink[];
};

export interface PartView {
  kind: PartKind;
  /** Anchor id of the part on the project page (`#app`, `#landing`, `#docs`...). */
  id: string;
  label: string;
  blurb: string;
  /** Rich parts render as an accordion with case-study sections; the others as a link row. */
  rich: boolean;
  content: LocalizedPart;
  /** External links of the part. In an ecosystem the first one reads as the kind of part. */
  actions: ProjectAction[];
}

export interface ProjectView {
  slug: string;
  title: string;
  shortName: string;
  tag: string;
  tone: Project["tagColor"];
  overline?: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  problem: string;
  solution: string;
  summary: string;
  /** Short preview of the merged stack, for cards and rows. The full list is on the page. */
  stack: string[];
  filters: string[];
  caseHref: string;
  /** What a card shows: only the case study. Every other link lives on the project page. */
  actions: ProjectAction[];
  /** External links of the project page: one per part (every link on a single-part project). */
  links: ProjectAction[];
  parts: PartView[];
}

const STACK_PREVIEW = 6;

export const PART_LABELS: Record<Lang, Record<PartKind, string>> = {
  es: {
    app: "App",
    landing: "Landing",
    docs: "Documentación",
    blog: "Blog",
    repo: "Repositorio",
    api: "API",
    site: "Sitio",
    writeup: "Writeup",
  },
  en: {
    app: "App",
    landing: "Landing",
    docs: "Documentation",
    blog: "Blog",
    repo: "Repository",
    api: "API",
    site: "Site",
    writeup: "Writeup",
  },
};

const PART_ACTIONS: Record<Lang, Record<PartKind, string>> = {
  es: {
    app: "Ver app",
    landing: "Ver landing",
    docs: "Ver documentación",
    blog: "Ver blog",
    repo: "Ver repositorio",
    api: "Ver Swagger",
    site: "Ver sitio",
    writeup: "Ver writeup",
  },
  en: {
    app: "View app",
    landing: "View landing",
    docs: "View documentation",
    blog: "View blog",
    repo: "View repository",
    api: "View Swagger",
    site: "View site",
    writeup: "View writeup",
  },
};

const firstSentence = (text: string) => {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
};

/** Resolves a part for one language. English fields override the Spanish ones when present. */
export function localizePart(part: ProjectPart, lang: Lang): LocalizedPart {
  const { en, ...base } = part;
  if (lang !== "en" || !en) return { ...base, links: part.links };
  const overrides = Object.fromEntries(
    Object.entries(en as ProjectPartEn).filter(([, value]) => value !== undefined)
  );
  return { ...base, ...overrides, blurb: en.blurb, links: en.links ?? part.links };
}

export const toAction = (link: ProjectLink, text: string = link.text): ProjectAction => ({
  href: link.href,
  text,
  ariaLabel: link.ariaLabel,
  external: true,
  event: link.event,
});

/** Localized, presentation-ready view of a project. Content is untouched; only picks ES/EN fields. */
export function projectView(p: Project, lang: Lang, base: string = "/"): ProjectView {
  const isEn = lang === "en";
  const en = isEn ? p.en : undefined;
  const r = siteRoutes(lang, base);
  const multi = p.parts.length > 1;
  const parts: PartView[] = p.parts.map((part) => {
    const content = localizePart(part, lang);
    return {
      kind: part.kind,
      id: part.kind,
      label: PART_LABELS[lang][part.kind],
      blurb: content.blurb,
      rich: isRichPart(part),
      content,
      actions: content.links.map((link, i) =>
        toAction(link, multi && i === 0 ? PART_ACTIONS[lang][part.kind] : link.text)
      ),
    };
  });
  const primary = parts[0].content;
  const solution = primary.solution ?? primary.summary ?? "";
  const summary = en?.summary ?? p.summary ?? primary.summary ?? firstSentence(solution);

  // One part keeps every link it declares. An ecosystem lists one link per part, so the
  // column stays short however many parts the project has.
  const links = multi ? parts.flatMap((part) => part.actions.slice(0, 1)) : parts[0].actions;
  const actions: ProjectAction[] = [
    {
      href: r.project(p.slug),
      text: isEn ? "Case study" : "Caso de estudio",
      ariaLabel: isEn ? `Read the ${p.name} case study` : `Leer el caso de estudio de ${p.name}`,
      external: false,
    },
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
    title: p.name,
    shortName: p.shortName,
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
    problem: primary.problem ?? summary,
    solution,
    summary,
    stack: projectStack(p).slice(0, STACK_PREVIEW),
    filters: projectFilters(p),
    caseHref: r.project(p.slug),
    actions,
    links,
    parts,
  };
}
