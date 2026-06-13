"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { formatDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import ClassFilter from "@/components/parent/ClassFilter";

export default function ParentComments() {
  const { data, loading, error } = useFetch<any>("/api/parent/data?type=comments");
  const [selectedClass, setSelectedClass] = useState("ALL");
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;
  const classOptions = ["ALL", ...(data.classGroups || []).map((g: any) => g.className)];
  const visibleGroups =
    selectedClass === "ALL"
      ? data.classGroups
      : data.classGroups.filter((g: any) => g.className === selectedClass);

  return (
    <div>
      <PageHeader title="Teacher Comments" subtitle="Select a grade to see all teacher comments." />
      <ClassFilter classes={classOptions} selectedClass={selectedClass} onChange={setSelectedClass} />
      {visibleGroups.length === 0 ? (
        <Card><EmptyState icon={MessageSquare} title="No students linked" /></Card>
      ) : (
        <div className="space-y-4">
          {visibleGroups.map((group: any) => (
            <section key={group.className} className="space-y-3">
              <h2 className="text-sm font-bold uppercase text-muted">{group.className}</h2>
              {group.children.map((child: any) => (
                <Card key={child.id}>
                  <div className="mb-3">
                    <h3 className="font-bold">{child.name}</h3>
                    <p className="text-sm text-muted">{child.code} - {child.className}</p>
                  </div>
                  {child.comments.length === 0 ? <EmptyState icon={MessageSquare} title="No comments yet" /> : (
                    <div className="space-y-3">
                      {child.comments.map((c: any) => (
                        <div key={c.id} className="flex gap-3 rounded-xl border border-[var(--border)] p-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500"><MessageSquare className="h-5 w-5" /></div>
                          <div>
                            <p className="text-sm">{c.comment}</p>
                            <p className="mt-1 text-xs text-muted">{c.teacher} - {formatDate(c.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
