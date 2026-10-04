import { test, expect } from "@playwright/test";

/** WCAG 2.5.3: a control with visible text keeps that text inside its accessible name. */
const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

test("controls with visible text keep it inside their aria-label on every page", async ({
  page,
  request,
}) => {
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  const paths = [...sitemap.matchAll(/<loc>https:\/\/www\.wavival\.dev(.*?)<\/loc>/g)].map(
    (match) => match[1]
  );
  expect(paths.length).toBeGreaterThan(20);

  const failures: string[] = [];
  for (const path of paths) {
    await page.goto(path);
    const mismatches = await page.evaluate(() =>
      [...document.querySelectorAll("a[aria-label], button[aria-label]")].map((el) => ({
        visible: (el as HTMLElement).innerText.replace(/\s+/g, " ").trim(),
        label: el.getAttribute("aria-label") ?? "",
      }))
    );
    for (const { visible, label } of mismatches) {
      if (!visible) continue;
      if (!` ${normalize(label)} `.includes(` ${normalize(visible)} `)) {
        failures.push(`${path}: "${visible}" is not in "${label}"`);
      }
    }
  }
  expect(failures).toEqual([]);
});
