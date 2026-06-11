"use client";

export default function ChildSelector({
  children,
  value,
  onChange,
}: {
  children: { id: string; name: string; className?: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  if (!children || children.length <= 1) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted">Child:</span>
      <select className="select" style={{ width: "auto" }} value={value} onChange={(e) => onChange(e.target.value)}>
        {children.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
