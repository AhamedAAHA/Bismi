"use client";

import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import { BarChart3, Download } from "lucide-react";

export default function ReportsPage() {
  const { data: rows, loading } = useFetch<any[]>("/api/admin/reports");

  return (
    <div>
      <PageHeader title="Reports" subtitle="Attendance reports & exports."
        action={<a href="/api/admin/reports?format=csv" className="btn btn-primary"><Download className="h-4 w-4" /> Export CSV</a>} />
      <Card>
        <SectionTitle title="Attendance Report" subtitle="Per-student attendance summary" />
        {loading ? <Loading /> : (rows || []).length === 0 ? (
          <EmptyState icon={BarChart3} title="No data" />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Code</th><th>Name</th><th>Class</th><th>Total</th><th>Present</th><th>Late</th><th>Absent</th><th>%</th></tr></thead>
              <tbody>
                {rows!.map((r) => (
                  <tr key={r.studentCode}>
                    <td><span className="badge badge-blue">{r.studentCode}</span></td>
                    <td className="font-semibold">{r.name}</td>
                    <td className="text-muted">{r.className}</td>
                    <td>{r.total}</td>
                    <td className="text-emerald-500">{r.present}</td>
                    <td className="text-amber-500">{r.late}</td>
                    <td className="text-rose-500">{r.absent}</td>
                    <td><span className={`badge ${r.percentage >= 75 ? "badge-green" : r.percentage >= 50 ? "badge-amber" : "badge-red"}`}>{r.percentage}%</span></td>
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
