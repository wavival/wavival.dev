import { test, expect, type Page } from "@playwright/test";
import { countryOptions } from "../src/data/countries";
import { budgetRangeOptions } from "../src/data/pricing";
import {
  howFoundOptions,
  preferredChannelOptions,
  timelineOptions,
} from "../src/data/quoteOptions";

/**
 * The five selects of the quote form: options and values stay the ones of the data modules
 * on every variant. With a fine pointer (chromium-desktop) each one is a combobox whose option
 * list takes the design of the site in every browser, while the native select stays in the
 * form; touch devices (chromium-mobile) keep the native picker. Keyboard and submission work
 * as with a native select.
 */
const PAGES = [
  { path: "/cotizar/", lang: "es", currency: "USD" },
  { path: "/en/quote/", lang: "en", currency: "USD" },
  { path: "/cop/cotizar/", lang: "es", currency: "COP" },
  { path: "/cop/en/quote/", lang: "en", currency: "COP" },
] as const;

const SELECTS = ["country", "budgetRange", "howFound", "preferredChannel", "timeline"] as const;

const options = (page: Page, name: string) =>
  page
    .locator(`select[name="${name}"] option`)
    .evaluateAll((els) =>
      els.map((el) => [(el as HTMLOptionElement).value, el.textContent?.trim() ?? ""])
    );

const field = (page: Page, name: string) =>
  page.locator(".quote-field", { has: page.locator(`select[name="${name}"]`) });
const combo = (page: Page, name: string) => field(page, name).getByRole("combobox");
const listbox = (page: Page, name: string) => field(page, name).getByRole("listbox");

const tokens = (page: Page) =>
  page.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.cssText = "background:var(--surface);border-color:var(--line-2);color:var(--link)";
    document.body.append(probe);
    const cs = getComputedStyle(probe);
    const out = { surface: cs.backgroundColor, line: cs.borderTopColor, link: cs.color };
    probe.remove();
    return out;
  });

