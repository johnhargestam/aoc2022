import run from 'aocrunner';

const parseInput = (rawInput: string) =>
  rawInput
    .split(/\n/)
    .map((line: string) => (line.startsWith('$ ') ? line.slice(2) : line))
    .filter((line) => line != 'ls')
    .map((line) => line.split(/\s/));

interface File {
  name: string;
  size: number;
}

interface Directory {
  name: string;
  children: Directory[];
  files: File[];
}

interface Location {
  current: Directory;
  history: Directory[];
}

interface DirectorySize {
  name: string;
  size: number;
}

const open = ({ current, history }: Location, name: string): Location => {
  switch (name) {
    case '/':
      return { current, history: [] };
    case '..':
      const parent = history.at(-1) || current;
      return {
        current: parent,
        history: history.slice(0, -1),
      };
    default:
      const child = current.children.find((child) => child.name == name);
      return {
        current: child || current,
        history: child ? history.concat(current) : history,
      };
  }
};

const spaces = (length: number) => Array(length).fill(' ').join('');

const render = ({ name, children, files }: Directory, depth = 0): string =>
  `${spaces(depth)}- ${name} (dir)\n`.concat(
    files
      .map(
        (file) =>
          `${spaces(depth + 2)}- ${file.name} (file, size=${file.size})`,
      )
      .concat(children.map((child) => render(child, depth + 2)))
      .sort()
      .join('\n'),
  );

const listSizes = ({ name, children, files }: Directory): DirectorySize[] => {
  const childSizes = children.map((child) => listSizes(child)).flat();
  const childTotal = childSizes.reduce((size, child) => size + child.size, 0);
  const fileTotal = files.reduce((size, file) => size + file.size, 0);

  return [{ name, size: childTotal + fileTotal }].concat(childSizes);
};

const part1 = (rawInput: string) => {
  const root: Directory = {
    name: '/',
    children: [],
    files: [],
  };
  const history: Directory[] = [];

  parseInput(rawInput).reduce(
    (location: Location, [a, b]) => {
      switch (a) {
        case 'cd':
          return open(location, b);
        case 'dir':
          location.current.children.push({ name: b, children: [], files: [] });
          return location;
        default:
          location.current.files.push({ name: b, size: +a });
          return location;
      }
    },
    { current: root, history },
  );

  //return render(root);

  return listSizes(root)
    .filter(({ size }) => size <= 100000)
    .reduce((total, { size }) => total + size, 0);
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
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
