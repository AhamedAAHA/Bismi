"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPost } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { currency, formatDate } from "@/lib/utils";
import { Plus, CreditCard, Receipt, BadgeDollarSign } from "lucide-react";

export default function FeesPage() {
  const { data: fees, loading, refetch } = useFetch<any[]>("/api/admin/fees");
  const { data: students } = useFetch<any[]>("/api/admin/students");
  const [open, setOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({ notify: false });
  const [payFee, setPayFee] = useState<any>(null);
  const [payAmount, setPayAmount] = useState<string>("");
  const [payMethod, setPayMethod] = useState("Cash");

  async function addFee() {
    if (!form.studentId || !form.title || !form.amount) return toast.error("All fields required.");
    setSaving(true);
    const res = await apiPost("/api/admin/fees", form);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Fee record added");
    setOpen(false); setForm({ notify: false }); refetch();
  }
  function openPay(f: any) {
    setPayFee(f); setPayAmount(String(f.amount - f.amountPaid)); setPayMethod("Cash"); setPayOpen(true);
  }
  async function pay() {
    setSaving(true);
    const res = await apiPost(`/api/admin/fees/${payFee.id}/pay`, { amount: Number(payAmount), method: payMethod });
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success(`Payment recorded. Receipt ${res.data.receiptNo} generated.`);
    setPayOpen(false); refetch();
  }

  return (
    <div>
      <PageHeader title="Fee Management" subtitle="Record payments, generate receipts and track dues."
        action={<button className="btn btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Fee</button>} />
      <Card>
        {loading ? <Loading /> : (fees || []).length === 0 ? (
          <EmptyState icon={CreditCard} title="No fee records yet" />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Student</th><th>Title</th><th>Amount</th><th>Paid</th><th>Status</th><th>Due Date</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {fees!.map((f) => (
                  <tr key={f.id}>
                    <td className="font-semibold">{f.student.user.name}</td>
                    <td>{f.title}</td>
                    <td>{currency(f.amount)}</td>
                    <td>{currency(f.amountPaid)}</td>
                    <td><StatusBadge status={f.status} /></td>
                    <td className="text-muted">{formatDate(f.dueDate)}</td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        {f.status !== "PAID" && <button className="btn btn-primary btn-sm" onClick={() => openPay(f)}><BadgeDollarSign className="h-3.5 w-3.5" /> Pay</button>}
                        {f.receipts.length > 0 && <a href={`/receipt/${f.receipts[f.receipts.length - 1].id}`} target="_blank" className="btn btn-ghost btn-sm"><Receipt className="h-3.5 w-3.5" /> Receipt</a>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Fee Record" size="sm"
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={addFee} disabled={saving}>Save</button></>}>
        <div className="space-y-4">
          <Field label="Student *">
            <select className="select" value={form.studentId || ""} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
              <option value="">Select student</option>
              {(students || []).map((s) => <option key={s.id} value={s.id}>{s.user.name} ({s.studentCode})</option>)}
            </select>
          </Field>
          <Field label="Title *"><input className="input" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Tuition Fee - May" /></Field>
          <Field label="Amount *"><input type="number" className="input" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Field>
          <Field label="Due Date *"><input type="date" className="input" value={form.dueDate || ""} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.notify} onChange={(e) => setForm({ ...form, notify: e.target.checked })} /> Email fee due reminder to parent</label>
        </div>
      </Modal>

      <Modal open={payOpen} onClose={() => setPayOpen(false)} title="Record Payment" size="sm"
        footer={<><button className="btn btn-ghost" onClick={() => setPayOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={pay} disabled={saving}>Record & Generate Receipt</button></>}>
        {payFee && (
          <div className="space-y-4">
            <p className="text-sm text-muted">Balance: <b>{currency(payFee.amount - payFee.amountPaid)}</b> for {payFee.title}</p>
            <Field label="Amount"><input type="number" className="input" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} /></Field>
            <Field label="Method">
              <select className="select" value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                <option>Cash</option><option>Card</option><option>UPI</option><option>Bank Transfer</option>
              </select>
            </Field>
          </div>
        )}
      </Modal>
    </div>
  );
}
