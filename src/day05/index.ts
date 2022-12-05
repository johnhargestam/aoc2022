import run from 'aocrunner';

interface Stacks {
  [stack: number]: string[];
}

interface Procedure {
  amount: number;
  from: number;
  to: number;
}

interface Input {
  stacks: Stacks;
  procedures: Procedure[];
}

const toStacks = (lines: string): Stacks =>
  lines
    .split(/\n/)
    .map((line) => line.match(/(.{3,4})/g) || [])
    .slice(0, -1)
    .reduce(
      (stacks: string[][], items: string[]) => [
        ...items.map((crate, i) => (stacks[i] || []).concat(crate)),
      ],
      [],
    )
    .map((stack) =>
      stack
        .map((crate) => (([id]: string[]) => id)(crate.match(/\w/) || []))
        .filter((id) => !!id),
    )
    .reduce(
      (stacks: Stacks, crates, i) => ({ ...stacks, [i + 1]: crates }),
      {},
    );

const toProcedure = (line: string): Procedure =>
  (([, amount, from, to]: number[]) => ({ amount, from, to }))(
    (line.match(/(\d+)\D+(\d+)\D+(\d+)/) || []).map((n) => +n),
  );

const parseInput = (rawInput: string): Input =>
  (([head, body]: string[]) => ({
    stacks: toStacks(head),
    procedures: body.split(/\n/).map(toProcedure),
  }))(rawInput.split(/\n\n/));

const moveCrates9000 = (stacks: Stacks, { amount, from, to }: Procedure) => ({
  ...stacks,
  [from]: stacks[from].slice(amount),
  [to]: stacks[from].slice(0, amount).reverse().concat(stacks[to]),
});

const moveCrates9001 = (stacks: Stacks, { amount, from, to }: Procedure) => ({
  ...stacks,
  [from]: stacks[from].slice(amount),
  [to]: stacks[from].slice(0, amount).concat(stacks[to]),
});

const part1 = (rawInput: string) =>
  Object.values(
    (({ stacks, procedures }) =>
      procedures.reduce(
        (stacks, procedure) => moveCrates9000(stacks, procedure),
        stacks,
      ))(parseInput(rawInput)),
  )
    .map((stack) => stack.at(0) || '')
    .join('');

const part2 = (rawInput: string) =>
  Object.values(
    (({ stacks, procedures }) =>
      procedures.reduce(
        (stacks, procedure) => moveCrates9001(stacks, procedure),
        stacks,
      ))(parseInput(rawInput)),
  )
    .map((stack) => stack.at(0) || '')
    .join('');

run({
  part1: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: 'CMZ',
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: 'MCD',
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
