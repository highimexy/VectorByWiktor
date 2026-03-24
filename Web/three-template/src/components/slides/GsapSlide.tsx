export default function GsapSlide() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#1a0d0d] via-[#2e1a0a] to-[#1a0d0d] text-white">
      <div className="text-center">
        <span className="font-mono text-sm tracking-[0.2em] uppercase text-white/40">
          GSAP
        </span>
        <h1 className="mt-2 mb-3 text-[clamp(3rem,10vw,8rem)] font-bold leading-none tracking-tight">
          Animations
        </h1>
        <p className="text-base text-white/50">
          Animacje i interaktywne efekty zbudowane z GSAP.
        </p>
      </div>
    </div>
  );
}
