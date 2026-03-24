import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ALL_PROJECTS } from "../data/projects";

type Props = {
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onClose: () => void;
};

export default function ProjectPanel({
  selectedIds,
  onToggle,
  onClose,
}: Props) {
  const [search, setSearch] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  // Open animation
  useEffect(() => {
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, scale: 0.94, y: -6 },
      { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power2.out" },
    );
  }, []);

  const handleClose = () => {
    gsap.to(panelRef.current, {
      opacity: 0,
      scale: 0.94,
      y: -6,
      duration: 0.18,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    const t = setTimeout(
      () => document.addEventListener("mousedown", handler),
      100,
    );
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const filtered = ALL_PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tag.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      ref={panelRef}
      style={{ transformOrigin: "top right" }}
      className="absolute right-0 top-12 z-200 w-72 rounded-2xl border border-white/15 bg-white/8 shadow-2xl backdrop-blur-3xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <span className="text-sm font-semibold text-white/90">Projekty</span>
        <button
          onClick={handleClose}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-3 py-2.5 focus-within:border-white/30 transition-colors">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Szukaj..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-white/35 outline-none"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-white/10" />

      {/* List */}
      <ul className="max-h-64 overflow-y-auto px-3 py-2 pb-3">
        {filtered.map((project) => {
          const active = selectedIds.has(project.id);
          return (
            <li
              key={project.id}
              className="flex items-center justify-between gap-4 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/8"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{project.title}</p>
                <p className="text-xs text-white/40">{project.tag}</p>
              </div>

              <button
                onClick={() => onToggle(project.id)}
                className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full border-none transition-colors duration-200 ${
                  active ? "bg-green-400" : "bg-white/20"
                }`}
              >
                <span
                  className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                    active ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </li>
          );
        })}

        {filtered.length === 0 && (
          <li className="py-8 text-center text-sm text-white/40">Brak wyników</li>
        )}
      </ul>
    </div>
  );
}
