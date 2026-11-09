import { test, expect, type Page } from "@playwright/test";
import { countryOptions } from "../src/data/countries";
import { budgetRangeOptions } from "../src/data/pricing";
import {
  howFoundOptions,
  preferredChannelOptions,
  timelineOptions,
} from "../src/data/quoteOptions";

/**
 * The five selects of the quote form: options and values stay the ones of the data
 * modules on every variant; on desktop pointers in a browser with `appearance:
 * base-select` (Chromium here) the option list takes the design of the site and opens
 * with a short transition that reduced motion removes, while touch devices and other
 * browsers keep their native picker. Keyboard and submission work as with a native select.
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

const isOpen = (page: Page, name: string) =>
  page.locator(`select[name="${name}"]`).evaluate((el) => el.matches(":open"));

const pickerStyle = (page: Page, name: string, prop: string) =>
  page
    .locator(`select[name="${name}"]`)
    .evaluate((el, prop) => getComputedStyle(el, "::picker(select)").getPropertyValue(prop), prop);

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

    test("desktop pointers get the styled list, touch keeps the native picker", async ({
      page,
    }, testInfo) => {
      await page.goto(path);
      const select = page.locator('select[name="country"]');
      const style = await select.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { appearance: cs.appearance, caret: cs.backgroundImage !== "none" };
      });
      if (testInfo.project.name === "chromium-mobile") {
        expect(style).toEqual({ appearance: "none", caret: true });
        return;
      }
      expect(style).toEqual({ appearance: "base-select", caret: false });
      const tokens = await page.evaluate(() => {
        const probe = document.createElement("div");
        probe.style.cssText = "background:var(--surface);border-color:var(--line-2)";
        document.body.append(probe);
        const cs = getComputedStyle(probe);
        const out = { surface: cs.backgroundColor, line: cs.borderTopColor };
        probe.remove();
        return out;
      });
      expect(await pickerStyle(page, "country", "background-color")).toBe(tokens.surface);
      expect(await pickerStyle(page, "country", "border-top-color")).toBe(tokens.line);
      expect(await pickerStyle(page, "country", "border-top-width")).toBe("1px");
      expect(await pickerStyle(page, "country", "border-radius")).toBe("2px");
      expect(await pickerStyle(page, "country", "box-shadow")).toBe("none");
      expect(await pickerStyle(page, "country", "transition-duration")).toMatch(/^0\.2s/);
      expect(await pickerStyle(page, "country", "max-height")).not.toBe("none");

      await select.click();
      expect(await isOpen(page, "country")).toBe(true);
      const list = page.locator('select[name="country"] option');
      await expect(list.first()).toBeVisible();
      await page.keyboard.press("Escape");
      expect(await isOpen(page, "country")).toBe(false);

      await page.emulateMedia({ reducedMotion: "reduce" });
      expect(await pickerStyle(page, "country", "transition-duration")).toBe("0s");
    });

    test("keyboard and pointer selection work as with a native select", async ({ page }) => {
      await page.goto(path);
      const select = page.locator('select[name="country"]');
      // The COP variant preselects Colombia, so the arrows move from there.
      const ids: string[] = countryOptions(lang).map((country) => country.id);
      const start = ids.indexOf(await select.inputValue());
      await select.focus();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      expect(ids.slice(start + 1, start + 3)).toContain(await select.inputValue());
      expect(await isOpen(page, "country")).toBe(false);

      await page.keyboard.press("Space");
      await page.keyboard.type("colom");
      await page.keyboard.press("Enter");
      await expect(select).toHaveValue("CO");
      await page.keyboard.press("Space");
      await page.keyboard.press("Escape");
      await expect(select).toHaveValue("CO");
      expect(await select.evaluate((el) => (el as HTMLSelectElement).checkValidity())).toBe(true);

      const budget = page.locator('select[name="budgetRange"]');
      await budget.selectOption("entry");
      await expect(budget).toHaveValue("entry");
      for (const name of ["howFound", "preferredChannel", "timeline"]) {
        const el = page.locator(`select[name="${name}"]`);
        const value = (await options(page, name))[1][0];
        await el.selectOption(value);
        await expect(el).toHaveValue(value);
      }
    });
  });
}
