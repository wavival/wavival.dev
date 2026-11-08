// Minimal PostgREST client for the Vercel Functions (`api/quote.ts` and
// `api/keepalive.ts`). It reads the server-only variables, never logs them and
// adds no dependency. The service key bypasses RLS, so this module must never
// be imported by browser code.

export const LEADS_TABLE = "leads";
export const SUPABASE_TIMEOUT_MS = 10_000;

export interface SupabaseConfig {
  url: string;
  key: string;
}

/** `null` when either variable is missing, so callers degrade instead of throwing. */
export const supabaseConfig = (env: Record<string, string | undefined>): SupabaseConfig | null => {
  const url = env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url, key } : null;
};

const headers = (config: SupabaseConfig, extra: Record<string, string> = {}) => ({
  apikey: config.key,
  authorization: `Bearer ${config.key}`,
  ...extra,
});

/** Inserts one row; resolves to `true` when PostgREST accepted it. Never throws. */
export async function insertRow(
  config: SupabaseConfig,
  table: string,
  row: Record<string, unknown>
): Promise<boolean> {
  try {
    const response = await fetch(`${config.url}/rest/v1/${table}`, {
      method: "POST",
      headers: headers(config, {
        "content-type": "application/json",
        prefer: "return=minimal",
      }),
      signal: AbortSignal.timeout(SUPABASE_TIMEOUT_MS),
      body: JSON.stringify(row),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/** Touches the table with a one-row, one-column select and discards the body. Never throws. */
export async function pingTable(config: SupabaseConfig, table: string): Promise<boolean> {
  try {
    const response = await fetch(`${config.url}/rest/v1/${table}?select=id&limit=1`, {
      method: "HEAD",
      headers: headers(config),
      signal: AbortSignal.timeout(SUPABASE_TIMEOUT_MS),
    });
    return response.ok;
  } catch {
    return false;
  }
}
