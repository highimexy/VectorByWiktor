import { useRef, useState } from "react";
import gsap from "gsap";
import { ALL_PROJECTS } from "../data/projects";
import ProjectPanel from "./ProjectPanel";

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(ALL_PROJECTS.map((p) => p.id))
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const activeProjects = ALL_PROJECTS.filter((p) => selectedIds.has(p.id));

  const goTo = (index: number) => {
    if (index < 0 || index >= activeProjects.length) return;
    gsap.to(trackRef.current, {
      x: -index * window.innerWidth,
      duration: 0.75,
      ease: "power3.inOut",
    });
    setCurrent(index);
  };

  const toggleProject = (id: string) => {
    if (selectedIds.has(id) && selectedIds.size === 1) return; // minimum 1

    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
      // If removed project was currently visible, go to first
      const newActive = ALL_PROJECTS.filter((p) => next.has(p.id));
      const currentId = activeProjects[current]?.id;
      if (currentId === id) {
        gsap.to(trackRef.current, { x: 0, duration: 0.75, ease: "power3.inOut" });
        setCurrent(0);
      } else {
        const newIndex = newActive.findIndex((p) => p.id === currentId);
        gsap.to(trackRef.current, {
          x: -newIndex * window.innerWidth,
          duration: 0.75,
          ease: "power3.inOut",
        });
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
        {activeProjects.map((project) => {
          const Slide = project.component;
          return (
            <div key={project.id} className="h-screen w-screen shrink-0">
              <Slide />
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
        <svg
          viewBox="0 0 24 24"
          className="h-12 w-12 text-white/30 transition-all duration-300 group-hover:text-white group-hover:scale-125"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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
        <svg
          viewBox="0 0 24 24"
          className="h-12 w-12 text-white/30 transition-all duration-300 group-hover:text-white group-hover:scale-125"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="fixed bottom-7 left-1/2 z-50 flex -translate-x-1/2 gap-2.5">
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

      {/* Logo – top left */}
      <div className="fixed left-4 top-4 z-50">
        <img
          src="/favicon/VectorByWiktor.png"
          alt="VectorByWiktor"
          className="h-10 w-auto select-none opacity-90 hover:opacity-100 transition-opacity"
          draggable={false}
        />
      </div>

      {/* Panel trigger + panel */}
      <div className="fixed right-4 top-4 z-150">
        <button
          onClick={() => setPanelOpen((v) => !v)}
          aria-label="Projekty"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/8 text-white backdrop-blur-md transition-all hover:bg-white/18"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <circle cx="5"  cy="5"  r="1.5" />
            <circle cx="12" cy="5"  r="1.5" />
            <circle cx="19" cy="5"  r="1.5" />
            <circle cx="5"  cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
            <circle cx="5"  cy="19" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
            <circle cx="19" cy="19" r="1.5" />
          </svg>
        </button>

        {panelOpen && (
          <ProjectPanel
            selectedIds={selectedIds}
            onToggle={toggleProject}
            onClose={() => setPanelOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
