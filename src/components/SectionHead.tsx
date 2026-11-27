export default function SectionHead({
  eyebrow,
  title,
  as: Tag = "h2",
  right,
}: {
  eyebrow: string;
  title: string;
  as?: "h1" | "h2";
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1.5">{eyebrow}</p>
        <Tag className="heading text-3xl sm:text-4xl font-bold">{title}</Tag>
      </div>
      {right}
    </div>
  );
}
