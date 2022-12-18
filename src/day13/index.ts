import run from 'aocrunner';
import { range } from '../utils/index.js';

enum Order {
  LeftBeforeRight = -1,
  KeepInPlace = 0,
  LeftAfterRight = 1,
}

type Value = number | Value[];

type Pair = [Value[], Value[]];

const parseInput = (rawInput: string): Pair[] =>
  rawInput
    .split('\n\n')
    .map((pair) => pair.split('\n').map((line) => JSON.parse(line) as Value[]))
    .map(([left, right]) => [left, right]);

const { max } = Math;

const zip = <T>(left: T[], right: T[]): [T | undefined, T | undefined][] =>
  range(max(left.length, right.length)).reduce(
    (zipped, index) => [...zipped, [left[index], right[index]]],
    [] as [T | undefined, T | undefined][],
  );

const { isArray } = Array;

const isUndefined = (arg: any): arg is undefined => arg === undefined;

const compareNumbers = (left: number, right: number): Order =>
  left < right
    ? Order.LeftBeforeRight
    : left > right
    ? Order.LeftAfterRight
    : Order.KeepInPlace;

const compareArrays = (left: Value[], right: Value[]): Order =>
  zip(left, right).reduce(
    (order: Order, [left, right]) =>
      order !== Order.KeepInPlace
        ? order
        : isUndefined(left)
        ? Order.LeftBeforeRight
        : isUndefined(right)
        ? Order.LeftAfterRight
        : compareValues(left, right),
    Order.KeepInPlace,
  );

const compareArrayValue = (left: Value[], right: Value): Order =>
  isArray(right) ? compareArrays(left, right) : compareArrays(left, [right]);

const compareNumberValue = (left: number, right: Value): Order =>
  isArray(right) ? compareArrays([left], right) : compareNumbers(left, right);

const compareValues = (left: Value, right: Value): Order =>
  isArray(left)
    ? compareArrayValue(left, right)
    : compareNumberValue(left, right);

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .map(([left, right]) => compareValues(left, right))
    .map((order, index) => (order === Order.LeftBeforeRight ? index + 1 : 0))
    .reduce((sum, index) => sum + index);

const DIV2 = [[2]];
const DIV6 = [[6]];

const part2 = (rawInput: string) => {
  const sortedValues = parseInput(rawInput)
    .reduce((values: Value[], pair) => values.concat(pair), [DIV2, DIV6])
    .sort(compareValues);
  const indexOfDiv2 = sortedValues.findIndex(
    (value) => JSON.stringify(value) === JSON.stringify(DIV2),
  );
  const indexOfDiv6 = sortedValues.findIndex(
    (value) => JSON.stringify(value) === JSON.stringify(DIV6),
  );
  return (indexOfDiv2 + 1) * (indexOfDiv6 + 1);
};

run({
  part1: {
    tests: [
      {
        input: `
          [1,1,3,1,1]
          [1,1,5,1,1]
          
          [[1],[2,3,4]]
          [[1],4]
          
          [9]
          [[8,7,6]]
          
          [[4,4],4,4]
          [[4,4],4,4,4]
          
          [7,7,7,7]
          [7,7,7]
          
          []
          [3]
          
          [[[]]]
          [[]]
          
          [1,[2,[3,[4,[5,6,7]]]],8,9]
          [1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          [1,1,3,1,1]
          [1,1,5,1,1]
          
          [[1],[2,3,4]]
          [[1],4]
          
          [9]
          [[8,7,6]]
          
          [[4,4],4,4]
          [[4,4],4,4,4]
          
          [7,7,7,7]
          [7,7,7]
          
          []
          [3]
          
          [[[]]]
          [[]]
          
          [1,[2,[3,[4,[5,6,7]]]],8,9]
          [1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
