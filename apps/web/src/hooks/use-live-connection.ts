import type { LiveMessage } from "@afteroffice/core";
import { useEffect, useRef, useState } from "react";
import { environment } from "../configuration/environment";
import { backoffDelay } from "../library/realtime/backoff";
import { onlineCountOf, parseLiveMessage } from "../library/realtime/parse-message";
import { buildLiveUrl } from "../library/realtime/realtime-url";

export type ConnectionStatus = "connecting" | "live" | "offline";

export type LiveConnection = { status: ConnectionStatus; online: number | undefined };

export const useLiveConnection = (onMessage: (message: LiveMessage) => void): LiveConnection => {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [online, setOnline] = useState<number | undefined>(undefined);
  const handler = useRef(onMessage);

  useEffect(() => {
    handler.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const url = buildLiveUrl(environment.VITE_REALTIME_URL);
    let socket: WebSocket | undefined;
    let timer: number | undefined;
    let attempt = 0;
    let stopped = false;

    const connect = () => {
      setStatus("connecting");
      const ws = new WebSocket(url);
      socket = ws;
      ws.addEventListener("open", () => {
        attempt = 0;
        setStatus("live");
      });
      ws.addEventListener("message", (event: MessageEvent<unknown>) => {
        const message = parseLiveMessage(event.data);
        if (!message) return;
        const count = onlineCountOf(message);
        if (count !== undefined) setOnline(count);
        handler.current(message);
      });
      ws.addEventListener("close", () => {
        if (stopped) return;
        setStatus("offline");
        timer = window.setTimeout(connect, backoffDelay(attempt, Math.random()));
        attempt += 1;
      });
    };

    connect();
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      socket?.close();
    };
  }, []);

  return { status, online };
};
