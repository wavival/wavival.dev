import { test, expect } from "@playwright/test";

const CASES = [
  { path: "/sobre-mi", text: "Además del código, sé vender en redes." },
  { path: "/en/about", text: "Beyond code, I know how to sell on social media." },
];

for (const { path, text } of CASES) {
  test(`${path}: the intro mentions social selling and digital marketing`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("[data-about-marketing]")).toContainText(text);
  });
}

test("the home about section mentions content and social selling", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#about")).toContainText("sé vender en redes sociales");
  await page.goto("/en");
  await expect(page.locator("#about")).toContainText("know how to sell on social media");
});

test("the about summary names software and marketing as the two strengths", async ({ page }) => {
  await page.goto("/sobre-mi");
  await expect(page.getByLabel("En resumen")).toContainText("Software y marketing");
  await page.goto("/en/about");
  await expect(page.locator("dl").first()).toContainText("Software and marketing");
});

test("the about focus chips add marketing and drop Next.js and PostgreSQL", async ({ page }) => {
  for (const [path, label, chips] of [
    ["/sobre-mi", "Áreas de foco", ["Marketing digital", "Estrategia digital", "Ventas en redes"]],
    ["/en/about", "Focus areas", ["Digital marketing", "Digital strategy", "Social selling"]],
  ] as const) {
    await page.goto(path);
    const list = page.getByLabel(label);
    for (const chip of chips) await expect(list).toContainText(chip);
    await expect(list).not.toContainText(/Next\.js|PostgreSQL/);
  }
});
