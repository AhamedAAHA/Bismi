"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPost } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import Field from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { formatDateTime } from "@/lib/utils";
import { Mail, Send } from "lucide-react";

export default function EmailsPage() {
  const { data: emails, loading, refetch } = useFetch<any[]>("/api/admin/emails");
  const { data: parents } = useFetch<any[]>("/api/admin/parents");
  const [target, setTarget] = useState("ALL");
  const [parentId, setParentId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    if (!subject || !body) return toast.error("Subject and message required.");
    setSending(true);
    const res = await apiPost("/api/admin/emails", {
      target,
      parentId: target === "ONE" ? parentId : undefined,
      subject,
      body,
    });
    setSending(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success(`Email sent to ${res.data.count} recipient(s).`);
    setSubject(""); setBody(""); refetch();
  }

  return (
    <div>
      <PageHeader title="Email Notifications" subtitle="Send emails to parents and view notification history." />
      <div className="mb-4 rounded-xl bg-brand-500/10 px-4 py-2.5 text-sm text-brand-600">
        Tip: If SMTP is not configured, emails are safely logged here and to the server console (dev mode).
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <SectionTitle title="Compose Email" />
          <div className="space-y-4">
            <Field label="Send To">
              <select className="select" value={target} onChange={(e) => setTarget(e.target.value)}>
                <option value="ALL">All Parents</option>
                <option value="ONE">Specific Parent</option>
              </select>
            </Field>
            {target === "ONE" && (
              <Field label="Parent">
                <select className="select" value={parentId} onChange={(e) => setParentId(e.target.value)}>
                  <option value="">Select parent</option>
                  {(parents || []).filter((p) => p.user.email).map((p) => <option key={p.id} value={p.id}>{p.user.name}</option>)}
                </select>
              </Field>
            )}
            <Field label="Subject"><input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
            <Field label="Message"><textarea className="textarea" rows={5} value={body} onChange={(e) => setBody(e.target.value)} /></Field>
            <button className="btn btn-primary w-full" onClick={send} disabled={sending}><Send className="h-4 w-4" /> {sending ? "Sending..." : "Send Email"}</button>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle title="Notification History" subtitle="All sent & logged emails" />
          {loading ? <Loading /> : (emails || []).length === 0 ? (
            <EmptyState icon={Mail} title="No emails yet" />
          ) : (
            <div className="table-wrap max-h-[60vh] overflow-y-auto">
              <table className="data">
                <thead><tr><th>To</th><th>Subject</th><th>Category</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {emails!.map((e) => (
                    <tr key={e.id}>
                      <td>{e.toEmail}</td>
                      <td>{e.subject}</td>
                      <td><span className="badge badge-blue">{e.category}</span></td>
                      <td><StatusBadge status={e.status} /></td>
                      <td className="text-muted">{formatDateTime(e.createdAt)}</td>
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
