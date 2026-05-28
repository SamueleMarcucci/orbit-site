import { OrbitalCanvas } from "@/components/orbital-canvas";

type PageHeroProps = {
  code: string;
  title: string;
  body: string;
};

export function PageHero({ code, title, body }: PageHeroProps) {
  return (
    <section className="page-hero">
      <OrbitalCanvas mode="ambient" className="orbital-canvas page-hero-canvas" />
      <div className="page-hero-copy">
        <samp>{code}</samp>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    </section>
  );
}
