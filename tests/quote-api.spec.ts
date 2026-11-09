import { test, expect } from "@playwright/test";
import quote from "../api/quote";

const SUPABASE_URL = "https://test-project.supabase.co";
const SERVICE_KEY = "test-service-role-key-never-logged";
const BREVO_KEY = "test-brevo-key-never-logged";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+573000000000",
  business: "Analytical Engines",
  description: "Necesito una landing page.",
  services: ["landing-page"],
  country: "CO",
  budgetRange: "entry",
  currency: "COP",
  locale: "es",
  consent: true,
  source: "/cotizar?service=landing-page",
};

// Each request gets its own source address unless a test pins one, so the in-memory rate limit
// of one test never leaks into another.
let sources = 0;
const nextSource = () => `203.0.113.${++sources % 250}-${Date.now()}-${sources}`;

const post = (
  body: unknown,
  headers: Record<string, string | null> = {},
  source = nextSource()
) => {
  const merged: Record<string, string> = {
    origin: "https://www.wavival.dev",
    "content-type": "application/json",
    "x-real-ip": source,
    "user-agent": "Mozilla/5.0 (test)",
  };
  for (const [key, value] of Object.entries(headers)) {
    if (value === null) delete merged[key];
    else merged[key] = value;
  }
  return quote.fetch(
    new Request("https://www.wavival.dev/api/quote", {
      method: "POST",
      headers: merged,
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );
};

/** `number` answers with that status, `"down"` throws, `"off"` leaves the variables unset. */
type Outcome = number | "down" | "off";

interface Call {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

interface Recorded {
  supabase: Call[];
  brevo: Call[];
  logs: string[];
}

const ENV_KEYS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "BREVO_API_KEY"] as const;

const withServices = async (
  outcomes: {
    supabase?: Outcome;
    brevo?: Outcome;
    lookup?: unknown[] | "down" | number | ((url: URL) => unknown[]);
  },
  run: (recorded: Recorded) => Promise<void>
) => {
  const supabase = outcomes.supabase ?? 201;
  const brevo = outcomes.brevo ?? 201;
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
  const recorded: Recorded = { supabase: [], brevo: [], logs: [] };

  if (supabase === "off") {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  } else {
    process.env.SUPABASE_URL = SUPABASE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
  }
  if (brevo === "off") delete process.env.BREVO_API_KEY;
  else process.env.BREVO_API_KEY = BREVO_KEY;

  console.error = (...args: unknown[]) => {
    recorded.logs.push(args.map(String).join(" "));
  };
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const call: Call = {
      url,
      method: init?.method ?? "GET",
      headers: Object.fromEntries(
        Object.entries((init?.headers as Record<string, string>) ?? {}).map(([k, v]) => [
          k.toLowerCase(),
          v,
        ])
      ),
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    };
    const isSupabase = new URL(url).origin === new URL(SUPABASE_URL).origin;
    const outcome = isSupabase ? supabase : brevo;
    (isSupabase ? recorded.supabase : recorded.brevo).push(call);
    if (isSupabase && call.method === "GET" && outcomes.lookup !== undefined) {
      if (outcomes.lookup === "down") throw new Error("network down");
      if (typeof outcomes.lookup === "number")
        return new Response("{}", { status: outcomes.lookup });
      const rows =
        typeof outcomes.lookup === "function" ? outcomes.lookup(new URL(url)) : outcomes.lookup;
      return new Response(JSON.stringify(rows), { status: 200 });
    }
    if (outcome === "down") throw new Error("network down");
    return new Response("{}", { status: typeof outcome === "number" ? outcome : 500 });
  }) as typeof fetch;

  try {
    await run(recorded);
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalError;
    for (const key of ENV_KEYS) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
  }
};

const htmlOf = (call: Call | undefined) =>
  String((call?.body as { htmlContent?: string } | undefined)?.htmlContent ?? "");

