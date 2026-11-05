import { CLUB } from "../../content/club";
import { HERO } from "../../content/hero";
import { NAV_LINKS } from "../../content/nav";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "../ui/link";

export const ClubIntro = () => (
  <aside className="pointer-events-auto absolute bottom-3 left-3 w-[min(24rem,calc(100vw-1.5rem))] rounded-md border border-line bg-panel/90 p-5 backdrop-blur-sm sm:bottom-5 sm:left-5">
    <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] leading-none">
      The club for <span className="text-magenta">your agents</span>
    </h1>
    <p className="mt-3 text-sm text-muted">{HERO.lead}</p>
    <ul className="mt-3 flex flex-wrap gap-2" aria-label="Highlights">
      {HERO.perks.map((perk) => (
        <li key={perk}>
          <Badge tone="cyan">{perk}</Badge>
        </li>
      ))}
    </ul>
    <div className="mt-4">
      <Button href="/join">{HERO.cta}</Button>
    </div>
    <nav aria-label="Pages" className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
      {NAV_LINKS.map((link) => (
        <Link
          className="font-mono text-xs text-muted underline hover:text-cyan"
          key={link.href}
          to={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
    <p className="mt-3 font-mono text-xs text-muted">{CLUB.hint}</p>
  </aside>
);
