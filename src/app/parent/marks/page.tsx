"use client";

import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { formatDate, pct } from "@/lib/utils";
import { ListChecks } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function ParentMarks() {
  const { data, loading, error } = useFetch<any>("/api/parent/data?type=marks");
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;

  return (
    <div>
      <PageHeader title="Marks & Progress" subtitle="All linked students grouped class by class." />

      <div className="space-y-4">
        {data.classGroups.map((group: any) => (
          <section key={group.className} className="space-y-3">
            <h2 className="text-sm font-bold uppercase text-muted">{group.className}</h2>
            {group.children.map((child: any) => (
              <Card key={child.id}>
                <SectionTitle title={child.name} subtitle={`${child.code} - ${child.className}`} />
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-sm font-bold">Subject Average</h3>
                    {child.subjects.length === 0 ? <EmptyState title="No data" /> : (
                      <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={child.subjects}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,140,200,0.15)" />
                            <XAxis dataKey="subject" stroke="#94a3c4" fontSize={11} />
                            <YAxis stroke="#94a3c4" fontSize={12} domain={[0, 100]} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", background: "rgba(20,28,54,0.92)", color: "#fff" }} />
                            <Bar dataKey="avg" fill="#3563ff" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-bold">Trend</h3>
                    {child.trend.length === 0 ? <EmptyState title="No data" /> : (
                      <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={child.trend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,140,200,0.15)" />
                            <XAxis dataKey="name" stroke="#94a3c4" fontSize={10} />
                            <YAxis stroke="#94a3c4" fontSize={12} domain={[0, 100]} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", background: "rgba(20,28,54,0.92)", color: "#fff" }} />
                            <Bar dataKey="pct" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  {child.results.length === 0 ? <EmptyState icon={ListChecks} title="No results yet" /> : (
                    <div className="table-wrap">
                      <table className="data">
                        <thead><tr><th>Title</th><th>Subject</th><th>Score</th><th>%</th><th>Date</th></tr></thead>
                        <tbody>
                          {child.results.map((r: any) => (
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
                </div>
              </Card>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
