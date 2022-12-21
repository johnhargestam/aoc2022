import run from 'aocrunner';

interface Command {
  cd: string;
  size: number;
}

interface Folder {
  name: string;
  parent: string;
  depth: number;
  size: number;
}

interface FolderSize {
  [name: string]: number;
}

const parseCommand = ([cd, ...ls]: string[]): Command => ({
  cd: cd.split(/\s/).at(-1) || '',
  size: ls
    .slice(1)
    .map((line) => line.split(/\s/))
    .filter(([first]) => first !== 'dir')
    .reduce((sum, [size]) => sum + +size, 0),
});

const CD_LS = /(\$ cd[^$]+(?:\$ ls[^$]+)?)/;

const notEmpty = ({ length }: string) => length > 0;

const parseCommands = (rawInput: string) =>
  rawInput
    .split(CD_LS)
    .filter(notEmpty)
    .map((cdls) => cdls.split(/\n/).filter(notEmpty))
    .map(parseCommand);

const toFolders = (commands: Command[]): Folder[] =>
  commands.reduce(
    ({ folders, stack }, { cd, size }) =>
      cd == '..'
        ? {
            folders,
            stack: stack.slice(0, -1),
          }
        : {
            folders: folders.concat({
              name: stack.concat(cd).join(),
              depth: stack.length,
              parent: stack.join(),
              size,
            }),
            stack: stack.concat(cd),
          },
    {
      folders: [] as Folder[],
      stack: [] as string[],
    },
  ).folders;

const parseInput = (rawInput: string): Folder[] =>
  toFolders(parseCommands(rawInput));

const byDepthDescending = (a: Folder, b: Folder) => b.depth - a.depth;

const toSizes = (folders: Folder[]) =>
  Object.values(
    folders
      .sort(byDepthDescending)
      .reduce((folderSize: FolderSize, { name, parent, size }) => {
        const recursiveSize = size + (folderSize[name] || 0);
        return {
          ...folderSize,
          [name]: recursiveSize,
          [parent]: (folderSize[parent] || 0) + recursiveSize,
        };
      }, {}),
  );

const MAX_SIZE = 100000;

const part1 = (rawInput: string) =>
  toSizes(parseInput(rawInput))
    .filter((size) => size <= MAX_SIZE)
    .reduce((sum, size) => sum + size);

const { max, min } = Math;

const TOTAL_SPACE = 70000000;
const NEEDED_SPACE = 30000000;

const requiredSpace = (sizes: number[]) => {
  const usedSpace = max(...sizes);
  const unusedSpace = TOTAL_SPACE - usedSpace;
  return NEEDED_SPACE - unusedSpace;
};

const part2 = (rawInput: string) => {
  const sizes = toSizes(parseInput(rawInput));
  const required = requiredSpace(sizes);
  return min(...sizes.filter((size) => size >= required));
};

run({
  part1: {
    tests: [
      {
        input: `
          $ cd /
          $ ls
          dir a
          14848514 b.txt
          8504156 c.dat
          dir d
          $ cd a
          $ ls
          dir e
          29116 f
          2557 g
          62596 h.lst
          $ cd e
          $ ls
          584 i
          $ cd ..
          $ cd ..
          $ cd d
          $ ls
          4060174 j
          8033020 d.log
          5626152 d.ext
          7214296 k`,
        expected: 95437,
      },
    ],
    solution: part1,
  },

  part2: {
    tests: [
      {
        input: `
          $ cd /
          $ ls
          dir a
          14848514 b.txt
          8504156 c.dat
          dir d
          $ cd a
          $ ls
          dir e
          29116 f
          2557 g
          62596 h.lst
          $ cd e
          $ ls
          584 i
          $ cd ..
          $ cd ..
          $ cd d
          $ ls
          4060174 j
          8033020 d.log
          5626152 d.ext
          7214296 k`,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
