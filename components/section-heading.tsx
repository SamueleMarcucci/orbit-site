type SectionHeadingProps = {
  title: string;
  body?: string;
  align?: "left" | "center";
};

export function SectionHeading({ title, body, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <h2 className="text-balance text-4xl font-semibold leading-[1] tracking-[-0.055em] text-[var(--text)] md:text-6xl">
        {title}
      </h2>
      {body ? <p className="mt-5 text-base leading-7 tracking-[-0.01em] text-[var(--muted)] md:text-lg">{body}</p> : null}
    </div>
  );
}
