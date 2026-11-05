import { BufferImageSource, Texture } from "pixi.js";
import type { Pixels } from "./pixels";

const cache = new Map<string, Texture>();
let holders = 0;

export function retainTextures(): void {
  holders += 1;
}

export function releaseTextures(): void {
  holders = Math.max(0, holders - 1);
  if (holders === 0) {
    destroyCachedTextures();
  }
}

export function toTexture(pixels: Pixels): Texture {
  const source = new BufferImageSource({
    resource: pixels.data,
    width: pixels.width,
    height: pixels.height,
    scaleMode: "nearest",
  });
  return new Texture({ source });
}

export function cachedTexture(key: string, build: () => Pixels): Texture {
  const hit = cache.get(key);
  if (hit) {
    return hit;
  }
  const texture = toTexture(build());
  cache.set(key, texture);
  return texture;
}

export function destroyCachedTextures(): void {
  for (const texture of cache.values()) {
    texture.destroy(true);
  }
  cache.clear();
}
