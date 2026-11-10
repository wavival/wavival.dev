import { test, expect, type Page } from "@playwright/test";

const MESSAGE = {
  es: "Hola, vengo de wavival.dev y quiero solicitar un servicio.",
  en: "Hi, I'm coming from wavival.dev and I'd like to request a service.",
} as const;

const whatsappHref = (lang: keyof typeof MESSAGE) =>
  `https://wa.me/573016560222?text=${encodeURIComponent(MESSAGE[lang])}`;

const HOME = {
  es: {
    path: "/",
    title: "Valentina Ramírez | Software seguro y automatización con IA",
    description:
      "Ayudo a emprendedores a ahorrar tiempo con software seguro y automatización con IA: landing pages, sitios web, chatbots y apps a medida, construidos en público.",
    ogAlt:
      "Software y marketing digital para emprendedores. Landing pages, sitios web, chatbots y apps a medida que te ahorran tiempo y te ayudan a vender. Valentina Ramírez · @wavival · wavival.dev",
    footer:
      "Desarrolladora de software. Backend, IA y seguridad. Herramientas que le ahorran tiempo a tu negocio.",
  },
  en: {
    path: "/en/",
    title: "Valentina Ramírez | Secure software and AI automation",
    description:
      "I help entrepreneurs save time with secure software and AI automation: landing pages, websites, chatbots and custom apps, built in public.",
    ogAlt:
      "Software and digital marketing for entrepreneurs. Landing pages, websites, chatbots and custom apps that save you time and help you sell. Valentina Ramírez · @wavival · wavival.dev",
    footer: "Software developer. Backend, AI and security. Tools that save your business time.",
  },
} as const;

// Every page that renders a wa.me link, by language.
const WHATSAPP_PAGES = {
  es: ["/", "/contacto/", "/sobre-mi/", "/servicios/", "/cop/servicios/"],
  en: ["/en/", "/en/contact/", "/en/about/", "/en/services/", "/cop/en/services/"],
} as const;

/** Icon row of the about pages; Blog W sits before it as a secondary text button. */
const ABOUT_SOCIAL_ORDER = [
  "https://instagram.com/wavival_dev",
  "https://www.tiktok.com/@wavival_dev",
  "https://linkedin.com/in/wavival",
  "https://github.com/wavival",
  "https://platzi.com/p/wavival",
];

