import { test, expect } from "@playwright/test";

const MESSAGE = {
  es: "Hola, vengo de wavival.dev y quiero solicitar un servicio.",
  en: "Hi, I'm coming from wavival.dev and I'd like to request a service.",
} as const;

const whatsappHref = (lang: keyof typeof MESSAGE) =>
  `https://wa.me/573016560222?text=${encodeURIComponent(MESSAGE[lang])}`;

const HOME = {
  es: {
    path: "/",
    title: "Valentina Ramírez | Software seguro y automatización con IA para emprendedores",
    description:
      "Ayudo a emprendedores a ahorrar tiempo con software seguro y automatización con IA: landing pages, sitios web, chatbots y apps a medida, construidos en público.",
    ogAlt:
      "Valentina Ramírez (@wavival): Creo productos digitales. De una idea a algo que las personas pueden usar.",
    footer:
      "Desarrolladora de software. Backend, IA y seguridad. Herramientas que le ahorran tiempo a tu negocio.",
  },
  en: {
    path: "/en/",
    title: "Valentina Ramírez | Secure software and AI automation for entrepreneurs",
    description:
      "I help entrepreneurs save time with secure software and AI automation: landing pages, websites, chatbots and custom apps, built in public.",
    ogAlt:
      "Valentina Ramírez (@wavival): I build digital products. From an idea to something people can actually use.",
    footer: "Software developer. Backend, AI and security. Tools that save your business time.",
  },
} as const;

// Every page that renders a wa.me link, by language.
const WHATSAPP_PAGES = {
  es: ["/", "/contacto/", "/sobre-mi/", "/servicios/", "/cop/servicios/"],
  en: ["/en/", "/en/contact/", "/en/about/", "/en/services/", "/cop/en/services/"],
} as const;

