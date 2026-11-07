// Vercel Edge Middleware. It runs before the static files are served and
// decides, per request, which prebuilt page a visitor gets: the COP variant
// under `/cop/...` for visitors in Colombia, the USD page already on disk for
// everyone else. The public URL never changes, the pages stay static and the
// CDN caches each variant under its own path, so a COP page is never served to
// a visitor outside Colombia or the other way round.
//
// Only the country header is read. The address is never read, stored or
// logged. Direct requests to the internal `/cop/...` paths are sent back to the
// public URL, so there is no way to pick a currency by hand in production.
//
// Response protocol: a rewrite is an empty response whose
// `x-middleware-rewrite` header carries the absolute destination, and
// `x-middleware-next: 1` lets the request continue unchanged. They are the
// headers the `@vercel/edge` helpers emit; writing them by hand keeps this file
// dependency-free, like `api/quote.ts`.

import {
  copVariantPath,
  currencyForCountry,
  isCopVariantPath,
  isPricedRoute,
  resolveCountry,
  stripVariantPrefix,
} from "./src/utils/currency";

/**
 * Paths the middleware runs on: every priced route (with and without the
 * trailing slash) and the internal variant prefix. Vercel reads this list
 * statically, so it is spelled out instead of derived from `PRICED_ROUTES`;
 * `tests/currency.spec.ts` checks that both stay in sync.
 */
export const config = {
  matcher: [
    "/servicios",
    "/servicios/",
    "/en/services",
    "/en/services/",
    "/cotizar",
    "/cotizar/",
    "/en/quote",
    "/en/quote/",
    "/cop/:path*",
  ],
};

const next = (): Response => new Response(null, { headers: { "x-middleware-next": "1" } });

const rewrite = (destination: URL): Response =>
  new Response(null, { headers: { "x-middleware-rewrite": destination.toString() } });

export default function middleware(request: Request): Response {
  const url = new URL(request.url);

  if (isCopVariantPath(url.pathname)) {
    const target = new URL(url);
    target.pathname = stripVariantPrefix(url.pathname);
    return Response.redirect(target, 308);
  }

  if (!isPricedRoute(url.pathname)) return next();

  const country = resolveCountry(request.headers, process.env);
  if (currencyForCountry(country) !== "COP") return next();

  const target = new URL(url);
  target.pathname = copVariantPath(url.pathname);
  return rewrite(target);
}
