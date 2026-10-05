import { test, expect } from "@playwright/test";
import quote from "../api/quote";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+573000000000",
  business: "Analytical Engines",
  description: "Necesito una landing page.",
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

const withBrevo = async (status: number, run: () => Promise<void>) => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.BREVO_API_KEY;
  process.env.BREVO_API_KEY = "test-key";
  globalThis.fetch = (async () => new Response("{}", { status })) as typeof fetch;
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.BREVO_API_KEY;
    else process.env.BREVO_API_KEY = originalKey;
  }
};

test.describe("quote api validation", () => {
  test("rejects a quote without services or project types", async () => {
    expect((await post(valid)).status).toBe(400);
    expect((await post({ ...valid, projectTypes: ["unknown"] })).status).toBe(400);
  });

  test("accepts project types and reports them in the email", async () => {
    const originalFetch = globalThis.fetch;
    const originalKey = process.env.BREVO_API_KEY;
    let html = "";
    process.env.BREVO_API_KEY = "test-key";
    globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
      html = JSON.parse(String(init?.body)).htmlContent;
      return new Response("{}", { status: 201 });
    }) as typeof fetch;
    try {
      const response = await post({ ...valid, projectTypes: ["landing", "design"] });
      expect(response.status).toBe(201);
      expect(html).toContain("Tipo de proyecto");
      expect(html).toContain("Landing page o sitio web, Diseño de interfaz y prototipo");
      expect(html).not.toContain("Servicios");
    } finally {
      globalThis.fetch = originalFetch;
      if (originalKey === undefined) delete process.env.BREVO_API_KEY;
      else process.env.BREVO_API_KEY = originalKey;
    }
  });
});

test.describe("quote api request checks", () => {
  const complete = { ...valid, services: ["custom-web-applications"] };

  test("accepts the site origins and rejects any other origin", async () => {
    await withBrevo(201, async () => {
      for (const origin of [
        "https://www.wavival.dev",
        "https://wavival.dev",
        "http://localhost:4329",
      ]) {
        expect((await post(complete, { origin })).status, origin).toBe(201);
      }
      for (const origin of [
        "https://evil.example",
        "https://wavival.dev.evil.example",
        "http://www.wavival.dev",
        "not a url",
      ]) {
        expect((await post(complete, { origin })).status, origin).toBe(403);
      }
      expect((await post(complete, { origin: null })).status).toBe(403);
    });
  });

  test("accepts the Vercel deployment host of the running preview", async () => {
    const original = process.env.VERCEL_BRANCH_URL;
    process.env.VERCEL_BRANCH_URL = "wavival-dev-git-feature-x.vercel.app";
    try {
      await withBrevo(201, async () => {
        const origin = "https://wavival-dev-git-feature-x.vercel.app";
        expect((await post(complete, { origin })).status).toBe(201);
        expect((await post(complete, { origin: "https://other.vercel.app" })).status).toBe(403);
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
      await withBrevo(201, async () => {
        expect((await post(complete, { origin: "https://stg.example.dev" })).status).toBe(201);
        expect((await post(complete, { origin: "https://other.example.dev" })).status).toBe(201);
        expect((await post(complete, { origin: "https://third.example.dev" })).status).toBe(403);
      });
    } finally {
      if (original === undefined) delete process.env.QUOTE_ALLOWED_HOSTS;
      else process.env.QUOTE_ALLOWED_HOSTS = original;
    }
  });

  test("requires a JSON content type", async () => {
    expect((await post(complete, { "content-type": "text/plain" })).status).toBe(415);
    expect((await post(complete, { "content-type": null })).status).toBe(415);
  });

  test("rejects an oversized or malformed body", async () => {
    expect((await post({ ...complete, description: "palabra ".repeat(4000) })).status).toBe(413);
    expect((await post("{not json")).status).toBe(400);
  });

  test("limits repeated requests from one source and reports when to retry", async () => {
    await withBrevo(201, async () => {
      const source = nextSource();
      for (let i = 0; i < 5; i += 1) {
        expect((await post(complete, {}, source)).status).toBe(201);
      }
      const blocked = await post(complete, {}, source);
      expect(blocked.status).toBe(429);
      expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
      expect(blocked.headers.get("cache-control")).toBe("no-store");
      expect((await post(complete, {}, nextSource())).status).toBe(201);
    });
  });

  test("answers 502 without leaking details when Brevo fails or is unreachable", async () => {
    await withBrevo(500, async () => {
      const response = await post(complete);
      expect(response.status).toBe(502);
      expect(await response.json()).toEqual({ error: "Email service unavailable" });
    });
    const originalFetch = globalThis.fetch;
    const originalKey = process.env.BREVO_API_KEY;
    process.env.BREVO_API_KEY = "test-key";
    globalThis.fetch = (async () => {
      throw new Error("network down");
    }) as typeof fetch;
    try {
      expect((await post(complete)).status).toBe(502);
    } finally {
      globalThis.fetch = originalFetch;
      if (originalKey === undefined) delete process.env.BREVO_API_KEY;
      else process.env.BREVO_API_KEY = originalKey;
    }
  });

  test("keeps rejecting non-POST methods and the honeypot stays silent", async () => {
    const get = await quote.fetch(new Request("https://www.wavival.dev/api/quote"));
    expect(get.status).toBe(405);
    expect((await post({ ...complete, website: "https://spam.example" })).status).toBe(201);
  });
});
