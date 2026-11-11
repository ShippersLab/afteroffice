import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../utilities/reduced-motion";
import { hasFlag, setFlag } from "../utilities/session-flag";

export const ENTRANCE_MS = 2300;
const FLAG = "afteroffice:entered";

export const useEntrance = (): boolean => {
  const [visible, setVisible] = useState(() => !prefersReducedMotion() && !hasFlag(FLAG));

  useEffect(() => {
    if (!visible) return;
    setFlag(FLAG);
    const skip = () => setVisible(false);
    const timer = window.setTimeout(skip, ENTRANCE_MS);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [visible]);

  return visible;
};
