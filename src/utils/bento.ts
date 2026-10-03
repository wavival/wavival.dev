const SPANS_OF_TWO = [
  [7, 5],
  [5, 7],
];

const SPANS_OF_THREE = [
  [6, 3, 3],
  [3, 3, 6],
  [4, 4, 4],
];

export function bentoRowLengths(count: number): number[] {
  const rows: number[] = [];
  let remaining = count;
  while (remaining > 0) {
    const length = remaining <= 3 ? remaining : remaining === 4 ? 2 : 3;
    rows.push(length);
    remaining -= length;
  }
  return rows;
}

export function bentoSpans(count: number): number[] {
  let twos = 0;
  let threes = 0;
  return bentoRowLengths(count).flatMap((length) => {
    if (length === 1) return [12];
    if (length === 2) return SPANS_OF_TWO[twos++ % SPANS_OF_TWO.length];
    return SPANS_OF_THREE[threes++ % SPANS_OF_THREE.length];
  });
}

export const bentoStyles = (count: number): string[] =>
  bentoSpans(count).map((span) => `--span:${span}`);
