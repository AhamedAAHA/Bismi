"use client";

interface Props {
  classes: string[];
  selectedClass: string;
  onChange: (value: string) => void;
}

export default function ClassFilter({ classes, selectedClass, onChange }: Props) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <label className="text-sm text-muted">Grade</label>
      <select
        className="select w-full max-w-xs"
        value={selectedClass}
        onChange={(e) => onChange(e.target.value)}
      >
        {classes.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