test.describe("quote api storage and notification", () => {
  test("stores a valid quote as a wavival lead and notifies by email", async () => {
    await withServices({}, async (recorded) => {
      const response = await post(valid, { "x-vercel-ip-country": "co" });
      expect(response.status).toBe(201);
      expect(await response.json()).toEqual({ ok: "true" });

      expect(recorded.supabase).toHaveLength(1);
      const insert = recorded.supabase[0];
      expect(insert.url).toBe(`${SUPABASE_URL}/rest/v1/leads`);
      expect(insert.method).toBe("POST");
      expect(insert.headers.apikey).toBe(SERVICE_KEY);
      expect(insert.headers.authorization).toBe(`Bearer ${SERVICE_KEY}`);
      expect(insert.headers.prefer).toBe("return=minimal");
      expect(insert.body).toMatchObject({
        product: "wavival",
        name: "Ada Lovelace",
        email: "ada@example.com",
        phone: "+573000000000",
        company: "Analytical Engines",
        message: "Necesito una landing page.",
        services: ["landing-page"],
        country: "CO",
        geo_country: "CO",
        budget_range: "entry",
        currency: "COP",
        how_found: null,
        preferred_channel: null,
        timeline: null,
        locale: "es",
        user_agent: "Mozilla/5.0 (test)",
        source: "/cotizar?service=landing-page",
      });
      const row = insert.body as Record<string, unknown>;
      expect(typeof row.consent_at).toBe("string");
      expect(new Date(String(row.consent_at)).getTime()).toBeGreaterThan(Date.now() - 60_000);
      expect(row).not.toHaveProperty("ip");
      expect(row).not.toHaveProperty("stage");

      expect(recorded.brevo).toHaveLength(1);
      const html = htmlOf(recorded.brevo[0]);
      expect(html).toContain("Landing page de conversión");
      expect(html).toContain("COP 1.600.000 a COP 3.000.000");
      expect(html).toContain("Guardado en base de datos");
      expect(html).toMatch(/Guardado en base de datos<\/td><td[^>]*>sí</);
    });
  });

  test("maps the ids of the previous form and reports every optional field", async () => {
    await withServices({}, async (recorded) => {
      const response = await post({
        ...valid,
        services: [
          "custom-web-applications",
          "ai-integrations",
          "security-appsec",
          "rest-apis-backend",
        ],
        country: "US",
        currency: "USD",
        budgetRange: "above-cap",
        locale: "en",
        howFound: "tiktok",
        preferredChannel: "whatsapp",
        timeline: "one-to-three-months",
        source: "/en/quote",
      });
      expect(response.status).toBe(201);
      expect(recorded.supabase[0].body).toMatchObject({
        services: [
          "custom-web-app-mvp",
          "ai-integration",
          "basic-security-review",
          "rest-apis-backend",
        ],
        how_found: "tiktok",
        preferred_channel: "whatsapp",
        timeline: "one-to-three-months",
        geo_country: null,
      });
      const html = htmlOf(recorded.brevo[0]);
      expect(html).toContain("Más de USD 12.000");
      expect(html).toContain("TikTok");
      expect(html).toContain("WhatsApp");
      expect(html).toContain("En 1 a 3 meses");
      expect(html).toContain("no detectado");
    });
  });

  test("rejects values outside the closed lists with 400", async () => {
    await withServices({}, async (recorded) => {
      const invalid: Record<string, unknown>[] = [
        { services: [] },
        { services: ["unknown-service"] },
        { services: ["landing-page", "unknown-service"] },
        { services: "landing-page" },
        { country: "XX" },
        { country: "Colombia" },
        { country: "" },
        { currency: "EUR" },
        { currency: "" },
        { budgetRange: "huge" },
        { budgetRange: "" },
        { locale: "fr" },
        { howFound: "facebook" },
        { preferredChannel: "phone" },
        { timeline: "tomorrow" },
        { consent: false },
        { consent: "true" },
        { consent: undefined },
        { source: "/contacto" },
        { source: "https://evil.example/cotizar" },
        { source: "" },
        { description: "" },
        { description: "palabra ".repeat(501) },
        { phone: "3000000000" },
        { email: "not-an-email" },
        { name: "" },
        { business: "" },
      ];
      for (const override of invalid) {
        const response = await post({ ...valid, ...override });
        expect(response.status, JSON.stringify(override)).toBe(400);
      }
      expect(recorded.supabase).toHaveLength(0);
      expect(recorded.brevo).toHaveLength(0);
    });
  });

  test("ignores the removed project types", async () => {
    await withServices({}, async () => {
      expect((await post({ ...valid, services: [], projectTypes: ["landing"] })).status).toBe(400);
    });
  });

  test("still notifies with 201 when Supabase fails, and says the lead was not stored", async () => {
    for (const outcome of [500, "down"] as const) {
      await withServices({ supabase: outcome }, async (recorded) => {
        const response = await post(valid);
        expect(response.status).toBe(201);
        expect(recorded.brevo).toHaveLength(1);
        expect(htmlOf(recorded.brevo[0])).toMatch(/Guardado en base de datos<\/td><td[^>]*>no</);
        expect(recorded.logs).toContain("quote: Supabase insert failed or timed out");
      });
    }
  });

  test("still notifies with 201 when the Supabase variables are missing", async () => {
    await withServices({ supabase: "off" }, async (recorded) => {
      expect((await post(valid)).status).toBe(201);
      expect(recorded.supabase).toHaveLength(0);
      expect(htmlOf(recorded.brevo[0])).toMatch(/Guardado en base de datos<\/td><td[^>]*>no</);
      expect(recorded.logs).toContain("quote: Supabase variables are not set, lead not stored");
    });
  });

  test("answers 201 when Brevo fails but the lead was stored", async () => {
    for (const outcome of [500, "down", "off"] as const) {
      await withServices({ brevo: outcome }, async (recorded) => {
        expect((await post(valid)).status).toBe(201);
        expect(recorded.supabase).toHaveLength(1);
      });
    }
  });

  test("answers 502 without details only when both channels fail", async () => {
    for (const [supabase, brevo] of [
      [500, 500],
      ["down", "down"],
      ["off", "off"],
      [500, "off"],
    ] as const) {
      await withServices({ supabase, brevo }, async () => {
        const response = await post(valid);
        expect(response.status, `${supabase}/${brevo}`).toBe(502);
        expect(await response.json()).toEqual({ error: "Service unavailable" });
      });
    }
  });

  test("never writes the service key or personal data to responses or logs", async () => {
    for (const outcomes of [
      {},
      { supabase: 500 },
      { supabase: "down" },
      { supabase: 500, brevo: 500 },
    ] as const) {
      await withServices(outcomes, async (recorded) => {
        const response = await post(valid);
        const body = await response.text();
        const everything = [body, ...recorded.logs].join("\n");
        expect(everything).not.toContain(SERVICE_KEY);
        expect(everything).not.toContain(BREVO_KEY);
        expect(everything).not.toContain("ada@example.com");
        expect(everything).not.toContain("Ada Lovelace");
        expect(everything).not.toContain("+573000000000");
      });
    }
  });
});

