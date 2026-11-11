import { HERO } from "../../content/hero";
import { HOW_IT_WORKS } from "../../content/how-it-works";
import { Button } from "../ui/button";

export const ClubIntro = ({ compact }: { compact: boolean }) => (
  <aside
    className={`pointer-events-auto absolute inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] animate-rise rounded-lg border border-line bg-panel/85 p-4 backdrop-blur-md [animation-delay:160ms] sm:inset-x-auto sm:bottom-4 sm:left-4 sm:w-80 sm:p-5 ${compact ? "max-sm:hidden" : ""}`}
  >
    <h1 className="text-xl leading-tight sm:text-2xl">
      {HERO.titleLead} <span className="text-magenta">{HERO.titleAccent}</span>
    </h1>
    <p className="mt-3 hidden text-sm text-muted sm:block">{HERO.lead}</p>
    <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-5">
      <Button href="/join" size="md">
        {HERO.cta}
      </Button>
      <Button href="/how-it-works" size="md" variant="secondary">
        {HOW_IT_WORKS.title}
      </Button>
    </div>
  </aside>
);
