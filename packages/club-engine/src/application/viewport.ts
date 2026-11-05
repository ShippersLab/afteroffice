import type { Application } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { clampZoom, fitZoom, stepZoom } from "../mathematics/zoom";

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

function zoomAt(viewport: Viewport, zoom: number, px: number, py: number): void {
  const before = viewport.toWorld(px, py);
  viewport.scale.set(zoom);
  viewport.position.set(Math.round(px - before.x * zoom), Math.round(py - before.y * zoom));
}

export function createViewport(app: Application): ClubViewport {
  const viewport = new Viewport({
    screenWidth: app.screen.width,
    screenHeight: app.screen.height,
    worldWidth: WORLD_W,
    worldHeight: WORLD_H,
    events: app.renderer.events,
    ticker: app.ticker,
  });
  viewport.drag().clamp({ left: 0, top: 0, right: WORLD_W, bottom: WORLD_H, underflow: "center" });
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
  const onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const now = performance.now();
    if (now - lastWheel < WHEEL_COOLDOWN_MS) {
      return;
    }
    lastWheel = now;
    userMoved = true;
    const rect = app.canvas.getBoundingClientRect();
    const direction = event.deltaY < 0 ? 1 : -1;
    zoomAt(
      viewport,
      stepZoom(viewport.scale.x, direction),
      event.clientX - rect.left,
      event.clientY - rect.top,
    );
  };
  app.canvas.addEventListener("wheel", onWheel, { passive: false });

  return {
    viewport,
    dispose: () => {
      app.renderer.off("resize", onResize);
      app.canvas.removeEventListener("wheel", onWheel);
    },
  };
}
