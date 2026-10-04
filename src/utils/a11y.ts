const normalize = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

/** Plain text of a rendered HTML fragment, used to read the visible label of a control. */
export function visibleText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Accessible name that keeps the visible text (WCAG 2.5.3, Label in Name).
 * Returns `label` when it already contains the visible text as whole words,
 * otherwise `"<visible>: <label>"`.
 */
export function labelInName(visible: string, label: string): string {
  const wanted = normalize(visible);
  if (!wanted || ` ${normalize(label)} `.includes(` ${wanted} `)) return label;
  return `${visible.trim()}: ${label}`;
}
