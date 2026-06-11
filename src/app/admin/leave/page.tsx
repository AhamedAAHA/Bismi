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

export default function LeavePage() {
  const { data: leaves, loading, refetch } = useFetch<any[]>("/api/admin/leave");

  async function decide(l: any, status: "APPROVED" | "REJECTED") {
    const note = status === "REJECTED" ? prompt("Reason for rejection (optional):") || "" : "";
    const res = await apiPut(`/api/admin/leave/${l.id}`, { status, adminNote: note });
    if (!res.ok) return toast.error(res.error!);
    toast.success(`Leave ${status.toLowerCase()}. Parent notified by email.`);
    refetch();
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
                          <button className="btn btn-primary btn-sm" onClick={() => decide(l, "APPROVED")}><Check className="h-3.5 w-3.5" /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => decide(l, "REJECTED")}><X className="h-3.5 w-3.5" /></button>
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
    </div>
  );
}
