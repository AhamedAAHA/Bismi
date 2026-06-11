"use client";

import { useParams } from "next/navigation";
import { useFetch } from "@/lib/useFetch";
import { Loading, ErrorState } from "@/components/ui/States";
import Logo from "@/components/Logo";
import { currency, formatDate } from "@/lib/utils";
import { Printer, CheckCircle2 } from "lucide-react";

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useFetch<any>(`/api/receipt/${id}`);

  if (loading) return <div className="min-h-screen p-6"><Loading /></div>;
  if (error || !data) return <div className="min-h-screen p-6"><ErrorState message={error || "Not found"} /></div>;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-4 flex justify-between print:hidden">
          <a href="javascript:history.back()" className="btn btn-ghost btn-sm">← Back</a>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print / Save PDF</button>
        </div>

        <div className="glass-strong card overflow-hidden p-0">
          <div className="bg-gradient-to-r from-brand-500 to-accent-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <Logo size="md" />
              <div className="text-right">
                <p className="text-xs uppercase opacity-80">Receipt</p>
                <p className="text-lg font-bold">{data.receiptNo}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" /> <span className="font-semibold">Payment Received</span>
            </div>
            <Row label="Student" value={`${data.studentName} (${data.studentCode})`} />
            <Row label="Fee" value={data.feeTitle} />
            <Row label="Date" value={formatDate(data.date)} />
            <Row label="Method" value={data.method || "-"} />
            <div className="my-4 border-t border-dashed border-[var(--border)]" />
            <Row label="Amount Paid" value={currency(data.amount)} big />
            <Row label="Total Fee" value={currency(data.feeTotal)} />
            <Row label="Paid So Far" value={currency(data.feePaid)} />
          </div>
          <div className="border-t border-[var(--border)] bg-[var(--bg)] p-4 text-center">
            <p className="text-xs font-semibold text-muted">Developed by AAHA</p>
            <p className="text-[11px] text-muted">Contact: hubaibahamedaaha@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted">{label}</span>
      <span className={big ? "text-xl font-extrabold text-brand-500" : "font-semibold"}>{value}</span>
    </div>
  );
}
