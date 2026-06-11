import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";

export async function GET() {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);
  const homework = await prisma.homework.findMany({
    where: student.classId ? { OR: [{ classId: student.classId }, { classId: null }] } : {},
    include: { subject: true, submissions: { where: { studentId: student.id } } },
    orderBy: { deadline: "asc" },
  });
  const data = homework.map((h) => ({
    id: h.id,
    title: h.title,
    description: h.description,
    subject: h.subject?.name,
    fileUrl: h.fileUrl,
    deadline: h.deadline,
    submission: h.submissions[0] || null,
    overdue: !h.submissions[0] && new Date(h.deadline) < new Date(),
  }));
  return ok(data);
}
