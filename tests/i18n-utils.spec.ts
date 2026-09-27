import { test, expect } from "@playwright/test";
import { getAltLangUrl } from "../src/i18n/utils";

const alt = (path: string) => getAltLangUrl(new URL(`https://www.wavival.dev${path}`));

// The ES<->EN slug mapping is the single source of truth for the language toggle.
// These cases lock the pure-function contract so a future page/slug rename can't
// silently break it (the e2e DOM checks live in i18n.spec.ts).
test.describe("language toggle target (getAltLangUrl)", () => {
  const ES_TO_EN: Array<[string, string]> = [
    ["/", "/en"],
    ["/proyectos", "/en/projects"],
    ["/sobre-mi", "/en/about"],
    ["/servicios", "/en/services"],
    ["/contacto", "/en/contact"],
    ["/herramientas", "/en/uses"],
    ["/privacidad", "/en/privacy"],
    ["/proyectos/terracore", "/en/projects/terracore"],
  ];

  for (const [es, en] of ES_TO_EN) {
    test(`ES ${es} -> EN ${en}`, () => {
      expect(alt(es)).toEqual({ href: en, lang: "en" });
    });
  }

  const EN_TO_ES: Array<[string, string]> = [
    ["/en", "/"],
    ["/en/projects", "/proyectos"],
    ["/en/about", "/sobre-mi"],
    ["/en/services", "/servicios"],
    ["/en/contact", "/contacto"],
    ["/en/uses", "/herramientas"],
    ["/en/privacy", "/privacidad"],
    ["/en/projects/nullbreach", "/proyectos/nullbreach"],
  ];

  for (const [en, es] of EN_TO_ES) {
    test(`EN ${en} -> ES ${es}`, () => {
      expect(alt(en)).toEqual({ href: es, lang: "es" });
    });
  }

  test("unknown ES path falls back to /en", () => {
    expect(alt("/no-existe")).toEqual({ href: "/en", lang: "en" });
  });
});
