export interface GithubUser {
  public_repos: number;
  followers: number;
  html_url: string;
}

export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
}

const GH_HEADERS = { Accept: "application/vnd.github.v3+json" };

/** Flagship repos pinned to the "featured" spotlight, in display order. */
export const FEATURED_REPOS = ["nullbreach"];
/** Repos hidden from the widget: profile README, this portfolio, and one-off
 * technical tests, none of which are learning resources for others. */
const HIDDEN_REPOS = ["wavival", "wavival.dev", "prueba-tecnica-logika"];

export interface CuratedRepos {
  featured: GithubRepo[];
  resources: GithubRepo[];
}

/**
 * Split fetched repos into the NullBreach flagship and the rest,
 * which are framed as learning resources. Featured order follows FEATURED_REPOS;
 * hidden repos drop out entirely.
 */
export function curateRepos(repos: GithubRepo[]): CuratedRepos {
  const featured = FEATURED_REPOS.map((name) => repos.find((r) => r.name === name)).filter(
    (r): r is GithubRepo => Boolean(r)
  );
  const featuredNames = new Set(FEATURED_REPOS);
  const hidden = new Set(HIDDEN_REPOS);
  const resources = repos.filter((r) => !featuredNames.has(r.name) && !hidden.has(r.name));
  return { featured, resources };
}

/**
 * Build-time fetch of a public GitHub profile plus its most recent non-fork repos.
 * Unauthenticated (GitHub allows ~60 req/h per IP), so it fails soft: any network
 * error or rate-limit returns nulls, the build never breaks, and the widget simply
 * does not render that build. No client-side JS and no token required.
 */
export async function fetchGithubProfile(
  username: string,
  count = 30
): Promise<{ user: GithubUser | null; repos: GithubRepo[] }> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers: GH_HEADERS }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12&type=public`, {
        headers: GH_HEADERS,
      }),
    ]);

    const user = userRes.ok ? ((await userRes.json()) as GithubUser) : null;

    let repos: GithubRepo[] = [];
    if (reposRes.ok) {
      const all = (await reposRes.json()) as GithubRepo[];
      repos = Array.isArray(all) ? all.filter((r) => !r.fork).slice(0, count) : [];
    }

    return { user, repos };
  } catch {
    return { user: null, repos: [] };
  }
}
