import { NAVBAR_LINKS } from "../../content/nav";
import type { ConnectionStatus } from "../../hooks/use-live-connection";
import { Link } from "../ui/link";
import { LiveChip } from "../ui/live-chip";
import { Logo } from "../ui/logo";

type TopBarProps = { online: number | undefined; status: ConnectionStatus };

export const TopBar = ({ online, status }: TopBarProps) => (
  <header className="mx-auto flex w-full max-w-[1200px] shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-5 sm:px-8 sm:py-6">
    <Logo />
    <nav
      aria-label="Primary"
      className="order-last flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:order-none sm:ml-auto sm:w-auto sm:gap-5 sm:text-sm"
    >
      {NAVBAR_LINKS.map((link) => (
        <Link
          className="whitespace-nowrap text-muted transition-colors duration-200 ease-out hover:text-ivory"
          key={link.href}
          to={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
    <LiveChip online={online} status={status} />
  </header>
);
