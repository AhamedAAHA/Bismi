import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  PRESENT: "badge-green",
  ABSENT: "badge-red",
  LATE: "badge-amber",
  LEAVE: "badge-blue",
  PAID: "badge-green",
  DUE: "badge-red",
  PARTIAL: "badge-amber",
  PENDING: "badge-amber",
  APPROVED: "badge-green",
  REJECTED: "badge-red",
  SUBMITTED: "badge-blue",
  GRADED: "badge-green",
  SENT: "badge-green",
  FAILED: "badge-red",
  LOGGED: "badge-gray",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("badge", map[status] || "badge-gray")}>{status}</span>
  );
}

export function Badge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "green" | "red" | "amber" | "blue" | "gray";
}) {
  return <span className={cn("badge", `badge-${tone}`)}>{children}</span>;
}
