import { test, expect } from "@playwright/test";
import quote from "../api/quote";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+573000000000",
  business: "Analytical Engines",
  description: "Necesito una landing page.",
};

const post = (body: unknown) =>
  quote.fetch(
    new Request("https://www.wavival.dev/api/quote", {
      method: "POST",
      body: JSON.stringify(body),
    })
  );

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
