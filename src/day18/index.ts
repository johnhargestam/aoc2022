import run from 'aocrunner';

type Vector = [x: number, y: number, z: number];

const parseInput = (rawInput: string): Vector[] =>
  rawInput
    .split(/\n/)
    .map((vector) => vector.split(/,/).map((n) => +n))
    .map(([x, y, z]) => [x, y, z]);

const adjacentTo = ([x, y, z]: Vector): Vector[] => [
  [x + 1, y, z],
  [x - 1, y, z],
  [x, y + 1, z],
  [x, y - 1, z],
  [x, y, z + 1],
  [x, y, z - 1],
];

const equals =
  ([ax, ay, az]: Vector) =>
  ([bx, by, bz]: Vector) =>
    ax === bx && ay === by && az === bz;

const notContainedIn = (all: Vector[]) => (vector: Vector) =>
  all.findIndex(equals(vector)) === -1;

const countSides = (vector: Vector, all: Vector[]) =>
  adjacentTo(vector).filter(notContainedIn(all)).length;

const sum = (a: number, b: number) => a + b;

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .map((vector, _, all) => countSides(vector, all))
    .reduce(sum);

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
          2,2,2
          1,2,2
          3,2,2
          2,1,2
          2,3,2
          2,2,1
          2,2,3
          2,2,4
          2,2,6
          1,2,5
          3,2,5
          2,1,5
          2,3,5`,
        expected: 64,
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
