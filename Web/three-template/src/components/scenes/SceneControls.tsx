import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export type MaterialType = "chrome" | "glass" | "wireframe";

interface SceneControlsProps {
  bgColor: string;
  onBgColorChange: (color: string) => void;
  material: MaterialType;
  onMaterialChange: (m: MaterialType) => void;
  autoRotate: boolean;
  onAutoRotateChange: (v: boolean) => void;
  onScreenshot: () => void;
}

const MATERIALS: { value: MaterialType; label: string }[] = [
  { value: "chrome", label: "Chrome" },
  { value: "glass", label: "Glass" },
  { value: "wireframe", label: "Wire" },
];

export default function SceneControls({
  bgColor,
  onBgColorChange,
  material,
  onMaterialChange,
  autoRotate,
  onAutoRotateChange,
  onScreenshot,
}: SceneControlsProps) {
  const [open, setOpen] = useState(false);
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
        onClick={() => setOpen((v) => !v)}
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
              onClick={() => setOpen(false)}
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
            <li className="flex items-center justify-between gap-4 rounded-xl px-2 py-2.5">
              <p className="text-sm font-medium text-white">Tło</p>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => onBgColorChange(e.target.value)}
                className="h-7 w-12 cursor-pointer rounded-lg border border-white/15 bg-transparent p-0.5"
              />
            </li>

            {/* Material */}
            <li className="flex items-center justify-between gap-4 rounded-xl px-2 py-2.5">
              <p className="text-sm font-medium text-white">Materiał</p>
              <div className="flex overflow-hidden rounded-xl border border-white/15">
                {MATERIALS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => onMaterialChange(m.value)}
                    className={`cursor-pointer px-3 py-1.5 text-xs transition-colors ${
                      material === m.value
                        ? "bg-white/20 text-white"
                        : "bg-transparent text-white/40 hover:text-white/70"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
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

            <div className="mx-2 my-1 border-t border-white/10" />

            {/* Screenshot */}
            <li className="rounded-xl px-2 pt-2">
              <button
                onClick={onScreenshot}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 py-2 text-sm text-white/60 transition-colors hover:bg-white/15 hover:text-white"
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
                Screenshot
              </button>
            </li>

          </ul>
        </div>
      )}
    </div>
  );
}
