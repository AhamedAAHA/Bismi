"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import ChildSelector from "@/components/ChildSelector";
import { formatDate } from "@/lib/utils";
import { ClipboardCheck, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function ParentAttendance() {
  const [childId, setChildId] = useState("");
  const { data, loading, error } = useFetch<any>(`/api/parent/data?type=attendance${childId ? `&childId=${childId}` : ""}`);
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;
  const s = data.summary;

  return (
    <div>
      <PageHeader title="Child Attendance" subtitle="Daily attendance, check-in and check-out times."
        action={<ChildSelector children={data.children} value={childId || data.childId} onChange={setChildId} />} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Attendance %" value={`${s.percentage}%`} icon={ClipboardCheck} tone="green" />
        <StatCard label="Present" value={s.present} icon={CheckCircle2} tone="blue" />
        <StatCard label="Late" value={s.late} icon={Clock} tone="amber" />
        <StatCard label="Absent" value={s.absent} icon={XCircle} tone="rose" />
      </div>

      <Card className="mt-4">
        <SectionTitle title="History" />
        {data.records.length === 0 ? <EmptyState icon={ClipboardCheck} title="No records yet" /> : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Date</th><th>Status</th><th>Check In</th><th>Check Out</th></tr></thead>
              <tbody>
                {data.records.map((r: any) => (
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
      </Card>
    </div>
  );
}
