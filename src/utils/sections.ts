/**
 * Two-digit index ("01", "02", ...) of each listed section, in order. A page passes
 * only the sections it renders, so a section that is left out leaves no gap.
 */
export function sectionIndices<T extends string>(sections: readonly T[]): Record<T, string> {
  return Object.fromEntries(
    sections.map((name, position) => [name, String(position + 1).padStart(2, "0")])
  ) as Record<T, string>;
}

export interface UsesSectionIndices {
  stack: string;
  hardware: string;
  software: string;
  /** Absent when the build-time GitHub fetch failed and the block does not render. */
  github?: string;
  social: string;
}

/** Section numbering of `/herramientas` and `/en/uses`: Social is "05" after GitHub, "04" without it. */
export function usesSectionIndices(withGithub: boolean): UsesSectionIndices {
  return sectionIndices([
    "stack",
    "hardware",
    "software",
    ...(withGithub ? (["github"] as const) : []),
    "social",
  ]);
}
