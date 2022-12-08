import run from 'aocrunner';

interface Tree {
  x: number;
  y: number;
  height: number;
}

class TreeGrid {
  private trees: Tree[][];

  constructor(trees: Tree[][]) {
    this.trees = trees;
  }

  public getTrees(): Tree[] {
    return this.trees.flat();
  }

  public treesEast(x: number, y: number): Tree[] {
    const trees = this.trees;
    return [
      ...(function* iter() {
        for (let i = x + 1; i < trees[y].length; i++) {
          yield trees[y][i];
        }
      })(),
    ];
  }

  public treesWest(x: number, y: number): Tree[] {
    const trees = this.trees;
    return [
      ...(function* iter() {
        for (let i = x - 1; i >= 0; i--) {
          yield trees[y][i];
        }
      })(),
    ];
  }

  public treesSouth(x: number, y: number): Tree[] {
    const trees = this.trees;
    return [
      ...(function* iter() {
        for (let i = y + 1; i < trees.length; i++) {
          yield trees[i][x];
        }
      })(),
    ];
  }

  public treesNorth(x: number, y: number): Tree[] {
    const trees = this.trees;
    return [
      ...(function* iter() {
        for (let i = y - 1; i >= 0; i--) {
          yield trees[i][x];
        }
      })(),
    ];
  }
}

const range = (length: number) => [...Array(length).keys()];

const parseInput = (rawInput: string): TreeGrid => {
  const trees = rawInput.split(/\n/).map((line, y) =>
    line
      .split('')
      .map((n) => +n)
      .map((height, x) => ({ x, y, height })),
  );
  return new TreeGrid(trees);
};

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);

  const visibleTrees = grid
    .getTrees()
    .filter(
      ({ x, y, height }) =>
        grid.treesWest(x, y).every((other) => other.height < height) ||
        grid.treesEast(x, y).every((other) => other.height < height) ||
        grid.treesNorth(x, y).every((other) => other.height < height) ||
        grid.treesSouth(x, y).every((other) => other.height < height),
    );

  return visibleTrees.length;
};

const treesInView = (trees: Tree[], height: number) => {
  const lastTreeIndex = trees.findIndex((other) => other.height >= height);
  return lastTreeIndex == -1 ? trees.length : lastTreeIndex + 1;
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);

  const scores = grid
    .getTrees()
    .map(
      ({ x, y, height }) =>
        treesInView(grid.treesNorth(x, y), height) *
        treesInView(grid.treesWest(x, y), height) *
        treesInView(grid.treesEast(x, y), height) *
        treesInView(grid.treesSouth(x, y), height),
    );

  return Math.max(...scores);
};

run({
  part1: {
    tests: [
      {
        input: `
          30373
          25512
          65332
          33549
          35390`,
        expected: 21,
      },
    ],
    solution: part1,
  },

  part2: {
    tests: [
      {
        input: `
          30373
          25512
          65332
          33549
          35390`,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
