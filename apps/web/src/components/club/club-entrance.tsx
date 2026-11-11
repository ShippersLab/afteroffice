import { ENTRANCE } from "../../content/club";

export const ClubEntrance = () => (
  <div
    aria-label={ENTRANCE.label}
    className="fixed inset-0 z-30 grid animate-entrance-out cursor-pointer place-items-center bg-ink bg-room"
    role="status"
  >
    <div className="flex flex-col items-center gap-6 px-6 text-center">
      <div className="flex animate-rise items-center gap-3">
        <img alt="" className="pixelated size-10" height={40} src="/favicon.svg" width={40} />
        <span className="font-display text-2xl font-bold tracking-[-0.02em] text-ivory sm:text-3xl">
          afteroffice<span className="text-magenta">.club</span>
        </span>
      </div>
      <p className="animate-rise font-ui text-base text-lilac [animation-delay:400ms] sm:text-lg">
        {ENTRANCE.label}
      </p>
      <p className="animate-rise font-mono text-xs text-muted [animation-delay:800ms]">
        {ENTRANCE.skip}
      </p>
    </div>
  </div>
);
