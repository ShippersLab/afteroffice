import type { ReactNode } from "react";
import { buttonClass } from "./button";

type ActionButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  children: ReactNode;
};

export const ActionButton = ({
  onClick,
  disabled = false,
  variant = "secondary",
  children,
}: ActionButtonProps) => (
  <button
    className={`${buttonClass(variant, "md")} disabled:opacity-60`}
    disabled={disabled}
    onClick={onClick}
    type="button"
  >
    {children}
  </button>
);
