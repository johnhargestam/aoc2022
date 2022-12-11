import run from 'aocrunner';
import { range } from '../utils/index.js';

interface Vector {
  dx: number;
  dy: number;
}

const parseInput = (rawInput: string): Vector[] =>
  rawInput
    .split(/\n/)
    .map((line) => line.split(/\s/))
    .map(
      ([direction, steps]) =>
        ({
          L: { dx: -Number(steps), dy: 0 },
          U: { dx: 0, dy: -Number(steps) },
          R: { dx: Number(steps), dy: 0 },
          D: { dx: 0, dy: Number(steps) },
        }[direction]!),
    );

interface Position {
  x: number;
  y: number;
}

const absoluteDecrement = (n: number): number =>
  n > 0 ? n - 1 : n < 0 ? n + 1 : n;

const absoluteMax = (...n: number[]): number => Math.max(...n.map(Math.abs));

const stepsNeeded = ({ dx, dy }: Vector): number =>
  Math.max(absoluteMax(dx, dy) - 1, 0);

const stepsInDirection = (position: Position, direction: Vector): Position[] =>
  range(stepsNeeded(direction)).reduce(
    ({ x, y, dx, dy, steps }) => {
      const step = {
        x: x + Math.sign(dx),
        y: y + Math.sign(dy),
      };
      return {
        x: step.x,
        y: step.y,
        dx: absoluteDecrement(dx),
        dy: absoluteDecrement(dy),
        steps: [...steps, step],
      };
    },
    {
      x: position.x,
      y: position.y,
      dx: direction.dx,
      dy: direction.dy,
      steps: [] as Position[],
    },
  ).steps;

const move = ({ x, y }: Position, { dx, dy }: Vector): Position => ({
  x: x + dx,
  y: y + dy,
});

const vectorBetween = (from: Position, to: Position): Vector => ({
  dx: to.x - from.x,
  dy: to.y - from.y,
});

const part1 = (rawInput: string) => {
  const { steps } = parseInput(rawInput).reduce(
    ({ head, tail, steps }, vector) => {
      const updatedHead = move(head, vector);
      const vectorToHead = vectorBetween(tail, updatedHead);
      const newSteps = stepsInDirection(tail, vectorToHead);
      const updatedTail = newSteps.at(-1) || tail;
      return {
        head: updatedHead,
        tail: updatedTail,
        steps: steps.concat(newSteps),
      };
    },
    {
      head: { x: 0, y: 0 },
      tail: { x: 0, y: 0 },
      steps: [{ x: 0, y: 0 }],
    },
  );
  return new Set(steps.map(({ x, y }) => [x, y].join())).size;
};

const point = (point: Position, head: Position, tails: Position[]) => {
  if (head.x == point.x && head.y == point.y) {
    return 'H';
  }
  const i = tails.findIndex((tail) => tail.x == point.x && tail.y == point.y);
  return i >= 0 ? `${i + 1}` : '.';
};

const render = (
  min: Position,
  max: Position,
  head: Position,
  tails: Position[],
) =>
  range(max.y - min.y + 1, min.y)
    .map((y) =>
      range(max.x - min.x + 1, min.x)
        .map((x) => point({ x, y }, head, tails))
        .join(''),
    )
    .join('\n');

const part2 = (rawInput: string) => {
  const { steps } = parseInput(rawInput).reduce(
    ({ head, tails, steps }, vector) => {
      const updatedHead = move(head, vector);

      const { updatedTails, newSteps } = tails.reduce(
        ({ updatedTails }, tail, i) => {
          const targetPosition = updatedTails[i - 1] || updatedHead;
          const vectorToTarget = vectorBetween(tail, targetPosition);
          const tailSteps = stepsInDirection(tail, vectorToTarget);
          return {
            updatedTails: updatedTails.concat(tailSteps.at(-1) || tail),
            newSteps: tailSteps,
          };
        },
        {
          updatedTails: [] as Position[],
          newSteps: [] as Position[],
        },
      );
      // console.log(
      //   render({ x: -11, y: -15 }, { x: 14, y: 5 }, updatedHead, updatedTails) + '\n',
      // );
      return {
        head: updatedHead,
        tails: updatedTails,
        steps: steps.concat(newSteps),
      };
    },
    {
      head: { x: 0, y: 0 },
      tails: range(9).map(() => ({ x: 0, y: 0 })),
      steps: [{ x: 0, y: 0 }],
    },
  );
  return new Set(steps.map(({ x, y }) => [x, y].join())).size;
};

run({
  part1: {
    tests: [
      {
        input: `
          R 4
          U 4
          L 3
          D 1
          R 4
          D 1
          L 5
          R 2`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
            R 4
            U 4
            L 3
            D 1
            R 4
            D 1
            L 5
            R 2`,
        expected: 1,
      },
      {
        input: `
            R 5
            U 8
            L 8
            D 3
            R 17
            D 10
            L 25
            U 20`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
