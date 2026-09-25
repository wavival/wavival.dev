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

test("vercel routes nullbreach as an independent child application", () => {
  const nullbreach = microfrontends.applications.nullbreach;
  expect(nullbreach.routing).toContainEqual({
    group: "nullbreach",
    paths: ["/nullbreach", "/nullbreach/:path*"],
  });
  expect(microfrontends.applications["wavival-dev"].routing).toBeUndefined();
});

test("vercel preserves the legacy nullbreach API proxy", () => {
  expect(vercel.rewrites).toContainEqual({
    source: "/api/:path*",
    destination: "https://nullbreach-api.wavival.dev/api/:path*",
  });
});
