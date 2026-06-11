import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";

// GET test questions for taking (without correct answers)
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);

  const test = await prisma.test.findUnique({
    where: { id: params.id },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!test || !test.published) return fail("Test not found.", 404);

  if (test.classId && student.classId && test.classId !== student.classId) {
    return fail("This test is not assigned to your class.");
  }

  const existing = await prisma.testAttempt.findUnique({
    where: { testId_studentId: { testId: test.id, studentId: student.id } },
  });
  if (existing?.submitted) return fail("You have already completed this test.");

  if (!existing) {
    await prisma.testAttempt.create({
      data: {
        testId: test.id,
        studentId: student.id,
        total: test.totalMarks,
      },
    });
  }

  return ok({
    id: test.id,
    title: test.title,
    description: test.description,
    durationMin: test.durationMin,
    totalMarks: test.totalMarks,
    questions: test.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options) as string[],
      marks: q.marks,
    })),
  });
}
