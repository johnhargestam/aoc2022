import run from 'aocrunner';

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split(/\n/)
    .map((line) => line.split(/\s/));

const isWin = (opp: string, you: string) =>
  (opp == 'A' && you == 'Y') ||
  (opp == 'B' && you == 'Z') ||
  (opp == 'C' && you == 'X');

const isDraw = (opp: string, you: string) =>
  (opp == 'A' && you == 'X') ||
  (opp == 'B' && you == 'Y') ||
  (opp == 'C' && you == 'Z');

const winScore = (opp: string, you: string) =>
  isWin(opp, you) ? 6 : isDraw(opp, you) ? 3 : 0;

const shapeScore = (you: string) => (you == 'X' ? 1 : you == 'Y' ? 2 : 3);

const playScore = (opp: string, you: string) =>
  shapeScore(you) + winScore(opp, you);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .map(([opp, you]) => playScore(opp, you))
    .reduce((sum, score) => sum + score);
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
A Y
B X
C Z`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
