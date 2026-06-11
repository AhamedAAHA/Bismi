import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";
import { pct, todayStr } from "@/lib/utils";

export async function GET() {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);

  const [attendance, results, homework, submissions, dueFees, announcements] =
    await Promise.all([
      prisma.attendance.findMany({ where: { studentId: student.id } }),
      prisma.result.findMany({ where: { studentId: student.id }, orderBy: { date: "asc" } }),
      prisma.homework.findMany({
        where: student.classId ? { OR: [{ classId: student.classId }, { classId: null }] } : {},
      }),
      prisma.homeworkSubmission.findMany({ where: { studentId: student.id } }),
      prisma.fee.findMany({ where: { studentId: student.id, status: { not: "PAID" } } }),
      prisma.announcement.findMany({
        where: { OR: [{ audience: "ALL" }, { audience: "STUDENT" }] },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const total = attendance.length;
  const present = attendance.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
  const attendancePct = pct(present, total);
  const todayRec = attendance.find((a) => a.date === todayStr());

  const avgScore =
    results.length > 0
      ? Math.round(
          results.reduce((s, r) => s + (r.score / r.total) * 100, 0) / results.length
        )
      : 0;

  const submittedIds = new Set(submissions.map((s) => s.homeworkId));
  const pendingHw = homework.filter((h) => !submittedIds.has(h.id)).length;

  const dueAmount = dueFees.reduce((s, f) => s + (f.amount - f.amountPaid), 0);

  // rank by avg score
  const allResults = await prisma.result.groupBy({
    by: ["studentId"],
    _avg: { score: true },
  });
  const ranking = allResults
    .map((r) => ({ studentId: r.studentId, avg: r._avg.score || 0 }))
    .sort((a, b) => b.avg - a.avg);
  const rank = ranking.findIndex((r) => r.studentId === student.id) + 1;

  return ok({
    name: student.user.name,
    studentCode: student.studentCode,
    className: student.class?.name || "-",
    attendancePct,
    avgScore,
    pendingHw,
    dueAmount,
    rank: rank || "-",
    totalStudents: ranking.length,
    todayStatus: todayRec?.status || "Not marked",
    results: results.slice(-8),
    announcements,
  });
}
