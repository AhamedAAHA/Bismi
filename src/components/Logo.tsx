export default function Logo({
  size = "md",
  showText = true,
}: {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}) {
  const mark = size === "sm" ? "text-xl" : size === "lg" ? "text-4xl" : "text-2xl";
  const text = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";
  return (
    <div className="flex items-center gap-2.5 leading-none">
      <div className="relative grid place-items-center">
        <span className={`font-black tracking-tight text-white ${mark}`}>ai</span>
        <span className="absolute -right-1 top-0 h-2 w-2 rounded-full bg-accent-400 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
      </div>
      {showText && (
        <div className="leading-tight">
          <p className={`font-extrabold tracking-wide text-white ${text}`}>
            BISMI
          </p>
          {size !== "sm" && (
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
              Education OS
            </p>
          )}
        </div>
      )}
    </div>
  );
}
