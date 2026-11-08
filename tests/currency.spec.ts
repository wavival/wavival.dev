import { test, expect, type Page } from "@playwright/test";
import middleware, { config } from "../middleware";
import {
  COP_VARIANT_PREFIX,
  COUNTRY_HEADER,
  COUNTRY_OVERRIDE_ENV,
  PRICED_ROUTES,
  currencyForCountry,
  stripVariantPrefix,
} from "../src/utils/currency";
import { getAltLangUrl, getLangFromUrl } from "../src/i18n/utils";

const ORIGIN = "https://www.wavival.dev";

const run = (path: string, country?: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers);
  if (country !== undefined) headers.set(COUNTRY_HEADER, country);
  return middleware(new Request(`${ORIGIN}${path}`, { ...init, headers }));
};

const rewriteTarget = (response: Response) => response.headers.get("x-middleware-rewrite");
const passesThrough = (response: Response) =>
  response.headers.get("x-middleware-next") === "1" && rewriteTarget(response) === null;

/** Path the browser would end up rendering for a visitor from `country`, as the middleware decides it. */
const pathFor = (path: string, country?: string) => {
  const target = rewriteTarget(run(path, country));
  return target ? new URL(target).pathname + new URL(target).search : path;
};

/** Every text node of the page, visible or not, without scripts and styles. */
const pageText = (page: Page) =>
  page.evaluate(() => {
    const clone = document.body.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("script, style, noscript").forEach((node) => node.remove());
    return clone.textContent ?? "";
  });

const jsonLd = (page: Page) =>
  page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? ""));

