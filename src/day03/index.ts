import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.trim().split(/\n\s*/);

const commonCharacter = ([first, ...rest]: string[]) =>
  first
    .split('')
    .filter((c) => rest.every((text) => text.includes(c)))
    .at(0);

//char codes: a-z: 97-122, A-Z: 65-90
//priorities: a-z: 1-26, A-Z: 27-52
const characterPriority = (c: string) =>
  ((n: number) => (n < 97 ? n - 65 + 27 : n - 97 + 1))(c.charCodeAt(0));

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .map((line) => [
      line.slice(0, line.length / 2),
      line.slice(line.length / 2),
    ])
    .map(commonCharacter)
    .filter((c): c is string => !!c)
    .map(characterPriority)
    .reduce((sum, p) => sum + p);

const part2 = (rawInput: string) =>
  parseInput(rawInput)
    .reduce(
      (groups: string[][], line, i) =>
        ((gi: number) => [
          ...groups.slice(0, gi),
          (groups[gi] || []).concat(line),
        ])(Math.floor(i / 3)),
      [],
    )
    .map(commonCharacter)
    .filter((c): c is string => !!c)
    .map(characterPriority)
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
