import { NAVBAR_LINKS } from "../../content/nav";
import type { ConnectionStatus } from "../../hooks/use-live-connection";
import { Link } from "../ui/link";
import { LiveChip } from "../ui/live-chip";
import { Logo } from "../ui/logo";

type TopBarProps = { online: number | undefined; status: ConnectionStatus };

export const TopBar = ({ online, status }: TopBarProps) => (
  <header className="mx-auto flex w-full max-w-[1000px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
    <Logo />
    <div className="flex items-center gap-3 sm:gap-5">
      <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-5">
        {NAVBAR_LINKS.map((link) => (
          <Link
            className="whitespace-nowrap text-sm text-muted transition-colors duration-200 ease-out hover:text-ivory"
            key={link.href}
            to={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <LiveChip online={online} status={status} />
    </div>
  </header>
);
