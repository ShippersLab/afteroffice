import type { Container } from "pixi.js";
import type { ClubModel } from "../state/club-model";
import { AgentView } from "./agent-view";

export class AgentLayer {
  private readonly things: Container;
  private readonly overlay: Container;
  private readonly active = new Map<string, AgentView>();
  private readonly pool: AgentView[] = [];

  constructor(things: Container, overlay: Container) {
    this.things = things;
    this.overlay = overlay;
  }

  sync(model: ClubModel, timeMs: number, reducedMotion: boolean): void {
    for (const [id, view] of this.active) {
      if (!model.agents.has(id)) {
        view.release();
        this.active.delete(id);
        this.pool.push(view);
      }
    }
    for (const agent of model.agents.values()) {
      let view = this.active.get(agent.id);
      if (!view) {
        view = this.acquire();
        view.bind(agent);
        this.active.set(agent.id, view);
      }
      view.update(agent, timeMs, reducedMotion);
    }
  }

  destroy(): void {
    for (const view of [...this.active.values(), ...this.pool]) {
      view.destroy();
    }
    this.active.clear();
    this.pool.length = 0;
  }

  private acquire(): AgentView {
    const reused = this.pool.pop();
    if (reused) {
      return reused;
    }
    const view = new AgentView();
    this.things.addChild(view.body);
    this.overlay.addChild(view.label, view.bubble);
    return view;
  }
}
