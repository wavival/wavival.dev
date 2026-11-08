// Vercel Cron target (`crons` in vercel.json, every three days). Supabase pauses
// a Free project after a week without requests, so this reads one row of the
// leads table and returns nothing from it. Vercel sends the cron request with
// `Authorization: Bearer <CRON_SECRET>`; any other caller gets 401.

import { LEADS_TABLE, pingTable, supabaseConfig } from "../src/server/supabase";

const json = (body: Record<string, string>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const isAuthorized = (request: Request) => {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
};

async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);
  if (!isAuthorized(request)) return json({ error: "Unauthorized" }, 401);

  const config = supabaseConfig(process.env);
  if (!config) {
    console.error("keepalive: Supabase variables are not set");
    return json({ error: "Database unavailable" }, 500);
  }
  if (!(await pingTable(config, LEADS_TABLE))) {
    console.error("keepalive: Supabase request failed or timed out");
    return json({ error: "Database unavailable" }, 502);
  }
  return json({ ok: "true" }, 200);
}

export default { fetch: handler };
