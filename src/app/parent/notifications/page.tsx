"use client";

import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { formatDateTime } from "@/lib/utils";
import { Mail } from "lucide-react";

const catColor: Record<string, string> = {
  ABSENCE: "badge-red", LOW_MARKS: "badge-amber", HOMEWORK: "badge-blue",
  FEE: "badge-red", TEST: "badge-blue", LEAVE: "badge-green", GENERAL: "badge-gray",
};

export default function ParentNotifications() {
  const { data, loading, error } = useFetch<any[]>("/api/parent/notifications");
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Notification History" subtitle="All email notifications about your child." />
      {(data || []).length === 0 ? (
        <Card><EmptyState icon={Mail} title="No notifications yet" /></Card>
      ) : (
        <div className="space-y-2">
          {data!.map((e) => (
            <Card key={e.id}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500"><Mail className="h-5 w-5" /></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{e.subject}</p>
                    <span className={`badge ${catColor[e.category] || "badge-gray"}`}>{e.category}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted" dangerouslySetInnerHTML={{ __html: e.body }} />
                  <p className="mt-1 text-[11px] text-muted">{formatDateTime(e.createdAt)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
