"use client";

import Link from "next/link";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { formatDate } from "@/lib/utils";
import {
  ClipboardCheck,
  Trophy,
  BookOpen,
  Megaphone,
  Brain,
  FileText,
  QrCode,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function StudentDashboard() {
  const { data, loading, error } = useFetch<any>("/api/student/overview");
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;

  const chart = data.results.map((r: any) => ({ name: r.title.slice(0, 10), pct: Math.round((r.score / r.total) * 100) }));

  return (
    <div>
      <PageHeader title={`Welcome, ${data.name.split(" ")[0]}! 👋`} subtitle={`${data.studentCode} • ${data.className} • Today: ${data.todayStatus}`} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Attendance" value={`${data.attendancePct}%`} icon={ClipboardCheck} tone="green" />
        <StatCard label="Avg Score" value={`${data.avgScore}%`} icon={Trophy} tone="amber" />
        <StatCard label="Pending HW" value={data.pendingHw} icon={BookOpen} tone="violet" />
        <StatCard label="Rank" value={`#${data.rank}`} icon={Trophy} tone="blue" hint={`of ${data.totalStudents}`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="Performance Trend" subtitle="Your recent test scores" />
          {chart.length === 0 ? <EmptyState icon={FileText} title="No results yet" /> : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,140,200,0.15)" />
                  <XAxis dataKey="name" stroke="#94a3c4" fontSize={11} />
                  <YAxis stroke="#94a3c4" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", background: "rgba(20,28,54,0.92)", color: "#fff" }} />
                  <Line type="monotone" dataKey="pct" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionTitle title="Quick Actions" />
            <div className="grid grid-cols-2 gap-2">
              <Quick href="/student/tests" icon={FileText} label="Take Test" />
              <Quick href="/student/assistant" icon={Brain} label="AI Help" />
              <Quick href="/student/attendance" icon={QrCode} label="Check-in" />
              <Quick href="/student/leaderboard" icon={Trophy} label="Ranking" />
            </div>
          </Card>
        </div>
      </div>

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

function Quick({ href, icon: Icon, label }: any) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--border)] p-3 text-center transition hover:border-brand-500 hover:text-brand-500">
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
