type SectionLabelProps = {
  code: string;
  title: string;
};

export function SectionLabel({ code, title }: SectionLabelProps) {
  return (
    <div className="section-label">
      <samp>{code}</samp>
      <h2>{title}</h2>
    </div>
  );
}
