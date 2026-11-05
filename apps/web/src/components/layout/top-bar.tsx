import { SITE_LINKS } from "../../content/nav";
import type { ConnectionStatus } from "../../hooks/use-live-connection";
import { Link } from "../ui/link";
import { Logo } from "../ui/logo";
import { OnlineCount } from "../ui/online-count";
import { StatusPill } from "../ui/status-pill";

type TopBarProps = { online: number | undefined; status: ConnectionStatus };

export const TopBar = ({ online, status }: TopBarProps) => (
  <header className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-8">
    <Logo />
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <nav aria-label="Primary" className="hidden items-center gap-5 md:flex">
        {SITE_LINKS.map((link) => (
          <Link
            className="text-sm font-medium text-ivory underline decoration-magenta underline-offset-[6px] hover:text-magenta"
            key={link.href}
            to={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <OnlineCount online={online} />
      <StatusPill status={status} />
    </div>
  </header>
);
