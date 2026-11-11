import type { SelectedAgent } from "@afteroffice/club-engine";
import { useEffect } from "react";
import { AGENT_CARD, AGENT_STATE_COPY } from "../../content/club";
import { SHARE } from "../../content/profile";
import { profileUrl } from "../../library/sharing/share-links";
import { Button } from "../ui/button";
import { ShareButton } from "../ui/share-button";

type AgentCardProps = { agent: SelectedAgent; onClose: () => void };

export const AgentCard = ({ agent, onClose }: AgentCardProps) => {
  const copy = AGENT_STATE_COPY[agent.state];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <aside
      aria-label={AGENT_CARD.label}
      className="pointer-events-auto absolute inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-10 animate-rise rounded-lg border border-line bg-panel/90 p-4 backdrop-blur-md sm:inset-x-auto sm:top-16 sm:right-4 sm:bottom-auto sm:w-72"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="break-all font-mono text-sm font-semibold text-ivory">{agent.handle}</p>
          {agent.vip ? (
            <span className="mt-1 inline-block font-mono text-xs text-amber">{AGENT_CARD.vip}</span>
          ) : null}
        </div>
        <button
          aria-label={AGENT_CARD.close}
          className="-mt-2 -mr-2 grid size-11 flex-none cursor-pointer place-items-center rounded-full text-muted transition-colors duration-200 ease-out hover:text-ivory"
          onClick={onClose}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <p className="mt-3 flex items-center gap-2 text-sm text-muted">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-cyan" />
        <span className="font-mono text-xs">{AGENT_CARD.stateLabel}</span>
        <span className="text-ivory">{copy.label}</span>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button href={`/@${agent.handle}`} size="sm" variant="secondary">
          {AGENT_CARD.profile}
        </Button>
        <ShareButton
          label={AGENT_CARD.share}
          variant="primary"
          text={SHARE.spotted(agent.handle, copy.phrase)}
          url={profileUrl(agent.handle)}
        />
      </div>
    </aside>
  );
};
