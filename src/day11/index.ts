import run from 'aocrunner';
import { range } from '../utils/index.js';

interface Monkey {
  items: number[];
  operation: (n: number) => number;
  target: (n: number) => number;
  inspections: number;
}

interface Monkeys {
  [index: number]: Monkey;
}

const parseItems = (text: string) => (text.match(/\d+/g) || []).map((n) => +n);

const square = (n: number) => n * n;
const multiply = (by: number) => (n: number) => n * by;
const add = (by: number) => (n: number) => n + by;

const parseOperation = (operationLine: string) => {
  const [op, by] = operationLine
    .trim()
    .slice('Operation: new = old '.length)
    .split(/\s/);
  return Number.isNaN(+by) ? square : op == '*' ? multiply(+by) : add(+by);
};

const isDivisible = (by: number) => (n: number) => n % by == 0;

const getTarget =
  (test: (n: number) => boolean, passTarget: number, failTarget: number) =>
  (n: number) =>
    test(n) ? passTarget : failTarget;

const parseTarget = (testLines: string[]) => {
  const [by, pass, fail] = testLines
    .map((line) => line.match(/\d+/g) || [])
    .flat()
    .map((n) => +n);
  return getTarget(isDivisible(by), pass, fail);
};

const parseInput = (rawInput: string): Monkeys =>
  rawInput
    .split(/\n\n/)
    .map((monkey) => monkey.split(/\n/))
    .map(([, items, operation, ...rest]) => ({
      items: parseItems(items),
      operation: parseOperation(operation),
      target: parseTarget(rest),
      inspections: 0,
    }))
    .reduce((monkeys: Monkeys, monkey, i) => ({ ...monkeys, [i]: monkey }), {});

const withItem = (monkey: Monkey, item: number) => ({
  ...monkey,
  items: monkey.items.concat(item),
});

const decay = (n: number) => Math.floor(n / 3);

const takeTurn = (monkeys: Monkeys, index: number) => {
  const { items, operation, target, inspections } = monkeys[index];

  const monkeysWithItems = items.reduce((monkeys, item) => {
    const newItem = decay(operation(item));
    const ti = target(newItem);
    return { ...monkeys, [ti]: withItem(monkeys[ti], newItem) };
  }, monkeys);

  const monkey = {
    ...monkeys[index],
    items: [],
    inspections: inspections + items.length,
  };
  return { ...monkeysWithItems, [index]: monkey };
};

const display = (monkeys: Monkeys) =>
  console.log(
    Object.values(monkeys)
      .map(({ items }: Monkey, i) => `Monkey ${i}: ${items.join(', ')}`)
      .join('\n'),
    '\n',
  );

const part1 = (rawInput: string) => {
  const rounds = 20;
  const input: Monkeys = parseInput(rawInput);
  const numberOfMonkeys = Object.keys(input).length;

  const output: Monkeys = range(rounds).reduce(
    (monkeys) => range(numberOfMonkeys).reduce(takeTurn, monkeys),
    input,
  );

  return Object.values(output)
    .map(({ inspections }: Monkey) => inspections)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((product, inspections) => product * inspections);
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
          Monkey 0:
            Starting items: 79, 98
            Operation: new = old * 19
            Test: divisible by 23
              If true: throw to monkey 2
              If false: throw to monkey 3

          Monkey 1:
            Starting items: 54, 65, 75, 74
            Operation: new = old + 6
            Test: divisible by 19
              If true: throw to monkey 2
              If false: throw to monkey 0

          Monkey 2:
            Starting items: 79, 60, 97
            Operation: new = old * old
            Test: divisible by 13
              If true: throw to monkey 1
              If false: throw to monkey 3

          Monkey 3:
            Starting items: 74
            Operation: new = old + 3
            Test: divisible by 17
              If true: throw to monkey 0
              If false: throw to monkey 1`,
        expected: 10605,
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
