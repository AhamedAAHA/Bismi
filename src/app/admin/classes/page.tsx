"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPost, apiPut, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, School, BookMarked } from "lucide-react";

export default function ClassesPage() {
  const { data: classes, loading, refetch } = useFetch<any[]>("/api/admin/classes");
  const { data: subjects, loading: l2, refetch: refetchSub } = useFetch<any[]>("/api/admin/subjects");

  const [clsOpen, setClsOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [editCls, setEditCls] = useState<any>(null);
  const [editSub, setEditSub] = useState<any>(null);
  const [clsForm, setClsForm] = useState<any>({});
  const [subForm, setSubForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  async function saveClass() {
    if (!clsForm.name) return toast.error("Class name is required.");
    setSaving(true);
    const res = editCls ? await apiPut(`/api/admin/classes/${editCls.id}`, clsForm) : await apiPost("/api/admin/classes", clsForm);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Saved"); setClsOpen(false); refetch();
  }
  async function delClass(c: any) {
    if (!confirm(`Delete class ${c.name}?`)) return;
    const res = await apiDelete(`/api/admin/classes/${c.id}`);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Deleted"); refetch();
  }
  async function saveSub() {
    if (!subForm.name) return toast.error("Subject name is required.");
    setSaving(true);
    const res = editSub ? await apiPut(`/api/admin/subjects/${editSub.id}`, subForm) : await apiPost("/api/admin/subjects", subForm);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Saved"); setSubOpen(false); refetchSub();
  }
  async function delSub(s: any) {
    if (!confirm(`Delete subject ${s.name}?`)) return;
    const res = await apiDelete(`/api/admin/subjects/${s.id}`);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Deleted"); refetchSub();
  }

  return (
    <div>
      <PageHeader title="Classes & Subjects" subtitle="Organize your classes and subjects." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Classes" action={<button className="btn btn-primary btn-sm" onClick={() => { setEditCls(null); setClsForm({}); setClsOpen(true); }}><Plus className="h-4 w-4" /> Add</button>} />
          {loading ? <Loading /> : (classes || []).length === 0 ? <EmptyState icon={School} title="No classes" /> : (
            <div className="space-y-2">
              {classes!.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                  <div>
                    <p className="font-semibold">{c.name} {c.section && <span className="text-muted">• {c.section}</span>}</p>
                    <p className="text-xs text-muted">{c._count.students} students • {c.subjects.length} subjects • Room {c.room || "-"}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditCls(c); setClsForm({ name: c.name, section: c.section || "", room: c.room || "" }); setClsOpen(true); }}><Pencil className="h-3.5 w-3.5" /></button>
                    <button className="btn btn-ghost btn-sm text-rose-500" onClick={() => delClass(c)}><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle title="Subjects" action={<button className="btn btn-primary btn-sm" onClick={() => { setEditSub(null); setSubForm({}); setSubOpen(true); }}><Plus className="h-4 w-4" /> Add</button>} />
          {l2 ? <Loading /> : (subjects || []).length === 0 ? <EmptyState icon={BookMarked} title="No subjects" /> : (
            <div className="space-y-2">
              {subjects!.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                  <div>
                    <p className="font-semibold">{s.name} {s.code && <span className="badge badge-blue ml-1">{s.code}</span>}</p>
                    <p className="text-xs text-muted">{s.teacher || "No teacher"} • {s.class?.name || "All classes"}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditSub(s); setSubForm({ name: s.name, code: s.code || "", teacher: s.teacher || "", classId: s.classId || "" }); setSubOpen(true); }}><Pencil className="h-3.5 w-3.5" /></button>
                    <button className="btn btn-ghost btn-sm text-rose-500" onClick={() => delSub(s)}><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal open={clsOpen} onClose={() => setClsOpen(false)} title={editCls ? "Edit Class" : "Add Class"} size="sm"
        footer={<><button className="btn btn-ghost" onClick={() => setClsOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={saveClass} disabled={saving}>Save</button></>}>
        <div className="space-y-4">
          <Field label="Class Name *"><input className="input" value={clsForm.name || ""} onChange={(e) => setClsForm({ ...clsForm, name: e.target.value })} placeholder="Grade 10" /></Field>
          <Field label="Section"><input className="input" value={clsForm.section || ""} onChange={(e) => setClsForm({ ...clsForm, section: e.target.value })} placeholder="A" /></Field>
          <Field label="Room"><input className="input" value={clsForm.room || ""} onChange={(e) => setClsForm({ ...clsForm, room: e.target.value })} placeholder="R-101" /></Field>
        </div>
      </Modal>

      <Modal open={subOpen} onClose={() => setSubOpen(false)} title={editSub ? "Edit Subject" : "Add Subject"} size="sm"
        footer={<><button className="btn btn-ghost" onClick={() => setSubOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={saveSub} disabled={saving}>Save</button></>}>
        <div className="space-y-4">
          <Field label="Subject Name *"><input className="input" value={subForm.name || ""} onChange={(e) => setSubForm({ ...subForm, name: e.target.value })} /></Field>
          <Field label="Code"><input className="input" value={subForm.code || ""} onChange={(e) => setSubForm({ ...subForm, code: e.target.value })} /></Field>
          <Field label="Teacher"><input className="input" value={subForm.teacher || ""} onChange={(e) => setSubForm({ ...subForm, teacher: e.target.value })} /></Field>
          <Field label="Class">
            <select className="select" value={subForm.classId || ""} onChange={(e) => setSubForm({ ...subForm, classId: e.target.value })}>
              <option value="">All classes</option>
              {(classes || []).map((c) => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
            </select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}
