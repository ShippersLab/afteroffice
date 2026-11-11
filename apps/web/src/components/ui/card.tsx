import type { ReactNode } from "react";

type CardProps = { className?: string; children: ReactNode };

export const Card = ({ className = "", children }: CardProps) => (
  <div className={`rounded-md border border-line bg-panel/60 p-6 ${className}`}>{children}</div>
);