test.describe("positioning of the 2026 plan", () => {
  for (const lang of ["es", "en"] as const) {
    const home = HOME[lang];

    test(`${home.path} carries the new title, description and social card alt`, async ({
      page,
    }) => {
      await page.goto(home.path);
      await expect(page).toHaveTitle(home.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        home.description
      );
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        home.title
      );
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
        "content",
        home.description
      );
      await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
        "content",
        home.ogAlt
      );
    });

    test(`${home.path} hero lead, footer and metadata do not say Full Stack Developer`, async ({
      page,
    }) => {
      await page.goto(home.path);
      const head = await page.locator("head").innerHTML();
      const meta = [...head.matchAll(/<(?:title|meta)[^>]*>[^<]*/g)].map((m) => m[0]).join("\n");
      expect(meta).not.toMatch(/full stack/i);
      await expect(page.locator("#hero [data-hero-lead]")).not.toContainText(/full stack/i);
      await expect(page.locator("#about")).not.toContainText(/full stack/i);
      await expect(page.locator("footer")).toContainText(home.footer);
      await expect(page.locator("footer")).not.toContainText(/full stack/i);
    });

    test(`${home.path} footer links Instagram, GitHub, LinkedIn and TikTok, and no Facebook`, async ({
      page,
    }) => {
      await page.goto(home.path);
      const footer = page.locator("footer");
      await expect(footer.locator('a[href="https://instagram.com/wavival"]')).toHaveCount(1);
      await expect(footer.locator('a[href="https://github.com/wavival"]')).toHaveCount(1);
      await expect(footer.locator('a[href="https://linkedin.com/in/wavival"]')).toHaveCount(1);
      const tiktok = footer.locator('a[href="https://www.tiktok.com/@wavival_dev"]');
      await expect(tiktok).toHaveCount(1);
      await expect(tiktok).toHaveAttribute("target", "_blank");
      await expect(tiktok).toHaveAttribute("rel", "noopener noreferrer");
      await expect(tiktok).toHaveAttribute(
        "aria-label",
        lang === "en" ? "Valentina Ramírez on TikTok" : "TikTok de Valentina Ramírez"
      );
      await expect(page.locator('a[href*="facebook.com"]')).toHaveCount(0);
    });

    for (const path of WHATSAPP_PAGES[lang]) {
      test(`${path} opens every WhatsApp link with the ${lang} message`, async ({ page }) => {
        await page.goto(path);
        const links = page.locator('a[href^="https://wa.me/"]');
        const count = await links.count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
          expect(await links.nth(i).getAttribute("href")).toBe(whatsappHref(lang));
        }
      });
    }
  }

  test("/contacto and /en/contact use the unified message on the WhatsApp card", async ({
    page,
  }) => {
    await page.goto("/contacto/");
    await expect(page.locator('a[data-umami-event="contacto-whatsapp"]')).toHaveAttribute(
      "href",
      whatsappHref("es")
    );
    await page.goto("/en/contact/");
    await expect(page.locator('a[data-umami-event="contacto-whatsapp"]')).toHaveAttribute(
      "href",
      whatsappHref("en")
    );
  });

  test("/sobre-mi lists the marketing and content training with TikTok and Instagram links", async ({
    page,
  }) => {
    await page.goto("/sobre-mi/");
    const row = page.locator("[data-marketing-training]");
    await expect(row).toContainText("Marketing y contenido");
    await expect(row).toContainText(
      "Marketing y redes sociales en Platzi, aprendizaje autodidacta y práctica como creadora de contenido en TikTok e Instagram"
    );
    await expect(row.locator('a[href="https://www.tiktok.com/@wavival_dev"]')).toHaveText("TikTok");
    await expect(row.locator('a[href="https://instagram.com/wavival"]')).toHaveText("Instagram");
  });

  test("/en/about lists the marketing and content training with TikTok and Instagram links", async ({
    page,
  }) => {
    await page.goto("/en/about/");
    const row = page.locator("[data-marketing-training]");
    await expect(row).toContainText("Marketing and content");
    await expect(row).toContainText(
      "Marketing and social media at Platzi, self-taught learning and hands-on practice as a content creator on TikTok and Instagram"
    );
    await expect(row.locator('a[href="https://www.tiktok.com/@wavival_dev"]')).toHaveText("TikTok");
    await expect(row.locator('a[href="https://instagram.com/wavival"]')).toHaveText("Instagram");
  });

  test("/herramientas shows the marketing and content tools and the recording gear", async ({
    page,
  }) => {
    await page.goto("/herramientas/");
    const marketing = page.getByRole("heading", { level: 3, name: "Marketing y contenido" });
    await expect(marketing).toHaveCount(1);
    const group = marketing.locator("xpath=ancestor::div[contains(@class,'border-b')][1]");
    for (const tool of [
      "Claude (ver Código e IA)",
      "CapCut",
      "Canva",
      "ElevenLabs",
      "Higgsfield",
    ]) {
      await expect(group).toContainText(tool);
    }
    const gear = page.getByRole("heading", { level: 3, name: "Móvil y grabación" });
    await expect(gear).toHaveCount(1);
    const gearGroup = gear.locator("xpath=ancestor::div[contains(@class,'border-b')][1]");
    await expect(gearGroup).toContainText("Motorola Edge 60 Fusion");
    await expect(gearGroup).toContainText("Estabilizador DJI con selfie stick extensible");
    await expect(page.getByRole("heading", { level: 3, name: "Equipo Linux" })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 3, name: "Equipo Windows" })).toHaveCount(1);
  });

  test("/en/uses shows the marketing and content tools and the recording gear", async ({
    page,
  }) => {
    await page.goto("/en/uses/");
    const marketing = page.getByRole("heading", { level: 3, name: "Marketing and content" });
    await expect(marketing).toHaveCount(1);
    const group = marketing.locator("xpath=ancestor::div[contains(@class,'border-b')][1]");
    for (const tool of [
      "Claude (see Code and AI)",
      "CapCut",
      "Canva",
      "ElevenLabs",
      "Higgsfield",
    ]) {
      await expect(group).toContainText(tool);
    }
    const gear = page.getByRole("heading", { level: 3, name: "Phone and recording" });
    await expect(gear).toHaveCount(1);
    const gearGroup = gear.locator("xpath=ancestor::div[contains(@class,'border-b')][1]");
    await expect(gearGroup).toContainText("Motorola Edge 60 Fusion");
    await expect(gearGroup).toContainText("DJI gimbal with extendable selfie stick");
  });

  test("/servicios publishes the new fit lists", async ({ page }) => {
    await page.goto("/servicios/");
    const yes = page.getByRole("heading", { level: 3, name: "Trabajo mejor con" });
    await expect(yes).toHaveCount(1);
    const yesList = yes.locator("xpath=following-sibling::ul[1]");
    await expect(yesList.locator("li")).toHaveCount(5);
    await expect(yesList).toContainText("de 1 a 10 personas, que ya venden y tienen clientes");
    await expect(yesList).toContainText("WhatsApp, Instagram, Excel o Google Sheets y correo");
    await expect(yesList).toContainText("pierde leads o no tiene web");
    await expect(yesList).toContainText("tiempo ahorrado y más ventas");
    await expect(yesList).toContainText("consultorios, estética, psicología, abogados, contadores");
    const no = page.getByRole("heading", { level: 3, name: "No es para ti si" });
    await expect(no).toHaveCount(1);
    const noList = no.locator("xpath=following-sibling::ul[1]");
    await expect(noList.locator("li")).toHaveCount(4);
    await expect(noList).toContainText("etapa de idea y todavía no vende");
    await expect(noList).toContainText("más de 10 personas");
    await expect(noList).toContainText("van a Lúmina W");
    await expect(noList).toContainText("pentest certificado o una certificación de cumplimiento");
    await expect(noList).toContainText("manejo diario de redes o una agencia de marketing");
    await expect(page.locator("main")).not.toContainText("Fundadores con producto real");
  });

  test("/en/services publishes the new fit lists", async ({ page }) => {
    await page.goto("/en/services/");
    const yes = page.getByRole("heading", { level: 3, name: "I work best with" });
    const yesList = yes.locator("xpath=following-sibling::ul[1]");
    await expect(yesList.locator("li")).toHaveCount(5);
    await expect(yesList).toContainText("1 to 10 people, that already sell and have customers");
    await expect(yesList).toContainText("clinics, beauty, psychology, lawyers, accountants");
    const no = page.getByRole("heading", { level: 3, name: "Not the right fit if" });
    const noList = no.locator("xpath=following-sibling::ul[1]");
    await expect(noList.locator("li")).toHaveCount(4);
    await expect(noList).toContainText("idea stage and does not sell yet");
    await expect(noList).toContainText("those projects go to Lúmina W");
    await expect(noList).toContainText("certified pentest or a compliance certification");
    await expect(noList).toContainText("daily social media management or a marketing agency");
  });
});
