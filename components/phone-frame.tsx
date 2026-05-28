import { Circle, NavigationArrow, Planet, WarningCircle } from "@phosphor-icons/react/dist/ssr";

const rows = [
  ["Object", "ISS"],
  ["Catalog", "NORAD 25544"],
  ["Mode", "Sky From Here"],
  ["Signal", "Live estimate"]
];

export function PhoneFrame() {
  return (
    <div className="surface-shell mx-auto w-full max-w-[23rem] rounded-[2.4rem]">
      <div className="surface-core rounded-[calc(2.4rem-0.45rem)] p-2">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[oklch(0.07_0.016_248)] p-4 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.08)]">
          <div className="mx-auto mb-4 h-1.5 w-20 rounded-full bg-white/12" />
          <div className="relative min-h-[34rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_20%,oklch(0.38_0.11_242_/_0.34),transparent_17rem),oklch(0.1_0.018_248)] p-4">
            <div className="absolute inset-x-0 top-0 h-48 opacity-35 [background-image:radial-gradient(circle_at_24%_18%,white_0_1px,transparent_1.5px),radial-gradient(circle_at_72%_44%,white_0_1px,transparent_1.5px)] [background-size:8rem_8rem,12rem_12rem]" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--faint)]">Live Orbit</p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">Orbit</h3>
                </div>
                <div className="grid size-10 place-items-center rounded-full bg-white/10">
                  <Planet size={18} weight="fill" />
                </div>
              </div>

              <div className="mt-7 grid place-items-center">
                <div className="relative grid size-44 place-items-center rounded-full border border-white/10 bg-[radial-gradient(circle,oklch(0.42_0.12_242_/_0.42),transparent_62%)]">
                  <div className="absolute size-64 rounded-full border border-dashed border-[oklch(0.78_0.15_162_/_0.22)]" />
                  <div className="size-28 rounded-full bg-[url('/assets/earth-globe.jpg')] bg-cover bg-center shadow-[0_0_70px_oklch(0.68_0.17_242_/_0.2)]" />
                  <div className="absolute right-9 top-12 grid size-7 place-items-center rounded-full bg-[var(--green)] text-[#07100c] shadow-[0_0_24px_oklch(0.78_0.15_162_/_0.35)]">
                    <Circle size={9} weight="fill" />
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-[oklch(0.16_0.022_248_/_0.86)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--faint)]">Selected</p>
                    <h4 className="mt-1 text-xl font-semibold tracking-[-0.04em]">International Space Station</h4>
                  </div>
                  <NavigationArrow className="mt-1 text-[var(--green)]" size={18} weight="fill" />
                </div>
                <div className="mt-4 grid gap-2">
                  {rows.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.035] px-3 py-2">
                      <span className="text-xs text-[var(--faint)]">{label}</span>
                      <span className="text-xs font-semibold text-[var(--text)]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-[1.2rem] border border-[oklch(0.72_0.12_54_/_0.24)] bg-[oklch(0.72_0.12_54_/_0.08)] px-3 py-3 text-xs leading-5 text-[var(--muted)]">
                <WarningCircle className="shrink-0 text-[var(--warning)]" size={17} weight="fill" />
                Positions are estimates from public orbital elements.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
