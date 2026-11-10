// The profile links of the site, in the only order any row may show them.
// `SocialLinks.astro` renders a subset of this list, `SocialProfileCard.astro`
// one profile at a time and the about pages read the Blog W entry for their
// text button; nothing else lists a URL. `handle` is the public username shown
// on a profile card, only for the networks that have one.

import type { Lang } from "../i18n/ui";

export type SocialNetwork = "instagram" | "tiktok" | "linkedin" | "github" | "platzi" | "blog-w";

export const SOCIAL_NETWORKS: readonly SocialNetwork[] = [
  "instagram",
  "tiktok",
  "linkedin",
  "github",
  "platzi",
  "blog-w",
];

/** Footer set, and the default of every row that does not pick its own. */
export const DEFAULT_SOCIAL_NETWORKS: readonly SocialNetwork[] = [
  "instagram",
  "tiktok",
  "linkedin",
  "github",
];

export const SOCIAL_PROFILES: Record<
  SocialNetwork,
  { href: string; label: Record<Lang, string>; handle?: string }
> = {
  instagram: {
    href: "https://instagram.com/wavival_dev",
    handle: "@wavival_dev",
    label: { es: "Instagram de Valentina Ramírez", en: "Valentina Ramírez on Instagram" },
  },
  tiktok: {
    href: "https://www.tiktok.com/@wavival_dev",
    handle: "@wavival_dev",
    label: { es: "TikTok de Valentina Ramírez", en: "Valentina Ramírez on TikTok" },
  },
  linkedin: {
    href: "https://linkedin.com/in/wavival",
    label: { es: "LinkedIn de Valentina Ramírez", en: "Valentina Ramírez on LinkedIn" },
  },
  github: {
    href: "https://github.com/wavival",
    label: { es: "GitHub de Valentina Ramírez", en: "Valentina Ramírez on GitHub" },
  },
  platzi: {
    href: "https://platzi.com/p/wavival",
    label: {
      es: "Perfil de Platzi de Valentina Ramírez",
      en: "Valentina Ramírez's Platzi profile",
    },
  },
  "blog-w": {
    href: "https://blog.luminaw.co",
    label: {
      es: "Leer Blog W: blog de Lúmina W creado por Valentina Ramírez",
      en: "Read Blog W: Lúmina W blog by Valentina Ramírez",
    },
  },
};
