import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  blue: "from-brand-500 to-brand-600",
  cyan: "from-accent-400 to-accent-600",
  green: "from-emerald-400 to-emerald-600",
  amber: "from-amber-400 to-orange-500",
  rose: "from-rose-400 to-rose-600",
  violet: "from-violet-400 to-violet-600",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: keyof typeof tones;
  hint?: string;
}) {
  return (
    <div className="glass card fade-up p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-1 text-2xl font-extrabold">{value}</p>
          {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-glow",
            tones[tone]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
