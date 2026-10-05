import { test, expect } from "@playwright/test";
import { daysUntilExpiry, evaluate } from "../scripts/check-security-txt.mjs";

const file = (expires: string) => `Contact: mailto:security@example.com\nExpires: ${expires}\n`;
const now = new Date("2026-10-05T00:00:00.000Z");

test.describe("security.txt expiry check", () => {
  test("counts the days left", () => {
    expect(daysUntilExpiry(file("2026-10-15T00:00:00.000Z"), now)).toBe(10);
    expect(daysUntilExpiry(file("2026-10-04T00:00:00.000Z"), now)).toBe(-1);
  });

  test("passes when the file is valid for more than 60 days", () => {
    expect(evaluate(file("2027-06-18T00:00:00.000Z"), now).level).toBe("ok");
  });

  test("warns inside the 60 day window and fails once expired", () => {
    expect(evaluate(file("2026-11-30T00:00:00.000Z"), now).level).toBe("warning");
    expect(evaluate(file("2026-10-04T00:00:00.000Z"), now).level).toBe("error");
  });

  test("fails when Expires is missing or not a date", () => {
    expect(evaluate("Contact: mailto:security@example.com\n", now).level).toBe("error");
    expect(evaluate(file("soon"), now).level).toBe("error");
  });
});
