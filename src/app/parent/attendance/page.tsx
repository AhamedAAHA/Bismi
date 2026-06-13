"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { ClipboardCheck, CheckCircle2, Clock, XCircle } from "lucide-react";
import ClassFilter from "@/components/parent/ClassFilter";

export default function ParentAttendance() {
  const { data, loading, error } = useFetch<any>("/api/parent/data?type=attendance");
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
      <PageHeader title="Student Attendance" subtitle="Select a grade to view attendance for all students." />
      <ClassFilter classes={classOptions} selectedClass={selectedClass} onChange={setSelectedClass} />

      <div className="space-y-4">
        {visibleGroups.map((group: any) => (
          <section key={group.className} className="space-y-3">
            <h2 className="text-sm font-bold uppercase text-muted">{group.className}</h2>
            {group.children.map((child: any) => {
              const s = child.summary;
              return (
                <Card key={child.id}>
                  <SectionTitle title={child.name} subtitle={`${child.code} - ${child.className}`} />
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard label="Attendance %" value={`${s.percentage}%`} icon={ClipboardCheck} tone="green" />
                    <StatCard label="Present" value={s.present} icon={CheckCircle2} tone="blue" />
                    <StatCard label="Late" value={s.late} icon={Clock} tone="amber" />
                    <StatCard label="Absent" value={s.absent} icon={XCircle} tone="rose" />
                  </div>

                  <div className="mt-4">
                    {child.records.length === 0 ? <EmptyState icon={ClipboardCheck} title="No records yet" /> : (
                      <div className="table-wrap">
                        <table className="data">
                          <thead><tr><th>Date</th><th>Status</th><th>Check In</th><th>Check Out</th></tr></thead>
                          <tbody>
                            {child.records.map((r: any) => (
                              <tr key={r.id}>
                                <td>{formatDate(r.date)}</td>
                                <td><StatusBadge status={r.status} /></td>
                                <td className="text-muted">{r.checkIn || "-"}</td>
                                <td className="text-muted">{r.checkOut || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
