"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
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
    <motion.div
      className="glass card p-3 sm:p-4"
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted sm:text-sm">{label}</p>
          <p className="mt-1 break-words text-xl font-black tracking-tight sm:text-2xl">{value}</p>
          {hint && <p className="mt-0.5 text-[11px] text-muted">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-[#03111f] shadow-glow sm:h-12 sm:w-12",
            tones[tone]
          )}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </motion.div>
  );
}
