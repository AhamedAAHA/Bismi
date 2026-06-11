"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPost } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { formatDate, pct } from "@/lib/utils";
import { Plus, ListChecks } from "lucide-react";

export default function ResultsPage() {
  const { data: results, loading, refetch } = useFetch<any[]>("/api/admin/results");
  const { data: students } = useFetch<any[]>("/api/admin/students");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({ total: 100 });

  async function save() {
    if (!form.studentId || !form.title) return toast.error("Student and title required.");
    setSaving(true);
    const res = await apiPost("/api/admin/results", form);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Marks added. Low-mark alert emailed if below 40%.");
    setOpen(false); setForm({ total: 100 }); refetch();
  }

  return (
    <div>
      <PageHeader title="Results Management" subtitle="Add manual marks and view auto-graded test results."
        action={<button className="btn btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Marks</button>} />
      <Card>
        {loading ? <Loading /> : (results || []).length === 0 ? (
          <EmptyState icon={ListChecks} title="No results yet" />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Student</th><th>Title</th><th>Subject</th><th>Score</th><th>%</th><th>Type</th><th>Date</th></tr></thead>
              <tbody>
                {results!.map((r) => (
                  <tr key={r.id}>
                    <td className="font-semibold">{r.student.user.name}</td>
                    <td>{r.title}</td>
                    <td className="text-muted">{r.subject || "-"}</td>
                    <td>{r.score}/{r.total}</td>
                    <td><span className={`badge ${pct(r.score, r.total) >= 40 ? "badge-green" : "badge-red"}`}>{pct(r.score, r.total)}%</span></td>
                    <td><span className="badge badge-blue">{r.type}</span></td>
                    <td className="text-muted">{formatDate(r.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Marks" size="sm"
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>Save</button></>}>
        <div className="space-y-4">
          <Field label="Student *">
            <select className="select" value={form.studentId || ""} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
              <option value="">Select student</option>
              {(students || []).map((s) => <option key={s.id} value={s.id}>{s.user.name} ({s.studentCode})</option>)}
            </select>
          </Field>
          <Field label="Test/Exam Title *"><input className="input" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Subject"><input className="input" value={form.subject || ""} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Score *"><input type="number" className="input" value={form.score || ""} onChange={(e) => setForm({ ...form, score: e.target.value })} /></Field>
            <Field label="Total *"><input type="number" className="input" value={form.total || ""} onChange={(e) => setForm({ ...form, total: e.target.value })} /></Field>
          </div>
          <Field label="Date"><input type="date" className="input" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}
