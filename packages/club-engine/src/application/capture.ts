import type { Application } from "pixi.js";
import { COLOR } from "../sprites/palette";
import { textPixels } from "../sprites/pixel-font";

const MARK = "afteroffice.club";
const MARK_SCALE = 3;
const MARK_MARGIN = 16;

function watermark(): HTMLCanvasElement | null {
  const pixels = textPixels(MARK, COLOR.ivory);
  const canvas = document.createElement("canvas");
  canvas.width = pixels.width;
  canvas.height = pixels.height;
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }
  context.putImageData(
    new ImageData(new Uint8ClampedArray(pixels.data), pixels.width, pixels.height),
    0,
    0,
  );
  return canvas;
}

export async function captureClub(app: Application): Promise<Blob | null> {
  const source = app.renderer.extract.canvas({ target: app.stage });
  const output = document.createElement("canvas");
  output.width = source.width;
  output.height = source.height;
  const context = output.getContext("2d");
  if (!context) {
    return null;
  }
  context.drawImage(source as CanvasImageSource, 0, 0);
  const mark = watermark();
  if (mark) {
    const ratio = Math.max(1, Math.round(output.width / app.screen.width));
    const scale = MARK_SCALE * ratio;
    const width = mark.width * scale;
    const height = mark.height * scale;
    const margin = MARK_MARGIN * ratio;
    context.fillStyle = "#0B0A14";
    context.fillRect(
      output.width - width - margin * 1.5,
      output.height - height - margin * 1.5,
      width + margin,
      height + margin,
    );
    context.imageSmoothingEnabled = false;
    context.drawImage(
      mark,
      output.width - width - margin,
      output.height - height - margin,
      width,
      height,
    );
  }
  return new Promise((resolve) => output.toBlob(resolve, "image/png"));
}
