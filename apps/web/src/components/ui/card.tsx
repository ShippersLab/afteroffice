import type { ReactNode } from "react";

type CardProps = { className?: string; children: ReactNode };

export const Card = ({ className = "", children }: CardProps) => (
  <div
    className={`rounded-md border border-line bg-panel/60 p-6 transition-[border-color,background-color] duration-200 ease-out hover:border-muted/40 ${className}`}
  >
    {children}
  </div>
);
