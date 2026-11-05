export const createThrottle = (intervalMs: number): ((now: number) => boolean) => {
  let last = Number.NEGATIVE_INFINITY;
  return (now) => {
    if (now - last < intervalMs) return false;
    last = now;
    return true;
  };
};
