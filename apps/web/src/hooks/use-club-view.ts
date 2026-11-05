import type { ClubView } from "@afteroffice/club-engine";
import { type RefObject, useEffect, useState } from "react";
import type { MessageSink } from "../library/realtime/message-sink";
import { prefersReducedMotion } from "../utilities/reduced-motion";

export type ClubViewState = "loading" | "ready" | "failed";

export const useClubView = (
  host: RefObject<HTMLDivElement | null>,
  sink: MessageSink,
): ClubViewState => {
  const [state, setState] = useState<ClubViewState>("loading");

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    let view: ClubView | undefined;

    const mount = async () => {
      try {
        const engine = await import("@afteroffice/club-engine");
        if (cancelled) return;
        const mounted = await engine.mountClub(element, { reducedMotion: prefersReducedMotion() });
        if (cancelled) {
          mounted.destroy();
          return;
        }
        view = mounted;
        sink.attach(mounted);
        setState("ready");
      } catch {
        if (!cancelled) setState("failed");
      }
    };

    void mount();

    return () => {
      cancelled = true;
      sink.detach();
      view?.destroy();
    };
  }, [host, sink]);

  return state;
};
