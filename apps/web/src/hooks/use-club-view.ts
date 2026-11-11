import type { ClubView, SelectedAgent } from "@afteroffice/club-engine";
import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { MessageSink } from "../library/realtime/message-sink";
import { navigate } from "../library/routing/navigation";
import { prefersReducedMotion } from "../utilities/reduced-motion";

export type ClubViewState = "loading" | "ready" | "failed";

export type ClubViewHandle = {
  state: ClubViewState;
  selected: SelectedAgent | null;
  clearSelection: (id?: string) => void;
  capture: () => Promise<Blob | null>;
};

export const useClubView = (
  host: RefObject<HTMLDivElement | null>,
  sink: MessageSink,
): ClubViewHandle => {
  const [state, setState] = useState<ClubViewState>("loading");
  const [selected, setSelected] = useState<SelectedAgent | null>(null);
  const mounted = useRef<ClubView | undefined>(undefined);
  const current = useRef<SelectedAgent | null>(null);

  const clearSelection = useCallback((id?: string) => {
    if (id !== undefined && current.current?.id !== id) return;
    mounted.current?.clearSelection();
    current.current = null;
    setSelected(null);
  }, []);

  const track = useCallback((agent: SelectedAgent | null) => {
    current.current = agent;
    setSelected(agent);
  }, []);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    let view: ClubView | undefined;

    const mount = async () => {
      try {
        const engine = await import("@afteroffice/club-engine");
        if (cancelled) return;
        const instance = await engine.mountClub(element, {
          reducedMotion: prefersReducedMotion(),
          onSelectAgent: track,
          onNavigate: (href) => {
            if (href.startsWith("http")) {
              window.open(href, "_blank", "noopener");
            } else {
              navigate(href);
            }
          },
        });
        if (cancelled) {
          instance.destroy();
          return;
        }
        view = instance;
        mounted.current = instance;
        sink.attach(instance);
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
      mounted.current = undefined;
    };
  }, [host, sink, track]);

  const capture = useCallback(async () => (await mounted.current?.capture()) ?? null, []);

  return { state, selected, clearSelection, capture };
};
