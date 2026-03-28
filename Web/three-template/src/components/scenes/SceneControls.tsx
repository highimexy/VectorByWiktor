import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { HexColorPicker } from "react-colorful";
import { usePanelContext } from "../../context/PanelContext";
import type { RecordPhase, GifQuality, GifResolution, GifFps, GifDuration } from "../../utils/useGifExport";

export type MaterialType =
  | "original"
  | "chrome"
  | "glass"
  | "wireframe"
  | "gold"
  | "matte"
  | "neon"
  | "obsidian"
  | "hologram"
  | "water";

interface SceneControlsProps {
  bgColor: string;
  onBgColorChange: (color: string) => void;
  material: MaterialType;
  onMaterialChange: (m: MaterialType) => void;
  autoRotate: boolean;
  onAutoRotateChange: (v: boolean) => void;
  onScreenshot: () => void;
  onExportGif: () => void;
  isRecording: boolean;
  recordPhase: RecordPhase;
  recordProgress: number;
  gifTransparent: boolean;
  onGifTransparentChange: (v: boolean) => void;
  gifQuality: GifQuality;
  onGifQualityChange: (v: GifQuality) => void;
  gifResolution: GifResolution;
  onGifResolutionChange: (v: GifResolution) => void;
  gifFps: GifFps;
  onGifFpsChange: (v: GifFps) => void;
  gifDuration: GifDuration;
  onGifDurationChange: (v: GifDuration) => void;
  rotateSpeed: number;
  onRotateSpeedChange: (v: number) => void;
}

const MATERIALS: { value: MaterialType; label: string }[] = [
  { value: "original", label: "Oryginalny" },
  { value: "chrome", label: "Chrome" },
  { value: "glass", label: "Glass" },
  { value: "wireframe", label: "Wireframe" },
  { value: "gold", label: "Gold" },
  { value: "matte", label: "Matte" },
  { value: "neon", label: "Neon" },
  { value: "obsidian", label: "Obsidian" },
  { value: "hologram", label: "Hologram" },
  { value: "water",    label: "Water" },
];

