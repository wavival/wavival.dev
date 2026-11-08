import { test, expect } from "@playwright/test";
import keepalive from "../api/keepalive";

const SUPABASE_URL = "https://test-project.supabase.co";
const SERVICE_KEY = "test-service-role-key-never-logged";
const CRON_SECRET = "test-cron-secret-0123456789";

interface Call {
  url: string;
  method: string;
  headers: Record<string, string>;
}

const ENV_KEYS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "CRON_SECRET"] as const;

const withSupabase = async (
  outcome: number | "down" | "off",
  run: (calls: Call[], logs: string[]) => Promise<void>,
  secret: string | undefined = CRON_SECRET
) => {
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
  const calls: Call[] = [];
  const logs: string[] = [];

  if (outcome === "off") {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  } else {
    process.env.SUPABASE_URL = SUPABASE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
  }
  if (secret === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = secret;

  console.error = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({
      url: String(input),
      method: init?.method ?? "GET",
      headers: Object.fromEntries(
        Object.entries((init?.headers as Record<string, string>) ?? {}).map(([k, v]) => [
          k.toLowerCase(),
          v,
        ])
      ),
    });
    if (outcome === "down") throw new Error("network down");
    return new Response('[{"id":"should-not-be-returned"}]', {
      status: typeof outcome === "number" ? outcome : 500,
    });
  }) as typeof fetch;

  try {
    await run(calls, logs);
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalError;
    for (const key of ENV_KEYS) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
  }
};

const get = (headers: Record<string, string> = {}, method = "GET") =>
  keepalive.fetch(new Request("https://www.wavival.dev/api/keepalive", { method, headers }));

test.describe("keepalive api", () => {
  test("rejects requests without the cron secret", async () => {
    await withSupabase(200, async (calls) => {
      expect((await get()).status).toBe(401);
      expect((await get({ authorization: "Bearer wrong" })).status).toBe(401);
      expect((await get({ authorization: CRON_SECRET })).status).toBe(401);
      expect(calls).toHaveLength(0);
    });
  });

  test("rejects every request when no secret is configured", async () => {
    await withSupabase(
      200,
      async (calls) => {
        expect((await get({ authorization: "Bearer " })).status).toBe(401);
        expect(calls).toHaveLength(0);
      },
      undefined
    );
  });

  test("touches the leads table with the secret and returns no data", async () => {
    await withSupabase(200, async (calls) => {
      const response = await get({ authorization: `Bearer ${CRON_SECRET}` });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: "true" });
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(calls).toHaveLength(1);
      expect(calls[0].method).toBe("HEAD");
      expect(calls[0].url).toBe(`${SUPABASE_URL}/rest/v1/leads?select=id&limit=1`);
      expect(calls[0].headers.authorization).toBe(`Bearer ${SERVICE_KEY}`);
    });
  });

  test("only answers GET", async () => {
    await withSupabase(200, async (calls) => {
      expect((await get({ authorization: `Bearer ${CRON_SECRET}` }, "POST")).status).toBe(405);
      expect(calls).toHaveLength(0);
    });
  });

  test("reports a failing or unconfigured database without leaking the key", async () => {
    for (const outcome of [500, "down"] as const) {
      await withSupabase(outcome, async (calls, logs) => {
        const response = await get({ authorization: `Bearer ${CRON_SECRET}` });
        expect(response.status).toBe(502);
        expect(calls).toHaveLength(1);
        expect(logs).toEqual(["keepalive: Supabase request failed or timed out"]);
        expect(await response.text()).not.toContain(SERVICE_KEY);
      });
    }
    await withSupabase("off", async (calls, logs) => {
      const response = await get({ authorization: `Bearer ${CRON_SECRET}` });
      expect(response.status).toBe(500);
      expect(calls).toHaveLength(0);
      expect(logs).toEqual(["keepalive: Supabase variables are not set"]);
    });
  });
});
