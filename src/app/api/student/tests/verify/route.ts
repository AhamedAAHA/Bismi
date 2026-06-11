import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";

// Student enters a test access code -> validate and return testId
export async function POST(req: NextRequest) {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);
  const b = await req.json();
  const code = String(b.code || "").trim().toUpperCase();
  if (!code) return fail("Please enter a test access code.");

  const test = await prisma.test.findUnique({
    where: { accessCode: code },
    include: { _count: { select: { questions: true } } },
  });
  if (!test || !test.published) return fail("Invalid test access code.");

  // class restriction
  if (test.classId && student.classId && test.classId !== student.classId) {
    return fail("This test is not assigned to your class.");
  }

  if (test._count.questions === 0) return fail("This test has no questions yet.");

  const attempt = await prisma.testAttempt.findUnique({
    where: { testId_studentId: { testId: test.id, studentId: student.id } },
  });
  if (attempt?.submitted) return fail("You have already completed this test.");

  return ok({ testId: test.id, title: test.title });
}