test.describe("quote api monthly SEO for development clients", () => {
  const seo = (email: string) => ({ ...valid, services: ["monthly-seo"], email });

  // A small leads table and a PostgREST stand-in that applies the same filters as Supabase.
  const LEADS = [
    {
      id: 1,
      product: "wavival",
      status: "won",
      email: "client@example.com",
      services: ["landing-page"],
    },
    {
      id: 2,
      product: "wavival",
      status: "proposal",
      email: "pending@example.com",
      services: ["business-website"],
    },
    {
      id: 3,
      product: "wavival",
      status: "won",
      email: "seo-only@example.com",
      services: ["monthly-seo"],
    },
    {
      id: 4,
      product: "okroot",
      status: "won",
      email: "other@example.com",
      services: ["landing-page"],
    },
  ];
  const postgrest = (url: URL) => {
    const value = (key: string) => (url.searchParams.get(key) ?? "").replace(/^[a-z]+\./, "");
    const wanted = value("services").replace(/[{}]/g, "").split(",");
    return LEADS.filter(
      (lead) =>
        lead.product === value("product") &&
        lead.status === value("status") &&
        lead.email === value("email") &&
        lead.services.some((service) => wanted.includes(service))
    ).map(({ id }) => ({ id }));
  };

  const refuse = async (email: string) => {
    let result = { status: 0, body: "", ms: 0, stored: false, emailed: false };
    await withServices({ lookup: postgrest }, async (recorded) => {
      const started = Date.now();
      const response = await post(seo(email));
      result = {
        status: response.status,
        body: await response.text(),
        ms: Date.now() - started,
        stored: recorded.supabase.some((call) => call.method === "POST"),
        emailed: recorded.brevo.length > 0,
      };
    });
    return result;
  };

  test("accepts monthly SEO from a won lead with a development service", async () => {
    await withServices({ lookup: postgrest }, async (recorded) => {
      const response = await post(seo("Client@Example.com"));
      expect(response.status).toBe(201);
      const lookup = recorded.supabase.find((call) => call.method === "GET");
      const params = new URL(lookup!.url).searchParams;
      expect(params.get("product")).toBe("eq.wavival");
      expect(params.get("status")).toBe("eq.won");
      expect(params.get("email")).toBe("eq.client@example.com");
      const services = params.get("services") ?? "";
      for (const id of [
        "landing-page",
        "custom-web-app-mvp",
        "rest-apis-backend",
        "time-saver-kit",
      ]) {
        expect(services).toContain(id);
      }
      expect(services).not.toContain("monthly-seo");
      expect(recorded.brevo).toHaveLength(1);
    });
  });

  test("every refusal is identical: unknown email, lead not won, no development service", async () => {
    const cases = [
      await refuse("nobody@example.com"),
      await refuse("pending@example.com"),
      await refuse("seo-only@example.com"),
      await refuse("other@example.com"),
    ];
    const [reference] = cases;
    expect(reference.status).toBe(422);
    expect(JSON.parse(reference.body)).toEqual({ error: "Development clients only" });
    for (const result of cases) {
      expect(result.status).toBe(reference.status);
      expect(result.body).toBe(reference.body);
      expect(result.stored).toBe(false);
      expect(result.emailed).toBe(false);
      // Every refusal waits for the same floor, so its timing does not depend on the email.
      expect(result.ms).toBeGreaterThanOrEqual(1200);
    }
    const times = cases.map((result) => result.ms);
    expect(Math.max(...times) - Math.min(...times)).toBeLessThan(150);
  });

  test("a failed lookup or a missing database refuses the same way", async () => {
    for (const lookup of ["down", 500] as const) {
      await withServices({ lookup }, async (recorded) => {
        const response = await post(seo("client@example.com"));
        expect(response.status).toBe(422);
        expect(await response.json()).toEqual({ error: "Development clients only" });
        expect(recorded.logs).toContain("quote: development client lookup failed or timed out");
      });
    }
    await withServices({ supabase: "off" }, async (recorded) => {
      const response = await post(seo("client@example.com"));
      expect(response.status).toBe(422);
      expect(await response.json()).toEqual({ error: "Development clients only" });
      expect(recorded.logs).toContain(
        "quote: Supabase variables are not set, development client not verified"
      );
    });
  });

  test("does not look anyone up when monthly SEO is not requested", async () => {
    await withServices({ lookup: [] }, async (recorded) => {
      expect((await post(valid)).status).toBe(201);
      expect(recorded.supabase.some((call) => call.method === "GET")).toBe(false);
    });
  });
});

