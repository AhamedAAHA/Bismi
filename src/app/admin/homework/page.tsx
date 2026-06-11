"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPost, apiGet, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import FileUpload from "@/components/ui/FileUpload";
import { toast } from "@/components/ui/Toast";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Plus, BookOpen, Trash2, Eye, FileText } from "lucide-react";

export default function HomeworkPage() {
  const { data: homework, loading, refetch } = useFetch<any[]>("/api/admin/homework");
  const { data: classes } = useFetch<any[]>("/api/admin/classes");
  const { data: subjects } = useFetch<any[]>("/api/admin/subjects");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({ notify: false });
  const [subsOpen, setSubsOpen] = useState(false);
  const [subs, setSubs] = useState<any>(null);

  async function save() {
    if (!form.title || !form.deadline) return toast.error("Title and deadline required.");
    setSaving(true);
    const res = await apiPost("/api/admin/homework", form);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Homework added");
    setOpen(false); setForm({ notify: false }); refetch();
  }
  async function remove(h: any) {
    if (!confirm(`Delete homework "${h.title}"?`)) return;
    const res = await apiDelete(`/api/admin/homework/${h.id}`);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Deleted"); refetch();
  }
  async function viewSubs(h: any) {
    const res = await apiGet(`/api/admin/homework/${h.id}`);
    if (res.ok) { setSubs(res.data); setSubsOpen(true); }
  }

  return (
    <div>
      <PageHeader title="Homework Management" subtitle="Assign homework, set deadlines and review submissions."
        action={<button className="btn btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Homework</button>} />
      <Card>
        {loading ? <Loading /> : (homework || []).length === 0 ? (
          <EmptyState icon={BookOpen} title="No homework yet" />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Title</th><th>Class</th><th>Subject</th><th>Deadline</th><th>Submissions</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {homework!.map((h) => (
                  <tr key={h.id}>
                    <td className="font-semibold">{h.title}</td>
                    <td className="text-muted">{h.class?.name || "All"}</td>
                    <td className="text-muted">{h.subject?.name || "-"}</td>
                    <td className="text-muted">{formatDate(h.deadline)}</td>
                    <td><span className="badge badge-blue">{h._count.submissions}</span></td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <button className="btn btn-ghost btn-sm" onClick={() => viewSubs(h)}><Eye className="h-3.5 w-3.5" /> View</button>
                        <button className="btn btn-ghost btn-sm text-rose-500" onClick={() => remove(h)}><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Homework"
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>Save</button></>}>
        <div className="space-y-4">
          <Field label="Title *"><input className="input" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Description"><textarea className="textarea" rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Class">
              <select className="select" value={form.classId || ""} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
                <option value="">All classes</option>
                {(classes || []).map((c) => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
              </select>
            </Field>
            <Field label="Subject">
              <select className="select" value={form.subjectId || ""} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
                <option value="">None</option>
                {(subjects || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Deadline *"><input type="datetime-local" className="input" value={form.deadline || ""} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></Field>
          <Field label="Attachment (optional)"><FileUpload onUploaded={(url) => setForm({ ...form, fileUrl: url })} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.notify} onChange={(e) => setForm({ ...form, notify: e.target.checked })} /> Email parents about new homework</label>
        </div>
      </Modal>

      <Modal open={subsOpen} onClose={() => setSubsOpen(false)} title={subs ? `Submissions — ${subs.title}` : "Submissions"} size="lg">
        {!subs ? <Loading /> : subs.submissions.length === 0 ? <EmptyState icon={FileText} title="No submissions yet" /> : (
          <div className="space-y-2">
            {subs.submissions.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                <div>
                  <p className="font-semibold">{s.student.user.name}</p>
                  <p className="text-xs text-muted">{formatDateTime(s.submittedAt)} • <span className="badge badge-blue">{s.status}</span></p>
                </div>
                <a href={s.fileUrl} target="_blank" className="btn btn-ghost btn-sm">View File</a>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
