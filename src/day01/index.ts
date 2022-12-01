import run from 'aocrunner';

const parseInput = (rawInput: string) =>
  rawInput.split(/\n\n/).map((list) => list.split(/\n/).map((n) => +n));

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
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
