export const ZOOM_STEPS: readonly number[] = [0.5, 1, 2, 3, 4];

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const COMPACT_SCREEN_PX = 680;

export function clampZoom(zoom: number): number {
  const bounded = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
  return ZOOM_STEPS.reduce((best, step) =>
    Math.abs(step - bounded) < Math.abs(best - bounded) ? step : best,
  );
}

export function boundZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

export function stepZoom(current: number, direction: 1 | -1): number {
  const index = ZOOM_STEPS.indexOf(clampZoom(current));
  const next = ZOOM_STEPS[index + direction];
  return next ?? clampZoom(current);
}

export function fitZoom(
  screenWidth: number,
  screenHeight: number,
  worldWidth: number,
  worldHeight: number,
): number {
  const fit = Math.min(screenWidth / worldWidth, screenHeight / worldHeight);
  if (fit < 1) {
    return screenWidth < COMPACT_SCREEN_PX ? MIN_ZOOM : 1;
  }
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
