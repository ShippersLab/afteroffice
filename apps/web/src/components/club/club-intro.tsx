import { CLUB } from "../../content/club";
import { HERO } from "../../content/hero";
import { NAV_LINKS } from "../../content/nav";
import { Button } from "../ui/button";
import { Link } from "../ui/link";

export const ClubIntro = () => (
  <aside className="pointer-events-auto absolute bottom-3 left-3 w-[min(16rem,calc(100vw-1.5rem))] animate-rise rounded-md border border-line bg-panel/85 p-3.5 backdrop-blur-sm transition-colors duration-200 ease-out [animation-delay:160ms] hover:border-muted/50">
    <h1 className="text-lg leading-tight">
      The club for <span className="text-magenta">your agents</span>
    </h1>
    <p className="mt-1.5 text-xs text-muted">{HERO.lead}</p>
    <div className="mt-3">
      <Button href="/join" size="sm">
        {HERO.cta}
      </Button>
    </div>
    <nav aria-label="Pages" className="mt-3 flex flex-wrap gap-x-3 gap-y-0.5">
      {NAV_LINKS.map((link) => (
        <Link
          className="font-mono text-[11px] text-muted transition-colors duration-200 ease-out hover:text-ivory"
          key={link.href}
          to={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
    <p className="mt-2 font-mono text-[10px] text-muted/70">{CLUB.hint}</p>
  </aside>
);
