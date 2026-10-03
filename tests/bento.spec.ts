import { test, expect } from "@playwright/test";
import { bentoRowLengths, bentoSpans } from "../src/utils/bento";

test.describe("bento layout", () => {
  test("every row fills the 12 columns, so no card is left alone in a corner", () => {
    for (let count = 1; count <= 24; count++) {
      const spans = bentoSpans(count);
      expect(spans).toHaveLength(count);
      let index = 0;
      for (const length of bentoRowLengths(count)) {
        const row = spans.slice(index, index + length);
        expect(row.reduce((total, span) => total + span, 0)).toBe(12);
        index += length;
      }
    }
  });

  test("avoids single-card rows unless there is a single card", () => {
    for (let count = 2; count <= 24; count++) {
      expect(bentoRowLengths(count)).not.toContain(1);
    }
    expect(bentoSpans(1)).toEqual([12]);
  });

  test("four cards form two rows of two", () => {
    expect(bentoRowLengths(4)).toEqual([2, 2]);
    expect(bentoSpans(4)).toEqual([7, 5, 5, 7]);
  });
});
