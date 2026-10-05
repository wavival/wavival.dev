const RECIPIENT = "wavival.dev@luminaw.co";
const SENDER = { name: "Wavival", email: RECIPIENT };

// Browser requests must come from the site itself. Vercel preview hosts are read from the
// platform variables, so a preview deployment accepts its own form and nothing else.
// QUOTE_ALLOWED_HOSTS (comma-separated hosts) covers any other domain, such as a staging one.
const SITE_HOSTS = ["wavival.dev", "www.wavival.dev"];
const LOCAL_HOSTS = ["localhost", "127.0.0.1"];
const MAX_BODY_BYTES = 20_000;
const BREVO_TIMEOUT_MS = 10_000;

// Best-effort limit per server instance: it slows a single source down, it does not replace
// a firewall rule (see docs/security.md). Memory stays bounded by pruning expired entries.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000, maxEntries: 1000 };
const attempts = new Map<string, number[]>();

const SERVICE_LABELS: Record<string, string> = {
  "custom-web-applications": "Aplicaciones web a medida",
  "rest-apis-backend": "APIs REST y backend",
  "security-appsec": "Seguridad y AppSec",
  "ai-integrations": "Integraciones de IA",
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  "web-app": "Aplicación web o PWA",
  landing: "Landing page o sitio web",
  "api-backend": "API y backend",
  design: "Diseño de interfaz y prototipo",
  security: "Seguridad y AppSec",
  ai: "Producto con IA",
};

interface QuotePayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  business?: unknown;
  description?: unknown;
  services?: unknown;
  projectTypes?: unknown;
  website?: unknown;
}

const json = (body: Record<string, string>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const text = (value: unknown, limit: number) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";

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

const quoteEmail = (quote: {
  name: string;
  email: string;
  phone: string;
  business: string;
  description: string;
  services: string[];
  projectTypes: string[];
}) => {
  const detailRows = [
    ["Nombre", quote.name],
    ["Correo", quote.email],
    ["Teléfono", quote.phone],
    ["Empresa", quote.business],
    ["Servicios", quote.services.join(", ")],
    ["Tipo de proyecto", quote.projectTypes.join(", ")],
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:12px 16px;border-bottom:1px solid #d1d5db;color:#4b5563;font:600 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;vertical-align:top">${label}</td><td style="padding:12px 16px;border-bottom:1px solid #d1d5db;color:#111827;font:15px Arial,sans-serif">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return `<!doctype html><html lang="es"><body style="margin:0;background:#f3f4f6;color:#111827"><main style="max-width:640px;margin:32px auto;background:#ffffff;border:1px solid #d1d5db"><header style="padding:28px 32px;border-bottom:4px solid #407bff"><span style="color:#1565c0;font:800 28px Arial,sans-serif;letter-spacing:-.08em">W</span><p style="margin:16px 0 0;color:#4b5563;font:600 12px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase">Nueva cotización</p><h1 style="margin:8px 0 0;font:800 30px Arial,sans-serif;letter-spacing:-.03em">${escapeHtml(quote.name)}</h1></header><section style="padding:24px 32px"><table style="width:100%;border-collapse:collapse">${detailRows}</table><h2 style="margin:32px 0 12px;font:800 18px Arial,sans-serif">Proyecto</h2><p style="margin:0;color:#374151;font:15px/1.7 Arial,sans-serif;white-space:pre-wrap">${escapeHtml(quote.description)}</p></section><footer style="padding:20px 32px;background:#f9fafb;border-top:1px solid #d1d5db;color:#6b7280;font:12px Arial,sans-serif">Enviado desde wavival.dev</footer></main></body></html>`;
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

  const name = text(payload.name, 120);
  const email = text(payload.email, 254).toLowerCase();
  const phone = text(payload.phone, 24).replace(/[\s()-]/g, "");
  const business = text(payload.business, 160);
  const description = text(payload.description, 5000);
  const services = Array.isArray(payload.services)
    ? payload.services.filter((service): service is string => typeof service === "string")
    : [];
  const selectedServices = [...new Set(services)].filter((service) => service in SERVICE_LABELS);
  const projectTypes = Array.isArray(payload.projectTypes)
    ? payload.projectTypes.filter((type): type is string => typeof type === "string")
    : [];
  const selectedTypes = [...new Set(projectTypes)].filter((type) => type in PROJECT_TYPE_LABELS);
  const words = description ? description.split(/\s+/).length : 0;

  if (
    !name ||
    !business ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    !/^\+[1-9]\d{7,14}$/.test(phone) ||
    words === 0 ||
    words > 500 ||
    selectedServices.length + selectedTypes.length === 0
  ) {
    return json({ error: "Invalid request" }, 400);
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("quote: BREVO_API_KEY is not set");
    return json({ error: "Email service unavailable" }, 500);
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
        replyTo: { email, name },
        to: [{ email: RECIPIENT, name: "Valentina Ramírez" }],
        subject: `Nueva cotización: ${name}`,
        htmlContent: quoteEmail({
          name,
          email,
          phone,
          business,
          description,
          services: selectedServices.map((service) => SERVICE_LABELS[service]),
          projectTypes: selectedTypes.map((type) => PROJECT_TYPE_LABELS[type]),
        }),
        tags: ["quote"],
      }),
    });
  } catch {
    console.error("quote: Brevo request failed or timed out");
    return json({ error: "Email service unavailable" }, 502);
  }

  if (!response.ok) {
    // Status only: the request holds personal data and the response may echo it.
    console.error(`quote: Brevo responded ${response.status}`);
    return json({ error: "Email service unavailable" }, 502);
  }
  return json({ ok: "true" }, 201);
}

export default { fetch: handler };
