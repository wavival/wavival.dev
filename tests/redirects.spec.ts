import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const vercel = JSON.parse(
  readFileSync(fileURLToPath(new URL("../vercel.json", import.meta.url)), "utf8")
);
const microfrontends = JSON.parse(
  readFileSync(fileURLToPath(new URL("../microfrontends.json", import.meta.url)), "utf8")
);

test("vercel preserves legacy redirects", () => {
  const redirects = new Map(
    vercel.redirects.map(
      (redirect: { source: string; destination: string; permanent: boolean }) => [
        redirect.source,
        redirect,
      ]
    )
  );

  const expected = [
    { source: "/projects/:path*", destination: "/proyectos/:path*" },
    { source: "/projects", destination: "/proyectos" },
    { source: "/services", destination: "/servicios" },
    { source: "/about", destination: "/sobre-mi" },
    { source: "/contact", destination: "/contacto" },
    { source: "/uses", destination: "/herramientas" },
  ];

  for (const route of expected) {
    expect(redirects.get(route.source)).toMatchObject({ ...route, permanent: true });
  }
});

test("vercel redirects the former OKroot app slug permanently", () => {
  const redirects = new Map(
    vercel.redirects.map(
      (redirect: { source: string; destination: string; permanent: boolean }) => [
        redirect.source,
        redirect,
      ]
    )
  );

  for (const route of [
    { source: "/proyectos/root", destination: "/proyectos/okroot" },
    { source: "/en/projects/root", destination: "/en/projects/okroot" },
    { source: "/proyectos/root-landing", destination: "/proyectos/okroot#landing" },
    { source: "/en/projects/root-landing", destination: "/en/projects/okroot#landing" },
  ]) {
    expect(redirects.get(route.source)).toMatchObject({ ...route, permanent: true });
  }
});

test("vercel routes nullbreach as an independent child application", () => {
  const nullbreach = microfrontends.applications.nullbreach;
  expect(nullbreach.routing).toContainEqual({
    group: "nullbreach",
    paths: ["/nullbreach", "/nullbreach/:path*"],
  });
  expect(microfrontends.applications["wavival-dev"].routing).toBeUndefined();
});

test("vercel does not proxy /api to an external host", () => {
  expect(vercel.rewrites ?? []).toEqual([]);
  expect(JSON.stringify(vercel)).not.toContain("nullbreach-api");
});
