"use client";

import { useEffect, useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiGet, apiPost } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import { toast } from "@/components/ui/Toast";
import { todayStr } from "@/lib/utils";
import { CheckCircle2, Save, Users } from "lucide-react";

const STATUSES = ["PRESENT", "LATE", "ABSENT", "LEAVE"];

export default function AttendancePage() {
  const { data: classes } = useFetch<any[]>("/api/admin/classes");
  const [date, setDate] = useState(todayStr());
  const [classId, setClassId] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await apiGet(`/api/admin/attendance?date=${date}${classId ? `&classId=${classId}` : ""}`);
    setLoading(false);
    if (res.ok) {
      setRows(
        res.data.rows.map((r: any) => ({
          ...r,
          status: r.record?.status || "PRESENT",
          checkIn: r.record?.checkIn || "",
          checkOut: r.record?.checkOut || "",
        }))
      );
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [date, classId]);

  function setRow(id: string, patch: any) {
    setRows((prev) => prev.map((r) => (r.studentId === id ? { ...r, ...patch } : r)));
  }
  function markAll(status: string) {
    setRows((prev) => prev.map((r) => ({ ...r, status })));
  }

  async function save() {
    setSaving(true);
    const res = await apiPost("/api/admin/attendance", {
      date,
      method: "BULK",
      entries: rows.map((r) => ({ studentId: r.studentId, status: r.status, checkIn: r.checkIn, checkOut: r.checkOut })),
    });
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Attendance saved. Absence emails sent to parents.");
    load();
  }

  return (
    <div>
      <PageHeader title="Attendance Management" subtitle="Mark manual or bulk attendance and track late arrivals." />
      <Card className="mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Class</label>
            <select className="select" value={classId} onChange={(e) => setClassId(e.target.value)}>
              <option value="">All classes</option>
              {(classes || []).map((c) => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={() => markAll("PRESENT")}><CheckCircle2 className="h-4 w-4" /> All Present</button>
            <button className="btn btn-primary" onClick={save} disabled={saving || !rows.length}><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Attendance"}</button>
          </div>
        </div>
      </Card>

      <Card>
        {loading ? <Loading /> : rows.length === 0 ? (
          <EmptyState icon={Users} title="No students" message="Add students or pick another class." />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr><th>Code</th><th>Name</th><th>Class</th><th>Status</th><th>Check In</th><th>Check Out</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.studentId}>
                    <td><span className="badge badge-blue">{r.studentCode}</span></td>
                    <td className="font-semibold">{r.name}</td>
                    <td className="text-muted">{r.className}</td>
                    <td>
                      <select
                        className="select"
                        style={{ width: 120, padding: "6px 10px" }}
                        value={r.status}
                        onChange={(e) => setRow(r.studentId, { status: e.target.value })}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td><input type="time" className="input" style={{ width: 120, padding: "6px 10px" }} value={r.checkIn} onChange={(e) => setRow(r.studentId, { checkIn: e.target.value })} /></td>
                    <td><input type="time" className="input" style={{ width: 120, padding: "6px 10px" }} value={r.checkOut} onChange={(e) => setRow(r.studentId, { checkOut: e.target.value })} /></td>
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
