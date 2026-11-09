import { test, expect } from "@playwright/test";

/**
 * Design-system rule for the action tiers of `Button.astro`: every primary button
 * carries a white icon, secondary and tertiary never do, and the icon tier has no
 * text. Checked on every page of the sitemap.
 */
test("every primary button has an icon and no other tier does, on every page", async ({
  page,
  request,
}) => {
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  const paths = [...sitemap.matchAll(/<loc>https:\/\/www\.wavival\.dev(.*?)<\/loc>/g)].map(
    (match) => match[1]
  );
  expect(paths.length).toBeGreaterThan(20);

  const failures: string[] = [];
  let primaries = 0;
  for (const path of paths) {
    await page.goto(path);
    const report = await page.evaluate(() => {
      const text = (el: Element) => (el as HTMLElement).innerText.replace(/\s+/g, " ").trim();
      const decorated = (el: Element) => el.querySelector("img, svg, .mask-icon") !== null;
      const out: string[] = [];
      const primary = [...document.querySelectorAll(".btn-primary")];
      for (const el of primary) {
        const imgs = el.querySelectorAll(":scope > img");
        const src = imgs[0]?.getAttribute("src") ?? "";
        if (imgs.length !== 1 || !/\/icons\/ui\/[a-z-]+-white\.svg$/.test(src)) {
          out.push(`primary "${text(el)}" has no white icon`);
        } else if (imgs[0].getAttribute("alt") !== "") {
          out.push(`primary "${text(el)}" icon is not decorative`);
        }
      }
      for (const el of document.querySelectorAll(".btn-secondary, .action-link")) {
        if (decorated(el)) out.push(`text tier "${text(el)}" carries an icon`);
      }
      for (const el of document.querySelectorAll(".icon-btn")) {
        if (text(el)) out.push(`icon tier "${text(el)}" shows text`);
        if (!el.getAttribute("aria-label")) out.push(`icon tier without aria-label`);
      }
      return { out, primaries: primary.length };
    });
    primaries += report.primaries;
    failures.push(...report.out.map((line) => `${path}: ${line}`));
  }
  expect(failures).toEqual([]);
  expect(primaries).toBeGreaterThan(20);
});

const ICONS: Array<[string, string, string]> = [
  ["/", "Ver servicios", "arrow-right-white"],
  ["/", "Blog W", "read-more-white"],
  ["/en/", "See services", "arrow-right-white"],
  ["/herramientas/", "Ver servicios", "arrow-right-white"],
  ["/en/uses/", "See services", "arrow-right-white"],
  ["/proyectos/terracore/", "Cotizar un proyecto así", "send-email-white"],
  ["/en/projects/terracore/", "Quote a project like this", "send-email-white"],
  ["/cotizar/", "Enviar cotización", "send-email-white"],
  ["/en/quote/", "Send quote request", "send-email-white"],
];

for (const [path, label, icon] of ICONS) {
  test(`${path} primary "${label}" uses the ${icon} icon`, async ({ page }) => {
    await page.goto(path);
    const button = page.locator("main .btn-primary", { hasText: label }).first();
    await expect(button.locator("img")).toHaveAttribute(
      "src",
      new RegExp(`/icons/ui/${icon}\\.svg$`)
    );
  });
}

test("the tertiary and icon tiers render through Button with the same markup", async ({ page }) => {
  await page.goto("/herramientas/");
  const tertiary = page.locator("main a.action-link").first();
  await expect(tertiary).toHaveCount(1);
  await expect(tertiary).not.toHaveClass(/\bbtn\b/);
  await page.goto("/sobre-mi/");
  const icon = page.locator("main a.icon-btn").first();
  await expect(icon).toHaveClass(/icon-btn-lg/);
  await expect(icon.locator(".mask-icon")).toHaveCount(1);
  await expect(icon).toHaveAttribute("rel", "noopener noreferrer");
});
