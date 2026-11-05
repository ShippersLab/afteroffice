import type { PathRules } from "../mathematics/pathing";
import { isVipTile, isWalkable, VIP_GAP_ROW } from "./layout";

export function rulesFor(vip: boolean): PathRules {
  return {
    walkable: isWalkable,
    canStep: (from, to) => {
      if (isVipTile(from) === isVipTile(to)) {
        return true;
      }
      return vip && from.y === VIP_GAP_ROW && to.y === VIP_GAP_ROW;
    },
  };
}
