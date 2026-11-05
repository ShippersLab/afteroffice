import type { ConnectionStatus } from "../../hooks/use-live-connection";

const LABELS: Record<ConnectionStatus, string> = {
  live: "Live",
  connecting: "Connecting",
  offline: "Offline",
};

const DOTS: Record<ConnectionStatus, string> = {
  live: "bg-cyan shadow-glow-cyan animate-blink",
  connecting: "bg-muted",
  offline: "bg-coral",
};

type LiveChipProps = { online: number | undefined; status: ConnectionStatus; className?: string };

export const LiveChip = ({ online, status, className = "" }: LiveChipProps) => (
  <p
    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-line bg-panel/80 px-2.5 py-1 font-mono text-[11px] text-muted backdrop-blur-sm transition-colors duration-200 ease-out hover:border-muted/50 ${className}`}
    role="status"
    title={LABELS[status]}
  >
    <span
      className={`size-1.5 rounded-full ${DOTS[status]}`}
      role="img"
      aria-label={LABELS[status]}
    />
    <span>
      <span className="text-ivory">{online ?? "-"}</span>
      <span className="hidden sm:inline"> {online === 1 ? "agent" : "agents"}</span>
    </span>
  </p>
);
