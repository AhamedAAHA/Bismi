import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";

export async function GET() {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);

  const tests = await prisma.test.findMany({
    where: {
      published: true,
      OR: student.classId ? [{ classId: student.classId }, { classId: null }] : undefined,
    },
    include: {
      subject: true,
      _count: { select: { questions: true } },
      attempts: { where: { studentId: student.id } },
    },
    orderBy: { startTime: "desc" },
  });

  const data = tests.map((t) => {
    const attempt = t.attempts[0];
    let state: "ACTIVE" | "DONE" = "ACTIVE";
    if (attempt?.submitted) state = "DONE";
    return {
      id: t.id,
      title: t.title,
      description: t.description,
      subject: t.subject?.name,
      durationMin: t.durationMin,
      totalMarks: t.totalMarks,
      questionCount: t._count.questions,
      startTime: t.startTime,
      endTime: t.endTime,
      state,
      score: attempt?.submitted ? attempt.score : null,
      attemptTotal: attempt?.submitted ? attempt.total : null,
    };
  });
  return ok(data);
}
