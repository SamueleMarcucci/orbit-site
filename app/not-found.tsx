import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-shell grid min-h-[80dvh] place-items-center pt-28 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green)]">404</p>
        <h1 className="mt-5 text-balance text-5xl font-semibold leading-[1] tracking-[-0.06em] text-[var(--text)] md:text-7xl">
          This orbit is empty.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-[var(--muted)]">
          The page moved or never existed. Return to the Live Orbit launch site.
        </p>
        <Link
          className="focus-ring mt-8 inline-flex rounded-full bg-[var(--green)] px-5 py-3 text-sm font-semibold text-[#07100c]"
          href="/"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