export default function SceneControls({
  bgColor,
  onBgColorChange,
  material,
  onMaterialChange,
  autoRotate,
  onAutoRotateChange,
  onScreenshot,
  onExportGif,
  isRecording,
  recordPhase,
  recordProgress,
  gifTransparent,
  onGifTransparentChange,
  gifQuality,
  onGifQualityChange,
  gifResolution,
  onGifResolutionChange,
  gifFps,
  onGifFpsChange,
  gifDuration,
  onGifDurationChange,
  rotateSpeed,
  onRotateSpeedChange,
}: SceneControlsProps) {
  const { openPanel, setOpenPanel } = usePanelContext();
  const open = openPanel === "scene";
  const [colorOpen, setColorOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, scale: 0.94, y: -6 },
      { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power2.out" },
    );
  }, [open]);

  return (
    <div
      className="absolute right-4 top-15 z-100 flex flex-col items-end gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Toggle button */}
      <button
        onClick={() => { setOpenPanel(open ? null : "scene"); setColorOpen(false); }}
        aria-label="Ustawienia sceny"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/8 text-white backdrop-blur-md transition-all hover:bg-white/18"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{ transformOrigin: "top right" }}
          className="w-72 rounded-2xl border border-white/15 bg-white/8 shadow-2xl backdrop-blur-3xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <span className="text-sm font-semibold text-white/90">Scena</span>
            <button
              onClick={() => { setOpenPanel(null); setColorOpen(false); }}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mx-5 border-t border-white/10" />

          <ul className="px-3 py-2 pb-3">

            {/* Background color */}
            <li className="flex flex-col rounded-xl px-2 py-2.5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-white">Tło</p>
                <button
                  onClick={() => setColorOpen((v) => !v)}
                  className="h-7 w-12 cursor-pointer rounded-lg border border-white/15 transition-all hover:border-white/40"
                  style={{ backgroundColor: bgColor }}
                />
              </div>

              {colorOpen && (
                <div className="mt-3">
                  <HexColorPicker
                    color={bgColor}
                    onChange={onBgColorChange}
                    style={{ width: "100%", height: "160px" }}
                  />
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5">
                    <span className="text-xs text-white/40">#</span>
                    <input
                      type="text"
                      value={bgColor.replace("#", "")}
                      onChange={(e) => {
                        const v = "#" + e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
                        if (v.length === 7) onBgColorChange(v);
                      }}
                      className="w-full bg-transparent text-sm text-white outline-none"
                      maxLength={6}
                      spellCheck={false}
                    />
                  </div>
                </div>
              )}
            </li>

            {/* Material */}
            <li className="flex items-center justify-between gap-4 rounded-xl px-2 py-2.5">
              <p className="text-sm font-medium text-white">Materiał</p>
              <select
                value={material}
                onChange={(e) => onMaterialChange(e.target.value as MaterialType)}
                className="cursor-pointer rounded-xl border border-white/15 bg-white/8 px-3 py-1.5 text-xs text-white backdrop-blur-md outline-none transition-colors hover:bg-white/18 focus:border-white/30"
                style={{ appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", paddingRight: "28px" }}
              >
                {MATERIALS.map((m) => (
                  <option key={m.value} value={m.value} style={{ background: "#1a1a2e", color: "#fff" }}>
                    {m.label}
                  </option>
                ))}
              </select>
            </li>

            {/* Auto-rotate */}
            <li className="flex items-center justify-between gap-4 rounded-xl px-2 py-2.5">
              <p className="text-sm font-medium text-white">Auto-rotate</p>
              <button
                onClick={() => onAutoRotateChange(!autoRotate)}
                aria-label="Toggle auto-rotate"
                className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full border-none transition-colors duration-200 ${
                  autoRotate ? "bg-green-400" : "bg-white/20"
                }`}
              >
                <span
                  className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                    autoRotate ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </li>

            {/* Rotate speed */}
            <li className="flex flex-col gap-1.5 rounded-xl px-2 py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">Prędkość obrotu</p>
                <span className="text-xs text-white/40">{rotateSpeed.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={3}
                step={0.1}
                value={rotateSpeed}
                disabled={!autoRotate}
                onChange={(e) => onRotateSpeedChange(parseFloat(e.target.value))}
                className="w-full cursor-pointer accent-white disabled:opacity-40"
              />
            </li>

            <div className="mx-2 my-1 border-t border-white/10" />

            {/* GIF Export settings */}
            <li className="flex flex-col gap-2 rounded-xl px-2 py-2">

              {/* Quality + Resolution + FPS + Duration selects */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="px-0.5 text-xs text-white/40">Jakość</span>
                  <select
                    value={gifQuality}
                    onChange={(e) => onGifQualityChange(e.target.value as GifQuality)}
                    disabled={isRecording}
                    className="cursor-pointer rounded-xl border border-white/15 bg-white/8 px-2 py-1.5 text-xs text-white backdrop-blur-md outline-none transition-colors hover:bg-white/18 disabled:opacity-40"
                    style={{ appearance: "none" }}
                  >
                    <option value="low"    style={{ background: "#1a1a2e" }}>Niska</option>
                    <option value="medium" style={{ background: "#1a1a2e" }}>Średnia</option>
                    <option value="high"   style={{ background: "#1a1a2e" }}>Wysoka</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="px-0.5 text-xs text-white/40">Rozdzielczość</span>
                  <select
                    value={gifResolution}
                    onChange={(e) => onGifResolutionChange(parseInt(e.target.value) as GifResolution)}
                    disabled={isRecording}
                    className="cursor-pointer rounded-xl border border-white/15 bg-white/8 px-2 py-1.5 text-xs text-white backdrop-blur-md outline-none transition-colors hover:bg-white/18 disabled:opacity-40"
                    style={{ appearance: "none" }}
                  >
                    <option value={240}  style={{ background: "#1a1a2e" }}>240 px</option>
                    <option value={360}  style={{ background: "#1a1a2e" }}>360 px</option>
                    <option value={480}  style={{ background: "#1a1a2e" }}>480 px</option>
                    <option value={640}  style={{ background: "#1a1a2e" }}>640 px</option>
                    <option value={720}  style={{ background: "#1a1a2e" }}>720 px</option>
                    <option value={1080} style={{ background: "#1a1a2e" }}>1080 px</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="px-0.5 text-xs text-white/40">FPS</span>
                  <select
                    value={gifFps}
                    onChange={(e) => onGifFpsChange(parseInt(e.target.value) as GifFps)}
                    disabled={isRecording}
                    className="cursor-pointer rounded-xl border border-white/15 bg-white/8 px-2 py-1.5 text-xs text-white backdrop-blur-md outline-none transition-colors hover:bg-white/18 disabled:opacity-40"
                    style={{ appearance: "none" }}
                  >
                    <option value={10} style={{ background: "#1a1a2e" }}>10</option>
                    <option value={15} style={{ background: "#1a1a2e" }}>15</option>
                    <option value={20} style={{ background: "#1a1a2e" }}>20</option>
                    <option value={25} style={{ background: "#1a1a2e" }}>25</option>
                    <option value={30} style={{ background: "#1a1a2e" }}>30</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="px-0.5 text-xs text-white/40">Czas (s)</span>
                  <select
                    value={gifDuration}
                    onChange={(e) => onGifDurationChange(parseInt(e.target.value) as GifDuration)}
                    disabled={isRecording}
                    className="cursor-pointer rounded-xl border border-white/15 bg-white/8 px-2 py-1.5 text-xs text-white backdrop-blur-md outline-none transition-colors hover:bg-white/18 disabled:opacity-40"
                    style={{ appearance: "none" }}
                  >
                    <option value={2}  style={{ background: "#1a1a2e" }}>2 s</option>
                    <option value={3}  style={{ background: "#1a1a2e" }}>3 s</option>
                    <option value={5}  style={{ background: "#1a1a2e" }}>5 s</option>
                    <option value={8}  style={{ background: "#1a1a2e" }}>8 s</option>
                    <option value={10} style={{ background: "#1a1a2e" }}>10 s</option>
                    <option value={15} style={{ background: "#1a1a2e" }}>15 s</option>
                  </select>
                </div>
              </div>

              {/* Transparent toggle */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-white/70">Transparent</p>
                <button
                  onClick={() => onGifTransparentChange(!gifTransparent)}
                  disabled={isRecording}
                  aria-label="Toggle transparent GIF"
                  className={`relative h-6 w-10 shrink-0 cursor-pointer rounded-full border-none transition-colors duration-200 disabled:opacity-40 ${
                    gifTransparent ? "bg-indigo-400" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      gifTransparent ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

            </li>

            {/* Screenshot + GIF */}
            <li className="flex gap-2 rounded-xl px-2 pt-2 pb-1">
              <button
                onClick={onScreenshot}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 py-2 text-sm text-white/60 transition-colors hover:bg-white/15 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                PNG
              </button>
              <button
                onClick={onExportGif}
                disabled={isRecording}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 py-2 text-sm text-white/60 transition-colors hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRecording ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {recordPhase === "capturing"
                      ? `Nagr. ${recordProgress}%`
                      : `Enc. ${recordProgress}%`}
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                    </svg>
                    GIF
                  </>
                )}
              </button>
            </li>

          </ul>
        </div>
      )}
    </div>
  );
}
