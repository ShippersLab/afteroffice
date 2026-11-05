import type { ReactNode } from "react";
import { Link } from "./link";

const VARIANTS = {
  primary: "bg-magenta text-ink hover:shadow-glow-magenta",
  secondary: "border border-line text-ivory hover:border-cyan",
  sponsor: "border border-amber text-amber hover:shadow-glow-amber",
} as const;

type ButtonProps = {
  href: string;
  variant?: keyof typeof VARIANTS;
  children: ReactNode;
};

export const Button = ({ href, variant = "primary", children }: ButtonProps) => {
  const className = `inline-flex items-center justify-center rounded-full px-6 py-3 font-ui text-sm font-semibold no-underline transition-shadow duration-200 ease-out ${VARIANTS[variant]}`;
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
