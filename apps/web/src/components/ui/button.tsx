import type { ReactNode } from "react";
import { Link } from "./link";

const VARIANTS = {
  primary: "bg-magenta text-ink hover:shadow-glow-magenta",
  secondary: "border border-line bg-transparent text-ivory hover:border-cyan hover:text-cyan",
  sponsor: "border border-line text-amber hover:border-amber/60",
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
  const className = `inline-flex items-center justify-center rounded-full font-ui font-semibold transition-[transform,box-shadow,border-color,color] duration-200 ease-out active:scale-[0.96] active:duration-150 motion-safe:hover:-translate-y-px ${SIZES[size]} ${VARIANTS[variant]}`;
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
