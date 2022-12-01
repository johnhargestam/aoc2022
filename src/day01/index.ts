import run from 'aocrunner';

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split(/\n\n/)
    .map((list) => list.split(/\n/).map((n) => +n));

const part1 = (rawInput: string) => {
  const inventories = parseInput(rawInput);

  const sums = inventories.reduce((sums, inventory) => [
    ...sums,
    inventory.reduce((sum, item) => sum + item, 0),
  ]);

  return Math.max(...sums);
};

const part2 = (rawInput: string) => {
  const inventories = parseInput(rawInput);

  const sums = inventories.reduce((sums, inventory) => [
    ...sums,
    inventory.reduce((sum, item) => sum + item, 0),
  ]);

  return [...sums]
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((top3, sum) => top3 + sum, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
