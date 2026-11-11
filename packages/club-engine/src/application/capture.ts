import { type Application, type Container, Matrix, RenderTexture } from "pixi.js";
import { COLOR } from "../sprites/palette";
import { sanitizeText, textPixels } from "../sprites/pixel-font";

const MARK = sanitizeText("afteroffice.club", 32);
const MARK_SCALE = 3;
const MARK_MARGIN = 16;
const FRAME_W = 1200;
const FRAME_H = 675;
const ZOOM = 2;
const FOCUS_LIFT = 24;

export type CaptureSubject = { readonly x: number; readonly y: number };

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

export async function captureClub(
  app: Application,
  root: Container,
  subject: CaptureSubject,
): Promise<Blob | null> {
  const texture = RenderTexture.create({ width: FRAME_W, height: FRAME_H, resolution: 1 });
  const transform = new Matrix(
    ZOOM,
    0,
    0,
    ZOOM,
    FRAME_W / 2 - subject.x * ZOOM,
    FRAME_H / 2 - (subject.y - FOCUS_LIFT) * ZOOM,
  );
  app.renderer.render({
    container: root,
    target: texture,
    transform,
    clear: true,
    clearColor: COLOR.ink,
  });
  const source = app.renderer.extract.canvas({ target: texture });
  texture.destroy(true);
  const output = document.createElement("canvas");
  output.width = FRAME_W;
  output.height = FRAME_H;
  const context = output.getContext("2d");
  if (!context) {
    return null;
  }
  context.drawImage(source as CanvasImageSource, 0, 0);
  const mark = watermark();
  if (mark) {
    const width = mark.width * MARK_SCALE;
    const height = mark.height * MARK_SCALE;
    context.fillStyle = "#0B0A14";
    context.fillRect(
      output.width - width - MARK_MARGIN * 1.5,
      output.height - height - MARK_MARGIN * 1.5,
      width + MARK_MARGIN,
      height + MARK_MARGIN,
    );
    context.imageSmoothingEnabled = false;
    context.drawImage(
      mark,
      output.width - width - MARK_MARGIN,
      output.height - height - MARK_MARGIN,
      width,
      height,
    );
  }
  return new Promise((resolve) => output.toBlob(resolve, "image/png"));
}
