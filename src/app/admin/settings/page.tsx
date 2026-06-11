"use client";

import { useEffect, useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPut, apiPost, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import Field from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import { Save, Plus, Trash2, Megaphone, MessageSquare } from "lucide-react";

export default function SettingsPage() {
  const { data: settings, loading } = useFetch<any>("/api/admin/settings");
  const { data: anns, refetch: refetchAnns } = useFetch<any[]>("/api/admin/announcements");
  const { data: students } = useFetch<any[]>("/api/admin/students");
  const { data: comments, refetch: refetchComments } = useFetch<any[]>("/api/admin/comments");

  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [ann, setAnn] = useState<any>({ audience: "ALL" });
  const [cm, setCm] = useState<any>({});

  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  async function saveSettings() {
    setSaving(true);
    const res = await apiPut("/api/admin/settings", form);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Settings saved");
  }
  async function addAnn() {
    if (!ann.title || !ann.body) return toast.error("Title and message required.");
    const res = await apiPost("/api/admin/announcements", ann);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Announcement posted");
    setAnn({ audience: "ALL" }); refetchAnns();
  }
  async function delAnn(id: string) {
    if (!confirm("Delete announcement?")) return;
    await apiDelete(`/api/admin/announcements/${id}`);
    refetchAnns();
  }
  async function addComment() {
    if (!cm.studentId || !cm.comment) return toast.error("Student and comment required.");
    const res = await apiPost("/api/admin/comments", cm);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Comment added (visible to parent)");
    setCm({}); refetchComments();
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader title="Settings" subtitle="Center configuration, announcements & teacher comments." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Center Settings" />
          <div className="space-y-4">
            <Field label="Center Name"><input className="input" value={form.centerName || ""} onChange={(e) => setForm({ ...form, centerName: e.target.value })} /></Field>
            <Field label="Academic Year"><input className="input" value={form.academicYear || ""} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} /></Field>
            <Field label="Late Threshold (time after which = Late)"><input type="time" className="input" value={form.lateThreshold || ""} onChange={(e) => setForm({ ...form, lateThreshold: e.target.value })} /></Field>
            <button className="btn btn-primary" onClick={saveSettings} disabled={saving}><Save className="h-4 w-4" /> Save Settings</button>
          </div>
        </Card>

        <Card>
          <SectionTitle title="Announcements" />
          <div className="space-y-3">
            <input className="input" placeholder="Title" value={ann.title || ""} onChange={(e) => setAnn({ ...ann, title: e.target.value })} />
            <textarea className="textarea" rows={2} placeholder="Message" value={ann.body || ""} onChange={(e) => setAnn({ ...ann, body: e.target.value })} />
            <div className="flex gap-2">
              <select className="select" value={ann.audience} onChange={(e) => setAnn({ ...ann, audience: e.target.value })}>
                <option value="ALL">Everyone</option>
                <option value="STUDENT">Students</option>
                <option value="PARENT">Parents</option>
              </select>
              <button className="btn btn-primary" onClick={addAnn}><Plus className="h-4 w-4" /> Post</button>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {(anns || []).map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-2 rounded-xl border border-[var(--border)] p-3">
                <div className="flex gap-2">
                  <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  <div>
                    <p className="text-sm font-semibold">{a.title} <span className="badge badge-blue ml-1">{a.audience}</span></p>
                    <p className="text-xs text-muted">{a.body}</p>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm text-rose-500" onClick={() => delAnn(a.id)}><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle title="Teacher Comments" subtitle="Visible to parents in their portal" />
          <div className="grid gap-3 sm:grid-cols-4">
            <select className="select sm:col-span-1" value={cm.studentId || ""} onChange={(e) => setCm({ ...cm, studentId: e.target.value })}>
              <option value="">Select student</option>
              {(students || []).map((s) => <option key={s.id} value={s.id}>{s.user.name}</option>)}
            </select>
            <input className="input sm:col-span-1" placeholder="Teacher name" value={cm.teacher || ""} onChange={(e) => setCm({ ...cm, teacher: e.target.value })} />
            <input className="input sm:col-span-1" placeholder="Comment" value={cm.comment || ""} onChange={(e) => setCm({ ...cm, comment: e.target.value })} />
            <button className="btn btn-primary sm:col-span-1" onClick={addComment}><Plus className="h-4 w-4" /> Add Comment</button>
          </div>
          <div className="mt-4 space-y-2">
            {(comments || []).length === 0 ? <EmptyState icon={MessageSquare} title="No comments yet" /> : comments!.map((c) => (
              <div key={c.id} className="rounded-xl border border-[var(--border)] p-3">
                <p className="text-sm"><b>{c.student.user.name}</b> — {c.comment}</p>
                <p className="text-xs text-muted">by {c.teacher} • {formatDate(c.date)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
