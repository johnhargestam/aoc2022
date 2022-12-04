import run from 'aocrunner';

type Range = [number, number];
type Pair = [Range, Range];

const parseInput = (rawInput: string) =>
  rawInput
    .split(/\n/)
    .map((pair) =>
      pair.split(/,/).map((range) => range.split(/-/).map((n) => +n)),
    ) as Pair[];

const allOverlap = ([[a, b], [x, y]]: Pair) =>
  (a <= x && b >= y) || (x <= a && y >= b);

const part1 = (rawInput: string) =>
  parseInput(rawInput).filter(allOverlap).length;

const anyOverlap = ([[a, b], [x, y]]: Pair) =>
  (b >= x && b <= y) || (y >= a && y <= b);

const part2 = (rawInput: string) =>
  parseInput(rawInput).filter(anyOverlap).length;

run({
  part1: {
    tests: [
      {
        input: `
          2-4,6-8
          2-3,4-5
          5-7,7-9
          2-8,3-7
          6-6,4-6
          2-6,4-8`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          2-4,6-8
          2-3,4-5
          5-7,7-9
          2-8,3-7
          6-6,4-6
          2-6,4-8`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
