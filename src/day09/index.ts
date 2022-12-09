import run from 'aocrunner';

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

const range = (length: number): number[] => [...Array(length).keys()];

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

interface State {
  head: Position;
  tail: Position;
  history: Position[];
}

const part1 = (rawInput: string) => {
  const { history } = parseInput(rawInput).reduce(
    ({ head, tail, history }: State, vector) => {
      const updatedHead = move(head, vector);
      const steps = stepsInDirection(tail, vectorBetween(tail, updatedHead));
      return {
        head: updatedHead,
        tail: steps.at(-1) || tail,
        history: [...history, ...steps],
      };
    },
    {
      head: { x: 0, y: 0 },
      tail: { x: 0, y: 0 },
      history: [{ x: 0, y: 0 }],
    },
  );
  return new Set(history.map(({ x, y }) => [x, y].join())).size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
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
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
