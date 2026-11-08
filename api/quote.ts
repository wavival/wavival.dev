import { isCountryCode } from "../src/data/countries";
import { BUDGET_RANGES, budgetRangeLabel, type BudgetRangeId } from "../src/data/pricing";
import {
  HOW_FOUND_IDS,
  PREFERRED_CHANNEL_IDS,
  TIMELINE_IDS,
  howFoundLabel,
  isQuoteSource,
  normalizeQuoteService,
  preferredChannelLabel,
  quoteServiceLabel,
  timelineLabel,
  type HowFoundId,
  type PreferredChannelId,
  type QuoteServiceId,
  type TimelineId,
} from "../src/data/quoteOptions";
import { LEADS_TABLE, insertRow, supabaseConfig } from "../src/server/supabase";
import { CURRENCIES, resolveCountry, type Currency } from "../src/utils/currency";

const RECIPIENT = "wavival.dev@luminaw.co";
const SENDER = { name: "Wavival", email: RECIPIENT };
const PRODUCT = "wavival";

// Browser requests must come from the site itself. Vercel preview hosts are read from the
// platform variables, so a preview deployment accepts its own form and nothing else.
// QUOTE_ALLOWED_HOSTS (comma-separated hosts) covers any other domain, such as a staging one.
const SITE_HOSTS = ["wavival.dev", "www.wavival.dev"];
const LOCAL_HOSTS = ["localhost", "127.0.0.1"];
const MAX_BODY_BYTES = 20_000;
const MAX_USER_AGENT = 512;
const MAX_SOURCE = 200;
const BREVO_TIMEOUT_MS = 10_000;

// Best-effort limit per server instance: it slows a single source down, it does not replace
// a firewall rule (see docs/security.md). Memory stays bounded by pruning expired entries.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000, maxEntries: 1000 };
const attempts = new Map<string, number[]>();

const LOCALES = ["es", "en"] as const;
type Locale = (typeof LOCALES)[number];

interface QuotePayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  business?: unknown;
  description?: unknown;
  services?: unknown;
  country?: unknown;
  budgetRange?: unknown;
  currency?: unknown;
  locale?: unknown;
  howFound?: unknown;
  preferredChannel?: unknown;
  timeline?: unknown;
  consent?: unknown;
  source?: unknown;
  website?: unknown;
}

interface Quote {
  name: string;
  email: string;
  phone: string;
  business: string;
  description: string;
  services: QuoteServiceId[];
  country: string;
  geoCountry: string | null;
  budgetRange: BudgetRangeId;
  currency: Currency;
  locale: Locale;
  howFound: HowFoundId | null;
  preferredChannel: PreferredChannelId | null;
  timeline: TimelineId | null;
  source: string;
  userAgent: string | null;
  consentAt: string;
}

const json = (body: Record<string, string>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const text = (value: unknown, limit: number) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";

const oneOf = <T extends string>(value: unknown, list: readonly T[]): T | null =>
  typeof value === "string" && (list as readonly string[]).includes(value) ? (value as T) : null;

/** An optional closed-list field: absent or empty is fine, anything else must be in the list. */
const optionalOneOf = <T extends string>(
  value: unknown,
  list: readonly T[]
): T | null | undefined => {
  if (value === undefined || value === null || value === "") return null;
  return oneOf(value, list) ?? undefined;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });

