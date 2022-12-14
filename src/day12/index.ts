import run from 'aocrunner';

interface Position {
  x: number;
  y: number;
}

const parseInput = (rawInput: string): string[][] =>
  rawInput.split(/\n/).map((line) => line.split(''));

const isValidPosition =
  (grid: string[][]) =>
  ({ x, y }: Position) =>
    grid[y] !== undefined && grid[y][x] !== undefined;

const toString = ({ x, y }: Position): string => [x, y].join();

const getHeight = (grid: string[][], { x, y }: Position): number =>
  grid[y][x] === 'S' ? 97 : grid[y][x] === 'E' ? 122 : grid[y][x].charCodeAt(0);

const isClimbable =
  (grid: string[][], current: Position) =>
  (candidate: Position): boolean =>
    getHeight(grid, candidate) <= getHeight(grid, current) + 1;

const isNotVisited =
  (visited: Set<string>) =>
  (position: Position): boolean =>
    !visited.has(toString(position));

const addPosition = (set: Set<string>, position: Position): Set<string> =>
  new Set(set.add(toString(position)));

const fewestStepsToEnd = (
  grid: string[][],
  { x, y }: Position,
  visited: Set<string>,
  steps = 0,
): number =>
  grid[y][x] === 'E'
    ? steps
    : Math.min(
        ...[
          { x, y: y + 1 },
          { x, y: y - 1 },
          { x: x + 1, y },
          { x: x - 1, y },
        ]
          .filter(isValidPosition(grid))
          .filter(isClimbable(grid, { x, y }))
          .filter(isNotVisited(visited))
          .map((position) =>
            fewestStepsToEnd(
              grid,
              position,
              addPosition(visited, position),
              steps + 1,
            ),
          ),
      );

const getPosition = (grid: string[][], value: string): Position => {
  const y = grid.findIndex((row) => row.includes(value));
  const x = grid[y].indexOf(value);
  return { x, y };
};

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const start = getPosition(grid, 'S');
  return fewestStepsToEnd(grid, start, addPosition(new Set(), start));
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
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
