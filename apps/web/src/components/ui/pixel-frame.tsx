import type { ReactNode } from "react";

const TONES = {
  line: "border-line shadow-pixel",
  magenta: "border-magenta shadow-pixel-magenta",
  cyan: "border-cyan shadow-pixel-cyan",
  amber: "border-amber shadow-pixel-amber",
} as const;

type PixelFrameProps = {
  tone?: keyof typeof TONES;
  className?: string;
  children: ReactNode;
};

export const PixelFrame = ({ tone = "line", className = "", children }: PixelFrameProps) => (
  <div className={`rounded-md border-2 bg-panel p-5 ${TONES[tone]} ${className}`}>{children}</div>
);
