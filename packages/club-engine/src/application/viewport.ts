import type { Application, PointData, Ticker } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { clampZoom, fitZoom, stepZoom, tweenZoom, ZOOM_TWEEN_MS } from "../mathematics/zoom";
import { GRID_SIZE } from "../state/layout";

const MIN_X = -(GRID_SIZE - 1) * 40;
const MAX_X = (GRID_SIZE - 1) * 40;
const MAX_Y = 40 * (GRID_SIZE - 1);

export const WORLD = {
  left: MIN_X - 100,
  right: MAX_X + 100,
  top: -230,
  bottom: MAX_Y + 100,
} as const;
const WORLD_W = WORLD.right - WORLD.left;
const WORLD_H = WORLD.bottom - WORLD.top;
export const WORLD_ORIGIN = { x: -WORLD.left, y: -WORLD.top } as const;
const FOCUS = { x: WORLD_ORIGIN.x, y: WORLD_ORIGIN.y + 170 };

const WHEEL_STEP_PX = 48;
const PINCH_STEP_PX = 12;
const LINE_PX = 16;

export type ClubViewport = {
  readonly viewport: Viewport;
  dispose(): void;
};

function clampPosition(anchored: number, screen: number, world: number): number {
  if (world <= screen) {
    return (screen - world) / 2;
  }
  return Math.min(0, Math.max(screen - world, anchored));
}

function placeAt(
  viewport: Viewport,
  zoom: number,
  world: PointData,
  px: number,
  py: number,
  settle: boolean,
): void {
  viewport.scale.set(zoom);
  const worldW = WORLD_W * zoom;
  const worldH = WORLD_H * zoom;
  // Anchor the cursor's world point, then keep the view inside the world.
  // Centering when the world is smaller than the screen happens inside the
  // tween, so zooming out from a corner eases to center instead of snapping.
  const x = clampPosition(px - world.x * zoom, viewport.screenWidth, worldW);
  const y = clampPosition(py - world.y * zoom, viewport.screenHeight, worldH);
  viewport.position.set(settle ? Math.round(x) : x, settle ? Math.round(y) : y);
}

function wheelPixels(event: WheelEvent, pageHeight: number): number {
  if (event.deltaMode === 1) {
    return event.deltaY * LINE_PX;
  }
  if (event.deltaMode === 2) {
    return event.deltaY * pageHeight;
  }
  return event.deltaY;
}

export function createViewport(
  app: Application,
  reducedMotion: boolean,
  wheelTarget: HTMLElement = app.canvas,
): ClubViewport {
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

  let targetZoom = viewport.scale.x;
  let wheelDelta = 0;
  let tween:
    | { from: number; elapsed: number; px: number; py: number; world: PointData }
    | undefined;

  const onResize = (): void => {
    const center = viewport.center;
    viewport.resize(app.screen.width, app.screen.height, WORLD_W, WORLD_H);
    if (!userMoved) {
      fitToScreen();
      targetZoom = viewport.scale.x;
      return;
    }
    viewport.scale.set(clampZoom(viewport.scale.x));
    targetZoom = viewport.scale.x;
    viewport.moveCenter(center.x, center.y);
  };
  app.renderer.on("resize", onResize);

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
    const delta = wheelPixels(event, app.screen.height);
    if (delta === 0) {
      return;
    }
    // Accumulate wheel input so trackpad bursts build zoom instead of dropping events.
    if (Math.sign(delta) !== Math.sign(wheelDelta)) {
      wheelDelta = 0;
    }
    wheelDelta += delta;
    const threshold = event.ctrlKey ? PINCH_STEP_PX : WHEEL_STEP_PX;
    if (Math.abs(wheelDelta) < threshold) {
      return;
    }
    wheelDelta -= Math.sign(wheelDelta) * threshold;
    const direction: 1 | -1 = delta < 0 ? 1 : -1;
    const next = stepZoom(tween ? targetZoom : viewport.scale.x, direction);
    if (next === targetZoom) {
      return;
    }
    targetZoom = next;
    userMoved = true;
    const rect = app.canvas.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    if (reducedMotion) {
      placeAt(viewport, targetZoom, viewport.toWorld(px, py), px, py, true);
      return;
    }
    // Retarget from the live scale so a new wheel event never snaps the view.
    tween = { from: viewport.scale.x, elapsed: 0, px, py, world: viewport.toWorld(px, py) };
  };
  // Capture phase: the club root also holds pointer-events-auto HUD overlays,
  // so listening on the host catches wheel over both the canvas and the HTML.
  wheelTarget.addEventListener("wheel", onWheel, { passive: false, capture: true });

  return {
    viewport,
    dispose: () => {
      app.renderer.off("resize", onResize);
      wheelTarget.removeEventListener("wheel", onWheel, { capture: true });
      app.ticker.remove(onZoomTick);
    },
  };
}
