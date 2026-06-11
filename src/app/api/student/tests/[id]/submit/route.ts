import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";
import { todayStr, pct } from "@/lib/utils";
import { notifyLowMarks } from "@/lib/notify";

// Auto-grade and store result
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);

  const b = await req.json();
  const answers: Record<string, number> = b.answers || {};

  const test = await prisma.test.findUnique({
    where: { id: params.id },
    include: { questions: true, subject: true },
  });
  if (!test) return fail("Test not found.", 404);

  const attempt = await prisma.testAttempt.findUnique({
    where: { testId_studentId: { testId: test.id, studentId: student.id } },
  });
  if (attempt?.submitted) return fail("Already submitted.");

  let score = 0;
  const total = test.questions.reduce((s, q) => s + q.marks, 0);
  const review = test.questions.map((q) => {
    const selected = answers[q.id];
    const correct = selected === q.correct;
    if (correct) score += q.marks;
    return {
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options) as string[],
      selected: selected ?? null,
      correct: q.correct,
      isCorrect: correct,
    };
  });

  await prisma.testAttempt.update({
    where: { testId_studentId: { testId: test.id, studentId: student.id } },
    data: {
      answers: JSON.stringify(answers),
      score,
      total,
      submitted: true,
      submittedAt: new Date(),
    },
  });

  await prisma.result.create({
    data: {
      studentId: student.id,
      testId: test.id,
      title: test.title,
      subject: test.subject?.name || null,
      score,
      total,
      type: "TEST",
      date: todayStr(),
    },
  });

  if (pct(score, total) < 40) {
    notifyLowMarks(student.id, test.title, score, total).catch(() => {});
  }

  return ok({
    score,
    total,
    percentage: pct(score, total),
    title: test.title,
    studentName: student.user.name,
    review,
  });
}
