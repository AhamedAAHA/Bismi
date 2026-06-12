"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPost, apiPut, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import Modal from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { randomCode } from "@/lib/utils";
import { Plus, Pencil, Trash2, Users, KeyRound, Search } from "lucide-react";

export default function StudentsPage() {
  const { data: students, loading, error, refetch } = useFetch<any[]>("/api/admin/students");
  const { data: classes } = useFetch<any[]>("/api/admin/classes");
  const { data: parents } = useFetch<any[]>("/api/admin/parents");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<any>({});

  function openCreate() {
    setEditing(null);
    setForm({ studentCode: randomCode("STU", 3), password: "1234" });
    setOpen(true);
  }
  function openEdit(s: any) {
    setEditing(s);
    setForm({
      name: s.user.name,
      email: s.user.email || "",
      studentCode: s.studentCode,
      rollNo: s.rollNo || "",
      classId: s.classId || "",
      parentId: s.parentId || "",
      phone: s.phone || "",
      dob: s.dob || "",
      address: s.address || "",
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name || !form.studentCode) return toast.error("Name and Student Code are required.");
    setSaving(true);
    const res = editing
      ? await apiPut(`/api/admin/students/${editing.id}`, form)
      : await apiPost("/api/admin/students", form);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success(editing ? "Student updated" : "Student created");
    setOpen(false);
    refetch();
  }

  async function remove(s: any) {
    if (!confirm(`Delete student ${s.user.name}? This cannot be undone.`)) return;
    const res = await apiDelete(`/api/admin/students/${s.id}`);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Student deleted");
    refetch();
  }

  const filtered = (students || []).filter(
    (s) =>
      s.user.name.toLowerCase().includes(q.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Student Management"
        subtitle="Add, edit and manage students & their login codes."
        action={
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Student
          </button>
        }
      />

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input className="input pl-9" placeholder="Search students..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No students found" message="Add your first student to get started." action={<button className="btn btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Add Student</button>} />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Parent</th>
                  <th>Phone</th>
                  <th className="w-[120px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td><span className="badge badge-blue">{s.studentCode}</span></td>
                    <td className="font-semibold">{s.user.name}</td>
                    <td>{s.class?.name || "-"}</td>
                    <td>{s.parent?.user.name || "-"}</td>
                    <td className="text-muted">{s.phone || "-"}</td>
                    <td className="w-[120px] whitespace-nowrap">
                      <div className="flex justify-end gap-1.5">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></button>
                        <button className="btn btn-ghost btn-sm text-rose-500" onClick={() => remove(s)}><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Student" : "Add Student"}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name *"><input className="input" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Student Code *">
            <div className="flex gap-2">
              <input className="input" value={form.studentCode || ""} disabled={!!editing} onChange={(e) => setForm({ ...form, studentCode: e.target.value })} />
              {!editing && <button className="btn btn-ghost btn-sm" onClick={() => setForm({ ...form, studentCode: randomCode("STU", 3) })}><KeyRound className="h-4 w-4" /></button>}
            </div>
          </Field>
          <Field label="Email (for receipts)"><input className="input" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Roll No"><input className="input" value={form.rollNo || ""} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} /></Field>
          <Field label="Class">
            <select className="select" value={form.classId || ""} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
              <option value="">Unassigned</option>
              {(classes || []).map((c) => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
            </select>
          </Field>
          <Field label="Parent">
            <select className="select" value={form.parentId || ""} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
              <option value="">Unassigned</option>
              {(parents || []).map((p) => <option key={p.id} value={p.id}>{p.user.name} ({p.parentCode})</option>)}
            </select>
          </Field>
          <Field label="Phone"><input className="input" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Date of Birth"><input className="input" type="date" value={form.dob || ""} onChange={(e) => setForm({ ...form, dob: e.target.value })} /></Field>
          <Field label={editing ? "Reset Password (optional)" : "Password / PIN"}><input className="input" value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editing ? "Leave blank to keep" : "1234"} /></Field>
          <Field label="Address" full><input className="input" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
