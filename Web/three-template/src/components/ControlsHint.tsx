import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePanelContext } from "../context/PanelContext";

const CONTROLS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 9V5a7 7 0 0 1 14 0v4" />
        <rect x="3" y="9" width="18" height="13" rx="2" />
        <line x1="12" y1="14" x2="12" y2="17" />
      </svg>
    ),
    label: "LPM + przeciągnij",
    desc: "Obrót",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 9V5a7 7 0 0 1 14 0v4" />
        <rect x="3" y="9" width="18" height="13" rx="2" />
        <line x1="12" y1="14" x2="12" y2="17" />
        <path d="M8 9v4" strokeDasharray="2 2" />
      </svg>
    ),
    label: "Shift + LPM",
    desc: "Przesunięcie",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 9V5a7 7 0 0 1 14 0v4" />
        <rect x="3" y="9" width="18" height="13" rx="2" />
        <path d="M12 9v6M9 12l3-3 3 3" />
      </svg>
    ),
    label: "Scroll / Pinch",
    desc: "Zoom",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 9V5a7 7 0 0 1 14 0v4" />
        <rect x="3" y="9" width="18" height="13" rx="2" />
        <circle cx="17" cy="9" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    label: "PPM + przeciągnij",
    desc: "Przesunięcie",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h4M18 12h4M12 2v4M12 18v4" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    label: "Dwuklik",
    desc: "Reset widoku",
  },
];

export default function ControlsHint() {
  const { openPanel, setOpenPanel } = usePanelContext();
  const open = openPanel === "controls";
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, scale: 0.94, y: 6 },
      { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power2.out" },
    );
  }, [open]);

  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex flex-col-reverse items-start gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Toggle button */}
      <button
        onClick={() => setOpenPanel(open ? null : "controls")}
        aria-label="Skróty klawiszowe"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/8 text-white backdrop-blur-md transition-all hover:bg-white/18"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="13" rx="2" />
          <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M18 14h.01M10 14h4" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{ transformOrigin: "bottom left" }}
          className="w-64 rounded-2xl border border-white/15 bg-white/8 shadow-2xl backdrop-blur-3xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <span className="text-sm font-semibold text-white/90">Sterowanie</span>
            <button
              onClick={() => setOpenPanel(null)}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mx-5 border-t border-white/10" />

          <ul className="px-3 py-2 pb-3 flex flex-col gap-0.5">
            {CONTROLS.map((c) => (
              <li key={c.label} className="flex items-center gap-3 rounded-xl px-2 py-2">
                <span className="text-white/40">{c.icon}</span>
                <div className="flex flex-1 items-center justify-between gap-2">
                  <span className="text-xs text-white/60">{c.label}</span>
                  <span className="text-xs font-medium text-white/90">{c.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
