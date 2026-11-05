import { z } from "zod";

const MAX_FLOOR = 99_999;

export const RoomIdSchema = z.string().regex(/^floor-[1-9][0-9]{0,4}$/);

export type RoomId = z.infer<typeof RoomIdSchema>;

export function floorRoomId(floor: number): RoomId {
  if (!Number.isInteger(floor) || floor < 1 || floor > MAX_FLOOR) {
    throw new RangeError(`Invalid floor number: ${floor}`);
  }
  return `floor-${floor}`;
}

export function floorNumber(roomId: RoomId): number {
  return Number(roomId.slice("floor-".length));
}
