"use client";

import Link from "next/link";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { formatDate, pct } from "@/lib/utils";
import { ListChecks, Image as ImageIcon } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export default function StudentResults() {
  const { data, loading, error } = useFetch<any>("/api/student/results");
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;

  return (
    <div>
      <PageHeader title="My Results" subtitle="Test results, subject performance and history."
        action={<Link href="/student/result-frame" className="btn btn-primary"><ImageIcon className="h-4 w-4" /> Result Card</Link>} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Subject-wise Average" />
          {data.subjects.length === 0 ? <EmptyState title="No data" /> : (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.subjects}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,140,200,0.15)" />
                  <XAxis dataKey="subject" stroke="#94a3c4" fontSize={11} />
                  <YAxis stroke="#94a3c4" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", background: "rgba(20,28,54,0.92)", color: "#fff" }} />
                  <Bar dataKey="avg" fill="#3563ff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
        <Card>
          <SectionTitle title="Improvement Trend" />
          {data.trend.length === 0 ? <EmptyState title="No data" /> : (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,140,200,0.15)" />
                  <XAxis dataKey="name" stroke="#94a3c4" fontSize={10} />
                  <YAxis stroke="#94a3c4" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", background: "rgba(20,28,54,0.92)", color: "#fff" }} />
                  <Bar dataKey="pct" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-4">
        <SectionTitle title="All Results" />
        {data.results.length === 0 ? <EmptyState icon={ListChecks} title="No results yet" /> : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Title</th><th>Subject</th><th>Score</th><th>%</th><th>Type</th><th>Date</th></tr></thead>
              <tbody>
                {data.results.map((r: any) => (
                  <tr key={r.id}>
                    <td className="font-semibold">{r.title}</td>
                    <td className="text-muted">{r.subject || "-"}</td>
                    <td>{r.score}/{r.total}</td>
                    <td><span className={`badge ${pct(r.score, r.total) >= 40 ? "badge-green" : "badge-red"}`}>{pct(r.score, r.total)}%</span></td>
                    <td><span className="badge badge-blue">{r.type}</span></td>
                    <td className="text-muted">{formatDate(r.date)}</td>
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
