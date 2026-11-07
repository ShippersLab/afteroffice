import type { LiveMessage, PublicAgent, RoomId } from "@afteroffice/core";

export type MessageTarget = { apply: (message: LiveMessage) => void };

export type MessageSink = {
  push: (message: LiveMessage) => void;
  attach: (target: MessageTarget) => void;
  detach: () => void;
};

type Floor = { roomId: RoomId; online: number; agents: Map<string, PublicAgent> };

const track = (floor: Floor | undefined, message: LiveMessage): Floor | undefined => {
  switch (message.type) {
    case "snapshot":
      return {
        roomId: message.roomId,
        online: message.online,
        agents: new Map(message.agents.map((agent) => [agent.id, agent] as const)),
      };
    case "agent-entered":
      floor?.agents.set(message.agent.id, message.agent);
      return floor;
    case "agent-changed": {
      const agent = floor?.agents.get(message.id);
      if (agent) floor?.agents.set(message.id, { ...agent, state: message.state });
      return floor;
    }
    case "agent-left":
      floor?.agents.delete(message.id);
      return floor;
    case "agent-renamed": {
      const agent = floor?.agents.get(message.id);
      if (agent) floor?.agents.set(message.id, { ...agent, handle: message.handle });
      return floor;
    }
    case "online":
      if (floor) floor.online = message.online;
      return floor;
    case "bubble":
      return floor;
  }
};

export const createMessageSink = (): MessageSink => {
  let target: MessageTarget | undefined;
  let floor: Floor | undefined;

  return {
    push: (message) => {
      floor = track(floor, message);
      target?.apply(message);
    },
    attach: (next) => {
      target = next;
      if (!floor) return;
      next.apply({
        type: "snapshot",
        roomId: floor.roomId,
        online: floor.online,
        agents: [...floor.agents.values()],
      });
    },
    detach: () => {
      target = undefined;
    },
  };
};
