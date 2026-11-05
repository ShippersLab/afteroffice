import type { ConnectionStatus } from "../../hooks/use-live-connection";
import { LiveChip } from "../ui/live-chip";
import { Logo } from "../ui/logo";

type ClubHudProps = { online: number | undefined; status: ConnectionStatus };

export const ClubHud = ({ online, status }: ClubHudProps) => (
  <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
    <div className="pointer-events-auto animate-rise rounded-md border border-line bg-panel/80 px-2.5 py-1.5 backdrop-blur-sm transition-colors duration-200 ease-out hover:border-muted/50">
      <Logo size="sm" />
    </div>
    <LiveChip
      className="pointer-events-auto animate-rise [animation-delay:80ms]"
      online={online}
      status={status}
    />
  </header>
);
