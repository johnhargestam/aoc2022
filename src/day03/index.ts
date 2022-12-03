import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.trim().split(/\n\s*/);

//char codes: A: 65, Z: 90, a: 97, z: 122
//priorities: a-z: 1-26, A-Z: 27-52
const priority = (c: string) =>
  ((n: number) => (n < 97 ? n - 65 + 27 : n - 97 + 1))(c.charCodeAt(0));

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .map((rucksack) => [
      rucksack.slice(0, rucksack.length / 2).split(''),
      rucksack.slice(rucksack.length / 2).split(''),
    ])
    .map(([c1, c2]) => c1.filter((c) => c2.includes(c)))
    .map(([common]) => priority(common))
    .reduce((sum, p) => sum + p);

const part2 = (rawInput: string) =>
  parseInput(rawInput)
    .reduce(
      (groups: string[][], single, i) =>
        ((gi: number) => [
          ...groups.slice(0, gi),
          (groups[gi] || []).concat(single),
        ])(Math.floor(i / 3)),
      [],
    )
    .map(([first, ...rest]) =>
      first
        .split('')
        .filter((c) => rest.every((rucksack) => rucksack.includes(c))),
    )
    .map(([common]) => priority(common))
    .reduce((sum, p) => sum + p);

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
    tests: [
      {
        input: `
          vJrwpWtwJgWrhcsFMMfFFhFp
          jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
          PmmdzqPrVvPwwTWBwg
          wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
          ttgJtRGJQctTZtZT
          CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
