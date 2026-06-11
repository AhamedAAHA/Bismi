"use client";

import { useState } from "react";
import Link from "next/link";
import { useFetch } from "@/lib/useFetch";
import { apiPost, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { randomCode, formatDateTime } from "@/lib/utils";
import { Plus, FileText, Trash2, Settings2, KeyRound } from "lucide-react";

export default function TestsPage() {
  const { data: tests, loading, refetch } = useFetch<any[]>("/api/admin/tests");
  const { data: classes } = useFetch<any[]>("/api/admin/classes");
  const { data: subjects } = useFetch<any[]>("/api/admin/subjects");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({ durationMin: 20, notify: false });

  function openCreate() {
    const now = new Date();
    const later = new Date(Date.now() + 7 * 86400000);
    setForm({
      durationMin: 20,
      accessCode: randomCode("TEST", 4),
      startTime: toLocal(now),
      endTime: toLocal(later),
      notify: false,
    });
    setOpen(true);
  }
  function toLocal(d: Date) {
    const off = d.getTimezoneOffset();
    return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
  }

  async function save() {
    if (!form.title || !form.accessCode) return toast.error("Title and access code required.");
    setSaving(true);
    const res = await apiPost("/api/admin/tests", form);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Test created. Add questions next.");
    setOpen(false);
    refetch();
  }
  async function remove(t: any) {
    if (!confirm(`Delete test "${t.title}"?`)) return;
    const res = await apiDelete(`/api/admin/tests/${t.id}`);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Deleted"); refetch();
  }

  function stateBadge(t: any) {
    const now = new Date();
    if (now < new Date(t.startTime)) return <span className="badge badge-amber">Upcoming</span>;
    if (now > new Date(t.endTime)) return <span className="badge badge-gray">Expired</span>;
    return <span className="badge badge-green">Active</span>;
  }

  return (
    <div>
      <PageHeader title="Test Management" subtitle="Create MCQ tests, set access codes and timing."
        action={<button className="btn btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Create Test</button>} />
      <Card>
        {loading ? <Loading /> : (tests || []).length === 0 ? (
          <EmptyState icon={FileText} title="No tests yet" message="Create your first online test." action={<button className="btn btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Create Test</button>} />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Title</th><th>Access Code</th><th>Class</th><th>Questions</th><th>Attempts</th><th>Window</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {tests!.map((t) => (
                  <tr key={t.id}>
                    <td className="font-semibold">{t.title}</td>
                    <td><span className="badge badge-blue">{t.accessCode}</span></td>
                    <td className="text-muted">{t.class?.name || "All"}</td>
                    <td>{t._count.questions}</td>
                    <td>{t._count.attempts}</td>
                    <td className="text-muted text-xs">{formatDateTime(t.startTime)}<br />→ {formatDateTime(t.endTime)}</td>
                    <td>{stateBadge(t)}</td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <Link href={`/admin/tests/${t.id}`} className="btn btn-ghost btn-sm"><Settings2 className="h-3.5 w-3.5" /> Manage</Link>
                        <button className="btn btn-ghost btn-sm text-rose-500" onClick={() => remove(t)}><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Test"
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Creating..." : "Create"}</button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Test Title *" full><input className="input" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Algebra Basics" /></Field>
          <Field label="Description" full><textarea className="textarea" rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Access Code *">
            <div className="flex gap-2">
              <input className="input" value={form.accessCode || ""} onChange={(e) => setForm({ ...form, accessCode: e.target.value.toUpperCase() })} />
              <button className="btn btn-ghost btn-sm" onClick={() => setForm({ ...form, accessCode: randomCode("TEST", 4) })}><KeyRound className="h-4 w-4" /></button>
            </div>
          </Field>
          <Field label="Duration (minutes)"><input type="number" className="input" value={form.durationMin || ""} onChange={(e) => setForm({ ...form, durationMin: e.target.value })} /></Field>
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
          <Field label="Start Time *"><input type="datetime-local" className="input" value={form.startTime || ""} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></Field>
          <Field label="End Time *"><input type="datetime-local" className="input" value={form.endTime || ""} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></Field>
          <Field label="Notify parents by email" full>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.notify} onChange={(e) => setForm({ ...form, notify: e.target.checked })} /> Send upcoming test email to parents</label>
          </Field>
        </div>
      </Modal>
    </div>
  );
}
