export default function BlenderSlide() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#0d1a0d] via-[#0a2e1a] to-[#0d1a0d] text-white">
      <div className="text-center">
        <span className="font-mono text-sm tracking-[0.2em] uppercase text-white/40">
          Blender
        </span>
        <h1 className="mt-2 mb-3 text-[clamp(3rem,10vw,8rem)] font-bold leading-none tracking-tight">
          3D Modeling
        </h1>
        <p className="text-base text-white/50">
          Kolekcja modeli i scen stworzonych w Blenderze.
        </p>
      </div>
    </div>
  );
}
