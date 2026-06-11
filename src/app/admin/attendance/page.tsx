"use client";

import { useEffect, useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiGet, apiPost } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import { toast } from "@/components/ui/Toast";
import { todayStr } from "@/lib/utils";
import { CheckCircle2, Save, Square, Users } from "lucide-react";
import ModuleAccent from "@/components/3d/ModuleAccent";

export default function AttendancePage() {
  const { data: classes } = useFetch<any[]>("/api/admin/classes");
  const [date, setDate] = useState(todayStr());
  const [classId, setClassId] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!classId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await apiGet(`/api/admin/attendance?date=${date}&classId=${classId}`);
    setLoading(false);
    if (res.ok) {
      setRows(
        res.data.rows.map((r: any) => ({
          ...r,
          came: (r.record?.status || "ABSENT") === "PRESENT",
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
  function markAll(came: boolean) {
    setRows((prev) => prev.map((r) => ({ ...r, came })));
  }

  async function save() {
    if (!classId) return toast.error("Choose a class first.");
    setSaving(true);
    const res = await apiPost("/api/admin/attendance", {
      date,
      method: "BULK",
      entries: rows.map((r) => ({
        studentId: r.studentId,
        status: r.came ? "PRESENT" : "ABSENT",
        checkIn: r.came ? r.checkIn : "",
        checkOut: r.came ? r.checkOut : "",
      })),
    });
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Attendance saved. Absence emails sent to parents.");
    load();
  }

  return (
    <div>
      <PageHeader title="Attendance Management" subtitle="Choose a class, then tick every student who came today." />
      <ModuleAccent variant="attendance" height={180} />
      <Card className="mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Class</label>
            <select className="select" value={classId} onChange={(e) => setClassId(e.target.value)}>
              <option value="">Choose class</option>
              {(classes || []).map((c) => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={() => markAll(true)} disabled={!rows.length}><CheckCircle2 className="h-4 w-4" /> Tick All</button>
            <button className="btn btn-ghost" onClick={() => markAll(false)} disabled={!rows.length}><Square className="h-4 w-4" /> Clear All</button>
            <button className="btn btn-primary" onClick={save} disabled={saving || !rows.length}><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Attendance"}</button>
          </div>
        </div>
      </Card>

      <Card>
        {loading ? <Loading /> : !classId ? (
          <EmptyState icon={Users} title="Choose a class" message="Select a class to mark today's attendance." />
        ) : rows.length === 0 ? (
          <EmptyState icon={Users} title="No students" message="Add students or pick another class." />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr><th>Came Today</th><th>Code</th><th>Name</th><th>Class</th><th>Check In</th><th>Check Out</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.studentId}>
                    <td>
                      <label className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]">
                        <input
                          type="checkbox"
                          className="h-5 w-5 accent-[#3563ff]"
                          checked={r.came}
                          onChange={(e) => setRow(r.studentId, { came: e.target.checked })}
                        />
                      </label>
                    </td>
                    <td><span className="badge badge-blue">{r.studentCode}</span></td>
                    <td className="font-semibold">{r.name}</td>
                    <td className="text-muted">{r.className}</td>
                    <td><input type="time" className="input" style={{ width: 120, padding: "6px 10px" }} value={r.checkIn} disabled={!r.came} onChange={(e) => setRow(r.studentId, { checkIn: e.target.value })} /></td>
                    <td><input type="time" className="input" style={{ width: 120, padding: "6px 10px" }} value={r.checkOut} disabled={!r.came} onChange={(e) => setRow(r.studentId, { checkOut: e.target.value })} /></td>
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
