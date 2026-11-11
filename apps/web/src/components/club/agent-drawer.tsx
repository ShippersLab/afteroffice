import type { SelectedAgent } from "@afteroffice/club-engine";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { AGENT_CARD, AGENT_STATE_COPY } from "../../content/club";
import { SHARE } from "../../content/share";
import { SITE } from "../../content/site";
import { ActionButton } from "../ui/action-button";
import { ShareButton } from "../ui/share-button";

const CLOSE_MS = 200;
const DRAG_CLOSE_PX = 80;

type AgentDrawerProps = {
  agent: SelectedAgent;
  onClose: () => void;
  onScreenshot: () => Promise<void>;
};

export const AgentDrawer = ({ agent, onClose, onScreenshot }: AgentDrawerProps) => {
  const copy = AGENT_STATE_COPY[agent.state];
  const root = useRef<HTMLElement>(null);
  const dragStart = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [closing, setClosing] = useState(false);
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, CLOSE_MS);
  };
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    const onOutside = (event: globalThis.PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onOutside);
    };
  }, []);

  const onGrab = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    setOffset(Math.max(0, event.clientY - dragStart.current));
  };
  const onRelease = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (offset > DRAG_CLOSE_PX) close();
    else setOffset(0);
  };

  const screenshot = async () => {
    setSaving(true);
    await onScreenshot();
    setSaving(false);
  };

  const state = agent.walking ? copy.heading : copy.label;

  return (
    <aside
      aria-label={AGENT_CARD.label}
      className={`pointer-events-auto absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md rounded-t-xl border border-b-0 border-line bg-panel/95 px-5 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgb(11_10_20/0.7)] backdrop-blur-md ${closing ? "animate-drawer-down" : "animate-drawer-up"}`}
      ref={root}
      style={offset > 0 ? { transform: `translateY(${offset}px)` } : undefined}
    >
      <div
        aria-label={AGENT_CARD.grab}
        className="mx-auto flex h-8 w-full cursor-grab touch-none items-center justify-center"
        onPointerCancel={onRelease}
        onPointerDown={onGrab}
        onPointerMove={onDrag}
        onPointerUp={onRelease}
        role="presentation"
      >
        <span className="h-1 w-10 rounded-full bg-line" />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="break-all font-mono text-base font-semibold text-ivory">{agent.handle}</p>
          {agent.vip ? (
            <span className="mt-1 inline-block font-mono text-xs text-amber">{AGENT_CARD.vip}</span>
          ) : null}
        </div>
        <button
          aria-label={AGENT_CARD.close}
          className="-mt-2 -mr-3 grid size-11 flex-none cursor-pointer place-items-center rounded-full text-muted transition-colors duration-200 ease-out hover:text-ivory"
          onClick={close}
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
        <span className="text-ivory">{state}</span>
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <ShareButton
          label={AGENT_CARD.share}
          text={SHARE.spotted(agent.handle, copy.phrase)}
          url={SITE.url}
          variant="primary"
        />
        <ActionButton disabled={saving} onClick={() => void screenshot()}>
          {saving ? AGENT_CARD.saving : AGENT_CARD.screenshot}
        </ActionButton>
      </div>
    </aside>
  );
};
