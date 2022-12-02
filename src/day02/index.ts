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

const shapeScore = (shape: string) => (shape == 'X' ? 1 : shape == 'Y' ? 2 : 3);

const playScore = (opp: string, you: string) =>
  shapeScore(you) + winScore(opp, you);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .map(([opp, you]) => playScore(opp, you))
    .reduce((sum, score) => sum + score);
};

const targetScore = (result: string) =>
  result == 'X' ? 0 : result == 'Y' ? 3 : 6;

const winShape = (opp: string) => (opp == 'A' ? 'Y' : opp == 'B' ? 'Z' : 'X');

const drawShape = (opp: string) => (opp == 'A' ? 'X' : opp == 'B' ? 'Y' : 'Z');

const loseShape = (opp: string) => (opp == 'A' ? 'Z' : opp == 'B' ? 'X' : 'Y');

const resultShape = (opp: string, result: string) =>
  result == 'X'
    ? loseShape(opp)
    : result == 'Y'
    ? drawShape(opp)
    : winShape(opp);

const resultScore = (opp: string, result: string) =>
  shapeScore(resultShape(opp, result)) + targetScore(result);

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .map(([opp, result]) => resultScore(opp, result))
    .reduce((sum, score) => sum + score);
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
      {
        input: `
A Y
B X
C Z`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
