import type { ConnectionStatus } from "../../hooks/use-live-connection";
import { Logo } from "../ui/logo";
import { OnlineCount } from "../ui/online-count";
import { StatusPill } from "../ui/status-pill";

type ClubHudProps = { online: number | undefined; status: ConnectionStatus };

const CHIP = "pointer-events-auto rounded-md border border-line bg-panel/85 backdrop-blur-sm";

export const ClubHud = ({ online, status }: ClubHudProps) => (
  <header className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 p-3 sm:p-5">
    <div className={`${CHIP} px-4 py-2`}>
      <Logo />
    </div>
    <div className={`${CHIP} flex items-center gap-4 px-4 py-3`}>
      <OnlineCount online={online} />
      <StatusPill status={status} />
    </div>
  </header>
);
