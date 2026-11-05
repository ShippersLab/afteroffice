import type { ComponentProps, MouseEvent } from "react";
import { navigate } from "../../library/routing/navigation";

type LinkProps = Omit<ComponentProps<"a">, "href"> & { to: string };

const isPlainLeftClick = (event: MouseEvent<HTMLAnchorElement>): boolean =>
  !event.defaultPrevented &&
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey;

export const Link = ({ to, onClick, children, ...rest }: LinkProps) => (
  <a
    {...rest}
    href={to}
    onClick={(event) => {
      onClick?.(event);
      if (!isPlainLeftClick(event)) return;
      event.preventDefault();
      navigate(to);
    }}
  >
    {children}
  </a>
);
