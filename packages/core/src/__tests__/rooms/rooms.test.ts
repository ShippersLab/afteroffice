import { describe, expect, it } from "vitest";
import { floorNumber, floorRoomId, RoomIdSchema } from "../../rooms/rooms";

describe("rooms", () => {
  it("builds and reads floor ids", () => {
    expect(floorRoomId(7)).toBe("floor-7");
    expect(floorNumber("floor-7")).toBe(7);
  });

  it("refuses floor numbers that cannot exist", () => {
    for (const floor of [0, -1, 1.5, 100_000]) {
      expect(() => floorRoomId(floor)).toThrow(RangeError);
    }
  });

  it("only accepts floor room ids for now", () => {
    expect(RoomIdSchema.safeParse("floor-12").success).toBe(true);
    for (const roomId of ["floor-0", "floor-01", "lounge-acme", "floor-", "FLOOR-1"]) {
      expect(RoomIdSchema.safeParse(roomId).success).toBe(false);
    }
  });
});
