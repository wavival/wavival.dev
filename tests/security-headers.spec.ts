import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

type Header = { key: string; value: string };
const config = JSON.parse(readFileSync("vercel.json", "utf8")) as {
  headers: { source: string; headers: Header[] }[];
};
const global = config.headers.find((rule) => rule.source === "/:path*")!.headers;
const header = (name: string) => global.find((h) => h.key === name)?.value ?? "";
const directive = (name: string) =>
  header("Content-Security-Policy")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name} `));

test.describe("security headers in vercel.json", () => {
  test("sets the baseline headers on every path", () => {
    expect(header("X-Frame-Options")).toBe("DENY");
    expect(header("X-Content-Type-Options")).toBe("nosniff");
    expect(header("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(header("Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(header("Strict-Transport-Security")).toMatch(
      /max-age=63072000.*includeSubDomains.*preload/
    );
  });

  test("denies the powerful browser features the site never uses", () => {
    const policy = header("Permissions-Policy");
    for (const feature of ["camera", "microphone", "geolocation", "payment", "usb"]) {
      expect(policy).toContain(`${feature}=()`);
    }
  });

  test("keeps a strict Content Security Policy", () => {
    expect(directive("default-src")).toBe("default-src 'self'");
    expect(directive("object-src")).toBe("object-src 'none'");
    expect(directive("frame-ancestors")).toBe("frame-ancestors 'none'");
    expect(directive("base-uri")).toBe("base-uri 'self'");
    expect(directive("form-action")).toBe("form-action 'self'");
    expect(header("Content-Security-Policy")).toContain("upgrade-insecure-requests");
  });

  test("never allows unsafe script sources", () => {
    const scripts = directive("script-src") ?? "";
    expect(scripts).not.toContain("'unsafe-inline'");
    expect(scripts).not.toContain("'unsafe-eval'");
    expect(scripts).not.toMatch(/\s\*(\s|$)/);
  });
});
