import run from 'aocrunner';

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split(/\n\s*/)
    .map((line) => [
      line.slice(0, line.length / 2).split(''),
      line.slice(line.length / 2).split(''),
    ]);

//char codes: A: 65, Z: 90, a: 97, z: 122
//priorities: a-z: 1-26, A-Z: 27-52
const priority = (c: string) =>
  ((n: number) => (n < 97 ? n - 65 + 27 : n - 97 + 1))(c.charCodeAt(0));

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .map(([a, b]) => a.filter((c) => b.includes(c)).slice(0, 1))
    .flat()
    .map(priority)
    .reduce((sum, p) => sum + p);

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
          vJrwpWtwJgWrhcsFMMfFFhFp
          jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
          PmmdzqPrVvPwwTWBwg
          wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
          ttgJtRGJQctTZtZT
          CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
