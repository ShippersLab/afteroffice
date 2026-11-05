import type { ReactNode } from "react";

const TONES = {
  amber: "text-amber",
  cyan: "text-cyan",
  muted: "text-muted",
} as const;

export type BadgeTone = keyof typeof TONES;

type BadgeProps = { tone?: BadgeTone; children: ReactNode };

export const Badge = ({ tone = "muted", children }: BadgeProps) => (
  <span className={`inline-flex w-fit items-center font-mono text-xs ${TONES[tone]}`}>
    {children}
  </span>
);
