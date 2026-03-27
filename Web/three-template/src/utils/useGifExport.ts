import { useRef, useState } from "react";
import type { RefObject } from "react";

export type RecordPhase = "idle" | "capturing" | "encoding";
export type GifQuality = "low" | "medium" | "high";
export type GifResolution = 360 | 480 | 720;

const FRAME_COUNT = 72;
const FRAME_DELAY = 80; // ms between captured frames
const YIELD_EVERY = 6;  // yield to browser every N encoded frames

const QUALITY_CFG = {
  low:    { format: "rgb444"  as const, sampleEvery: 8, dither: false },
  medium: { format: "rgb565"  as const, sampleEvery: 4, dither: false },
  high:   { format: "rgb565"  as const, sampleEvery: 2, dither: true  },
};

/**
 * Build a 5-bit/channel (32³ = 32 768 entry) nearest-colour lookup table.
 * Cost: ~8 M ops, paid once per export — makes per-pixel FS dithering O(1).
 */
function buildLUT(
  palette: Uint8Array,
  stride: number,
  skipIndex: number,
): Uint8Array {
  const n = Math.floor(palette.length / stride);
  const lut = new Uint8Array(32768);
  for (let r5 = 0; r5 < 32; r5++) {
    const r = (r5 << 3) | (r5 >> 2);
    for (let g5 = 0; g5 < 32; g5++) {
      const g = (g5 << 3) | (g5 >> 2);
      for (let b5 = 0; b5 < 32; b5++) {
        const b = (b5 << 3) | (b5 >> 2);
        let best = 0;
        let bestD = Infinity;
        for (let c = 0; c < n; c++) {
          if (c === skipIndex) continue;
          const dr = r - palette[c * stride];
          const dg = g - palette[c * stride + 1];
          const db = b - palette[c * stride + 2];
          const d = dr * dr + dg * dg + db * db;
          if (d < bestD) { bestD = d; best = c; if (d === 0) break; }
        }
        lut[(r5 << 10) | (g5 << 5) | b5] = best;
      }
    }
  }
  return lut;
}

/** Floyd-Steinberg dithering with LUT-accelerated colour matching. */
function ditherFS(
  rgba: Uint8ClampedArray,
  palette: Uint8Array,
  stride: number,
  lut: Uint8Array,
  width: number,
  height: number,
  transparentIndex: number,
): Uint8Array {
  const total = width * height;
  const er = new Float32Array(total);
  const eg = new Float32Array(total);
  const eb = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    er[i] = rgba[i * 4];
    eg[i] = rgba[i * 4 + 1];
    eb[i] = rgba[i * 4 + 2];
  }

  const out = new Uint8Array(total);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pi = y * width + x;

      if (transparentIndex >= 0 && rgba[pi * 4 + 3] < 128) {
        out[pi] = transparentIndex;
        continue;
      }

      const cr = Math.max(0, Math.min(255, er[pi]));
      const cg = Math.max(0, Math.min(255, eg[pi]));
      const cb = Math.max(0, Math.min(255, eb[pi]));

      const best = lut[((cr >> 3) << 10) | ((cg >> 3) << 5) | (cb >> 3)];
      out[pi] = best;

      const qr = cr - palette[best * stride];
      const qg = cg - palette[best * stride + 1];
      const qb = cb - palette[best * stride + 2];

      if (x + 1 < width) {
        er[pi + 1] += qr * 7 / 16;
        eg[pi + 1] += qg * 7 / 16;
        eb[pi + 1] += qb * 7 / 16;
      }
      if (y + 1 < height) {
        const row = pi + width;
        if (x > 0) {
          er[row - 1] += qr * 3 / 16;
          eg[row - 1] += qg * 3 / 16;
          eb[row - 1] += qb * 3 / 16;
        }
        er[row] += qr * 5 / 16;
        eg[row] += qg * 5 / 16;
        eb[row] += qb * 5 / 16;
        if (x + 1 < width) {
          er[row + 1] += qr * 1 / 16;
          eg[row + 1] += qg * 1 / 16;
          eb[row + 1] += qb * 1 / 16;
        }
      }
    }
  }
  return out;
}

