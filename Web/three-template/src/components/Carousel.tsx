import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ALL_PROJECTS } from "../data/projects";
import ProjectPanel from "./ProjectPanel";
import ControlsHint from "./ControlsHint";
import SceneControls, { type MaterialType } from "./scenes/SceneControls";
import { usePanelContext } from "../context/PanelContext";
import { useGifExport, type GifQuality, type GifResolution, type GifFps, type GifDuration } from "../utils/useGifExport";

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(ALL_PROJECTS.map((p) => p.id)),
  );
  const [autoPlay, setAutoPlay] = useState(true);
  const autoDir = useRef(1);

  // Scene state — shared across all slides
  const [bgColor, setBgColor] = useState("#0a0010");
  const [material, setMaterial] = useState<MaterialType>("original");
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotateSpeed, setRotateSpeed] = useState(0.5);
  const [gifTransparent, setGifTransparent] = useState(false);
  const [gifQuality, setGifQuality] = useState<GifQuality>("medium");
  const [gifResolution, setGifResolution] = useState<GifResolution>(480);
  const [gifFps, setGifFps] = useState<GifFps>(25);
  const [gifDuration, setGifDuration] = useState<GifDuration>(5);

  const { openPanel, setOpenPanel } = usePanelContext();
  const panelOpen = openPanel === "project";
  const trackRef = useRef<HTMLDivElement>(null);

  // Per-slide container refs for GIF/screenshot capture
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    activeContainerRef.current = slideRefs.current[current] ?? null;
  }, [current]);

  const activeProjects = ALL_PROJECTS.filter((p) => selectedIds.has(p.id));

  const { exportGif, isRecording, phase: recordPhase, progress: recordProgress } =
    useGifExport(
      activeContainerRef as React.RefObject<HTMLDivElement>,
      `${activeProjects[current]?.id ?? "scene"}.gif`,
      bgColor, gifTransparent, gifQuality, gifResolution, gifFps, gifDuration
    );

  const handleScreenshot = () => {
    const canvas = activeContainerRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = (canvas as HTMLCanvasElement).toDataURL("image/png");
    link.download = `${activeProjects[current]?.id ?? "scene"}.png`;
    link.click();
  };

  const goTo = (index: number, pause = true) => {
    if (index < 0 || index >= activeProjects.length) return;
    if (pause) setAutoPlay(false);
    setOpenPanel(null);
    gsap.to(trackRef.current, {
      x: -index * window.innerWidth,
      duration: 0.75,
      ease: "power3.inOut",
    });
    setCurrent(index);
  };

  // Auto-advance every 5 s (ping-pong: 1→2→3→2→1→…)
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => {
      setCurrent((prev) => {
        let next = prev + autoDir.current;
        if (next >= activeProjects.length) { autoDir.current = -1; next = prev - 1; }
        else if (next < 0)                 { autoDir.current =  1; next = prev + 1; }
        gsap.to(trackRef.current, {
          x: -next * window.innerWidth,
          duration: 0.75,
          ease: "power3.inOut",
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [autoPlay, activeProjects.length]);

  const toggleProject = (id: string) => {
    if (selectedIds.has(id) && selectedIds.size === 1) return;
    setAutoPlay(false);

    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
      const newActive = ALL_PROJECTS.filter((p) => next.has(p.id));
      const currentId = activeProjects[current]?.id;
      if (currentId === id) {
        gsap.to(trackRef.current, { x: 0, duration: 0.75, ease: "power3.inOut" });
        setCurrent(0);
      } else {
        const newIndex = newActive.findIndex((p) => p.id === currentId);
        gsap.to(trackRef.current, { x: -newIndex * window.innerWidth, duration: 0.75, ease: "power3.inOut" });
        setCurrent(newIndex);
      }
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Track */}
      <div
        ref={trackRef}
        className="flex h-screen will-change-transform"
        style={{ width: `${activeProjects.length * 100}vw` }}
      >
        {activeProjects.map((project, i) => {
          const Slide = project.component;
          return (
            <div
              key={project.id}
              ref={(el) => { slideRefs.current[i] = el; }}
              className="h-screen w-screen shrink-0"
            >
              <Slide
                bgColor={bgColor}
                materialType={material}
                autoRotate={autoRotate}
                rotateSpeed={rotateSpeed}
              />
            </div>
          );
        })}
      </div>

      {/* Left arrow */}
      <button
        onClick={() => goTo(current - 1)}
        disabled={current === 0}
        aria-label="Poprzedni"
        className="group fixed left-4 top-1/2 -translate-y-1/2 z-50 flex h-24 w-12 cursor-pointer items-center justify-center border-none bg-transparent disabled:opacity-0 disabled:pointer-events-none transition-opacity"
      >
        <svg viewBox="0 0 24 24" className="h-12 w-12 text-white/30 transition-all duration-300 group-hover:text-white group-hover:scale-125" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={() => goTo(current + 1)}
        disabled={current === activeProjects.length - 1}
        aria-label="Następny"
        className="group fixed right-4 top-1/2 -translate-y-1/2 z-50 flex h-24 w-12 cursor-pointer items-center justify-center border-none bg-transparent disabled:opacity-0 disabled:pointer-events-none transition-opacity"
      >
        <svg viewBox="0 0 24 24" className="h-12 w-12 text-white/30 transition-all duration-300 group-hover:text-white group-hover:scale-125" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots + play/pause */}
      <div className="fixed bottom-7 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3">
        <div className="flex items-center gap-2.5">
          {activeProjects.map((project, i) => (
            <button
              key={project.id}
              onClick={() => goTo(i)}
              aria-label={project.title}
              className={`h-2 w-2 rounded-full border-none transition-all duration-200 cursor-pointer ${
                i === current ? "scale-[1.4] bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setAutoPlay((v) => !v)}
          aria-label={autoPlay ? "Zatrzymaj" : "Odtwórz"}
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-white/40 transition-colors hover:text-white"
        >
          {autoPlay ? (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <rect x="5" y="4" width="4" height="16" rx="1" />
              <rect x="15" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
      </div>

      {/* Logo – top left */}
      <a href="https://wkowalczyk.pl" target="_blank" rel="noopener noreferrer" className="fixed left-4 top-4 z-50">
        <img src="/favicon/VectorByWiktor.png" alt="VectorByWiktor" className="h-10 w-auto select-none opacity-90 hover:opacity-100 transition-opacity" draggable={false} />
      </a>

      <ControlsHint />

      {/* Scene controls — always visible, fixed */}
      <SceneControls
        bgColor={bgColor}
        onBgColorChange={setBgColor}
        material={material}
        onMaterialChange={setMaterial}
        autoRotate={autoRotate}
        onAutoRotateChange={setAutoRotate}
        onScreenshot={handleScreenshot}
        onExportGif={exportGif}
        isRecording={isRecording}
        recordPhase={recordPhase}
        recordProgress={recordProgress}
        gifTransparent={gifTransparent}
        onGifTransparentChange={setGifTransparent}
        gifQuality={gifQuality}
        onGifQualityChange={setGifQuality}
        gifResolution={gifResolution}
        onGifResolutionChange={setGifResolution}
        gifFps={gifFps}
        onGifFpsChange={setGifFps}
        gifDuration={gifDuration}
        onGifDurationChange={setGifDuration}
        rotateSpeed={rotateSpeed}
        onRotateSpeedChange={setRotateSpeed}
      />

      {/* Project panel — top right */}
      <div className="fixed right-4 top-4 z-150">
        <button
          onClick={() => setOpenPanel(panelOpen ? null : "project")}
          aria-label="Projekty"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/8 text-white backdrop-blur-md transition-all hover:bg-white/18"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <circle cx="5" cy="5" r="1.5" /><circle cx="12" cy="5" r="1.5" /><circle cx="19" cy="5" r="1.5" />
            <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
            <circle cx="5" cy="19" r="1.5" /><circle cx="12" cy="19" r="1.5" /><circle cx="19" cy="19" r="1.5" />
          </svg>
        </button>
        {panelOpen && (
          <ProjectPanel selectedIds={selectedIds} onToggle={toggleProject} onClose={() => setOpenPanel(null)} />
        )}
      </div>
    </div>
  );
}
