import run from 'aocrunner';
import { range } from '../utils/index.js';

type Point = {
  x: number;
  y: number;
};

type Path = {
  a: Point;
  b: Point;
};

const parseInput = (rawInput: string): Path[] =>
  rawInput.split('\n').flatMap((path) =>
    path
      .split(' -> ')
      .map((vector) => vector.split(',').map((n) => +n))
      .map(([x, y]) => ({ x, y } as Point))
      .map((point, index, points) => ({ a: point, b: points[index + 1] }))
      .slice(0, -1),
  );

const equals = (a: Point) => (b: Point) => a.x === b.x && a.y === b.y;

const { min, max } = Math;

const isBetween =
  (a: number, b: number) =>
  (n: number): boolean =>
    min(a, b) <= n && n <= max(a, b);

const isPointOnPath =
  ({ x, y }: Point) =>
  ({ a, b }: Path) =>
    isBetween(a.x, b.x)(x) && isBetween(a.y, b.y)(y);

const sourceOfSand: Point = { x: 500, y: 0 };

const renderPoint = (paths: Path[], resting: Point[]) => (point: Point) =>
  equals(point)(sourceOfSand)
    ? '+'
    : paths.some(isPointOnPath(point))
    ? '#'
    : resting.some(equals(point))
    ? 'o'
    : '.';

const render = (min: Point, max: Point, paths: Path[], resting: Point[]) =>
  range(max.y - min.y + 1, min.y)
    .map((y) =>
      range(max.x - min.x + 1, min.x)
        .map((x) => ({ x, y }))
        .map(renderPoint(paths, resting))
        .join(''),
    )
    .join('\n');

const findYMax = (paths: Path[]) =>
  max(...paths.flatMap(({ a, b }) => [a, b].map(({ y }) => y)));

const restingPoint = (
  paths: Path[],
  resting: Point[],
  yMax: number,
  { x, y } = sourceOfSand,
): Point | undefined => {
  if (y > yMax) {
    return;
  }
  const nextPoint = [
    { x, y: y + 1 },
    { x: x - 1, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ].find(
    (candidate) =>
      !(
        paths.some(isPointOnPath(candidate)) || resting.some(equals(candidate))
      ),
  );
  return nextPoint === undefined
    ? { x, y }
    : restingPoint(paths, resting, yMax, nextPoint);
};

const allResting = (paths: Path[], resting = [] as Point[]): Point[] => {
  const yMax = findYMax(paths);
  const pointOfSand = restingPoint(paths, resting, yMax);
  return pointOfSand === undefined
    ? resting
    : allResting(paths, [...resting, pointOfSand]);
};

const part1 = (rawInput: string) => allResting(parseInput(rawInput)).length;

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
          498,4 -> 498,6 -> 496,6
          503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 24,
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
