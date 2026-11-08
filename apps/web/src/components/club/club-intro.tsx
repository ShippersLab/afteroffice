import { CLUB } from "../../content/club";
import { HERO } from "../../content/hero";
import { HOW_IT_WORKS } from "../../content/how-it-works";
import { Button } from "../ui/button";

export const ClubIntro = () => (
  <aside className="pointer-events-auto absolute bottom-4 left-4 w-[min(18rem,calc(100vw-2rem))] animate-rise rounded-lg border border-line bg-panel/85 p-4 backdrop-blur-md transition-[border-color,background-color] duration-200 ease-out [animation-delay:160ms] hover:border-muted/50">
    <h1 className="text-xl leading-tight">
      {HERO.titleLead} <span className="text-magenta">{HERO.titleAccent}</span>
    </h1>
    <p className="mt-2 text-xs text-muted">{HERO.lead}</p>
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <Button href="/join" size="sm">
        {HERO.cta}
      </Button>
      <Button href="/how-it-works" size="sm" variant="secondary">
        {HOW_IT_WORKS.title}
      </Button>
    </div>
    <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted/70">{CLUB.hint}</p>
  </aside>
);
