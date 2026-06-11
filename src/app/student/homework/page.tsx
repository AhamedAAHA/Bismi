"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPost } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import FileUpload from "@/components/ui/FileUpload";
import Field from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import { BookOpen, Upload, Download, Clock } from "lucide-react";

export default function StudentHomework() {
  const { data, loading, error, refetch } = useFetch<any[]>("/api/student/homework");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  function openSubmit(h: any) {
    setActive(h); setFileUrl(""); setNote(""); setOpen(true);
  }
  async function submit() {
    if (!fileUrl) return toast.error("Please upload your homework file.");
    setSaving(true);
    const res = await apiPost(`/api/student/homework/${active.id}/submit`, { fileUrl, note });
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Homework submitted!");
    setOpen(false); refetch();
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Homework" subtitle="View assignments and submit your work." />
      {(data || []).length === 0 ? (
        <Card><EmptyState icon={BookOpen} title="No homework assigned" /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data!.map((h) => (
            <Card key={h.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{h.title}</h3>
                  <p className="text-sm text-muted">{h.subject || "General"}</p>
                </div>
                {h.submission ? <StatusBadge status={h.submission.status} /> : h.overdue ? <span className="badge badge-red">Overdue</span> : <span className="badge badge-amber">Pending</span>}
              </div>
              <p className="mt-2 text-sm text-muted">{h.description || "No description."}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted"><Clock className="h-3 w-3" /> Due {formatDate(h.deadline)}</p>
              <div className="mt-3 flex gap-2">
                {h.fileUrl && <a href={h.fileUrl} target="_blank" className="btn btn-ghost btn-sm"><Download className="h-3.5 w-3.5" /> Material</a>}
                {h.submission ? (
                  <a href={h.submission.fileUrl} target="_blank" className="btn btn-ghost btn-sm flex-1">View Submission</a>
                ) : (
                  <button className="btn btn-primary btn-sm flex-1" onClick={() => openSubmit(h)}><Upload className="h-3.5 w-3.5" /> Submit</button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={`Submit: ${active?.title || ""}`} size="sm"
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={submit} disabled={saving}>Submit</button></>}>
        <div className="space-y-4">
          <Field label="Upload PDF or Image *"><FileUpload onUploaded={(url) => setFileUrl(url)} /></Field>
          <Field label="Note (optional)"><textarea className="textarea" rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
        </div>
      </Modal>
    </div>
  );
}
