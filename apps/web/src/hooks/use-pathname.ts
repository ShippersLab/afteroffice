import { useSyncExternalStore } from "react";
import { subscribeToNavigation } from "../library/routing/navigation";

export const usePathname = (): string =>
  useSyncExternalStore(
    subscribeToNavigation,
    () => window.location.pathname,
    () => "/",
  );
