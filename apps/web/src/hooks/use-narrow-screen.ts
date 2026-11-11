import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 639px)";

const subscribe = (listener: () => void): (() => void) => {
  const list = window.matchMedia(QUERY);
  list.addEventListener("change", listener);
  return () => list.removeEventListener("change", listener);
};

export const useNarrowScreen = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
