export const DEFAULT_REALTIME_URL = "http://localhost:8787";

const toSocketProtocol = (protocol: string): string => (protocol === "https:" ? "wss:" : "ws:");

export const buildLiveUrl = (base: string | undefined): string => {
  const url = new URL(base?.trim() ? base.trim() : DEFAULT_REALTIME_URL);
  url.protocol = toSocketProtocol(url.protocol);
  url.pathname = "/v1/live";
  url.search = "";
  url.hash = "";
  return url.toString();
};

export const realtimeOrigins = (base: string | undefined): string[] => {
  const live = new URL(buildLiveUrl(base));
  const http = new URL(live.toString());
  http.protocol = live.protocol === "wss:" ? "https:" : "http:";
  return [http.origin, live.origin];
};
