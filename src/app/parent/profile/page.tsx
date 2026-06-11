"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { apiPut } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState } from "@/components/ui/States";
import Field from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { initials } from "@/lib/utils";
import { KeyRound } from "lucide-react";

export default function ParentProfile() {
  const { data, loading, error } = useFetch<any>("/api/parent/profile");
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [saving, setSaving] = useState(false);

  async function changePassword() {
    if (!cur || !next) return toast.error("Fill both password fields.");
    setSaving(true);
    const res = await apiPut("/api/parent/profile", { currentPassword: cur, newPassword: next });
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Password updated");
    setCur(""); setNext("");
  }

  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Your account details." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-2xl font-bold text-white">{initials(data.name)}</div>
          <h3 className="mt-3 text-lg font-bold">{data.name}</h3>
          <p className="text-sm text-muted">{data.parentCode}</p>
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle title="Details" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Email" value={data.email} />
            <Info label="Phone" value={data.phone} />
            <Info label="Occupation" value={data.occupation} />
            <Info label="Address" value={data.address} />
          </div>
          <h4 className="mb-2 mt-4 font-semibold">Children</h4>
          <div className="space-y-2">
            {data.children.map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                <span className="font-semibold">{c.name}</span>
                <span className="text-sm text-muted">{c.code} • {c.className || "-"}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <SectionTitle title="Change Password" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Current Password"><input type="password" className="input" value={cur} onChange={(e) => setCur(e.target.value)} /></Field>
            <Field label="New Password"><input type="password" className="input" value={next} onChange={(e) => setNext(e.target.value)} /></Field>
            <div className="flex items-end">
              <button className="btn btn-primary" onClick={changePassword} disabled={saving}><KeyRound className="h-4 w-4" /> Update Password</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-semibold">{value || "—"}</p>
    </div>
  );
}
