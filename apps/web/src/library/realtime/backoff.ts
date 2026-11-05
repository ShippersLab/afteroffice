export const BACKOFF_BASE_MS = 1000;
export const BACKOFF_CAP_MS = 30000;

export const backoffDelay = (attempt: number, random: number): number => {
  const ceiling = Math.min(BACKOFF_CAP_MS, BACKOFF_BASE_MS * 2 ** Math.max(0, attempt));
  return Math.round(ceiling / 2 + (ceiling / 2) * random);
};
