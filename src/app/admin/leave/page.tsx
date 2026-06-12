"use client";

import { useFetch } from "@/lib/useFetch";
import { apiPut } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import { PlaneTakeoff, Check, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useState } from "react";

export default function LeavePage() {
  const { data: leaves, loading, refetch } = useFetch<any[]>("/api/admin/leave");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [action, setAction] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  function openDecide(l: any, status: "APPROVED" | "REJECTED") {
    setSelected(l);
    setAction(status);
    setNote("");
    setModalOpen(true);
  }

  async function confirmDecide() {
    if (!selected || !action) return;
    try {
      setSaving(true);
      const res = await apiPut(`/api/admin/leave/${selected.id}`, { status: action, adminNote: action === "REJECTED" ? note : "" });
      if (!res.ok) return toast.error(res.error!);
      toast.success(`Leave ${action.toLowerCase()}. Parent notified by email.`);
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error("Failed to update leave");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Leave Requests" subtitle="Approve or reject parent leave requests." />
      <Card>
        {loading ? <Loading /> : (leaves || []).length === 0 ? (
          <EmptyState icon={PlaneTakeoff} title="No leave requests" />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Student</th><th>Type</th><th>Reason</th><th>From</th><th>To</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {leaves!.map((l) => (
                  <tr key={l.id}>
                    <td className="font-semibold">{l.student.user.name}</td>
                    <td><span className="badge badge-blue">{l.type}</span></td>
                    <td className="max-w-xs text-muted">{l.reason}</td>
                    <td className="text-muted">{formatDate(l.fromDate)}</td>
                    <td className="text-muted">{formatDate(l.toDate)}</td>
                    <td><StatusBadge status={l.status} /></td>
                    <td>
                      {l.status === "PENDING" ? (
                        <div className="flex justify-end gap-1.5">
                          <button className="btn btn-primary btn-sm" onClick={() => openDecide(l, "APPROVED")} aria-label={`Approve leave for ${l.student.user.name}`}><Check className="h-3.5 w-3.5" /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => openDecide(l, "REJECTED")} aria-label={`Reject leave for ${l.student.user.name}`}><X className="h-3.5 w-3.5" /></button>
                        </div>
                      ) : <span className="text-xs text-muted">{l.adminNote || "—"}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={action === "REJECTED" ? "Reject Leave Request" : "Approve Leave Request"} footer={
        <>
          <button className="btn btn-ghost" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</button>
          <button className={`btn ${action === "REJECTED" ? "btn-danger" : "btn-primary"}`} onClick={confirmDecide} disabled={saving}>{saving ? "Saving..." : (action === "REJECTED" ? "Reject" : "Approve")}</button>
        </>
      }>
        {selected && (
          <div>
            <p className="text-sm text-muted">Student: <strong>{selected.student.user.name}</strong></p>
            <p className="mt-2 text-sm">Type: <span className="badge badge-blue">{selected.type}</span></p>
            <p className="mt-4 text-sm text-muted">Reason</p>
            <div className="mt-2">
              <p className="text-sm max-w-xl text-muted">{selected.reason || "—"}</p>
            </div>
            {action === "REJECTED" && (
              <div className="mt-4">
                <label className="label">Rejection note (optional)</label>
                <textarea className="textarea" rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Explain the reason for rejection (parents will be notified)" />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
