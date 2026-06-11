"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPost } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import { ClipboardCheck, CheckCircle2, Clock, XCircle, QrCode } from "lucide-react";

export default function StudentAttendance() {
  const { data, loading, error, refetch } = useFetch<any>("/api/student/attendance");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function checkIn() {
    if (!code.trim()) return toast.error("Enter the QR code shown by your tuition center.");
    setBusy(true);
    const res = await apiPost("/api/student/qr", { code });
    setBusy(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success(res.data.action === "checkout" ? `Checked out at ${res.data.time}` : `Checked in at ${res.data.time} (${res.data.status})`);
    setCode(""); refetch();
  }

  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;

  const s = data.summary;

  return (
    <div>
      <PageHeader title="My Attendance" subtitle="View your attendance history and check in with the daily QR code." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Attendance %" value={`${s.percentage}%`} icon={ClipboardCheck} tone="green" />
        <StatCard label="Present" value={s.present} icon={CheckCircle2} tone="blue" />
        <StatCard label="Late" value={s.late} icon={Clock} tone="amber" />
        <StatCard label="Absent" value={s.absent} icon={XCircle} tone="rose" />
      </div>

      <Card className="my-4">
        <SectionTitle title="QR Check-in / Check-out" subtitle="Enter today's QR code to mark your attendance" />
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <QrCode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input className="input pl-9" placeholder="Enter QR code" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={checkIn} disabled={busy}>{busy ? "Processing..." : "Mark Attendance"}</button>
        </div>
      </Card>

      <Card>
        <SectionTitle title="History" />
        {data.records.length === 0 ? <EmptyState icon={ClipboardCheck} title="No attendance records yet" /> : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Date</th><th>Status</th><th>Check In</th><th>Check Out</th><th>Method</th></tr></thead>
              <tbody>
                {data.records.map((r: any) => (
                  <tr key={r.id}>
                    <td>{formatDate(r.date)}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className="text-muted">{r.checkIn || "-"}</td>
                    <td className="text-muted">{r.checkOut || "-"}</td>
                    <td><span className="badge badge-gray">{r.method}</span></td>
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
