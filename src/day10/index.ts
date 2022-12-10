import run from 'aocrunner';
import { range } from '../utils/index.js';

interface Instruction {
  time: number;
  add: number;
}

const parseInput = (rawInput: string): Instruction[] =>
  rawInput
    .split(/\n/)
    .map((line) => line.split(/\s/))
    .map(([opcode, n]) => ({
      time: opcode == 'noop' ? 1 : 2,
      add: n ? +n : 0,
    }));

const registerValues = (instructions: Instruction[]) =>
  instructions.reduce(
    ({ values, value }, { time, add }) => ({
      values: values.concat(range(time).map(() => value)),
      value: value + add,
    }),
    {
      values: [1],
      value: 1,
    },
  ).values;

const part1 = (rawInput: string) => {
  const values = registerValues(parseInput(rawInput));
  return [20, 60, 100, 140, 180, 220]
    .map((i) => i * values[i])
    .reduce((sum, strength) => sum + strength);
};

const isLit = (value: number, cycle: number) =>
  cycle >= value - 1 && cycle <= value + 1;

const part2 = (rawInput: string) =>
  registerValues(parseInput(rawInput))
    .slice(1)
    .map((value, cycle) => (isLit(value, cycle % 40) ? '#' : '.'))
    .reduce(
      (rows: string[][], pixel, i) =>
        ((gi: number) => [
          ...rows.slice(0, gi),
          (rows[gi] || []).concat(pixel),
        ])(Math.floor(i / 40)),
      [],
    )
    .map((row) => row.join(''))
    .join('\n');

const testInput = `
  addx 15
  addx -11
  addx 6
  addx -3
  addx 5
  addx -1
  addx -8
  addx 13
  addx 4
  noop
  addx -1
  addx 5
  addx -1
  addx 5
  addx -1
  addx 5
  addx -1
  addx 5
  addx -1
  addx -35
  addx 1
  addx 24
  addx -19
  addx 1
  addx 16
  addx -11
  noop
  noop
  addx 21
  addx -15
  noop
  noop
  addx -3
  addx 9
  addx 1
  addx -3
  addx 8
  addx 1
  addx 5
  noop
  noop
  noop
  noop
  noop
  addx -36
  noop
  addx 1
  addx 7
  noop
  noop
  noop
  addx 2
  addx 6
  noop
  noop
  noop
  noop
  noop
  addx 1
  noop
  noop
  addx 7
  addx 1
  noop
  addx -13
  addx 13
  addx 7
  noop
  addx 1
  addx -33
  noop
  noop
  noop
  addx 2
  noop
  noop
  noop
  addx 8
  noop
  addx -1
  addx 2
  addx 1
  noop
  addx 17
  addx -9
  addx 1
  addx 1
  addx -3
  addx 11
  noop
  noop
  addx 1
  noop
  addx 1
  noop
  noop
  addx -13
  addx -19
  addx 1
  addx 3
  addx 26
  addx -30
  addx 12
  addx -1
  addx 3
  addx 1
  noop
  noop
  noop
  addx -9
  addx 18
  addx 1
  addx 2
  noop
  noop
  addx 9
  noop
  noop
  noop
  addx -1
  addx 2
  addx -37
  addx 1
  addx 3
  noop
  addx 15
  addx -21
  addx 22
  addx -6
  addx 1
  noop
  addx 2
  addx 1
  noop
  addx -10
  noop
  noop
  addx 20
  addx 1
  addx 2
  addx 2
  addx -6
  addx -11
  noop
  noop
  noop`;

const trimIndentation = (text: string) =>
  text
    .split(/\n/)
    .map((line) => line.trim())
    .filter(({ length }) => length > 0)
    .join('\n');

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: trimIndentation(`
          ##..##..##..##..##..##..##..##..##..##..
          ###...###...###...###...###...###...###.
          ####....####....####....####....####....
          #####.....#####.....#####.....#####.....
          ######......######......######......####
          #######.......#######.......#######.....`),
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