// The owner reads the notification in Spanish (docs/i18n.md).
const quoteEmail = (quote: Quote, saved: boolean) => {
  const detailRows: [string, string][] = [
    ["Nombre", quote.name],
    ["Correo", quote.email],
    ["Teléfono", quote.phone],
    ["Negocio", quote.business],
    ["Servicios", quote.services.map((id) => quoteServiceLabel(id, "es")).join(", ")],
    ["País", quote.country],
    ["País detectado", quote.geoCountry ?? "no detectado"],
    ["Moneda", quote.currency],
    ["Presupuesto", budgetRangeLabel(quote.budgetRange, quote.currency, "es")],
    ["Cómo me conoció", quote.howFound ? howFoundLabel(quote.howFound, "es") : ""],
    [
      "Canal preferido",
      quote.preferredChannel ? preferredChannelLabel(quote.preferredChannel, "es") : "",
    ],
    ["Para cuándo", quote.timeline ? timelineLabel(quote.timeline, "es") : ""],
    ["Idioma", quote.locale],
    ["Origen", quote.source],
    ["Consentimiento", quote.consentAt],
    ["Guardado en base de datos", saved ? "sí" : "no"],
  ];
  const rows = detailRows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:12px 16px;border-bottom:1px solid #d1d5db;color:#4b5563;font:600 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;vertical-align:top">${label}</td><td style="padding:12px 16px;border-bottom:1px solid #d1d5db;color:#111827;font:15px Arial,sans-serif">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return `<!doctype html><html lang="es"><body style="margin:0;background:#f3f4f6;color:#111827"><main style="max-width:640px;margin:32px auto;background:#ffffff;border:1px solid #d1d5db"><header style="padding:28px 32px;border-bottom:4px solid #407bff"><span style="color:#1565c0;font:800 28px Arial,sans-serif;letter-spacing:-.08em">W</span><p style="margin:16px 0 0;color:#4b5563;font:600 12px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase">Nueva cotización</p><h1 style="margin:8px 0 0;font:800 30px Arial,sans-serif;letter-spacing:-.03em">${escapeHtml(quote.name)}</h1></header><section style="padding:24px 32px"><table style="width:100%;border-collapse:collapse">${rows}</table><h2 style="margin:32px 0 12px;font:800 18px Arial,sans-serif">Proyecto</h2><p style="margin:0;color:#374151;font:15px/1.7 Arial,sans-serif;white-space:pre-wrap">${escapeHtml(quote.description)}</p></section><footer style="padding:20px 32px;background:#f9fafb;border-top:1px solid #d1d5db;color:#6b7280;font:12px Arial,sans-serif">Enviado desde wavival.dev</footer></main></body></html>`;
};

const allowedHosts = () => [
  ...SITE_HOSTS,
  ...[process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL].filter((host): host is string =>
    Boolean(host)
  ),
  ...(process.env.QUOTE_ALLOWED_HOSTS?.split(",").map((host) => host.trim()) ?? []).filter(Boolean),
];

const isAllowedOrigin = (origin: string | null) => {
  if (!origin) return false;
  try {
    const { protocol, hostname, host } = new URL(origin);
    if (protocol === "http:") return LOCAL_HOSTS.includes(hostname);
    return protocol === "https:" && allowedHosts().includes(host);
  } catch {
    return false;
  }
};

const clientKey = (request: Request) =>
  request.headers.get("x-real-ip") ??
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  "unknown";

/** Records an attempt and returns the seconds to wait when the source is over the limit. */
const retryAfter = (key: string, now = Date.now()) => {
  const recent = (attempts.get(key) ?? []).filter((at) => now - at < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    attempts.set(key, recent);
    return Math.ceil((recent[0] + RATE_LIMIT.windowMs - now) / 1000);
  }
  recent.push(now);
  attempts.set(key, recent);
  if (attempts.size > RATE_LIMIT.maxEntries) {
    for (const [other, times] of attempts) {
      if (times.every((at) => now - at >= RATE_LIMIT.windowMs)) attempts.delete(other);
    }
  }
  return 0;
};

