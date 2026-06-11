"use client";

import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import {
  Users,
  UserCog,
  School,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  PlaneTakeoff,
  Mail,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const { data, loading, error } = useFetch<any>("/api/admin/stats");

  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load dashboard"} />;

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of your tuition center at a glance."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Students" value={data.students} icon={Users} tone="blue" />
        <StatCard label="Parents" value={data.parents} icon={UserCog} tone="violet" />
        <StatCard label="Classes" value={data.classes} icon={School} tone="cyan" />
        <StatCard label="Tests" value={data.tests} icon={FileText} tone="amber" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="Attendance — Last 7 Days" subtitle="Present + late students per day" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend}>
                <defs>
                  <linearGradient id="att" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3563ff" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#3563ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,140,200,0.15)" />
                <XAxis dataKey="day" stroke="#94a3c4" fontSize={12} />
                <YAxis stroke="#94a3c4" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", background: "rgba(20,28,54,0.92)", color: "#fff" }}
                />
                <Area type="monotone" dataKey="present" stroke="#3563ff" strokeWidth={2.5} fill="url(#att)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionTitle title="Today's Attendance" />
            <div className="space-y-3">
              <Row icon={CheckCircle2} tone="text-emerald-500" label="Present" value={data.today.present} />
              <Row icon={Clock} tone="text-amber-500" label="Late" value={data.today.late} />
              <Row icon={XCircle} tone="text-rose-500" label="Absent" value={data.today.absent} />
            </div>
          </Card>
          <StatCard label="Leave Req." value={data.pendingLeave} icon={PlaneTakeoff} tone="amber" />
        </div>
      </div>

      <Card className="mt-4">
        <SectionTitle title="Recent Email Notifications" subtitle="Latest parent communications" />
        {data.recentEmails.length === 0 ? (
          <EmptyState icon={Mail} title="No emails sent yet" />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>To</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Sent</th>
                </tr>
              </thead>
              <tbody>
                {data.recentEmails.map((e: any) => (
                  <tr key={e.id}>
                    <td>{e.toEmail}</td>
                    <td>{e.subject}</td>
                    <td><span className="badge badge-blue">{e.category}</span></td>
                    <td><StatusBadge status={e.status} /></td>
                    <td className="text-muted">{formatDateTime(e.createdAt)}</td>
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

function Row({ icon: Icon, tone, label, value }: any) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <Icon className={`h-5 w-5 ${tone}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );
}
