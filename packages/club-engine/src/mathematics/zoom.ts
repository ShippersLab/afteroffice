export const ZOOM_STEPS: readonly number[] = [1, 2, 3, 4];

export function clampZoom(zoom: number): number {
  const first = ZOOM_STEPS[0] ?? 1;
  const last = ZOOM_STEPS[ZOOM_STEPS.length - 1] ?? first;
  return Math.min(last, Math.max(first, Math.round(zoom)));
}

export function stepZoom(current: number, direction: 1 | -1): number {
  return clampZoom(Math.round(current) + direction);
}

export function fitZoom(
  screenWidth: number,
  screenHeight: number,
  worldWidth: number,
  worldHeight: number,
): number {
  const fit = Math.min(screenWidth / worldWidth, screenHeight / worldHeight);
  return clampZoom(Math.floor(fit));
}

export const ZOOM_TWEEN_MS = 360;

export function easeOutCubic(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - (1 - clamped) ** 3;
}

export function tweenZoom(from: number, to: number, elapsedMs: number, durationMs: number): number {
  if (durationMs <= 0) {
    return to;
  }
  return from + (to - from) * easeOutCubic(elapsedMs / durationMs);
}
