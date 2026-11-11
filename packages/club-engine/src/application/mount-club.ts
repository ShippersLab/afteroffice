import type { AgentState, LiveMessage } from "@afteroffice/core";
import { Application, type Ticker } from "pixi.js";
import "pixi.js/unsafe-eval";
import { AgentLayer } from "../agents/agent-layer";
import { buildScene } from "../scene/scene-builder";
import { loadSponsorLogos } from "../scene/sponsor-logo";
import { COLOR } from "../sprites/palette";
import { releaseTextures, retainTextures } from "../sprites/textures";
import { applyMessage, createModel, tickModel } from "../state/club-model";
import { createViewport, WORLD_ORIGIN } from "./viewport";

export type SelectedAgent = {
  readonly id: string;
  readonly handle: string;
  readonly state: AgentState;
  readonly vip: boolean;
};

export type ClubView = {
  apply(message: LiveMessage): void;
  clearSelection(): void;
  destroy(): void;
};

export type MountClubOptions = {
  reducedMotion?: boolean;
  onNavigate?: (href: string) => void;
  onSelectAgent?: (agent: SelectedAgent | null) => void;
};

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

  // The HUD and intro are pointer-events-auto siblings of the canvas host, so
  // lock the whole club root against page pan, pinch and overscroll gestures.
  const wheelScope = host.parentElement ?? host;
  const restoreScrollStyles = [...new Set([host, wheelScope])].map((element) => {
    const touchAction = element.style.touchAction;
    const overscrollBehavior = element.style.overscrollBehavior;
    element.style.touchAction = "none";
    element.style.overscrollBehavior = "none";
    return () => {
      element.style.touchAction = touchAction;
      element.style.overscrollBehavior = overscrollBehavior;
    };
  });

  retainTextures();
  const { viewport, dispose } = createViewport(app, reducedMotion, wheelScope);
  const logos = await loadSponsorLogos();
  const scene = buildScene(options.onNavigate, logos);
  scene.root.position.set(WORLD_ORIGIN.x, WORLD_ORIGIN.y);
  viewport.addChild(scene.root);
  app.stage.addChild(viewport);

  const model = createModel();
  let hoveredId = "";
  let selectedId = "";
  let selectedKey = "";
  const select = (id: string): void => {
    selectedId = id;
    selectedKey = "";
    layer.setSelected(id);
  };
  const layer: AgentLayer = new AgentLayer(scene.things, scene.overlay, {
    hover: (id, over) => {
      hoveredId = over ? id : hoveredId === id ? "" : hoveredId;
      layer.setHovered(hoveredId);
    },
    select: (id) => select(selectedId === id ? "" : id),
  });
  let clock = 0;
  let destroyed = false;

  const announceSelection = (): void => {
    if (selectedId === "") {
      return;
    }
    const agent = model.agents.get(selectedId);
    if (!agent || agent.leaving) {
      select("");
      options.onSelectAgent?.(null);
      return;
    }
    const key = `${agent.handle}|${agent.state}|${agent.vip}`;
    if (key !== selectedKey) {
      selectedKey = key;
      options.onSelectAgent?.({
        id: agent.id,
        handle: agent.handle,
        state: agent.state,
        vip: agent.vip,
      });
    }
  };

  const onTick = (ticker: Ticker): void => {
    const dt = Math.min(ticker.deltaMS, MAX_FRAME_MS);
    clock += dt;
    tickModel(model, dt);
    scene.fx.update(clock, reducedMotion);
    layer.sync(model, clock, reducedMotion);
    announceSelection();
  };
  app.ticker.add(onTick);

  return {
    apply(message) {
      if (!destroyed) {
        applyMessage(model, message);
      }
    },
    clearSelection() {
      select("");
    },
    destroy() {
      if (destroyed) {
        return;
      }
      destroyed = true;
      app.ticker.remove(onTick);
      dispose();
      for (const restoreScrollStyle of restoreScrollStyles) {
        restoreScrollStyle();
      }
      layer.destroy();
      app.destroy({ removeView: true, releaseGlobalResources: true }, { children: true });
      releaseTextures();
    },
  };
}
