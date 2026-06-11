"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import ChildSelector from "@/components/ChildSelector";
import { formatDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

export default function ParentComments() {
  const [childId, setChildId] = useState("");
  const { data, loading, error } = useFetch<any>(`/api/parent/data?type=comments${childId ? `&childId=${childId}` : ""}`);
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;

  return (
    <div>
      <PageHeader title="Teacher Comments" subtitle="Feedback from your child's teachers."
        action={<ChildSelector children={data.children} value={childId || data.childId} onChange={setChildId} />} />
      {data.comments.length === 0 ? (
        <Card><EmptyState icon={MessageSquare} title="No comments yet" /></Card>
      ) : (
        <div className="space-y-3">
          {data.comments.map((c: any) => (
            <Card key={c.id}>
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500"><MessageSquare className="h-5 w-5" /></div>
                <div>
                  <p className="text-sm">{c.comment}</p>
                  <p className="mt-1 text-xs text-muted">— {c.teacher} • {formatDate(c.date)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
