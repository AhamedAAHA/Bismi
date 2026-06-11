"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/lib/useFetch";
import { apiPost } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { toast } from "@/components/ui/Toast";
import { FileText, KeyRound, CheckCircle2, Play } from "lucide-react";
import ModuleAccent from "@/components/3d/ModuleAccent";

export default function StudentTests() {
  const router = useRouter();
  const { data: tests, loading, error } = useFetch<any[]>("/api/student/tests");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function enter(testCode?: string) {
    const c = testCode || code;
    if (!c.trim()) return toast.error("Enter a test access code.");
    setBusy(true);
    const res = await apiPost("/api/student/tests/verify", { code: c });
    setBusy(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success(`Starting: ${res.data.title}`);
    router.push(`/student/tests/${res.data.testId}`);
  }

  return (
    <div>
      <PageHeader title="Online Tests" subtitle="Enter a test access code to begin, or pick an available test." />
      <ModuleAccent variant="test" height={160} />

      <Card className="mb-4">
        <SectionTitle title="Enter Test Access Code" subtitle="e.g. MATH2026" />
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input className="input pl-9 uppercase" placeholder="ACCESS CODE" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
          </div>
          <button className="btn btn-primary" onClick={() => enter()} disabled={busy}><Play className="h-4 w-4" /> {busy ? "Checking..." : "Start Test"}</button>
        </div>
      </Card>

      {loading ? <Loading /> : error ? <ErrorState message={error} /> : (tests || []).length === 0 ? (
        <Card><EmptyState icon={FileText} title="No tests available" /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tests!.map((t) => (
            <Card key={t.id}>
              <div className="mb-2 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500"><FileText className="h-5 w-5" /></div>
                {t.state === "ACTIVE" && <span className="badge badge-green">Active</span>}
                {t.state === "DONE" && <span className="badge badge-blue">Completed</span>}
              </div>
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm text-muted">{t.subject || "General"} • {t.questionCount} Qs • {t.durationMin} min</p>
              <p className="mt-1 text-xs text-muted">Open enrollment - start whenever you are ready.</p>

              {t.state === "DONE" ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Score: {t.score}/{t.attemptTotal}
                </div>
              ) : t.state === "ACTIVE" ? (
                <button className="btn btn-primary mt-3 w-full" onClick={() => router.push(`/student/tests/${t.id}`)}><Play className="h-4 w-4" /> Start Test</button>
              ) : (
                null
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
