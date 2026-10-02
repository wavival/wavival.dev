const RECIPIENT = "wavival.dev@luminaw.co";
const SENDER = { name: "Wavival", email: RECIPIENT };

const SERVICE_LABELS: Record<string, string> = {
  "custom-web-applications": "Aplicaciones web a medida",
  "rest-apis-backend": "APIs REST y backend",
  "security-appsec": "Seguridad y AppSec",
  "ai-integrations": "Integraciones de IA",
};

interface QuotePayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  business?: unknown;
  description?: unknown;
  services?: unknown;
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
}) => {
  const detailRows = [
    ["Nombre", quote.name],
    ["Correo", quote.email],
    ["Teléfono", quote.phone],
    ["Empresa", quote.business],
    ["Servicios", quote.services.join(", ")],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:12px 16px;border-bottom:1px solid #d1d5db;color:#4b5563;font:600 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;vertical-align:top">${label}</td><td style="padding:12px 16px;border-bottom:1px solid #d1d5db;color:#111827;font:15px Arial,sans-serif">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return `<!doctype html><html lang="es"><body style="margin:0;background:#f3f4f6;color:#111827"><main style="max-width:640px;margin:32px auto;background:#ffffff;border:1px solid #d1d5db"><header style="padding:28px 32px;border-bottom:4px solid #407bff"><span style="color:#1565c0;font:800 28px Arial,sans-serif;letter-spacing:-.08em">W</span><p style="margin:16px 0 0;color:#4b5563;font:600 12px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase">Nueva cotización</p><h1 style="margin:8px 0 0;font:800 30px Arial,sans-serif;letter-spacing:-.03em">${escapeHtml(quote.name)}</h1></header><section style="padding:24px 32px"><table style="width:100%;border-collapse:collapse">${detailRows}</table><h2 style="margin:32px 0 12px;font:800 18px Arial,sans-serif">Proyecto</h2><p style="margin:0;color:#374151;font:15px/1.7 Arial,sans-serif;white-space:pre-wrap">${escapeHtml(quote.description)}</p></section><footer style="padding:20px 32px;background:#f9fafb;border-top:1px solid #d1d5db;color:#6b7280;font:12px Arial,sans-serif">Enviado desde wavival.dev</footer></main></body></html>`;
};

async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let payload: QuotePayload;
  try {
    payload = (await request.json()) as QuotePayload;
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
  const words = description ? description.split(/\s+/).length : 0;

  if (
    !name ||
    !business ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    !/^\+[1-9]\d{7,14}$/.test(phone) ||
    words === 0 ||
    words > 500 ||
    selectedServices.length === 0
  ) {
    return json({ error: "Invalid request" }, 400);
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return json({ error: "Email service unavailable" }, 500);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
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
      }),
      tags: ["quote"],
    }),
  });

  if (!response.ok) return json({ error: "Email service unavailable" }, 502);
  return json({ ok: "true" }, 201);
}

export default { fetch: handler };
