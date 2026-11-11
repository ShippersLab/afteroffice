import { useEffect, useRef } from "react";
import { AgentDrawer } from "../components/club/agent-drawer";
import { ClubEntrance } from "../components/club/club-entrance";
import { ClubHud } from "../components/club/club-hud";
import { ClubIntro } from "../components/club/club-intro";
import { CLUB } from "../content/club";
import { useClubView } from "../hooks/use-club-view";
import { useEntrance } from "../hooks/use-entrance";
import type { ConnectionStatus } from "../hooks/use-live-connection";
import type { MessageSink } from "../library/realtime/message-sink";
import { downloadBlob } from "../utilities/download";

type ClubPageProps = {
  sink: MessageSink;
  online: number | undefined;
  status: ConnectionStatus;
};

const LOCK_CLASSES = ["overflow-hidden", "overscroll-none"] as const;

export const ClubPage = ({ sink, online, status }: ClubPageProps) => {
  const host = useRef<HTMLDivElement>(null);
  const entering = useEntrance();
  const { state, selected, clearSelection, capture } = useClubView(host, sink);
  const screenshot = async () => {
    const blob = await capture();
    if (blob && selected) downloadBlob(blob, `afteroffice-${selected.handle}.png`);
  };

  useEffect(() => {
    const roots = [document.documentElement, document.body];
    for (const root of roots) root.classList.add(...LOCK_CLASSES);
    return () => {
      for (const root of roots) root.classList.remove(...LOCK_CLASSES);
    };
  }, []);

  return (
    <main className="fixed inset-0 overflow-hidden bg-ink" aria-label={CLUB.label}>
      <div
        className="absolute inset-0 max-sm:top-16 max-sm:bottom-44 touch-none [&_canvas]:block [&_canvas]:size-full"
        ref={host}
      />
      {state === "ready" ? null : (
        <p
          className={`pointer-events-none absolute inset-0 grid place-items-center p-6 text-center font-mono text-sm ${
            state === "failed" ? "text-coral" : "text-muted"
          }`}
          role="status"
        >
          {state === "failed" ? CLUB.failed : CLUB.loading}
        </p>
      )}
      <ClubHud online={online} status={status} />
      <ClubIntro compact={selected !== null} />
      {selected ? (
        <AgentDrawer
          agent={selected}
          key={selected.id}
          onClose={() => clearSelection(selected.id)}
          onScreenshot={screenshot}
        />
      ) : null}
      {entering ? <ClubEntrance /> : null}
    </main>
  );
};
