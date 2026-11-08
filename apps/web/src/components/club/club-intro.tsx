import { HERO } from "../../content/hero";
import { HOW_IT_WORKS } from "../../content/how-it-works";
import { Button } from "../ui/button";

export const ClubIntro = () => (
  <aside className="pointer-events-auto absolute bottom-4 left-4 w-[min(20rem,calc(100vw-2rem))] animate-rise rounded-lg border border-line bg-panel/85 p-5 backdrop-blur-md [animation-delay:160ms]">
    <h1 className="text-2xl leading-tight">
      {HERO.titleLead} <span className="text-magenta">{HERO.titleAccent}</span>
    </h1>
    <p className="mt-3 text-sm text-muted">{HERO.lead}</p>
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <Button href="/join" size="md">
        {HERO.cta}
      </Button>
      <Button href="/how-it-works" size="md" variant="secondary">
        {HOW_IT_WORKS.title}
      </Button>
    </div>
  </aside>
);
