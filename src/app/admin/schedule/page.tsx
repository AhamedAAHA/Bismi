"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPost, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { Plus, CalendarDays, Trash2 } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function SchedulePage() {
  const { data: schedules, loading, refetch } = useFetch<any[]>("/api/admin/schedule");
  const { data: classes } = useFetch<any[]>("/api/admin/classes");
  const { data: subjects } = useFetch<any[]>("/api/admin/subjects");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({ day: "Monday" });

  async function save() {
    if (!form.day || !form.startTime || !form.endTime) return toast.error("Day and times required.");
    setSaving(true);
    const res = await apiPost("/api/admin/schedule", form);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Schedule added");
    setOpen(false); refetch();
  }
  async function remove(s: any) {
    if (!confirm("Delete this schedule slot?")) return;
    const res = await apiDelete(`/api/admin/schedule/${s.id}`);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Deleted"); refetch();
  }

  return (
    <div>
      <PageHeader title="Class Schedule" subtitle="Manage the weekly timetable."
        action={<button className="btn btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Slot</button>} />
      {loading ? <Loading /> : (schedules || []).length === 0 ? (
        <Card><EmptyState icon={CalendarDays} title="No schedule yet" /></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DAYS.map((day) => {
            const slots = (schedules || []).filter((s) => s.day === day);
            if (!slots.length) return null;
            return (
              <Card key={day}>
                <h3 className="mb-3 font-bold">{day}</h3>
                <div className="space-y-2">
                  {slots.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                      <div>
                        <p className="font-semibold">{s.subject?.name || "Class"}</p>
                        <p className="text-xs text-muted">{s.startTime}–{s.endTime} • {s.teacher || "-"} • {s.class?.name || "All"}</p>
                      </div>
                      <button className="btn btn-ghost btn-sm text-rose-500" onClick={() => remove(s)}><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add Schedule Slot" size="sm"
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>Save</button></>}>
        <div className="space-y-4">
          <Field label="Day *">
            <select className="select" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
              {DAYS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start *"><input type="time" className="input" value={form.startTime || ""} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></Field>
            <Field label="End *"><input type="time" className="input" value={form.endTime || ""} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></Field>
          </div>
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
          <Field label="Teachers (comma separated)"><input className="input" value={form.teacher || ""} onChange={(e) => setForm({ ...form, teacher: e.target.value })} placeholder="Ms. Nisha, Mr. Ravi" /></Field>
          <Field label="Room"><input className="input" value={form.room || ""} onChange={(e) => setForm({ ...form, room: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}
