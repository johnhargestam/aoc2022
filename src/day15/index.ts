import run from 'aocrunner';

interface Position {
  x: number;
  y: number;
}

interface Sensor {
  position: Position;
  reach: number;
}

interface Scans {
  sensors: Sensor[];
  beacons: Position[];
}

interface Line {
  yMin: number;
  yMax: number;
}

const { abs, max, min } = Math;

const findNumbers = (text: string) => (text.match(/-?\d+/g) || []).map(Number);

const distance = (a: Position, b: Position) => abs(a.x - b.x) + abs(a.y - b.y);

const parseInput = (rawInput: string): Scans => {
  const scans = rawInput
    .split('\n')
    .map(findNumbers)
    .map(([sx, sy, bx, by]: number[]) => ({
      sensor: { x: sx, y: sy },
      beacon: { x: bx, y: by },
    }));
  const sensors = scans.map(({ sensor, beacon }) => ({
    position: sensor,
    reach: distance(sensor, beacon),
  }));
  const beacons = scans.map(({ beacon }) => beacon);
  return {
    sensors,
    beacons,
  };
};

const isAlongY = (y: number) => (position: Position) => y === position.y;

const yPoint = ({ y }: Position) => y;

const isReachWithinY =
  (y: number) =>
  ({ position, reach }: Sensor): boolean =>
    abs(position.y - y) <= reach;

const lineAlongY =
  (y: number) =>
  ({ position, reach }: Sensor): Line => {
    const horizontal = reach - abs(position.y - y);
    return { yMin: position.x - horizontal, yMax: position.x + horizontal };
  };

const linesAscending = (a: Line, b: Line): number =>
  a.yMin - b.yMin !== 0 ? a.yMin - b.yMin : a.yMax - b.yMax;

const mergeOverlappingLines = (a: Line, b: Line): Line[] =>
  a.yMax >= b.yMin
    ? [{ yMin: min(a.yMin, b.yMin), yMax: max(a.yMax, b.yMax) }]
    : [a, b];

const mergeLastOverlappingLine = (lines: Line[], line: Line): Line[] =>
  lines.at(-1)
    ? [...lines.slice(0, -1), ...mergeOverlappingLines(lines.at(-1)!, line)]
    : [line];

const isPointBetween = (min: number, max: number) => (point: number) =>
  min <= point && point <= max;

const lengthExceptPoints =
  (points: number[]) =>
  ({ yMin, yMax }: Line) =>
    yMax - yMin + 1 - points.filter(isPointBetween(yMin, yMax)).length;

const unique = (numbers: number[]) => [...new Set(numbers)];

const sum = (a: number, b: number) => a + b;

const Y_AXIS = 2000000;

const part1 = (rawInput: string) => {
  const { sensors, beacons } = parseInput(rawInput);

  const pointsAlongY = beacons.filter(isAlongY(Y_AXIS)).map(yPoint);

  const linesAlongY = sensors
    .filter(isReachWithinY(Y_AXIS))
    .map(lineAlongY(Y_AXIS))
    .sort(linesAscending)
    .reduce(mergeLastOverlappingLine, []);

  return linesAlongY
    .map(lengthExceptPoints(unique(pointsAlongY)))
    .reduce(sum, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      // Y_AXIS = 10
      // {
      //   input: `
      //     Sensor at x=2, y=18: closest beacon is at x=-2, y=15
      //     Sensor at x=9, y=16: closest beacon is at x=10, y=16
      //     Sensor at x=13, y=2: closest beacon is at x=15, y=3
      //     Sensor at x=12, y=14: closest beacon is at x=10, y=16
      //     Sensor at x=10, y=20: closest beacon is at x=10, y=16
      //     Sensor at x=14, y=17: closest beacon is at x=10, y=16
      //     Sensor at x=8, y=7: closest beacon is at x=2, y=10
      //     Sensor at x=2, y=0: closest beacon is at x=2, y=10
      //     Sensor at x=0, y=11: closest beacon is at x=2, y=10
      //     Sensor at x=20, y=14: closest beacon is at x=25, y=17
      //     Sensor at x=17, y=20: closest beacon is at x=21, y=22
      //     Sensor at x=16, y=7: closest beacon is at x=15, y=3
      //     Sensor at x=14, y=3: closest beacon is at x=15, y=3
      //     Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
      //   expected: 26,
      // },
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
