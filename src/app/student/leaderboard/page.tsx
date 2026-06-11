"use client";

import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { Trophy, Medal, Star } from "lucide-react";

export default function Leaderboard() {
  const { data, loading, error } = useFetch<any[]>("/api/student/leaderboard");
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;
  const board = data || [];
  const top3 = board.slice(0, 3);

  return (
    <div>
      <PageHeader title="Leaderboard" subtitle="Ranked by marks, attendance & homework completion." />

      {board.length === 0 ? (
        <Card><EmptyState icon={Trophy} title="No rankings yet" /></Card>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 gap-3">
            {[1, 0, 2].map((pos) => {
              const s = top3[pos];
              if (!s) return <div key={pos} />;
              const colors = ["from-amber-400 to-yellow-500", "from-slate-300 to-slate-400", "from-orange-400 to-amber-600"];
              const heights = ["", "mt-0", "mt-6"];
              return (
                <Card key={pos} className={`text-center ${pos === 0 ? "ring-2 ring-amber-400" : ""} ${heights[pos]}`}>
                  <div className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${colors[pos]} text-white shadow-glow`}>
                    {pos === 0 ? <Trophy className="h-7 w-7" /> : <Medal className="h-6 w-6" />}
                  </div>
                  <p className="font-bold">{s.name}</p>
                  <p className="text-xs text-muted">#{s.rank} • {s.stars} ⭐</p>
                  <p className="mt-1 text-sm font-semibold text-brand-500">{s.avgMarks}% avg</p>
                </Card>
              );
            })}
          </div>

          <Card>
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Rank</th><th>Student</th><th>Avg Marks</th><th>Attendance</th><th>Homework</th><th>Stars</th></tr></thead>
                <tbody>
                  {board.map((s) => (
                    <tr key={s.studentId} className={s.isMe ? "bg-brand-500/10" : ""}>
                      <td className="font-bold">#{s.rank}</td>
                      <td className="font-semibold">{s.name} {s.isMe && <span className="badge badge-blue ml-1">You</span>}</td>
                      <td>{s.avgMarks}%</td>
                      <td>{s.attendance}%</td>
                      <td>{s.homework}</td>
                      <td><span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-400" /> {s.stars}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
