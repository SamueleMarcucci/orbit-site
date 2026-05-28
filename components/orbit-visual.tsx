import Image from "next/image";

export function OrbitVisual() {
  return (
    <div className="hero-radial relative mx-auto aspect-square w-full max-w-[40rem] overflow-hidden rounded-full">
      <Image
        src="/assets/earth-globe.jpg"
        alt="Earth seen as a luminous globe"
        fill
        className="ambient-image object-cover object-center"
        priority
        sizes="(max-width: 768px) 92vw, 40rem"
      />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_45%,transparent_36%,oklch(0.07_0.016_248_/_0.1)_52%,oklch(0.07_0.016_248_/_0.78)_74%)]" />
      <div className="absolute inset-[11%] rounded-full border border-[oklch(0.78_0.15_162_/_0.22)]" />
      <div className="absolute inset-[23%] rounded-full border border-dashed border-white/15" />
      <div className="absolute right-[17%] top-[29%] size-3 rounded-full bg-[var(--green)] shadow-[0_0_30px_oklch(0.78_0.15_162_/_0.55)]" />
      <div className="absolute bottom-[20%] left-[20%] rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-[var(--text)] backdrop-blur-xl">
        Live estimates
      </div>
    </div>
  );
}
