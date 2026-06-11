import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";

export async function GET() {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);
  const results = await prisma.result.findMany({
    where: { studentId: student.id },
    orderBy: { date: "desc" },
  });

  // subject-wise averages
  const bySubject: Record<string, { sum: number; count: number }> = {};
  results.forEach((r) => {
    const key = r.subject || "Other";
    if (!bySubject[key]) bySubject[key] = { sum: 0, count: 0 };
    bySubject[key].sum += (r.score / r.total) * 100;
    bySubject[key].count++;
  });
  const subjects = Object.entries(bySubject).map(([subject, v]) => ({
    subject,
    avg: Math.round(v.sum / v.count),
  }));

  const trend = [...results]
    .reverse()
    .map((r) => ({ name: r.title.slice(0, 12), pct: Math.round((r.score / r.total) * 100) }));

  return ok({ results, subjects, trend, studentName: student.user.name });
}
