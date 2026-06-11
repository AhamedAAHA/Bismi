import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";
import { pct } from "@/lib/utils";

export async function GET() {
  const me = await currentStudent();
  if (!me) return fail("Not authenticated", 401);

  const students = await prisma.student.findMany({
    include: {
      user: true,
      results: true,
      attendance: true,
      homeworkSubs: true,
    },
  });

  const board = students.map((s) => {
    const avgMarks =
      s.results.length > 0
        ? Math.round(s.results.reduce((a, r) => a + (r.score / r.total) * 100, 0) / s.results.length)
        : 0;
    const attTotal = s.attendance.length;
    const attPresent = s.attendance.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
    const attendance = pct(attPresent, attTotal);
    const hwCount = s.homeworkSubs.length;
    const stars = Math.round(avgMarks * 0.5 + attendance * 0.3 + Math.min(hwCount * 5, 20));
    return {
      studentId: s.id,
      name: s.user.name,
      code: s.studentCode,
      avgMarks,
      attendance,
      homework: hwCount,
      stars,
      isMe: s.id === me.id,
    };
  });

  board.sort((a, b) => b.stars - a.stars);
  board.forEach((b, i) => ((b as any).rank = i + 1));

  return ok(board);
}
