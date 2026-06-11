import { Loader2, Inbox, AlertTriangle, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export function Loading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  message,
  action,
}: {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        {message && <p className="mt-1 text-sm text-muted">{message}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <p className="max-w-sm text-sm text-muted">{message}</p>
    </div>
  );
}

export function Spinner() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}
