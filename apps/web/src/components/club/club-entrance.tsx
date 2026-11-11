import { ENTRANCE } from "../../content/club";

export const ClubEntrance = () => (
  <div
    aria-label={ENTRANCE.label}
    className="fixed inset-0 z-30 grid animate-entrance-out cursor-pointer place-items-center bg-ink"
    role="status"
  >
    <div aria-hidden="true" className="absolute inset-0 animate-bass bg-room" />
    <div className="relative flex flex-col items-center gap-8 px-6 text-center">
      <div
        aria-hidden="true"
        className="relative h-56 w-36 animate-bass overflow-hidden border-4 border-lilac bg-magenta shadow-glow-magenta"
      >
        <div className="absolute inset-y-0 left-0 w-1/2 animate-door-left bg-velvet border-r-2 border-line" />
        <div className="absolute inset-y-0 right-0 w-1/2 animate-door-right bg-velvet border-l-2 border-line" />
        <div className="absolute top-1/2 left-1 size-2 bg-amber" />
        <div className="absolute top-1/2 right-1 size-2 bg-amber" />
      </div>
      <p className="font-display text-xl tracking-tight text-ivory sm:text-2xl">{ENTRANCE.label}</p>
      <p className="font-mono text-xs text-muted">{ENTRANCE.skip}</p>
    </div>
  </div>
);
