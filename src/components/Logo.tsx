import { GraduationCap } from "lucide-react";

export default function Logo({
  size = "md",
  showText = true,
}: {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}) {
  const dim = size === "sm" ? 32 : size === "lg" ? 56 : 40;
  const text =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow"
        style={{ width: dim, height: dim }}
      >
        <GraduationCap style={{ width: dim * 0.55, height: dim * 0.55 }} />
      </div>
      {showText && (
        <div className="leading-tight">
          <p className={`font-extrabold ${text}`}>
            3D <span className="text-brand-500">Education</span> Hub
          </p>
          {size !== "sm" && (
            <p className="text-[10px] uppercase tracking-wider text-muted">
              Smart Tuition System
            </p>
          )}
        </div>
      )}
    </div>
  );
}
