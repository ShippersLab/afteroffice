import { floorNumber, type RoomId } from "@afteroffice/core";
import { z } from "zod";
import type { FloorCount } from "../../services/floors";

const FLOOR_PREFIX = "floor:";

const CountSchema = z.number().int().nonnegative();

export class FloorCounts {
  constructor(private readonly kv: SyncKvStorage) {}

  list(): FloorCount[] {
    const result: FloorCount[] = [];
    for (const [key, value] of this.kv.list({ prefix: FLOOR_PREFIX })) {
      const count = CountSchema.safeParse(value);
      if (count.success) {
        result.push({ floor: Number(key.slice(FLOOR_PREFIX.length)), count: count.data });
      }
    }
    return result;
  }

  set(floor: number, count: number): void {
    this.kv.put(`${FLOOR_PREFIX}${floor}`, count);
  }

  increment(floor: number): void {
    const current = CountSchema.safeParse(this.kv.get(`${FLOOR_PREFIX}${floor}`));
    this.set(floor, (current.success ? current.data : 0) + 1);
  }

  setForRoom(roomId: RoomId, count: number): void {
    this.set(floorNumber(roomId), count);
  }
}
