import { DurableObject } from "cloudflare:workers";
import { FLOOR_CAPACITY, floorNumber, floorRoomId, type RoomId } from "@afteroffice/core";
import { busiestFloor, pickFloor } from "../../services/floors";
import { FloorCounts } from "./storage";

export type Stats = { online: number; floors: number };

export class Directory extends DurableObject {
  private readonly floors: FloorCounts;

  constructor(ctx: DurableObjectState, env: never) {
    super(ctx, env);
    this.floors = new FloorCounts(ctx.storage.kv);
  }

  assign(): RoomId {
    const floor = pickFloor(this.floors.list(), FLOOR_CAPACITY);
    this.floors.increment(floor);
    return floorRoomId(floor);
  }

  report(roomId: RoomId, count: number): number {
    this.floors.setForRoom(roomId, count);
    return this.online();
  }

  online(): number {
    return this.floors.list().reduce((total, entry) => total + entry.count, 0);
  }

  stats(): Stats {
    const rows = this.floors.list();
    return {
      online: rows.reduce((total, entry) => total + entry.count, 0),
      floors: Math.max(1, rows.length),
    };
  }

  busiest(): RoomId {
    return floorRoomId(busiestFloor(this.floors.list()));
  }

  hasFloor(roomId: RoomId): boolean {
    const floor = floorNumber(roomId);
    return floor === 1 || this.floors.list().some((entry) => entry.floor === floor);
  }
}
