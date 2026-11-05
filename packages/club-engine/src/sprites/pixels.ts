export type Grid = readonly string[];
export type Palette = Readonly<Record<string, number>>;
export type BlitOptions = { readonly scale?: number; readonly shear?: number };

export class Pixels {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8Array;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height * 4);
  }

  static fromGrid(grid: Grid, palette: Palette): Pixels {
    const width = grid.reduce((max, row) => Math.max(max, row.length), 0);
    const pixels = new Pixels(width, grid.length);
    grid.forEach((row, y) => {
      for (let x = 0; x < row.length; x += 1) {
        const color = palette[row.charAt(x)];
        if (color !== undefined) {
          pixels.set(x, y, color);
        }
      }
    });
    return pixels;
  }

  set(x: number, y: number, color: number): void {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return;
    }
    const i = (y * this.width + x) * 4;
    this.data[i] = (color >> 16) & 255;
    this.data[i + 1] = (color >> 8) & 255;
    this.data[i + 2] = color & 255;
    this.data[i + 3] = 255;
  }

  getColor(x: number, y: number): number | null {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null;
    }
    const i = (y * this.width + x) * 4;
    if (this.data[i + 3] === 0) {
      return null;
    }
    return ((this.data[i] ?? 0) << 16) | ((this.data[i + 1] ?? 0) << 8) | (this.data[i + 2] ?? 0);
  }

  fillRect(x: number, y: number, w: number, h: number, color: number): void {
    for (let py = y; py < y + h; py += 1) {
      for (let px = x; px < x + w; px += 1) {
        this.set(px, py, color);
      }
    }
  }

  blit(source: Pixels, ox: number, oy: number, options: BlitOptions = {}): void {
    const scale = options.scale ?? 1;
    const shear = options.shear ?? 0;
    const offset = shear < 0 ? Math.round(-shear * source.width * scale) : 0;
    for (let sy = 0; sy < source.height; sy += 1) {
      for (let sx = 0; sx < source.width; sx += 1) {
        const color = source.getColor(sx, sy);
        if (color === null) {
          continue;
        }
        this.blitCell(color, ox + sx * scale, oy + sy * scale, sx * scale, scale, shear, offset);
      }
    }
  }

  private blitCell(
    color: number,
    px: number,
    py: number,
    dx: number,
    scale: number,
    shear: number,
    offset: number,
  ): void {
    for (let ix = 0; ix < scale; ix += 1) {
      const dy = Math.round(shear * (dx + ix)) + offset;
      for (let iy = 0; iy < scale; iy += 1) {
        this.set(px + ix, py + iy + dy, color);
      }
    }
  }
}

export function shearedSize(source: Pixels, scale: number, shear: number): Pixels {
  const extra = Math.round(Math.abs(shear) * source.width * scale);
  return new Pixels(source.width * scale, source.height * scale + extra);
}

export function scaled(source: Pixels, scale: number, shear = 0): Pixels {
  const out = shearedSize(source, scale, shear);
  out.blit(source, 0, 0, { scale, shear });
  return out;
}
