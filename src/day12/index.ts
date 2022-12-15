import run from 'aocrunner';

interface Position {
  x: number;
  y: number;
}

interface Visited {
  hasPosition: (position: Position) => boolean;
  addVisit: (position: Position) => Visited;
}

interface Progress {
  first: [Position, number];
  enqueue: (position: Position, steps: number) => Progress;
  dequeue: () => Progress;
}

const createHasPosition =
  (current: Set<number>, xMax: number) =>
  ({ x, y }: Position): boolean =>
    current.has(x + y * xMax);

const createAddVisit =
  (previous: Set<number>, xMax: number) =>
  ({ x, y }: Position): Visited =>
    createVisited( new Set([...previous, x + y * xMax]), xMax);

const createVisited = (set: Set<number>, xMax: number): Visited => ({
  hasPosition: createHasPosition(set, xMax),
  addVisit: createAddVisit(set, xMax),
});

const toHeight = (value: string): number =>
  value === 'S' ? 97 : value === 'E' ? 122 : value.charCodeAt(0);

const createGetPositions = (input: string, xMax: number) => {
  const values = input.split('').filter((char) => char !== '\n');
  return (value: string): Position[] =>
    values
      .map((char, index) => ({ char, index }))
      .filter(({ char }) => char === value)
      .map(({ index }) => ({ x: index % xMax, y: Math.floor(index / xMax) }));
};

const createEnqueue =
  (positionSteps: [Position, number][]) =>
  (position: Position, steps: number): Progress =>
    createProgress([...positionSteps, [position, steps]]);

const createDequeue =
  ([, ...rest]: [Position, number][]) =>
  (): Progress =>
    createProgress(rest);

const createProgress = (positionSteps: [Position, number][]): Progress => ({
  first: positionSteps.at(0)!,
  enqueue: createEnqueue(positionSteps),
  dequeue: createDequeue(positionSteps),
});

const parseInput = (rawInput: string) => {
  const xMax = rawInput.indexOf('\n');
  const getPositions = createGetPositions(rawInput, xMax);
  const matrix = rawInput.split('\n').map((row) => row.split('').map(toHeight));
  return {
    matrix,
    start: getPositions('S').at(0)!,
    end: getPositions('E').at(0)!,
    lowest: getPositions('a'),
    visited: createVisited(new Set(), xMax),
  };
};

const isValidPosition =
  (matrix: number[][]) =>
  ({ x, y }: Position) =>
    matrix[y] !== undefined && matrix[y][x] !== undefined;

const isClimbable =
  (matrix: number[][], current: Position) =>
  (candidate: Position): boolean =>
    matrix[candidate.y][candidate.x] <= matrix[current.y][current.x] + 1;

const equals = (current: Position, target: Position): boolean =>
  current.x === target.x && current.y === target.y;

const fewestStepsToEnd = (
  matrix: number[][],
  progress: Progress,
  visited: Visited,
  end: Position,
): number => {
  const [current, steps] = progress.first;
  if (equals(current, end)) {
    return steps;
  }
  const [newProgress, newVisited] = [
    { x: current.x + 1, y: current.y },
    { x: current.x - 1, y: current.y },
    { x: current.x, y: current.y + 1 },
    { x: current.x, y: current.y - 1 },
  ]
    .filter(isValidPosition(matrix))
    .filter(isClimbable(matrix, current))
    .reduce(
      ([progress, visited], next) =>
        !visited.hasPosition(next)
          ? [
              progress.enqueue(next, steps + 1),
              visited.addVisit(next),
            ]
          : [progress, visited],
      [progress, visited],
    );

  return fewestStepsToEnd(
    matrix,
    newProgress.dequeue(),
    newVisited.addVisit(current),
    end,
  );
};

const part1 = (rawInput: string) => {
  const { matrix, start, end, visited } = parseInput(rawInput);
  const progress = createProgress([[start, 0]]);
  return fewestStepsToEnd(matrix, progress, visited, end);
};

const part2 = (rawInput: string) => {
  const { matrix, start, lowest, end, visited } = parseInput(rawInput);
  const progress = createProgress(
    lowest.concat(start).map((position) => [position, 0]),
  );
  return fewestStepsToEnd(matrix, progress, visited, end);
};

run({
  part1: {
    tests: [
      {
        input: `
          Sabqponm
          abcryxxl
          accszExk
          acctuvwj
          abdefghi`,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Sabqponm
          abcryxxl
          accszExk
          acctuvwj
          abdefghi`,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
