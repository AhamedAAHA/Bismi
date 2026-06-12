"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPost, apiPut, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { randomCode } from "@/lib/utils";
import { Plus, Pencil, Trash2, UserCog, KeyRound } from "lucide-react";

export default function ParentsPage() {
  const { data: parents, loading, error, refetch } = useFetch<any[]>("/api/admin/parents");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  function openCreate() {
    setEditing(null);
    setForm({ parentCode: randomCode("PAR", 3), password: "1234" });
    setOpen(true);
  }
  function openEdit(p: any) {
    setEditing(p);
    setForm({
      name: p.user.name,
      email: p.user.email || "",
      parentCode: p.parentCode,
      phone: p.phone || "",
      occupation: p.occupation || "",
      address: p.address || "",
    });
    setOpen(true);
  }
  async function save() {
    if (!form.name || !form.parentCode) return toast.error("Name and Parent Code are required.");
    setSaving(true);
    const res = editing
      ? await apiPut(`/api/admin/parents/${editing.id}`, form)
      : await apiPost("/api/admin/parents", form);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success(editing ? "Parent updated" : "Parent created");
    setOpen(false);
    refetch();
  }
  async function remove(p: any) {
    if (!confirm(`Delete parent ${p.user.name}?`)) return;
    const res = await apiDelete(`/api/admin/parents/${p.id}`);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Parent deleted");
    refetch();
  }

  return (
    <div>
      <PageHeader
        title="Parent Management"
        subtitle="Manage parents and their login codes."
        action={<button className="btn btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Add Parent</button>}
      />
      <Card>
        {loading ? <Loading /> : error ? <ErrorState message={error} /> : (parents || []).length === 0 ? (
          <EmptyState icon={UserCog} title="No parents yet" message="Add a parent to link with students." />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr><th>Code</th><th>Name</th><th>Email</th><th>Children</th><th>Phone</th><th className="w-[120px] text-right">Actions</th></tr>
              </thead>
              <tbody>
                {parents!.map((p) => (
                  <tr key={p.id}>
                    <td><span className="badge badge-violet" style={{ background: "rgba(139,92,246,.15)", color: "#7c3aed" }}>{p.parentCode}</span></td>
                    <td className="font-semibold">{p.user.name}</td>
                    <td className="text-muted">{p.user.email || "-"}</td>
                    <td>{p.children.map((c: any) => c.user.name).join(", ") || "-"}</td>
                    <td className="text-muted">{p.phone || "-"}</td>
                    <td className="w-[120px] whitespace-nowrap">
                      <div className="flex justify-end gap-1.5">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></button>
                        <button className="btn btn-ghost btn-sm text-rose-500" onClick={() => remove(p)}><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Parent" : "Add Parent"}
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name *"><input className="input" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Parent Code *">
            <div className="flex gap-2">
              <input className="input" value={form.parentCode || ""} disabled={!!editing} onChange={(e) => setForm({ ...form, parentCode: e.target.value })} />
              {!editing && <button className="btn btn-ghost btn-sm" onClick={() => setForm({ ...form, parentCode: randomCode("PAR", 3) })}><KeyRound className="h-4 w-4" /></button>}
            </div>
          </Field>
          <Field label="Email (for notifications)"><input className="input" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Phone"><input className="input" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Occupation"><input className="input" value={form.occupation || ""} onChange={(e) => setForm({ ...form, occupation: e.target.value })} /></Field>
          <Field label={editing ? "Reset Password (optional)" : "Password / PIN"}><input className="input" value={form.password || ""} placeholder={editing ? "Leave blank to keep" : "1234"} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
          <Field label="Address" full><input className="input" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}