test.describe("quote api request checks", () => {
  test("accepts the site origins and rejects any other origin", async () => {
    await withServices({}, async () => {
      for (const origin of [
        "https://www.wavival.dev",
        "https://wavival.dev",
        "http://localhost:4329",
      ]) {
        expect((await post(valid, { origin })).status, origin).toBe(201);
      }
      for (const origin of [
        "https://evil.example",
        "https://wavival.dev.evil.example",
        "http://www.wavival.dev",
        "not a url",
      ]) {
        expect((await post(valid, { origin })).status, origin).toBe(403);
      }
      expect((await post(valid, { origin: null })).status).toBe(403);
    });
  });

  test("accepts the Vercel deployment host of the running preview", async () => {
    const original = process.env.VERCEL_BRANCH_URL;
    process.env.VERCEL_BRANCH_URL = "wavival-dev-git-feature-x.vercel.app";
    try {
      await withServices({}, async () => {
        const origin = "https://wavival-dev-git-feature-x.vercel.app";
        expect((await post(valid, { origin })).status).toBe(201);
        expect((await post(valid, { origin: "https://other.vercel.app" })).status).toBe(403);
      });
    } finally {
      if (original === undefined) delete process.env.VERCEL_BRANCH_URL;
      else process.env.VERCEL_BRANCH_URL = original;
    }
  });

  test("accepts the extra hosts listed in QUOTE_ALLOWED_HOSTS", async () => {
    const original = process.env.QUOTE_ALLOWED_HOSTS;
    process.env.QUOTE_ALLOWED_HOSTS = " stg.example.dev , other.example.dev";
    try {
      await withServices({}, async () => {
        expect((await post(valid, { origin: "https://stg.example.dev" })).status).toBe(201);
        expect((await post(valid, { origin: "https://other.example.dev" })).status).toBe(201);
        expect((await post(valid, { origin: "https://third.example.dev" })).status).toBe(403);
      });
    } finally {
      if (original === undefined) delete process.env.QUOTE_ALLOWED_HOSTS;
      else process.env.QUOTE_ALLOWED_HOSTS = original;
    }
  });

  test("requires a JSON content type", async () => {
    expect((await post(valid, { "content-type": "text/plain" })).status).toBe(415);
    expect((await post(valid, { "content-type": null })).status).toBe(415);
  });

  test("rejects an oversized or malformed body", async () => {
    expect((await post({ ...valid, description: "palabra ".repeat(4000) })).status).toBe(413);
    expect((await post("{not json")).status).toBe(400);
  });

  test("limits repeated requests from one source and reports when to retry", async () => {
    await withServices({}, async () => {
      const source = nextSource();
      for (let i = 0; i < 5; i += 1) {
        expect((await post(valid, {}, source)).status).toBe(201);
      }
      const blocked = await post(valid, {}, source);
      expect(blocked.status).toBe(429);
      expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
      expect(blocked.headers.get("cache-control")).toBe("no-store");
      expect((await post(valid, {}, nextSource())).status).toBe(201);
    });
  });

  test("keeps rejecting non-POST methods and the honeypot stays silent", async () => {
    const get = await quote.fetch(new Request("https://www.wavival.dev/api/quote"));
    expect(get.status).toBe(405);
    await withServices({}, async (recorded) => {
      expect((await post({ ...valid, website: "https://spam.example" })).status).toBe(201);
      expect(recorded.supabase).toHaveLength(0);
      expect(recorded.brevo).toHaveLength(0);
    });
  });
});
