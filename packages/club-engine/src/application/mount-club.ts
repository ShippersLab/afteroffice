import type { LiveMessage } from "@afteroffice/core";
import { Application, type Ticker } from "pixi.js";
import "pixi.js/unsafe-eval";
import { AgentLayer } from "../agents/agent-layer";
import { buildScene } from "../scene/scene-builder";
import { COLOR } from "../sprites/palette";
import { releaseTextures, retainTextures } from "../sprites/textures";
import { applyMessage, createModel, tickModel } from "../state/club-model";
import { createViewport, WORLD_ORIGIN } from "./viewport";

export type ClubView = {
  apply(message: LiveMessage): void;
  destroy(): void;
};

export type MountClubOptions = { reducedMotion?: boolean };

const MAX_FRAME_MS = 100;

export async function mountClub(
  host: HTMLElement,
  options: MountClubOptions = {},
): Promise<ClubView> {
  const reducedMotion = options.reducedMotion === true;
  const app = new Application();
  await app.init({
    resizeTo: host,
    background: COLOR.ink,
    antialias: false,
    roundPixels: true,
    autoDensity: true,
    resolution: Math.max(1, Math.round(globalThis.devicePixelRatio || 1)),
    sharedTicker: true,
  });
  host.appendChild(app.canvas);

  retainTextures();
  const { viewport, dispose } = createViewport(app);
  const scene = buildScene();
  scene.root.position.set(WORLD_ORIGIN.x, WORLD_ORIGIN.y);
  viewport.addChild(scene.root);
  app.stage.addChild(viewport);

  const model = createModel();
  const layer = new AgentLayer(scene.things, scene.overlay);
  let clock = 0;
  let destroyed = false;

  const onTick = (ticker: Ticker): void => {
    const dt = Math.min(ticker.deltaMS, MAX_FRAME_MS);
    clock += dt;
    tickModel(model, dt);
    scene.fx.update(clock, reducedMotion);
    layer.sync(model, clock, reducedMotion);
  };
  app.ticker.add(onTick);

  return {
    apply(message) {
      if (!destroyed) {
        applyMessage(model, message);
      }
    },
    destroy() {
      if (destroyed) {
        return;
      }
      destroyed = true;
      app.ticker.remove(onTick);
      dispose();
      layer.destroy();
      app.destroy({ removeView: true, releaseGlobalResources: true }, { children: true });
      releaseTextures();
    },
  };
}
