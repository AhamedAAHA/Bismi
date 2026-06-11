"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPost } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import Field from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import { PlaneTakeoff, Send } from "lucide-react";

export default function ParentLeave() {
  const { data, loading, error, refetch } = useFetch<any>("/api/parent/leave");
  const [form, setForm] = useState<any>({ type: "SICK" });
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!form.studentId || !form.reason || !form.fromDate || !form.toDate) return toast.error("Fill all fields.");
    setSaving(true);
    const res = await apiPost("/api/parent/leave", form);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Leave request submitted");
    setForm({ type: "SICK" }); refetch();
  }

  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;

  return (
    <div>
      <PageHeader title="Leave Request" subtitle="Submit and track leave requests for your child." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <SectionTitle title="New Request" />
          <div className="space-y-4">
            <Field label="Child *">
              <select className="select" value={form.studentId || ""} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
                <option value="">Select child</option>
                {data.children.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Type">
              <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="SICK">Sick Leave</option>
                <option value="VACATION">Vacation Leave</option>
                <option value="EMERGENCY">Emergency Leave</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="From *"><input type="date" className="input" value={form.fromDate || ""} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} /></Field>
              <Field label="To *"><input type="date" className="input" value={form.toDate || ""} onChange={(e) => setForm({ ...form, toDate: e.target.value })} /></Field>
            </div>
            <Field label="Reason *"><textarea className="textarea" rows={3} value={form.reason || ""} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></Field>
            <button className="btn btn-primary w-full" onClick={submit} disabled={saving}><Send className="h-4 w-4" /> Submit Request</button>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle title="Request History" />
          {data.leaves.length === 0 ? <EmptyState icon={PlaneTakeoff} title="No requests yet" /> : (
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Child</th><th>Type</th><th>From</th><th>To</th><th>Status</th><th>Note</th></tr></thead>
                <tbody>
                  {data.leaves.map((l: any) => (
                    <tr key={l.id}>
                      <td className="font-semibold">{l.student.user.name}</td>
                      <td><span className="badge badge-blue">{l.type}</span></td>
                      <td className="text-muted">{formatDate(l.fromDate)}</td>
                      <td className="text-muted">{formatDate(l.toDate)}</td>
                      <td><StatusBadge status={l.status} /></td>
                      <td className="text-xs text-muted">{l.adminNote || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
