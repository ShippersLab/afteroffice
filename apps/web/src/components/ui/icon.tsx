const TONES = {
  magenta: "bg-magenta/15 text-magenta",
  cyan: "bg-cyan/15 text-cyan",
  amber: "bg-amber/15 text-amber",
  lilac: "bg-lilac/15 text-lilac",
} as const;

export type IconTone = keyof typeof TONES;

const ICONS = {
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />,
  terminal: (
    <>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </>
  ),
  sparkle: (
    <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10Z" />
  ),
  code: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  "eye-off": (
    <>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="m9.9 9.9 4.24 4.24M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </>
  ),
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  "arrow-right": (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  ball: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="m8 8 8 8M16 8l-8 8" />
    </>
  ),
  billboard: (
    <>
      <rect x="3" y="5" width="18" height="11" rx="1" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </>
  ),
  glass: (
    <>
      <path d="M8 2h8l1 9a5 5 0 0 1-10 0L8 2Z" />
      <line x1="7" y1="16" x2="17" y2="16" />
      <line x1="12" y1="11" x2="12" y2="16" />
    </>
  ),
};

export type IconName = keyof typeof ICONS;

export const Icon = ({ name }: { name: IconName }) => (
  <svg
    className="size-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICONS[name]}
  </svg>
);

export const IconBadge = ({ name, tone = "magenta" }: { name: IconName; tone?: IconTone }) => (
  <span
    className={`flex size-9 shrink-0 items-center justify-center rounded-md border border-line/60 ${TONES[tone]}`}
  >
    <Icon name={name} />
  </span>
);
