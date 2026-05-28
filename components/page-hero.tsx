type PageHeroProps = {
  code: string;
  title: string;
  body: string;
};

export function PageHero({ code, title, body }: PageHeroProps) {
  return (
    <section className="page-hero">
      <samp>{code}</samp>
      <h1>{title}</h1>
      <p>{body}</p>
    </section>
  );
}
