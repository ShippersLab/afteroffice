import type { Application, PointData, Ticker } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { clampZoom, fitZoom, stepZoom, tweenZoom, ZOOM_TWEEN_MS } from "../mathematics/zoom";

export const WORLD = { left: -620, right: 620, top: -230, bottom: 620 } as const;
const WORLD_W = WORLD.right - WORLD.left;
const WORLD_H = WORLD.bottom - WORLD.top;
export const WORLD_ORIGIN = { x: -WORLD.left, y: -WORLD.top } as const;
const FOCUS = { x: WORLD_ORIGIN.x, y: WORLD_ORIGIN.y + 170 };
const WHEEL_COOLDOWN_MS = 110;

export type ClubViewport = {
  readonly viewport: Viewport;
  dispose(): void;
};

function placeAt(
  viewport: Viewport,
  zoom: number,
  world: PointData,
  px: number,
  py: number,
  settle: boolean,
): void {
  viewport.scale.set(zoom);
  const x = px - world.x * zoom;
  const y = py - world.y * zoom;
  viewport.position.set(settle ? Math.round(x) : x, settle ? Math.round(y) : y);
}

export function createViewport(app: Application, reducedMotion: boolean): ClubViewport {
  const viewport = new Viewport({
    screenWidth: app.screen.width,
    screenHeight: app.screen.height,
    worldWidth: WORLD_W,
    worldHeight: WORLD_H,
    events: app.renderer.events,
    ticker: app.ticker,
  });
  viewport
    .drag()
    .decelerate({ friction: 0.94 })
    .clamp({ left: 0, top: 0, right: WORLD_W, bottom: WORLD_H, underflow: "center" });
  let userMoved = false;
  const fitToScreen = (): void => {
    viewport.setZoom(fitZoom(app.screen.width, app.screen.height, WORLD_W, WORLD_H), true);
    viewport.moveCenter(FOCUS.x, FOCUS.y);
  };
  fitToScreen();
  viewport.on("drag-start", () => {
    userMoved = true;
  });

  const onResize = (): void => {
    const center = viewport.center;
    viewport.resize(app.screen.width, app.screen.height, WORLD_W, WORLD_H);
    if (!userMoved) {
      fitToScreen();
      return;
    }
    viewport.scale.set(clampZoom(viewport.scale.x));
    viewport.moveCenter(center.x, center.y);
  };
  app.renderer.on("resize", onResize);

  let lastWheel = 0;
  let targetZoom = viewport.scale.x;
  let tween:
    | { from: number; elapsed: number; px: number; py: number; world: PointData }
    | undefined;

  const onZoomTick = (ticker: Ticker): void => {
    if (!tween) {
      return;
    }
    tween.elapsed += ticker.deltaMS;
    const done = tween.elapsed >= ZOOM_TWEEN_MS;
    const zoom = done
      ? targetZoom
      : tweenZoom(tween.from, targetZoom, tween.elapsed, ZOOM_TWEEN_MS);
    placeAt(viewport, zoom, tween.world, tween.px, tween.py, done);
    if (done) {
      tween = undefined;
    }
  };
  app.ticker.add(onZoomTick);

  const onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const now = performance.now();
    if (now - lastWheel < WHEEL_COOLDOWN_MS) {
      return;
    }
    lastWheel = now;
    userMoved = true;
    const rect = app.canvas.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const direction = event.deltaY < 0 ? 1 : -1;
    targetZoom = stepZoom(tween ? targetZoom : viewport.scale.x, direction);
    if (reducedMotion) {
      placeAt(viewport, targetZoom, viewport.toWorld(px, py), px, py, true);
      return;
    }
    tween = { from: viewport.scale.x, elapsed: 0, px, py, world: viewport.toWorld(px, py) };
  };
  app.canvas.addEventListener("wheel", onWheel, { passive: false });

  return {
    viewport,
    dispose: () => {
      app.renderer.off("resize", onResize);
      app.canvas.removeEventListener("wheel", onWheel);
      app.ticker.remove(onZoomTick);
    },
  };
}