/** Builds the validated quote, or `null` when any field is missing or outside its list. */
const parseQuote = (payload: QuotePayload, request: Request): Quote | null => {
  const name = text(payload.name, 120);
  const email = text(payload.email, 254).toLowerCase();
  const phone = text(payload.phone, 24).replace(/[\s()-]/g, "");
  const business = text(payload.business, 160);
  const description = text(payload.description, 5000);
  const words = description ? description.split(/\s+/).length : 0;

  const rawServices = Array.isArray(payload.services) ? payload.services : [];
  const services = [
    ...new Set(
      rawServices.map((service) =>
        typeof service === "string" ? normalizeQuoteService(service) : null
      )
    ),
  ];
  if (services.length === 0 || services.some((service) => service === null)) return null;

  const countryInput = text(payload.country, 10);
  const country = /^[A-Za-z]{2}$/.test(countryInput) ? countryInput.toUpperCase() : "";
  const currency = oneOf(payload.currency, CURRENCIES);
  const budgetRange = oneOf(
    payload.budgetRange,
    BUDGET_RANGES.map((range) => range.id)
  );
  const range = BUDGET_RANGES.find((item) => item.id === budgetRange);
  const locale = oneOf(payload.locale, LOCALES);
  const howFound = optionalOneOf(payload.howFound, HOW_FOUND_IDS);
  const preferredChannel = optionalOneOf(payload.preferredChannel, PREFERRED_CHANNEL_IDS);
  const timeline = optionalOneOf(payload.timeline, TIMELINE_IDS);
  const source = text(payload.source, MAX_SOURCE);

  if (
    !name ||
    !business ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    !/^\+[1-9]\d{7,14}$/.test(phone) ||
    words === 0 ||
    words > 500 ||
    !isCountryCode(country) ||
    !currency ||
    !budgetRange ||
    !range ||
    (range.bounds && !range.bounds[currency]) ||
    !locale ||
    howFound === undefined ||
    preferredChannel === undefined ||
    timeline === undefined ||
    payload.consent !== true ||
    !isQuoteSource(source)
  ) {
    return null;
  }

  const userAgent = text(request.headers.get("user-agent"), MAX_USER_AGENT);
  return {
    name,
    email,
    phone,
    business,
    description,
    services: services as QuoteServiceId[],
    country,
    geoCountry: resolveCountry(request.headers, process.env),
    budgetRange,
    currency,
    locale,
    howFound,
    preferredChannel,
    timeline,
    source,
    userAgent: userAgent || null,
    consentAt: new Date().toISOString(),
  };
};

/** Stores the lead. Resolves to false, with a fixed log line, when Supabase is not reachable. */
const saveQuote = async (quote: Quote): Promise<boolean> => {
  const config = supabaseConfig(process.env);
  if (!config) {
    console.error("quote: Supabase variables are not set, lead not stored");
    return false;
  }
  const saved = await insertRow(config, LEADS_TABLE, {
    product: PRODUCT,
    name: quote.name,
    email: quote.email,
    phone: quote.phone,
    company: quote.business,
    message: quote.description,
    services: quote.services,
    country: quote.country,
    geo_country: quote.geoCountry,
    budget_range: quote.budgetRange,
    currency: quote.currency,
    how_found: quote.howFound,
    preferred_channel: quote.preferredChannel,
    timeline: quote.timeline,
    locale: quote.locale,
    user_agent: quote.userAgent,
    source: quote.source,
    consent_at: quote.consentAt,
  });
  if (!saved) console.error("quote: Supabase insert failed or timed out");
  return saved;
};

/** Notifies the owner. Resolves to false, with a fixed log line, when Brevo does not accept it. */
const emailQuote = async (quote: Quote, saved: boolean): Promise<boolean> => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("quote: BREVO_API_KEY is not set");
    return false;
  }
  let response: Response;
  try {
    response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      signal: AbortSignal.timeout(BREVO_TIMEOUT_MS),
      body: JSON.stringify({
        sender: SENDER,
        replyTo: { email: quote.email, name: quote.name },
        to: [{ email: RECIPIENT, name: "Valentina Ramírez" }],
        subject: `Nueva cotización: ${quote.name}`,
        htmlContent: quoteEmail(quote, saved),
        tags: ["quote"],
      }),
    });
  } catch {
    console.error("quote: Brevo request failed or timed out");
    return false;
  }
  if (!response.ok) {
    // Status only: the request holds personal data and the response may echo it.
    console.error(`quote: Brevo responded ${response.status}`);
    return false;
  }
  return true;
};

async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!isAllowedOrigin(request.headers.get("origin"))) return json({ error: "Forbidden" }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "Unsupported media type" }, 415);
  }

  const wait = retryAfter(clientKey(request));
  if (wait > 0) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Retry-After": String(wait),
      },
    });
  }

  let payload: QuotePayload;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ error: "Payload too large" }, 413);
    payload = JSON.parse(raw) as QuotePayload;
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  if (text(payload.website, 200)) return json({ ok: "true" }, 201);

  const quote = parseQuote(payload, request);
  if (!quote) return json({ error: "Invalid request" }, 400);

  // The database first, so the email can say whether the lead was stored.
  const saved = await saveQuote(quote);
  const emailed = await emailQuote(quote, saved);
  if (!saved && !emailed) return json({ error: "Service unavailable" }, 502);
  return json({ ok: "true" }, 201);
}

export default { fetch: handler };
