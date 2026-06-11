"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import ChildSelector from "@/components/ChildSelector";
import { currency, formatDate } from "@/lib/utils";
import { CreditCard, Wallet, Receipt } from "lucide-react";

export default function ParentFees() {
  const [childId, setChildId] = useState("");
  const { data, loading, error } = useFetch<any>(`/api/parent/data?type=fees${childId ? `&childId=${childId}` : ""}`);
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;

  return (
    <div>
      <PageHeader title="Fee Status" subtitle="Payment history, balance and receipts."
        action={<ChildSelector children={data.children} value={childId || data.childId} onChange={setChildId} />} />

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Outstanding Balance" value={currency(data.balance)} icon={CreditCard} tone="rose" />
        <StatCard label="Total Paid" value={currency(data.paid)} icon={Wallet} tone="green" />
      </div>

      <Card className="mt-4">
        <SectionTitle title="Fee Records" />
        {data.fees.length === 0 ? <EmptyState icon={CreditCard} title="No fee records" /> : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Title</th><th>Amount</th><th>Paid</th><th>Status</th><th>Due Date</th><th className="text-right">Receipt</th></tr></thead>
              <tbody>
                {data.fees.map((f: any) => (
                  <tr key={f.id}>
                    <td className="font-semibold">{f.title}</td>
                    <td>{currency(f.amount)}</td>
                    <td>{currency(f.amountPaid)}</td>
                    <td><StatusBadge status={f.status} /></td>
                    <td className="text-muted">{formatDate(f.dueDate)}</td>
                    <td className="text-right">
                      {f.receipts.length > 0 ? (
                        <a href={`/receipt/${f.receipts[f.receipts.length - 1].id}`} target="_blank" className="btn btn-ghost btn-sm"><Receipt className="h-3.5 w-3.5" /> View</a>
                      ) : <span className="text-xs text-muted">—</span>}
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