for (const { path, lang, currency } of PAGES) {
  test.describe(path, () => {
    test("the five selects keep the options and values of the data modules", async ({ page }) => {
      await page.goto(path);
      const expected = {
        country: countryOptions(lang).map((o) => [o.id, o.label]),
        budgetRange: budgetRangeOptions(currency, lang).map((o) => [o.id, o.label]),
        howFound: howFoundOptions(lang).map((o) => [o.id, o.label]),
        preferredChannel: preferredChannelOptions(lang).map((o) => [o.id, o.label]),
        timeline: timelineOptions(lang).map((o) => [o.id, o.label]),
      };
      for (const name of SELECTS) {
        const found = await options(page, name);
        expect(found[0][0]).toBe("");
        expect(found.slice(1)).toEqual(expected[name]);
      }
      await expect(page.locator('select[name="country"] option').first()).toBeDisabled();
      await expect(page.locator('select[name="budgetRange"] option').first()).toBeDisabled();
    });

    test("desktop pointers get a styled combobox, touch keeps the native picker", async ({
      page,
    }, testInfo) => {
      await page.goto(path);
      if (testInfo.project.name === "chromium-mobile") {
        await expect(page.locator(".quote-select-button")).toHaveCount(0);
        const select = page.locator('select[name="country"]');
        await expect(select).toBeVisible();
        expect(await select.evaluate((el) => getComputedStyle(el).appearance)).toBe("none");
        return;
      }
      await expect(page.locator("[data-quote-form]").getByRole("combobox")).toHaveCount(5);
      for (const name of SELECTS) {
        const native = page.locator(`select[name="${name}"]`);
        await expect(native).toHaveAttribute("aria-hidden", "true");
        await expect(native).toHaveAttribute("tabindex", "-1");
        const label = await field(page, name)
          .locator(":scope > span")
          .evaluate((el) => (el.firstChild?.textContent ?? "").trim());
        await expect(combo(page, name)).toHaveAccessibleName(label);
        await expect(combo(page, name)).toHaveText(
          await native.evaluate((el) => (el as HTMLSelectElement).selectedOptions[0].text)
        );
        await expect(listbox(page, name)).toBeHidden();
      }

      const country = combo(page, "country");
      await country.click();
      await expect(country).toHaveAttribute("aria-expanded", "true");
      const list = listbox(page, "country");
      await expect(list).toBeVisible();
      const t = await tokens(page);
      const style = await list.evaluate((el) => {
        const cs = getComputedStyle(el);
        return {
          bg: cs.backgroundColor,
          border: cs.borderTopColor,
          width: cs.borderTopWidth,
          radius: cs.borderTopLeftRadius,
          shadow: cs.boxShadow,
          duration: cs.transitionDuration,
          maxHeight: cs.maxHeight,
        };
      });
      expect(style).toMatchObject({
        bg: t.surface,
        border: t.line,
        width: "1px",
        radius: "2px",
        shadow: "none",
      });
      expect(style.duration).toMatch(/^0\.2s/);
      expect(style.maxHeight).not.toBe("none");
      const comboBox = await country.boundingBox();
      const listBox = await list.boundingBox();
      expect(Math.round(listBox!.width)).toBe(Math.round(comboBox!.width));
      const selected = list.locator('[aria-selected="true"]');
      if (path.startsWith("/cop/")) await expect(selected).toHaveCount(1);
      await page.keyboard.press("Escape");
      await expect(country).toHaveAttribute("aria-expanded", "false");
      await expect(list).toBeHidden();

      await page.emulateMedia({ reducedMotion: "reduce" });
      await country.click();
      expect(
        await list.evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration))
      ).toBeLessThan(0.05);
    });

    test("keyboard and pointer selection work as with a native select", async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name === "chromium-mobile", "native picker on touch");
      await page.goto(path);
      const select = page.locator('select[name="country"]');
      const country = combo(page, "country");
      // The COP variant preselects Colombia, so the arrows move from there.
      const ids: string[] = countryOptions(lang).map((c) => c.id);
      const start = ids.indexOf(await select.inputValue());
      await country.focus();
      await page.keyboard.press("ArrowDown");
      await expect(country).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(country).toHaveAttribute("aria-expanded", "false");
      expect(ids.slice(start + 1, start + 3)).toContain(await select.inputValue());
      await expect(country).toHaveText(
        await select.evaluate((el) => (el as HTMLSelectElement).selectedOptions[0].text)
      );

      await page.keyboard.type("colom");
      await page.keyboard.press("Enter");
      await expect(select).toHaveValue("CO");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Escape");
      await expect(select).toHaveValue("CO");
      expect(await select.evaluate((el) => (el as HTMLSelectElement).checkValidity())).toBe(true);

      // A click on the label text focuses the combobox, a click on an option picks it.
      await field(page, "timeline").locator(":scope > span").click();
      await expect(combo(page, "timeline")).toBeFocused();
      await combo(page, "timeline").click();
      const option = listbox(page, "timeline").getByRole("option").nth(1);
      const label = await option.innerText();
      await option.click();
      await expect(combo(page, "timeline")).toHaveText(label);
      await expect(page.locator('select[name="timeline"]')).toHaveValue(
        timelineOptions(lang)[0].id
      );

      // Programmatic changes (autofill) reach the combobox.
      await page.locator('select[name="budgetRange"]').selectOption("entry");
      await expect(combo(page, "budgetRange")).toHaveText(
        budgetRangeOptions(currency, lang).find((o) => o.id === "entry")!.label
      );
      // The disabled placeholder cannot be chosen.
      await combo(page, "budgetRange").click();
      await listbox(page, "budgetRange").getByRole("option").first().click({ force: true });
      await expect(page.locator('select[name="budgetRange"]')).toHaveValue("entry");
    });

    test("a required select left empty shows the error state after it was used", async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name === "chromium-mobile", "native picker on touch");
      test.skip(path.startsWith("/cop/"), "Colombia is preselected on the COP variant");
      await page.goto(path);
      const country = combo(page, "country");
      await expect(country).not.toHaveAttribute("aria-invalid", "true");
      await country.click();
      await page.keyboard.press("Escape");
      await expect(country).toHaveAttribute("aria-invalid", "true");
      const danger = await page.evaluate(() => {
        const probe = document.createElement("div");
        probe.style.color = "var(--danger)";
        document.body.append(probe);
        const value = getComputedStyle(probe).color;
        probe.remove();
        return value;
      });
      await page.locator("h1").click();
      await expect
        .poll(() => country.evaluate((el) => getComputedStyle(el).borderTopColor))
        .toBe(danger);
    });
  });
}