/** The Blog W button of an about page: secondary, text only, first in the social row. */
async function expectBlogButtonBeforeIcons(page: Page, label: string) {
  const blog = page.locator('main a.btn-secondary[href="https://blog.luminaw.co"]');
  await expect(blog).toHaveCount(1);
  await expect(blog).toHaveText("Blog W");
  await expect(blog).toHaveAttribute("target", "_blank");
  await expect(blog).toHaveAttribute("rel", "noopener noreferrer");
  await expect(blog).toHaveAttribute("aria-label", label);
  await expect(blog.locator("img, .mask-icon")).toHaveCount(0);
  await expect(page.locator('main a.icon-btn[href="https://blog.luminaw.co"]')).toHaveCount(0);
  const icons = page.locator("main [data-social-links]").last();
  expect(
    await blog.evaluate((el) => el.nextElementSibling?.hasAttribute("data-social-links"))
  ).toBe(true);
  const [b, i] = await Promise.all([blog.boundingBox(), icons.boundingBox()]);
  if ((page.viewportSize()?.width ?? 0) >= 900) {
    // Same row on desktop: the button first, the icons to its right, vertically centered.
    expect(b!.x + b!.width).toBeLessThanOrEqual(i!.x);
    expect(Math.abs(b!.y + b!.height / 2 - (i!.y + i!.height / 2))).toBeLessThanOrEqual(1);
  } else {
    // The row wraps on narrow screens and the icons go below the button.
    expect(i!.y).toBeGreaterThanOrEqual(b!.y + b!.height);
  }
}

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

    test(`${home.path} footer links Instagram, TikTok, LinkedIn and GitHub in that order, and no Facebook`, async ({
      page,
    }) => {
      await page.goto(home.path);
      const footer = page.locator("footer");
      await expect(footer.locator('a[href="https://instagram.com/wavival_dev"]')).toHaveCount(1);
      await expect(footer.locator('a[href="https://github.com/wavival"]')).toHaveCount(1);
      await expect(footer.locator('a[href="https://linkedin.com/in/wavival"]')).toHaveCount(1);
      const tiktok = footer.locator('a[href="https://www.tiktok.com/@wavival_dev"]');
      await expect(tiktok).toHaveCount(1);
      const order = await footer
        .locator("a.icon-btn")
        .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
      expect(order).toEqual([
        "https://instagram.com/wavival_dev",
        "https://www.tiktok.com/@wavival_dev",
        "https://linkedin.com/in/wavival",
        "https://github.com/wavival",
      ]);
      await expect(tiktok).toHaveAttribute("target", "_blank");
      await expect(tiktok).toHaveAttribute("rel", "noopener noreferrer");
      await expect(tiktok).toHaveAttribute(
        "aria-label",
        lang === "en" ? "Valentina Ramírez on TikTok" : "TikTok de Valentina Ramírez"
      );
      await expect(page.locator('a[href*="facebook.com"]')).toHaveCount(0);
    });

    test(`${home.path} hero links Instagram, TikTok and LinkedIn in that order, without GitHub`, async ({
      page,
    }) => {
      await page.goto(home.path);
      const order = await page
        .locator("#hero a.icon-btn")
        .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
      expect(order).toEqual([
        "https://instagram.com/wavival_dev",
        "https://www.tiktok.com/@wavival_dev",
        "https://linkedin.com/in/wavival",
      ]);
    });

    test(`${home.path} home about section links Instagram, TikTok and LinkedIn, with Blog W as the primary button and the about page as the secondary one`, async ({
      page,
    }) => {
      await page.goto(home.path);
      const about = page.locator("#about");
      const order = await about
        .locator("a.icon-btn")
        .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
      expect(order).toEqual([
        "https://instagram.com/wavival_dev",
        "https://www.tiktok.com/@wavival_dev",
        "https://linkedin.com/in/wavival",
      ]);
      await expect(about.locator('a[href*="wa.me"]')).toHaveCount(0);
      await expect(about.locator('a[href*="github.com"]')).toHaveCount(0);
      await expect(about.locator('a[href*="platzi.com"]')).toHaveCount(0);
      const labels = await about
        .locator("a.icon-btn")
        .evaluateAll((links) => links.map((a) => a.getAttribute("aria-label")));
      expect(labels).toEqual(
        lang === "en"
          ? [
              "Valentina Ramírez on Instagram",
              "Valentina Ramírez on TikTok",
              "Valentina Ramírez on LinkedIn",
            ]
          : [
              "Instagram de Valentina Ramírez",
              "TikTok de Valentina Ramírez",
              "LinkedIn de Valentina Ramírez",
            ]
      );
      const blog = about.locator("a.btn-primary");
      await expect(blog).toHaveCount(1);
      await expect(blog).toHaveAttribute("href", "https://blog.luminaw.co");
      await expect(blog).toHaveAttribute("target", "_blank");
      await expect(blog).toHaveAttribute("rel", "noopener noreferrer");
      await expect(blog).toHaveText("Blog W");
      const meet = about.locator("a.btn-secondary");
      await expect(meet).toHaveCount(1);
      await expect(about.locator("a.action-link")).toHaveCount(0);
      await expect(meet).toHaveAttribute("href", lang === "en" ? "/en/about" : "/sobre-mi");
      await expect(meet).toHaveText(lang === "en" ? "Get to know me" : "Conóceme");
      // Both text buttons use the 44px size so they stand as tall as the icon buttons.
      await expect(blog).toHaveClass(/\bbtn-sm\b/);
      await expect(meet).toHaveClass(/\bbtn-sm\b/);
      const heights = await about
        .locator("[data-social-links] a, a.btn")
        .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)));
      expect(heights).toHaveLength(5);
      expect(new Set(heights).size).toBe(1);
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

  test("/sobre-mi lists the marketing and content training as plain text", async ({ page }) => {
    await page.goto("/sobre-mi/");
    const row = page.locator("[data-marketing-training]");
    await expect(row).toContainText("Marketing y contenido");
    await expect(row).toContainText(
      "Marketing y redes sociales en Platzi, aprendizaje autodidacta y práctica como creadora de contenido en Instagram y TikTok"
    );
    // The profiles are linked once, as icons in the social row: the education rows are plain text.
    await expect(page.locator("[data-parallel-education] a")).toHaveCount(0);
    await expect(
      page.locator('main a[aria-label="TikTok de Valentina Ramírez"]').last()
    ).toHaveAttribute("href", "https://www.tiktok.com/@wavival_dev");
    const social = page.locator("main a.icon-btn");
    await expect(social).toHaveCount(5);
    expect(await social.evaluateAll((links) => links.map((a) => a.getAttribute("href")))).toEqual(
      ABOUT_SOCIAL_ORDER
    );
    await expect(page.locator('main a[href^="https://wa.me/"]')).toHaveCount(0);
    await expectBlogButtonBeforeIcons(
      page,
      "Blog W: blog de Lúmina W creado por Valentina Ramírez"
    );
  });

  test("/en/about lists the marketing and content training as plain text", async ({ page }) => {
    await page.goto("/en/about/");
    const row = page.locator("[data-marketing-training]");
    await expect(row).toContainText("Marketing and content");
    await expect(row).toContainText(
      "Marketing and social media at Platzi, self-taught learning and hands-on practice as a content creator on Instagram and TikTok"
    );
    // The profiles are linked once, as icons in the social row: the education rows are plain text.
    await expect(page.locator("[data-parallel-education] a")).toHaveCount(0);
    await expect(
      page.locator('main a[aria-label="Valentina Ramírez on TikTok"]').last()
    ).toHaveAttribute("href", "https://www.tiktok.com/@wavival_dev");
    const social = page.locator("main a.icon-btn");
    await expect(social).toHaveCount(5);
    expect(await social.evaluateAll((links) => links.map((a) => a.getAttribute("href")))).toEqual(
      ABOUT_SOCIAL_ORDER
    );
    await expect(page.locator('main a[href^="https://wa.me/"]')).toHaveCount(0);
    await expectBlogButtonBeforeIcons(page, "Blog W: Lúmina W blog by Valentina Ramírez");
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
    await expect(yesList).toContainText("1 to 10 people) that already sell and have customers");
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