const tick = () => new Promise<void>(r => setTimeout(r, 0));

export function useGifExport(
  containerRef: RefObject<HTMLDivElement | null>,
  filename = "model.gif",
  bgColor = "#000000",
  transparent = false,
  quality: GifQuality = "medium",
  resolution: GifResolution = 480,
) {
  const [phase, setPhase] = useState<RecordPhase>("idle");
  const [progress, setProgress] = useState(0);
  const abortRef = useRef(false);

  const exportGif = async () => {
    if (phase !== "idle") return;
    const canvas = containerRef.current?.querySelector("canvas");
    if (!canvas) return;

    abortRef.current = false;
    setPhase("capturing");
    setProgress(0);

    const scale = Math.min(1, resolution / canvas.width);
    const w = Math.round(canvas.width * scale);
    const h = Math.round(canvas.height * scale);

    const tmp = document.createElement("canvas");
    tmp.width = w;
    tmp.height = h;
    const ctx = tmp.getContext("2d", { willReadFrequently: true })!;

    const frames: Uint8ClampedArray[] = [];

    // ── Capture phase ─────────────────────────────────────────────────────────
    await new Promise<void>((resolve) => {
      let count = 0;
      let lastCapture = 0;

      const capture = (timestamp: number) => {
        if (abortRef.current) { resolve(); return; }

        if (timestamp - lastCapture >= FRAME_DELAY) {
          lastCapture = timestamp;
          if (transparent) {
            ctx.clearRect(0, 0, w, h);
          } else {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, w, h);
          }
          ctx.drawImage(canvas, 0, 0, w, h);
          frames.push(new Uint8ClampedArray(ctx.getImageData(0, 0, w, h).data));
          count++;
          setProgress(Math.round((count / FRAME_COUNT) * 100));
          if (count >= FRAME_COUNT) { resolve(); return; }
        }

        requestAnimationFrame(capture);
      };
      requestAnimationFrame(capture);
    });

    if (abortRef.current) { setPhase("idle"); return; }

    // ── Encoding phase ────────────────────────────────────────────────────────
    setPhase("encoding");
    setProgress(0);
    await tick(); // let browser paint "Kodowanie 0%" before heavy work

    const cfg = QUALITY_CFG[quality];
    const format = transparent ? "rgba4444" : cfg.format;
    // rgb444 and rgb565 both produce 3-byte palette entries; rgba4444 = 4 bytes
    const stride = transparent ? 4 : 3;

    const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
    const gif = GIFEncoder();

    const samples = frames.filter((_, i) => i % cfg.sampleEvery === 0);
    const combined = new Uint8ClampedArray(samples.reduce((s, f) => s + f.length, 0));
    let off = 0;
    for (const f of samples) { combined.set(f, off); off += f.length; }

    const palette = quantize(combined, 256, { format, oneBitAlpha: transparent });

    let transparentIndex = -1;
    if (transparent) {
      for (let i = 0; i < Math.floor(palette.length / stride); i++) {
        if (palette[i * stride + 3] === 0) { transparentIndex = i; break; }
      }
    }

    const lut = cfg.dither ? buildLUT(palette, stride, transparentIndex) : null;

    for (let fi = 0; fi < frames.length; fi++) {
      const index = lut
        ? ditherFS(frames[fi], palette, stride, lut, w, h, transparentIndex)
        : applyPalette(frames[fi], palette, format);

      gif.writeFrame(index, w, h, {
        palette: fi === 0 ? palette : undefined,
        delay: FRAME_DELAY,
        repeat: 0,
        ...(transparentIndex >= 0 ? { transparent: true, transparentIndex } : {}),
      });

      const pct = Math.round(((fi + 1) / frames.length) * 100);
      setProgress(pct);

      // Yield periodically so the browser stays responsive and progress updates paint
      if (fi % YIELD_EVERY === YIELD_EVERY - 1) await tick();
    }

    gif.finish();

    const blob = new Blob([gif.bytes() as Uint8Array<ArrayBuffer>], { type: "image/gif" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    setPhase("idle");
    setProgress(0);
  };

  return { exportGif, phase, progress, isRecording: phase !== "idle" };
}
