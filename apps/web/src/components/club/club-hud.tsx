import type { ConnectionStatus } from "../../hooks/use-live-connection";
import { LiveChip } from "../ui/live-chip";
import { Logo } from "../ui/logo";

type ClubHudProps = { online: number | undefined; status: ConnectionStatus };

export const ClubHud = ({ online, status }: ClubHudProps) => (
  <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))] pl-[max(0.75rem,env(safe-area-inset-left))]">
    <div className="pointer-events-auto flex animate-rise items-center rounded-md border border-line bg-panel/80 backdrop-blur-sm [&>a]:min-h-11 [&>a]:px-3 transition-colors duration-200 ease-out hover:border-muted/50">
      <Logo size="sm" />
    </div>
    <LiveChip
      className="pointer-events-auto min-h-11 animate-rise [animation-delay:80ms]"
      online={online}
      status={status}
    />
  </header>
);
