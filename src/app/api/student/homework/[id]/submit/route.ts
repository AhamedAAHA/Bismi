import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);
  const b = await req.json();
  if (!b.fileUrl) return fail("Please upload a file (PDF or image).");

  const hw = await prisma.homework.findUnique({ where: { id: params.id } });
  if (!hw) return fail("Homework not found.", 404);

  const late = new Date(hw.deadline) < new Date();

  const sub = await prisma.homeworkSubmission.upsert({
    where: { homeworkId_studentId: { homeworkId: params.id, studentId: student.id } },
    update: { fileUrl: b.fileUrl, note: b.note || null, status: late ? "LATE" : "SUBMITTED", submittedAt: new Date() },
    create: {
      homeworkId: params.id,
      studentId: student.id,
      fileUrl: b.fileUrl,
      note: b.note || null,
      status: late ? "LATE" : "SUBMITTED",
    },
  });
  return ok(sub);
}
