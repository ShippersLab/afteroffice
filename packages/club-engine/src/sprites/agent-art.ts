import { COLOR } from "./palette";
import { Pixels } from "./pixels";

export const AGENT_W = 13;
export const AGENT_H = 18;

export type AgentPose = "stand" | "dance" | "dj" | "bar" | "sleep" | "door" | "spill";
export type Accessory = "none" | "shades" | "hat" | "headphones";

export const ACCESSORIES: readonly Accessory[] = ["none", "shades", "hat", "headphones"];

type Body = { readonly main: number; readonly shade: number };

export const BODIES: readonly Body[] = [
  { main: COLOR.magenta, shade: 0xb02a74 },
  { main: COLOR.cyan, shade: 0x1f9db3 },
  { main: COLOR.amber, shade: 0xb38137 },
  { main: COLOR.lilac, shade: 0x8f82c4 },
];

const BASE: readonly string[] = [
  ".............",
  "...ooooooo...",
  "..oBBBBBBBo..",
  "..oBBBBBBBo..",
  "..offfffffo..",
  "..ofefffefo..",
  "..offfffffo..",
  "..oBBBBBBBo..",
  "...ooooooo...",
  "...oBBBBBo...",
  "...oBBBBBo...",
  "...obbbbbo...",
  "...oBBBBBo...",
  "...ooooooo...",
  "...oLLoLLo...",
  "...oLLoLLo...",
  "...oLLoLLo...",
  "...ooooooo...",
];

type Cell = readonly [number, number, string];

function mirror(cells: readonly Cell[]): Cell[] {
  return cells.map(([x, y, ch]) => [AGENT_W - 1 - x, y, ch]);
}

const ARM_DOWN_LEFT: readonly Cell[] = [
  [2, 10, "B"],
  [2, 11, "B"],
  [2, 12, "f"],
  [1, 10, "o"],
  [1, 11, "o"],
  [1, 12, "o"],
  [2, 13, "o"],
];

const ARM_UP_LEFT: readonly Cell[] = [
  ...[3, 4, 5, 6, 7, 8, 9].flatMap((y): Cell[] => [
    [1, y, "B"],
    [0, y, "o"],
  ]),
  [1, 2, "f"],
  [0, 2, "o"],
  [1, 1, "o"],
  [2, 9, "B"],
  [2, 10, "B"],
  [1, 10, "o"],
];

const ARM_OUT_LEFT: readonly Cell[] = [
  [2, 9, "B"],
  [1, 9, "B"],
  [0, 9, "f"],
  [0, 8, "o"],
  [1, 8, "o"],
  [2, 8, "o"],
  [0, 10, "o"],
  [1, 10, "o"],
  [2, 10, "o"],
];

const ARM_FORWARD_LEFT: readonly Cell[] = [
  [2, 10, "B"],
  [2, 11, "f"],
  [1, 10, "o"],
  [1, 11, "o"],
  [2, 12, "o"],
];

const CUP: readonly Cell[] = [
  [10, 10, "B"],
  [11, 10, "B"],
  [11, 9, "f"],
  [12, 10, "o"],
  [11, 11, "o"],
  [10, 11, "o"],
  [11, 6, "c"],
  [12, 6, "c"],
  [11, 7, "c"],
  [12, 7, "c"],
  [11, 8, "w"],
  [12, 8, "w"],
];

const NOTES: readonly Cell[] = [
  [11, 0, "n"],
  [12, 0, "n"],
  [11, 1, "n"],
];

const SHADES: readonly Cell[] = [3, 4, 5, 6, 7, 8, 9].map((x): Cell => [x, 5, "e"]);

const HAT: readonly Cell[] = [
  ...[4, 5, 6, 7, 8].map((x): Cell => [x, 0, "o"]),
  ...[3, 4, 5, 6, 7, 8, 9].map((x): Cell => [x, 1, "h"]),
];

const HEADPHONES: readonly Cell[] = [
  ...[3, 4, 5, 6, 7, 8, 9].map((x): Cell => [x, 2, "h"]),
  [1, 4, "h"],
  [1, 5, "h"],
  [1, 6, "h"],
  [11, 4, "h"],
  [11, 5, "h"],
  [11, 6, "h"],
  [2, 4, "o"],
  [2, 5, "o"],
  [2, 6, "o"],
];

const ACCESSORY_CELLS: Readonly<Record<Accessory, readonly Cell[]>> = {
  none: [],
  shades: SHADES,
  hat: HAT,
  headphones: HEADPHONES,
};

const CLOSED_EYES: readonly Cell[] = [
  [4, 5, "f"],
  [8, 5, "f"],
  [4, 6, "e"],
  [8, 6, "e"],
];

const SHOCKED: readonly Cell[] = [
  [4, 6, "e"],
  [8, 6, "e"],
  [6, 6, "o"],
];

function poseCells(pose: AgentPose, frame: number): Cell[] {
  switch (pose) {
    case "stand":
      return [...ARM_DOWN_LEFT, ...mirror(ARM_DOWN_LEFT)];
    case "dance":
      return frame === 0
        ? [...ARM_UP_LEFT, ...mirror(ARM_UP_LEFT)]
        : [...ARM_UP_LEFT, ...mirror(ARM_OUT_LEFT), ...NOTES];
    case "dj":
      return [...ARM_FORWARD_LEFT, ...mirror(ARM_FORWARD_LEFT)];
    case "bar":
      return [...ARM_DOWN_LEFT, ...CUP];
    case "sleep":
      return [...ARM_DOWN_LEFT, ...mirror(ARM_DOWN_LEFT), ...CLOSED_EYES];
    case "door":
      return [...ARM_UP_LEFT, ...mirror(ARM_DOWN_LEFT)];
    case "spill":
      return [...ARM_OUT_LEFT, ...mirror(ARM_OUT_LEFT), ...SHOCKED];
    default: {
      const unhandled: never = pose;
      throw new Error(`Unhandled pose: ${String(unhandled)}`);
    }
  }
}

export function agentPixels(
  bodyIndex: number,
  accessory: Accessory,
  pose: AgentPose,
  frame: number,
): Pixels {
  const body = BODIES[bodyIndex % BODIES.length] ?? BODIES[0];
  const chars = BASE.map((row) => row.split(""));
  const apply = (cells: readonly Cell[]): void => {
    for (const [x, y, ch] of cells) {
      const row = chars[y];
      if (row && x >= 0 && x < AGENT_W) {
        row[x] = ch;
      }
    }
  };
  apply(ACCESSORY_CELLS[pose === "dj" ? "headphones" : accessory]);
  apply(poseCells(pose, frame));
  const palette: Record<string, number> = {
    o: COLOR.ink,
    B: body?.main ?? COLOR.magenta,
    b: body?.shade ?? COLOR.magenta,
    f: COLOR.ivory,
    e: COLOR.ink,
    L: COLOR.line,
    h: COLOR.lilac,
    c: COLOR.cyan,
    w: COLOR.ivory,
    n: COLOR.cyan,
  };
  return Pixels.fromGrid(
    chars.map((row) => row.join("")),
    palette,
  );
}

function ellipsePixels(color: number): Pixels {
  const pixels = new Pixels(13, 5);
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 13; x += 1) {
      const dx = (x - 6) / 6.5;
      const dy = (y - 2) / 2.5;
      if (dx * dx + dy * dy <= 1) {
        pixels.set(x, y, color);
      }
    }
  }
  return pixels;
}

export function shadowPixels(): Pixels {
  return ellipsePixels(COLOR.ink);
}

export function puddlePixels(): Pixels {
  return ellipsePixels(COLOR.coral);
}
