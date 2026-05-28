import { LaunchButton } from "@/components/launch-button";

type PageHeroProps = {
  title: string;
  body: string;
  cta?: boolean;
};

export function PageHero({ title, body, cta = false }: PageHeroProps) {
  return (
    <section className="page-shell pb-16 pt-36 md:pb-20 md:pt-44">
      <div className="max-w-4xl">
        <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-[var(--text)] md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 tracking-[-0.02em] text-[var(--muted)] md:text-xl">{body}</p>
        {cta ? (
          <div className="mt-8">
            <LaunchButton />
          </div>
        ) : null}
      </div>
    </section>
  );
}
