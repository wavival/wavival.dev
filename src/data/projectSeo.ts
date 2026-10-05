import { projectStack, type PartKind, type Project } from "@/data/projects";
import { localizePart, PART_LABELS } from "@/data/projectView";
import type { Lang } from "@/i18n/utils";

/** schema.org type of each part inside `hasPart`. */
const PART_SCHEMA: Record<PartKind, string> = {
  app: "SoftwareApplication",
  landing: "WebSite",
  docs: "WebSite",
  blog: "Blog",
  repo: "SoftwareSourceCode",
  api: "WebAPI",
  site: "WebSite",
  writeup: "TechArticle",
};

/** Localized <title> and meta description of a project page. */
export function projectMeta(project: Project, lang: Lang) {
  const isEn = lang === "en";
  const primary = localizePart(project.parts[0], lang);
  const description =
    (isEn ? project.en?.metaDescription : undefined) ??
    project.metaDescription ??
    primary.metaDescription ??
    (isEn ? project.en?.summary : undefined) ??
    project.summary ??
    primary.summary ??
    "";
  const title = isEn
    ? `${project.name}: Case study | Valentina Ramirez`
    : `${project.name}: Caso de estudio | Valentina Ramírez`;
  return { title, description };
}

/** JSON-LD of a project page. An ecosystem lists each linked part in `hasPart`. */
export function projectSchema(project: Project, lang: Lang, pageURL: string, site: string) {
  const { description } = projectMeta(project, lang);
  const buildDate = new Date().toISOString().slice(0, 10);
  const datePublished = project.datePublished ?? buildDate;
  const dateModified = project.dateModified ?? datePublished;
  const toIsoDateTime = (d: string) => (d.length === 10 ? `${d}T00:00:00-05:00` : d);
  const app = project.parts.find((part) => part.kind === "app") ?? project.parts[0];
  const parts = project.parts.flatMap((part) => {
    const content = localizePart(part, lang);
    const link = content.links[0];
    if (!link) return [];
    return [
      {
        "@type": PART_SCHEMA[part.kind],
        name: `${project.shortName} ${PART_LABELS[lang][part.kind]}`,
        description: content.blurb,
        url: link.href,
      },
    ];
  });

  return {
    "@context": "https://schema.org",
    "@type": project.schemaType,
    "@id": `${pageURL}#project`,
    name: project.name,
    ...(project.name !== project.shortName ? { alternateName: project.shortName } : {}),
    description,
    url: pageURL,
    inLanguage: lang === "en" ? "en-US" : "es-CO",
    ...(project.image ? { image: `${site}/${project.image}` } : {}),
    author: { "@id": `${site}/#person` },
    datePublished: toIsoDateTime(datePublished),
    dateModified: toIsoDateTime(dateModified),
    ...(project.schemaType === "SoftwareApplication"
      ? {
          applicationCategory: app.appCategory ?? "WebApplication",
          operatingSystem: "Web",
          ...(app.programmingLanguage ? { programmingLanguage: app.programmingLanguage } : {}),
          softwareRequirements: (app.stack ?? projectStack(project)).join(", "),
        }
      : {}),
    ...(project.parts.length > 1 ? { hasPart: parts } : {}),
  };
}
