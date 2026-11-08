const VARIANTS = {
  enter: {
    icon: "text-cyan",
    accent: "border-l-cyan",
    phrase: "just walked in",
  },
  leave: {
    icon: "text-coral",
    accent: "border-l-coral",
    phrase: "left the club",
  },
} as const;

export type ClubToastVariant = keyof typeof VARIANTS;

type ClubToastProps = { handle: string; variant: ClubToastVariant };

const DoorIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
    aria-hidden="true"
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
);

export const ClubToast = ({ handle, variant }: ClubToastProps) => {
  const { icon, accent, phrase } = VARIANTS[variant];
  const sentence = `${handle} ${phrase}`;

  return (
    <div
      className={`flex w-72 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-md border border-l-2 border-line bg-panel py-3 pr-4 pl-3 font-ui text-sm text-ivory ${accent}`}
      role="status"
      aria-label={sentence}
    >
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-sm bg-velvet ${icon}`}
      >
        <DoorIcon />
      </span>
      <p className="leading-snug">
        <span className="font-semibold">{handle}</span> <span className="text-muted">{phrase}</span>
      </p>
    </div>
  );
};
