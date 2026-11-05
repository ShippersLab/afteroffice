import type { ConnectionStatus } from "../../hooks/use-live-connection";

const LABELS: Record<ConnectionStatus, string> = {
  live: "Live",
  connecting: "Connecting",
  offline: "Offline",
};

const TONES: Record<ConnectionStatus, { pill: string; dot: string }> = {
  live: { pill: "border-cyan/40 text-cyan", dot: "bg-cyan shadow-glow-cyan animate-blink" },
  connecting: { pill: "border-line text-muted", dot: "bg-muted" },
  offline: { pill: "border-line text-coral", dot: "bg-coral" },
};

export const StatusPill = ({ status }: { status: ConnectionStatus }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border bg-panel px-3 py-1 font-mono text-xs font-semibold ${TONES[status].pill}`}
    role="status"
  >
    <span className={`size-2 ${TONES[status].dot}`} aria-hidden="true" />
    {LABELS[status]}
  </span>
);
