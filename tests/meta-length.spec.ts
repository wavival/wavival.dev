import { test, expect } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

// Every built page: a title of at most 60 characters and a description of at most 160, each
// unique. The /cop/ variants repeat their public page on purpose and are left out.
const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return full === path.join("dist", "cop") ? [] : walk(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });

const decode = (text: string) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

const pages = walk("dist").map((file) => {
  const html = readFileSync(file, "utf8");
  return {
    file,
    title: decode(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? ""),
    description: decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ""),
  };
});

test("titles fit in 60 characters and descriptions in 160", () => {
  expect(pages.length).toBeGreaterThanOrEqual(30);
  const long = pages
    .filter((page) => page.title.length > 60 || page.description.length > 160)
    .map((page) => `${page.file}: ${page.title.length} / ${page.description.length}`);
  expect(long).toEqual([]);
});

test("every page has its own title and description", () => {
  const repeated = (key: "title" | "description") =>
    pages.filter((page, i) => pages.findIndex((other) => other[key] === page[key]) !== i);
  expect(pages.every((page) => page.title && page.description)).toBe(true);
  expect(repeated("title").map((page) => page.file)).toEqual([]);
  expect(repeated("description").map((page) => page.file)).toEqual([]);
});
