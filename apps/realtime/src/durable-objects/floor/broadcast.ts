import type { LiveMessage } from "@afteroffice/core";

export function broadcast(sockets: readonly WebSocket[], message: LiveMessage): void {
  const payload = JSON.stringify(message);
  for (const socket of sockets) {
    try {
      socket.send(payload);
    } catch {
      socket.close(1011, "send failed");
    }
  }
}