const withEnv = async (
  vars: Record<string, string | undefined>,
  fn: () => void | Promise<void>
) => {
  const previous = Object.fromEntries(Object.keys(vars).map((key) => [key, process.env[key]]));
  for (const [key, value] of Object.entries(vars)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    await fn();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
};

test.describe("currency rule (pure helpers)", () => {
  test("only Colombia is billed in COP; unknown and missing countries fall back to USD", () => {
    expect(currencyForCountry("CO")).toBe("COP");
    expect(currencyForCountry("co")).toBe("COP");
    for (const value of ["AR", "CL", "US", "ES", "", null, undefined, "COL", "C"]) {
      expect(currencyForCountry(value), `country ${String(value)}`).toBe("USD");
    }
  });

  test("the variant prefix is invisible to language detection, the language toggle and the public path", () => {
    expect(stripVariantPrefix("/cop/servicios/")).toBe("/servicios/");
    expect(stripVariantPrefix("/cop")).toBe("/");
    expect(stripVariantPrefix("/servicios/")).toBe("/servicios/");
    expect(getLangFromUrl(new URL(`${ORIGIN}/cop/en/services/`))).toBe("en");
    expect(getLangFromUrl(new URL(`${ORIGIN}/cop/servicios/`))).toBe("es");
    expect(getAltLangUrl(new URL(`${ORIGIN}/cop/en/services/`))).toEqual({
      href: "/servicios",
      lang: "es",
    });
    expect(getAltLangUrl(new URL(`${ORIGIN}/cop/cotizar/`))).toEqual({
      href: "/en/quote",
      lang: "en",
    });
  });
});

test.describe("edge middleware", () => {
  test("its matcher covers exactly the priced routes and the variant prefix", () => {
    const expected = [
      ...PRICED_ROUTES.flatMap((route) => [route, `${route}/`]),
      `${COP_VARIANT_PREFIX}/:path*`,
    ];
    expect(config.matcher).toEqual(expected);
  });

  for (const route of PRICED_ROUTES) {
    test(`Colombia gets the COP variant of ${route}, with the query kept`, () => {
      expect(rewriteTarget(run(route, "CO"))).toBe(`${ORIGIN}${COP_VARIANT_PREFIX}${route}`);
      expect(rewriteTarget(run(`${route}/`, "CO"))).toBe(`${ORIGIN}${COP_VARIANT_PREFIX}${route}/`);
      expect(rewriteTarget(run(`${route}?service=landing-page`, "co"))).toBe(
        `${ORIGIN}${COP_VARIANT_PREFIX}${route}?service=landing-page`
      );
    });

    test(`Argentina, Chile and an unknown country get the USD page of ${route} untouched`, () => {
      for (const country of ["AR", "CL", "US", "ES", ""]) {
        expect(passesThrough(run(route, country)), `country ${country}`).toBe(true);
      }
      expect(passesThrough(run(route)), "no header").toBe(true);
    });
  }

  test("a direct request to the internal variant is sent back to the public URL", () => {
    const response = run("/cop/servicios/?service=landing-page", "AR");
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(`${ORIGIN}/servicios/?service=landing-page`);
    expect(run("/cop/en/quote", "CO").headers.get("location")).toBe(`${ORIGIN}/en/quote`);
  });

  test("routes without a price are left alone even if the matcher ever widens", () => {
    expect(passesThrough(run("/", "CO"))).toBe(true);
    expect(passesThrough(run("/contacto/", "CO"))).toBe(true);
    expect(passesThrough(run("/en/about", "CO"))).toBe(true);
  });

  test("nothing the visitor controls changes the currency: query, cookie or client headers", () => {
    expect(passesThrough(run("/servicios?currency=COP", "AR"))).toBe(true);
    expect(passesThrough(run("/servicios?country=CO", "AR"))).toBe(true);
    expect(passesThrough(run("/servicios", "AR", { headers: { cookie: "country=CO" } }))).toBe(
      true
    );
    expect(
      passesThrough(run("/servicios", "AR", { headers: { "x-country-override": "CO" } }))
    ).toBe(true);
    expect(
      passesThrough(run("/servicios", "AR", { headers: { "accept-language": "es-CO" } }))
    ).toBe(true);
  });

  test("the country override works outside production only", async () => {
    await withEnv({ VERCEL_ENV: "preview", [COUNTRY_OVERRIDE_ENV]: "CO" }, () => {
      expect(rewriteTarget(run("/servicios"))).toBe(`${ORIGIN}${COP_VARIANT_PREFIX}/servicios`);
      expect(rewriteTarget(run("/servicios", "AR"))).toBe(
        `${ORIGIN}${COP_VARIANT_PREFIX}/servicios`
      );
    });
    await withEnv({ VERCEL_ENV: undefined, [COUNTRY_OVERRIDE_ENV]: "CO" }, () => {
      expect(rewriteTarget(run("/en/quote"))).toBe(`${ORIGIN}${COP_VARIANT_PREFIX}/en/quote`);
    });
    await withEnv({ VERCEL_ENV: "production", [COUNTRY_OVERRIDE_ENV]: "CO" }, () => {
      expect(passesThrough(run("/servicios"))).toBe(true);
      expect(passesThrough(run("/servicios", "AR"))).toBe(true);
      expect(rewriteTarget(run("/servicios", "CO"))).toBe(
        `${ORIGIN}${COP_VARIANT_PREFIX}/servicios`
      );
    });
    await withEnv({ VERCEL_ENV: "preview", [COUNTRY_OVERRIDE_ENV]: "colombia" }, () => {
      expect(passesThrough(run("/servicios")), "malformed override is ignored").toBe(true);
    });
  });
});

test.describe("currency by location on the built pages", () => {
  for (const route of PRICED_ROUTES) {
    test(`${route} from Colombia shows no USD`, async ({ page }) => {
      await page.goto(pathFor(route, "CO"));
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      expect(await pageText(page)).not.toMatch(/\bUSD\b/);
    });

    for (const country of ["AR", "CL"]) {
      test(`${route} from ${country} shows no COP`, async ({ page }) => {
        await page.goto(pathFor(route, country));
        expect(await pageText(page)).not.toMatch(/\bCOP\b/);
      });
    }

    test(`${route} without a detected country shows no COP`, async ({ page }) => {
      await page.goto(pathFor(route));
      expect(await pageText(page)).not.toMatch(/\bCOP\b/);
    });

    test(`${route} serves the same JSON-LD to every visitor`, async ({ page }) => {
      await page.goto(pathFor(route));
      const forEveryoneElse = await jsonLd(page);
      await page.goto(pathFor(route, "CO"));
      expect(await jsonLd(page)).toEqual(forEveryoneElse);
    });

    test(`${route} offers no currency switch and never links to the internal variant`, async ({
      page,
    }) => {
      for (const path of [pathFor(route), pathFor(route, "CO")]) {
        await page.goto(path);
        await expect(page.locator(`a[href*="${COP_VARIANT_PREFIX}/"]`)).toHaveCount(0);
        // The quote form asks for the lead's country, but nothing lets the visitor pick the currency.
        await expect(page.locator('[data-currency-switch], [name="currency"]')).toHaveCount(0);
        await expect(page.locator('select[name="country"] option[value="COP"]')).toHaveCount(0);
      }
    });
  }

  test("the COP variant keeps the public canonical URL, language and alternates", async ({
    page,
  }) => {
    await page.goto("/cop/en/services/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.wavival.dev/en/services/"
    );
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
      "href",
      "https://www.wavival.dev/servicios/"
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      "https://www.wavival.dev/en/services/"
    );
  });

  test("the sitemap lists only public URLs", async ({ request }) => {
    const body = await (await request.get("/sitemap-0.xml")).text();
    expect(body).not.toContain(`${COP_VARIANT_PREFIX}/`);
    expect(body).toContain("<loc>https://www.wavival.dev/servicios/</loc>");
  });

  test("the services structured data carries both fixed price lists and says which one applies", async ({
    page,
  }) => {
    await page.goto("/servicios");
    const es = (await jsonLd(page)).join("\n");
    expect(es).toContain(
      '"priceRange":"COP 280.000 a COP 16.000.000 en Colombia; USD 90 a USD 5.500 fuera de Colombia"'
    );
    await page.goto("/en/services");
    const en = (await jsonLd(page)).join("\n");
    expect(en).toContain(
      '"priceRange":"USD 90 to USD 5,500 outside Colombia; COP 280,000 to COP 16,000,000 in Colombia"'
    );
  });

  for (const route of ["/", "/en", "/servicios", "/en/services", "/contacto", "/en/contact"]) {
    test(`${route} no longer publishes the old general price`, async ({ page }) => {
      await page.goto(route);
      const text = await pageText(page);
      expect(text).not.toContain("USD 250");
      expect(text).not.toMatch(/COP 1[.,]000[.,]000/);
      expect(text).not.toMatch(/Proyectos desde|Projects from/);
    });
  }
});
