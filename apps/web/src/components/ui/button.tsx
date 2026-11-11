import type { ReactNode } from "react";
import { Link } from "./link";

const VARIANTS = {
  primary: "bg-magenta text-ink hover:brightness-105",
  secondary: "border border-line bg-transparent text-ivory hover:border-cyan hover:text-cyan",
  sponsor: "border border-line text-amber hover:border-amber/60",
} as const;

const SIZES = {
  sm: "min-h-9 px-4 text-xs pointer-coarse:min-h-11",
  md: "min-h-11 px-5 text-sm",
} as const;

export const buttonClass = (variant: keyof typeof VARIANTS, size: keyof typeof SIZES): string =>
  `inline-flex cursor-pointer items-center justify-center rounded-full font-ui font-semibold transition-[transform,background-color,filter,border-color,color] duration-200 ease-out active:scale-[0.96] active:duration-150 ${SIZES[size]} ${VARIANTS[variant]}`;

type ButtonProps = {
  href: string;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  external?: boolean;
  children: ReactNode;
};

export const Button = ({
  href,
  variant = "primary",
  size = "md",
  external = false,
  children,
}: ButtonProps) => {
  const className = buttonClass(variant, size);
  if (external) {
    return (
      <a className={className} href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  }
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
