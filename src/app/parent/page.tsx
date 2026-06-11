"use client";

import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { ClipboardCheck, BarChart3, BookOpen, Megaphone, LogIn, LogOut } from "lucide-react";

export default function ParentDashboard() {
  const { data, loading, error } = useFetch<any>("/api/parent/overview");
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;

  return (
    <div>
      <PageHeader title={`Hello, ${data.parentName.split(" ")[0]}!`} subtitle="Track every linked student class by class from one parent login." />

      {data.children.length === 0 ? (
        <Card><EmptyState title="No children linked" message="Contact the admin to link your child's account." /></Card>
      ) : (
        <div className="space-y-4">
          {data.classGroups.map((group: any) => (
            <section key={group.className} className="space-y-3">
              <h2 className="text-sm font-bold uppercase text-muted">{group.className}</h2>
              {group.children.map((c: any) => (
                <Card key={c.id}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold">{c.name}</h3>
                      <p className="text-sm text-muted">{c.code} - {c.className}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted">Today:</span>
                      <StatusBadge status={c.todayStatus === "Not marked" ? "PENDING" : c.todayStatus} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-3">
                    <Mini icon={ClipboardCheck} tone="text-emerald-500" label="Attendance" value={`${c.attendancePct}%`} />
                    <Mini icon={BarChart3} tone="text-brand-500" label="Avg Marks" value={`${c.avgMarks}%`} />
                    <Mini icon={BookOpen} tone="text-violet-500" label="Pending HW" value={c.pendingHw} />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted">
                    <span className="flex items-center gap-1"><LogIn className="h-4 w-4 text-emerald-500" /> Check-in: <b className="text-[var(--text)]">{c.checkIn || "-"}</b></span>
                    <span className="flex items-center gap-1"><LogOut className="h-4 w-4 text-rose-500" /> Check-out: <b className="text-[var(--text)]">{c.checkOut || "-"}</b></span>
                  </div>
                </Card>
              ))}
            </section>
          ))}
        </div>
      )}

      <Card className="mt-4">
        <SectionTitle title="Announcements" />
        {data.announcements.length === 0 ? <EmptyState icon={Megaphone} title="No announcements" /> : (
          <div className="space-y-2">
            {data.announcements.map((a: any) => (
              <div key={a.id} className="flex gap-3 rounded-xl border border-[var(--border)] p-3">
                <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                <div>
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="text-xs text-muted">{a.body}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{formatDate(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Mini({ icon: Icon, tone, label, value }: any) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-2.5 sm:p-3">
      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${tone}`} />
      <p className="mt-1 text-[10px] text-muted sm:text-xs">{label}</p>
      <p className="text-base font-bold sm:text-lg">{value}</p>
    </div>
  );
}
