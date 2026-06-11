"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import ChildSelector from "@/components/ChildSelector";
import { formatDate } from "@/lib/utils";
import { BookOpen, Clock } from "lucide-react";

export default function ParentHomework() {
  const [childId, setChildId] = useState("");
  const { data, loading, error } = useFetch<any>(`/api/parent/data?type=homework${childId ? `&childId=${childId}` : ""}`);
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;

  const pending = data.homework.filter((h: any) => !h.submission);
  const done = data.homework.filter((h: any) => h.submission);

  return (
    <div>
      <PageHeader title="Homework Status" subtitle="Pending and submitted homework."
        action={<ChildSelector children={data.children} value={childId || data.childId} onChange={setChildId} />} />

      {data.homework.length === 0 ? (
        <Card><EmptyState icon={BookOpen} title="No homework assigned" /></Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 font-bold">Pending ({pending.length})</h3>
            {pending.length === 0 ? <p className="text-sm text-muted">All caught up! 🎉</p> : (
              <div className="space-y-2">
                {pending.map((h: any) => (
                  <div key={h.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                    <div>
                      <p className="font-semibold">{h.title}</p>
                      <p className="flex items-center gap-1 text-xs text-muted"><Clock className="h-3 w-3" /> Due {formatDate(h.deadline)} • {h.subject || "General"}</p>
                    </div>
                    {h.overdue ? <span className="badge badge-red">Overdue</span> : <span className="badge badge-amber">Pending</span>}
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <h3 className="mb-3 font-bold">Submitted ({done.length})</h3>
            {done.length === 0 ? <p className="text-sm text-muted">No submissions yet.</p> : (
              <div className="space-y-2">
                {done.map((h: any) => (
                  <div key={h.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                    <div>
                      <p className="font-semibold">{h.title}</p>
                      <p className="text-xs text-muted">{h.subject || "General"}</p>
                    </div>
                    <StatusBadge status={h.submission.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
