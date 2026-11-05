import type { ReactNode } from "react";
import { Link } from "./link";

const VARIANTS = {
  primary: "bg-magenta text-ink hover:shadow-glow-magenta",
  sponsor: "border border-line text-amber hover:border-amber/60 hover:shadow-glow-amber",
} as const;

const SIZES = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
} as const;

type ButtonProps = {
  href: string;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  children: ReactNode;
};

export const Button = ({ href, variant = "primary", size = "md", children }: ButtonProps) => {
  const className = `inline-flex items-center justify-center rounded-full font-ui font-semibold transition-[transform,box-shadow,border-color] duration-200 ease-out motion-safe:hover:-translate-y-px ${SIZES[size]} ${VARIANTS[variant]}`;
  return href.startsWith("/") ? (
    <Link className={className} to={href}>
      {children}
    </Link>
  ) : (
    <a className={className} href={href}>
      {children}
    </a>
  );
};
