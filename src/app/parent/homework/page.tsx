"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { BookOpen, Clock } from "lucide-react";
import ClassFilter from "@/components/parent/ClassFilter";

export default function ParentHomework() {
  const { data, loading, error } = useFetch<any>("/api/parent/data?type=homework");
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
      <PageHeader title="Homework Status" subtitle="Select a grade to view homework for all students." />
      <ClassFilter classes={classOptions} selectedClass={selectedClass} onChange={setSelectedClass} />

      {visibleGroups.length === 0 ? (
        <Card><EmptyState icon={BookOpen} title="No students linked" /></Card>
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
                  {child.homework.length === 0 ? <EmptyState icon={BookOpen} title="No homework assigned" /> : (
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <h4 className="mb-3 font-bold">Pending ({child.pending.length})</h4>
                        {child.pending.length === 0 ? <p className="text-sm text-muted">All caught up.</p> : (
                          <div className="space-y-2">
                            {child.pending.map((h: any) => (
                              <div key={h.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                                <div>
                                  <p className="font-semibold">{h.title}</p>
                                  <p className="flex items-center gap-1 text-xs text-muted"><Clock className="h-3 w-3" /> Due {formatDate(h.deadline)} - {h.subject || "General"}</p>
                                </div>
                                {h.overdue ? <span className="badge badge-red">Overdue</span> : <span className="badge badge-amber">Pending</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="mb-3 font-bold">Submitted ({child.done.length})</h4>
                        {child.done.length === 0 ? <p className="text-sm text-muted">No submissions yet.</p> : (
                          <div className="space-y-2">
                            {child.done.map((h: any) => (
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
                      </div>
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
