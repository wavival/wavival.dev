// Currency by visitor location. Shared by the Vercel Edge Middleware
// (`middleware.ts`), the Astro build and `api/quote.ts`, so it stays free of
// Astro and framework imports.
//
// Rule: a visitor in Colombia sees COP only; everyone else, and every request
// without a detected country (crawlers, local preview), sees USD only. The
// page language never decides the currency.

export type Currency = "COP" | "USD";

export const CURRENCIES: readonly Currency[] = ["COP", "USD"];

/** The only country billed in COP. */
export const COP_COUNTRY = "CO";

/** Header Vercel adds at the edge with the ISO 3166-1 alpha-2 country of the request. */
export const COUNTRY_HEADER = "x-vercel-ip-country";

/**
 * Non-production override, so a preview deployment or `vercel dev` can be
 * checked as if the visitor were in a given country. Ignored in production.
 */
export const COUNTRY_OVERRIDE_ENV = "GEO_COUNTRY_OVERRIDE";

/**
 * Path prefix of the prebuilt COP variant of each priced page. Visitors never
 * see it: the middleware rewrites to it internally and redirects direct hits
 * back to the public URL.
 */
export const COP_VARIANT_PREFIX = "/cop";

/** Public routes that render a price and therefore have a COP variant. */
export const PRICED_ROUTES: readonly string[] = [
  "/servicios",
  "/en/services",
  "/cotizar",
  "/en/quote",
];

type HeaderSource = Pick<Headers, "get">;
type Env = Record<string, string | undefined>;

const normalizeCountry = (value: string | null | undefined): string | null => {
  const code = (value ?? "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : null;
};

export const isProduction = (env: Env): boolean => env.VERCEL_ENV === "production";

/**
 * Country of the request: the override variable outside production, otherwise
 * the Vercel geolocation header. `null` when nothing valid is present.
 */
export function resolveCountry(headers: HeaderSource, env: Env = {}): string | null {
  if (!isProduction(env)) {
    const forced = normalizeCountry(env[COUNTRY_OVERRIDE_ENV]);
    if (forced) return forced;
  }
  return normalizeCountry(headers.get(COUNTRY_HEADER));
}

export const currencyForCountry = (country: string | null | undefined): Currency =>
  normalizeCountry(country) === COP_COUNTRY ? "COP" : "USD";

const trimSlash = (pathname: string): string => pathname.replace(/\/+$/, "") || "/";

export const isCopVariantPath = (pathname: string): boolean =>
  pathname === COP_VARIANT_PREFIX || pathname.startsWith(`${COP_VARIANT_PREFIX}/`);

/** The public pathname behind a variant pathname; other pathnames pass through. */
export function stripVariantPrefix(pathname: string): string {
  if (!isCopVariantPath(pathname)) return pathname;
  return pathname.slice(COP_VARIANT_PREFIX.length) || "/";
}

/** The same URL with the variant prefix removed from its pathname. */
export function publicUrl(url: URL): URL {
  if (!isCopVariantPath(url.pathname)) return url;
  const out = new URL(url.toString());
  out.pathname = stripVariantPrefix(url.pathname);
  return out;
}

export const isPricedRoute = (pathname: string): boolean =>
  PRICED_ROUTES.includes(trimSlash(stripVariantPrefix(pathname)));

/** Pathname of the COP variant of a public priced route. */
export const copVariantPath = (pathname: string): string =>
  `${COP_VARIANT_PREFIX}${stripVariantPrefix(pathname)}`;

/** Currency a page renders, decided only by the path it is built under. */
export const currencyForPathname = (pathname: string): Currency =>
  isCopVariantPath(pathname) ? "COP" : "USD";
