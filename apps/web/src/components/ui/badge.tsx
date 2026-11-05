import type { ReactNode } from "react";

const TONES = {
  amber: "border-amber text-amber",
  cyan: "border-cyan text-cyan",
  magenta: "border-magenta text-magenta",
  muted: "border-line text-muted",
} as const;

export type BadgeTone = keyof typeof TONES;

type BadgeProps = { tone?: BadgeTone; children: ReactNode };

export const Badge = ({ tone = "muted", children }: BadgeProps) => (
  <span
    className={`inline-flex w-fit items-center rounded-full border-[1.5px] px-3 py-0.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] ${TONES[tone]}`}
  >
    {children}
  </span>
);
