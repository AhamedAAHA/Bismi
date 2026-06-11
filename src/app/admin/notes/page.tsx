"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPost, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import FileUpload from "@/components/ui/FileUpload";
import { toast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import { Plus, StickyNote, Trash2, Download } from "lucide-react";

export default function NotesPage() {
  const { data: notes, loading, refetch } = useFetch<any[]>("/api/admin/notes");
  const { data: classes } = useFetch<any[]>("/api/admin/classes");
  const { data: subjects } = useFetch<any[]>("/api/admin/subjects");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  async function save() {
    if (!form.title || !form.fileUrl) return toast.error("Title and file are required.");
    setSaving(true);
    const res = await apiPost("/api/admin/notes", form);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Note uploaded");
    setOpen(false); setForm({}); refetch();
  }
  async function remove(n: any) {
    if (!confirm(`Delete note "${n.title}"?`)) return;
    const res = await apiDelete(`/api/admin/notes/${n.id}`);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Deleted"); refetch();
  }

  return (
    <div>
      <PageHeader title="Notes Management" subtitle="Upload study notes for students."
        action={<button className="btn btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Upload Note</button>} />
      {loading ? <Loading /> : (notes || []).length === 0 ? (
        <Card><EmptyState icon={StickyNote} title="No notes yet" /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes!.map((n) => (
            <Card key={n.id}>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500"><StickyNote className="h-5 w-5" /></div>
              <h3 className="font-semibold">{n.title}</h3>
              <p className="text-sm text-muted">{n.description || "No description"}</p>
              <p className="mt-1 text-xs text-muted">{n.subject?.name || "General"} • {n.class?.name || "All"} • {formatDate(n.createdAt)}</p>
              <div className="mt-3 flex gap-2">
                <a href={n.fileUrl} target="_blank" className="btn btn-ghost btn-sm flex-1"><Download className="h-3.5 w-3.5" /> Download</a>
                <button className="btn btn-ghost btn-sm text-rose-500" onClick={() => remove(n)}><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Upload Note"
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>Save</button></>}>
        <div className="space-y-4">
          <Field label="Title *"><input className="input" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Description"><textarea className="textarea" rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Class">
              <select className="select" value={form.classId || ""} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
                <option value="">All</option>
                {(classes || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Subject">
              <select className="select" value={form.subjectId || ""} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
                <option value="">None</option>
                {(subjects || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="File *"><FileUpload onUploaded={(url) => setForm({ ...form, fileUrl: url })} /></Field>
        </div>
      </Modal>
    </div>
  );
}
