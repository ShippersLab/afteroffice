import { describe, expect, it } from "vitest";
import { busiestFloor, nextAlarmAt, pickFloor } from "../../services/floors";

describe("pickFloor", () => {
  it("opens floor 1 when nothing exists", () => {
    expect(pickFloor([], 80, () => 0.5)).toBe(1);
  });

  it("picks a random floor with space", () => {
    const floors = [
      { floor: 1, count: 80 },
      { floor: 2, count: 10 },
      { floor: 3, count: 79 },
    ];
    expect(pickFloor(floors, 80, () => 0)).toBe(2);
    expect(pickFloor(floors, 80, () => 0.99)).toBe(3);
  });

  it("opens the next floor when all are full", () => {
    const floors = [
      { floor: 1, count: 80 },
      { floor: 2, count: 80 },
    ];
    expect(pickFloor(floors, 80, () => 0.3)).toBe(3);
  });
});

describe("busiestFloor", () => {
  it("defaults to floor 1 when empty", () => {
    expect(busiestFloor([])).toBe(1);
    expect(busiestFloor([{ floor: 2, count: 0 }])).toBe(1);
  });

  it("picks the highest count and the lowest floor on ties", () => {
    expect(
      busiestFloor([
        { floor: 1, count: 3 },
        { floor: 2, count: 9 },
        { floor: 3, count: 9 },
      ]),
    ).toBe(2);
  });
});

describe("nextAlarmAt", () => {
  it("waits for the timeout after the oldest heartbeat", () => {
    expect(nextAlarmAt(1_000, 2_000, 120_000)).toBe(121_000);
  });

  it("never schedules in the past", () => {
    expect(nextAlarmAt(0, 500_000, 120_000)).toBe(501_000);
  });
});
