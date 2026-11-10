import { test, expect } from "@playwright/test";
import { SERVICES_FAQ, servicesFaq } from "../src/data/servicesFaq";

const PAGES = [
  { path: "/servicios/", lang: "es" },
  { path: "/en/services/", lang: "en" },
  { path: "/cop/servicios/", lang: "es" },
  { path: "/cop/en/services/", lang: "en" },
] as const;

for (const { path, lang } of PAGES) {
  test.describe(`services FAQ ${path}`, () => {
    test("renders every question of the data file, closed, in order", async ({ page }) => {
      await page.goto(path);
      const items = page.locator("[data-services-faq] [data-faq-item]");
      await expect(items).toHaveCount(SERVICES_FAQ.length);
      const expected = servicesFaq(lang);
      for (const [i, faq] of expected.entries()) {
        const item = items.nth(i);
        await expect(item).toHaveAttribute("id", `faq-${faq.id}`);
        await expect(item.locator("summary")).toContainText(faq.q);
        await expect(item.locator("details")).not.toHaveAttribute("open", "");
      }
    });

    test("opens and closes with the keyboard and shows the focus", async ({ page }) => {
      await page.goto(path);
      const first = page.locator("[data-services-faq] details").first();
      const summary = first.locator("summary");
      await summary.focus();
      expect(await summary.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe("none");
      await page.keyboard.press("Enter");
      await expect(first).toHaveAttribute("open", "");
      await expect(first.locator("p")).toHaveText(servicesFaq(lang)[0].a);
      await page.keyboard.press("Space");
      await expect(first).not.toHaveAttribute("open", "");
    });

    test("FAQPage structured data matches the visible questions and answers", async ({ page }) => {
      await page.goto(path);
      const blocks = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent ?? "")));
      const faqPages = blocks.filter((block) => block["@type"] === "FAQPage");
      expect(faqPages).toHaveLength(1);
      const ld = faqPages[0];
      expect(ld["@context"]).toBe("https://schema.org");
      expect(ld.inLanguage).toBe(lang);

      const visible = await page.locator("[data-services-faq] details").evaluateAll((all) =>
        all.map((details) => ({
          q: details.querySelector("summary .h-title")?.textContent?.trim() ?? "",
          a: details.querySelector("[data-disclosure-content] p")?.textContent?.trim() ?? "",
        }))
      );
      expect(
        ld.mainEntity.map((q: { name: string; acceptedAnswer: { text: string } }) => ({
          q: q.name,
          a: q.acceptedAnswer.text,
        }))
      ).toEqual(visible);
      for (const q of ld.mainEntity) {
        expect(q["@type"]).toBe("Question");
        expect(q.acceptedAnswer["@type"]).toBe("Answer");
      }
    });
  });
}
