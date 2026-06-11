"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import ChildSelector from "@/components/ChildSelector";
import { formatDate, pct } from "@/lib/utils";
import { ListChecks } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function ParentMarks() {
  const [childId, setChildId] = useState("");
  const { data, loading, error } = useFetch<any>(`/api/parent/data?type=marks${childId ? `&childId=${childId}` : ""}`);
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;

  return (
    <div>
      <PageHeader title="Marks & Progress" subtitle="Subject-wise performance and improvement trends."
        action={<ChildSelector children={data.children} value={childId || data.childId} onChange={setChildId} />} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Subject Average" />
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
          <SectionTitle title="Trend" />
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
              <thead><tr><th>Title</th><th>Subject</th><th>Score</th><th>%</th><th>Date</th></tr></thead>
              <tbody>
                {data.results.map((r: any) => (
                  <tr key={r.id}>
                    <td className="font-semibold">{r.title}</td>
                    <td className="text-muted">{r.subject || "-"}</td>
                    <td>{r.score}/{r.total}</td>
                    <td><span className={`badge ${pct(r.score, r.total) >= 40 ? "badge-green" : "badge-red"}`}>{pct(r.score, r.total)}%</span></td>
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
